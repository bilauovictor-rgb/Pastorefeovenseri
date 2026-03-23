import { Link } from 'react-router-dom';
import { ArrowRight, Users, Globe, Briefcase, ChevronRight, Star, HeartHandshake } from 'lucide-react';
import { FadeInUp } from '../components/FadeInUp';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { SEO } from '../components/SEO';
import { useEffect, useState } from 'react';

interface Metrics {
  yearsOfService: number;
  nationsReached: number;
  coreMinistries: number;
  divineDedication: number;
}

export function Home() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [status, setStatus] = useState<{ isLive: boolean, nextService: string } | null>(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error('Failed to fetch metrics:', err));

    fetch('/api/status')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(err => console.error('Failed to fetch status:', err));
  }, []);

  return (
    <div className="page-section active">
      <SEO title="Home" description="Welcome to the global ministry of Pastor Efe Ovenseri. Empowering lives and expanding the Kingdom through spiritual leadership and marketplace excellence." />
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[90vh] flex items-center pt-20 pb-20 lg:pt-32 lg:pb-28">
        {/* Cinematic Background */}
        <div className="absolute inset-0 bg-bg-dark-primary z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-bg-dark-secondary via-bg-dark-tertiary to-bg-dark-primary opacity-90 animate-gradient"></div>
          {/* Spiritual Atmosphere */}
          <div className="divine-glow -top-20 -left-20 opacity-40"></div>
          <div className="purple-glow bottom-0 right-0 opacity-30"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeInUp>
            <div className="flex flex-col items-center gap-4 mb-8">
              {status?.isLive && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold animate-pulse">
                  <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  LIVE NOW: Sunday Morning Service
                </div>
              )}
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent-gold-primary text-sm font-semibold tracking-wide backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-accent-gold-primary mr-2 shadow-[0_0_8px_rgba(212,175,55,0.8)]"></span>
                Senior Pastor • Missionary • Marketplace Leader
              </div>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={0.1}>
            <div className="relative inline-block">
              {/* Radial Glow behind heading */}
              <div className="absolute inset-0 bg-accent-gold-primary/5 blur-[100px] rounded-full -z-10"></div>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-extrabold text-text-on-dark-primary tracking-tight leading-[1.1] mb-6">
                Empowering Lives.<br />
                <span className="text-gold-gradient">Expanding the Kingdom.</span>
              </h1>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={0.2}>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-on-dark-secondary leading-relaxed mb-10">
              Pastor Efe Ovenseri bridges the gap between deep spiritual calling and marketplace excellence. A progressive journey of divine purpose, practical service, and unwavering dedication to the Church and the world.
            </p>
          </FadeInUp>
          
          <FadeInUp delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="w-full sm:w-auto px-8 py-4 gold-premium-btn rounded-xl font-bold text-lg inline-flex items-center justify-center gap-2">
                <HeartHandshake className="w-5 h-5" />
                Partner With Us
              </Link>
              <Link to="/services" className="w-full sm:w-auto px-8 py-4 glass-card text-text-on-dark-primary rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
                Explore Ministry Arms <ArrowRight className="ml-2 w-5 h-5 text-accent-gold-primary" />
              </Link>
            </div>
          </FadeInUp>
        </div>
      </div>

      {/* Impact / Metrics Section */}
      <div className="bg-bg-dark-secondary/50 border-y border-border-dark-soft py-16 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-x divide-border-dark-soft">
            <FadeInUp className="text-center">
              <div className="text-4xl lg:text-5xl font-display font-bold text-accent-gold-primary mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                <AnimatedCounter target={metrics?.yearsOfService || 32} />+
              </div>
              <div className="text-sm font-medium text-text-on-dark-muted uppercase tracking-wider">Years of Service</div>
            </FadeInUp>
            <FadeInUp delay={0.1} className="text-center">
              <div className="text-4xl lg:text-5xl font-display font-bold text-accent-gold-primary mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                <AnimatedCounter target={metrics?.nationsReached || 5} />
              </div>
              <div className="text-sm font-medium text-text-on-dark-muted uppercase tracking-wider">Nations Reached</div>
            </FadeInUp>
            <FadeInUp delay={0.2} className="text-center">
              <div className="text-4xl lg:text-5xl font-display font-bold text-accent-gold-primary mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                <AnimatedCounter target={metrics?.coreMinistries || 3} />
              </div>
              <div className="text-sm font-medium text-text-on-dark-muted uppercase tracking-wider">Core Ministries</div>
            </FadeInUp>
            <FadeInUp delay={0.3} className="text-center">
              <div className="text-4xl lg:text-5xl font-display font-bold text-accent-gold-primary mb-2 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                {metrics?.divineDedication || 100}%
              </div>
              <div className="text-sm font-medium text-text-on-dark-muted uppercase tracking-wider">Divine Dedication</div>
            </FadeInUp>
          </div>
        </div>
      </div>

      {/* Core Ministry Arms */}
      <div className="py-24 relative overflow-hidden">
        <div className="divine-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInUp className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-accent-gold-primary font-semibold tracking-wide uppercase text-sm mb-3">Ministry Architecture</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-text-on-dark-primary mb-4">A Multi-Dimensional Approach to Global Impact</h3>
            <p className="text-text-on-dark-secondary text-lg">A robust spiritual framework designed to nurture believers, expand church planting, and bring kingdom principles into professional environments.</p>
          </FadeInUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeInUp className="glass-card p-8 group">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-gold-primary transition-all duration-300">
                <Users className="w-7 h-7 text-accent-gold-primary group-hover:text-bg-dark-secondary transition-colors duration-300" />
              </div>
              <h4 className="text-xl font-display font-bold text-text-on-dark-primary mb-3">Pastoral Ministry</h4>
              <p className="text-text-on-dark-secondary leading-relaxed mb-6">Serving as the Senior Pastor of The Redeemed Assemblies, Availeith City. Dedicated to shepherding flocks, building strong families, and fostering localized spiritual growth.</p>
              <Link to="/services" className="text-accent-gold-primary font-semibold text-sm flex items-center hover:text-accent-gold-secondary">Learn more <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </FadeInUp>
            
            <FadeInUp delay={0.1} className="glass-card p-8 group">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-gold-primary transition-all duration-300">
                <Globe className="w-7 h-7 text-accent-gold-primary group-hover:text-bg-dark-secondary transition-colors duration-300" />
              </div>
              <h4 className="text-xl font-display font-bold text-text-on-dark-primary mb-3">Global Missions</h4>
              <p className="text-text-on-dark-secondary leading-relaxed mb-6">Acting as Mission Director to coordinate pastoral relationships across borders. Facilitating church planting, missionary support, and cross-cultural evangelism initiatives.</p>
              <Link to="/services" className="text-accent-gold-primary font-semibold text-sm flex items-center hover:text-accent-gold-secondary">Learn more <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </FadeInUp>

            <FadeInUp delay={0.2} className="glass-card p-8 group">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-gold-primary transition-all duration-300">
                <Briefcase className="w-7 h-7 text-accent-gold-primary group-hover:text-bg-dark-secondary transition-colors duration-300" />
              </div>
              <h4 className="text-xl font-display font-bold text-text-on-dark-primary mb-3">Marketplace Leadership</h4>
              <p className="text-text-on-dark-secondary leading-relaxed mb-6">Integrating faith with high-level entrepreneurship and civil engineering. Proving that professional excellence and spiritual devotion are mutually reinforcing.</p>
              <Link to="/services" className="text-accent-gold-primary font-semibold text-sm flex items-center hover:text-accent-gold-secondary">Learn more <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </FadeInUp>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 relative">
        <div className="absolute inset-0 bg-bg-dark-secondary/30 backdrop-blur-sm border-y border-border-dark-soft"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-text-on-dark-primary mb-4">Voices of Transformation</h2>
            <p className="text-text-on-dark-secondary">The profound impact of a life dedicated to service.</p>
          </FadeInUp>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeInUp className="glass-card p-8">
              <div className="flex text-accent-gold-primary mb-4">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-text-on-dark-primary font-medium leading-relaxed mb-6 italic">"Pastor Efe's teachings completely transformed my approach to both my faith and my business. His practical wisdom regarding marketplace ministry is simply unmatched."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent-gold-primary/20 flex items-center justify-center text-accent-gold-primary font-bold font-display">S</div>
                <div className="ml-3">
                  <h5 className="text-sm font-bold text-text-on-dark-primary">Sarah Jenkins</h5>
                  <p className="text-xs text-text-on-dark-muted">Ministry Partner</p>
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.1} className="glass-card p-8">
              <div className="flex text-accent-gold-primary mb-4">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-text-on-dark-primary font-medium leading-relaxed mb-6 italic">"Under his leadership at Availeith City, my family found a genuine spiritual home. His balance of deep pastoral care and visionary administration is a rare, beautiful gift."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent-gold-primary/20 flex items-center justify-center text-accent-gold-primary font-bold font-display">D</div>
                <div className="ml-3">
                  <h5 className="text-sm font-bold text-text-on-dark-primary">David M.</h5>
                  <p className="text-xs text-text-on-dark-muted">Availeith City Member</p>
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.2} className="glass-card p-8">
              <div className="flex text-accent-gold-primary mb-4">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-text-on-dark-primary font-medium leading-relaxed mb-6 italic">"His work as Mission Director has strengthened our global church network tremendously. He serves not for the title, but with an absolute, proven dedication to the Gospel."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent-gold-primary/20 flex items-center justify-center text-accent-gold-primary font-bold font-display">J</div>
                <div className="ml-3">
                  <h5 className="text-sm font-bold text-text-on-dark-primary">Rev. John T.</h5>
                  <p className="text-xs text-text-on-dark-muted">Fellow Minister</p>
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>

      {/* Global CTA Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="purple-glow top-0 left-1/2 -translate-x-1/2 opacity-20"></div>
        <FadeInUp className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-on-dark-primary mb-6">Ready to advance the Kingdom together?</h2>
          <p className="text-xl text-text-on-dark-secondary mb-10 max-w-2xl mx-auto">Whether you are seeking spiritual oversight, inviting Pastor Efe to speak, or looking to partner with our global missions, the door is open.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="w-full sm:w-auto px-8 py-4 gold-premium-btn rounded-xl font-bold text-lg inline-flex items-center justify-center gap-2">
              <HeartHandshake className="w-5 h-5" />
              Become a Partner
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-8 py-4 glass-card text-text-on-dark-primary rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
              Book Pastor Efe <ArrowRight className="ml-2 w-5 h-5 text-accent-gold-primary" />
            </Link>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
