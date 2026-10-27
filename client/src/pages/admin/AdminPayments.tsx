import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle,
  RotateCcw,
  DollarSign,
  Plus,
  X,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Payment, PaymentStatus } from '../../types';

export const AdminPayments: React.FC = () => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Manual payment modal
  const [manualPayTarget, setManualPayTarget] = useState<Payment | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [manualNote, setManualNote] = useState('');

  // Refund modal
  const [refundTarget, setRefundTarget] = useState<Payment | null>(null);
  const [refundNote, setRefundNote] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminPayments(statusFilter || undefined);
      setPayments(data);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const handleMarkPaid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPayTarget) return;

    try {
      await api.markPaymentPaid(manualPayTarget.id, {
        transactionRef: transactionRef || `OFFLINE-CHECK-${Date.now()}`,
        note: manualNote,
      });
      showToast('Payment marked as received & application marked as PAID!');
      setManualPayTarget(null);
      setTransactionRef('');
      setManualNote('');
      fetchPayments();
    } catch (err: any) {
      showToast(err.message || 'Failed to record payment', 'error');
    }
  };

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTarget) return;

    try {
      await api.refundPayment(refundTarget.id, {
        note: refundNote,
      });
      showToast('Payment marked as refunded.');
      setRefundTarget(null);
      setRefundNote('');
      fetchPayments();
    } catch (err: any) {
      showToast(err.message || 'Refund failed', 'error');
    }
  };

  const formatStatus = (s: PaymentStatus) => {
    const map: Record<PaymentStatus, { label: string; bg: string }> = {
      UNPAID: { label: 'Unpaid', bg: 'bg-gray-100 text-gray-800' },
      PAYMENT_REQUESTED: { label: 'Requested', bg: 'bg-amber-100 text-amber-800' },
      PROCESSING: { label: 'Processing', bg: 'bg-blue-100 text-blue-800' },
      PAID: { label: 'Paid', bg: 'bg-emerald-100 text-emerald-800' },
      FAILED: { label: 'Failed', bg: 'bg-rose-100 text-rose-800' },
      REFUNDED: { label: 'Refunded', bg: 'bg-purple-100 text-purple-800' },
    };
    return map[s] || { label: s, bg: 'bg-gray-100' };
  };

  const totalCollected = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Title & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
            Financial Ledger
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-forest-900">
            Payment Management
          </h1>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-forest-900 text-gold-300 rounded-xl font-display font-bold text-sm">
          <DollarSign className="w-4 h-4" />
          <span>Total Collected: ${totalCollected.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gold-500/25 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-charcoal-800 uppercase">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-cream-300 text-xs bg-white focus:outline-none focus:border-forest-900"
          >
            <option value="">All Payments</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PAYMENT_REQUESTED">Payment Requested</option>
            <option value="PAID">Paid</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>

        <span className="text-xs text-charcoal-800/60 font-medium">
          Showing {payments.length} transactions
        </span>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-gold-500/25 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-forest-900 text-cream-50 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal-800">
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((p) => {
                  const s = formatStatus(p.status);
                  return (
                    <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-forest-900">
                        {p.application?.businessName || 'Vendor Space'}
                      </td>
                      <td className="py-3 px-4">
                        {p.application?.user?.firstName} {p.application?.user?.lastName}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-forest-950">
                        ${p.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.bg}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-charcoal-800/70">
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-charcoal-800/80">
                        {p.transactionRef || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {p.status !== 'PAID' && (
                            <button
                              onClick={() => setManualPayTarget(p)}
                              className="px-2.5 py-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] uppercase tracking-wider"
                              title="Mark Offline Payment Received"
                            >
                              Mark Paid
                            </button>
                          )}
                          {p.status === 'PAID' && (
                            <button
                              onClick={() => setRefundTarget(p)}
                              className="px-2.5 py-1 rounded-md bg-purple-700 hover:bg-purple-800 text-white font-bold text-[10px] uppercase tracking-wider"
                              title="Process Refund"
                            >
                              Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal-800 italic">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Mark Paid Modal */}
      {manualPayTarget && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleMarkPaid}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold-500/30 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-lg text-forest-900">
                Mark Offline Payment Received
              </h3>
              <button
                type="button"
                onClick={() => setManualPayTarget(null)}
                className="text-charcoal-800/60 hover:text-charcoal-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-charcoal-800 leading-relaxed">
              Record check, cash, or offline credit payment of{' '}
              <strong>${manualPayTarget.amount}</strong> for {manualPayTarget.application?.businessName}.
            </p>

            <div>
              <label className="block text-xs font-bold text-charcoal-800 uppercase mb-1">
                Transaction Reference / Check #
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CHECK-4081 or ZELLE-89"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-800 uppercase mb-1">
                Admin Notes
              </label>
              <textarea
                rows={2}
                placeholder="Received by committee treasurer on..."
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-forest-900 text-gold-300 font-bold text-xs uppercase"
              >
                Confirm Payment
              </button>
              <button
                type="button"
                onClick={() => setManualPayTarget(null)}
                className="px-4 py-2.5 rounded-xl border text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Refund Modal */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleRefund}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold-500/30 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-lg text-forest-900">
                Confirm Refund
              </h3>
              <button
                type="button"
                onClick={() => setRefundTarget(null)}
                className="text-charcoal-800/60 hover:text-charcoal-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-charcoal-800 leading-relaxed">
              Mark ${refundTarget.amount} as refunded for {refundTarget.application?.businessName}.
            </p>

            <div>
              <label className="block text-xs font-bold text-charcoal-800 uppercase mb-1">
                Reason for Refund
              </label>
              <textarea
                required
                rows={2}
                placeholder="Reason..."
                value={refundNote}
                onChange={(e) => setRefundNote(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs uppercase"
              >
                Process Refund
              </button>
              <button
                type="button"
                onClick={() => setRefundTarget(null)}
                className="px-4 py-2.5 rounded-xl border text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
