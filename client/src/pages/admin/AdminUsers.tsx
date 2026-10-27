import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, UserPlus, X } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { User } from '../../types';

export const AdminUsers: React.FC = () => {
  const { showToast } = useToast();
  const [admins, setAdmins] = useState<User[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const fetchAdmins = async () => {
    try {
      const data = await api.getAdminUsers();
      setAdmins(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAdminUser(form);
      showToast('New administrator created successfully!');
      setShowCreateModal(false);
      setForm({ firstName: '', lastName: '', email: '', password: '' });
      fetchAdmins();
    } catch (err: any) {
      showToast(err.message || 'Creation failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-cream-300 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Access Control
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            Administrators ({admins.length})
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-forest-900 text-gold-300 hover:bg-forest-800 font-bold text-xs uppercase flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          Add Administrator
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gold-500/25 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-forest-900 text-cream-50 uppercase text-[11px]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-cream-50">
                <td className="p-3 font-bold text-forest-900">
                  {admin.firstName} {admin.lastName}
                </td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gold-100 text-forest-950">
                    Administrator
                  </span>
                </td>
                <td className="p-3 text-charcoal-800/70">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-display font-bold text-lg text-forest-900">
                Create Administrator
              </h3>
              <button type="button" onClick={() => setShowCreateModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Password (Min 8 chars)</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-forest-900 text-gold-300 font-bold text-xs uppercase">
                Create Admin
              </button>
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 rounded-xl border text-xs">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
