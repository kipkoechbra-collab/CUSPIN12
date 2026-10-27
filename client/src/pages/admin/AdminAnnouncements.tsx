import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Edit, Trash2, X, Pin } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Announcement } from '../../types';

export const AdminAnnouncements: React.FC = () => {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editingAnn, setEditingAnn] = useState<Partial<Announcement> | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const data = await api.getAdminAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnn) return;

    try {
      if (editingAnn.id) {
        await api.updateAnnouncement(editingAnn.id, editingAnn);
        showToast('Announcement updated!');
      } else {
        await api.createAnnouncement(editingAnn);
        showToast('Announcement created!');
      }
      setEditingAnn(null);
      fetchAnnouncements();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.deleteAnnouncement(id);
      showToast('Announcement deleted');
      fetchAnnouncements();
    } catch (err: any) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-cream-300 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Top Banner & News
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            Announcements
          </h1>
        </div>

        <button
          onClick={() =>
            setEditingAnn({
              title: '',
              content: '',
              isActive: true,
              isPinned: false,
            })
          }
          className="px-4 py-2 rounded-xl bg-forest-900 text-gold-300 hover:bg-forest-800 font-bold text-xs uppercase flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white rounded-2xl p-6 border border-gold-500/25 shadow-sm flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {ann.isPinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gold-100 text-forest-900 text-[10px] font-bold uppercase">
                    <Pin className="w-3 h-3 text-gold-600" /> Pinned
                  </span>
                )}
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${ann.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                  {ann.isActive ? 'Active' : 'Draft'}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-forest-900">{ann.title}</h3>
              <p className="text-xs text-charcoal-800 leading-relaxed">{ann.content}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => setEditingAnn(ann)} className="p-1.5 hover:bg-cream-100 rounded-lg text-forest-900">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(ann.id)} className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingAnn && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-display font-bold text-lg text-forest-900">
                {editingAnn.id ? 'Edit Announcement' : 'New Announcement'}
              </h3>
              <button type="button" onClick={() => setEditingAnn(null)}><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Headline</label>
              <input
                type="text"
                required
                value={editingAnn.title || ''}
                onChange={(e) => setEditingAnn({ ...editingAnn, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Content / Banner Text</label>
              <textarea
                rows={3}
                required
                value={editingAnn.content || ''}
                onChange={(e) => setEditingAnn({ ...editingAnn, content: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingAnn.isActive ?? true}
                  onChange={(e) => setEditingAnn({ ...editingAnn, isActive: e.target.checked })}
                />
                <span>Active</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingAnn.isPinned ?? false}
                  onChange={(e) => setEditingAnn({ ...editingAnn, isPinned: e.target.checked })}
                />
                <span>Pin to Top Banner</span>
              </label>
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-forest-900 text-gold-300 font-bold text-xs uppercase">
                Save
              </button>
              <button type="button" onClick={() => setEditingAnn(null)} className="px-4 py-2.5 rounded-xl border text-xs">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
