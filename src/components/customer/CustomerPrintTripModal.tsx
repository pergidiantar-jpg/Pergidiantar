import React, { useRef } from 'react';
import { BookingOrder, TourPackage } from '../../types/travel';
import { 
  Printer, 
  X, 
  MapPin, 
  Calendar, 
  Users, 
  Car, 
  Hotel, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Clock, 
  Utensils, 
  Compass, 
  Camera, 
  Sparkles,
  QrCode
} from 'lucide-react';

interface CustomerPrintTripModalProps {
  order: BookingOrder | null;
  isOpen: boolean;
  onClose: () => void;
  packages?: TourPackage[];
}

export const CustomerPrintTripModal: React.FC<CustomerPrintTripModalProps> = ({
  order,
  isOpen,
  onClose,
  packages = []
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  // Find linked package for detailed itinerary
  const linkedPackage = packages.find(p => p.id === order.packageId);

  // Generate fallback/custom daily itinerary if not directly from a standard catalog package
  const durationMatch = order.packageTitle.match(/(\d+)D(\d+)N/i);
  const totalDays = durationMatch ? parseInt(durationMatch[1], 10) : 3;

  const itineraryDays = linkedPackage?.itinerary && linkedPackage.itinerary.length > 0 
    ? linkedPackage.itinerary 
    : Array.from({ length: totalDays }, (_, idx) => {
        const dayNum = idx + 1;
        if (dayNum === 1) {
          return {
            day: 1,
            title: `Kedatangan & Penjemputan (${order.destinationLabel})`,
            description: `Penjemputan resmi rombongan di titik jemput ${order.customer.pickupAddress || order.customer.city || order.destinationLabel}, perjalanan ramah wisata, dan check-in hotel.`,
            activities: [
              `Penjemputan tepat waktu oleh driver & armada ${order.selectedVehicle || order.assignedFleetName || 'PERGIDIANTAR'}`,
              `Pemberian welcome snack box & air mineral higienis untuk seluruh peserta`,
              `Kunjungan destinasi ikonik pembuka di wilayah ${order.destinationLabel}`,
              `Makan siang santai kuliner lokal khas daerah`,
              `Check-in hotel mitra (${order.hotelAllotment || 'Hotel Pilihan'}), istirahat sejenak & malam santai`
            ]
          };
        } else if (dayNum === totalDays) {
          return {
            day: dayNum,
            title: `Eksplorasi Akhir, Belanja Oleh-Oleh & Kepulangan`,
            description: `Hari penutup perjalanan santai, berburu cenderamata khas daerah, dan pengantaran kembali.`,
            activities: [
              `Sarapan pagi prasmanan di hotel dan proses check-out santai`,
              `Spot foto kenangan terakhir di panorama alam ${order.destinationLabel}`,
              `Kunjungan pusat oleh-oleh dan kerajinan otentik khas daerah`,
              `Makan siang penutup perjalanan bersama rombongan`,
              `Pengantaran kembali ke titik kumpul / stasiun / bandara dengan aman dan berkesan`
            ]
          };
        } else {
          return {
            day: dayNum,
            title: `Wisata Eksplorasi Penuh Hari Ke-${dayNum}`,
            description: `Rangkaian kunjungan objek wisata unggulan di ${order.destinationLabel} dengan jadwal fleksibel dan menyenangkan.`,
            activities: [
              `Sarapan pagi di hotel mitra untuk pengisian energi`,
              `Tour ke objek wisata alam & budaya unggulan rombongan`,
              `Makan siang di restoran mitra lokal terpercaya`,
              `Sesi foto bersama rombongan & dokumentasi momen terbaik`,
              `Wisata senja/sunset dan makan malam sebelum kembali ke hotel untuk beristirahat`
            ]
          };
        }
      });

  const isPaid = order.paymentStatus === 'paid' || order.paymentStatus === 'verified';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-0 sm:p-4 print:p-0 print:static print:block print:overflow-visible">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/80 backdrop-blur-xs transition-opacity print:hidden"
        onClick={onClose}
      />

      {/* Modal Card / Printable Sheet */}
      <div className="relative bg-white w-full max-w-4xl mx-auto rounded-none sm:rounded-3xl shadow-2xl z-10 overflow-hidden print:shadow-none print:m-0 print:w-full print:max-w-none print:static print:overflow-visible print:rounded-none">
        
        {/* Top Control Bar (Screen only, hidden when printing) */}
        <div className="bg-neutral-900 text-white px-5 sm:px-6 py-3.5 flex items-center justify-between print:hidden border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Print-Friendly Itinerary & Travel Voucher
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Trip Itinerary Sheet Content */}
        <div 
          ref={printAreaRef}
          id="printable-trip-voucher"
          className="p-6 sm:p-10 space-y-7 bg-white text-neutral-900 text-xs sm:text-sm print:p-8 print:text-black"
        >
          {/* 1. Official Letterhead / Kop Surat Resmi */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-neutral-900">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-neutral-200 p-1 shrink-0 bg-white shadow-xs">
                <img 
                  src="/assets/aistudio/1793582722648_90a12056.jpg" 
                  alt="Logo PERGIDIANTAR" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight uppercase">
                  PERGIDIANTAR TOUR & TRAVEL
                </h1>
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                  Spesialis Paket Wisata & Sewa Transportasi Pariwisata (Jogja · Malang · Bali)
                </p>
                <p className="text-[11px] text-neutral-500 max-w-md leading-relaxed">
                  Izin Operasional Pariwisata No: 9120004821035 · Alamat: Jl. Malioboro No. 88, Yogyakarta 55271
                  <br />
                  WhatsApp Hotline: <strong>0877-1644-3331</strong> · Email Resmi: <strong>pergi.diantar@gmail.com</strong>
                </p>
              </div>
            </div>

            {/* Document Verification Code */}
            <div className="text-left sm:text-right shrink-0 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                Dokumen Resmi Perjalanan
              </span>
              <span className="text-base font-mono font-black text-neutral-900 block mt-0.5">
                {order.orderNumber}
              </span>
              <span className="text-[11px] text-neutral-500 block">
                Terbit: {order.createdAt || new Date().toISOString().slice(0, 10)}
              </span>
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Dokumen Sah & Terverifikasi</span>
              </div>
            </div>
          </div>

          {/* 2. Document Title Banner */}
          <div className="text-center py-2 bg-neutral-900 text-white rounded-xl shadow-xs">
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider">
              SURAT KONFIRMASI PERJALANAN & ITINERARY WISATA RESMI
            </h2>
            <p className="text-[11px] text-neutral-300">
              OFFICIAL TRAVEL VOUCHER & DETAILED TOUR ITINERARY SCHEDULE
            </p>
          </div>

          {/* 3. Traveler & Order Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details Box */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-200">
                <Users className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Data Pemesan / Wisatawan
                </h3>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-neutral-500">Nama Lengkap:</span>
                  <span className="font-bold text-neutral-900">{order.customer.fullName}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-neutral-500">No. WhatsApp / HP:</span>
                  <span className="font-bold text-neutral-900">{order.customer.whatsapp}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-neutral-500">Email:</span>
                  <span className="font-medium text-neutral-800">{order.customer.email}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-neutral-500">Kota / Titik Jemput:</span>
                  <span className="font-bold text-neutral-900 text-right max-w-[200px]">
                    {order.customer.pickupAddress || order.customer.city || 'Yogyakarta'}
                  </span>
                </div>
                {order.customer.specialRequests && (
                  <div className="pt-1 text-[11px] text-neutral-600 border-t border-neutral-200">
                    <span className="font-bold text-neutral-700">Catatan Khusus:</span> {order.customer.specialRequests}
                  </div>
                )}
              </div>
            </div>

            {/* Trip Specs Box */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-200">
                <Calendar className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Spesifikasi Paket Wisata
                </h3>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-neutral-500">Nama Paket:</span>
                  <span className="font-bold text-neutral-900 text-right">{order.packageTitle}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-neutral-500">Destinasi Utama:</span>
                  <span className="font-bold text-orange-600 uppercase">{order.destinationLabel}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-neutral-500">Tanggal Trip:</span>
                  <span className="font-bold text-neutral-900">
                    {order.tourStartDate} s/d {order.tourEndDate}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-neutral-500">Jumlah Peserta:</span>
                  <span className="font-bold text-neutral-900">{order.paxCount} Orang (Pax)</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-neutral-500">Kategori Layanan:</span>
                  <span className="font-extrabold text-neutral-900 uppercase">
                    {order.tier === 'all_in' ? 'Paket All In (Lengkap VIP)' : 'Paket Hemat (Kendaraan + BBM + Driver)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Transport, Driver & Hotel Allocation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Transport & Driver */}
            <div className="p-4 rounded-2xl border border-neutral-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-900 pb-1.5 border-b border-neutral-100">
                <Car className="w-4 h-4 text-orange-600" />
                <span>Armada & Supir Ditugaskan</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Jenis Kendaraan:</span>
                  <span className="font-bold text-neutral-900">
                    {order.selectedVehicle || order.assignedFleetName || 'Toyota HiAce Premio / Bus Standar'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Driver & Tour Leader:</span>
                  <span className="font-bold text-neutral-900">
                    {order.assignedDriverName || 'Bapak Supriyadi (Driver Wisata Pergidiantar)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Kontak Driver:</span>
                  <span className="font-medium text-neutral-800">
                    {order.assignedDriverPhone || '0812-3456-7890'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Standar Fasilitas:</span>
                  <span className="font-medium text-neutral-700">Full AC Dingin, Reclining Seats, Audio, P3K</span>
                </div>
              </div>
            </div>

            {/* Hotel & Accommodation */}
            <div className="p-4 rounded-2xl border border-neutral-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-900 pb-1.5 border-b border-neutral-100">
                <Hotel className="w-4 h-4 text-orange-600" />
                <span>Akomodasi & Mitra Hotel</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Hotel Mitra:</span>
                  <span className="font-bold text-neutral-900">
                    {order.hotelAllotment || 'Hotel Bintang 3-4 Mitra Pilihan'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Wilayah Hotel:</span>
                  <span className="font-medium text-neutral-800">Pusat Kota / Akses Strategis {order.destinationLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Fasilitas Kamar:</span>
                  <span className="font-medium text-neutral-700">Air Panas, Wi-Fi Gratis, TV Kabel, Sarapan Pagi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Check-in / Check-out:</span>
                  <span className="font-medium text-neutral-700">14:00 WIB / 12:00 WIB</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Step-by-Step Itinerary Schedule (Timeline) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-900">
                  Rencana Perjalanan Wisata (Day-by-Day Itinerary)
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-neutral-500">
                Total {itineraryDays.length} Hari Perjalanan
              </span>
            </div>

            <div className="space-y-3">
              {itineraryDays.map((item) => (
                <div 
                  key={item.day}
                  className="p-3.5 bg-neutral-50/80 rounded-2xl border border-neutral-200 space-y-2 break-inside-avoid"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-orange-600 text-white font-black text-xs shrink-0">
                      HARI {item.day}
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900">
                      {item.title}
                    </h4>
                  </div>
                  {item.description && (
                    <p className="text-xs text-neutral-600 italic">
                      {item.description}
                    </p>
                  )}
                  <ul className="space-y-1 pt-1 text-xs text-neutral-700">
                    {item.activities.map((act, actIdx) => (
                      <li key={actIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Inclusions & Facilities Checklist */}
          <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-900 pb-1.5 border-b border-orange-200">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="uppercase tracking-wider">Inklusi & Fasilitas yang Termasuk</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Armada Kendaraan Ber-AC + Driver Pariwisata</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>BBM Kendaraan, Biaya Tol & Seluruh Parkir Lokasi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tiket Masuk Objek Wisata Sesuai Rute Jadwal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Air Mineral Botol Higienis Setiap Hari Perjalanan</span>
              </div>
              {order.tier === 'all_in' && (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Akomodasi Hotel Mitra Nyaman & Bersih</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Konsumsi: Sarapan Pagi di Hotel + 2x Makan/Hari di Luar Hotel</span>
                  </div>
                </>
              )}
              {order.addOnsList && order.addOnsList.length > 0 && order.addOnsList.map((addon, aIdx) => (
                <div key={aIdx} className="flex items-center gap-2 font-semibold text-orange-950">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>Add-on: {addon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Financial & Payment Summary */}
          <div className="p-4 bg-neutral-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                Rincian Biaya & Status Pelunasan
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono mt-0.5 text-orange-400">
                Rp {order.grandTotal.toLocaleString('id-ID')}
              </div>
              <span className="text-xs text-neutral-300">
                Metode Pembayaran: {order.paymentMethod.toUpperCase()} · {order.paxCount} Peserta ({Math.round(order.grandTotal / (order.paxCount || 1)).toLocaleString('id-ID')} / pax)
              </span>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Status Pembayaran</span>
              {isPaid ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-xl text-xs font-black tracking-wider uppercase mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  LUNAS / FULLY PAID
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-neutral-900 rounded-xl text-xs font-black tracking-wider uppercase mt-1">
                  <Clock className="w-4 h-4" />
                  MENUNGGU PELUNASAN
                </span>
              )}
            </div>
          </div>

          {/* 8. Official Signature & Stamp */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-neutral-200">
            <div className="space-y-1 max-w-sm">
              <p className="text-[11px] font-bold text-neutral-700 uppercase">
                Petunjuk Penting Wisatawan:
              </p>
              <p className="text-[10px] text-neutral-500 leading-relaxed">
                1. Mohon standby di titik penjemputan 15 menit sebelum waktu yang disepakati.
                <br />
                2. Tunjukkan lembar cetak atau dokumen digital ini kepada driver saat penjemputan.
                <br />
                3. Bantuan darurat 24 jam silakan hubungi Customer Service di 0877-1644-3331.
              </p>
            </div>

            <div className="text-center sm:text-right shrink-0 space-y-1">
              <p className="text-[11px] text-neutral-500">
                Yogyakarta, {order.createdAt?.split(' ')[0] || new Date().toISOString().slice(0, 10)}
              </p>
              <p className="text-xs font-bold text-neutral-900">
                PT. PERGIDIANTAR TOUR & TRAVEL
              </p>
              <div className="py-2 flex items-center justify-center sm:justify-end gap-2">
                <div className="w-20 h-10 border border-emerald-500/40 rounded bg-emerald-50/50 flex flex-col items-center justify-center text-[9px] font-black text-emerald-700 rotate-[-4deg]">
                  <span>PERGIDIANTAR</span>
                  <span className="text-[8px] text-emerald-600 font-extrabold uppercase">LUNAS / VERIFIED</span>
                </div>
              </div>
              <p className="text-xs font-extrabold text-neutral-900 underline">
                Benisius Rahmat Basuki
              </p>
              <p className="text-[10px] text-neutral-500">Direksi Operasional Nusantara</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
