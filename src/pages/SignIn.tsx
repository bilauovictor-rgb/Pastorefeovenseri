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
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-4">
      <SEO title="Sign In" description="Sign in to the Pastor Efe Ovenseri administrative dashboard." />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-saas border border-surface-100 text-center">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-brand-500" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-text-main mb-4">Admin Access</h1>
          <p className="text-text-muted mb-8 leading-relaxed">
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
            className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-brand flex items-center justify-center gap-3 disabled:opacity-50"
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

          <div className="mt-8 pt-8 border-t border-surface-100">
            <p className="text-sm text-text-muted mb-4">Don't have access yet?</p>
            <Link 
              to="/signup" 
              className="inline-flex items-center text-brand-500 font-bold hover:underline gap-1"
            >
              Request Admin Access <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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
