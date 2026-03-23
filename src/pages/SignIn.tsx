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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-bg-light-primary">
      <SEO title="Sign In" description="Sign in to the Pastor Efe Ovenseri administrative dashboard." />
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-bg-dark-secondary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-gold-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl text-center shadow-[0_8px_30px_rgba(26,11,46,0.04)] border border-border-light-soft">
          <div className="w-16 h-16 bg-bg-dark-secondary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-border-light-soft">
            <ShieldCheck className="w-8 h-8 text-accent-gold-primary" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-text-on-light-primary mb-4">Admin Access</h1>
          <p className="text-text-on-light-secondary mb-8 leading-relaxed">
            Authorized users can sign in to manage sermon manuscripts, AI content generation, and podcast updates.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-start text-left gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full py-4 bg-bg-dark-secondary hover:bg-bg-dark-tertiary text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-bg-dark-secondary/20"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-accent-gold-primary" />
            ) : (
              <>
                <LogIn className="w-5 h-5 text-accent-gold-primary" />
                Sign in with Google
              </>
            )}
          </button>

          <div className="mt-8 pt-8 border-t border-border-light-soft">
            <p className="text-sm text-text-on-light-muted mb-4">Don't have access yet?</p>
            <Link 
              to="/signup" 
              className="inline-flex items-center text-bg-dark-secondary font-bold hover:text-accent-gold-primary transition-colors gap-1"
            >
              Request Admin Access <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
