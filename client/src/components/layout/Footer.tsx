import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trees, Mail, MapPin, Calendar, Clock, Heart, Send } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setSubscribing(true);
      const res = await api.submitNewsletter({ email });
      showToast(res.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err: any) {
      showToast(err.message || 'Subscription failed', 'error');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-forest-950 text-cream-100 border-t border-gold-500/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Atmosphere */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-900 border border-gold-500/50 flex items-center justify-center text-gold-400">
                <Trees className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-wider text-cream-50 block leading-tight">
                  CHARDON
                </span>
                <span className="font-display text-xs tracking-widest text-gold-400 uppercase block font-medium">
                  Holiday Market
                </span>
              </div>
            </div>
            <p className="text-sm text-cream-200/80 leading-relaxed">
              Bringing the timeless charm and festive wonder of historic European Christmas markets to the historic square of Chardon, Ohio.
            </p>
            <div className="pt-2 text-xs text-gold-400 font-serif italic">
              "Warm drinks, festive lights, handcrafted treasures, and joyful memories."
            </div>
          </div>

          {/* Location & Dates */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold tracking-wider text-gold-400 uppercase">
              Location & Dates
            </h4>
            <div className="space-y-3 text-sm text-cream-200/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 mt-1 shrink-0" />
                <span>
                  Chardon Square<br />
                  Chardon, Ohio 44024
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-gold-400 mt-1 shrink-0" />
                <span>
                  4 Weekends: Nov 28 – Dec 20, 2026<br />
                  Fridays, Saturdays & Sundays
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 mt-1 shrink-0" />
                <span>
                  Fri: 5 PM – 9 PM<br />
                  Sat: 10 AM – 8 PM<br />
                  Sun: 11 AM – 6 PM
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold tracking-wider text-gold-400 uppercase">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-cream-200/80">
              <li>
                <Link to="/event-details" className="hover:text-gold-300 transition-colors">Event Details & Schedule</Link>
              </li>
              <li>
                <Link to="/vendors" className="hover:text-gold-300 transition-colors">Artisan Vendor Directory</Link>
              </li>
              <li>
                <Link to="/become-vendor" className="hover:text-gold-300 transition-colors font-medium text-gold-400">Become a Vendor (Apply)</Link>
              </li>
              <li>
                <Link to="/sponsors" className="hover:text-gold-300 transition-colors">Sponsorship Opportunities</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold-300 transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-300 transition-colors">Contact Market Organizers</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gold-300 transition-colors text-xs opacity-75">Vendor & Admin Sign In</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold tracking-wider text-gold-400 uppercase">
              Holiday Newsletter
            </h4>
            <p className="text-sm text-cream-200/80">
              Receive vendor highlights, special musical performances, and market announcements.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 rounded-lg bg-forest-900 border border-forest-700 text-cream-50 placeholder-cream-200/50 text-sm focus:outline-none focus:border-gold-400 pr-10"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="absolute right-1.5 top-1.5 p-1.5 bg-gold-500 hover:bg-gold-600 text-forest-950 rounded-md transition-colors disabled:opacity-50"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-cream-200/60 block">We respect your privacy. Unsubscribe anytime.</span>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-200/60">
          <p>© {new Date().getFullYear()} Chardon Holiday Market. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-festive-red inline fill-current" />
            <span>for the Chardon community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
