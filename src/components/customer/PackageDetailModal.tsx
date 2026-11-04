import React, { useState } from 'react';
import { TourPackage, PackageTier } from '../../types/travel';
import { 
  X, 
  Clock, 
  Users, 
  MapPin, 
  Check, 
  Car, 
  Hotel, 
  Utensils, 
  Ticket, 
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface PackageDetailModalProps {
  packageData: TourPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectBooking: (pkg: TourPackage, tier: PackageTier) => void;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  packageData,
  isOpen,
  onClose,
  onSelectBooking
}) => {
  const [selectedTier, setSelectedTier] = useState<PackageTier>('all_in');

  if (!isOpen || !packageData) return null;

  const isAllIn = selectedTier === 'all_in';
  const price = isAllIn ? packageData.priceAllInPerPax : packageData.priceHematPerPax;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header with image */}
        <div className="relative h-56 sm:h-64 bg-neutral-900 shrink-0">
          <img
            src={packageData.heroImage}
            alt={packageData.title}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wide">
                {packageData.categoryLabel}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-400" />
                {packageData.destinationLabel}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {packageData.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-neutral-300 mt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-orange-400" />
                Durasi: {packageData.durationDays} Hari {packageData.durationNights} Malam
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-400" />
                Kapasitas: {packageData.minPax} - {packageData.maxPax} Orang
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Tier Switcher & Pricing */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                Pilih Jenis Penawaran
              </span>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setSelectedTier('all_in')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border ${
                    isAllIn
                      ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  All In (Lengkap & VIP)
                </button>
                <button
                  onClick={() => setSelectedTier('paket_hemat')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border ${
                    !isAllIn
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  Paket Hemat (Ekonomis)
                </button>
              </div>
            </div>

            <div className="text-right sm:text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-200">
              <span className="text-xs text-neutral-500 block">Biaya Investasi</span>
              <div className="text-2xl font-black text-emerald-700 font-mono" data-tabular>
                Rp {price.toLocaleString('id-ID')}
                <span className="text-xs font-normal text-neutral-600"> / orang</span>
              </div>
              <span className="text-[11px] text-neutral-400">Termasuk seluruh tiket, hotel & armada</span>
            </div>
          </div>

          {/* Core Inclusions Detail */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Fasilitas Wajib Dalam Seluruh Paket
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 mb-1.5">
                  <Car className="w-4 h-4 text-orange-600" />
                  <span>Transportasi (Armada, Driver, BBM, Parkir)</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {packageData.included.transport}
                </p>
                <div className="mt-2 pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Pilihan Armada:</span>
                  <span className="text-[10px] font-semibold bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-200">Avanza (Standar)</span>
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">Innova Reborn (+Rp 150k)</span>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">Hi-Ace Premio (+Rp 250k)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 mb-1.5">
                  <Hotel className="w-4 h-4 text-blue-600" />
                  <span>Akomodasi Hotel & Istirahat</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {isAllIn 
                    ? 'Hotel Bintang 3-4 (Twin/Triple Share), Kamar bersih, AC dingin, kolam renang, shower hangat, WiFi cepat.' 
                    : 'Hotel Nyaman Pilihan Bintang 2-3 / Homestay Terawat (Twin/Triple Share) lokasi strategis dekat pusat kota.'
                  }
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 mb-1.5">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span>Konsumsi & Wisata Kuliner</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {isAllIn
                    ? 'Makan teratur 3x sehari (Sarapan buffet hotel, Makan Siang & Malam di restoran khas favorit lokal) + Snack Box kedatangan & air mineral botol 600ml harian.'
                    : 'Makan 2x sehari (Sarapan hotel & Makan Siang di restoran lokal) + air mineral harian terjamin higienis.'
                  }
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 mb-1.5">
                  <Ticket className="w-4 h-4 text-purple-600" />
                  <span>Tiket Wisata Lengkap</span>
                </div>
                <ul className="text-xs text-neutral-600 space-y-1">
                  {packageData.included.tickets.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Day by Day Itinerary */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Susunan Jadwal & Itinerary Perjalanan
            </h3>
            <div className="space-y-4">
              {packageData.itinerary.map((it) => (
                <div key={it.day} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-md">
                      HARI KE-{it.day}
                    </span>
                    <span className="text-xs font-semibold text-neutral-800">{it.title}</span>
                  </div>
                  <p className="text-xs text-neutral-600 mb-3">{it.description}</p>
                  <ul className="space-y-1.5">
                    {it.activities.map((act, actIdx) => (
                      <li key={actIdx} className="text-xs text-neutral-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[11px] text-neutral-500 block">Total Estimasi ({selectedTier === 'all_in' ? 'All In VIP' : 'Paket Hemat'})</span>
            <span className="text-lg font-black text-neutral-900 font-mono" data-tabular>
              Rp {price.toLocaleString('id-ID')}
              <span className="text-xs font-normal text-neutral-500"> / pax</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 rounded-xl transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={() => onSelectBooking(packageData, selectedTier)}
              className="py-2.5 px-6 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>Booking Online Sekarang</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
