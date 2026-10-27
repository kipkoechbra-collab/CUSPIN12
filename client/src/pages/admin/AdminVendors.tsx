import React, { useState, useEffect } from 'react';
import { Users, Search, CheckCircle, ExternalLink, Globe, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { VendorApplication } from '../../types';

export const AdminVendors: React.FC = () => {
  const { showToast } = useToast();
  const [vendors, setVendors] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminApplications({ status: 'CONFIRMED' });
      // also fetch PAID vendors
      const paidRes = await api.getAdminApplications({ status: 'PAID' });
      const combined = [...res.applications, ...paidRes.applications];
      setVendors(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleTogglePublic = async (id: string, current: boolean) => {
    try {
      await api.togglePublicListing(id, !current);
      showToast(!current ? 'Vendor visible on public website' : 'Vendor hidden');
      fetchVendors();
    } catch (err) {
      showToast('Toggle failed', 'error');
    }
  };

  const filtered = vendors.filter((v) => {
    const term = search.toLowerCase();
    return (
      v.businessName.toLowerCase().includes(term) ||
      (v.user?.firstName && v.user.firstName.toLowerCase().includes(term)) ||
      (v.user?.lastName && v.user.lastName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Market Roster
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            Confirmed Vendors ({vendors.length})
          </h1>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-800/40 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search vendor business..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:border-forest-900 bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gold-500/25 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-forest-900 text-cream-50 uppercase text-[11px]">
            <tr>
              <th className="p-3">Business</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Category</th>
              <th className="p-3">Package</th>
              <th className="p-3">Weekend</th>
              <th className="p-3">Public Directory</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-cream-50">
                <td className="p-3 font-bold text-forest-900">{v.businessName}</td>
                <td className="p-3">{v.user?.firstName} {v.user?.lastName} ({v.user?.email})</td>
                <td className="p-3">{v.productCategory.replace(/_/g, ' ')}</td>
                <td className="p-3 font-semibold">{v.vendorPackage === 'FULL_SEASON' ? 'Season' : 'Single'}</td>
                <td className="p-3">{v.vendorPackage === 'FULL_SEASON' ? 'All 4 Weekends' : v.requestedWeekend?.title || 'Single'}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleTogglePublic(v.id, v.isPublicListing)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      v.isPublicListing
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {v.isPublicListing ? 'Visible in Directory' : 'Hidden'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
