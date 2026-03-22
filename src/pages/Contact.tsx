import { Mail, MapPin, Briefcase } from 'lucide-react';
import { SEO } from '../components/SEO';

export function Contact() {
  return (
    <div className="page-section bg-surface-50 active">
      <SEO title="Contact & Partnership" description="Connect with Pastor Efe Ovenseri for speaking engagements, ministry partnerships, or church membership inquiries." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="bg-white rounded-3xl border border-surface-100 shadow-saas-lg overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Contact Details Side */}
            <div className="bg-text-main p-12 lg:p-16 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 z-0"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">Let's Connect</h2>
                <p className="text-slate-300 mb-12 text-lg">Whether you're looking to invite Pastor Efe for a speaking engagement, partner with global missions, or join Availeith City.</p>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4 pt-1">
                      <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Email Inquiry</p>
                      <p className="text-lg font-medium text-white">contact@pastorefeovenseri.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4 pt-1">
                      <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Church Location</p>
                      <p className="text-lg font-medium text-white">The Redeemed Assemblies<br/><span className="text-slate-300 text-base">Availeith City Branch, UK</span></p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4 pt-1">
                      <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Ministry Roles</p>
                      <p className="text-sm text-slate-300">Senior Pastor • Mission Director • GAS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-12 lg:p-16">
              <h3 className="text-2xl font-display font-bold text-text-main mb-8">Send a Message</h3>
              <form action="#" method="POST" className="space-y-6" aria-label="Contact form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-semibold text-text-main mb-2">First Name</label>
                    <input id="first-name" type="text" className="w-full px-4 py-3 rounded-xl border border-surface-100 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" placeholder="John" />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-semibold text-text-main mb-2">Last Name</label>
                    <input id="last-name" type="text" className="w-full px-4 py-3 rounded-xl border border-surface-100 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-text-main mb-2">Email Address</label>
                  <input id="email" type="email" className="w-full px-4 py-3 rounded-xl border border-surface-100 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none" placeholder="john@company.com" />
                </div>

                <div>
                  <label htmlFor="inquiry-type" className="block text-sm font-semibold text-text-main mb-2">Inquiry Type</label>
                  <select id="inquiry-type" className="w-full px-4 py-3 rounded-xl border border-surface-100 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none text-text-muted">
                    <option>Speaking Engagement</option>
                    <option>Ministry Partnership</option>
                    <option>Church Membership Inquiry</option>
                    <option>General Support</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-text-main mb-2">Message</label>
                  <textarea id="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-surface-100 bg-surface-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none resize-none" placeholder="How can we collaborate?"></textarea>
                </div>

                <button type="submit" onClick={() => alert('Submission connected to backend processing.')} className="w-full py-4 bg-brand-500 text-white rounded-xl font-semibold text-lg hover:bg-brand-600 shadow-sm transition-all duration-300 mt-4">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
