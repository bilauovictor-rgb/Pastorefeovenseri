import { Music, BookOpen, Flame, Heart, CheckCircle, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { motion } from 'motion/react';

export default function Services() {
  return (
    <div className="page-section active bg-bg-midnight min-h-screen">
      <SEO title="Availeth City" description="Discover the heart of The Redeemed Assemblies, Availeth City — a ministry dedicated to worship, biblical teaching, prayer, and community impact." />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 bg-bg-navy-deep">
        <div className="divine-glow -top-40 -left-40 opacity-40"></div>
        <div className="divine-glow bottom-0 right-0 opacity-20"></div>
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-gold-primary text-xs font-bold tracking-[0.3em] uppercase mb-8 backdrop-blur-md"
          >
            The Ministry
          </motion.div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-text-on-dark-primary mb-8 leading-[0.9] tracking-tighter">
            The Redeemed <span className="gold-gradient-text">Assemblies</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-on-dark-secondary leading-relaxed font-light max-w-3xl mx-auto">
            Availeth City is a Christ-centered ministry committed to worship, biblical teaching, and community transformation under the leadership of Pastor Efe Ovenseri.
          </p>
        </div>
      </div>

      {/* Ministry Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative bg-bg-navy-soft">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
          
          {/* Feature Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -12, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 hover:border-accent-gold-primary/30 transition-all duration-700 group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-gold-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-10 border border-white/10 group-hover:border-accent-gold-primary/50 group-hover:scale-110 transition-all duration-500 shadow-premium">
                <Music className="w-10 h-10 text-accent-gold-primary group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
              </div>
              <h3 className="text-3xl font-display font-bold text-text-on-dark-primary mb-6 group-hover:text-accent-gold-primary transition-colors duration-500">Worship & Sunday Service</h3>
              <p className="text-text-on-dark-secondary leading-relaxed mb-10 text-lg font-light opacity-80">
                Experience the manifest presence of God during our weekly Sunday services. Our worship is a vibrant blend of contemporary and traditional expressions.
              </p>
              <ul className="space-y-5 text-text-on-dark-primary font-medium">
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Prophetic Worship Sessions</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Kingdom Testimony Sharing</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Dynamic Word Ministry</li>
              </ul>
            </div>
          </motion.div>

          {/* Feature Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -12, scale: 1.02 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
            className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 hover:border-accent-gold-primary/30 transition-all duration-700 group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-gold-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-10 border border-white/10 group-hover:border-accent-gold-primary/50 group-hover:scale-110 transition-all duration-500 shadow-premium">
                <BookOpen className="w-10 h-10 text-accent-gold-primary group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
              </div>
              <h3 className="text-3xl font-display font-bold text-text-on-dark-primary mb-6 group-hover:text-accent-gold-primary transition-colors duration-500">Biblical Teaching</h3>
              <p className="text-text-on-dark-secondary leading-relaxed mb-10 text-lg font-light opacity-80">
                Foundationally rooted in the Word, we provide structured teaching tracks to build believers into mature spiritual leaders and marketplace excellence.
              </p>
              <ul className="space-y-5 text-text-on-dark-primary font-medium">
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Foundation Discipleship Track</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Leadership Excellence Schools</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Expository Bible Studies</li>
              </ul>
            </div>
          </motion.div>

          {/* Feature Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -12, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 hover:border-accent-gold-primary/30 transition-all duration-700 group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-gold-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-10 border border-white/10 group-hover:border-accent-gold-primary/50 group-hover:scale-110 transition-all duration-500 shadow-premium">
                <Flame className="w-10 h-10 text-accent-gold-primary group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
              </div>
              <h3 className="text-3xl font-display font-bold text-text-on-dark-primary mb-6 group-hover:text-accent-gold-primary transition-colors duration-500">Prayer & Growth</h3>
              <p className="text-text-on-dark-secondary leading-relaxed mb-10 text-lg font-light opacity-80">
                Intercession is the engine of our ministry. We maintain consistent prayer altars that facilitate personal breakthroughs and community transformation.
              </p>
              <ul className="space-y-5 text-text-on-dark-primary font-medium">
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Mid-night Prayer Altars</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Prophetic Intercession Units</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> 24/7 Prayer Coverages</li>
              </ul>
            </div>
          </motion.div>

          {/* Feature Card 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -12, scale: 1.02 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
            className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 hover:border-accent-gold-primary/30 transition-all duration-700 group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-gold-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-10 border border-white/10 group-hover:border-accent-gold-primary/50 group-hover:scale-110 transition-all duration-500 shadow-premium">
                <Heart className="w-10 h-10 text-accent-gold-primary group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
              </div>
              <h3 className="text-3xl font-display font-bold text-text-on-dark-primary mb-6 group-hover:text-accent-gold-primary transition-colors duration-500">Outreach & Impact</h3>
              <p className="text-text-on-dark-secondary leading-relaxed mb-10 text-lg font-light opacity-80">
                Beyond the walls of the sanctuary, we reach out to the broken, vulnerable, and unchurched, bringing the practical love of Christ and community care.
              </p>
              <ul className="space-y-5 text-text-on-dark-primary font-medium">
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Local Community Feedings</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Global Mission Summits</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Prison & Hospital Visits</li>
              </ul>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Services CTA */}
      <div className="py-32 relative overflow-hidden border-t border-white/10 bg-bg-midnight">
        <div className="divine-glow -bottom-40 -right-40 opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-text-on-dark-primary mb-8 tracking-tight">
            Join the <span className="gold-gradient-text">Vision</span>
          </h2>
          <p className="text-xl text-text-on-dark-secondary mb-12 max-w-2xl mx-auto font-light opacity-80">
            Whether in the church or the marketplace, there is a place for you to partner with this global mandate.
          </p>
          <Link to="/contact" className="px-10 py-5 gold-premium-btn rounded-2xl font-bold text-xl inline-flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95">
            <HeartHandshake className="w-6 h-6" />
            Partner With Us
          </Link>
        </div>
      </div>
    </div>
  );
}
