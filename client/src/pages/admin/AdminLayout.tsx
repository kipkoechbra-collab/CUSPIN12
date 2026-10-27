import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  CreditCard,
  Calendar,
  HeartHandshake,
  Megaphone,
  Mail,
  Send,
  Globe,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Trees,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Applications', path: '/admin/applications', icon: FileSpreadsheet },
    { name: 'Vendors', path: '/admin/vendors', icon: Users },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Market Weekends', path: '/admin/weekends', icon: Calendar },
    { name: 'Sponsors', path: '/admin/sponsors', icon: HeartHandshake },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Messages', path: '/admin/messages', icon: Mail },
    { name: 'Newsletter', path: '/admin/newsletter', icon: Send },
    { name: 'Website Content', path: '/admin/faqs', icon: Globe },
    { name: 'Administrators', path: '/admin/users', icon: ShieldCheck },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCurrent = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col lg:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-forest-950 text-cream-50 px-4 py-3 flex items-center justify-between border-b border-forest-800 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <Trees className="w-5 h-5 text-gold-400" />
          <span className="font-display font-bold text-sm tracking-wide">CHM Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-cream-200 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-forest-950 text-cream-100 border-r border-forest-900 flex flex-col justify-between z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand header */}
          <div className="p-6 border-b border-forest-900">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-forest-900 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <Trees className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <span className="font-display text-base font-bold text-cream-50 block leading-tight">
                  CHARDON
                </span>
                <span className="font-display text-[10px] tracking-widest text-gold-400 uppercase block font-semibold">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 flex-1">
            {navItems.map((item) => {
              const active = isCurrent(item.path, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    active
                      ? 'bg-forest-900 text-gold-400 border border-gold-500/30 shadow-sm'
                      : 'text-cream-200/80 hover:text-white hover:bg-forest-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-gold-400' : 'text-cream-200/60'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User profile & Logout */}
          <div className="p-4 border-t border-forest-900 space-y-3">
            <div className="px-3 py-2 rounded-xl bg-forest-900/70 border border-forest-800 text-xs">
              <div className="font-bold text-cream-50 truncate">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-[11px] text-gold-400/80 truncate">{user?.email}</div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

    </div>
  );
};
