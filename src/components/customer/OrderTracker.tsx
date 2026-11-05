import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingOrder } from '../../types/travel';
import { generateBookingInvoicePdf } from '../../utils/invoicePdfGenerator';
import { 
  Search, 
  Car, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  User, 
  CreditCard,
  Printer,
  ChevronRight,
  ShieldCheck,
  Download,
  FileCheck,
  FileText
} from 'lucide-react';

export const OrderTracker: React.FC = () => {
  const { orders, setActiveOrderForPayment, setSelectedInvoiceForModal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<BookingOrder | null>(orders[0] || null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadInvoice = () => {
    if (!selectedOrder) return;
    try {
      generateBookingInvoicePdf(selectedOrder);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating invoice PDF:', err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.whatsapp.includes(q)
    );
  });

  const getOrderStatusTimeline = (status: BookingOrder['orderStatus']) => {
    const steps = [
      { key: 'baru', label: 'Order Diterima', desc: 'Menunggu konfirmasi pembayaran' },
      { key: 'dikonfirmasi', label: 'Terkonfirmasi', desc: 'Pembayaran telah valid' },
      { key: 'armada_ditugaskan', label: 'Armada & Driver Siap', desc: 'Unit kendaraan & kru telah dialokasikan' },
      { key: 'sedang_berjalan', label: 'Wisata Berlangsung', desc: 'Rombongan dalam perjalanan tour' },
      { key: 'selesai', label: 'Tour Selesai', desc: 'Perjalanan telah sukses dituntaskan' }
    ];

    const orderRank: Record<string, number> = {
      baru: 0,
      dikonfirmasi: 1,
      armada_ditugaskan: 2,
      sedang_berjalan: 3,
      selesai: 4,
      dibatalkan: -1
    };

    const currentRank = orderRank[status] ?? 0;

    return { steps, currentRank };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          PORTAL WISATAWAN
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
          Lacak Status Pesanan & Informasi Armada
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1">
          Pantau status pemesanan, konfirmasi pembayaran, penugasan armada kendaraan, dan kontak pengemudi secara real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Search & Order List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari No. Order / Nama Pemesan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs py-2 pl-9 pr-3 border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-2.5">
            {filteredOrders.length === 0 ? (
              <div className="p-6 bg-white rounded-xl border border-neutral-200 text-center text-xs text-neutral-500">
                Pesanan tidak ditemukan. Silakan cek kembali nomor order Anda.
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                const isPaid = ord.paymentStatus === 'paid' || ord.paymentStatus === 'verified';

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-orange-50/70 border-orange-500 shadow-xs'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono font-semibold text-neutral-900 mb-1">
                      <span>{ord.orderNumber}</span>
                      <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-md ${
                        isPaid ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isPaid ? 'Lunas' : 'Menunggu Bayar'}
                      </span>
                    </div>

                    <div className="text-neutral-800 font-bold truncate">
                      {ord.packageTitle}
                    </div>

                    <div className="flex items-center justify-between text-neutral-500 text-[11px] mt-2 pt-2 border-t border-neutral-100">
                      <span>{ord.customer.fullName}</span>
                      <span>{ord.tourStartDate}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Active Order Timeline & Full Details */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              {/* Header card */}
              <div className="p-6 bg-neutral-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-orange-400 font-bold">
                      {selectedOrder.orderNumber}
                    </span>
                    <span className="text-neutral-400 text-xs">·</span>
                    <span className="text-xs text-neutral-300">
                      Dibuat {selectedOrder.createdAt}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedOrder.packageTitle}
                  </h2>
                  <span className="text-xs text-neutral-300 mt-1 block">
                    {selectedOrder.destinationLabel} · {selectedOrder.paxCount} Peserta ({selectedOrder.tier === 'all_in' ? 'Paket All In' : 'Paket Hemat'})
                  </span>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-neutral-400 block">Total Biaya:</span>
                    <span className="text-lg font-black text-orange-400 font-mono" data-tabular>
                      Rp {selectedOrder.grandTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadInvoice}
                    className="py-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    title="Unduh file PDF invoice pemesanan resmi"
                  >
                    {downloadSuccess ? (
                      <>
                        <FileCheck className="w-3.5 h-3.5 text-white" />
                        <span>PDF Terunduh!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-white" />
                        <span>Download Invoice</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Timeline Progress */}
              <div className="p-6 border-b border-neutral-200 bg-neutral-50/50">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-500" /> Tahapan Real-Time
                </h3>

                {(() => {
                  const { steps, currentRank } = getOrderStatusTimeline(selectedOrder.orderStatus);
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      {steps.map((st, idx) => {
                        const isDone = currentRank >= idx;
                        const isCurrent = currentRank === idx;

                        return (
                          <div
                            key={st.key}
                            className={`p-3 rounded-xl border text-xs relative ${
                              isCurrent
                                ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                                : isDone
                                ? 'bg-blue-50 border-blue-200 text-blue-900'
                                : 'bg-white border-neutral-200 text-neutral-400'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-[11px]">Step {idx + 1}</span>
                              {isDone && !isCurrent && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                              )}
                            </div>
                            <div className="font-bold text-xs">{st.label}</div>
                            <div className={`text-[10px] mt-0.5 ${isCurrent ? 'text-white/90' : 'text-neutral-500'}`}>
                              {st.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Details grid: Assigned Fleet & Customer Data */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assigned Vehicle & Driver Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-blue-600" /> Penugasan Armada & Supir
                  </h3>

                  {selectedOrder.assignedFleetName ? (
                    <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
                      <div>
                        <span className="text-[10px] text-blue-800 uppercase font-bold block">
                          Unit Kendaraan Wisata
                        </span>
                        <span className="text-sm font-bold text-neutral-900 block mt-0.5">
                          {selectedOrder.assignedFleetName}
                        </span>
                        <span className="text-xs text-neutral-600">
                          Fasilitas: AC Dingin, Reclining Seats, Audio & Charger
                        </span>
                      </div>

                      <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase block">
                            Driver Berpengalaman
                          </span>
                          <span className="text-xs font-bold text-neutral-900">
                            {selectedOrder.assignedDriverName || 'Driver Senior PERGIDIANTAR'}
                          </span>
                        </div>
                        {selectedOrder.assignedDriverPhone && (
                          <a
                            href={`https://wa.me/${selectedOrder.assignedDriverPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-3 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Hubungi Driver</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-500">
                      Armada dan driver sedang dalam proses alokasi oleh tim operasional kami (H-3 sebelum jadwal perjalanan).
                    </div>
                  )}

                  {/* Hotel info */}
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                      Akomodasi Hotel & Konsumsi
                    </span>
                    <span className="font-semibold text-neutral-800">
                      {selectedOrder.tier === 'all_in'
                        ? (selectedOrder.hotelAllotment || 'Hotel Bintang Mitra (Makan 1x di hotel dan 2x/ hari di luar hotel)')
                        : 'Penginapan & Makan Mandiri (Paket Hemat fokus pada kendaraan, driver, bbm, parkir)'}
                    </span>
                  </div>
                </div>

                {/* Customer & Itinerary Summary */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" /> Data Pemesan & Titik Jemput
                  </h3>

                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Nama Pemesan:</span>
                      <span className="font-semibold text-neutral-800">{selectedOrder.customer.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">WhatsApp / Telp:</span>
                      <span className="font-semibold text-neutral-800">{selectedOrder.customer.whatsapp}</span>
                    </div>
                    {selectedOrder.customer.companyOrFamilyName && (
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Instansi / Keluarga:</span>
                        <span className="font-semibold text-neutral-800">{selectedOrder.customer.companyOrFamilyName}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Titik Jemput:</span>
                      <span className="font-semibold text-neutral-800 text-right max-w-[200px]">
                        {selectedOrder.customer.pickupAddress}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Tanggal Wisata:</span>
                      <span className="font-semibold text-neutral-800">
                        {selectedOrder.tourStartDate} s/d {selectedOrder.tourEndDate}
                      </span>
                    </div>
                    {selectedOrder.customer.specialRequests && (
                      <div className="pt-2 border-t border-neutral-200 text-[11px] text-neutral-600">
                        <strong>Catatan Khusus:</strong> {selectedOrder.customer.specialRequests}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    {selectedOrder.paymentStatus !== 'paid' && selectedOrder.paymentStatus !== 'verified' && (
                      <button
                        onClick={() => setActiveOrderForPayment(selectedOrder)}
                        className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs min-w-[130px]"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Bayar Sekarang</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceForModal(selectedOrder)}
                      className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                      title="Buka Invoice Digital Interaktif"
                    >
                      <FileText className="w-4 h-4 text-white" />
                      <span>Lihat Invoice</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadInvoice}
                      className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                      title="Unduh file PDF invoice pemesanan resmi"
                    >
                      {downloadSuccess ? (
                        <>
                          <FileCheck className="w-4 h-4 text-white" />
                          <span>Invoice PDF Terunduh!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-white" />
                          <span>Download Invoice (PDF)</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="py-2.5 px-3.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak Bukti</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-400">
              Pilih pesanan dari daftar di sebelah kiri untuk melihat rincian lengkap.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
