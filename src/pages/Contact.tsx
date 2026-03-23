import { Mail, MapPin, Briefcase } from 'lucide-react';
import { SEO } from '../components/SEO';

export function Contact() {
  return (
    <div className="min-h-screen bg-bg-dark-primary relative overflow-hidden">
      <SEO title="Contact & Partnership" description="Connect with Pastor Efe Ovenseri for speaking engagements, ministry partnerships, or church membership inquiries." />
      
      {/* Warm Light Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent-gold-secondary/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-gold-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        
        <div className="bg-bg-dark-secondary border border-border-dark-soft rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="grid lg:grid-cols-2">
            {/* Contact Details Side */}
            <div className="p-12 lg:p-16 text-white relative overflow-hidden bg-bg-dark-primary/50 backdrop-blur-md border-r border-border-dark-soft">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold-secondary/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4 text-text-on-dark-primary">Let's Connect</h2>
                <p className="text-text-on-dark-secondary mb-12 text-lg">Whether you're looking to invite Pastor Efe for a speaking engagement, partner with global missions, or join Availeith City.</p>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-border-dark-soft">
                      <Mail className="w-6 h-6 text-accent-gold-secondary" />
                    </div>
                    <div className="ml-4 pt-1">
                      <p className="text-sm text-text-on-dark-secondary font-medium uppercase tracking-wider mb-1">Email Inquiry</p>
                      <p className="text-lg font-medium text-text-on-dark-primary">contact@pastorefeovenseri.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-border-dark-soft">
                      <MapPin className="w-6 h-6 text-accent-gold-secondary" />
                    </div>
                    <div className="ml-4 pt-1">
                      <p className="text-sm text-text-on-dark-secondary font-medium uppercase tracking-wider mb-1">Church Location</p>
                      <p className="text-lg font-medium text-text-on-dark-primary">The Redeemed Assemblies<br/><span className="text-text-on-dark-secondary text-base">Availeith City Branch, UK</span></p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-border-dark-soft">
                      <Briefcase className="w-6 h-6 text-accent-gold-secondary" />
                    </div>
                    <div className="ml-4 pt-1">
                      <p className="text-sm text-text-on-dark-secondary font-medium uppercase tracking-wider mb-1">Ministry Roles</p>
                      <p className="text-sm text-text-on-dark-secondary">Senior Pastor • Mission Director • GAS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-12 lg:p-16 bg-bg-dark-primary">
              <h3 className="text-2xl font-display font-bold text-text-on-dark-primary mb-8">Send a Message</h3>
              <form action="#" method="POST" className="space-y-6" aria-label="Contact form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-semibold text-text-on-dark-primary mb-2">First Name</label>
                    <input id="first-name" type="text" className="w-full px-4 py-3 rounded-xl border border-border-dark-soft bg-white/5 text-text-on-dark-primary focus:bg-white/10 focus:ring-2 focus:ring-accent-gold-secondary focus:border-accent-gold-secondary transition-all outline-none" placeholder="John" />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-semibold text-text-on-dark-primary mb-2">Last Name</label>
                    <input id="last-name" type="text" className="w-full px-4 py-3 rounded-xl border border-border-dark-soft bg-white/5 text-text-on-dark-primary focus:bg-white/10 focus:ring-2 focus:ring-accent-gold-secondary focus:border-accent-gold-secondary transition-all outline-none" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-text-on-dark-primary mb-2">Email Address</label>
                  <input id="email" type="email" className="w-full px-4 py-3 rounded-xl border border-border-dark-soft bg-white/5 text-text-on-dark-primary focus:bg-white/10 focus:ring-2 focus:ring-accent-gold-secondary focus:border-accent-gold-secondary transition-all outline-none" placeholder="john@company.com" />
                </div>

                <div>
                  <label htmlFor="inquiry-type" className="block text-sm font-semibold text-text-on-dark-primary mb-2">Inquiry Type</label>
                  <select id="inquiry-type" className="w-full px-4 py-3 rounded-xl border border-border-dark-soft bg-white/5 text-text-on-dark-primary focus:bg-white/10 focus:ring-2 focus:ring-accent-gold-secondary focus:border-accent-gold-secondary transition-all outline-none">
                    <option className="bg-bg-dark-primary text-text-on-dark-primary">Speaking Engagement</option>
                    <option className="bg-bg-dark-primary text-text-on-dark-primary">Ministry Partnership</option>
                    <option className="bg-bg-dark-primary text-text-on-dark-primary">Church Membership Inquiry</option>
                    <option className="bg-bg-dark-primary text-text-on-dark-primary">General Support</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-text-on-dark-primary mb-2">Message</label>
                  <textarea id="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-border-dark-soft bg-white/5 text-text-on-dark-primary focus:bg-white/10 focus:ring-2 focus:ring-accent-gold-secondary focus:border-accent-gold-secondary transition-all outline-none resize-none" placeholder="How can we collaborate?"></textarea>
                </div>

                <button type="submit" className="w-full py-4 gold-premium-btn rounded-xl font-bold text-lg mt-4 inline-flex items-center justify-center gap-2">
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
