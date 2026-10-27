import React, { useState, useEffect } from 'react';
import { HeartHandshake, Plus, Edit, Trash2, X, Check, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Sponsor, SponsorLevel } from '../../types';

export const AdminSponsors: React.FC = () => {
  const { showToast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [editingSponsor, setEditingSponsor] = useState<Partial<Sponsor> | null>(null);
  const [tab, setTab] = useState<'sponsors' | 'inquiries'>('sponsors');

  const fetchData = async () => {
    try {
      const [s, inq] = await Promise.all([
        api.getAdminSponsors(),
        api.getAdminSponsorApplications(),
      ]);
      setSponsors(s);
      setInquiries(inq);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsor) return;

    try {
      if (editingSponsor.id) {
        await api.updateSponsor(editingSponsor.id, editingSponsor);
        showToast('Sponsor updated!');
      } else {
        await api.createSponsor(editingSponsor);
        showToast('Sponsor created!');
      }
      setEditingSponsor(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this sponsor?')) return;
    try {
      await api.deleteSponsor(id);
      showToast('Sponsor deleted');
      fetchData();
    } catch (err: any) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Partners & Benefactors
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            Sponsors Management
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-xl border border-cream-300 flex">
            <button
              onClick={() => setTab('sponsors')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                tab === 'sponsors' ? 'bg-forest-900 text-gold-300' : 'text-charcoal-800'
              }`}
            >
              Active Sponsors ({sponsors.length})
            </button>
            <button
              onClick={() => setTab('inquiries')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                tab === 'inquiries' ? 'bg-forest-900 text-gold-300' : 'text-charcoal-800'
              }`}
            >
              Inquiries ({inquiries.length})
            </button>
          </div>

          <button
            onClick={() =>
              setEditingSponsor({
                name: '',
                description: '',
                level: 'COMMUNITY',
                isActive: true,
                sortOrder: sponsors.length + 1,
              })
            }
            className="px-3.5 py-2 rounded-xl bg-forest-900 text-gold-300 font-bold text-xs uppercase flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Sponsor
          </button>
        </div>
      </div>

      {tab === 'sponsors' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl p-6 border border-gold-500/25 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">
                    {s.level} Partner
                  </span>
                  <h3 className="font-display text-lg font-bold text-forest-900">{s.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditingSponsor(s)} className="p-1 hover:text-forest-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-1 hover:text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {s.description && <p className="text-xs text-charcoal-800/80">{s.description}</p>}
              {s.websiteUrl && (
                <a href={s.websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-forest-900 underline flex items-center gap-1">
                  Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gold-500/25 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-forest-900 text-cream-50 uppercase text-[11px]">
              <tr>
                <th className="p-3">Company</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Email</th>
                <th className="p-3">Level</th>
                <th className="p-3">Message</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-cream-50">
                  <td className="p-3 font-bold text-forest-900">{inq.companyName}</td>
                  <td className="p-3">{inq.contactName}</td>
                  <td className="p-3">{inq.email}</td>
                  <td className="p-3 font-semibold">{inq.level}</td>
                  <td className="p-3 max-w-xs truncate">{inq.message || '—'}</td>
                  <td className="p-3 text-charcoal-800/70">{new Date(inq.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingSponsor && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveSponsor} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-display font-bold text-lg text-forest-900">
                {editingSponsor.id ? 'Edit Sponsor' : 'Add Sponsor'}
              </h3>
              <button type="button" onClick={() => setEditingSponsor(null)}><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Company Name</label>
              <input
                type="text"
                required
                value={editingSponsor.name || ''}
                onChange={(e) => setEditingSponsor({ ...editingSponsor, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Sponsorship Level</label>
              <select
                value={editingSponsor.level || 'COMMUNITY'}
                onChange={(e) => setEditingSponsor({ ...editingSponsor, level: e.target.value as SponsorLevel })}
                className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
              >
                <option value="PLATINUM">Platinum ($5,000)</option>
                <option value="GOLD">Gold ($2,500)</option>
                <option value="SILVER">Silver ($1,000)</option>
                <option value="BRONZE">Bronze ($500)</option>
                <option value="COMMUNITY">Community Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Logo URL (Optional)</label>
              <input
                type="url"
                value={editingSponsor.logoUrl || ''}
                onChange={(e) => setEditingSponsor({ ...editingSponsor, logoUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Website URL</label>
              <input
                type="url"
                value={editingSponsor.websiteUrl || ''}
                onChange={(e) => setEditingSponsor({ ...editingSponsor, websiteUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-forest-900 text-gold-300 font-bold text-xs uppercase">
                Save Sponsor
              </button>
              <button type="button" onClick={() => setEditingSponsor(null)} className="px-4 py-2.5 rounded-xl border text-xs">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
