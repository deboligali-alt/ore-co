import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, ChevronRight, House, LampCeiling, Trash2, CookingPot, Bath, Wind, Leaf } from 'lucide-react';

export const DeepClean: React.FC = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-secondary to-secondary-container text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              Premium Service
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold text-primary leading-[1] tracking-tight">
              The Deep Clean <br />
              <span className="text-secondary italic">Standard.</span>
            </h1>
            
            <p className="text-2xl text-on-surface-variant max-w-xl leading-relaxed font-medium">
              Experience a sanctuary restored. Our signature service goes beyond the surface to eliminate allergens, deep-set dust, and the invisible grime of daily life.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?q=80&w=1887&auto=format&fit=crop" 
              alt="Deep clean visualization"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="py-32 bg-surface px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold text-primary mb-6">
              Precision in Every Corner
            </h2>
            <p className="text-xl text-on-surface-variant font-medium">
              Compare our meticulous standards. Whether it's a routine refresh or a total restoration, we leave no stone unturned.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Standard */}
            <motion.div 
              {...fadeUp}
              className="bg-white p-12 rounded-[2rem] border border-outline-variant/10 space-y-10"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-extrabold text-primary">Standard Maintenance</h3>
                <span className="px-4 py-1.5 bg-surface-container rounded-full text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                  Routine Care
                </span>
              </div>
              
              <ul className="space-y-8">
                {[
                  'Dusting of accessible surfaces, electronics, and frames.',
                  'Kitchen exterior wipe-down including stove top and counters.',
                  'Vacuuming of all floors and damp mopping of hard surfaces.',
                  'Sanitization of high-touch handles and switches.',
                  'Wiping baseboards (visible areas)',
                  'Bed making and light tidying'
                ].map((item, i) => (
                  <li key={i} className={`flex gap-4 ${i > 3 ? 'opacity-30' : ''}`}>
                    <CheckCircle2 className={`w-6 h-6 shrink-0 ${i > 3 ? 'text-outline-variant' : 'text-secondary'}`} />
                    <p className="font-semibold text-on-surface/80">{item}</p>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Deep Clean */}
            <motion.div 
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="bg-primary text-white p-12 rounded-[2rem] space-y-10 shadow-2xl shadow-primary/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="w-32 h-32" />
              </div>

              <div className="flex justify-between items-center relative z-10">
                <h3 className="text-3xl font-extrabold">The Deep Sanctuary</h3>
                <span className="px-4 py-1.5 bg-secondary text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                  The Gold Standard
                </span>
              </div>

              <ul className="space-y-8 relative z-10">
                {[
                  'Everything in Standard, plus detailed baseboard scrubbing.',
                  'Interior cabinet vacuuming and organization touch-ups.',
                  'Full oven and range deep degreasing and restoration.',
                  'HEPA-filtration dusting of light fixtures and ceiling fans.',
                  'Grout steam cleaning and soap scum removal in baths.',
                  'Eco-friendly air freshening treatment with essential oils.'
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 shrink-0 text-secondary-container fill-secondary-container/20" />
                    <p className="font-semibold">{item}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process: 2-Column Minimalist */}
      <section className="py-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <div className="sticky top-32 space-y-10">
            <h2 className="text-4xl md:text-7xl font-extrabold text-primary leading-[1]">
              An Artisanal <br /><span className="text-secondary italic">Approach</span> to Clean.
            </h2>
            <p className="text-2xl text-on-surface-variant font-medium leading-relaxed">
              We don't just clean; we restore. Our process is designed to minimize disruption while maximizing clarity. We use medical-grade HEPA filters and non-toxic, botanical solutions that are safe for your family and pets.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-16 h-16 rounded-full border-4 border-white bg-surface-container overflow-hidden">
                    <img src={`https://picsum.photos/seed/staff${i}/100/100`} alt="Staff" />
                  </div>
                ))}
              </div>
              <p className="font-black text-xs uppercase tracking-widest text-primary">50+ Certified Specialists</p>
            </div>
          </div>

          <div className="space-y-20">
            {[
              { id: '01', title: 'Discovery & Audit', desc: 'Every sanctuary is unique. We begin with a room-by-room audit to identify specific areas of concern, surface types, and your personal preferences.', icon: House },
              { id: '02', title: 'Botanical Treatment', desc: 'Our specialists apply PH-balanced, bio-based detergents that lift grime without corrosive chemicals, preserving the longevity of your surfaces.', icon: Leaf },
              { id: '03', title: 'High-Velocity HEPA', desc: 'We utilize industry-leading air filtration while we work, capturing 99.9% of airborne particles so your home smells and feels lighter.', icon: Wind },
              { id: '04', title: 'The Signature Finish', desc: 'The final step is our sensory audit. We hand-buff surfaces to a high-gloss finish and leave our signature room refresh mist behind.', icon: Sparkles }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-10 group"
              >
                <div className="shrink-0 w-20 h-20 rounded-3xl bg-white border border-outline-variant/10 flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-extrabold text-primary">
                    <span className="text-outline-variant mr-3 text-lg font-black">{step.id}.</span>
                    {step.title}
                  </h4>
                  <p className="text-on-surface-variant font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
