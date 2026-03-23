import { Church, Globe, ShieldCheck, Briefcase, CheckCircle, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function Services() {
  return (
    <div className="page-section active bg-bg-dark-primary min-h-screen">
      <SEO title="Ministry Arms" description="Explore the multi-dimensional ministry of Pastor Efe Ovenseri, covering pastoral care, global missions, administrative oversight, and marketplace leadership." />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 bg-bg-dark-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-dark-primary via-bg-dark-secondary to-bg-dark-tertiary opacity-80"></div>
        <div className="divine-glow -top-20 -left-20 opacity-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-gold-secondary text-sm font-semibold tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
            Ministry Architecture
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-text-on-dark-primary mb-6 leading-tight">
            Comprehensive<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold-secondary to-accent-gold-primary">Ministry Operations</span>
          </h1>
          <p className="text-xl text-text-on-dark-secondary leading-relaxed font-light max-w-3xl mx-auto">
            A structured overview of the pastoral, administrative, and global outreach divisions under the oversight of Pastor Efe Ovenseri.
          </p>
        </div>
      </div>

      {/* Ministry Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="purple-glow bottom-0 right-0 opacity-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          
          {/* Feature Card 1 */}
          <div className="bg-bg-dark-secondary/80 backdrop-blur-md border border-border-dark-soft p-10 rounded-3xl hover:border-accent-gold-secondary/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-bg-dark-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-bg-dark-secondary rounded-2xl flex items-center justify-center mb-8 border border-border-dark-soft group-hover:border-accent-gold-secondary/50 transition-all duration-300 shadow-[0_0_15px_rgba(45,27,105,0.5)]">
                <Church className="w-8 h-8 text-accent-gold-secondary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-text-on-dark-primary mb-4">Pastoral Leadership & Care</h3>
              <p className="text-text-on-dark-secondary leading-relaxed mb-8 text-lg font-light">
                Serving as the Senior Pastor of The Redeemed Assemblies, Availeith City. This arm is dedicated to direct congregational care, delivering transformative teachings, and cultivating a local community rooted in biblical truths and mutual love.
              </p>
              <ul className="space-y-4 text-text-on-dark-primary font-medium">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-accent-gold-secondary mr-3 fill-current" /> Weekly Expository Teaching</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-accent-gold-secondary mr-3 fill-current" /> Family & Marriage Counseling</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-accent-gold-secondary mr-3 fill-current" /> Local Community Outreach</li>
              </ul>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-bg-dark-secondary/80 backdrop-blur-md border border-border-dark-soft p-10 rounded-3xl hover:border-accent-gold-secondary/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-bg-dark-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-bg-dark-secondary rounded-2xl flex items-center justify-center mb-8 border border-border-dark-soft group-hover:border-accent-gold-secondary/50 transition-all duration-300 shadow-[0_0_15px_rgba(45,27,105,0.5)]">
                <Globe className="w-8 h-8 text-accent-gold-secondary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-text-on-dark-primary mb-4">Global Mission Directorate</h3>
              <p className="text-text-on-dark-secondary leading-relaxed mb-8 text-lg font-light">
                Operating as the Mission Director across the ministry network. This division oversees cross-cultural evangelism, supports international church plants, and coordinates critical relationships between pastors and missionaries.
              </p>
              <ul className="space-y-4 text-text-on-dark-primary font-medium">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-accent-gold-secondary mr-3 fill-current" /> International Pastoral Networking</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-accent-gold-secondary mr-3 fill-current" /> Cross-Border Evangelism</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-accent-gold-secondary mr-3 fill-current" /> Missionary Funding & Support</li>
              </ul>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-bg-dark-secondary/80 backdrop-blur-md border border-border-dark-soft p-10 rounded-3xl hover:border-accent-gold-secondary/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-bg-dark-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-bg-dark-secondary rounded-2xl flex items-center justify-center mb-8 border border-border-dark-soft group-hover:border-accent-gold-secondary/50 transition-all duration-300 shadow-[0_0_15px_rgba(45,27,105,0.5)]">
                <ShieldCheck className="w-8 h-8 text-accent-gold-secondary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-text-on-dark-primary mb-4">Administrative Oversight (GAS)</h3>
              <p className="text-text-on-dark-secondary leading-relaxed mb-8 text-lg font-light">
                As General Assistant Superintendent, Pastor Ovenseri provides critical structural and administrative support to the General Superintendent, ensuring that the entire ministry operates with excellence, order, and strategic foresight.
              </p>
              <ul className="space-y-4 text-text-on-dark-primary font-medium">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-accent-gold-secondary mr-3 fill-current" /> Organizational Strategy</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-accent-gold-secondary mr-3 fill-current" /> Leadership Development</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-accent-gold-secondary mr-3 fill-current" /> Structural Compliance</li>
              </ul>
            </div>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-bg-dark-secondary/80 backdrop-blur-md border border-border-dark-soft p-10 rounded-3xl hover:border-accent-gold-secondary/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-bg-dark-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-bg-dark-secondary rounded-2xl flex items-center justify-center mb-8 border border-border-dark-soft group-hover:border-accent-gold-secondary/50 transition-all duration-300 shadow-[0_0_15px_rgba(45,27,105,0.5)]">
                <Briefcase className="w-8 h-8 text-accent-gold-secondary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-text-on-dark-primary mb-4">Marketplace & Enterprise</h3>
              <p className="text-text-on-dark-secondary leading-relaxed mb-8 text-lg font-light">
                A testament to the balanced Christian life. Bringing integrity and kingdom values into the secular workspace through extensive involvement in international import/export, civil engineering operations, and entrepreneurship.
              </p>
              <ul className="space-y-4 text-text-on-dark-primary font-medium">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-accent-gold-secondary mr-3 fill-current" /> Business Mentorship</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-accent-gold-secondary mr-3 fill-current" /> Kingdom Wealth Principles</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-accent-gold-secondary mr-3 fill-current" /> Professional Integrity Training</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Services CTA */}
      <div className="py-24 relative overflow-hidden bg-bg-dark-secondary/30 border-t border-border-dark-soft">
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark-primary to-transparent opacity-80 z-0"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-text-on-dark-primary mb-6">
            Join the Vision
          </h2>
          <p className="text-xl text-text-on-dark-secondary mb-10 max-w-2xl mx-auto font-light">
            Whether in the church or the marketplace, there is a place for you to partner with this global mandate.
          </p>
          <Link to="/contact" className="px-8 py-4 gold-premium-btn rounded-xl font-bold text-lg inline-flex items-center justify-center gap-2">
            <HeartHandshake className="w-5 h-5" />
            Partner With Us
          </Link>
        </div>
      </div>
    </div>
  );
}
