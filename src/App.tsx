import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { DeepClean } from './pages/DeepClean';
import { Booking } from './pages/Booking';
import { Faq } from './pages/Faq';
import { AnimatePresence, motion } from 'motion/react';
import { AuthProvider } from './lib/AuthContext';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Handle smooth scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPageChange={setCurrentPage} />;
      case 'about':
        return <About />;
      case 'services':
        return <DeepClean />;
      case 'booking':
        return <Booking />;
      case 'faq':
        return <Faq />;
      default:
        return <Home onPageChange={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-surface selection:bg-secondary/20 selection:text-primary">
        <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer onPageChange={setCurrentPage} />
      </div>
    </AuthProvider>
  );
}
