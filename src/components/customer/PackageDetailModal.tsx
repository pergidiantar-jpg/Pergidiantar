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
  Calendar,
  ShoppingBag,
  Sparkles,
  Compass
} from 'lucide-react';
import { normalizeImagePath, handleImageFallback } from '../../utils/imageUtils';
import { createDefaultDayTimeline } from '../../utils/itineraryGenerator';

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
  const [selectedDayTab, setSelectedDayTab] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

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
            src={normalizeImagePath(packageData.heroImage, packageData.destinations?.[0] as any)}
            alt={packageData.title}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
            onError={(e) => handleImageFallback(e, packageData.destinations?.[0] || packageData.destinationLabel)}
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
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                    Paket All In
                  </button>
                  <button
                    onClick={() => setSelectedTier('paket_hemat')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border ${
                      !isAllIn
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    Paket Hemat
                  </button>
                </div>
              </div>

              <div className="text-left sm:text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-200">
                <span className="text-xs text-neutral-500 block">Biaya Investasi</span>
                <div className="text-2xl font-black text-emerald-700 font-mono" data-tabular>
                  Rp {price.toLocaleString('id-ID')}
                  <span className="text-xs font-normal text-neutral-600"> / orang</span>
                </div>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  {isAllIn
                    ? 'All In: kendaraan, driver, bbm, parkir, tiket wisata, hotel, makan 1x di hotel dan 2x/ hari di luar hotel'
                    : 'Paket Hemat: kendaraan, driver, bbm, parkir'}
                </span>
              </div>
            </div>

            {/* Prominent Tier Inclusion Description Box */}
            <div className={`mt-4 p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
              isAllIn 
                ? 'bg-orange-50/90 border-orange-200 text-orange-950' 
                : 'bg-blue-50/90 border-blue-200 text-blue-950'
            }`}>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                  {isAllIn ? 'KETERANGAN PAKET ALL IN' : 'KETERANGAN PAKET HEMAT'}
                </span>
                <p className="text-xs font-bold mt-0.5 leading-relaxed">
                  {isAllIn 
                    ? '(kendaraan, driver, bbm, parkir, tiket wisata, hotel, makan 1x di hotel dan 2x/ hari di luar hotel)' 
                    : '(kendaraan, driver, bbm, parkir)'}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase whitespace-nowrap self-start sm:self-auto ${
                isAllIn ? 'bg-orange-200/80 text-orange-800' : 'bg-blue-200/80 text-blue-800'
              }`}>
                {isAllIn ? 'All In VIP Terpadu' : 'Hemat Transportasi'}
              </span>
            </div>
          </div>

          {/* Core Inclusions Detail */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {isAllIn ? 'Fasilitas Termasuk Dalam Paket All In' : 'Fasilitas Termasuk Dalam Paket Hemat'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 mb-1.5">
                  <Car className="w-4 h-4 text-orange-600" />
                  <span>Transportasi (Kendaraan, Driver, BBM, Parkir)</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {packageData.included.transport || 'Unit pariwisata ber-AC dingin, supir berpengalaman, bahan bakar (BBM) penuh dan retribusi parkir seluruh titik singgah.'}
                </p>
                <div className="mt-2 pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Pilihan Armada:</span>
                  <span className="text-[10px] font-semibold bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-200">Avanza (Standar)</span>
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">Innova Reborn (+Rp 150k)</span>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">Hi-Ace Premio (+Rp 250k)</span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border ${isAllIn ? 'border-neutral-200 bg-white' : 'border-neutral-200/70 bg-neutral-50/70 opacity-75'}`}>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 mb-1.5">
                  <Hotel className="w-4 h-4 text-blue-600" />
                  <span>Akomodasi Hotel</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {isAllIn 
                    ? 'Hotel Bintang 3-4 Mitra Pilihan (Twin/Triple Share), Kamar bersih, AC dingin, kolam renang, shower hangat, WiFi cepat.' 
                    : 'Tidak Termasuk dalam Paket Hemat. Tamu dapat memilih dan memesan penginapan secara mandiri sesuai preferensi anggaran.'
                  }
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isAllIn ? 'border-neutral-200 bg-white' : 'border-neutral-200/70 bg-neutral-50/70 opacity-75'}`}>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 mb-1.5">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span>Konsumsi & Makan</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {isAllIn
                    ? 'Makan 1x di hotel dan 2x/ hari di luar hotel (restoran lokal khas) + snack box kedatangan & air mineral botol harian.'
                    : 'Tidak Termasuk dalam Paket Hemat. Tamu bebas berwisata kuliner secara mandiri selama perjalanan berlangsung.'
                  }
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isAllIn ? 'border-neutral-200 bg-white' : 'border-neutral-200/70 bg-neutral-50/70 opacity-75'}`}>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 mb-1.5">
                  <Ticket className="w-4 h-4 text-purple-600" />
                  <span>Tiket Wisata</span>
                </div>
                {isAllIn ? (
                  <ul className="text-xs text-neutral-600 space-y-1">
                    {packageData.included.tickets.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Tidak Termasuk dalam Paket Hemat. Tiket masuk objek wisata dibeli mandiri di loket destinasi tujuan.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Day by Day Itinerary (Detail & Rute) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50/60 to-white border border-orange-200/80">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                    <Sparkles className="w-3 h-3" /> DETAIL & RUTE ITINERARY
                  </span>
                  <span className="text-xs font-bold text-orange-950">
                    {packageData.destinationLabel} &bull; {packageData.durationDays} Hari {packageData.durationNights} Malam
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-neutral-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Susunan Jadwal & Rundown Wisata Terstruktur
                </h3>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Jadwal perjalanan wisata terpadu dengan pencantuman jam logis, rute objek wisata, hotel, dan waktu kuliner.
                </p>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-orange-200/90 shrink-0 self-start sm:self-center shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('single')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    viewMode === 'single'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Fokus Per Hari
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    viewMode === 'all'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Semua Hari ({packageData.durationDays})
                </button>
              </div>
            </div>

            {/* Interactive Day Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {packageData.itinerary.map((it) => {
                const isSelected = selectedDayTab === it.day;
                const effectiveTimeline = (it.timeline && it.timeline.length > 0)
                  ? it.timeline
                  : createDefaultDayTimeline(it.day, it.day === packageData.durationDays, packageData.destinationLabel);

                return (
                  <button
                    key={it.day}
                    type="button"
                    onClick={() => {
                      setSelectedDayTab(it.day);
                      if (viewMode === 'all') setViewMode('single');
                    }}
                    className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap shrink-0 flex items-center gap-2 ${
                      isSelected && viewMode === 'single'
                        ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center ${
                      isSelected && viewMode === 'single'
                        ? 'bg-white text-orange-600'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      {it.day}
                    </span>
                    <div className="text-left leading-tight">
                      <span className="block text-xs">Hari Ke-{it.day}</span>
                      <span className={`text-[10px] font-normal ${
                        isSelected && viewMode === 'single' ? 'text-orange-100' : 'text-neutral-500'
                      }`}>
                        {effectiveTimeline.length} Agenda Terjadwal
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Render Days */}
            <div className="space-y-5">
              {(viewMode === 'all' 
                ? packageData.itinerary 
                : [packageData.itinerary.find(d => d.day === selectedDayTab) || packageData.itinerary[0]]
              ).filter(Boolean).map((it) => {
                const effectiveTimeline = (it.timeline && it.timeline.length > 0)
                  ? it.timeline
                  : createDefaultDayTimeline(it.day, it.day === packageData.durationDays, packageData.destinationLabel);

                return (
                  <div key={it.day} className="p-4 sm:p-5 rounded-2xl border border-neutral-200 bg-neutral-50/60 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-orange-100/60 border border-orange-200/80">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-orange-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                          D{it.day}
                        </span>
                        <div>
                          <h4 className="text-sm font-extrabold text-neutral-900">
                            {it.title}
                          </h4>
                          <p className="text-xs text-neutral-600 mt-0.5">
                            {it.description || `Rundown pariwisata terstruktur di ${packageData.destinationLabel}.`}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-orange-800 bg-white border border-orange-200 px-2.5 py-1 rounded-lg self-start sm:self-auto shrink-0">
                        {effectiveTimeline.length} Titik Agenda
                      </span>
                    </div>

                    {/* Timeline Nodes */}
                    <div className="relative pl-6 sm:pl-8 space-y-3 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-300">
                      {effectiveTimeline.map((item, idx) => {
                        const isMeal = item.type === 'meal';
                        const isHotel = item.type === 'hotel_checkin' || item.type === 'hotel_checkout';
                        const isTransport = item.type === 'pickup' || item.type === 'dropoff';
                        const isShop = item.type === 'shopping';

                        const badgeColor = isMeal 
                          ? 'bg-amber-100 text-amber-800 border-amber-200' 
                          : isHotel 
                          ? 'bg-purple-100 text-purple-800 border-purple-200' 
                          : isTransport 
                          ? 'bg-blue-100 text-blue-800 border-blue-200' 
                          : isShop 
                          ? 'bg-pink-100 text-pink-800 border-pink-200' 
                          : 'bg-emerald-100 text-emerald-800 border-emerald-200';

                        return (
                          <div 
                            key={idx} 
                            className="relative bg-white rounded-xl p-3.5 border border-neutral-200 text-xs shadow-2xs hover:border-neutral-300 transition-colors"
                          >
                            {/* Timeline Node Dot */}
                            <div className="absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full border-2 border-orange-500 bg-white text-orange-600 flex items-center justify-center font-black text-[10px] shadow-2xs">
                              {idx + 1}
                            </div>

                            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-orange-600" />
                                  {item.time}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${badgeColor}`}>
                                  {(item.type || 'sightseeing').replace('_', ' ')}
                                </span>
                              </div>
                              {item.notes && (
                                <span className="text-[10px] text-neutral-500 italic bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200/60">
                                  {item.notes}
                                </span>
                              )}
                            </div>

                            <div className="font-extrabold text-neutral-900 text-xs sm:text-sm">
                              {item.title}
                            </div>
                            {item.description && (
                              <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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
