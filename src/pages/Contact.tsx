import { useState } from 'react';
import { Mail, MapPin, Briefcase, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    inquiryType: 'Speaking Engagement',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const contactData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        subject: formData.inquiryType,
        message: formData.message,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'contacts'), contactData);
      setStatus('success');
      setValidationErrors({});
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        inquiryType: 'Speaking Engagement',
        message: ''
      });
    } catch (error: any) {
      setStatus('error');
      try {
        handleFirestoreError(error, OperationType.CREATE, 'contacts');
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-midnight relative overflow-hidden">
      <SEO title="Contact & Partnership" description="Connect with Pastor Efe Ovenseri for speaking engagements, ministry partnerships, or church membership inquiries. We look forward to hearing from you today." />
      
      {/* Divine Glow Elements */}
      <div className="divine-glow -top-40 -right-40 opacity-30"></div>
      <div className="divine-glow -bottom-40 -left-40 opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        
        <div className="glass-card border border-white/10 rounded-[2.5rem] overflow-hidden shadow-premium relative">
          <div className="grid lg:grid-cols-2">
            {/* Contact Details Side */}
            <div className="p-8 md:p-12 lg:p-20 text-text-on-dark-primary relative overflow-hidden bg-white/[0.02] backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="divine-glow -top-20 -right-20 opacity-20 scale-75"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 gold-gradient-text tracking-tight">Let's Connect</h2>
                <p className="text-text-on-dark-secondary mb-16 text-xl font-light leading-relaxed opacity-80">Whether you're looking to invite Pastor Efe for a speaking engagement, partner with global missions, or join Availeith City.</p>
                
                <div className="space-y-10">
                  <div className="flex items-start group">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-accent-gold-primary/50 transition-all duration-500 shadow-premium">
                      <Mail className="w-7 h-7 text-accent-gold-primary" />
                    </div>
                    <div className="ml-6 pt-1">
                      <p className="text-xs text-text-on-dark-secondary font-bold uppercase tracking-[0.3em] mb-2 opacity-60">Email Inquiry</p>
                      <p className="text-lg md:text-xl font-medium text-text-on-dark-primary group-hover:text-accent-gold-primary transition-colors break-all">contact@pastorefeovenseri.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start group">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-accent-gold-primary/50 transition-all duration-500 shadow-premium">
                      <MapPin className="w-7 h-7 text-accent-gold-primary" />
                    </div>
                    <div className="ml-6 pt-1">
                      <p className="text-xs text-text-on-dark-secondary font-bold uppercase tracking-[0.3em] mb-2 opacity-60">Church Location</p>
                      <p className="text-lg md:text-xl font-medium text-text-on-dark-primary group-hover:text-accent-gold-primary transition-colors">The Redeemed Assemblies<br/><span className="text-text-on-dark-secondary text-base md:text-lg font-light">Availeith City Branch, UK</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start group">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-accent-gold-primary/50 transition-all duration-500 shadow-premium">
                      <Briefcase className="w-7 h-7 text-accent-gold-primary" />
                    </div>
                    <div className="ml-6 pt-1">
                      <p className="text-xs text-text-on-dark-secondary font-bold uppercase tracking-[0.3em] mb-2 opacity-60">Ministry Roles</p>
                      <p className="text-base md:text-lg text-text-on-dark-secondary font-light">Senior Pastor • Mission Director • GAS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="p-8 md:p-12 lg:p-20 bg-bg-navy-deep/40 backdrop-blur-md">
              <h3 className="text-3xl font-display font-bold text-text-on-dark-primary mb-10 tracking-tight">Send a <span className="gold-gradient-text">Message</span></h3>
              
              {status === 'success' ? (
                <div className="glass-card border border-green-500/20 rounded-3xl p-12 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-text-on-dark-primary mb-4">Message sent successfully!</h4>
                  <p className="text-text-on-dark-secondary mb-10 text-lg font-light">Thank you for reaching out. We will get back to you as soon as possible.</p>
                  <button 
                    onClick={() => {
                      setStatus('idle');
                      setValidationErrors({});
                    }}
                    className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-text-on-dark-primary font-bold hover:bg-white/10 transition-all active:scale-95"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8" aria-label="Contact form">
                  {status === 'error' && (
                    <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-center gap-4 text-sm">
                      <AlertCircle className="w-6 h-6 shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="first-name" className="block text-xs font-bold text-text-on-dark-primary mb-3 uppercase tracking-widest opacity-70">First Name</label>
                      <input 
                        id="first-name" 
                        type="text" 
                        className={`w-full px-6 py-4 rounded-2xl border ${validationErrors.firstName ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-white/10'} bg-white/[0.03] text-text-on-dark-primary focus:bg-white/[0.05] focus:ring-2 focus:ring-accent-gold-primary/50 focus:border-accent-gold-primary/50 transition-all outline-none placeholder:text-white/20`} 
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, firstName: e.target.value }));
                          if (validationErrors.firstName) setValidationErrors(prev => ({ ...prev, firstName: '' }));
                        }}
                      />
                      {validationErrors.firstName && <p className="mt-2 text-[10px] text-red-400 font-bold uppercase tracking-wider ml-1">{validationErrors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="last-name" className="block text-xs font-bold text-text-on-dark-primary mb-3 uppercase tracking-widest opacity-70">Last Name</label>
                      <input 
                        id="last-name" 
                        type="text" 
                        className={`w-full px-6 py-4 rounded-2xl border ${validationErrors.lastName ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-white/10'} bg-white/[0.03] text-text-on-dark-primary focus:bg-white/[0.05] focus:ring-2 focus:ring-accent-gold-primary/50 focus:border-accent-gold-primary/50 transition-all outline-none placeholder:text-white/20`} 
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, lastName: e.target.value }));
                          if (validationErrors.lastName) setValidationErrors(prev => ({ ...prev, lastName: '' }));
                        }}
                      />
                      {validationErrors.lastName && <p className="mt-2 text-[10px] text-red-400 font-bold uppercase tracking-wider ml-1">{validationErrors.lastName}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-text-on-dark-primary mb-3 uppercase tracking-widest opacity-70">Email Address</label>
                    <input 
                      id="email" 
                      type="email" 
                      className={`w-full px-6 py-4 rounded-2xl border ${validationErrors.email ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-white/10'} bg-white/[0.03] text-text-on-dark-primary focus:bg-white/[0.05] focus:ring-2 focus:ring-accent-gold-primary/50 focus:border-accent-gold-primary/50 transition-all outline-none placeholder:text-white/20`} 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, email: e.target.value }));
                        if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: '' }));
                      }}
                    />
                    {validationErrors.email && <p className="mt-2 text-[10px] text-red-400 font-bold uppercase tracking-wider ml-1">{validationErrors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="inquiry-type" className="block text-xs font-bold text-text-on-dark-primary mb-3 uppercase tracking-widest opacity-70">Inquiry Type</label>
                    <select 
                      id="inquiry-type" 
                      className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-white/[0.03] text-text-on-dark-primary focus:bg-white/[0.05] focus:ring-2 focus:ring-accent-gold-primary/50 focus:border-accent-gold-primary/50 transition-all outline-none appearance-none cursor-pointer"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData(prev => ({ ...prev, inquiryType: e.target.value }))}
                    >
                      <option className="bg-bg-dark-primary text-text-on-dark-primary" value="Speaking Engagement">Speaking Engagement</option>
                      <option className="bg-bg-dark-primary text-text-on-dark-primary" value="Ministry Partnership">Ministry Partnership</option>
                      <option className="bg-bg-dark-primary text-text-on-dark-primary" value="Church Membership Inquiry">Church Membership Inquiry</option>
                      <option className="bg-bg-dark-primary text-text-on-dark-primary" value="General Support">General Support</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-text-on-dark-primary mb-3 uppercase tracking-widest opacity-70">Message</label>
                    <textarea 
                      id="message" 
                      rows={5} 
                      className={`w-full px-6 py-4 rounded-2xl border ${validationErrors.message ? 'border-red-500/50 ring-1 ring-red-500/20' : 'border-white/10'} bg-white/[0.03] text-text-on-dark-primary focus:bg-white/[0.05] focus:ring-2 focus:ring-accent-gold-primary/50 focus:border-accent-gold-primary/50 transition-all outline-none resize-none placeholder:text-white/20`} 
                      placeholder="How can we collaborate?"
                      value={formData.message}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, message: e.target.value }));
                        if (validationErrors.message) setValidationErrors(prev => ({ ...prev, message: '' }));
                      }}
                    ></textarea>
                    {validationErrors.message && <p className="mt-2 text-[10px] text-red-400 font-bold uppercase tracking-wider ml-1">{validationErrors.message}</p>}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-5 gold-premium-btn rounded-2xl font-bold text-xl mt-6 inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] shadow-premium"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
