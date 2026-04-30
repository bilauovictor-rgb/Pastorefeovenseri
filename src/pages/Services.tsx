import { Church, Globe, ShieldCheck, Briefcase, CheckCircle, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { motion } from 'motion/react';

export default function Services() {
  return (
    <div className="page-section active bg-bg-midnight min-h-screen">
      <SEO title="Ministry Architecture" description="Explore the multi-dimensional ministry of Pastor Efe Ovenseri, covering pastoral care, global missions, administrative oversight, and marketplace leadership." />
      
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
            Ministry Architecture
          </motion.div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-text-on-dark-primary mb-8 leading-[0.9] tracking-tighter">
            Divine <span className="gold-gradient-text">Operations</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-on-dark-secondary leading-relaxed font-light max-w-3xl mx-auto">
            A structured overview of the pastoral, administrative, and global outreach divisions under the oversight of Pastor Efe Ovenseri.
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
                <Church className="w-10 h-10 text-accent-gold-primary group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
              </div>
              <h3 className="text-3xl font-display font-bold text-text-on-dark-primary mb-6 group-hover:text-accent-gold-primary transition-colors duration-500">Pastoral Leadership & Care</h3>
              <p className="text-text-on-dark-secondary leading-relaxed mb-10 text-lg font-light opacity-80">
                Serving as the Senior Pastor of The Redeemed Assemblies, Availeith City. This arm is dedicated to direct congregational care, delivering transformative teachings, and cultivating a local community rooted in biblical truths and mutual love.
              </p>
              <ul className="space-y-5 text-text-on-dark-primary font-medium">
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Weekly Expository Teaching</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Family & Marriage Counseling</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Local Community Outreach</li>
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
                <Globe className="w-10 h-10 text-accent-gold-primary group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
              </div>
              <h3 className="text-3xl font-display font-bold text-text-on-dark-primary mb-6 group-hover:text-accent-gold-primary transition-colors duration-500">Global Mission Directorate</h3>
              <p className="text-text-on-dark-secondary leading-relaxed mb-10 text-lg font-light opacity-80">
                Operating as the Mission Director across the ministry network. This division oversees cross-cultural evangelism, supports international church plants, and coordinates critical relationships between pastors and missionaries.
              </p>
              <ul className="space-y-5 text-text-on-dark-primary font-medium">
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> International Pastoral Networking</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Cross-Border Evangelism</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Missionary Funding & Support</li>
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
                <ShieldCheck className="w-10 h-10 text-accent-gold-primary group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
              </div>
              <h3 className="text-3xl font-display font-bold text-text-on-dark-primary mb-6 group-hover:text-accent-gold-primary transition-colors duration-500">Administrative Oversight</h3>
              <p className="text-text-on-dark-secondary leading-relaxed mb-10 text-lg font-light opacity-80">
                As General Assistant Superintendent, Pastor Ovenseri provides critical structural and administrative support to the General Superintendent, ensuring that the entire ministry operates with excellence, order, and strategic foresight.
              </p>
              <ul className="space-y-5 text-text-on-dark-primary font-medium">
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Organizational Strategy</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Leadership Development</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Structural Compliance</li>
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
                <Briefcase className="w-10 h-10 text-accent-gold-primary group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all" />
              </div>
              <h3 className="text-3xl font-display font-bold text-text-on-dark-primary mb-6 group-hover:text-accent-gold-primary transition-colors duration-500">Marketplace & Enterprise</h3>
              <p className="text-text-on-dark-secondary leading-relaxed mb-10 text-lg font-light opacity-80">
                A testament to the balanced Christian life. Bringing integrity and kingdom values into the secular workspace through extensive involvement in international import/export, civil engineering operations, and entrepreneurship.
              </p>
              <ul className="space-y-5 text-text-on-dark-primary font-medium">
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Business Mentorship</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Kingdom Wealth Principles</li>
                <li className="flex items-center group/item"><CheckCircle className="w-6 h-6 text-accent-gold-primary mr-4 transition-transform group-hover/item:scale-110" /> Professional Integrity Training</li>
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
