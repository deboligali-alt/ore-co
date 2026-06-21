import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Droplets, ShieldCheck, Fingerprint, Lock, GraduationCap } from 'lucide-react';

export const About: React.FC = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <Leaf className="w-3 h-3 fill-current" />
              Our Philosophy
            </div>
            <h1 className="text-5xl lg:text-8xl font-extrabold text-primary leading-[1] tracking-tight">
              Crafting Pristine <br />
              <span className="text-secondary italic">Sanctuaries</span> for Life.
            </h1>
            <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed font-medium">
              At Ore & Co., we believe your home is more than just a space—it’s a sanctuary. Our mission is to reclaim your time and restore your peace of mind through meticulously detailed cleaning and an unwavering commitment to eco-friendly excellence.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=2070&auto=format&fit=crop" 
                alt="Founder image or workspace"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-primary p-10 rounded-2xl shadow-2xl max-w-sm border border-white/10">
              <p className="text-xl font-display font-bold text-white mb-4 italic leading-tight">
                "The clarity of a clean home reflects the clarity of a focused mind."
              </p>
              <p className="text-xs text-primary-fixed/60 font-black uppercase tracking-widest">
                — Elena Ore, Founder
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-32 bg-surface px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold text-primary mb-6">
              Values That Breathe
            </h2>
            <p className="text-xl text-on-surface-variant leading-relaxed font-medium">
              Sustainability isn't a trend; it's our standard. We use botanical-based solutions that are safe for your family, your pets, and our planet.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <motion.div 
              {...fadeUp}
              className="md:col-span-8 bg-white p-12 rounded-3xl flex flex-col justify-between border border-outline-variant/10 shadow-sm"
            >
              <div className="max-w-md space-y-6">
                <Leaf className="w-10 h-10 text-secondary" />
                <h3 className="text-3xl font-bold text-primary">Purely Botanical</h3>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                  Our cleaning agents are 100% biodegradable, derived from citrus, vinegar, and essential oils. No synthetic fragrances, no harsh residues.
                </p>
              </div>
              <div className="mt-12 flex gap-4">
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container rounded-full" />
              </div>
            </motion.div>

            <motion.div 
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="md:col-span-4 bg-primary p-12 rounded-3xl flex flex-col items-center justify-center text-center text-white space-y-4"
            >
              <div className="text-7xl font-black">0%</div>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Harmful Chemicals Used</p>
            </motion.div>

            <motion.div 
              {...fadeUp}
              transition={{ delay: 0.2 }}
              className="md:col-span-4 bg-secondary-fixed p-12 rounded-3xl space-y-6"
            >
              <Droplets className="w-10 h-10 text-primary" />
              <h3 className="text-2xl font-bold text-primary">Water Conscious</h3>
              <p className="text-on-surface-variant font-semibold text-sm leading-relaxed">
                Streamlined processes reduce water waste by 30% compared to traditional methods.
              </p>
            </motion.div>

            <motion.div 
              {...fadeUp}
              transition={{ delay: 0.3 }}
              className="md:col-span-8 bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row border border-outline-variant/10"
            >
              <div className="flex-1 p-12 flex flex-col justify-center space-y-6">
                <h3 className="text-3xl font-bold text-primary">Breathe Easier</h3>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                  HEPA-filtration vacuums and microfiber technology ensure indoor air quality is as pristine as the surfaces we polish.
                </p>
              </div>
              <div className="flex-1 min-h-[300px]">
                <img 
                  src="https://images.unsplash.com/photo-1527333323140-7988d442a009?q=80&w=2069&auto=format&fit=crop" 
                  alt="Healthy home environment"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-32 bg-white px-6 md:px-12">
        <div className="max-w-5xl mx-auto glass-effect rounded-[3rem] p-16 md:p-24 relative overflow-hidden bg-surface-container-low/50">
          <div className="absolute top-12 right-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-black text-[10px] tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4" />
              Premium Standard
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary">
                Security Without <br />Compromise
              </h2>
              <p className="text-xl text-on-surface-variant font-medium leading-relaxed">
                Your trust is our most valuable asset. We maintain a fortress of security protocols so you can enjoy your sanctuary with total peace of mind.
              </p>

              <div className="space-y-8">
                {[
                  { icon: ShieldCheck, title: 'Fully Insured & Bonded', desc: 'Comprehensive $2M general liability coverage for every visit.' },
                  { icon: Fingerprint, title: 'Triple-Vetted Backgrounds', desc: 'Criminal records check, professional reference audit, and identity verification.' },
                  { icon: Lock, title: 'Secure Access Management', desc: 'Encrypted digital key safes and strict non-disclosure agreements.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-sm">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-lg">{item.title}</h4>
                      <p className="text-on-surface-variant text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-80 h-80 rounded-full border-4 border-secondary/20 flex flex-col items-center justify-center text-center p-12">
              <ShieldCheck className="w-16 h-16 text-secondary mb-4" />
              <p className="text-2xl font-bold text-primary leading-tight">Total Shield Protection</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mt-2">Certified Since 2018</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
