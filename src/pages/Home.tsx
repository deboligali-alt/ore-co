import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Home as HomeIcon, Building2, Sparkles, CheckCircle2 } from 'lucide-react';

interface HomeProps {
  onPageChange: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onPageChange }) => {
  const partners = [
    "https://picsum.photos/seed/re1/200/80?grayscale",
    "https://picsum.photos/seed/re2/200/80?grayscale",
    "https://picsum.photos/seed/re3/200/80?grayscale",
    "https://picsum.photos/seed/re4/200/80?grayscale",
  ];

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container text-primary font-bold text-xs tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              Trusted by 500+ Philadelphia Families
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold leading-[1] text-primary">
              A Spotless Space, <br />
              <span className="text-secondary italic">Every Single Time</span>
            </h1>
            
            <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed font-medium">
              Experience the luxury of a reclaimed sanctuary. Our vetted professionals deliver precision cleaning that respects your time and your health.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={() => onPageChange('booking')}
                className="px-8 py-5 bg-primary text-white rounded-md font-bold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-primary/10"
              >
                Get a Free Quote
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onPageChange('services')}
                className="px-8 py-5 bg-white border border-outline-variant/30 text-primary rounded-md font-bold text-lg hover:bg-surface-container-low transition-colors"
              >
                See Our Pricing
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,17,58,0.15)] relative">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
                alt="Immaculate living space"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>

            {/* Testimonial Card */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-8 -left-8 glass-effect p-8 rounded-2xl shadow-2xl max-w-[300px] border-white/50"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="font-bold text-primary leading-tight mb-3">
                "The best cleaning I've ever had. Truly transformative for my mental clarity."
              </p>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
                — Sarah J., Rittenhouse
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low -z-10 skew-x-[-12deg] translate-x-32" />
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black tracking-[0.2em] text-outline-variant uppercase mb-12">
            As Featured & Trusted By
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale transition-all hover:grayscale-0 hover:opacity-100">
            {partners.map((img, i) => (
              <img key={i} src={img} alt="Partner" className="h-8 md:h-10 object-contain" />
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-32 bg-surface px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <motion.div {...fadeUp} className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-extrabold text-primary mb-6">
                Expertise for <br />Every Surface
              </h2>
              <p className="text-xl text-on-surface-variant leading-relaxed font-medium">
                Tailored solutions that go beyond the surface. We bring professional-grade equipment and specialized care to your home or workspace.
              </p>
            </motion.div>
            <button 
              onClick={() => onPageChange('services')}
              className="group flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-xs border-b border-transparent hover:border-secondary pb-1 transition-all"
            >
              Detailed Checklist
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Residential',
                icon: HomeIcon,
                desc: 'Regular upkeep to keep your sanctuary pristine. Weekly, bi-weekly, or monthly visits tailored to your schedule.',
                list: ['Dusting & Sanitizing', 'Floor Deep-Care', 'Kitchen Polishing'],
                color: 'bg-secondary-container/30'
              },
              {
                title: 'Commercial',
                icon: Building2,
                desc: 'Impress your clients with a workspace that reflects your standards. Nightly cleaning for offices and retail.',
                list: ['High-Traffic Sanitization', 'Trash & Recycling', 'Restroom Refresh'],
                color: 'bg-primary/5'
              },
              {
                title: 'Deep Clean',
                icon: Sparkles,
                desc: 'The ultimate restoration. Detailed attention to baseboards, inside appliances, and every hidden corner.',
                premium: true,
                list: ['Inside Oven/Fridge', 'Baseboard Scrubbing', 'Window Tracks'],
                color: 'bg-secondary-fixed/30'
              }
            ].map((service, i) => (
              <motion.div 
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="group bg-white p-10 rounded-2xl border border-outline-variant/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
              >
                <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-8 text-primary transition-transform group-hover:rotate-6`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{service.title}</h3>
                {service.premium && (
                  <span className="inline-block px-3 py-1 bg-secondary text-white text-[10px] font-black rounded w-fit mb-4 uppercase tracking-[0.1em]">
                    Premium Package
                  </span>
                )}
                <p className="text-on-surface-variant mb-10 leading-relaxed font-medium">
                  {service.desc}
                </p>
                <ul className="space-y-4 mt-auto">
                  {service.list.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-on-surface/70 text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-primary relative overflow-hidden p-16 md:p-24 text-center">
          <div className="absolute inset-0 opacity-10 blur-3xl bg-[radial-gradient(circle_at_center,#0c6780_0%,transparent_70%)]" />
          <motion.div {...fadeUp} className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              Ready to Reclaim <br />Your Sanctuary?
            </h2>
            <p className="text-primary-fixed/70 text-xl font-medium max-w-xl mx-auto">
              Join 1,200+ homeowners who trust Ore & Co. to deliver hospitality-grade clean every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button 
                onClick={() => onPageChange('booking')}
                className="px-10 py-5 bg-white text-primary rounded-md font-bold text-xl hover:scale-105 transition-transform"
              >
                Book Your Clean
              </button>
              <button 
                onClick={() => onPageChange('faq')}
                className="px-10 py-5 bg-transparent border border-white/20 text-white rounded-md font-bold text-xl hover:bg-white/5 transition-colors"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
