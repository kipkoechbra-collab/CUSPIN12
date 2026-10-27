import React, { useState, useEffect } from 'react';
import { Send, Mail, Download } from 'lucide-react';
import { api } from '../../services/api';

export const AdminNewsletter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const data = await api.getAdminNewsletter();
        setSubscribers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,SubscribedAt'].concat(
        subscribers.map((s) => `"${s.email}","${new Date(s.subscribedAt).toISOString()}"`)
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'chardon_holiday_market_newsletter.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-cream-300 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Community Audience
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            Newsletter Subscribers ({subscribers.length})
          </h1>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="px-4 py-2 rounded-xl bg-forest-900 text-gold-300 hover:bg-forest-800 font-bold text-xs uppercase flex items-center gap-1.5 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gold-500/25 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-forest-900 text-cream-50 uppercase text-[11px]">
            <tr>
              <th className="p-3">Subscriber Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Subscribed Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {subscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-cream-50">
                <td className="p-3 font-semibold text-forest-900">{sub.email}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </td>
                <td className="p-3 text-charcoal-800/70">
                  {new Date(sub.subscribedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
