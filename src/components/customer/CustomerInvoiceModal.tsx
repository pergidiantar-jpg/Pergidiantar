import React, { useRef } from 'react';
import { BookingOrder } from '../../types/travel';
import { generateBookingInvoicePdf } from '../../utils/invoicePdfGenerator';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  Users, 
  Car, 
  Hotel, 
  CreditCard,
  Building2,
  FileText,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface CustomerInvoiceModalProps {
  order: BookingOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onPayNow?: (order: BookingOrder) => void;
  onPayOrder?: (order: BookingOrder) => void;
}

export const CustomerInvoiceModal: React.FC<CustomerInvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
  onPayNow,
  onPayOrder
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const isPaid = order.paymentStatus === 'paid' || order.paymentStatus === 'verified';
  const isPending = order.paymentStatus === 'pending';

  const handleDownloadPdf = () => {
    generateBookingInvoicePdf(order);
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculations for display
  const packagePricePerPax = order.pricePerPax || Math.round(order.subtotal / (order.paxCount || 1));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 print:p-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/70 backdrop-blur-xs transition-opacity print:hidden" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div 
        ref={printRef}
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-neutral-200 z-10 overflow-hidden my-4 print:shadow-none print:border-none print:my-0 print:rounded-none"
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold tracking-wide uppercase text-neutral-300">
              Invoice Digital Resmi Pelanggan
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700"
              title="Cetak Invoice"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-300" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="py-1.5 px-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Unduh Invoice PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Content Area */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Header Kop Surat */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-neutral-200">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-neutral-200 p-1 shrink-0 shadow-xs">
                <img 
                  src="/assets/aistudio/1793582722648_90a12056.jpg" 
                  alt="Logo PERGIDIANTAR" 
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div>
                <span className="text-2xl font-black text-neutral-900 tracking-tight block leading-none">
                  PERGI<span className="text-orange-500">DIANTAR</span>
                </span>
                <span className="text-xs font-semibold text-neutral-500 block mt-1">
                  Jasa Perjalanan Wisata & Transportasi Terpercaya
                </span>
                <span className="text-[11px] text-neutral-400 block mt-0.5">
                  Alamat: Jambon - Kota Jogjakarta · WA: 087716443331
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xl font-extrabold text-neutral-900 block tracking-tight">
                INVOICE TAGIHAN
              </span>
              <span className="font-mono text-sm font-bold text-orange-600 block mt-0.5">
                {order.orderNumber}
              </span>

              {/* Status Pill */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border">
                {isPaid ? (
                  <span className="bg-emerald-100 text-emerald-800 border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    LUNAS / PAID
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    MENUNGGU PEMBAYARAN
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Ditagihkan Kepada (Pelanggan):
              </span>
              <span className="text-sm font-bold text-neutral-900 block">
                {order.customer.fullName}
              </span>
              <span className="text-neutral-600 block mt-0.5">
                Email: {order.customer.email}
              </span>
              <span className="text-neutral-600 block">
                WhatsApp: {order.customer.whatsapp}
              </span>
              {order.notes && (
                <span className="text-neutral-500 italic block mt-1">
                  Catatan: "{order.notes}"
                </span>
              )}
            </div>

            <div className="sm:text-right space-y-1">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Tanggal Booking:
                </span>
                <span className="font-semibold text-neutral-800 ml-2">
                  {order.createdAt}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Metode Pembayaran:
                </span>
                <span className="font-semibold text-neutral-800 ml-2 uppercase">
                  {order.paymentMethod} {order.paymentReference ? `(${order.paymentReference})` : ''}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Jadwal Perjalanan:
                </span>
                <span className="font-semibold text-neutral-800 ml-2">
                  {order.tourStartDate} s/d {order.tourEndDate}
                </span>
              </div>
            </div>
          </div>

          {/* Tour & Facility Allocation Summary */}
          <div className="border border-neutral-200 rounded-2xl p-4 bg-white space-y-3">
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              Paket Wisata & Fasilitas Terkonfirmasi
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Destinasi & Paket</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{order.packageTitle}</span>
                <span className="text-[11px] text-orange-600 font-semibold block mt-0.5">
                  {order.destinationLabel} · {order.tier === 'all_in' ? 'All In VIP' : 'Paket Hemat'}
                </span>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Armada & Supir</span>
                <span className="font-bold text-neutral-900 block mt-0.5">
                  {order.selectedVehicle || order.assignedFleetName || 'Armada Rekomendasi Sesuai Paket'}
                </span>
                <span className="text-[11px] text-blue-700 font-semibold block mt-0.5">
                  {order.assignedDriverName ? `Driver: ${order.assignedDriverName}` : 'Driver Berlisensi Ditugaskan'}
                </span>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Akomodasi Hotel</span>
                <span className="font-bold text-neutral-900 block mt-0.5">
                  {order.hotelAllotment || 'Hotel Bintang Rekanan Terpilih'}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                  Termasuk Sarapan & Kuota Kamar Siap
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Pricing Table */}
          <div className="border border-neutral-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-white font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Deskripsi Rincian Layanan</th>
                  <th className="py-3 px-4 text-center">Jumlah Pax</th>
                  <th className="py-3 px-4 text-right">Tarif Satuan</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                <tr>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-neutral-900 block">
                      Paket Wisata {order.packageTitle} ({order.tier === 'all_in' ? 'All In VIP' : 'Paket Hemat'})
                    </span>
                    <span className="text-[11px] text-neutral-500 block mt-0.5">
                      Termasuk transportasi, bbm, supir, tiket seluruh destinasi wisata, dan akomodasi hotel
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-neutral-800">
                    {order.paxCount} Orang
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-neutral-700">
                    Rp {packagePricePerPax.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900">
                    Rp {order.subtotal.toLocaleString('id-ID')}
                  </td>
                </tr>

                {order.selectedVehicle && (
                  <tr>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-neutral-900 block">
                        Pilihan Armada: {order.selectedVehicle}
                      </span>
                      <span className="text-[11px] text-neutral-500 block mt-0.5">
                        Armada Pariwisata Ber-AC & Driver Berlisensi
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-neutral-600">
                      1 Unit
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-neutral-700">
                      Include Paket
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900">
                      {order.vehicleRateAdjustment && order.vehicleRateAdjustment > 0
                        ? `+ Rp ${order.vehicleRateAdjustment.toLocaleString('id-ID')}`
                        : 'Rp 0'}
                    </td>
                  </tr>
                )}

                <tr>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-neutral-900 block">
                      Tiket Destinasi Wisata & Fasilitas Perjalanan
                    </span>
                    <span className="text-[11px] text-neutral-500 block mt-0.5">
                      Tiket masuk tempat wisata, parkir, retribusi, air mineral, dan P3K
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-neutral-600">
                    {order.paxCount} Tiket
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-neutral-700">
                    Include
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                    Gratis / Include
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-neutral-50 divide-y divide-neutral-200 border-t-2 border-neutral-300">
                <tr>
                  <td colSpan={3} className="py-2.5 px-4 text-right font-bold text-neutral-700">
                    Total Tagihan Bersih:
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono font-black text-base text-neutral-900">
                    Rp {order.grandTotal.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-right font-bold text-neutral-700">
                    Jumlah Telah Dibayar:
                  </td>
                  <td className="py-2 px-4 text-right font-mono font-bold text-emerald-700">
                    {isPaid ? `Rp ${order.grandTotal.toLocaleString('id-ID')}` : 'Rp 0'}
                  </td>
                </tr>
                <tr className="bg-orange-50/50">
                  <td colSpan={3} className="py-3 px-4 text-right font-extrabold text-neutral-900">
                    Sisa Tagihan:
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-black text-lg text-orange-600">
                    {isPaid ? 'Rp 0 (LUNAS)' : `Rp ${order.grandTotal.toLocaleString('id-ID')}`}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Guidance or Confirmation Box */}
          {!isPaid ? (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Instruksi Pelunasan Tagihan</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Silakan selesaikan pembayaran ke rekening resmi <strong>PT PERGI DIANTAR WISATA</strong> melalui Virtual Account BCA <strong>(3901-087716443331)</strong> atau scan QRIS instan resmi kami.
              </p>
              {(onPayNow || onPayOrder) && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      if (onPayOrder) {
                        onPayOrder(order);
                      } else if (onPayNow) {
                        onPayNow(order);
                      }
                    }}
                    className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <span>Bayar Invoice Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-emerald-900 block">
                    Pembayaran Berhasil Diverifikasi Sistem
                  </span>
                  <span className="text-emerald-700 text-[11px] block">
                    Tunjukkan invoice elektronik atau cetak ini kepada driver saat penjemputan awal di bandara / stasiun / hotel.
                  </span>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-[10px] text-emerald-600 uppercase font-bold block">Status Garansi</span>
                <span className="font-bold text-emerald-900">Perjalanan Terjamin 100%</span>
              </div>
            </div>
          )}

          {/* Legal / Sign-off Footer */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400 text-[11px]">
            <span>
              Invoice elektronik ini sah dan diakui tanpa tanda tangan basah berdasarkan ketentuan hukum digital transaksi wisata.
            </span>
            <span className="font-mono text-neutral-500">
              PERGIDIANTAR © 2026
            </span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between print:hidden">
          <span className="text-xs text-neutral-500 font-medium">
            Terima kasih telah mempercayakan liburan Anda bersama PERGIDIANTAR.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 rounded-xl transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleDownloadPdf}
              className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Invoice (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
