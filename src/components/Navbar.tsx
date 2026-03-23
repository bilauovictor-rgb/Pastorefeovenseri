import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, LayoutDashboard, ChevronDown, HeartHandshake } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logout } from '../firebase';

const ADMIN_EMAIL = "officialgiganticcomputers@gmail.com";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsResourcesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav aria-label="Main Navigation" className="glass-nav fixed w-full z-50 transition-all duration-300 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer" aria-label="Pastor Efe Ovenseri Home">
            <span className="font-display font-bold text-xl tracking-tight text-text-on-dark-primary">
              Pastor Efe <span className="text-accent-gold-primary">Ovenseri</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative group ${
                  isActive(link.path)
                    ? 'text-accent-gold-primary'
                    : 'text-text-on-dark-secondary hover:text-accent-gold-primary'
                }`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-gold-primary shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                )}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsResourcesDropdownOpen(!isResourcesDropdownOpen)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 relative group ${
                  location.pathname.startsWith('/resources') || location.pathname === '/blog'
                    ? 'text-accent-gold-primary'
                    : 'text-text-on-dark-secondary hover:text-accent-gold-primary'
                }`}
              >
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isResourcesDropdownOpen ? 'rotate-180' : ''}`} />
                {(location.pathname.startsWith('/resources') || location.pathname === '/blog') && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-gold-primary shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                )}
              </button>

              {isResourcesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 glass-card py-2 z-50 overflow-hidden shadow-saas-lg">
                  {resourceCategories.map((cat) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      onClick={() => setIsResourcesDropdownOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium transition-all ${
                        isResourceActive(cat.path.split('/').pop() || '')
                          ? 'text-accent-gold-primary bg-white/5'
                          : 'text-text-on-dark-primary hover:bg-white/5 hover:text-accent-gold-primary'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div className="pl-4 flex items-center space-x-4 border-l border-white/10">
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-accent-gold-primary">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-text-on-dark-primary hidden lg:block">
                      {user.displayName?.split(' ')[0]}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass-card py-2 z-50 shadow-saas-lg">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-on-dark-primary hover:bg-white/5 hover:text-accent-gold-primary transition-all"
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
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <Link
                to="/contact"
                className="px-6 py-2.5 gold-premium-btn rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                Partner With Us
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-on-dark-primary p-2 rounded-md hover:bg-white/5 focus:outline-none"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="absolute top-20 left-0 w-full bg-bg-dark-secondary border-b border-white/10 shadow-saas-lg z-40 md:hidden">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full text-left block px-4 py-3 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'text-accent-gold-primary bg-white/5'
                    : 'text-text-on-dark-primary hover:bg-white/5 hover:text-accent-gold-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Resources Dropdown */}
            <div className="space-y-1">
              <div className="px-4 py-3 text-xs font-bold text-text-on-dark-secondary uppercase tracking-widest">Resources</div>
              {resourceCategories.map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full text-left block px-8 py-3 rounded-lg text-base font-medium ${
                    isResourceActive(cat.path.split('/').pop() || '')
                      ? 'text-accent-gold-primary bg-white/5'
                      : 'text-text-on-dark-primary hover:bg-white/5 hover:text-accent-gold-primary'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            
            {user && (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-left block px-4 py-3 rounded-lg text-base font-medium text-text-on-dark-primary hover:bg-white/5 hover:text-accent-gold-primary"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-4 py-3 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              </>
            )}

            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full justify-center mt-4 px-4 py-3 gold-premium-btn rounded-xl text-sm font-bold inline-flex items-center gap-2"
            >
              <HeartHandshake className="w-5 h-5" />
              Partner With Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
