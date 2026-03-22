import { Link } from 'react-router-dom';
import { ArrowRight, Users, Globe, Briefcase, ChevronRight, Star } from 'lucide-react';
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
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-gold-50 animate-gradient opacity-40 z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-50 blur-[100px] opacity-70"></div>
          <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gold-100 blur-[100px] opacity-70"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-20 lg:pt-32 lg:pb-28 text-center">
          <FadeInUp>
            <div className="flex flex-col items-center gap-4 mb-8">
              {status?.isLive && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-500 text-xs font-bold animate-pulse">
                  <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  LIVE NOW: Sunday Morning Service
                </div>
              )}
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-500 text-sm font-semibold tracking-wide">
                <span className="flex h-2 w-2 rounded-full bg-brand-500 mr-2"></span>
                Senior Pastor • Missionary • Marketplace Leader
              </div>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={0.1}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-text-main tracking-tight leading-tight mb-6">
              Empowering Lives.<br />
              <span className="bg-gradient-to-r from-brand-500 to-blue-400 text-gradient">Expanding the Kingdom.</span>
            </h1>
          </FadeInUp>
          
          <FadeInUp delay={0.2}>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-muted leading-relaxed mb-10">
              Pastor Efe Ovenseri bridges the gap between deep spiritual calling and marketplace excellence. A progressive journey of divine purpose, practical service, and unwavering dedication to the Church and the world.
            </p>
          </FadeInUp>
          
          <FadeInUp delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/services" className="w-full sm:w-auto px-8 py-4 bg-text-main text-white rounded-xl font-semibold text-lg hover:bg-slate-800 shadow-saas hover:shadow-saas-lg transition-all duration-300 transform hover:-translate-y-1 inline-block">
                Explore Ministry Arms
              </Link>
              <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-white border border-surface-100 text-text-main rounded-xl font-semibold text-lg hover:bg-surface-50 hover:border-surface-100 shadow-sm transition-all duration-300 flex items-center justify-center">
                Partner With Us <ArrowRight className="ml-2 w-5 h-5 text-brand-500" />
              </Link>
            </div>
          </FadeInUp>
        </div>
      </div>

      {/* Impact / Metrics Section */}
      <div className="bg-surface-50 border-y border-surface-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-x divide-surface-100/50">
            <FadeInUp className="text-center">
              <div className="text-4xl lg:text-5xl font-display font-bold text-text-main mb-2">
                <AnimatedCounter target={metrics?.yearsOfService || 32} />+
              </div>
              <div className="text-sm font-medium text-text-muted uppercase tracking-wider">Years of Service</div>
            </FadeInUp>
            <FadeInUp delay={0.1} className="text-center">
              <div className="text-4xl lg:text-5xl font-display font-bold text-text-main mb-2">
                <AnimatedCounter target={metrics?.nationsReached || 5} />
              </div>
              <div className="text-sm font-medium text-text-muted uppercase tracking-wider">Nations Reached</div>
            </FadeInUp>
            <FadeInUp delay={0.2} className="text-center">
              <div className="text-4xl lg:text-5xl font-display font-bold text-text-main mb-2">
                <AnimatedCounter target={metrics?.coreMinistries || 3} />
              </div>
              <div className="text-sm font-medium text-text-muted uppercase tracking-wider">Core Ministries</div>
            </FadeInUp>
            <FadeInUp delay={0.3} className="text-center">
              <div className="text-4xl lg:text-5xl font-display font-bold text-text-main mb-2">
                {metrics?.divineDedication || 100}%
              </div>
              <div className="text-sm font-medium text-text-muted uppercase tracking-wider">Divine Dedication</div>
            </FadeInUp>
          </div>
        </div>
      </div>

      {/* Core Ministry Arms */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-brand-500 font-semibold tracking-wide uppercase text-sm mb-3">Ministry Architecture</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-text-main mb-4">A Multi-Dimensional Approach to Global Impact</h3>
            <p className="text-text-muted text-lg">A robust spiritual framework designed to nurture believers, expand church planting, and bring kingdom principles into professional environments.</p>
          </FadeInUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FadeInUp className="bg-white rounded-2xl p-8 border border-surface-100 shadow-saas hover:shadow-saas-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-500 transition-colors duration-300">
                <Users className="w-7 h-7 text-brand-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h4 className="text-xl font-display font-bold text-text-main mb-3">Pastoral Ministry</h4>
              <p className="text-text-muted leading-relaxed mb-6">Serving as the Senior Pastor of The Redeemed Assemblies, Availeith City. Dedicated to shepherding flocks, building strong families, and fostering localized spiritual growth.</p>
              <Link to="/services" className="text-brand-500 font-semibold text-sm flex items-center hover:text-brand-600">Learn more <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </FadeInUp>
            
            <FadeInUp delay={0.1} className="bg-white rounded-2xl p-8 border border-surface-100 shadow-saas hover:shadow-saas-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-gold-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors duration-300">
                <Globe className="w-7 h-7 text-gold-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h4 className="text-xl font-display font-bold text-text-main mb-3">Global Missions</h4>
              <p className="text-text-muted leading-relaxed mb-6">Acting as Mission Director to coordinate pastoral relationships across borders. Facilitating church planting, missionary support, and cross-cultural evangelism initiatives.</p>
              <Link to="/services" className="text-brand-500 font-semibold text-sm flex items-center hover:text-brand-600">Learn more <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </FadeInUp>

            <FadeInUp delay={0.2} className="bg-white rounded-2xl p-8 border border-surface-100 shadow-saas hover:shadow-saas-lg transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-500 transition-colors duration-300">
                <Briefcase className="w-7 h-7 text-brand-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h4 className="text-xl font-display font-bold text-text-main mb-3">Marketplace Leadership</h4>
              <p className="text-text-muted leading-relaxed mb-6">Integrating faith with high-level entrepreneurship and civil engineering. Proving that professional excellence and spiritual devotion are mutually reinforcing.</p>
              <Link to="/services" className="text-brand-500 font-semibold text-sm flex items-center hover:text-brand-600">Learn more <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </FadeInUp>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-surface-50 py-24 border-y border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-text-main mb-4">Voices of Transformation</h2>
            <p className="text-text-muted">The profound impact of a life dedicated to service.</p>
          </FadeInUp>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeInUp className="bg-white p-8 rounded-2xl shadow-sm border border-surface-100">
              <div className="flex text-gold-500 mb-4">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-text-main font-medium leading-relaxed mb-6">"Pastor Efe's teachings completely transformed my approach to both my faith and my business. His practical wisdom regarding marketplace ministry is simply unmatched."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold font-display">S</div>
                <div className="ml-3">
                  <h5 className="text-sm font-bold text-text-main">Sarah Jenkins</h5>
                  <p className="text-xs text-text-muted">Ministry Partner</p>
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.1} className="bg-white p-8 rounded-2xl shadow-sm border border-surface-100">
              <div className="flex text-gold-500 mb-4">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-text-main font-medium leading-relaxed mb-6">"Under his leadership at Availeith City, my family found a genuine spiritual home. His balance of deep pastoral care and visionary administration is a rare, beautiful gift."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 font-bold font-display">D</div>
                <div className="ml-3">
                  <h5 className="text-sm font-bold text-text-main">David M.</h5>
                  <p className="text-xs text-text-muted">Availeith City Member</p>
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.2} className="bg-white p-8 rounded-2xl shadow-sm border border-surface-100">
              <div className="flex text-gold-500 mb-4">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-text-main font-medium leading-relaxed mb-6">"His work as Mission Director has strengthened our global church network tremendously. He serves not for the title, but with an absolute, proven dedication to the Gospel."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold font-display">J</div>
                <div className="ml-3">
                  <h5 className="text-sm font-bold text-text-main">Rev. John T.</h5>
                  <p className="text-xs text-text-muted">Fellow Minister</p>
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>

      {/* Global CTA Section */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-brand-50/50 z-0"></div>
        <FadeInUp className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-main mb-6">Ready to advance the Kingdom together?</h2>
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">Whether you are seeking spiritual oversight, inviting Pastor Efe to speak, or looking to partner with our global missions, the door is open.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="px-8 py-4 bg-brand-500 text-white rounded-xl font-semibold text-lg hover:bg-brand-600 shadow-saas hover:shadow-saas-lg transition-all duration-300">
              Book Pastor Efe
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-white border border-surface-100 text-text-main rounded-xl font-semibold text-lg hover:bg-surface-50 transition-all duration-300">
              Become a Partner
            </Link>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
}
