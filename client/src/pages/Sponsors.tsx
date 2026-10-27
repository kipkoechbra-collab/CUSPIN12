import React, { useState, useEffect } from 'react';
import { Sparkles, HeartHandshake, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { Sponsor, SponsorLevel } from '../types';
import { useToast } from '../context/ToastContext';

export const Sponsors: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    level: 'GOLD' as SponsorLevel,
    message: '',
  });

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const s = await api.getPublicSponsors();
        setSponsors(s);
      } catch (err) {
        console.error('Error fetching sponsors:', err);
      }
    };
    fetchSponsors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.submitSponsorApplication(form);
      showToast(res.message || 'Sponsorship inquiry submitted successfully!');
      setForm({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        level: 'GOLD',
        message: '',
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to submit sponsorship request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const tiers = [
    {
      level: 'Platinum Presenting Sponsor',
      amount: '$5,000',
      badge: 'Premier Tier',
      benefits: [
        'Exclusive "Presented By" naming rights on all marketing',
        'Prominent full-page feature in print & digital visitor guide',
        'Prime logo on stage banner & entrance archway',
        'VIP chalet booth space during all 4 market weekends',
        'Dedicated press release & weekly social media spotlights',
      ],
      highlight: true,
    },
    {
      level: 'Gold Market Partner',
      amount: '$2,500',
      badge: 'Popular',
      benefits: [
        'Logo placement on website, market map, and stage backdrop',
        'Half-page feature in official digital program',
        'Complimentary weekend booth space (1 weekend of choice)',
        'Bi-weekly social media recognition & newsletter feature',
      ],
      highlight: false,
    },
    {
      level: 'Silver Community Patron',
      amount: '$1,000',
      badge: 'Local Impact',
      benefits: [
        'Logo placement on website and official sponsor board',
        'Quarter-page feature in digital guide',
        'Dedicated shout-out during live entertainment sessions',
      ],
      highlight: false,
    },
    {
      level: 'Bronze & Community Supporter',
      amount: '$500',
      badge: 'Supporter',
      benefits: [
        'Business name listing on market website sponsor wall',
        'Inclusion on community support banner in warming tent',
      ],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-cream-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-widest">
            <HeartHandshake className="w-3.5 h-3.5 text-gold-500" />
            Partnership Opportunities
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-forest-900">
            Market Sponsors
          </h1>
          <p className="font-editorial text-lg text-charcoal-800 italic">
            Support a treasured Northeast Ohio holiday tradition while connecting your brand with thousands of enthusiastic visitors and families.
          </p>
        </div>

        {/* SPONSORSHIP TIERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((t) => (
            <div
              key={t.level}
              className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between border transition-all ${
                t.highlight
                  ? 'bg-forest-900 text-cream-50 border-gold-500 shadow-warm-lg scale-105'
                  : 'bg-white text-charcoal-900 border-gold-500/25 shadow-sm hover:border-gold-500'
              }`}
            >
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    t.highlight ? 'bg-gold-500 text-forest-950' : 'bg-cream-200 text-forest-900'
                  }`}
                >
                  {t.badge}
                </span>
                <h3 className="font-display text-lg font-bold mt-3 mb-1">
                  {t.level}
                </h3>
                <div
                  className={`font-display text-3xl font-extrabold mb-4 ${
                    t.highlight ? 'text-gold-400' : 'text-forest-900'
                  }`}
                >
                  {t.amount}
                </div>
                <ul className="space-y-2 text-xs leading-relaxed">
                  {t.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                          t.highlight ? 'text-gold-400' : 'text-forest-900'
                        }`}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-cream-200/20">
                <a
                  href="#sponsor-form"
                  className={`w-full block text-center py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
                    t.highlight
                      ? 'bg-gold-500 text-forest-950 hover:bg-gold-600'
                      : 'bg-forest-900 text-cream-50 hover:bg-forest-800'
                  }`}
                >
                  Select Tier
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ACTIVE SPONSORS DIRECTORY */}
        {sponsors.length > 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gold-500/25 shadow-sm space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
                Our 2026 Sponsors & Community Benefactors
              </h2>
              <p className="text-xs text-charcoal-800/80">
                We are deeply grateful for their support in making the Chardon Holiday Market possible.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {sponsors.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-xl border border-cream-200 hover:border-gold-500 transition-all text-center flex flex-col items-center justify-center space-y-2"
                >
                  {s.logoUrl ? (
                    <img src={s.logoUrl} alt={s.name} className="h-12 object-contain" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-forest-50 text-forest-900 font-display font-bold flex items-center justify-center text-lg">
                      {s.name[0]}
                    </div>
                  )}
                  <span className="font-display font-bold text-sm text-forest-900 block">
                    {s.name}
                  </span>
                  <span className="text-[10px] font-semibold text-gold-600 uppercase tracking-wider">
                    {s.level} Partner
                  </span>
                  {s.websiteUrl && (
                    <a
                      href={s.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-forest-900 hover:text-gold-600 flex items-center gap-1 mt-1"
                    >
                      Visit Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SPONSOR INQUIRY FORM */}
        <div id="sponsor-form" className="bg-white rounded-3xl p-8 sm:p-12 border border-gold-500/25 shadow-warm space-y-8">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
              Become a 2026 Sponsor
            </h2>
            <p className="text-xs text-charcoal-800 leading-relaxed">
              Complete the form below to receive our full sponsorship prospectus or tailor a custom brand activation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div>
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                Company / Organization *
              </label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                Contact Name *
              </label>
              <input
                type="text"
                required
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                Website
              </label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                Interested Level
              </label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value as SponsorLevel })}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900 bg-white"
              >
                <option value="PLATINUM">Platinum ($5,000)</option>
                <option value="GOLD">Gold ($2,500)</option>
                <option value="SILVER">Silver ($1,000)</option>
                <option value="BRONZE">Bronze ($500)</option>
                <option value="COMMUNITY">Community Partner</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                Message / Notes
              </label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your brand goals or custom partnership interests..."
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold uppercase text-xs tracking-wider transition-all shadow-warm disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Sponsorship Inquiry'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
