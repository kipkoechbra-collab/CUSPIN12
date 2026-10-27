import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Trees, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login({ email, password });
      showToast(`Welcome back, ${user.firstName}!`);

      if (user.role === 'ADMIN') {
        navigate(from || '/admin');
      } else {
        navigate(from || '/vendor/dashboard');
      }
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-cream-100 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gold-500/30 shadow-warm-lg space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-forest-900 border border-gold-500/50 flex items-center justify-center text-gold-400 mx-auto shadow-inner">
            <Trees className="w-7 h-7 text-gold-400" />
          </div>
          <div>
            <span className="font-display text-xs font-bold uppercase tracking-widest text-gold-600">
              Account Access
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
              Sign In to Your Portal
            </h1>
          </div>
          <p className="text-xs text-charcoal-800/80">
            For approved & applicant vendors, and market administrators.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-800/40 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-800/40 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold uppercase text-xs tracking-wider transition-all shadow-warm hover:shadow-gold-glow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-cream-200 text-center space-y-2 text-xs text-charcoal-800">
          <p>
            Haven't applied as a vendor yet?{' '}
            <Link to="/become-vendor" className="text-forest-900 font-bold hover:underline">
              Submit Application
            </Link>
          </p>
          <p className="text-[11px] text-charcoal-800/60 pt-2">
            Administrator credentials seeded: <span className="font-mono text-forest-900">admin@chardonholidaymarket.com</span> / <span className="font-mono text-forest-900">admin123456</span>
          </p>
        </div>

      </div>
    </div>
  );
};
