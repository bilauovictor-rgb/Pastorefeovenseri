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
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-4">
      <SEO title="Request Access" description="Request administrative access to the Pastor Efe Ovenseri dashboard." />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-saas border border-surface-100">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="w-8 h-8 text-brand-500" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-text-main mb-4 text-center">Request Admin Access</h1>
          <p className="text-text-muted mb-10 leading-relaxed text-center max-w-md mx-auto">
            The administrative dashboard is reserved for authorized ministry staff. Please submit your request below.
          </p>

          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-display font-bold text-text-main mb-4">Request Received</h2>
              <p className="text-text-muted mb-8">
                Thank you for your request. Our administrative team will review it and contact you via email shortly.
              </p>
              <Link 
                to="/signin" 
                className="inline-flex items-center px-8 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-brand gap-2"
              >
                <ArrowLeft className="w-5 h-5" /> Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-main mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-500" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-main mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-500" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">Reason for Access</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-surface-50 border border-surface-100 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  placeholder="Explain your role in the ministry and why you need access..."
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-brand flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" /> Submit Request
              </button>
              <div className="text-center pt-4">
                <Link to="/signin" className="text-sm text-brand-500 font-bold hover:underline">
                  Already have access? Sign In
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-text-muted hover:text-brand-500 transition-colors">
            &larr; Back to Public Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
