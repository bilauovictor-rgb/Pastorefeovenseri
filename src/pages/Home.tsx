import { Link } from 'react-router-dom';
import { ArrowRight, Users, Globe, Briefcase, ChevronRight, Star, HeartHandshake, Play, Calendar, Shield, Target, Zap, Quote, Newspaper, Bell, Clock, MapPin } from 'lucide-react';
import { FadeInUp } from '../components/FadeInUp';
import { LazySection } from '../components/LazySection';
import { LazyYouTube } from '../components/LazyYouTube';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { SEO } from '../components/SEO';
import { useEffect, useState, useRef } from 'react';
import { SITE_METRICS, SITE_STATUS } from '../constants';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit, setDoc, doc } from 'firebase/firestore';
import YouTube from 'react-youtube';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';

interface Metrics {
  yearsOfService: number;
  nationsReached: number;
  coreMinistries: number;
  divineDedication: number;
}

export default function Home() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [status, setStatus] = useState<{ isLive: boolean, nextService: string } | null>(null);
  const [latestVideo, setLatestVideo] = useState<any>(null);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [expandedNewsIndex, setExpandedNewsIndex] = useState<number | null>(null);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;

    setSubscribeStatus('loading');
    try {
      await setDoc(doc(db, 'subscribers', subscribeEmail), {
        email: subscribeEmail,
        createdAt: new Date().toISOString(),
        sourcePage: 'Home'
      });
      setSubscribeStatus('success');
      setSubscribeEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 5000);
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeStatus('error');
    }
  };

  const handleAddToCalendar = (event: any) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`Join us for ${event.title} at ${event.location}. Time: ${event.time}`);
    const location = encodeURIComponent(event.location);
    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank');
  };

  const heroImages = [
    'https://images.unsplash.com/photo-1548625361-195fe57724e1?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=2000'
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const y1 = useTransform(smoothProgress, [0, 1], [0, -200]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, -500]);
  const yBg = useTransform(smoothProgress, [0, 1], ["0%", "25%"]);
  const xBg = useTransform(smoothProgress, [0, 1], ["0%", "5%"]);
  const scaleBg = useTransform(smoothProgress, [0, 1], [1.1, 1.2]);
  const rotate = useTransform(smoothProgress, [0, 1], [0, 45]);

  useEffect(() => {
    // Use static constants instead of API calls
    setMetrics(SITE_METRICS);
    setStatus(SITE_STATUS);

    // Hero Carousel Interval
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'sermons'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      
      const getYoutubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
      };

      const videoDoc = docs.find(doc => 
        doc.youtubeId || getYoutubeId(doc.videoUrl) || getYoutubeId(doc.audioEmbedUrl)
      );
      
      if (videoDoc) {
        const extractedId = videoDoc.youtubeId || getYoutubeId(videoDoc.videoUrl) || getYoutubeId(videoDoc.audioEmbedUrl);
        setLatestVideo({ ...videoDoc, youtubeId: extractedId });
      } else {
        setLatestVideo({
          youtubeId: 'dQw4w9WgXcQ', // Placeholder
          title: 'Divine Encounters with Pastor Efe'
        });
      }
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, 'sermons');
      } catch (err) {
        console.error("Error fetching latest video:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  const bentoItems = [
    {
      title: "Pastoral Ministry",
      description: "Senior Pastor of The Redeemed Assemblies, Availeith City. Building strong families and localized spiritual growth.",
      icon: <Users className="w-8 h-8 text-accent-gold-primary" />,
      size: "lg:col-span-8 lg:row-span-2",
      link: "/services",
      delay: 0.1
    },
    {
      title: "Global Missions",
      description: "Coordinating pastoral relationships across borders and facilitating church planting initiatives.",
      icon: <Globe className="w-8 h-8 text-accent-gold-primary" />,
      size: "lg:col-span-4 lg:row-span-2",
      link: "/services",
      delay: 0.2
    },
    {
      title: "Marketplace",
      description: "Integrating faith with high-level entrepreneurship and civil engineering excellence.",
      icon: <Briefcase className="w-8 h-8 text-accent-gold-primary" />,
      size: "lg:col-span-4 lg:row-span-1",
      link: "/services",
      delay: 0.3
    },
    {
      title: "Leadership",
      description: "Empowering the next generation of leaders with kingdom principles.",
      icon: <Shield className="w-8 h-8 text-accent-gold-primary" />,
      size: "lg:col-span-4 lg:row-span-1",
      link: "/services",
      delay: 0.4
    },
    {
      title: "Vision",
      description: "Expanding the Kingdom through strategic spiritual leadership.",
      icon: <Target className="w-8 h-8 text-accent-gold-primary" />,
      size: "lg:col-span-4 lg:row-span-1",
      link: "/services",
      delay: 0.5
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-bg-midnight overflow-x-hidden relative">
      <SEO title="Home" description="Welcome to the global ministry of Pastor Efe Ovenseri. Empowering lives and expanding the Kingdom through spiritual leadership and marketplace excellence." />
      
      {/* Divine Geometry Parallax Elements */}
      <div className="divine-geometry divine-circle w-[600px] h-[600px] top-[-10%] left-[-10%] opacity-10" />
      <div className="divine-geometry divine-circle w-[400px] h-[400px] bottom-[10%] right-[-5%] opacity-10" />
      <div className="divine-geometry divine-line top-[30%] left-0 opacity-10" />
      <div className="divine-geometry divine-line top-[70%] right-0 opacity-10" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 divine-motion-bg">
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Hero Image Carousel with Fade Effect */}
          <div className="absolute inset-0 -z-10 animate-hero-fade">
            <img 
              key={currentHeroIndex}
              src={heroImages[currentHeroIndex]} 
              alt="" 
              className="w-full h-full object-cover opacity-15 mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-midnight via-bg-midnight/20 to-bg-midnight"></div>
          </div>
          <div className="divine-glow top-[-10%] left-[-10%] opacity-40"></div>
          <div className="divine-glow bottom-[-10%] right-[-10%] opacity-30" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)' }}></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,10,11,0)_0%,rgba(10,10,11,1)_100%)]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="animate-fade-in-up">
            <div className="flex flex-col items-center gap-6 mb-10">
              {status?.isLive && (
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-widest uppercase animate-pulse">
                  <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                  Live Now
                </div>
              )}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-border-gold text-accent-gold-primary text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md">
                Senior Pastor • Missionary • Marketplace Leader
              </div>
            </div>
          </div>
          
          <div className="animate-fade-in-up delay-100">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-black text-white tracking-tighter leading-[0.9] mb-8 text-shadow-divine">
              Empowering <span className="gold-gradient-text">Lives.</span><br />
              Expanding <span className="italic font-normal">the</span> Kingdom.
            </h1>
          </div>
          
          <div className="animate-fade-in-up delay-200">
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary leading-relaxed mb-12 font-light">
              Pastor Efe Ovenseri bridges the gap between deep spiritual calling and marketplace excellence. A journey of divine purpose and unwavering dedication.
            </p>
          </div>
          
          <div className="animate-fade-in-up delay-300">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/contact" className="gold-premium-btn w-full sm:w-auto flex items-center justify-center gap-3">
                <HeartHandshake className="w-5 h-5" />
                Partner With Us
              </Link>
              <Link to="/services" className="gold-outline-btn w-full sm:w-auto flex items-center justify-center gap-3">
                Explore Ministry <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-px h-12 bg-gradient-to-b from-accent-gold-primary to-transparent"></div>
        </div>
      </section>

      {/* Circular Impact Hub */}
      <LazySection className="py-32 relative overflow-hidden bg-bg-navy-deep border-y border-border-soft">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
            <div className="lg:w-1/2">
              <FadeInUp>
                <h2 className="text-xs font-bold text-accent-gold-primary uppercase tracking-[0.3em] mb-4">Global Impact</h2>
                <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">A Vision That <br />Spans Nations</h3>
                <p className="text-text-muted text-lg font-light leading-relaxed mb-10">
                  From the heart of Availeith City to the ends of the earth, our mission is driven by a singular vision: to see lives transformed by the power of the Gospel and the excellence of Kingdom leadership.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-4xl font-display font-bold text-white mb-2">
                      <AnimatedCounter target={metrics?.yearsOfService || 32} />+
                    </div>
                    <div className="text-xs font-bold text-accent-gold-primary uppercase tracking-widest">Years of Service</div>
                  </div>
                  <div>
                    <div className="text-4xl font-display font-bold text-white mb-2">
                      <AnimatedCounter target={metrics?.nationsReached || 20} />
                    </div>
                    <div className="text-xs font-bold text-accent-gold-primary uppercase tracking-widest">Nations Reached</div>
                  </div>
                </div>
              </FadeInUp>
            </div>

            <div className="lg:w-1/2 relative flex items-center justify-center mt-12 lg:mt-0">
              <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] flex items-center justify-center">
                {/* Central Vision */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-full bg-accent-gold-primary flex items-center justify-center z-10 shadow-[0_0_50px_rgba(212,175,55,0.3)]"
                >
                  <div className="text-center text-bg-midnight p-2 md:p-4">
                    <Zap className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2" />
                    <span className="font-display font-bold text-[10px] sm:text-xs md:text-lg leading-tight block">DIVINE VISION</span>
                  </div>
                </motion.div>

                {/* Orbiting Elements */}
                <div className="absolute inset-0 orbit-animation">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center border border-accent-gold-primary/30">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 text-accent-gold-primary" />
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center border border-accent-gold-primary/30">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 text-accent-gold-primary" />
                  </div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center border border-accent-gold-primary/30">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 text-accent-gold-primary" />
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full glass-card flex items-center justify-center border border-accent-gold-primary/30">
                    <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 text-accent-gold-primary" />
                  </div>
                </div>

                {/* Orbit Rings */}
                <div className="absolute inset-0 border border-border-gold rounded-full opacity-20" />
                <div className="absolute inset-[-50px] border border-border-gold rounded-full opacity-10" />
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Ministry Arms - Bento Box Grid */}
      <LazySection className="section-padding relative bg-bg-navy-soft">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-20">
            <h2 className="text-xs font-bold text-accent-gold-primary uppercase tracking-[0.3em] mb-4">Ministry Architecture</h2>
            <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">A Multi-Dimensional Impact</h3>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            {bentoItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.02,
                  boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(212, 175, 55, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: item.delay, duration: 0.5, type: "spring", stiffness: 300, damping: 20 }}
                className={`bento-tile p-6 md:p-8 flex flex-col justify-between group ${item.size} min-h-[320px] cursor-pointer`}
              >
                <div>
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    {item.icon}
                  </div>
                  <h4 className="text-2xl font-display font-bold text-white mb-4">{item.title}</h4>
                  <p className="text-text-muted font-light leading-relaxed">{item.description}</p>
                </div>
                <Link to={item.link} className="text-accent-gold-primary font-bold text-sm inline-flex items-center gap-2 mt-6 hover:gap-4 transition-all">
                  Learn More <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </LazySection>

      {/* Latest Teaching */}
      <LazySection className="py-24 bg-bg-navy-deep border-y border-border-soft">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-xs font-bold text-accent-gold-primary uppercase tracking-[0.3em] mb-4">Latest Teaching</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white">Spiritual Wisdom</h3>
          </FadeInUp>

          <div className="glass-card p-8 md:p-12 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="w-full md:w-1/2 aspect-video bg-black rounded-2xl overflow-hidden ring-1 ring-border-soft">
                {latestVideo && (
                  <LazyYouTube 
                    videoId={latestVideo.youtubeId} 
                    title={latestVideo.title}
                  />
                )}
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-accent-gold-primary text-xs font-bold uppercase tracking-widest mb-4">
                  <Play className="w-4 h-4 fill-current" /> Now Playing
                </div>
                <h4 className="text-3xl font-display font-bold text-white mb-6">{latestVideo?.title || 'Experience the Word'}</h4>
                <p className="text-text-muted font-light mb-10 leading-relaxed">Dive deep into spiritual truths and practical wisdom for modern living with Pastor Efe Ovenseri.</p>
                <Link to="/sermons" className="gold-premium-btn text-center">View All Sermons</Link>
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Testimonials Section */}
      <LazySection className="section-padding relative bg-bg-navy-soft overflow-hidden">
        <div className="divine-glow top-0 right-0 opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-xs font-bold text-accent-gold-primary uppercase tracking-[0.3em] mb-4">Testimonials</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Voices of Transformation</h3>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Minister George Owen",
                role: "General Coordinator of The Redeemed Assemblies",
                content: "Serving alongside Pastor Efe has been a masterclass in Kingdom coordination. His vision for The Redeemed Assemblies is not just strategic, but deeply rooted in divine revelation and a genuine love for God's people.",
                initials: "GO"
              },
              {
                name: "Pastor Paul Iheanyichukwu",
                role: "Spiritual Son to Pastor Efe Ovenseri",
                content: "As a spiritual son, I have witnessed firsthand the depth of Pastor Efe's consecration. His life is a living testament to the power of mentorship and the beauty of walking in one's calling with absolute integrity.",
                initials: "PI"
              },
              {
                name: "Barrister Blessing Iheanyichukwu",
                role: "Congregational Member",
                content: "The spiritual nourishment I receive as a member of this congregation is unparalleled. Pastor Efe's teachings have provided me with the spiritual clarity and divine wisdom to excel in my legal profession.",
                initials: "BI"
              },
              {
                name: "Minister Victoria Owen",
                role: "Congregational Member",
                content: "Being part of this ministry has been a journey of profound growth. The atmosphere of worship and the clarity of the Word delivered by Pastor Efe create a space for true transformation and divine encounters.",
                initials: "VO"
              },
              {
                name: "Minister Vivian",
                role: "Congregational Member",
                content: "I have found a home and a purpose at The Redeemed Assemblies. Pastor Efe's heart for the people and his dedication to the truth have anchored my faith and empowered me to live a life of impact.",
                initials: "V"
              },
              {
                name: "Minister Victor Bilau",
                role: "Ministry Partner & Congregational Member",
                content: "Partnering with this ministry is an investment in the Kingdom. Pastor Efe's integrity in the marketplace and his passion for the Gospel make him a leader worth following and supporting globally.",
                initials: "VB"
              }
            ].map((testimonial, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <div className="glass-card p-8 h-full flex flex-col relative group hover:scale-[1.02] transition-all duration-500">
                  <Quote className="absolute top-6 right-8 w-[31px] h-[31px] text-accent-gold-primary/10 group-hover:text-accent-gold-primary/20 transition-colors" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full border-2 border-accent-gold-primary/30 bg-accent-gold-primary/10 flex items-center justify-center text-accent-gold-primary font-display font-bold text-xl">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{testimonial.name}</h4>
                      <p className="text-accent-gold-primary text-[10px] uppercase tracking-widest leading-tight mt-1">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-text-secondary font-light leading-relaxed italic">"{testimonial.content}"</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </LazySection>

      {/* Latest News Section */}
      <LazySection className="section-padding relative bg-bg-navy-deep border-y border-border-soft">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <FadeInUp className="text-left">
              <h2 className="text-xs font-bold text-accent-gold-primary uppercase tracking-[0.3em] mb-4">Latest News</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white">Ministry Updates</h3>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <Link to="/blog" className="text-accent-gold-primary font-bold text-sm inline-flex items-center gap-2 hover:gap-4 transition-all">
                View All News <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeInUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "New Mission Outreach in East Africa",
                date: "March 25, 2026",
                category: "Missions",
                icon: <Globe className="w-5 h-5" />,
                excerpt: "We are excited to announce our latest mission outreach program aimed at providing clean water and spiritual support to remote villages.",
                details: "Our team will be traveling to Kenya and Tanzania over the next three months. We aim to establish sustainable water systems in five major villages and partner with local churches to provide educational resources for children. This mission is part of our 2026 Global Impact initiative."
              },
              {
                title: "Leadership Summit 2026 Announced",
                date: "March 10, 2026",
                category: "Events",
                icon: <Bell className="w-5 h-5" />,
                excerpt: "Join us for a three-day intensive leadership summit designed to empower marketplace and ministry leaders with Kingdom principles.",
                details: "The summit will feature keynote speakers from both the corporate world and global ministries. Workshops will cover topics such as 'Ethical Entrepreneurship', 'Spiritual Intelligence in Leadership', and 'Building Sustainable Communities'. Registration opens next week."
              }
            ].map((news, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <div 
                  onClick={() => setExpandedNewsIndex(expandedNewsIndex === i ? null : i)}
                  className={`glass-card p-8 group cursor-pointer transition-all duration-500 ${expandedNewsIndex === i ? 'bg-white/10 border-accent-gold-primary/50' : 'hover:bg-white/5'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 text-accent-gold-primary text-xs font-bold uppercase tracking-widest">
                      {news.icon}
                      <span>{news.category}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-text-muted">{news.date}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedNewsIndex === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight className="w-5 h-5 text-accent-gold-primary/50" />
                    </motion.div>
                  </div>
                  <h4 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-accent-gold-primary transition-colors">{news.title}</h4>
                  <p className="text-text-muted font-light leading-relaxed">{news.excerpt}</p>
                  
                  <AnimatePresence>
                    {expandedNewsIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 mt-6 border-t border-white/10">
                          <p className="text-text-secondary font-light leading-relaxed italic">
                            {news.details}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-2 text-white font-bold text-sm mt-6">
                    {expandedNewsIndex === i ? 'Show Less' : 'Read Full Story'} 
                    <ChevronRight className={`w-4 h-4 text-accent-gold-primary transition-transform duration-300 ${expandedNewsIndex === i ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>

          {/* Newsletter Subscription */}
          <FadeInUp delay={0.3} className="mt-20">
            <div className="glass-card p-8 md:p-12 relative overflow-hidden">
              <div className="divine-glow -top-24 -right-24 opacity-20"></div>
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="text-left max-w-xl">
                  <h4 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">Stay Connected with the Vision</h4>
                  <p className="text-text-secondary font-light leading-relaxed">
                    Subscribe to our newsletter for exclusive leadership insights, ministry updates, and divine inspiration delivered directly to your inbox.
                  </p>
                </div>
                <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      required
                      className="flex-1 bg-white/5 border border-border-soft rounded-xl px-6 py-4 text-white placeholder:text-text-muted focus:outline-none focus:border-accent-gold-primary transition-all"
                    />
                    <button
                      type="submit"
                      disabled={subscribeStatus === 'loading'}
                      className="gold-premium-btn px-8 py-4 whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {subscribeStatus === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-bg-midnight border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Bell className="w-5 h-5" />
                          Subscribe
                        </>
                      )}
                    </button>
                  </div>
                  <AnimatePresence>
                    {subscribeStatus === 'success' && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-accent-gold-primary text-sm font-bold mt-4 flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Thank you! You've successfully subscribed to our newsletter.
                      </motion.p>
                    )}
                    {subscribeStatus === 'error' && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-400 text-sm font-bold mt-4"
                      >
                        Something went wrong. Please try again later.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </FadeInUp>
        </div>
      </LazySection>

      {/* Events Calendar Section */}
      <LazySection className="section-padding relative bg-bg-navy-soft">
        <div className="container mx-auto px-4">
          <FadeInUp className="text-center mb-16">
            <h2 className="text-xs font-bold text-accent-gold-primary uppercase tracking-[0.3em] mb-4">Events Calendar</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Upcoming Gatherings</h3>
          </FadeInUp>

          <div className="max-w-5xl mx-auto space-y-8">
            {[
              {
                title: "Vision Sunday Service",
                date: "Every Sunday",
                time: "1:00 PM",
                location: "Main Sanctuary & Online"
              },
              {
                title: "Mid-Week Spiritual Growth",
                date: "Every Monday - Friday",
                time: "9:00 PM Daily",
                location: "Online via TikTok"
              },
              {
                title: "Night of Blaze",
                date: "Last Friday of Month",
                time: "11:50 PM",
                location: "Main Sanctuary & Online"
              }
            ].map((event, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <div className="glass-card p-8 md:p-10 group hover:border-accent-gold-primary/50 transition-all duration-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Calendar className="w-32 h-32 -mr-8 -mt-8 text-accent-gold-primary" />
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    {/* Date Badge */}
                    <div className="w-full md:w-36 h-36 rounded-[2rem] bg-accent-gold-primary/5 border border-accent-gold-primary/20 flex flex-col items-center justify-center text-accent-gold-primary shrink-0 group-hover:bg-accent-gold-primary/10 transition-all duration-500 shadow-premium">
                      <Calendar className="w-8 h-8 mb-3" />
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-center px-4 leading-tight">
                        {event.date}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow text-center md:text-left">
                      <h4 className="text-2xl md:text-4xl font-display font-bold text-white mb-4 group-hover:text-accent-gold-primary transition-colors duration-500">
                        {event.title}
                      </h4>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-text-secondary">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <Clock className="w-5 h-5 text-accent-gold-primary" />
                          </div>
                          <span className="text-lg font-light">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <MapPin className="w-5 h-5 text-accent-gold-primary" />
                          </div>
                          <span className="text-lg font-light">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0 w-full md:w-auto">
                      <button 
                        onClick={() => handleAddToCalendar(event)}
                        className="gold-premium-btn w-full md:w-auto px-8 py-4 text-sm font-bold flex items-center justify-center gap-3 group/btn hover:scale-105 active:scale-95 transition-all"
                      >
                        <Bell className="w-5 h-5 group-hover/btn:animate-bounce" />
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </LazySection>

      {/* Global CTA */}
      <LazySection className="section-padding relative overflow-hidden bg-bg-midnight">
        <div className="divine-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <FadeInUp className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-7xl font-display font-black text-white mb-8 leading-tight">
              Ready to advance the <span className="gold-gradient-text">Kingdom</span> together?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/contact" className="gold-premium-btn px-12 py-5 text-lg">
                Become a Partner
              </Link>
              <Link to="/contact" className="gold-outline-btn px-12 py-5 text-lg flex items-center justify-center gap-3">
                Book Pastor Efe <Calendar className="w-5 h-5" />
              </Link>
            </div>
          </FadeInUp>
        </div>
      </LazySection>
    </div>
  );
}
