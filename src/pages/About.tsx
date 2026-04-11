import { CheckCircle, Circle, HeartHandshake, Shield, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeInUp } from '../components/FadeInUp';
import { SEO } from '../components/SEO';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const y1 = useTransform(springScroll, [0, 1], [0, -200]);
  const y2 = useTransform(springScroll, [0, 1], [0, -400]);
  const rotate = useTransform(springScroll, [0, 1], [0, 45]);

  return (
    <div ref={containerRef} className="min-h-screen bg-bg-midnight overflow-x-hidden relative">
      <SEO title="Biography" description="Discover the journey of Pastor Efe Ovenseri. From early spiritual foundations to global leadership in ministry and marketplace excellence." />
      
      {/* Divine Geometry Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ y: y1, rotate }}
          className="divine-geometry divine-circle w-[600px] h-[600px] top-[10%] right-[-10%] opacity-20"
        />
        <motion.div 
          style={{ y: y2, rotate: -rotate }}
          className="divine-geometry divine-circle w-[400px] h-[400px] bottom-[10%] left-[-5%] opacity-10"
        />
        <motion.div 
          style={{ y: y1 }}
          className="divine-geometry divine-line w-[1px] h-[1000px] left-[20%] top-0 opacity-5"
        />
        <motion.div 
          style={{ y: y2 }}
          className="divine-geometry divine-line w-[1px] h-[1000px] right-[30%] bottom-0 opacity-5"
        />
      </div>

      {/* Page Header */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 celestial-radiant-bg">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="divine-glow top-[-10%] left-[-10%] opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,10,11,0)_0%,rgba(10,10,11,1)_100%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <FadeInUp>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-border-gold text-accent-gold-primary text-xs font-bold tracking-[0.3em] uppercase mb-8 backdrop-blur-md">
              The Journey of a Visionary
            </div>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-8 tracking-tighter leading-none text-shadow-divine">
              Forged in <span className="gold-gradient-text">Faith.</span><br />
              Driven by <span className="italic font-normal">Purpose.</span>
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="text-xl text-text-secondary leading-relaxed font-light max-w-3xl mx-auto">
              The comprehensive narrative of Pastor Efe Ovenseri—from early spiritual awakening to international marketplace leadership and global pastoral oversight.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="pb-32 relative bg-bg-navy-deep">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Sidebar - Sticky Navigation */}
            <div className="hidden lg:block lg:col-span-4 sticky top-32">
              <FadeInUp>
                <div className="glass-card p-10">
                  <h4 className="text-xs font-bold text-accent-gold-primary uppercase tracking-[0.2em] mb-8 border-b border-border-soft pb-4">Chapters</h4>
                  <ul className="space-y-6">
                    {[
                      { label: 'Early Foundations', active: true },
                      { label: 'Global Exposure', active: false },
                      { label: 'The Turning Point', active: false },
                      { label: 'Engineering & Enterprise', active: false },
                      { label: 'Ordination & Family', active: false }
                    ].map((item, i) => (
                      <li key={i} className={`flex items-center gap-4 text-sm font-bold tracking-wide transition-all cursor-pointer ${item.active ? 'text-white' : 'text-text-muted hover:text-white'}`}>
                        {item.active ? <CheckCircle className="w-5 h-5 text-accent-gold-primary" /> : <Circle className="w-5 h-5" />}
                        {item.label}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-12 pt-8 border-t border-border-soft">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-accent-gold-soft rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-accent-gold-primary" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">Integrity First</div>
                        <div className="text-text-muted text-xs">Core Value</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-accent-gold-soft rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-accent-gold-primary" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-sm">Global Vision</div>
                        <div className="text-text-muted text-xs">Mission Focus</div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>
            {/* Right Content - Authoritative Narrative */}
            <div className="lg:col-span-8 relative z-10">
              <FadeInUp>
                <div className="mb-16 rounded-2xl overflow-hidden ring-1 ring-border-soft shadow-2xl">
                  <img 
                    src="https://i.ibb.co/VYdwZq8S/Pastor-Efe-3.jpg" 
                    alt="Pastor Efe Ovenseri" 
                    className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </FadeInUp>

              {/* Biography Chapters - Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[200px]">
                {/* Chapter 1: Early Foundations */}
                <FadeInUp className="md:col-span-2 md:row-span-2">
                  <motion.div 
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bento-tile h-full p-8 flex flex-col justify-end min-h-[300px] md:min-h-0 cursor-pointer"
                  >
                    <h3 className="text-2xl font-display font-bold text-white mb-4">Early Foundations</h3>
                    <p className="text-text-secondary font-light leading-relaxed">
                      Pastor Ovenseri's spiritual trajectory was set in motion early in life, deeply influenced during the lifetime of his mother. This foundational period played a critical role in shaping his inherent understanding of faith, integrity, and absolute commitment to the Christian doctrine.
                    </p>
                  </motion.div>
                </FadeInUp>

                {/* Chapter 2: Global Exposure */}
                <FadeInUp className="md:col-span-2 md:row-span-1">
                  <motion.div 
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bento-tile h-full p-8 flex items-center gap-6 min-h-[150px] md:min-h-0 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-accent-gold-soft flex items-center justify-center shrink-0">
                      <Award className="w-8 h-8 text-accent-gold-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-2">Global Exposure</h3>
                      <p className="text-text-secondary font-light text-sm">
                        Traveling extensively across Canada, Germany, and other territories for personal growth and spiritual effectiveness.
                      </p>
                    </div>
                  </motion.div>
                </FadeInUp>

                {/* Chapter 3: The Turning Point */}
                <FadeInUp className="md:col-span-2 md:row-span-1">
                  <motion.div 
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bento-tile h-full p-8 flex flex-col justify-center min-h-[150px] md:min-h-0 cursor-pointer"
                  >
                    <h3 className="text-xl font-display font-bold text-white mb-2">The Turning Point</h3>
                    <p className="text-text-secondary font-light text-sm">
                      Destiny led him back to Nigeria, marking a defining era of alignment under the mentorship of Apostle Sunday Iyi.
                    </p>
                  </motion.div>
                </FadeInUp>

                {/* Chapter 4: Engineering & Enterprise */}
                <FadeInUp className="md:col-span-2 md:row-span-2">
                  <motion.div 
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bento-tile h-full p-8 flex flex-col justify-end relative overflow-hidden min-h-[300px] md:min-h-0 cursor-pointer"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Target 
                        className="text-accent-gold-primary" 
                        style={{ width: '65.9939px', height: '58.9939px' }}
                      />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4">Enterprise Meets Ministry</h3>
                    <p className="text-text-secondary font-light leading-relaxed">
                      Successfully expanded entrepreneurial pursuits into international import/export operations while maintaining high-level spiritual growth and civil engineering excellence.
                    </p>
                  </motion.div>
                </FadeInUp>

                {/* Chapter 5: Ordination & Family */}
                <FadeInUp className="md:col-span-2 md:row-span-1">
                  <motion.div 
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bento-tile h-full p-8 flex items-center gap-6 min-h-[150px] md:min-h-0 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-accent-gold-soft flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-8 h-8 text-accent-gold-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-2">Ordination & Family</h3>
                      <p className="text-text-secondary font-light text-sm">
                        Serving as Senior Pastor of The Redeemed Assemblies, Availeith City, supported by his wife and children.
                      </p>
                    </div>
                  </motion.div>
                </FadeInUp>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About CTA */}
      <section className="section-padding border-t border-border-soft bg-bg-navy-soft">
        <div className="container mx-auto px-4 text-center">
          <FadeInUp>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
              Connect with <span className="gold-gradient-text">Pastor Efe</span>
            </h2>
            <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto font-light">
              Whether for speaking engagements, mentorship, or ministry partnership, discover how you can collaborate.
            </p>
            <Link to="/contact" className="gold-premium-btn px-12 py-5 text-lg inline-flex items-center gap-3">
              <HeartHandshake className="w-6 h-6" />
              Partner With Us
            </Link>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
