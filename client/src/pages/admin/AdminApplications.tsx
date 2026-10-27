import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  DollarSign,
  MessageSquare,
  Lock,
  Unlock,
  Globe,
  X,
  History,
  Send,
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { VendorApplication, ApplicationStatus, AdminAuditLog } from '../../types';

export const AdminApplications: React.FC = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Selected Detail Modal
  const [selectedApp, setSelectedApp] = useState<VendorApplication | null>(null);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [reviewNotes, setReviewNotes] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [confirmDestructive, setConfirmDestructive] = useState<{ action: string; label: string } | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (search) params.search = search;

      const res = await api.getAdminApplications(params);
      setApplications(res.applications);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, categoryFilter, search]);

  const openDetail = async (appId: string) => {
    try {
      const data = await api.getAdminApplicationDetail(appId);
      setSelectedApp(data.application);
      setAuditLogs(data.auditLog);
      setReviewNotes(data.application.reviewNotes || '');
    } catch (err: any) {
      showToast(err.message || 'Failed to load details', 'error');
    }
  };

  // Status Actions
  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedApp) return;

    try {
      const updated = await api.updateApplicationStatus(selectedApp.id, newStatus, reviewNotes);
      showToast(`Application marked as ${newStatus}`);
      setSelectedApp(updated);
      fetchApplications();
      setConfirmDestructive(null);
      // Refresh audit logs
      const detail = await api.getAdminApplicationDetail(selectedApp.id);
      setAuditLogs(detail.auditLog);
    } catch (err: any) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleTogglePublic = async (isPublic: boolean) => {
    if (!selectedApp) return;
    try {
      const updated = await api.togglePublicListing(selectedApp.id, isPublic);
      setSelectedApp(updated);
      showToast(isPublic ? 'Vendor added to public directory' : 'Vendor hidden from public directory');
      fetchApplications();
    } catch (err: any) {
      showToast('Toggle failed', 'error');
    }
  };

  const handleToggleLock = async (isLocked: boolean) => {
    if (!selectedApp) return;
    try {
      const updated = await api.toggleApplicationLock(selectedApp.id, isLocked);
      setSelectedApp(updated);
      showToast(isLocked ? 'Application locked from edits' : 'Application unlocked');
      fetchApplications();
    } catch (err: any) {
      showToast('Toggle lock failed', 'error');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !messageText) return;

    try {
      await api.sendVendorMessage(selectedApp.id, {
        subject: messageSubject || 'Update regarding your Holiday Market Application',
        content: messageText,
      });
      showToast('Message sent to vendor portal!');
      setMessageText('');
      setMessageSubject('');
      // refresh
      const detail = await api.getAdminApplicationDetail(selectedApp.id);
      setSelectedApp(detail.application);
    } catch (err: any) {
      showToast('Message send failed', 'error');
    }
  };

  const formatStatus = (s: ApplicationStatus) => {
    const map: Record<ApplicationStatus, string> = {
      PENDING: 'Pending',
      UNDER_REVIEW: 'Under Review',
      APPROVED: 'Approved',
      REJECTED: 'Rejected',
      AWAITING_PAYMENT: 'Awaiting Payment',
      PAID: 'Paid',
      CONFIRMED: 'Confirmed',
      CANCELLED: 'Cancelled',
    };
    return map[s] || s;
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Artisan & Vendor Intake
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            Application Management ({total})
          </h1>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gold-500/25 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-800/40 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search applicant, business, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:border-forest-900"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:border-forest-900 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="AWAITING_PAYMENT">Awaiting Payment</option>
            <option value="PAID">Paid</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:border-forest-900 bg-white"
          >
            <option value="">All Categories</option>
            <option value="HANDMADE_GOODS">Handmade Goods</option>
            <option value="CANDLES_HOME_FRAGRANCE">Candles & Home Fragrance</option>
            <option value="JEWELRY_ACCESSORIES">Jewelry & Accessories</option>
            <option value="HOLIDAY_DECOR">Holiday Décor</option>
            <option value="BAKED_GOODS">Baked Goods</option>
            <option value="SPECIALTY_FOODS">Specialty Foods</option>
            <option value="COFFEE_COCOA_DRINKS">Coffee, Cocoa & Drinks</option>
            <option value="LOCAL_ART">Local Art</option>
            <option value="WOODWORKING">Woodworking</option>
          </select>
        </div>
      </div>

      {/* Table of Applications */}
      <div className="bg-white rounded-2xl border border-gold-500/25 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-forest-900 text-cream-50 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Weekend</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-charcoal-800">
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => openDetail(app.id)}
                    className="hover:bg-cream-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-forest-900">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-charcoal-900">
                      {app.user?.firstName} {app.user?.lastName}
                    </td>
                    <td className="py-3 px-4 font-bold text-forest-900">
                      {app.businessName}
                    </td>
                    <td className="py-3 px-4">
                      {app.productCategory.replace(/_/g, ' ').toLowerCase()}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {app.vendorPackage === 'FULL_SEASON' ? '$800 (Season)' : '$200 (Single)'}
                    </td>
                    <td className="py-3 px-4">
                      {app.vendorPackage === 'FULL_SEASON' ? 'All 4 Weekends' : app.requestedWeekend?.title || 'Single'}
                    </td>
                    <td className="py-3 px-4 text-charcoal-800/70">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cream-200 text-forest-900">
                        {formatStatus(app.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        app.payment?.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.payment?.status || 'UNPAID'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(app.id);
                        }}
                        className="p-1.5 rounded-lg bg-forest-900 text-gold-300 hover:bg-forest-800 transition-colors"
                        title="View Full Application"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-charcoal-800 italic">
                    No applications found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-gold-500/30 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-forest-900 text-cream-50 p-6 flex items-start justify-between border-b border-gold-500/30">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-gold-400">
                  Application Review • Ref #{selectedApp.applicationNumber}
                </span>
                <h2 className="font-display text-2xl font-bold text-cream-50 mt-1">
                  {selectedApp.businessName}
                </h2>
                <p className="text-xs text-cream-200/80">
                  Applicant: {selectedApp.user?.firstName} {selectedApp.user?.lastName} ({selectedApp.user?.email}) • Phone: {selectedApp.user?.phone || 'N/A'}
                </p>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="text-cream-200 hover:text-white p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-charcoal-800">
              
              {/* Status and Action Buttons */}
              <div className="p-4 bg-cream-50 rounded-2xl border border-gold-500/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-forest-900 uppercase">Current Status:</span>
                    <span className="px-3 py-1 rounded-full bg-forest-900 text-gold-300 font-bold uppercase text-xs">
                      {formatStatus(selectedApp.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Public directory toggle */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-forest-900">
                      <input
                        type="checkbox"
                        checked={selectedApp.isPublicListing}
                        onChange={(e) => handleTogglePublic(e.target.checked)}
                        className="rounded text-forest-900"
                      />
                      <span>Public Directory Listing</span>
                    </label>

                    {/* Lock toggle */}
                    <button
                      onClick={() => handleToggleLock(!selectedApp.isLocked)}
                      className="px-2.5 py-1 rounded-lg border border-forest-900 text-[11px] font-bold text-forest-900 hover:bg-forest-50"
                    >
                      {selectedApp.isLocked ? 'Unlock Edits' : 'Lock Application'}
                    </button>
                  </div>
                </div>

                {/* Workflow Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-cream-200">
                  <span className="text-[11px] font-bold text-forest-950 uppercase block mr-1">
                    Actions:
                  </span>

                  <button
                    onClick={() => handleUpdateStatus('APPROVED')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[10px]"
                  >
                    Approve (Request Payment)
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('UNDER_REVIEW')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-[10px]"
                  >
                    Mark Under Review
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('CONFIRMED')}
                    className="px-3 py-1.5 rounded-lg bg-forest-900 hover:bg-forest-800 text-gold-300 font-bold uppercase text-[10px]"
                  >
                    Confirm Vendor Space
                  </button>

                  <button
                    onClick={() => setConfirmDestructive({ action: 'REJECTED', label: 'Reject Application' })}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase text-[10px]"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => setConfirmDestructive({ action: 'CANCELLED', label: 'Cancel Application' })}
                    className="px-3 py-1.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-bold uppercase text-[10px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Destructive Action Confirmation */}
              {confirmDestructive && (
                <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Confirm Action: {confirmDestructive.label}?</span>
                  </div>
                  <p className="text-[11px]">
                    This action will update the status of application #{selectedApp.applicationNumber} to {confirmDestructive.action}. Are you sure you wish to proceed?
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleUpdateStatus(confirmDestructive.action)}
                      className="px-4 py-1.5 rounded-lg bg-rose-700 text-white font-bold text-xs"
                    >
                      Yes, Proceed
                    </button>
                    <button
                      onClick={() => setConfirmDestructive(null)}
                      className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-900 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Complete Application Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cream-50/50 p-4 rounded-2xl border border-cream-200">
                <div>
                  <span className="font-bold text-forest-900 uppercase block">Address</span>
                  <p>{selectedApp.businessAddress}, {selectedApp.city}, {selectedApp.state} {selectedApp.zipCode}</p>
                </div>

                <div>
                  <span className="font-bold text-forest-900 uppercase block">Package & Fee</span>
                  <p className="font-semibold text-forest-900">
                    {selectedApp.vendorPackage === 'FULL_SEASON' ? 'Full Season ($800)' : 'Single Weekend ($200)'}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-forest-900 uppercase block">Requested Weekend</span>
                  <p>{selectedApp.requestedWeekend?.title || 'Season'}</p>
                </div>

                <div>
                  <span className="font-bold text-forest-900 uppercase block">Product Category</span>
                  <p>{selectedApp.productCategory.replace(/_/g, ' ')}</p>
                </div>

                <div>
                  <span className="font-bold text-forest-900 uppercase block">Price Range</span>
                  <p>{selectedApp.priceRange || 'Not provided'}</p>
                </div>

                <div>
                  <span className="font-bold text-forest-900 uppercase block">Years in Business</span>
                  <p>{selectedApp.yearsInBusiness ?? 0} years</p>
                </div>

                <div className="sm:col-span-2">
                  <span className="font-bold text-forest-900 uppercase block">Product Description</span>
                  <p className="p-3 bg-white rounded-xl border border-cream-200 mt-1 leading-relaxed">
                    {selectedApp.productDescription}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-forest-900 uppercase block">Electricity Needed</span>
                  <p>{selectedApp.electricityRequired ? 'Yes (Standard 120V)' : 'No'}</p>
                </div>

                <div>
                  <span className="font-bold text-forest-900 uppercase block">Food Vendor</span>
                  <p>{selectedApp.isFoodVendor ? `Yes (Permits: ${selectedApp.requiredPermits || 'Pending'})` : 'No'}</p>
                </div>

                {selectedApp.website && (
                  <div>
                    <span className="font-bold text-forest-900 uppercase block">Website</span>
                    <a href={selectedApp.website} target="_blank" rel="noreferrer" className="text-forest-900 underline">
                      {selectedApp.website}
                    </a>
                  </div>
                )}

                {selectedApp.instagram && (
                  <div>
                    <span className="font-bold text-forest-900 uppercase block">Instagram</span>
                    <p>{selectedApp.instagram}</p>
                  </div>
                )}
              </div>

              {/* Review Notes Section */}
              <div className="space-y-2">
                <span className="font-bold text-forest-900 uppercase block">
                  Admin Internal Notes / Decision Rationale
                </span>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add private review notes or instructions..."
                  className="w-full p-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:border-forest-900"
                />
              </div>

              {/* Message to Vendor Form */}
              <form onSubmit={handleSendMessage} className="space-y-2 bg-cream-50 p-4 rounded-xl border border-cream-200">
                <span className="font-bold text-forest-900 uppercase flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Send Message to Vendor Portal
                </span>
                <input
                  type="text"
                  placeholder="Subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs"
                />
                <textarea
                  rows={2}
                  placeholder="Type message to appear in vendor's dashboard..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-forest-900 text-cream-50 font-bold uppercase text-[10px] flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  Send Message
                </button>
              </form>

              {/* Audit Log Trail */}
              <div className="space-y-2 pt-2 border-t border-cream-200">
                <span className="font-bold text-forest-900 uppercase flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  Admin Audit Log Trail
                </span>
                {auditLogs.length > 0 ? (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-2 bg-white rounded-lg border border-cream-200 text-[11px] flex justify-between">
                        <div>
                          <strong className="text-forest-900">{log.action}</strong> by{' '}
                          <span>{log.user?.firstName} {log.user?.lastName}</span>
                        </div>
                        <span className="text-charcoal-800/60">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-charcoal-800/60 italic">No audit records yet.</p>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
