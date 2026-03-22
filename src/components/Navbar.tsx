import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
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
            <span className="font-display font-bold text-xl tracking-tight text-text-main">
              Pastor Efe <span className="text-brand-500">Ovenseri</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-brand-500 bg-brand-50'
                    : 'text-text-muted hover:text-brand-500 hover:bg-brand-50'
                }`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.name}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsResourcesDropdownOpen(!isResourcesDropdownOpen)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  location.pathname.startsWith('/resources') || location.pathname === '/blog'
                    ? 'text-brand-500 bg-brand-50'
                    : 'text-text-muted hover:text-brand-500 hover:bg-brand-50'
                }`}
              >
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isResourcesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isResourcesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-saas-lg border border-surface-100 py-2 z-50 overflow-hidden">
                  {resourceCategories.map((cat) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      onClick={() => setIsResourcesDropdownOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium transition-all ${
                        isResourceActive(cat.path.split('/').pop() || '')
                          ? 'text-brand-500 bg-brand-50'
                          : 'text-text-main hover:bg-brand-50 hover:text-brand-500'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div className="pl-4 flex items-center space-x-4 border-l border-surface-100">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-50 transition-all"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-surface-200" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-500">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-text-main hidden lg:block">
                      {user.displayName?.split(' ')[0]}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-saas-lg border border-surface-100 py-2 z-50">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-main hover:bg-brand-50 hover:text-brand-500 transition-all"
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
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/signin"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/signin')
                      ? 'text-brand-500 bg-brand-50'
                      : 'text-text-muted hover:text-brand-500 hover:bg-brand-50'
                  }`}
                >
                  Sign In
                </Link>
              )}
              
              <Link
                to="/contact"
                className="px-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 inline-block"
              >
                Partner With Us
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-main p-2 rounded-md hover:bg-surface-50 focus:outline-none"
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
        <div id="mobile-menu" className="absolute top-20 left-0 w-full bg-white border-b border-surface-100 shadow-saas-lg z-40 md:hidden">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full text-left block px-4 py-3 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'text-brand-500 bg-brand-50'
                    : 'text-text-main hover:bg-brand-50 hover:text-brand-500'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Resources Dropdown */}
            <div className="space-y-1">
              <div className="px-4 py-3 text-xs font-bold text-text-muted uppercase tracking-widest">Resources</div>
              {resourceCategories.map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full text-left block px-8 py-3 rounded-lg text-base font-medium ${
                    isResourceActive(cat.path.split('/').pop() || '')
                      ? 'text-brand-500 bg-brand-50'
                      : 'text-text-main hover:bg-brand-50 hover:text-brand-500'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-left block px-4 py-3 rounded-lg text-base font-medium text-text-main hover:bg-brand-50 hover:text-brand-500"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-left block px-4 py-3 rounded-lg text-base font-medium text-text-main hover:bg-brand-50 hover:text-brand-500"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center mt-4 block px-4 py-3 bg-brand-500 text-white rounded-xl text-base font-semibold"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
