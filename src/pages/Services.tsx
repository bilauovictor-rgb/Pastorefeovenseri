import { Church, Globe, ShieldCheck, Briefcase, CheckCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

export function Services() {
  return (
    <div className="page-section bg-surface-50 active">
      <SEO title="Ministry Arms" description="Explore the multi-dimensional ministry of Pastor Efe Ovenseri, covering pastoral care, global missions, administrative oversight, and marketplace leadership." />
      <div className="relative overflow-hidden bg-white border-b border-surface-100 pt-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-50 via-white to-gold-50 animate-gradient opacity-30 z-0"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-main mb-6">Comprehensive Ministry Operations</h1>
          <p className="text-xl text-text-muted leading-relaxed">A structured overview of the pastoral, administrative, and global outreach divisions under the oversight of Pastor Efe Ovenseri.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Feature Card 1 */}
          <div className="bg-white p-10 rounded-3xl border border-surface-100 shadow-saas hover:shadow-saas-lg transition-all duration-300">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-8">
              <Church className="w-8 h-8 text-brand-500" />
            </div>
            <h3 className="text-2xl font-display font-bold text-text-main mb-4">Pastoral Leadership & Care</h3>
            <p className="text-text-muted leading-relaxed mb-6 text-lg">
              Serving as the Senior Pastor of The Redeemed Assemblies, Availeith City. This arm is dedicated to direct congregational care, delivering transformative teachings, and cultivating a local community rooted in biblical truths and mutual love.
            </p>
            <ul className="space-y-3 text-text-main font-medium">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-brand-500 mr-3 fill-current" /> Weekly Expository Teaching</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-brand-500 mr-3 fill-current" /> Family & Marriage Counseling</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-brand-500 mr-3 fill-current" /> Local Community Outreach</li>
            </ul>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-white p-10 rounded-3xl border border-surface-100 shadow-saas hover:shadow-saas-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gold-100 rounded-2xl flex items-center justify-center mb-8">
              <Globe className="w-8 h-8 text-gold-600" />
            </div>
            <h3 className="text-2xl font-display font-bold text-text-main mb-4">Global Mission Directorate</h3>
            <p className="text-text-muted leading-relaxed mb-6 text-lg">
              Operating as the Mission Director across the ministry network. This division oversees cross-cultural evangelism, supports international church plants, and coordinates critical relationships between pastors and missionaries.
            </p>
            <ul className="space-y-3 text-text-main font-medium">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-gold-500 mr-3 fill-current" /> International Pastoral Networking</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-gold-500 mr-3 fill-current" /> Cross-Border Evangelism</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-gold-500 mr-3 fill-current" /> Missionary Funding & Support</li>
            </ul>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-white p-10 rounded-3xl border border-surface-100 shadow-saas hover:shadow-saas-lg transition-all duration-300">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck className="w-8 h-8 text-brand-500" />
            </div>
            <h3 className="text-2xl font-display font-bold text-text-main mb-4">Administrative Oversight (GAS)</h3>
            <p className="text-text-muted leading-relaxed mb-6 text-lg">
              As General Assistant Superintendent, Pastor Ovenseri provides critical structural and administrative support to the General Superintendent, ensuring that the entire ministry operates with excellence, order, and strategic foresight.
            </p>
            <ul className="space-y-3 text-text-main font-medium">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-brand-500 mr-3 fill-current" /> Organizational Strategy</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-brand-500 mr-3 fill-current" /> Leadership Development</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-brand-500 mr-3 fill-current" /> Structural Compliance</li>
            </ul>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-white p-10 rounded-3xl border border-surface-100 shadow-saas hover:shadow-saas-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gold-100 rounded-2xl flex items-center justify-center mb-8">
              <Briefcase className="w-8 h-8 text-gold-600" />
            </div>
            <h3 className="text-2xl font-display font-bold text-text-main mb-4">Marketplace & Enterprise</h3>
            <p className="text-text-muted leading-relaxed mb-6 text-lg">
              A testament to the balanced Christian life. Bringing integrity and kingdom values into the secular workspace through extensive involvement in international import/export, civil engineering operations, and entrepreneurship.
            </p>
            <ul className="space-y-3 text-text-main font-medium">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-gold-500 mr-3 fill-current" /> Business Mentorship</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-gold-500 mr-3 fill-current" /> Kingdom Wealth Principles</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-gold-500 mr-3 fill-current" /> Professional Integrity Training</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
