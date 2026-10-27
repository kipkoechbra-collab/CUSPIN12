import React, { useState, useEffect } from 'react';
import { Settings, Save, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminSettings: React.FC = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getAdminSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateAdminSettings(settings);
      showToast('Settings saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-cream-300 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
          Global Configuration
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
          Market & Website Settings
        </h1>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 border border-gold-500/25 shadow-sm space-y-6">
        
        {/* Event Identity */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-base text-forest-900 border-b pb-2">
            Event Branding & Location
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase mb-1">Event Title</label>
              <input
                type="text"
                value={settings.eventTitle || 'Chardon Holiday Market'}
                onChange={(e) => handleChange('eventTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
              />
            </div>
            <div>
              <label className="block font-bold uppercase mb-1">Event Location</label>
              <input
                type="text"
                value={settings.eventLocation || 'Chardon Square, Chardon, Ohio'}
                onChange={(e) => handleChange('eventLocation', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold uppercase mb-1">Event Subtitle / Tagline</label>
              <input
                type="text"
                value={settings.eventDescription || 'A European-Inspired Christmas Market in the Heart of Chardon'}
                onChange={(e) => handleChange('eventDescription', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4 pt-2">
          <h3 className="font-display font-bold text-base text-forest-900 border-b pb-2">
            Vendor Package Pricing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase mb-1">Single Weekend Fee ($)</label>
              <input
                type="number"
                value={settings.singleWeekendPrice || '200'}
                onChange={(e) => handleChange('singleWeekendPrice', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
              />
            </div>
            <div>
              <label className="block font-bold uppercase mb-1">Full Season Fee ($)</label>
              <input
                type="number"
                value={settings.fullSeasonPrice || '800'}
                onChange={(e) => handleChange('fullSeasonPrice', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
              />
            </div>
          </div>
        </div>

        {/* Application Window */}
        <div className="space-y-4 pt-2">
          <h3 className="font-display font-bold text-base text-forest-900 border-b pb-2">
            Application Deadlines
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase mb-1">Applications Open Date</label>
              <input
                type="date"
                value={settings.applicationOpenDate || '2026-06-01'}
                onChange={(e) => handleChange('applicationOpenDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
              />
            </div>
            <div>
              <label className="block font-bold uppercase mb-1">Applications Close Date</label>
              <input
                type="date"
                value={settings.applicationCloseDate || '2026-10-31'}
                onChange={(e) => handleChange('applicationCloseDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-gold-300 font-bold uppercase text-xs tracking-wider transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
};
