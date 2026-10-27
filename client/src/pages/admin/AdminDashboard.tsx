import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  DollarSign,
  Package,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  ShoppingBag,
} from 'lucide-react';
import { api } from '../../services/api';
import { AdminStats } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Error loading admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Sparkles className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
        <p className="font-display font-bold text-forest-900">Loading Market Overview...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Applications',
      value: stats?.totalApplications ?? 0,
      icon: FileSpreadsheet,
      bg: 'bg-forest-900 text-cream-50',
      badge: 'All Time',
    },
    {
      label: 'Pending Review',
      value: stats?.pendingApplications ?? 0,
      icon: Clock,
      bg: 'bg-amber-500 text-white',
      badge: 'Needs Action',
      link: '/admin/applications?status=PENDING',
    },
    {
      label: 'Approved Vendors',
      value: stats?.approvedVendors ?? 0,
      icon: CheckCircle,
      bg: 'bg-emerald-600 text-white',
      badge: 'Accepted',
    },
    {
      label: 'Awaiting Payment',
      value: stats?.awaitingPayment ?? 0,
      icon: CreditCard,
      bg: 'bg-gold-500 text-forest-950',
      badge: 'Payment Sent',
      link: '/admin/applications?status=AWAITING_PAYMENT',
    },
    {
      label: 'Paid / Confirmed',
      value: stats?.paidVendors ?? 0,
      icon: CheckCircle,
      bg: 'bg-teal-700 text-white',
      badge: 'Confirmed',
    },
    {
      label: 'Total Revenue',
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      bg: 'bg-forest-950 text-gold-400 border border-gold-500/30',
      badge: 'Gross Paid',
    },
    {
      label: 'Single Weekend ($200)',
      value: stats?.singleWeekendVendors ?? 0,
      icon: Calendar,
      bg: 'bg-white text-forest-900 border border-cream-300',
      badge: '$200 tier',
    },
    {
      label: 'Season Vendors ($800)',
      value: stats?.fullSeasonVendors ?? 0,
      icon: Package,
      bg: 'bg-white text-forest-900 border border-cream-300',
      badge: '$800 tier',
    },
  ];

  return (
    <div className="space-y-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Chardon Holiday Market Control Center
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-forest-900">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/applications"
            className="px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Review Applications
          </Link>
          <Link
            to="/admin/payments"
            className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Payments
          </Link>
        </div>
      </div>

      {/* Primary Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          const CardContent = (
            <div
              key={card.label}
              className={`p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 transition-all hover:-translate-y-0.5 ${card.bg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                  {card.label}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/10 uppercase">
                  {card.badge}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-3xl font-extrabold">{card.value}</span>
                <Icon className="w-6 h-6 opacity-40" />
              </div>
            </div>
          );

          return card.link ? (
            <Link key={card.label} to={card.link}>
              {CardContent}
            </Link>
          ) : (
            <React.Fragment key={card.label}>{CardContent}</React.Fragment>
          );
        })}
      </div>

      {/* Visual Analytics / Charts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-500/25 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-cream-200 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-600" />
              <h3 className="font-display text-lg font-bold text-forest-900">
                Applications by Product Category
              </h3>
            </div>
            <span className="text-xs text-charcoal-800/60 font-medium">Distribution</span>
          </div>

          <div className="space-y-3">
            {stats?.charts?.byCategory && stats.charts.byCategory.length > 0 ? (
              stats.charts.byCategory.map((item) => {
                const total = stats.totalApplications || 1;
                const percentage = Math.round((item._count.productCategory / total) * 100);
                const categoryName = item.productCategory
                  .replace(/_/g, ' ')
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase());

                return (
                  <div key={item.productCategory} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-forest-950">{categoryName}</span>
                      <span className="text-charcoal-800">
                        {item._count.productCategory} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-cream-200 overflow-hidden">
                      <div
                        className="h-full bg-forest-900 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-charcoal-800/60 italic py-4">No categories recorded yet.</p>
            )}
          </div>
        </div>

        {/* Application Status Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-500/25 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-cream-200 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-gold-600" />
              <h3 className="font-display text-lg font-bold text-forest-900">
                Application Pipeline Status
              </h3>
            </div>
            <span className="text-xs text-charcoal-800/60 font-medium">Workflow</span>
          </div>

          <div className="space-y-3">
            {stats?.charts?.byStatus && stats.charts.byStatus.length > 0 ? (
              stats.charts.byStatus.map((item) => {
                const total = stats.totalApplications || 1;
                const percentage = Math.round((item._count.status / total) * 100);

                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-forest-950">{item.status.replace(/_/g, ' ')}</span>
                      <span className="text-charcoal-800">
                        {item._count.status} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-cream-200 overflow-hidden">
                      <div
                        className="h-full bg-gold-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-charcoal-800/60 italic py-4">No statuses recorded yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
