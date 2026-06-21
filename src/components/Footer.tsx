import React from 'react';
import { Sparkles, Mail, Phone, MapPin, Instagram, Globe } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPageChange }) => {
  return (
    <footer className="w-full pt-24 pb-12 px-6 md:px-12 bg-white border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-24">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary w-5 h-5" />
            <span className="text-xl font-bold text-primary uppercase tracking-wider font-display">Ore & Co.</span>
          </div>
          <p className="text-on-surface-variant leading-relaxed text-sm">
            Reclaim your sanctuary with Philadelphia's premier cleaning service. We focus on the dust so you can focus on the living.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-primary text-sm uppercase tracking-widest">Services</h4>
          <nav className="flex flex-col gap-4">
            <button onClick={() => onPageChange('services')} className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all text-sm text-left">Deep Clean</button>
            <button onClick={() => onPageChange('home')} className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all text-sm text-left">Residential Maintenance</button>
            <button onClick={() => onPageChange('booking')} className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all text-sm text-left">Move-In/Move-Out</button>
          </nav>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-primary text-sm uppercase tracking-widest">Company</h4>
          <nav className="flex flex-col gap-4">
            <button onClick={() => onPageChange('about')} className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all text-sm text-left">Our Philosophy</button>
            <button onClick={() => onPageChange('faq')} className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all text-sm text-left">Knowledge Base</button>
            <button onClick={() => onPageChange('about')} className="text-on-surface-variant hover:text-primary hover:translate-x-1 transition-all text-sm text-left">Work With Us</button>
          </nav>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold text-primary text-sm uppercase tracking-widest">Contact</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-on-surface-variant text-sm">
              <Phone className="w-4 h-4 text-secondary" />
              <span>(215) 555-0123</span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant text-sm">
              <Mail className="w-4 h-4 text-secondary" />
              <span>hello@oreandco.com</span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant text-sm">
              <MapPin className="w-4 h-4 text-secondary" />
              <span>Rittenhouse, Philadelphia</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-on-surface-variant text-xs font-medium space-y-1 text-center md:text-left">
          <p>© 2026 Ore & Co. Cleaning. Reclaim your sanctuary.</p>
          <p className="text-[10px] text-outline-variant/80 font-semibold tracking-wide">
            Designed & Built by <span className="text-secondary font-bold">hylondon_code</span>
          </p>
        </div>
        <div className="flex gap-8 text-xs font-medium text-on-surface-variant">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
