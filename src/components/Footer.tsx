import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative overflow-hidden pt-20 pb-10 mt-auto border-t border-white/5">
      <div className="absolute inset-0 bg-bg-dark-primary z-0"></div>
      <div className="purple-glow -bottom-20 -left-20 opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <span className="font-display font-bold text-2xl tracking-tight text-text-on-dark-primary mb-6 block">
              Pastor Efe <span className="text-accent-gold-primary">Ovenseri</span>
            </span>
            <p className="text-text-on-dark-secondary leading-relaxed max-w-md mb-8 text-lg">
              A dedicated servant of God blending deep spiritual calling with high-level marketplace principles. Leading with humility, vision, and dedication.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-text-on-dark-secondary hover:bg-accent-gold-primary/10 hover:text-accent-gold-primary border border-white/10 transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-text-on-dark-secondary hover:bg-accent-gold-primary/10 hover:text-accent-gold-primary border border-white/10 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-text-on-dark-secondary hover:bg-accent-gold-primary/10 hover:text-accent-gold-primary border border-white/10 transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-text-on-dark-primary mb-6 uppercase text-xs tracking-[0.2em]">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-text-on-dark-secondary hover:text-accent-gold-primary transition-colors text-sm font-medium">Overview</Link></li>
              <li><Link to="/about" className="text-text-on-dark-secondary hover:text-accent-gold-primary transition-colors text-sm font-medium">Full Biography</Link></li>
              <li><Link to="/services" className="text-text-on-dark-secondary hover:text-accent-gold-primary transition-colors text-sm font-medium">Ministry Architecture</Link></li>
              <li><Link to="/resources/sermons" className="text-text-on-dark-secondary hover:text-accent-gold-primary transition-colors text-sm font-medium">Digital Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-text-on-dark-primary mb-6 uppercase text-xs tracking-[0.2em]">Connect</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-text-on-dark-secondary hover:text-accent-gold-primary transition-colors text-sm font-medium">Invite & Book</Link></li>
              <li><Link to="/contact" className="text-text-on-dark-secondary hover:text-accent-gold-primary transition-colors text-sm font-medium">Partnership</Link></li>
              <li><a href="#" className="text-text-on-dark-secondary hover:text-accent-gold-primary transition-colors text-sm font-medium">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-text-on-dark-muted font-medium tracking-wider uppercase">
          <p>&copy; {new Date().getFullYear()} Pastor Efe Ovenseri Ministries. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <p className="text-accent-gold-primary/60">Built with Divine Excellence.</p>
            <span className="text-white/10">|</span>
            <Link to="/signin" className="hover:text-accent-gold-primary transition-colors">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
