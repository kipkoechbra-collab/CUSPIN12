import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, Shield, Trees, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Event Details', path: '/event-details' },
    { name: 'Vendors', path: '/vendors' },
    { name: 'Become a Vendor', path: '/become-vendor' },
    { name: 'Sponsors', path: '/sponsors' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-forest-900 border-b border-forest-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full bg-forest-950 border border-gold-500/40 flex items-center justify-center text-gold-400 group-hover:scale-105 transition-transform shadow-inner">
              <Trees className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <span className="font-display text-lg sm:text-xl font-bold tracking-wider text-cream-50 block leading-tight">
                CHARDON
              </span>
              <span className="font-display text-xs tracking-widest text-gold-400 uppercase block font-medium">
                Holiday Market
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-gold-400 bg-forest-950 font-semibold'
                    : 'text-cream-100 hover:text-gold-300 hover:bg-forest-800/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons: Apply Button + User/Admin Links */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/become-vendor"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-forest-950 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-200 shadow-warm hover:shadow-gold-glow hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              Apply as a Vendor
            </Link>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-forest-800">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-gold-300 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <Shield className="w-4 h-4 text-gold-400" />
                    Admin
                  </Link>
                ) : (
                  <Link
                    to="/vendor/dashboard"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-forest-800 hover:bg-forest-700 text-cream-50 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-gold-400" />
                    Portal
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-2.5 py-1.5 text-xs text-cream-200 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-cream-100 hover:text-white hover:bg-forest-800/60 text-sm font-medium transition-colors"
              >
                <UserIcon className="w-4 h-4 text-gold-400" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/become-vendor"
              className="px-3 py-1.5 rounded-full bg-gold-500 text-forest-950 text-xs font-bold uppercase tracking-wide mr-1"
            >
              Apply
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-cream-100 hover:text-white hover:bg-forest-800 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-forest-950 border-t border-forest-800 px-4 pt-3 pb-6 space-y-1 animate-fade-in shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-gold-400 bg-forest-900 font-bold'
                  : 'text-cream-100 hover:text-white hover:bg-forest-900'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 mt-2 border-t border-forest-800 space-y-2">
            <Link
              to="/become-vendor"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gold-500 text-forest-950 font-bold uppercase text-sm tracking-wider"
            >
              <Sparkles className="w-4 h-4" />
              Apply as a Vendor
            </Link>

            {user ? (
              <div className="flex flex-col gap-2 pt-2">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 px-4 rounded-lg bg-forest-800 text-gold-300 font-medium"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/vendor/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 px-4 rounded-lg bg-forest-800 text-cream-50 font-medium"
                  >
                    Vendor Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-cream-200 text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center py-2.5 px-4 rounded-lg border border-forest-700 text-cream-100 font-medium"
              >
                Sign In / Vendor Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
