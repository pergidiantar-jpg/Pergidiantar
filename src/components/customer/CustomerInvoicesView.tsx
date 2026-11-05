import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingOrder } from '../../types/travel';
import { generateBookingInvoicePdf } from '../../utils/invoicePdfGenerator';
import { CustomerInvoiceModal } from './CustomerInvoiceModal';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  CreditCard, 
  ArrowRight, 
  Calendar, 
  DollarSign,
  Printer,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const CustomerInvoicesView: React.FC = () => {
  const { 
    orders, 
    customerUser, 
    setActiveOrderForPayment,
    selectedInvoiceForModal,
    setSelectedInvoiceForModal 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Filter orders for the current customer (if customer has email, match it, or fallback to all orders in demo)
  const customerOrders = orders.filter(o => {
    if (customerUser?.email) {
      // If customer has orders matching their email, show them
      const matchesEmail = o.customer.email.toLowerCase() === customerUser.email.toLowerCase();
      // If none match exactly in demo, show all orders so customer can test invoice feature
      const hasAnyMatched = orders.some(ord => ord.customer.email.toLowerCase() === customerUser.email.toLowerCase());
      if (hasAnyMatched) {
        return matchesEmail;
      }
    }
    return true;
  });

  // Apply search and status filter
  const filteredOrders = customerOrders.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(q) ||
      o.packageTitle.toLowerCase().includes(q) ||
      o.destinationLabel.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q);

    const isPaid = o.paymentStatus === 'paid' || o.paymentStatus === 'verified';
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'paid' ? isPaid :
      !isPaid;

    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalInvoices = customerOrders.length;
  const paidInvoices = customerOrders.filter(o => o.paymentStatus === 'paid' || o.paymentStatus === 'verified').length;
  const pendingInvoices = customerOrders.filter(o => o.paymentStatus === 'pending').length;
  const totalAmountBilled = customerOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalAmountPaid = customerOrders
    .filter(o => o.paymentStatus === 'paid' || o.paymentStatus === 'verified')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const handleDownloadPdf = (order: BookingOrder) => {
    generateBookingInvoicePdf(order);
    setDownloadSuccessId(order.id);
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-orange-600" />
              <span>Pusat Invoice & Tagihan Pelanggan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Invoice & Riwayat Pembayaran Wisata
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Lihat rincian tagihan digital resmi, unduh file PDF invoice, cetak bukti pemesanan, atau selesaikan pembayaran paket perjalanan Anda.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3.5 bg-neutral-900 text-white rounded-2xl flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Status Dokumen</span>
                <span className="text-xs font-bold text-white">Legal & Terverifikasi Resmi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                Total Invoice
              </span>
              <span className="text-base font-extrabold text-neutral-900">
                {totalInvoices} Dokumen
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                Invoice Lunas
              </span>
              <span className="text-base font-extrabold text-emerald-600">
                {paidInvoices} Lunas
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                Menunggu Bayar
              </span>
              <span className="text-base font-extrabold text-amber-600">
                {pendingInvoices} Menunggu
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                Total Pembayaran
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-orange-600 truncate block">
                Rp {totalAmountPaid.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari no invoice, nama paket, atau kota..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-200 focus:border-orange-500 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 outline-none transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl border border-neutral-200 text-xs font-semibold shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`py-1.5 px-3 rounded-lg transition-colors ${
              statusFilter === 'all'
                ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Semua ({customerOrders.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5 ${
              statusFilter === 'paid'
                ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                : 'text-neutral-500 hover:text-emerald-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Lunas ({paidInvoices})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-white text-amber-800 shadow-2xs font-bold'
                : 'text-neutral-500 hover:text-amber-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Menunggu Bayar ({pendingInvoices})
          </button>
        </div>
      </div>

      {/* Invoice Cards List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-500 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            Tidak ada invoice yang ditemukan
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Tidak ada invoice yang cocok dengan kriteria pencarian Anda. Coba sesuaikan filter atau reset kata kunci.'
              : 'Anda belum memiliki riwayat pemesanan atau tagihan paket wisata di akun ini.'}
          </p>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isPaid = order.paymentStatus === 'paid' || order.paymentStatus === 'verified';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-neutral-200 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left: Invoice Core Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-lg">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      Dibuat: {order.createdAt}
                    </span>
                    <span className="text-xs text-neutral-400">·</span>
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        LUNAS / PAID
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" />
                        MENUNGGU PEMBAYARAN
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-neutral-900">
                      {order.packageTitle}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {order.destinationLabel} · {order.paxCount} Peserta ({order.tier === 'all_in' ? 'All In VIP' : 'Paket Hemat'}) · Jadwal {order.tourStartDate} s/d {order.tourEndDate}
                    </p>
                  </div>

                  <div className="text-xs text-neutral-600 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                    <span>
                      <strong className="text-neutral-700">Metode:</strong> {order.paymentMethod.toUpperCase()}
                    </span>
                    <span>
                      <strong className="text-neutral-700">Armada:</strong> {order.selectedVehicle || order.assignedFleetName || 'Armada Rekomendasi'}
                    </span>
                    <span>
                      <strong className="text-neutral-700">Hotel:</strong> {order.hotelAllotment || 'Hotel Rekanan'}
                    </span>
                  </div>
                </div>

                {/* Right: Total Price & Action Buttons */}
                <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-neutral-100 shrink-0">
                  <div className="sm:text-right">
                    <span className="text-[11px] font-semibold text-neutral-400 block">Total Tagihan:</span>
                    <span className="text-lg font-black text-neutral-900 font-mono" data-tabular>
                      Rp {order.grandTotal.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoiceForModal(order)}
                      className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-neutral-200"
                      title="Lihat Invoice Digital Lengkap"
                    >
                      <Eye className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Lihat Invoice</span>
                    </button>

                    <button
                      onClick={() => handleDownloadPdf(order)}
                      className="py-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-orange-200"
                      title="Unduh Invoice PDF"
                    >
                      {downloadSuccessId === order.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>PDF Terunduh</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 text-orange-600" />
                          <span>Unduh PDF</span>
                        </>
                      )}
                    </button>

                    {!isPaid && (
                      <button
                        onClick={() => setActiveOrderForPayment(order)}
                        className="py-2 px-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                        title="Bayar tagihan sekarang"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Bayar Sekarang</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Digital Invoice Modal */}
      <CustomerInvoiceModal
        order={selectedInvoiceForModal}
        isOpen={!!selectedInvoiceForModal}
        onClose={() => setSelectedInvoiceForModal(null)}
        onPayNow={(order) => {
          setSelectedInvoiceForModal(null);
          setActiveOrderForPayment(order);
        }}
      />
    </div>
  );
};
