import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, login, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'About', id: 'about' },
    { name: 'Booking', id: 'booking' },
    { name: 'FAQ', id: 'faq' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-effect py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <nav className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <button 
          onClick={() => onPageChange('home')}
          className="flex items-center gap-2 group transition-transform hover:scale-105"
        >
          <Sparkles className="text-primary w-6 h-6" />
          <span className="text-xl md:text-2xl font-extrabold tracking-widest text-primary uppercase font-display">
            Ore & Co.
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`text-sm font-semibold tracking-wide transition-all duration-300 hover:text-secondary ${
                currentPage === item.id 
                  ? 'text-primary border-b-2 border-primary pb-1' 
                  : 'text-on-surface-variant'
              }`}
            >
              {item.name}
            </button>
          ))}

          {/* User Profile/Login Section */}
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-surface-container transition-colors"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-primary/15" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed text-primary flex items-center justify-center font-bold text-xs uppercase">
                    {user.displayName?.substring(0, 2) || 'U'}
                  </div>
                )}
                <span className="text-xs font-bold text-primary max-w-[100px] truncate">{user.displayName?.split(' ')[0]}</span>
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-outline-variant/10 p-2 text-left z-50"
                  >
                    <div className="px-4 py-3 border-b border-outline-variant/5">
                      <p className="text-xs text-on-surface-variant font-medium">Signed in as</p>
                      <p className="font-bold text-sm text-primary truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onPageChange('booking');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-primary hover:bg-surface-container rounded-xl transition-colors mt-1"
                    >
                      <User className="w-4 h-4 text-on-surface-variant" />
                      My Sanctuary Bookings
                    </button>
                    <button
                      onClick={async () => {
                        setIsUserDropdownOpen(false);
                        await logout();
                        onPageChange('home');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-error-fixed hover:bg-surface-container rounded-xl transition-colors text-red-600 hover:text-red-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => login()}
              className="flex items-center gap-2 text-sm font-black text-secondary hover:text-primary transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}

          <button 
            onClick={() => onPageChange('booking')}
            className="px-6 py-2.5 bg-primary text-white rounded-md font-bold text-sm hover:bg-primary-container transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Get a Quote
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-primary flex items-center gap-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {user && user.photoURL && (
            <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full border border-primary/10" />
          )}
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-outline-variant/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-lg font-bold text-left ${
                    currentPage === item.id ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {item.name}
                </button>
              ))}

              {/* Login State in Mobile */}
              {user ? (
                <div className="border-t border-outline-variant/10 pt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    {user.photoURL && (
                      <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />
                    )}
                    <div>
                      <p className="font-bold text-primary">{user.displayName}</p>
                      <p className="text-xs text-on-surface-variant">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await logout();
                      onPageChange('home');
                    }}
                    className="flex items-center gap-2 text-sm font-black text-red-600 py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await login();
                  }}
                  className="flex items-center gap-3 text-lg font-bold text-secondary text-left py-2 border-t border-outline-variant/10 pt-6"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In with Google
                </button>
              )}

              <button 
                onClick={() => {
                  onPageChange('booking');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-4 bg-primary text-white rounded-md font-bold text-center"
              >
                Get a Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
