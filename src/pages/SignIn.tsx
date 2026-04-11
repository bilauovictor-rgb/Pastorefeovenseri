import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, loginWithGoogle } from '../firebase';
import { SEO } from '../components/SEO';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const ADMIN_EMAIL = "officialgiganticcomputers@gmail.com";

export function SignIn() {
  const [user, loading] = useAuthState(auth);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.email === ADMIN_EMAIL) {
        navigate('/admin');
      } else {
        setError("You are signed in, but you are not authorized to access the admin dashboard.");
      }
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-bg-midnight">
      <SEO title="Sign In" description="Sign in to the Pastor Efe Ovenseri administrative dashboard. Authorized users can manage sermon manuscripts, AI content, and ministry resources securely." />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_50%)]"></div>
      <div className="divine-glow top-0 right-0 opacity-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="glass-card p-10 text-center">
          <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-gold/20">
            <ShieldCheck className="w-8 h-8 text-gold" />
          </div>
          
          <h1 className="text-3xl font-display font-bold mb-4 gold-gradient-text">Admin Access</h1>
          <p className="text-gray-400 mb-10 leading-relaxed font-light">
            Authorized users can sign in to manage sermon manuscripts, AI content generation, and podcast updates.
          </p>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-start text-left gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full gold-premium-btn py-4 rounded-xl flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign in with Google
              </>
            )}
          </button>

          <div className="mt-10 pt-10 border-t border-white/5">
            <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold">Don't have access yet?</p>
            <Link 
              to="/signup" 
              className="inline-flex items-center text-gold font-bold hover:text-white transition-colors gap-2 text-sm uppercase tracking-widest"
            >
              Request Access <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
