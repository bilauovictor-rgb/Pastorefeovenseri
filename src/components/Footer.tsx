import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-surface-100 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <span className="font-display font-bold text-2xl tracking-tight text-text-main mb-4 block">
              Pastor Efe <span className="text-brand-500">Ovenseri</span>
            </span>
            <p className="text-text-muted leading-relaxed max-w-md mb-6">
              A dedicated servant of God blending deep spiritual calling with high-level marketplace principles. Leading with humility, vision, and dedication.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center text-text-muted hover:bg-brand-50 hover:text-brand-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center text-text-muted hover:bg-brand-50 hover:text-brand-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center text-text-muted hover:bg-brand-50 hover:text-brand-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-text-main mb-4 uppercase text-sm tracking-wider">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-text-muted hover:text-brand-500 transition-colors text-sm">Overview</Link></li>
              <li><Link to="/about" className="text-text-muted hover:text-brand-500 transition-colors text-sm">Full Biography</Link></li>
              <li><Link to="/services" className="text-text-muted hover:text-brand-500 transition-colors text-sm">Ministry Architecture</Link></li>
              <li><Link to="/resources/sermons" className="text-text-muted hover:text-brand-500 transition-colors text-sm">Digital Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-text-main mb-4 uppercase text-sm tracking-wider">Connect</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-text-muted hover:text-brand-500 transition-colors text-sm">Invite & Book</Link></li>
              <li><Link to="/contact" className="text-text-muted hover:text-brand-500 transition-colors text-sm">Partnership</Link></li>
              <li><a href="#" className="text-text-muted hover:text-brand-500 transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-text-light">
          <p>&copy; 2026 Pastor Efe Ovenseri Ministries. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built with standard Kingdom principles.</p>
        </div>
      </div>
    </footer>
  );
}
