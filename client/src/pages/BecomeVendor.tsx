import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle,
  AlertCircle,
  Sparkles,
  Info,
  DollarSign,
  Calendar,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { MarketWeekend, ProductCategory, VendorPackage } from '../types';

export const BecomeVendor: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [weekends, setWeekends] = useState<MarketWeekend[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    // Account details (if registering on submission)
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
    phone: user?.phone || '',

    // Business details
    businessName: '',
    businessAddress: '',
    city: '',
    state: 'OH',
    zipCode: '',
    website: '',
    instagram: '',
    facebook: '',

    // Product info
    productCategory: 'HANDMADE_GOODS' as ProductCategory,
    productDescription: '',
    priceRange: '$15 - $75',
    yearsInBusiness: 2,
    previousExperience: '',

    // Package & Market
    vendorPackage: 'SINGLE_WEEKEND' as VendorPackage,
    requestedWeekendId: '',

    // Requirements
    electricityRequired: false,
    isFoodVendor: false,
    requiredPermits: '',
    specialRequirements: '',
    additionalComments: '',

    // Agreement
    agreedToTerms: false,
  });

  useEffect(() => {
    const fetchWeekends = async () => {
      try {
        const w = await api.getPublicWeekends();
        setWeekends(w);
        if (w.length > 0) {
          setFormData((prev) => ({ ...prev, requestedWeekendId: w[0].id }));
        }
      } catch (err) {
        console.error('Error fetching weekends:', err);
      }
    };
    fetchWeekends();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      showToast('You must agree to the vendor rules and terms', 'error');
      return;
    }

    try {
      setSubmitting(true);

      // If user is not logged in, register them first
      if (!user) {
        if (!formData.password || formData.password.length < 8) {
          showToast('Please create a password of at least 8 characters to access your vendor portal', 'error');
          setSubmitting(false);
          return;
        }

        await api.register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
      }

      // Submit application
      const payload: any = {
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        website: formData.website || undefined,
        instagram: formData.instagram || undefined,
        facebook: formData.facebook || undefined,
        productCategory: formData.productCategory,
        productDescription: formData.productDescription,
        priceRange: formData.priceRange || undefined,
        yearsInBusiness: Number(formData.yearsInBusiness) || 0,
        previousExperience: formData.previousExperience || undefined,
        vendorPackage: formData.vendorPackage,
        requestedWeekendId: formData.vendorPackage === 'SINGLE_WEEKEND' ? formData.requestedWeekendId : undefined,
        electricityRequired: formData.electricityRequired,
        isFoodVendor: formData.isFoodVendor,
        requiredPermits: formData.requiredPermits || undefined,
        specialRequirements: formData.specialRequirements || undefined,
        additionalComments: formData.additionalComments || undefined,
        agreedToTerms: formData.agreedToTerms,
      };

      const res = await api.submitApplication(payload);
      setApplicationNumber(res.application?.applicationNumber || 'CHM-APP');
      setSubmittedSuccess(true);
      showToast('Application submitted successfully!');
    } catch (err: any) {
      console.error('Submission error:', err);
      showToast(err.message || 'Failed to submit application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (submittedSuccess) {
    return (
      <div className="min-h-screen bg-cream-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-gold-500/30 shadow-warm-lg text-center space-y-6">
          <div className="w-20 h-20 bg-forest-50 border-2 border-forest-900 rounded-full flex items-center justify-center mx-auto text-forest-900 shadow-inner">
            <CheckCircle className="w-10 h-10 text-gold-500" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
              Application Confirmation
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-forest-900">
              Application Received!
            </h1>
          </div>

          {/* Exact required submission message */}
          <div className="p-6 rounded-2xl bg-cream-100 border border-gold-500/30 text-charcoal-900 text-sm sm:text-base leading-relaxed text-left space-y-3">
            <p className="font-medium text-forest-900">
              "Thank you for applying to the Chardon Holiday Market. Your application has been received and will be reviewed by our team. Payment is only requested after approval."
            </p>
            <div className="pt-2 text-xs text-charcoal-800/80">
              Your application tracking reference is:{' '}
              <span className="font-mono font-bold text-forest-900">{applicationNumber}</span>
            </div>
          </div>

          {/* Workflow explanation */}
          <div className="text-xs text-charcoal-800 space-y-2 text-left bg-forest-50 p-5 rounded-xl border border-forest-100">
            <span className="font-bold text-forest-900 uppercase tracking-wider block">
              What Happens Next?
            </span>
            <p>1. Our selection committee evaluates applications to ensure diverse, high-quality holiday offerings.</p>
            <p>2. You will receive an email notification when your application status updates.</p>
            <p>3. Once approved, you can log in to your Vendor Portal to complete payment and view setup logistics.</p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/vendor/dashboard"
              className="px-8 py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold uppercase text-xs tracking-wider transition-all shadow-warm"
            >
              Go to Vendor Portal &rarr;
            </Link>
            <Link
              to="/"
              className="px-8 py-3.5 rounded-full border border-forest-900 text-forest-900 hover:bg-forest-50 font-bold uppercase text-xs tracking-wider transition-all"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            Vendor Application
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-forest-900">
            Become a Vendor
          </h1>
          <p className="font-editorial text-lg text-charcoal-800 italic max-w-2xl mx-auto">
            Showcase your handcrafted creations, holiday ornaments, gifts, or specialty food at Chardon’s premier Christmas celebration.
          </p>
        </div>

        {/* WORKFLOW BANNER (Emphasizing payment after approval) */}
        <div className="p-6 rounded-2xl bg-forest-900 text-cream-50 border border-gold-500/30 shadow-warm space-y-4">
          <div className="flex items-center gap-2.5 text-gold-400 font-bold text-sm tracking-wider uppercase">
            <ShieldCheck className="w-5 h-5 text-gold-400" />
            <span>Important Application & Payment Process</span>
          </div>
          <p className="text-sm text-cream-200/90 leading-relaxed">
            We do <strong className="text-white underline">NOT</strong> charge applicants when submitting an application. The official process is:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-forest-950/70 border border-forest-700">
              <span className="font-bold text-gold-400 block mb-1">Step 1</span>
              Submit Online Application
            </div>
            <div className="p-3 rounded-xl bg-forest-950/70 border border-forest-700">
              <span className="font-bold text-gold-400 block mb-1">Step 2</span>
              Committee Review
            </div>
            <div className="p-3 rounded-xl bg-forest-950/70 border border-forest-700">
              <span className="font-bold text-gold-400 block mb-1">Step 3</span>
              Approval & Payment Link
            </div>
            <div className="p-3 rounded-xl bg-forest-950/70 border border-forest-700">
              <span className="font-bold text-gold-400 block mb-1">Step 4</span>
              Payment & Confirmed Space
            </div>
          </div>
        </div>

        {/* APPLICATION FORM */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-12 border border-gold-500/25 shadow-warm space-y-10">
          
          {/* PACKAGE SELECTION */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-forest-900 flex items-center gap-2 border-b border-cream-200 pb-2">
              <DollarSign className="w-5 h-5 text-gold-600" />
              1. Select Your Vendor Package
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Single Weekend */}
              <label
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  formData.vendorPackage === 'SINGLE_WEEKEND'
                    ? 'border-forest-900 bg-forest-50/40 ring-1 ring-forest-900'
                    : 'border-cream-300 hover:border-gold-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-lg font-bold text-forest-900">
                      Single Weekend Vendor
                    </span>
                    <input
                      type="radio"
                      name="vendorPackage"
                      value="SINGLE_WEEKEND"
                      checked={formData.vendorPackage === 'SINGLE_WEEKEND'}
                      onChange={handleChange}
                      className="text-forest-900 focus:ring-forest-900 h-4 w-4"
                    />
                  </div>
                  <div className="text-2xl font-black text-forest-900 font-display mb-3">$200</div>
                  <ul className="text-xs text-charcoal-800 space-y-1.5 list-disc list-inside">
                    <li>Vendor space for one selected weekend</li>
                    <li>Choice of available weekend</li>
                    <li>Website vendor directory listing</li>
                    <li>Weekend vendor map inclusion</li>
                    <li>Market setup communications</li>
                  </ul>
                </div>

                {formData.vendorPackage === 'SINGLE_WEEKEND' && (
                  <div className="mt-4 pt-4 border-t border-cream-200">
                    <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider mb-1">
                      Choose Your Weekend:
                    </label>
                    <select
                      name="requestedWeekendId"
                      value={formData.requestedWeekendId}
                      onChange={handleChange}
                      required={formData.vendorPackage === 'SINGLE_WEEKEND'}
                      className="w-full px-3 py-2 rounded-lg border border-cream-300 text-xs bg-white focus:outline-none focus:border-forest-900"
                    >
                      {weekends.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.title} ({new Date(w.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </label>

              {/* Season Vendor */}
              <label
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  formData.vendorPackage === 'FULL_SEASON'
                    ? 'border-forest-900 bg-forest-50/40 ring-1 ring-forest-900'
                    : 'border-cream-300 hover:border-gold-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-lg font-bold text-forest-900">
                      Season Vendor
                    </span>
                    <input
                      type="radio"
                      name="vendorPackage"
                      value="FULL_SEASON"
                      checked={formData.vendorPackage === 'FULL_SEASON'}
                      onChange={handleChange}
                      className="text-forest-900 focus:ring-forest-900 h-4 w-4"
                    />
                  </div>
                  <div className="text-2xl font-black text-gold-600 font-display mb-3">$800</div>
                  <ul className="text-xs text-charcoal-800 space-y-1.5 list-disc list-inside">
                    <li>Vendor space for all 4 market weekends</li>
                    <li>Website vendor directory listing</li>
                    <li>Vendor map inclusion for all weekends</li>
                    <li>Market setup communications</li>
                    <li>Dedicated social media mention</li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 text-[11px] font-semibold text-gold-700 bg-gold-50 p-2 rounded-lg text-center">
                  ✨ Best value & guaranteed consistent booth location
                </div>
              </label>
            </div>
          </div>

          {/* APPLICANT & ACCOUNT DETAILS */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-forest-900 flex items-center gap-2 border-b border-cream-200 pb-2">
              <User className="w-5 h-5 text-gold-600" />
              2. Applicant & Portal Account
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!!user}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900 disabled:bg-cream-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(440) 555-0199"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>

              {!user && (
                <div className="sm:col-span-2 bg-cream-50 p-4 rounded-xl border border-gold-500/20 space-y-2">
                  <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider">
                    Create Vendor Account Password * (Min 8 characters)
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password to log into your vendor portal"
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900 bg-white"
                  />
                  <span className="text-[11px] text-charcoal-800/70 block">
                    You will use this password and your email to view your application status, receive announcements, and complete payment upon approval.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* BUSINESS DETAILS */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-forest-900 flex items-center gap-2 border-b border-cream-200 pb-2">
              <Building className="w-5 h-5 text-gold-600" />
              3. Business Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Geauga Maple Treats, Bavarian Carvings"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Business Street Address *
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  required
                  value={formData.businessAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@yourbrand"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Facebook Page
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="facebook.com/yourbusiness"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>
            </div>
          </div>

          {/* PRODUCTS & EXPERIENCE */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-forest-900 flex items-center gap-2 border-b border-cream-200 pb-2">
              <ShoppingBag className="w-5 h-5 text-gold-600" />
              4. Product Category & Description
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Product Category *
                </label>
                <select
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900 bg-white"
                >
                  <option value="HANDMADE_GOODS">Handmade Goods</option>
                  <option value="CANDLES_HOME_FRAGRANCE">Candles & Home Fragrance</option>
                  <option value="JEWELRY_ACCESSORIES">Jewelry & Accessories</option>
                  <option value="HOLIDAY_DECOR">Holiday Décor</option>
                  <option value="BAKED_GOODS">Baked Goods</option>
                  <option value="SPECIALTY_FOODS">Specialty Foods</option>
                  <option value="COFFEE_COCOA_DRINKS">Coffee, Cocoa & Drinks</option>
                  <option value="LOCAL_ART">Local Art</option>
                  <option value="WOODWORKING">Woodworking</option>
                  <option value="BOUTIQUE_GIFTS">Boutique Gifts</option>
                  <option value="CHILDRENS_ITEMS">Children's Items</option>
                  <option value="OHIO_THEMED">Ohio-Themed Products</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Approximate Price Range *
                </label>
                <input
                  type="text"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleChange}
                  placeholder="e.g. $10 - $60"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Product Description * (At least 10 characters)
                </label>
                <textarea
                  name="productDescription"
                  required
                  rows={4}
                  value={formData.productDescription}
                  onChange={handleChange}
                  placeholder="Describe the items you make/sell, materials used, holiday relevance, and what makes your creations special..."
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Years in Business
                </label>
                <input
                  type="number"
                  name="yearsInBusiness"
                  min="0"
                  value={formData.yearsInBusiness}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Previous Market / Show Experience
                </label>
                <input
                  type="text"
                  name="previousExperience"
                  value={formData.previousExperience}
                  onChange={handleChange}
                  placeholder="e.g. Chardon Square Farmers Market, Cleveland Craft Shows"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>
            </div>
          </div>

          {/* REQUIREMENTS & PERMITS */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-forest-900 flex items-center gap-2 border-b border-cream-200 pb-2">
              <Info className="w-5 h-5 text-gold-600" />
              5. Booth Requirements & Permits
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-cream-300 hover:border-forest-900 cursor-pointer">
                <input
                  type="checkbox"
                  name="electricityRequired"
                  checked={formData.electricityRequired}
                  onChange={handleChange}
                  className="h-4 w-4 text-forest-900 focus:ring-forest-900 rounded"
                />
                <span className="text-xs font-medium text-charcoal-800">
                  I require standard 120V electricity connection for my booth.
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-cream-300 hover:border-forest-900 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFoodVendor"
                  checked={formData.isFoodVendor}
                  onChange={handleChange}
                  className="h-4 w-4 text-forest-900 focus:ring-forest-900 rounded"
                />
                <span className="text-xs font-medium text-charcoal-800">
                  I am a Food or Beverage vendor (requires Geauga County Health Dept permit).
                </span>
              </label>
            </div>

            {formData.isFoodVendor && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Health Permits / Licenses Held
                </label>
                <input
                  type="text"
                  name="requiredPermits"
                  value={formData.requiredPermits}
                  onChange={handleChange}
                  placeholder="e.g. Mobile food permit # or cottage food exemption"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Special Requirements (Optional)
                </label>
                <input
                  type="text"
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  placeholder="e.g. Corner space request, oversized display"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-1">
                  Additional Comments (Optional)
                </label>
                <input
                  type="text"
                  name="additionalComments"
                  value={formData.additionalComments}
                  onChange={handleChange}
                  placeholder="Any questions or notes for our committee"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-forest-900"
                />
              </div>
            </div>
          </div>

          {/* TERMS & SUBMISSION */}
          <div className="space-y-4 pt-4 border-t border-cream-300">
            <label className="flex items-start gap-3 p-4 rounded-xl bg-cream-50 border border-gold-500/30 cursor-pointer">
              <input
                type="checkbox"
                name="agreedToTerms"
                required
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-forest-900 focus:ring-forest-900 rounded"
              />
              <span className="text-xs text-charcoal-800 leading-relaxed">
                I agree to the Chardon Holiday Market vendor guidelines, hours of operation, and understand that submission does not guarantee admission. I understand that fees ($200 Single Weekend or $800 Season) are only payable upon official acceptance by the committee.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-display font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-warm hover:shadow-gold-glow disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Application...' : 'Submit Vendor Application'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
