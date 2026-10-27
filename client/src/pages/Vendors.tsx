import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Globe, Instagram, Facebook, Sparkles, ExternalLink, Calendar, Tag } from 'lucide-react';
import { api } from '../services/api';
import { MarketWeekend, ProductCategory } from '../types';

export const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [weekends, setWeekends] = useState<MarketWeekend[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedWeekend, setSelectedWeekend] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { label: 'All Categories', value: '' },
    { label: 'Handmade Goods', value: 'HANDMADE_GOODS' },
    { label: 'Candles & Fragrance', value: 'CANDLES_HOME_FRAGRANCE' },
    { label: 'Jewelry & Accessories', value: 'JEWELRY_ACCESSORIES' },
    { label: 'Holiday Décor', value: 'HOLIDAY_DECOR' },
    { label: 'Baked Goods', value: 'BAKED_GOODS' },
    { label: 'Specialty Foods', value: 'SPECIALTY_FOODS' },
    { label: 'Coffee, Cocoa & Drinks', value: 'COFFEE_COCOA_DRINKS' },
    { label: 'Local Art', value: 'LOCAL_ART' },
    { label: 'Woodworking', value: 'WOODWORKING' },
    { label: 'Boutique Gifts', value: 'BOUTIQUE_GIFTS' },
    { label: 'Children’s Items', value: 'CHILDRENS_ITEMS' },
    { label: 'Ohio-Themed', value: 'OHIO_THEMED' },
    { label: 'Other', value: 'OTHER' },
  ];

  useEffect(() => {
    const fetchWeekends = async () => {
      try {
        const w = await api.getPublicWeekends();
        setWeekends(w);
      } catch (err) {
        console.error('Error fetching weekends:', err);
      }
    };
    fetchWeekends();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCategory) params.category = selectedCategory;
        if (selectedWeekend) params.weekend = selectedWeekend;
        const v = await api.getPublicVendors(params);
        setVendors(v);
      } catch (err) {
        console.error('Error fetching vendors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [selectedCategory, selectedWeekend]);

  // Client-side search filtering
  const filteredVendors = vendors.filter((v) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      v.businessName.toLowerCase().includes(term) ||
      v.productDescription.toLowerCase().includes(term)
    );
  });

  const formatCategory = (cat: string) => {
    return cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-cream-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            Artisan Marketplace
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-forest-900">
            Market Vendors
          </h1>
          <p className="font-editorial text-lg text-charcoal-800 italic">
            Meet the talented artisans, gourmet food producers, and local makers joining us this holiday season.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-gold-500/25 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-charcoal-800/50 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by vendor or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Weekend Filter */}
            <div className="relative">
              <select
                value={selectedWeekend}
                onChange={(e) => setSelectedWeekend(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900 bg-white"
              >
                <option value="">All Weekends</option>
                {weekends.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.title} ({new Date(w.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Vendor Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-cream-200 animate-pulse space-y-4">
                <div className="w-full h-40 bg-cream-200 rounded-xl" />
                <div className="h-5 bg-cream-200 rounded w-2/3" />
                <div className="h-4 bg-cream-200 rounded w-full" />
                <div className="h-4 bg-cream-200 rounded w-4/5" />
              </div>
            ))}
          </div>
        ) : filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="holiday-card rounded-2xl bg-white border border-gold-500/25 overflow-hidden flex flex-col justify-between group"
              >
                {/* Image Placeholder or Uploaded Photo */}
                <div className="h-48 bg-forest-900/10 flex items-center justify-center relative overflow-hidden">
                  {vendor.uploadedFiles && vendor.uploadedFiles.length > 0 ? (
                    <img
                      src={vendor.uploadedFiles[0].url}
                      alt={vendor.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-forest-900 to-forest-950 text-gold-300 p-6 text-center">
                      <Sparkles className="w-8 h-8 text-gold-400 mb-2 opacity-75" />
                      <span className="font-display font-bold text-lg text-cream-50 leading-tight">
                        {vendor.businessName}
                      </span>
                      <span className="text-xs text-gold-400/80 uppercase tracking-widest mt-1">
                        Chardon Holiday Market
                      </span>
                    </div>
                  )}

                  {/* Weekend Tag */}
                  <span className="absolute top-3 left-3 px-3 py-1 bg-forest-900/90 backdrop-blur-md text-gold-300 text-[11px] font-bold tracking-wider rounded-full uppercase border border-gold-500/30">
                    {vendor.vendorPackage === 'FULL_SEASON'
                      ? 'Full Season'
                      : vendor.requestedWeekend?.title || 'Single Weekend'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-gold-600 font-bold uppercase tracking-wider">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{formatCategory(vendor.productCategory)}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-forest-900">
                      {vendor.businessName}
                    </h3>
                    <p className="text-xs text-charcoal-800 leading-relaxed line-clamp-3">
                      {vendor.productDescription}
                    </p>
                  </div>

                  {/* Links */}
                  <div className="pt-4 border-t border-cream-200 flex items-center justify-between text-xs text-forest-900">
                    <div className="flex items-center gap-3">
                      {vendor.website && (
                        <a
                          href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-gold-600 transition-colors p-1"
                          title="Website"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {vendor.instagram && (
                        <a
                          href={`https://instagram.com/${vendor.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-gold-600 transition-colors p-1"
                          title="Instagram"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {vendor.facebook && (
                        <a
                          href={`https://facebook.com/${vendor.facebook}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-gold-600 transition-colors p-1"
                          title="Facebook"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <span className="text-[11px] font-semibold text-charcoal-800/60 uppercase">
                      Chardon Square
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-gold-500/20 shadow-sm max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-900 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-gold-500" />
            </div>
            <h3 className="font-display text-2xl font-bold text-forest-900">
              Vendor Roster Updating
            </h3>
            <p className="text-sm text-charcoal-800 leading-relaxed">
              Applications are currently open! Once vendor applications are reviewed and confirmed by our committee, they will appear here.
            </p>
            <div className="pt-2">
              <Link
                to="/become-vendor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold uppercase text-xs tracking-wider transition-all"
              >
                Apply to be a Vendor &rarr;
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
