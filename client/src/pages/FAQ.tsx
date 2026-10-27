import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, HelpCircle, Sparkles, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { FAQ as FAQType } from '../types';

export const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await api.getPublicFAQs();
        setFaqs(data);
        if (data.length > 0) setOpenId(data[0].id);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      }
    };
    fetchFAQs();
  }, []);

  const categories = ['ALL', 'General', 'Vendors', 'Sponsors'];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = selectedCat === 'ALL' || (faq.category && faq.category.toLowerCase() === selectedCat.toLowerCase());
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-cream-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5 text-gold-500" />
            Everything You Need To Know
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-forest-900">
            Frequently Asked Questions
          </h1>
          <p className="font-editorial text-lg text-charcoal-800 italic">
            Find quick answers about visiting the market, vendor guidelines, dates, and festive amenities.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-charcoal-800/50 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-gold-500/25 text-sm focus:outline-none focus:border-forest-900 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCat === cat
                    ? 'bg-forest-900 text-gold-300 shadow-sm'
                    : 'bg-white text-forest-900 border border-cream-300 hover:border-gold-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-gold-500/25 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-bold text-base sm:text-lg text-forest-900 hover:text-forest-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-gold-500 shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gold-600 shrink-0 transition-transform duration-200 ${
                      openId === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openId === faq.id && (
                  <div className="px-6 pb-6 pt-1 text-sm text-charcoal-800 leading-relaxed border-t border-cream-200 pl-13">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center text-charcoal-800/80 text-sm border border-cream-200">
              No questions found matching your search. Have a specific question? Feel free to reach out directly!
            </div>
          )}
        </div>

        {/* Still have questions banner */}
        <div className="bg-cream-200/60 rounded-2xl p-8 text-center border border-gold-500/20 space-y-3">
          <MessageSquare className="w-8 h-8 text-forest-900 mx-auto" />
          <h3 className="font-display text-xl font-bold text-forest-900">
            Have Another Question?
          </h3>
          <p className="text-xs text-charcoal-800 max-w-md mx-auto">
            Our market coordinators are happy to assist with inquiries regarding vendor spaces, parking, or visitor logistics.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 text-cream-50 font-bold text-xs uppercase tracking-wider hover:bg-forest-800 transition-colors"
            >
              Contact Us &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
