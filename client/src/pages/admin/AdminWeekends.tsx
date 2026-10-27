import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { MarketWeekend } from '../../types';

export const AdminWeekends: React.FC = () => {
  const { showToast } = useToast();
  const [weekends, setWeekends] = useState<MarketWeekend[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWeekend, setEditingWeekend] = useState<Partial<MarketWeekend> | null>(null);

  const fetchWeekends = async () => {
    try {
      const data = await api.getAdminWeekends();
      setWeekends(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekends();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWeekend) return;

    try {
      if (editingWeekend.id) {
        await api.updateWeekend(editingWeekend.id, editingWeekend);
        showToast('Weekend updated successfully!');
      } else {
        await api.createWeekend(editingWeekend);
        showToast('Weekend created successfully!');
      }
      setEditingWeekend(null);
      fetchWeekends();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this market weekend?')) return;
    try {
      await api.deleteWeekend(id);
      showToast('Weekend deleted');
      fetchWeekends();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-cream-300 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Market Dates & Logistics
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            Market Weekends
          </h1>
        </div>

        <button
          onClick={() =>
            setEditingWeekend({
              title: `Weekend ${weekends.length + 1}`,
              startDate: '2026-11-28',
              endDate: '2026-11-29',
              openingHours: 'Sat 10AM-8PM, Sun 11AM-6PM',
              location: 'Chardon Square, Chardon, Ohio',
              vendorCapacity: 50,
              availableSpaces: 50,
              isActive: true,
              sortOrder: weekends.length + 1,
            })
          }
          className="px-4 py-2 rounded-xl bg-forest-900 text-gold-300 hover:bg-forest-800 font-bold text-xs uppercase flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Weekend
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weekends.map((w) => (
          <div key={w.id} className="bg-white rounded-2xl p-6 border border-gold-500/25 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest">
                  Order #{w.sortOrder}
                </span>
                <h3 className="font-display text-xl font-bold text-forest-900">{w.title}</h3>
                <p className="text-xs text-charcoal-800/80">{w.description}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingWeekend(w)}
                  className="p-1.5 rounded-lg hover:bg-cream-100 text-forest-900"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-charcoal-800">
              <p><strong>Dates:</strong> {new Date(w.startDate).toLocaleDateString()} – {new Date(w.endDate).toLocaleDateString()}</p>
              <p><strong>Hours:</strong> {w.openingHours || 'Standard'}</p>
              <p><strong>Location:</strong> {w.location}</p>
              <p><strong>Spaces:</strong> {w.availableSpaces} available / {w.vendorCapacity} capacity</p>
            </div>
          </div>
        ))}
      </div>

      {editingWeekend && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-display font-bold text-lg text-forest-900">
                {editingWeekend.id ? 'Edit Weekend' : 'Create Weekend'}
              </h3>
              <button type="button" onClick={() => setEditingWeekend(null)}><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Title</label>
              <input
                type="text"
                required
                value={editingWeekend.title || ''}
                onChange={(e) => setEditingWeekend({ ...editingWeekend, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={editingWeekend.startDate ? new Date(editingWeekend.startDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingWeekend({ ...editingWeekend, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={editingWeekend.endDate ? new Date(editingWeekend.endDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingWeekend({ ...editingWeekend, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Opening Hours</label>
              <input
                type="text"
                value={editingWeekend.openingHours || ''}
                onChange={(e) => setEditingWeekend({ ...editingWeekend, openingHours: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Capacity</label>
                <input
                  type="number"
                  value={editingWeekend.vendorCapacity || 50}
                  onChange={(e) => setEditingWeekend({ ...editingWeekend, vendorCapacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Available Spaces</label>
                <input
                  type="number"
                  value={editingWeekend.availableSpaces || 50}
                  onChange={(e) => setEditingWeekend({ ...editingWeekend, availableSpaces: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-forest-900 text-gold-300 font-bold text-xs uppercase">
                Save Weekend
              </button>
              <button type="button" onClick={() => setEditingWeekend(null)} className="px-4 py-2.5 rounded-xl border text-xs">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
