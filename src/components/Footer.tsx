import { Link } from 'react-router-dom';
import { FaFacebook, FaYoutube, FaTiktok } from "react-icons/fa";
import { Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative overflow-hidden pt-24 pb-12 mt-auto border-t border-border-soft bg-linear-to-b from-bg-navy-deep to-bg-midnight">
      {/* Decorative Glows */}
      <div className="divine-glow -bottom-32 -left-32 opacity-15"></div>
      <div className="divine-glow -top-32 -right-32 opacity-15"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          {/* Column 1: Ministry Info */}
          <div className="space-y-8">
            <Link to="/" className="inline-block">
              <span className="font-display font-bold text-3xl tracking-tight gold-gradient-text">
                Pastor Efe Ovenseri
              </span>
            </Link>
            <p className="text-text-secondary leading-relaxed text-base font-light opacity-90">
              A dedicated servant of God blending deep spiritual calling with high-level marketplace principles. Leading with humility, vision, and dedication to global transformation.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 className="font-display font-bold text-text-primary mb-8 uppercase text-xs tracking-[0.3em] opacity-80 border-l-2 border-accent-gold-primary pl-4">
              Platform
            </h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-text-secondary hover:text-accent-gold-primary transition-all duration-300 text-sm font-medium hover:translate-x-1 inline-block">Overview</Link></li>
              <li><Link to="/about" className="text-text-secondary hover:text-accent-gold-primary transition-all duration-300 text-sm font-medium hover:translate-x-1 inline-block">Full Biography</Link></li>
              <li><Link to="/services" className="text-text-secondary hover:text-accent-gold-primary transition-all duration-300 text-sm font-medium hover:translate-x-1 inline-block">Ministry Architecture</Link></li>
              <li><Link to="/resources/sermons" className="text-text-secondary hover:text-accent-gold-primary transition-all duration-300 text-sm font-medium hover:translate-x-1 inline-block">Digital Resources</Link></li>
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h4 className="font-display font-bold text-text-primary mb-8 uppercase text-xs tracking-[0.3em] opacity-80 border-l-2 border-accent-gold-primary pl-4">
              Connect
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-text-secondary text-sm">
                <Mail className="w-4 h-4 text-accent-gold-primary" />
                <span>info@efeovenseri.com</span>
              </li>
              <li className="flex items-center space-x-3 text-text-secondary text-sm">
                <MapPin className="w-4 h-4 text-accent-gold-primary" />
                <span>Global Ministry Headquarters</span>
              </li>
              <li className="pt-4">
                <Link to="/contact" className="text-text-secondary hover:text-accent-gold-primary transition-all duration-300 text-sm font-medium hover:translate-x-1 inline-block">Invite & Book</Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-secondary hover:text-accent-gold-primary transition-all duration-300 text-sm font-medium hover:translate-x-1 inline-block">Partnership</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h4 className="font-display font-bold text-text-primary mb-8 uppercase text-xs tracking-[0.3em] opacity-80 border-l-2 border-accent-gold-primary pl-4">
              Follow the Journey
            </h4>
            <p className="text-text-muted text-xs mb-6 font-medium tracking-wider">Stay connected for daily inspiration and leadership insights.</p>
            <div className="flex space-x-4">
              <a 
                href="https://web.facebook.com/traavaileth" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook" 
                className="w-12 h-12 rounded-xl bg-bg-navy-soft/50 flex items-center justify-center text-text-secondary hover:bg-accent-gold-soft hover:text-accent-gold-primary border border-border-soft transition-all duration-500 hover:scale-105 hover:shadow-gold group relative"
              >
                <FaFacebook className="w-5 h-5 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-bg-navy-deep text-accent-gold-primary text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-border-gold shadow-gold translate-y-2 group-hover:translate-y-0">
                  Facebook
                </span>
              </a>
              <a 
                href="https://youtube.com/@traavailethcity?si=VNDHw3kFuqmzlEod" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube" 
                className="w-12 h-12 rounded-xl bg-bg-navy-soft/50 flex items-center justify-center text-text-secondary hover:bg-accent-gold-soft hover:text-accent-gold-primary border border-border-soft transition-all duration-500 hover:scale-105 hover:shadow-gold group relative"
              >
                <FaYoutube className="w-5 h-5 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-bg-navy-deep text-accent-gold-primary text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-border-gold shadow-gold translate-y-2 group-hover:translate-y-0">
                  YouTube
                </span>
              </a>
              <a 
                href="https://www.tiktok.com/@availeth.city?_r=1&_t=ZN-95BETDy6OhS" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="TikTok" 
                className="w-12 h-12 rounded-xl bg-bg-navy-soft/50 flex items-center justify-center text-text-secondary hover:bg-accent-gold-soft hover:text-accent-gold-primary border border-border-soft transition-all duration-500 hover:scale-105 hover:shadow-gold group relative"
              >
                <FaTiktok className="w-5 h-5 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-bg-navy-deep text-accent-gold-primary text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap border border-border-gold shadow-gold translate-y-2 group-hover:translate-y-0">
                  TikTok
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border-soft pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-text-muted font-medium tracking-[0.2em] uppercase">
          <p className="mb-6 md:mb-0">&copy; {new Date().getFullYear()} Pastor Efe Ovenseri Ministries. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <p className="gold-gradient-text font-bold">Built with Divine Excellence.</p>
            <span className="text-border-soft hidden md:block">|</span>
            <Link to="/signin" className="hover:text-accent-gold-primary transition-colors">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
