import React, { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { FAQ } from '../../types';

export const AdminFAQs: React.FC = () => {
  const { showToast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);

  const fetchFAQs = async () => {
    try {
      const data = await api.getAdminFAQs();
      setFaqs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    try {
      if (editingFaq.id) {
        await api.updateFAQ(editingFaq.id, editingFaq);
        showToast('FAQ updated!');
      } else {
        await api.createFAQ(editingFaq);
        showToast('FAQ created!');
      }
      setEditingFaq(null);
      fetchFAQs();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.deleteFAQ(id);
      showToast('FAQ deleted');
      fetchFAQs();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-cream-300 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Website Content
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            Frequently Asked Questions ({faqs.length})
          </h1>
        </div>

        <button
          onClick={() =>
            setEditingFaq({
              question: '',
              answer: '',
              category: 'General',
              sortOrder: faqs.length + 1,
              isActive: true,
            })
          }
          className="px-4 py-2 rounded-xl bg-forest-900 text-gold-300 hover:bg-forest-800 font-bold text-xs uppercase flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-2xl p-6 border border-gold-500/25 shadow-sm flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded bg-cream-200 text-forest-900 text-[10px] font-bold uppercase">
                {faq.category || 'General'}
              </span>
              <h3 className="font-display text-lg font-bold text-forest-900">{faq.question}</h3>
              <p className="text-xs text-charcoal-800 leading-relaxed">{faq.answer}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => setEditingFaq(faq)} className="p-1.5 hover:bg-cream-100 rounded-lg text-forest-900">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(faq.id)} className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-display font-bold text-lg text-forest-900">
                {editingFaq.id ? 'Edit FAQ' : 'New FAQ'}
              </h3>
              <button type="button" onClick={() => setEditingFaq(null)}><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Question</label>
              <input
                type="text"
                required
                value={editingFaq.question || ''}
                onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Category</label>
              <select
                value={editingFaq.category || 'General'}
                onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
              >
                <option value="General">General</option>
                <option value="Vendors">Vendors</option>
                <option value="Sponsors">Sponsors</option>
                <option value="Visitors">Visitors</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase mb-1">Answer</label>
              <textarea
                rows={4}
                required
                value={editingFaq.answer || ''}
                onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-forest-900 text-gold-300 font-bold text-xs uppercase">
                Save FAQ
              </button>
              <button type="button" onClick={() => setEditingFaq(null)} className="px-4 py-2.5 rounded-xl border text-xs">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
