import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Gift,
  Coffee,
  Music,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock,
  HeartHandshake,
  CheckCircle,
} from 'lucide-react';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { api } from '../services/api';
import { MarketWeekend, FAQ, Sponsor } from '../types';

export const Home: React.FC = () => {
  const [weekends, setWeekends] = useState<MarketWeekend[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [w, f, s] = await Promise.all([
          api.getPublicWeekends(),
          api.getPublicFAQs(),
          api.getPublicSponsors(),
        ]);
        setWeekends(w);
        setFaqs(f.slice(0, 5)); // show top 5 on home
        setSponsors(s);
      } catch (err) {
        console.error('Failed to load home data:', err);
      }
    };
    fetchData();
  }, []);

  const marketPillars = [
    {
      icon: <ShoppingBag className="w-8 h-8 text-gold-500" />,
      title: 'Shop Unique',
      description:
        'Discover one-of-a-kind handcrafted treasures, seasonal decorations, artisanal jewelry, and memorable holiday gifts crafted with passion.',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-gold-500" />,
      title: 'Festive Fun',
      description:
        'Immerse your family in the warmth of European Christmas traditions with twinkling light displays, horse-drawn carriage rides, and holiday joy.',
    },
    {
      icon: <Music className="w-8 h-8 text-gold-500" />,
      title: 'Holiday Entertainment',
      description:
        'Enjoy live choral carolers, acoustic folk musicians, brass ensembles, and heartwarming holiday performances right on the square.',
    },
    {
      icon: <Gift className="w-8 h-8 text-gold-500" />,
      title: 'Local Makers',
      description:
        'Support dozens of talented Ohio artisans, craftspeople, woodworkers, and candlemakers sharing their seasonal collections.',
    },
    {
      icon: <Coffee className="w-8 h-8 text-gold-500" />,
      title: 'Food & Drinks',
      description:
        'Savor piping hot cocoa, spiced mulled apple cider, warm roasted nuts, fresh gingerbread pastries, and festive European street delicacies.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream-100 text-charcoal-900">
      
      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-forest-900 bg-festive-pattern text-cream-50 px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Decorative Golden Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-forest-700/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-forest-950/70 border border-gold-500/40 text-gold-300 text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-inner">
            <Sparkles className="w-4 h-4 text-gold-400" />
            Historic Chardon Square • Ohio
          </div>

          {/* Large Hero Headings */}
          <div className="space-y-4">
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none text-cream-50 drop-shadow-lg">
              CHARDON<br />
              <span className="gold-gradient-text">HOLIDAY MARKET</span>
            </h1>
            <p className="font-editorial text-xl sm:text-2xl lg:text-3xl text-cream-200/90 font-normal italic max-w-3xl mx-auto">
              A European-Inspired Christmas Market in the Heart of Chardon
            </p>
          </div>

          {/* Opening Countdown */}
          <div className="pt-2">
            <p className="text-xs sm:text-sm font-semibold text-gold-300 tracking-wider uppercase mb-3">
              Counting Down to Opening Day (November 28)
            </p>
            <CountdownTimer targetDate="2026-11-28T10:00:00" />
          </div>

          {/* Three Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/event-details"
              className="px-8 py-4 rounded-full bg-cream-100 hover:bg-cream-200 text-forest-950 font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-warm hover:-translate-y-0.5"
            >
              Plan Your Visit
            </Link>
            <Link
              to="/become-vendor"
              className="px-8 py-4 rounded-full bg-gold-500 hover:bg-gold-600 text-forest-950 font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-warm hover:shadow-gold-glow hover:-translate-y-0.5"
            >
              Become a Vendor
            </Link>
            <Link
              to="/sponsors"
              className="px-8 py-4 rounded-full bg-forest-950/80 hover:bg-forest-950 text-gold-300 hover:text-gold-200 border border-gold-500/40 font-display font-semibold text-sm tracking-wider uppercase transition-all duration-300 shadow-warm hover:-translate-y-0.5"
            >
              Become a Sponsor
            </Link>
          </div>

          {/* Quick Highlight Bar */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm text-cream-200/80 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>4 Festive Weekends</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-400" />
              <span>Chardon Square, Chardon, Ohio</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-gold-400" />
              <span>Free Community Admission</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 HOLIDAY MARKET WEEKENDS SECTION ───────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="font-display text-xs sm:text-sm font-bold tracking-widest text-forest-900 uppercase">
            Mark Your Calendar
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-forest-900">
            4 Holiday Market Weekends
          </h2>
          <div className="w-20 h-0.5 bg-gold-500 mx-auto mt-4" />
          <p className="text-charcoal-800 text-base sm:text-lg pt-2 leading-relaxed">
            Stroll through authentic European-style wooden chalets nestled around historic Chardon Square.
          </p>
          <div className="inline-flex items-center gap-2 text-forest-900 font-semibold text-sm bg-cream-200 px-4 py-1.5 rounded-full mt-2">
            <MapPin className="w-4 h-4 text-gold-600" />
            <span>Location: Chardon Square • Chardon, Ohio</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: '1',
              title: 'Weekend 1',
              dates: 'November 28–29',
              subtitle: 'Grand Opening & Tree Lighting',
              hours: 'Sat 10AM–8PM • Sun 11AM–6PM',
              highlight: 'Opening Ceremony & Caroling',
            },
            {
              num: '2',
              title: 'Weekend 2',
              dates: 'December 4–6',
              subtitle: 'St. Nicholas & Sweets Festival',
              hours: 'Fri 5PM–9PM • Sat 10AM–8PM • Sun 11AM–6PM',
              highlight: 'Special Children’s Craft Workshop',
            },
            {
              num: '3',
              title: 'Weekend 3',
              dates: 'December 11–13',
              subtitle: 'Artisan & Makers Weekend',
              hours: 'Fri 5PM–9PM • Sat 10AM–8PM • Sun 11AM–6PM',
              highlight: 'Handmade Gift Showcases',
            },
            {
              num: '4',
              title: 'Weekend 4',
              dates: 'December 18–20',
              subtitle: 'Grand Finale & Solstice Magic',
              hours: 'Fri 5PM–9PM • Sat 10AM–8PM • Sun 11AM–6PM',
              highlight: 'Last-Chance Holiday Shopping',
            },
          ].map((item) => (
            <div
              key={item.num}
              className="holiday-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-gold-500/25 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-forest-900/5 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-sm font-bold tracking-wider text-forest-900 uppercase">
                    {item.title}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-forest-900 text-gold-300 font-display text-sm font-bold flex items-center justify-center">
                    {item.num}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-forest-900 mb-1">
                  {item.dates}
                </h3>
                <p className="text-xs font-semibold text-gold-600 uppercase tracking-wider mb-4">
                  {item.subtitle}
                </p>
                <div className="space-y-2 text-xs text-charcoal-800">
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-forest-900 mt-0.5 shrink-0" />
                    <span>{item.hours}</span>
                  </div>
                  <div className="flex items-start gap-2 text-forest-900 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" />
                    <span>{item.highlight}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-cream-200">
                <Link
                  to="/event-details"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 hover:text-gold-600 transition-colors uppercase tracking-wider"
                >
                  Weekend Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MARKET PILLARS: SHOP UNIQUE, FESTIVE FUN, ENTERTAINMENT, LOCAL MAKERS, FOOD ─── */}
      <section className="py-20 bg-forest-900 bg-festive-pattern text-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="font-display text-xs sm:text-sm font-bold tracking-widest text-gold-400 uppercase">
              The Experience
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-cream-50">
              The Magic of the Market
            </h2>
            <div className="w-20 h-0.5 bg-gold-500 mx-auto mt-4" />
            <p className="text-cream-200/90 text-base sm:text-lg pt-2 leading-relaxed font-editorial italic">
              Inspired by classic Nuremberg and Strasbourg Christmas markets, recreated with Ohio warmth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {marketPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-8 rounded-2xl bg-forest-950/80 border border-gold-500/25 hover:border-gold-500/60 transition-all duration-300 space-y-4 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-forest-900 border border-gold-500/40 flex items-center justify-center shadow-inner">
                  {pillar.icon}
                </div>
                <h3 className="font-display text-2xl font-bold text-cream-50">
                  {pillar.title}
                </h3>
                <p className="text-sm text-cream-200/80 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}

            {/* Special Call to Action Card in the 6th spot */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 border border-gold-500 flex flex-col justify-between space-y-6">
              <div>
                <div className="w-14 h-14 rounded-xl bg-gold-500 text-forest-950 flex items-center justify-center font-bold text-xl shadow-warm">
                  ✨
                </div>
                <h3 className="font-display text-2xl font-bold text-gold-300 mt-4">
                  Join As An Artisan
                </h3>
                <p className="text-sm text-cream-200/90 leading-relaxed mt-2">
                  Apply today to feature your creations in front of thousands of festive holiday shoppers.
                </p>
              </div>
              <Link
                to="/become-vendor"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold uppercase text-xs tracking-wider transition-all"
              >
                Apply as a Vendor
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VENDOR APPLICATION CALLOUT (2 PACKAGES) ──────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-cream-200/70 border border-gold-500/30 rounded-3xl p-8 sm:p-14 shadow-warm-lg">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="font-display text-xs sm:text-sm font-bold tracking-widest text-forest-900 uppercase">
              Calling All Artisans & Makers
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-900">
              Vendor Packages & Application Workflow
            </h2>
            <p className="text-charcoal-800 text-base leading-relaxed">
              We curate a warm, high-quality holiday marketplace. Note: Payment is only requested after your application has been reviewed and officially approved by our team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Single Weekend Package */}
            <div className="bg-white rounded-2xl p-8 border border-forest-900/10 hover:border-gold-500/50 transition-all shadow-warm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-3 py-1 rounded-full">
                  Flexibility
                </span>
                <h3 className="font-display text-2xl font-bold text-forest-900 mt-3">
                  Single Weekend Vendor
                </h3>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="font-display text-4xl font-extrabold text-forest-900">$200</span>
                  <span className="text-xs text-charcoal-800 font-medium">/ one weekend</span>
                </div>
                <ul className="space-y-3 text-sm text-charcoal-800 my-6">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-forest-900 shrink-0" />
                    <span>Vendor space for one selected weekend</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-forest-900 shrink-0" />
                    <span>Choice of available market weekend</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-forest-900 shrink-0" />
                    <span>Official website vendor listing</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-forest-900 shrink-0" />
                    <span>Weekend vendor map inclusion</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-forest-900 shrink-0" />
                    <span>Market setup & logistics communications</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/become-vendor"
                className="w-full text-center py-3.5 rounded-xl border-2 border-forest-900 text-forest-900 hover:bg-forest-900 hover:text-cream-50 font-display font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Apply For Single Weekend
              </Link>
            </div>

            {/* Season Vendor Package */}
            <div className="bg-forest-900 text-cream-50 rounded-2xl p-8 border-2 border-gold-500 hover:border-gold-400 transition-all shadow-warm-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-gold-500 text-forest-950 font-bold text-[10px] uppercase tracking-wider rounded-full">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-forest-950 px-3 py-1 rounded-full">
                  Full Presence
                </span>
                <h3 className="font-display text-2xl font-bold text-cream-50 mt-3">
                  Season Vendor
                </h3>
                <div className="flex items-baseline gap-1 my-4">
                  <span className="font-display text-4xl font-extrabold text-gold-400">$800</span>
                  <span className="text-xs text-cream-200/80 font-medium">/ all 4 weekends</span>
                </div>
                <ul className="space-y-3 text-sm text-cream-200/90 my-6">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>Vendor space for all 4 market weekends</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>Guaranteed prime booth placement</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>Website vendor listing for entire season</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>Vendor map inclusion across every weekend</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>Dedicated social media spotlight feature</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/become-vendor"
                className="w-full text-center py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-warm"
              >
                Apply For Full Season
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FREQUENTLY ASKED QUESTIONS (PREVIEW) ──────────────────── */}
      {faqs.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="font-display text-xs sm:text-sm font-bold tracking-widest text-forest-900 uppercase">
              Got Questions?
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-forest-900">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-2" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-gold-500/20 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-forest-900 hover:text-forest-700 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-600 shrink-0 transition-transform duration-200 ${
                      openFaq === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === faq.id && (
                  <div className="px-6 pb-6 text-sm text-charcoal-800 leading-relaxed border-t border-cream-200 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-sm font-bold text-forest-900 hover:text-gold-600 transition-colors uppercase tracking-wider"
            >
              View All Questions & Answers &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* ─── SPONSORS SHOWCASE ────────────────────────────────────── */}
      <section className="py-16 bg-cream-200/50 border-t border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="font-display text-xs sm:text-sm font-bold tracking-widest text-forest-900 uppercase">
            Proudly Supported by Community Partners & Sponsors
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 pt-4 opacity-80">
            {['Chardon Chamber of Commerce', 'Geauga County Arts', 'Historic Square Heritage', 'Maple City Creamery', 'Northeast Ohio Artisans'].map(
              (partner) => (
                <div
                  key={partner}
                  className="px-6 py-3 rounded-lg bg-white/70 border border-forest-900/10 text-forest-950 font-display font-bold text-sm tracking-wide shadow-sm"
                >
                  {partner}
                </div>
              )
            )}
          </div>
          <div className="pt-4">
            <Link
              to="/sponsors"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-900 hover:text-gold-600 uppercase tracking-wider"
            >
              <HeartHandshake className="w-4 h-4 text-gold-500" />
              Learn About Sponsorship Packages &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
