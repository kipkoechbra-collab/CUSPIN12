import React, { useState, useEffect } from 'react';
import { Mail, Check, Trash2, Clock, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { ContactMessage } from '../../types';

export const AdminMessages: React.FC = () => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const data = await api.getAdminMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markMessageRead(id);
      fetchMessages();
      showToast('Marked as read');
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete message?')) return;
    try {
      await api.deleteMessage(id);
      showToast('Message deleted');
      fetchMessages();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-cream-300 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Inbound Inquiries
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            Contact Messages ({messages.length})
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-6 rounded-2xl border transition-all ${
              m.isRead
                ? 'bg-white border-cream-200'
                : 'bg-emerald-50/40 border-forest-900 shadow-sm ring-1 ring-forest-900/20'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base text-forest-900">{m.subject}</span>
                  {!m.isRead && (
                    <span className="px-2 py-0.5 rounded-full bg-forest-900 text-gold-300 font-bold text-[10px] uppercase">
                      New
                    </span>
                  )}
                </div>
                <div className="text-xs text-charcoal-800/80">
                  From: <strong>{m.name}</strong> ({m.email}) {m.phone && `• Phone: ${m.phone}`}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!m.isRead && (
                  <button
                    onClick={() => handleMarkRead(m.id)}
                    className="p-1.5 rounded-lg bg-forest-900 text-gold-300 hover:bg-forest-800"
                    title="Mark as Read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-charcoal-800 mt-4 leading-relaxed bg-cream-50 p-3 rounded-xl border border-cream-200">
              {m.message}
            </p>

            <span className="text-[10px] text-charcoal-800/60 block mt-2">
              Received: {new Date(m.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
