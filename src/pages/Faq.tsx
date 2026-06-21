import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, DollarSign, Calendar, Sparkles, MessageSquare, Phone, X, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const Faq: React.FC = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('pricing');
  const [openItems, setOpenItems] = useState<string[]>(['p1']);
  const [searchQuery, setSearchQuery] = useState('');

  // Lead Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: 'Residential Standard',
    details: ''
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Prefill when signed in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const sections = [
    {
      id: 'pricing',
      title: 'Pricing & Payments',
      number: '01',
      icon: DollarSign,
      items: [
        { id: 'p1', q: 'How do you calculate your cleaning rates?', a: 'Our pricing is based on a blend of square footage, the number of bedrooms/bathrooms, and the current condition of the home. We provide instant online quotes so you never have to wait for a site visit.' },
        { id: 'p2', q: 'What is your cancellation policy?', a: 'We require 48 hours notice for cancellations or rescheduling. Cancellations within 24 hours may incur a service fee of 50% of the booking total.' }
      ]
    },
    {
      id: 'logistics',
      title: 'Logistics & Entry',
      number: '02',
      icon: Calendar,
      items: [
        { id: 'l1', q: 'Do I need to be home during the cleaning?', a: 'Not at all. Most of our clients provide a door code or leave a key. Our teams are fully vetted and background-checked for your peace of mind.' },
        { id: 'l2', q: 'How do you handle pets?', a: 'We love pets! However, for their safety and ours, we ask that nervous or aggressive pets be kept in a separate room during the session.' }
      ]
    },
    {
      id: 'services',
      title: 'Services & Quality',
      number: '03',
      icon: Sparkles,
      items: [
        { id: 's1', q: "What's included in a Deep Clean vs Standard Clean?", a: 'A Deep Clean includes detail-oriented tasks like baseboards, inside the oven/fridge, and scrubbing window tracks. Standard cleans focus on maintaining surfaces and general dusting.' }
      ]
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const path = 'quotes';
    const payload = {
      name: formData.name,
      email: formData.email,
      serviceType: formData.serviceType,
      details: formData.details,
      createdAt: serverTimestamp(),
      status: 'unread'
    };

    // Include userId optionally if logged in
    const finalPayload = user ? { ...payload, userId: user.uid } : payload;

    try {
      await addDoc(collection(db, path), finalPayload);
      setSubmitSuccess(true);
      // Reset form save for prefilled info
      setFormData(prev => ({
        ...prev,
        details: ''
      }));
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter sections and items based on search query
  const filteredSections = sections.map(section => {
    const filteredItems = section.items.filter(
      item => item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
              item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...section, items: filteredItems };
  }).filter(section => section.items.length > 0);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-white text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-lg shadow-secondary/20">
          <ShieldCheckIcon />
          Support Center
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-primary leading-[1] tracking-tight mb-12">
          How can we make your <br />
          <span className="text-secondary italic">space shine?</span>
        </h1>
        
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-outline-variant">
            <Search className="w-6 h-6" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for pricing, logistics, or services..."
            className="w-full pl-16 pr-8 py-7 rounded-2xl bg-white shadow-2xl shadow-primary/5 outline-none border-none ring-1 ring-outline-variant/10 focus:ring-2 focus:ring-secondary transition-all text-xl placeholder:text-outline-variant/50"
          />
        </div>
        <p className="mt-8 text-on-surface-variant font-bold text-sm">
          Common topics: <span className="text-secondary cursor-pointer hover:underline mx-2" onClick={() => setSearchQuery('Checklist')}>Checklist</span> • <span className="text-secondary cursor-pointer hover:underline mx-2" onClick={() => setSearchQuery('Pets')}>Pets</span> • <span className="text-secondary cursor-pointer hover:underline mx-2" onClick={() => setSearchQuery('Cancellation')}>Cancellation</span>
        </p>
      </section>

      {/* Category Grid */}
      <section className="bg-surface py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {[
              { id: 'pricing', icon: DollarSign, title: 'Pricing', desc: 'Transparent rates for every square foot. No hidden fees, just pure clarity.' },
              { id: 'logistics', icon: Calendar, title: 'Logistics', desc: 'How we enter, how we leave, and how we handle your keys and security.' },
              { id: 'services', icon: Sparkles, title: 'Services', desc: "Deep cleans, move-ins, or routine maintenance. See what's included." }
            ].map((cat) => (
              <button 
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                  const el = document.getElementById(cat.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white p-12 rounded-3xl text-left hover:-translate-y-2 transition-transform duration-500 shadow-sm border border-outline-variant/5 border-transparent hover:border-secondary/20 h-full flex flex-col items-start"
              >
                <div className="w-16 h-16 rounded-3xl bg-secondary-fixed text-primary flex items-center justify-center mb-8">
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-primary mb-4">{cat.title}</h3>
                <p className="text-on-surface-variant font-medium leading-relaxed mb-8 flex-1">{cat.desc}</p>
                <div className="mt-auto flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest group">
                  View Questions
                  <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="max-w-4xl mx-auto space-y-32">
            {searchQuery && filteredSections.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl space-y-4 shadow-sm border border-outline-variant/10">
                <p className="text-on-surface-variant text-xl font-bold">No results found for "{searchQuery}"</p>
                <p className="text-sm text-outline-variant/80">Try different terms, or contact support directly below.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2.5 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-transform"
                >
                  Clear Filter
                </button>
              </div>
            ) : (
              (searchQuery ? filteredSections : sections).map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-40 space-y-10">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-primary flex items-center gap-6">
                    <span className="text-outline-variant/30 text-2xl font-black">{section.number}</span>
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-white rounded-3xl overflow-hidden border border-outline-variant/10 shadow-sm"
                      >
                        <button 
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex justify-between items-center p-8 text-left group"
                        >
                          <span className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">{item.q}</span>
                          <ChevronDown className={`w-6 h-6 text-outline-variant transition-transform duration-300 ${openItems.includes(item.id) ? 'rotate-180 text-secondary' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {openItems.includes(item.id) && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                            >
                              <div className="px-8 pb-10 text-on-surface-variant font-medium leading-relaxed text-lg pt-2 border-t border-outline-variant/5">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-gradient-to-br from-primary to-primary-container p-16 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1549400263-467268593673?q=80&w=2070&auto=format&fit=crop" 
              alt="Marble background" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Still have questions?</h2>
            <p className="text-secondary-fixed text-xl font-medium max-w-2xl mx-auto">
              Our sanctuary support team is available Mon–Fri, 8am–6pm. We usually respond within 2 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-10 py-5 bg-white text-primary rounded-md font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-lg"
              >
                <MessageSquare className="w-5 h-5" />
                Contact Support
              </button>
              <button className="px-10 py-5 bg-transparent border border-white/20 text-white rounded-md font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/5 transition-colors">
                <Phone className="w-5 h-5" />
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal (Firestore synced lead generation) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-primary/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] max-w-2xl w-full p-10 md:p-12 shadow-2xl relative border border-outline-variant/10 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSubmitSuccess(false);
                }}
                className="absolute top-8 right-8 text-outline-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container"
              >
                <X className="w-6 h-6" />
              </button>

              {submitSuccess ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 bg-secondary-fixed text-primary rounded-full flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-10 h-10 stroke-[3]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-extrabold text-primary">Inquiry Logged!</h3>
                    <p className="text-on-surface-variant font-medium leading-relaxed">
                      We've safely saved your inquiry to our secure quote management database. Our team will read the details and contact you at <span className="font-bold text-secondary">{formData.email}</span> within 2 hours.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsModalOpen(false);
                      setSubmitSuccess(false);
                    }}
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-primary">Contact Support</h2>
                    <p className="text-on-surface-variant font-medium text-sm">Submit your specifications directly into our live database.</p>
                  </div>

                  <form onSubmit={handleSupportSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Your Name</label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Elena"
                          className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary">Your Email</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="elena@example.com"
                          className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary">Service Type Interest</label>
                      <select 
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low border-none rounded-xl p-4 font-bold cursor-pointer"
                      >
                        <option value="Residential Standard">Residential Standard Care</option>
                        <option value="Deep Sanctuary">The Deep Sanctuary Standard</option>
                        <option value="Post-Event Restore">Post-Event Restoration</option>
                        <option value="Moving Transition">Moving-in Transition Scrub</option>
                        <option value="Commercial Space">Commercial / Office Cleaning</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary">Project Specification & Details</label>
                      <textarea 
                        name="details"
                        value={formData.details}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        placeholder="Please tell us about your layout, square footage, pet concerns, or special instructions..."
                        className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-secondary/30 transition-all font-medium"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5.5 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Logging Inquiries...' : 'Submit Spec Details'}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
