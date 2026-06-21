import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  History, 
  Home, 
  Receipt, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard,
  LogIn,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';

interface BookingRecord {
  id: string;
  serviceType: string;
  name: string;
  email: string;
  address: string;
  sqft: string;
  bookingDate: string;
  arrivalWindow: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: any;
}

export const Booking: React.FC = () => {
  const { user, login } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('Deep Sanctuary');
  const [selectedTimeWindow, setSelectedTimeWindow] = useState('10:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form input states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    sqft: '1,000 - 2,500 sq ft'
  });
  const [bookingDate, setBookingDate] = useState('');

  // User bookings history
  const [userBookings, setUserBookings] = useState<BookingRecord[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Pre-fill user data when signed in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Real-time listener for current user's bookings
  useEffect(() => {
    if (!user) {
      setUserBookings([]);
      return;
    }

    setLoadingBookings(true);
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef, 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsList: BookingRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        bookingsList.push({
          id: docSnap.id,
          serviceType: data.serviceType || 'Standard Refresh',
          name: data.name || '',
          email: data.email || '',
          address: data.address || '',
          sqft: data.sqft || '1,000 - 2,500 sq ft',
          bookingDate: data.bookingDate || '',
          arrivalWindow: data.arrivalWindow || '10:00 AM',
          amount: data.amount || 129,
          status: data.status || 'pending',
          createdAt: data.createdAt
        });
      });
      setUserBookings(bookingsList);
      setLoadingBookings(false);
    }, (error) => {
      console.error("Error loading real-time bookings:", error);
      setLoadingBookings(false);
    });

    return () => unsubscribe();
  }, [user]);

  const services = [
    { id: 'Deep Sanctuary', price: 199, icon: Sparkles, desc: 'A comprehensive top-to-bottom restoration. Ideal for new homes or seasonal refreshes.', recommended: true },
    { id: 'Essential Polish', price: 129, icon: History, desc: 'Our signature maintenance service. Keeps your sanctuary consistently pristine and peaceful.', recommended: false },
    { id: 'Post-Event Restore', price: 159, icon: Sparkles, desc: 'Swift restoration after gatherings. We handle the aftermath while you savor the memories.', recommended: false },
    { id: 'Moving Transition', price: 249, icon: Home, desc: 'The ultimate fresh start. Every corner, cabinet, and baseboard meticulously scrubbed.', recommended: false }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step === 2) {
      // Basic validations
      if (!formData.name.trim() || !formData.email.trim() || !formData.address.trim()) {
        setErrorMessage("Please complete all required fields (Name, Email, and Address).");
        return;
      }
    }
    setErrorMessage(null);
    setStep(s => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setErrorMessage(null);
    setStep(s => Math.max(s - 1, 1));
  };

  const handleBookSanctuary = async () => {
    if (!user) {
      setErrorMessage("You must be signed in to finalize booking.");
      return;
    }

    if (!bookingDate) {
      setErrorMessage("Please pick an arrival date for your cleaning.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const price = services.find(s => s.id === selectedService)?.price || 129;

    const bookingPayload = {
      userId: user.uid,
      serviceType: selectedService,
      name: formData.name,
      email: formData.email,
      address: formData.address,
      sqft: formData.sqft,
      bookingDate: bookingDate,
      arrivalWindow: selectedTimeWindow,
      amount: price,
      createdAt: serverTimestamp(),
      status: 'pending' as const
    };

    const path = 'bookings';
    try {
      const docRef = await addDoc(collection(db, path), bookingPayload);
      setBookingSuccess(docRef.id);
      // Reset State
      setStep(1);
      setBookingDate('');
    } catch (err) {
      setIsSubmitting(false);
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const path = `bookings/${bookingId}`;
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'cancelled' as const
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const currentService = services.find(s => s.id === selectedService);

  const renderStep = () => {
    if (bookingSuccess) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[2.5rem] border border-outline-variant/10 text-center space-y-8 max-w-2xl mx-auto shadow-2xl"
        >
          <div className="w-24 h-24 bg-secondary-fixed text-primary rounded-full flex items-center justify-center mx-auto shadow-xl shadow-secondary/15 animate-pulse">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl font-extrabold text-primary">Sanctuary Booked!</h2>
            <p className="text-on-surface-variant font-medium text-lg leading-relaxed">
              Your appointment has been registered successfully. Our hospitality-grade professionals will arrive on <span className="text-secondary font-bold">{bookingDate || 'your scheduled date'}</span> during the <span className="text-secondary font-bold">{selectedTimeWindow}</span> window.
            </p>
            <p className="text-xs text-outline-variant/80 font-mono">Reference ID: {bookingSuccess}</p>
          </div>
          <div className="pt-6">
            <button 
              onClick={() => {
                setBookingSuccess(null);
                setStep(1);
              }}
              className="px-10 py-4 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Book Another Visit
            </button>
          </div>
        </motion.div>
      );
    }

    switch (step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="text-center lg:text-left space-y-4">
              <h1 className="text-4xl lg:text-7xl font-extrabold text-primary leading-tight">Choose Your Service</h1>
              <p className="text-xl text-on-surface-variant max-w-xl font-medium">Select the level of sanctuary you wish to reclaim today. Every service is tailored to your space's unique rhythm.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((s) => (
                <button 
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  type="button"
                  className={`group relative p-8 rounded-2xl text-left transition-all duration-300 border ${
                    selectedService === s.id 
                      ? 'bg-white ring-4 ring-primary border-transparent shadow-xl' 
                      : 'bg-surface-container-low border-transparent hover:bg-white hover:border-outline-variant/30'
                  }`}
                >
                  {s.recommended && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-secondary to-secondary-container text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20">
                      Recommended
                    </div>
                  )}
                  <div className={`mb-8 w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${selectedService === s.id ? 'bg-secondary text-white' : 'bg-white text-on-surface-variant shadow-sm'}`}>
                    <s.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-primary mb-3">{s.id}</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed mb-10 text-sm">{s.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-3xl font-black text-primary">from ${s.price}</span>
                    <ArrowRight className={`w-6 h-6 transition-transform group-hover:translate-x-2 ${selectedService === s.id ? 'text-primary' : 'text-outline-variant'}`} />
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <button 
                onClick={nextStep}
                className="px-12 py-5 bg-primary text-white rounded-md font-bold text-xl flex items-center gap-4 hover:scale-105 transition-transform shadow-2xl shadow-primary/20"
              >
                Continue to Details
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="text-center lg:text-left space-y-4">
              <h1 className="text-4xl lg:text-7xl font-extrabold text-primary leading-tight">The Details</h1>
              <p className="text-xl text-on-surface-variant max-w-xl font-medium">Help us understand the landscape of your sanctuary.</p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 font-medium">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="bg-white p-10 rounded-3xl border border-outline-variant/10 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Your Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full bg-surface-container-low border-none rounded-xl p-5 focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full bg-surface-container-low border-none rounded-xl p-5 focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Service Address</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Rittenhouse Square, Philadelphia"
                    className="w-full bg-surface-container-low border-none rounded-xl p-5 pl-14 focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Approximate Square Footage</label>
                <select 
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border-none rounded-xl p-5 focus:ring-2 focus:ring-secondary/30 transition-all font-bold appearance-none cursor-pointer"
                >
                  <option value="Under 1,000 sq ft">Under 1,000 sq ft</option>
                  <option value="1,000 - 2,500 sq ft">1,000 - 2,500 sq ft</option>
                  <option value="2,500 - 4,000 sq ft">2,500 - 4,000 sq ft</option>
                  <option value="Over 4,000 sq ft">Over 4,000 sq ft</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={prevStep}
                className="text-primary font-bold text-lg hover:underline"
              >
                Back
              </button>
              <button 
                onClick={nextStep}
                className="px-12 py-5 bg-primary text-white rounded-md font-bold text-xl flex items-center gap-4 hover:scale-105 transition-transform shadow-2xl shadow-primary/20"
              >
                Final Step
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="text-center lg:text-left space-y-4">
              <h1 className="text-4xl lg:text-7xl font-extrabold text-primary leading-tight">Scheduling</h1>
              <p className="text-xl text-on-surface-variant max-w-xl font-medium">When should we arrive to restore your peace?</p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 font-medium">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{errorMessage}</p>
              </div>
            )}

            {!user ? (
              <div className="bg-secondary-container/20 border border-secondary/20 p-8 rounded-3xl text-center space-y-6">
                <LogIn className="w-12 h-12 text-secondary mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-primary">Identity Verification Required</h3>
                  <p className="text-on-surface-variant max-w-md mx-auto text-sm font-medium">
                    To maintain the security of continuous sanctuary logistics, please sign in with your Google account to confirm identity.
                  </p>
                </div>
                <button 
                  onClick={() => login()}
                  className="px-8 py-4 bg-secondary text-white rounded-xl font-bold hover:scale-105 transition-transform inline-flex items-center gap-3 shadow-md"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In with Google
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-3xl border border-outline-variant/10 shadow-sm space-y-6 flex flex-col items-center">
                    <Calendar className="w-12 h-12 text-secondary mb-4" />
                    <h3 className="text-2xl font-bold text-primary">Pick a Date</h3>
                    <input 
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-xl p-5 font-bold focus:ring-2 focus:ring-secondary/30 cursor-pointer"
                      required
                    />
                  </div>
                  <div className="bg-white p-10 rounded-3xl border border-outline-variant/10 shadow-sm space-y-6 flex flex-col items-center">
                    <Clock className="w-12 h-12 text-secondary mb-4" />
                    <h3 className="text-2xl font-bold text-primary">Arrival Window</h3>
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM'].map(t => (
                        <button 
                          key={t}
                          onClick={() => setSelectedTimeWindow(t)}
                          type="button"
                          className={`py-4 rounded-xl font-bold transition-all ${
                            selectedTimeWindow === t 
                              ? 'bg-secondary text-white shadow-md' 
                              : 'bg-surface-container-low hover:bg-surface-container text-primary'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container p-10 rounded-3xl space-y-8">
                  <div className="flex items-center gap-4 mb-4">
                    <CreditCard className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold text-primary">Payment Information</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium -mt-4">Payment details are verified and securely processed at confirmation via SSL encryption. No instant charge occurs.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input placeholder="Card Number" className="w-full bg-white border-none rounded-xl p-5 shadow-sm font-mono" />
                    <div className="flex gap-4">
                      <input placeholder="MM/YY" className="w-1/2 bg-white border-none rounded-xl p-5 shadow-sm font-mono" />
                      <input placeholder="CVC" className="w-1/2 bg-white border-none rounded-xl p-5 shadow-sm font-mono" />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-6">
              <button 
                onClick={prevStep}
                className="text-primary font-bold text-lg hover:underline"
              >
                Back
              </button>
              {user && (
                <button 
                  onClick={handleBookSanctuary}
                  disabled={isSubmitting}
                  className="px-12 py-5 bg-secondary text-white rounded-md font-bold text-xl flex items-center gap-4 hover:scale-105 transition-transform shadow-2xl shadow-secondary/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering Booking...' : 'Complete Booking'}
                  <ShieldCheck className="w-6 h-6" />
                </button>
              )}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
        <div className="flex-1 space-y-16">
          {/* Progress Stepper */}
          <div className="flex items-center justify-between max-w-2xl">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500 shadow-lg ${
                    step >= s ? 'bg-primary text-white scale-110 shadow-primary/20' : 'bg-surface-container-highest text-outline-variant'
                  }`}>
                    {s}
                  </div>
                  <span className={`text-[10px] uppercase font-black tracking-widest ${step >= s ? 'text-primary' : 'text-outline-variant/50'}`}>
                    {s === 1 ? 'Service' : s === 2 ? 'Details' : 'Schedule'}
                  </span>
                </div>
                {s < 3 && (
                  <div className="flex-1 h-0.5 bg-surface-container-highest mx-6 relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: step > s ? '100%' : '0%' }}
                      className="absolute inset-0 bg-secondary"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Summary Sidebar */}
        <aside className="w-full lg:w-[450px]">
          <div className="sticky top-32 space-y-6">
            <div className="bg-white p-10 rounded-3xl border border-outline-variant/10 shadow-[0_24px_48px_-12px_rgba(0,17,58,0.05)]">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-secondary-fixed rounded-xl flex items-center justify-center text-primary">
                  <Receipt className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-primary">Booking Summary</h2>
              </div>
              
              <div className="space-y-8">
                <div className="flex justify-between items-start pb-8 border-b border-surface-container">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Service Type</p>
                    <p className="font-bold text-xl text-primary">{selectedService}</p>
                  </div>
                  {step > 1 && (
                    <button onClick={() => setStep(1)} className="text-secondary font-bold text-sm underline decoration-2 underline-offset-4">Change</button>
                  )}
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Details Defined</p>
                  <ul className="space-y-4">
                    {[
                      { label: 'Coverage Area', defined: formData.address.length > 0, val: formData.address },
                      { label: 'Square Footage', defined: true, val: formData.sqft },
                      { label: 'Estimated Date', defined: bookingDate.length > 0, val: `${bookingDate} at ${selectedTimeWindow}` }
                    ].map((item, i) => (
                      <li key={i} className={`flex items-start gap-4 transition-opacity ${item.defined ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${item.defined ? 'bg-secondary' : 'bg-outline-variant'}`} />
                        <div className="flex-1">
                          <span className="text-sm font-bold text-primary block">{item.label}</span>
                          {item.defined && <span className="text-xs font-semibold text-on-surface-variant block mt-0.5 truncate max-w-[200px]">{item.val}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-10 space-y-6 border-t border-surface-container">
                  <div className="flex justify-between font-bold text-on-surface-variant text-lg">
                    <span>Subtotal</span>
                    <span>${currentService?.price}.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-on-surface-variant text-lg">
                    <span>Tax & Fees</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary pb-2">Total Amount</span>
                    <span className="text-5xl font-black text-primary">${currentService?.price}.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-container p-8 rounded-3xl text-primary-fixed flex items-start gap-5 border border-white/10">
              <ShieldCheck className="w-10 h-10 text-secondary shrink-0" />
              <div className="space-y-2">
                <p className="font-bold text-white text-lg">Our Sanctuary Guarantee</p>
                <p className="text-sm font-medium opacity-70 leading-relaxed">
                  If you are not entirely at peace with our service, we will return within 24 hours to make it right.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Dynamic Database Visualizer Dashboard (My active bookings) */}
      {user && (
        <section className="py-20 bg-surface px-6 md:px-12 border-t border-outline-variant/10">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-primary">Your Booked Sanctuaries</h2>
                <p className="text-on-surface-variant font-medium">Real-time status updates from our integrated Firestore database.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-secondary bg-secondary/10 px-3.5 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                Live Database Sync Active
              </div>
            </div>

            {loadingBookings ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-outline-variant/10 flex flex-col items-center justify-center gap-4">
                <RefreshCw className="w-8 h-8 text-secondary animate-spin" />
                <p className="text-on-surface-variant font-medium">Querying Firestore records...</p>
              </div>
            ) : userBookings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-outline-variant/10 space-y-4">
                <p className="text-on-surface-variant text-lg font-medium">No bookings logged under your email yet.</p>
                <p className="text-sm text-outline-variant/70">Complete the 3-step form above to schedule your first premium cleaning!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userBookings.map((b) => (
                  <div key={b.id} className="bg-white p-8 rounded-3xl border border-outline-variant/10 shadow-sm space-y-6 flex flex-col justify-between relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-md">
                    {b.status === 'cancelled' && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <div className="bg-outline-variant/15 text-outline-variant font-black text-sm uppercase tracking-widest px-6 py-2.5 rounded-full border border-outline-variant/20">
                          Cancelled
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="px-3.5 py-1.5 bg-secondary-fixed text-primary rounded-full text-[10px] font-black uppercase tracking-wider">
                          {b.serviceType}
                        </span>
                        <span className={`text-[10px] uppercase font-black tracking-widest ${
                          b.status === 'pending' ? 'text-amber-600' : b.status === 'confirmed' ? 'text-green-600' : 'text-primary'
                        }`}>
                          ● {b.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-on-surface-variant text-sm font-semibold">
                          <Calendar className="w-4 h-4 text-secondary shrink-0" />
                          {b.bookingDate}
                        </div>
                        <div className="flex items-center gap-3 text-on-surface-variant text-sm font-semibold">
                          <Clock className="w-4 h-4 text-secondary shrink-0" />
                          {b.arrivalWindow}
                        </div>
                        <div className="flex items-center gap-3 text-on-surface-variant text-sm font-semibold">
                          <MapPin className="w-4 h-4 text-secondary shrink-0" />
                          <span className="truncate">{b.address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-surface-container flex items-center justify-between">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-outline-variant tracking-wider block">Price Charged</span>
                        <span className="text-xl font-extrabold text-primary">${b.amount}</span>
                      </div>
                      {b.status !== 'cancelled' && (
                        <button 
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
