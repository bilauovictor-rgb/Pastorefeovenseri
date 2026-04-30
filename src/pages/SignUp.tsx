import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, User, Send, CheckCircle, ArrowLeft } from 'lucide-react';

export default function SignUp() {
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-bg-midnight">
      <SEO title="Request Access" description="Request administrative access to the Pastor Efe Ovenseri Ministries dashboard. Authorized staff can submit requests for secure portal entry and management." />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_50%)]"></div>
      <div className="divine-glow top-0 right-0 opacity-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full relative z-10"
      >
        <div className="glass-card p-10 md:p-16">
          <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-gold/20">
            <ShieldCheck className="w-8 h-8 text-gold" />
          </div>
          
          <h1 className="text-3xl font-display font-bold mb-4 text-center gold-gradient-text">Request Admin Access</h1>
          <p className="text-gray-400 mb-12 leading-relaxed text-center max-w-md mx-auto font-light">
            The administrative dashboard is reserved for authorized ministry staff. Please submit your request below.
          </p>

          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-4">Request Received</h2>
              <p className="text-gray-400 mb-10 font-light">
                Thank you for your request. Our administrative team will review it and contact you via email shortly.
              </p>
              <Link 
                to="/signin" 
                className="gold-outline-btn inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" /> Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all placeholder-gray-600"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all placeholder-gray-600"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-3">Reason for Access</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-gold/50 outline-none transition-all resize-none placeholder-gray-600"
                  placeholder="Explain your role in the ministry and why you need access..."
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 gold-premium-btn rounded-xl flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" /> Submit Request
              </button>
              <div className="text-center pt-6">
                <Link to="/signin" className="text-xs text-gold font-bold hover:text-white transition-colors uppercase tracking-widest">
                  Already have access? Sign In
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-xs text-gray-500 hover:text-gold transition-colors font-bold uppercase tracking-widest">
            &larr; Back to Public Website
          </Link>
        </div>
      </motion.div>
    </div>

  );
}
