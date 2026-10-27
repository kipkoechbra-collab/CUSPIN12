import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  Sparkles,
  Lock,
  Edit,
  Save,
  X,
  ExternalLink,
  Calendar,
  DollarSign,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { VendorApplication, ApplicationStatus } from '../../types';

export const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<VendorApplication | null>(null);

  // Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    businessName: '',
    businessAddress: '',
    city: '',
    state: '',
    zipCode: '',
    website: '',
    instagram: '',
    facebook: '',
    productDescription: '',
    priceRange: '',
    specialRequirements: '',
    additionalComments: '',
  });

  // Simulated Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const fetchApplications = async () => {
    try {
      const data = await api.getMyApplications();
      setApplications(data);
      if (data.length > 0) {
        setSelectedApp(data[0]);
        setEditForm({
          businessName: data[0].businessName,
          businessAddress: data[0].businessAddress,
          city: data[0].city,
          state: data[0].state,
          zipCode: data[0].zipCode,
          website: data[0].website || '',
          instagram: data[0].instagram || '',
          facebook: data[0].facebook || '',
          productDescription: data[0].productDescription,
          priceRange: data[0].priceRange || '',
          specialRequirements: data[0].specialRequirements || '',
          additionalComments: data[0].additionalComments || '',
        });
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      const updated = await api.updateApplication(selectedApp.id, editForm);
      showToast('Application updated successfully!');
      setIsEditing(false);
      setSelectedApp(updated);
      fetchApplications();
    } catch (err: any) {
      showToast(err.message || 'Failed to update application', 'error');
    }
  };

  const handleSimulatePayment = async () => {
    if (!selectedApp) return;
    try {
      setPaymentProcessing(true);
      // In production, this calls Stripe Checkout or payment intent.
      // For demonstration, we trigger backend mock payment or prompt admin.
      setTimeout(() => {
        setPaymentProcessing(false);
        setShowPaymentModal(false);
        showToast('Payment submitted successfully! Your space is now confirmed.');
        fetchApplications();
      }, 1500);
    } catch (err: any) {
      showToast('Payment failed', 'error');
      setPaymentProcessing(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const config: Record<ApplicationStatus, { label: string; bg: string; text: string; icon: any }> = {
      PENDING: { label: 'Pending Review', bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
      UNDER_REVIEW: { label: 'Under Review', bg: 'bg-blue-100', text: 'text-blue-800', icon: Sparkles },
      APPROVED: { label: 'Approved', bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle },
      AWAITING_PAYMENT: { label: 'Awaiting Payment', bg: 'bg-gold-100 border border-gold-400', text: 'text-forest-950', icon: DollarSign },
      PAID: { label: 'Paid', bg: 'bg-teal-100', text: 'text-teal-800', icon: CheckCircle },
      CONFIRMED: { label: 'Confirmed Vendor', bg: 'bg-forest-900', text: 'text-gold-300 font-bold', icon: CheckCircle },
      REJECTED: { label: 'Not Accepted', bg: 'bg-rose-100', text: 'text-rose-800', icon: AlertCircle },
      CANCELLED: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-800', icon: X },
    };

    const c = config[status] || config.PENDING;
    const Icon = c.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
        <Icon className="w-3.5 h-3.5" />
        {c.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <Sparkles className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
          <p className="text-forest-900 font-display font-bold">Loading your vendor portal...</p>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-cream-100 py-20 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 border border-gold-500/25 text-center space-y-5 shadow-warm">
          <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-900 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-gold-500" />
          </div>
          <h2 className="font-display text-2xl font-bold text-forest-900">
            No Application Found
          </h2>
          <p className="text-xs text-charcoal-800 leading-relaxed">
            Welcome, {user?.firstName}! It looks like you haven't submitted a vendor application for the 2026 Chardon Holiday Market yet.
          </p>
          <div className="pt-2">
            <Link
              to="/become-vendor"
              className="px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-warm"
            >
              Apply as a Vendor &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const app = selectedApp || applications[0];
  const canEdit = !app.isLocked && !['PAID', 'CONFIRMED', 'CANCELLED', 'REJECTED'].includes(app.status);
  const canPay = ['APPROVED', 'AWAITING_PAYMENT'].includes(app.status) && app.payment?.status !== 'PAID';

  return (
    <div className="min-h-screen bg-cream-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Greeting & Status Banner */}
        <div className="bg-forest-900 bg-festive-pattern text-cream-50 rounded-3xl p-8 border border-gold-500/30 shadow-warm-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Vendor Portal • Ref #{app.applicationNumber}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-50">
              {app.businessName}
            </h1>
            <p className="text-xs text-cream-200/80">
              Applicant: {user?.firstName} {user?.lastName} ({user?.email})
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-left md:text-right">
              <span className="text-[11px] uppercase tracking-wider text-cream-200/70 block mb-1">
                Current Status
              </span>
              {getStatusBadge(app.status)}
            </div>

            {canPay && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold uppercase text-xs tracking-wider transition-all shadow-warm hover:shadow-gold-glow animate-pulse"
              >
                Complete Payment (${app.vendorPackage === 'FULL_SEASON' ? '800' : '200'})
              </button>
            )}
          </div>
        </div>

        {/* Action / Notification Banner based on status */}
        {app.status === 'PENDING' && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Application Received & Queued for Review</strong>
              Our team reviews applications on a rolling basis. You will be notified via email when your status changes. Remember: no fees are due until approval.
            </div>
          </div>
        )}

        {canPay && (
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-base">Congratulations! Your Application Is Approved!</strong>
                Please complete your vendor space fee to officially reserve your chalet spot on Chardon Square.
              </div>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-5 py-2.5 rounded-xl bg-forest-900 text-gold-300 hover:bg-forest-800 font-bold text-xs uppercase tracking-wider shrink-0 transition-colors"
            >
              Pay ${app.vendorPackage === 'FULL_SEASON' ? '800' : '200'} Now
            </button>
          </div>
        )}

        {app.status === 'PAID' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Payment Received & Confirmed</strong>
              Your vendor space is fully booked! Setup instructions and load-in schedules will be published in your portal closer to market dates.
            </div>
          </div>
        )}

        {/* Main Grid: Details + Messages / Logistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Application Details & Edit Option */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-500/25 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-cream-200 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gold-600" />
                  <h3 className="font-display text-xl font-bold text-forest-900">
                    Application Information
                  </h3>
                </div>

                {canEdit && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-forest-900 text-forest-900 hover:bg-forest-50 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Details
                  </button>
                )}

                {app.isLocked && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-charcoal-800/60 bg-cream-200 px-2.5 py-1 rounded-md">
                    <Lock className="w-3 h-3" />
                    Locked by Admin
                  </span>
                )}
              </div>

              {isEditing ? (
                /* Edit Form */
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-charcoal-800 uppercase mb-1">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={editForm.businessName}
                        onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-charcoal-800 uppercase mb-1">
                        Price Range
                      </label>
                      <input
                        type="text"
                        value={editForm.priceRange}
                        onChange={(e) => setEditForm({ ...editForm, priceRange: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-charcoal-800 uppercase mb-1">
                        Product Description
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.productDescription}
                        onChange={(e) => setEditForm({ ...editForm, productDescription: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-charcoal-800 uppercase mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        value={editForm.website}
                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-charcoal-800 uppercase mb-1">
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={editForm.instagram}
                        onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold uppercase tracking-wider hover:bg-forest-800"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl border border-cream-300 text-xs text-charcoal-800"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Read-Only Details */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-charcoal-800">
                  <div className="space-y-1">
                    <span className="font-bold text-forest-900 uppercase">Package Selected</span>
                    <p className="text-sm font-semibold text-forest-950">
                      {app.vendorPackage === 'FULL_SEASON' ? 'Season Vendor ($800)' : 'Single Weekend Vendor ($200)'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-forest-900 uppercase">Selected Weekend</span>
                    <p className="text-sm font-semibold text-forest-950">
                      {app.vendorPackage === 'FULL_SEASON'
                        ? 'All 4 Market Weekends'
                        : app.requestedWeekend?.title || 'Selected Weekend'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-forest-900 uppercase">Product Category</span>
                    <p className="text-sm">{app.productCategory.replace(/_/g, ' ')}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-forest-900 uppercase">Price Range</span>
                    <p className="text-sm">{app.priceRange || 'Not specified'}</p>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <span className="font-bold text-forest-900 uppercase">Product Description</span>
                    <p className="text-sm leading-relaxed bg-cream-50 p-3 rounded-xl border border-cream-200">
                      {app.productDescription}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-forest-900 uppercase">Electricity Connection</span>
                    <p className="text-sm">{app.electricityRequired ? 'Required (120V standard)' : 'None requested'}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-forest-900 uppercase">Food / Drink Status</span>
                    <p className="text-sm">{app.isFoodVendor ? 'Yes (Health Permit provided)' : 'Non-food artisan'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Payment & Communication Card */}
          <div className="space-y-6">
            
            {/* Payment Summary */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-500/25 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
                <CreditCard className="w-5 h-5 text-gold-600" />
                <h3 className="font-display text-lg font-bold text-forest-900">
                  Payment Status
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-charcoal-800">Fee Amount:</span>
                  <span className="font-bold text-forest-900 text-sm">
                    ${app.vendorPackage === 'FULL_SEASON' ? '800.00' : '200.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-charcoal-800">Status:</span>
                  <span className="font-semibold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded bg-cream-100 text-forest-900">
                    {app.payment?.status || 'UNPAID'}
                  </span>
                </div>
                {app.payment?.transactionRef && (
                  <div className="flex justify-between pt-1 text-[11px] text-charcoal-800/70">
                    <span>Transaction Ref:</span>
                    <span className="font-mono">{app.payment.transactionRef}</span>
                  </div>
                )}
              </div>

              {canPay && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold uppercase text-xs tracking-wider transition-colors shadow-warm"
                >
                  Pay Space Fee Now
                </button>
              )}
            </div>

            {/* Market Committee Messages */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-500/25 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
                <MessageSquare className="w-5 h-5 text-gold-600" />
                <h3 className="font-display text-lg font-bold text-forest-900">
                  Market Announcements
                </h3>
              </div>

              {app.messages && app.messages.length > 0 ? (
                <div className="space-y-3">
                  {app.messages.map((m) => (
                    <div key={m.id} className="p-3 bg-cream-50 rounded-xl border border-cream-200 space-y-1 text-xs">
                      <div className="font-bold text-forest-900">{m.subject || 'Market Notice'}</div>
                      <p className="text-charcoal-800">{m.content}</p>
                      <span className="text-[10px] text-charcoal-800/60 block pt-1">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-charcoal-800/70 italic">
                  No individual messages. Setup instructions and load-in schedules will be delivered here after space confirmation.
                </p>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Simulated Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-gold-500/40 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between border-b border-cream-200 pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gold-600" />
                <h3 className="font-display text-xl font-bold text-forest-900">
                  Complete Vendor Fee
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-charcoal-800/60 hover:text-charcoal-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-cream-50 rounded-xl border border-cream-200 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-forest-900 text-sm">
                <span>{app.vendorPackage === 'FULL_SEASON' ? 'Season Vendor Package' : 'Single Weekend Package'}</span>
                <span>${app.vendorPackage === 'FULL_SEASON' ? '800.00' : '200.00'}</span>
              </div>
              <p className="text-charcoal-800/70">
                Secure transaction processed for Chardon Holiday Market booth reservation.
              </p>
            </div>

            {/* Payment Fields (Card simulation) */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-charcoal-800 uppercase mb-1">Name on Card</label>
                <input
                  type="text"
                  defaultValue={`${user?.firstName} ${user?.lastName}`}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-charcoal-800 uppercase mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 •••• •••• 4242"
                  className="w-full px-3 py-2 rounded-lg border text-sm font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal-800 uppercase mb-1">Expiration</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full px-3 py-2 rounded-lg border text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-800 uppercase mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 rounded-lg border text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={paymentProcessing}
              className="w-full py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-gold-300 font-bold uppercase text-xs tracking-wider transition-all shadow-warm disabled:opacity-50"
            >
              {paymentProcessing ? 'Processing Secure Payment...' : `Pay $${app.vendorPackage === 'FULL_SEASON' ? '800.00' : '200.00'}`}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
