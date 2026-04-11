import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, LayoutDashboard, ChevronDown, HeartHandshake, X } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logout } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

const ADMIN_EMAIL = "officialgiganticcomputers@gmail.com";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user] = useAuthState(auth);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
  const isResourceActive = (category: string) => location.pathname === `/resources/${category}`;
  const isAdmin = user?.email === ADMIN_EMAIL;

  const navLinks = [
    { name: 'Platform', path: '/' },
    { name: 'Biography', path: '/about' },
    { name: 'Ministry Arms', path: '/services' },
  ];

  const resourceCategories = [
    { name: 'Sermons', path: '/resources/sermons' },
    { name: 'Leadership Podcasts', path: '/resources/leadership-podcasts' },
    { name: 'Events', path: '/resources/events' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsResourcesDropdownOpen(false);
      }
    }
    
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsResourcesDropdownOpen(false);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <nav 
      aria-label="Main Navigation" 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'py-4' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glass-nav rounded-2xl px-6 h-16 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'shadow-2xl border-accent-gold-primary/30' : 'border-transparent'
        }`}>
          <Link 
            to="/" 
            className="flex-shrink-0 flex items-center cursor-pointer" 
            aria-label="Pastor Efe Ovenseri Home"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="font-display font-bold text-lg lg:text-2xl tracking-tight gold-gradient-text">
              Pastor Efe
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all relative group ${
                  isActive(link.path)
                    ? 'text-accent-gold-primary'
                    : 'text-text-secondary hover:text-accent-gold-primary'
                }`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.span 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-gold-primary shadow-[0_0_8px_rgba(212,175,55,0.6)]" 
                  />
                )}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsResourcesDropdownOpen(!isResourcesDropdownOpen)}
                aria-expanded={isResourcesDropdownOpen}
                aria-haspopup="true"
                className={`px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all flex items-center gap-1 relative group ${
                  location.pathname.startsWith('/resources') || location.pathname === '/blog'
                    ? 'text-accent-gold-primary'
                    : 'text-text-secondary hover:text-accent-gold-primary'
                }`}
              >
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isResourcesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isResourcesDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    role="menu"
                    className="absolute left-0 mt-4 w-56 glass-card py-2 z-50 overflow-hidden shadow-2xl border border-accent-gold-primary/20"
                  >
                    {resourceCategories.map((cat) => (
                      <Link
                        key={cat.path}
                        to={cat.path}
                        role="menuitem"
                        onClick={() => setIsResourcesDropdownOpen(false)}
                        className={`block px-4 py-3 text-sm font-medium transition-all ${
                          isResourceActive(cat.path.split('/').pop() || '')
                            ? 'text-accent-gold-primary bg-white/5'
                            : 'text-text-primary hover:bg-white/5 hover:text-accent-gold-primary'
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="pl-4 flex items-center space-x-4 border-l border-white/10">
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-accent-gold-primary">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        role="menu"
                        className="absolute right-0 mt-4 w-56 glass-card py-2 z-50 shadow-2xl border border-accent-gold-primary/20"
                      >
                        {isAdmin && (
                          <Link
                            to="/admin"
                            role="menuitem"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-primary hover:bg-white/5 hover:text-accent-gold-primary transition-all"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          role="menuitem"
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              <Link
                to="/contact"
                className="px-6 py-2 gold-premium-btn rounded-xl text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap"
              >
                <HeartHandshake className="w-4 h-4" />
                Partner
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              className="text-text-primary p-2 rounded-md hover:bg-white/5 focus:outline-none transition-colors relative z-[60]"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-6 h-5 flex flex-col justify-between relative">
                <motion.span 
                  animate={isMobileMenuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-accent-gold-primary rounded-full origin-left" 
                />
                <motion.span 
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-full h-0.5 bg-accent-gold-primary rounded-full" 
                />
                <motion.span 
                  animate={isMobileMenuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-accent-gold-primary rounded-full origin-left" 
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 w-full h-screen celestial-overlay z-[55] md:hidden flex flex-col items-center justify-center p-8 overflow-y-auto"
          >
            <div className="w-full max-w-md mx-auto space-y-10 text-center flex flex-col items-center justify-center">
              <div className="space-y-6 w-full">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-2xl sm:text-3xl font-display font-bold block transition-all hover:scale-105 ${
                        isActive(link.path) ? 'gold-gradient-text' : 'text-white/90 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-accent-gold-primary/30 to-transparent" />

              <div className="space-y-4 w-full">
                <p className="text-accent-gold-primary/60 text-xs uppercase tracking-widest font-bold mb-4">Resources</p>
                {resourceCategories.map((cat, i) => (
                  <motion.div
                    key={cat.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                  >
                    <Link
                      to={cat.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-xl font-medium block transition-all hover:text-accent-gold-primary ${
                        isResourceActive(cat.path.split('/').pop() || '') ? 'text-accent-gold-primary' : 'text-text-secondary'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="gold-premium-btn px-10 py-4 rounded-2xl text-lg font-bold inline-flex items-center gap-3 shadow-xl"
                >
                  <HeartHandshake className="w-5 h-5" />
                  Partner With Us
                </Link>
              </motion.div>
            </div>

            {/* Background Elements for Celestial Overlay */}
            <div className="absolute inset-0 z-[-1] opacity-30">
              <div className="divine-glow top-0 left-0 w-full h-full" />
              <div className="divine-geometry divine-circle w-[300px] h-[300px] top-[-10%] right-[-10%]" />
              <div className="divine-geometry divine-circle w-[200px] h-[200px] bottom-[-5%] left-[-5%]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
