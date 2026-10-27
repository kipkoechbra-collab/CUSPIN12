import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.submitContact(form);
      showToast(res.message || 'Message sent successfully!');
      setSentSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5 text-gold-500" />
            Get In Touch
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-forest-900">
            Contact Us
          </h1>
          <p className="font-editorial text-lg text-charcoal-800 italic">
            Questions about the market, volunteering, musical performances, or visiting? We’d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Market Contact Info */}
          <div className="bg-forest-900 bg-festive-pattern text-cream-50 rounded-3xl p-8 sm:p-10 border border-gold-500/30 shadow-warm-lg space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="font-display text-xs font-bold uppercase tracking-widest text-gold-400">
                  Market Information
                </span>
                <h3 className="font-display text-2xl font-bold text-cream-50 mt-1">
                  Chardon Holiday Market
                </h3>
              </div>

              <div className="space-y-4 text-sm text-cream-200/90">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-400 mt-1 shrink-0" />
                  <div>
                    <strong className="block text-white font-medium">Market Location</strong>
                    <span>Chardon Square<br />Chardon, Ohio 44024</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold-400 mt-1 shrink-0" />
                  <div>
                    <strong className="block text-white font-medium">Email Inquiries</strong>
                    <span>info@chardonholidaymarket.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold-400 mt-1 shrink-0" />
                  <div>
                    <strong className="block text-white font-medium">Phone Support</strong>
                    <span>(440) 286-3000</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold-400 mt-1 shrink-0" />
                  <div>
                    <strong className="block text-white font-medium">Market Dates</strong>
                    <span>4 Holiday Weekends<br />Nov 28 – Dec 20, 2026</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-forest-950/70 border border-gold-500/20 text-xs text-cream-200/80 leading-relaxed">
              <span className="font-bold text-gold-400 block mb-1">Are you an artisan or maker?</span>
              Please use our <a href="/become-vendor" className="text-white underline font-semibold">Vendor Application Form</a> to apply for booth space directly.
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-12 border border-gold-500/25 shadow-warm">
            {sentSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-900 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-gold-500" />
                </div>
                <h3 className="font-display text-2xl font-bold text-forest-900">
                  Thank You For Reaching Out!
                </h3>
                <p className="text-sm text-charcoal-800 max-w-md mx-auto">
                  Your message has been safely received. A member of our market committee will respond to your email shortly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSentSuccess(false)}
                    className="px-6 py-2.5 rounded-full bg-forest-900 text-cream-50 text-xs font-bold uppercase tracking-wider hover:bg-forest-800 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-bold text-forest-900 mb-1">
                    Send a Message
                  </h3>
                  <p className="text-xs text-charcoal-800/80">
                    Fill out the fields below and we’ll respond as soon as possible.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Doe"
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
                      placeholder="jane@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(440) 555-0100"
                      className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Question about..."
                      className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                      Message * (At least 10 characters)
                    </label>
                    <textarea
                      required
                      rows={5}
                      minLength={10}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold uppercase text-xs tracking-wider transition-all shadow-warm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? 'Sending Message...' : 'Send Message'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
