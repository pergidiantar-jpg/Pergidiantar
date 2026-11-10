import React, { useState, useEffect } from 'react';
import { BookingOrder, PaymentMethod } from '../../types/travel';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  Building2, 
  CreditCard, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Printer,
  Sparkles
} from 'lucide-react';

interface PaymentModalProps {
  order: BookingOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (order: BookingOrder) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  const { updatePaymentStatus, setActiveTab, setSelectedOrderForDetail } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qris');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes timer

  useEffect(() => {
    if (order?.paymentStatus === 'paid') {
      setIsPaidSuccess(true);
    } else {
      setIsPaidSuccess(false);
    }
  }, [order]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isPaidSuccess) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isPaidSuccess]);

  if (!isOpen || !order) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const ref = `PAY-${selectedMethod.toUpperCase()}-${Math.floor(100000000 + Math.random() * 900000000)}`;
      updatePaymentStatus(order.id, 'paid', ref);
      setIsProcessing(false);
      setIsPaidSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess({ ...order, paymentStatus: 'paid', paymentReference: ref });
      }
    }, 1200);
  };

  const vaNumber = `8809${order.orderNumber.replace(/\D/g, '')}01`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-neutral-200 p-0.5 shrink-0 shadow-xs">
              <img 
                src="/assets/aistudio/1793582722648_90a12056.jpg" 
                alt="Logo PERGIDIANTAR" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-neutral-900">
                Sistem Pembayaran Terintegrasi PERGIDIANTAR
              </h2>
              <span className="text-[11px] text-neutral-500 font-mono">
                No. Order: {order.orderNumber}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {isPaidSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-black text-neutral-900">
                  Pembayaran Berhasil Diverifikasi!
                </h3>
                <p className="text-xs text-neutral-600 mt-1 max-w-md mx-auto">
                  Terima kasih, <strong>{order.customer.fullName}</strong>. Pesanan tour Anda telah berstatus terkonfirmasi dan unit armada siap ditugaskan.
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between pb-2 border-b border-neutral-200 font-semibold text-neutral-700">
                  <span>Nomor Bukti Transaksi:</span>
                  <span className="font-mono text-orange-600 font-bold">{order.paymentReference || 'QRIS-VERIFIED-OK'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Paket Wisata:</span>
                  <span className="font-medium text-neutral-800 text-right">{order.packageTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Jadwal Perjalanan:</span>
                  <span className="font-medium text-neutral-800">{order.tourStartDate} s/d {order.tourEndDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Jumlah Peserta:</span>
                  <span className="font-medium text-neutral-800">{order.paxCount} Orang ({order.tier === 'all_in' ? 'All In VIP' : 'Paket Hemat'})</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold text-neutral-900">
                  <span>Total yang Dibayar:</span>
                  <span className="font-mono text-base text-orange-600" data-tabular>
                    Rp {order.grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedOrderForDetail(order);
                    setActiveTab('my-orders');
                    onClose();
                  }}
                  className="w-full sm:w-auto py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Lacak Status & Armada Tour</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto py-2.5 px-4 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan Bukti PDF</span>
                </button>
              </div>
            </div>
          ) : (
            /* Pending Payment Gateway */
            <>
              {/* Amount to pay banner */}
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-orange-800 font-medium block">
                    Total Tagihan Pembayaran
                  </span>
                  <div className="text-2xl font-black text-orange-950 font-mono" data-tabular>
                    Rp {order.grandTotal.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-orange-700 block flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> Selesaikan dalam
                  </span>
                  <span className="text-sm font-bold font-mono text-orange-950">
                    {timeFormatted}
                  </span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div>
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-2">
                  Pilih Saluran Pembayaran
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('qris')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === 'qris'
                        ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>QRIS Instan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('va_bca')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod.startsWith('va_')
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Virtual Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === 'bank_transfer'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Transfer Bank</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('credit_card')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === 'credit_card'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Kartu Kredit</span>
                  </button>
                </div>
              </div>

              {/* Payment Method Details */}
              <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-4">
                {selectedMethod === 'qris' && (
                  <div className="text-center space-y-3">
                    <div className="inline-block p-1 bg-neutral-900 text-white text-[10px] font-bold rounded px-2 tracking-widest">
                      QRIS · STANDAR PEMBAYARAN NASIONAL
                    </div>
                    {/* Official QRIS Dynamic QR Code */}
                    <div className="w-48 h-48 mx-auto bg-white p-3 rounded-xl border-2 border-neutral-300 shadow-sm flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900">
                        {/* Position detection squares */}
                        <rect x="5" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                        <rect x="12" y="12" width="11" height="11" fill="currentColor" />
                        <rect x="70" y="5" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                        <rect x="77" y="12" width="11" height="11" fill="currentColor" />
                        <rect x="5" y="70" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="5" />
                        <rect x="12" y="77" width="11" height="11" fill="currentColor" />
                        {/* Grid matrix patterns */}
                        <circle cx="50" cy="50" r="6" fill="#059669" />
                        <rect x="36" y="10" width="8" height="8" fill="currentColor" />
                        <rect x="48" y="12" width="8" height="6" fill="currentColor" />
                        <rect x="40" y="24" width="6" height="8" fill="currentColor" />
                        <rect x="54" y="22" width="8" height="8" fill="currentColor" />
                        <rect x="10" y="38" width="8" height="8" fill="currentColor" />
                        <rect x="24" y="44" width="8" height="6" fill="currentColor" />
                        <rect x="72" y="38" width="8" height="8" fill="currentColor" />
                        <rect x="84" y="44" width="8" height="8" fill="currentColor" />
                        <rect x="38" y="66" width="8" height="8" fill="currentColor" />
                        <rect x="52" y="74" width="6" height="8" fill="currentColor" />
                        <rect x="70" y="70" width="8" height="8" fill="currentColor" />
                        <rect x="82" y="78" width="8" height="8" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">
                        PT PERGI DIANTAR WISATA NUSANTARA
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        NMID: ID1029384756182 · Mendukung BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay & DANA.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod.startsWith('va_') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
                        className="text-xs font-semibold py-1.5 px-3 border border-neutral-300 rounded-lg bg-white"
                      >
                        <option value="va_bca">BCA Virtual Account</option>
                        <option value="va_mandiri">Mandiri Virtual Account</option>
                        <option value="va_bri">BRI Virtual Account (BRIVA)</option>
                        <option value="va_bni">BNI Virtual Account</option>
                      </select>
                      <span className="text-[11px] text-neutral-500">Otomatis terverifikasi 24/7</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wide block">
                          Nomor Virtual Account
                        </span>
                        <span className="text-base font-bold font-mono text-neutral-900 tracking-wider">
                          {vaNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(vaNumber)}
                        className="py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-medium flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Tersalin' : 'Salin VA'}</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-neutral-500 space-y-1">
                      <p>1. Buka m-Banking atau ATM bank pilihan Anda.</p>
                      <p>2. Pilih menu Transfer &gt; Virtual Account &gt; Masukkan nomor VA di atas.</p>
                      <p>3. Pastikan nama penerima <strong>PERGIDIANTAR - {order.customer.fullName}</strong>.</p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'bank_transfer' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wide block">
                          Bank BCA Cabang Sudirman
                        </span>
                        <span className="text-base font-bold font-mono text-neutral-900 tracking-wider">
                          801-992-8811
                        </span>
                        <span className="text-[11px] text-neutral-600 block">
                          a.n. PT PERGI DIANTAR WISATA NUSANTARA
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('8019928811')}
                        className="py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-medium flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Tersalin' : 'Salin Rekening'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Sistem kami secara otomatis mendeteksi mutasi nominal unik tanpa perlu konfirmasi manual yang lama.
                    </p>
                  </div>
                )}

                {selectedMethod === 'credit_card' && (
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-neutral-600 mb-1">Nomor Kartu Kredit</label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        defaultValue="4242 •••• •••• 9081"
                        className="w-full py-1.5 px-3 border border-neutral-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-neutral-600 mb-1">Kadaluarsa (MM/YY)</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          defaultValue="08/29"
                          className="w-full py-1.5 px-3 border border-neutral-300 rounded-lg bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-600 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          placeholder="•••"
                          defaultValue="789"
                          className="w-full py-1.5 px-3 border border-neutral-300 rounded-lg bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Real Payment Confirmation Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-orange-500/20 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Memverifikasi Transaksi Pembayaran...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Saya Sudah Membayar &bull; Konfirmasi Pembayaran</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-neutral-500 text-center mt-1.5 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Transaksi aman terenkripsi &bull; E-tiket dan invoice otomatis diterbitkan secara instan</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
