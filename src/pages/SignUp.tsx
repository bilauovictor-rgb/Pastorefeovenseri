import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, User, Send, CheckCircle, ArrowLeft } from 'lucide-react';

export function SignUp() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, this would send an email or save to a "requests" collection
    console.log("Access Request Submitted:", formData);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-bg-light-primary">
      <SEO title="Request Access" description="Request administrative access to the Pastor Efe Ovenseri dashboard." />
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-bg-dark-secondary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-gold-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgba(26,11,46,0.04)] border border-border-light-soft">
          <div className="w-16 h-16 bg-bg-dark-secondary/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-border-light-soft">
            <ShieldCheck className="w-8 h-8 text-accent-gold-primary" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-text-on-light-primary mb-4 text-center">Request Admin Access</h1>
          <p className="text-text-on-light-secondary mb-10 leading-relaxed text-center max-w-md mx-auto">
            The administrative dashboard is reserved for authorized ministry staff. Please submit your request below.
          </p>

          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-display font-bold text-text-on-light-primary mb-4">Request Received</h2>
              <p className="text-text-on-light-secondary mb-8">
                Thank you for your request. Our administrative team will review it and contact you via email shortly.
              </p>
              <Link 
                to="/signin" 
                className="inline-flex items-center px-8 py-3 bg-bg-dark-secondary hover:bg-bg-dark-tertiary text-white rounded-xl font-bold transition-all gap-2 shadow-lg shadow-bg-dark-secondary/20"
              >
                <ArrowLeft className="w-5 h-5 text-accent-gold-primary" /> Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-on-light-primary mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-accent-gold-primary" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-white border border-border-light-soft text-text-on-light-primary rounded-xl focus:ring-2 focus:ring-accent-gold-primary focus:border-accent-gold-primary outline-none transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-on-light-primary mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent-gold-primary" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 bg-white border border-border-light-soft text-text-on-light-primary rounded-xl focus:ring-2 focus:ring-accent-gold-primary focus:border-accent-gold-primary outline-none transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-on-light-primary mb-2">Reason for Access</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-border-light-soft text-text-on-light-primary rounded-xl focus:ring-2 focus:ring-accent-gold-primary focus:border-accent-gold-primary outline-none transition-all resize-none"
                  placeholder="Explain your role in the ministry and why you need access..."
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-bg-dark-secondary hover:bg-bg-dark-tertiary text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-bg-dark-secondary/20"
              >
                <Send className="w-5 h-5 text-accent-gold-primary" /> Submit Request
              </button>
              <div className="text-center pt-4">
                <Link to="/signin" className="text-sm text-bg-dark-secondary font-bold hover:text-accent-gold-primary transition-colors">
                  Already have access? Sign In
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-text-on-light-muted hover:text-text-on-light-primary transition-colors font-medium">
            &larr; Back to Public Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
