import React, { useState } from 'react';
import { TourPackage, PackageCategory, DestinationRegion, PackageTier } from '../../types/travel';
import { 
  Users, 
  Clock, 
  MapPin, 
  Check, 
  Car, 
  Hotel, 
  Utensils, 
  Ticket,
  ChevronRight,
  Sparkles,
  Info,
  Calculator,
  Percent,
  Sliders
} from 'lucide-react';
import { CustomTripCalculator } from './CustomTripCalculator';
import { normalizeImagePath, handleImageFallback } from '../../utils/imageUtils';

interface PackageCatalogProps {
  packages: TourPackage[];
  selectedCategory: PackageCategory | 'all';
  onSelectCategory: (cat: PackageCategory | 'all') => void;
  selectedDestination: DestinationRegion | 'all';
  onSelectDestination: (dest: DestinationRegion | 'all') => void;
  onOpenDetail: (pkg: TourPackage) => void;
  onStartBooking: (pkg: TourPackage, tier: PackageTier) => void;
}

export const PackageCatalog: React.FC<PackageCatalogProps> = ({
  packages,
  selectedCategory,
  onSelectCategory,
  selectedDestination,
  onSelectDestination,
  onOpenDetail,
  onStartBooking
}) => {
  // Global tier preference filter or per card
  const [activeTiers, setActiveTiers] = useState<Record<string, PackageTier>>({});
  const [catalogViewMode, setCatalogViewMode] = useState<'catalog' | 'custom_calculator'>('catalog');

  const categories: { key: PackageCategory | 'all'; label: string; sub: string }[] = [
    { key: 'all', label: 'Semua Paket', sub: 'Katalog Lengkap' },
    { key: 'single_trip', label: 'Single Trip', sub: 'Jogja Private' },
    { key: 'family_trip', label: 'Family Trip', sub: 'Jogja Santai' },
    { key: 'family_gathering', label: 'Family Gathering', sub: 'Jogja, Malang, Bali' },
    { key: 'company_gathering', label: 'Company Gathering', sub: 'Jogja Team Building' },
    { key: 'study_tour', label: 'Study Tour', sub: 'Jogja, Malang, Bali' }
  ];

  const destinations: { key: DestinationRegion | 'all'; label: string }[] = [
    { key: 'all', label: 'Semua Kota' },
    { key: 'jogja', label: 'Yogyakarta' },
    { key: 'malang', label: 'Malang & Bromo' },
    { key: 'bali', label: 'Bali' }
  ];

  const getTierForPackage = (packageId: string): PackageTier => {
    return activeTiers[packageId] || 'all_in';
  };

  const setTierForPackage = (packageId: string, tier: PackageTier) => {
    setActiveTiers((prev) => ({ ...prev, [packageId]: tier }));
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchDestination = selectedDestination === 'all' || pkg.destinations.includes(selectedDestination);
    return matchCategory && matchDestination;
  });

  return (
    <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Level Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-neutral-200/80 shadow-xs mb-8">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100/90 rounded-xl">
          <button
            type="button"
            onClick={() => setCatalogViewMode('catalog')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
              catalogViewMode === 'catalog'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>Katalog Paket Wisata</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700 font-semibold">
              {filteredPackages.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setCatalogViewMode('custom_calculator')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
              catalogViewMode === 'custom_calculator'
                ? 'bg-linear-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Atur Trip & Hitung Biaya</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-extrabold flex items-center gap-0.5">
              <Percent className="w-2.5 h-2.5" /> 10% OFF
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 px-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Bebas atur rute, durasi 2H1M - 7H6M, bus & add-on dengan diskon paket 10%</span>
        </div>
      </div>

      {catalogViewMode === 'custom_calculator' ? (
        <CustomTripCalculator defaultDestination={selectedDestination === 'all' ? 'jogja' : selectedDestination} />
      ) : (
        <>
          {/* Quick CTA Banner for Custom Trip */}
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-linear-to-r from-orange-50 via-amber-50 to-orange-100/50 border border-orange-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-neutral-900">Ingin Atur Rute & Destinasi Sesuai Keinginan?</h3>
                  <span className="text-[10px] font-extrabold bg-orange-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                    Diskon 10% Paket
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Tentukan kota tujuan, durasi 2H1M - 7H6M, jumlah peserta, transport, makan, dan add-on. Sistem menghitung otomatis harga per pax & per paket!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCatalogViewMode('custom_calculator')}
              className="w-full sm:w-auto px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>Buka Kalkulator Trip</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-orange-600 tracking-wider uppercase">
                PENAWARAN RESMI PERGIDIANTAR
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                Pilihan Paket Wisata Lengkap & Terpercaya
              </h2>
              <p className="text-sm text-neutral-600 mt-1 max-w-2xl">
                Tersedia pilihan <strong>Paket Hemat</strong> (kendaraan, driver, bbm, parkir) dan <strong>Paket All In</strong> (kendaraan, driver, bbm, parkir, tiket wisata, hotel, makan 1x di hotel dan 2x/ hari di luar hotel).
              </p>
            </div>

            {/* Destination Quick Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl overflow-x-auto shrink-0 border border-neutral-200">
              {destinations.map((d) => (
                <button
                  key={d.key}
                  onClick={() => onSelectDestination(d.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedDestination === d.key
                      ? 'bg-white text-orange-600 shadow-2xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

      {/* Category Filter Pills (Functional Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => onSelectCategory(c.key)}
            className={`px-4 py-2 text-xs rounded-xl font-medium transition-all text-left whitespace-nowrap shrink-0 border ${
              selectedCategory === c.key
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <span className="font-bold block">{c.label}</span>
            <span className={`text-[10px] block opacity-80 ${selectedCategory === c.key ? 'text-neutral-300' : 'text-neutral-500'}`}>
              {c.sub}
            </span>
          </button>
        ))}
      </div>

      {/* Package Grid */}
      {filteredPackages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <Info className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800">Paket Belum Ditemukan</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Tidak ada paket wisata untuk kombinasi kategori dan destinasi yang dipilih. Silakan pilih kategori atau kota lain.
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
              onSelectDestination('all');
            }}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-semibold hover:bg-orange-600"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const currentTier = getTierForPackage(pkg.id);
            const isAllIn = currentTier === 'all_in';
            const price = isAllIn ? pkg.priceAllInPerPax : pkg.priceHematPerPax;

            return (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col group"
              >
                {/* Image Banner */}
                <div className="relative aspect-16/10 overflow-hidden bg-neutral-100">
                  <img
                    src={normalizeImagePath(pkg.heroImage, pkg.destinations?.[0] as any)}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageFallback(e, pkg.destinations?.[0] || pkg.destinationLabel)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Destination & Pax Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-neutral-900/80 backdrop-blur-md text-white text-[11px] font-semibold rounded-md flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {pkg.destinationLabel}
                    </span>
                    {pkg.badge && (
                      <span className="px-2.5 py-1 bg-amber-500 text-neutral-950 text-[11px] font-bold rounded-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-3 text-xs text-neutral-200">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {pkg.durationDays}H {pkg.durationNights}M
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        Min. {pkg.minPax} Pax
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Category & Title */}
                  <div className="text-[11px] font-bold text-orange-600 tracking-wider uppercase mb-1">
                    {pkg.categoryLabel}
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 line-clamp-2 leading-snug">
                    {pkg.title}
                  </h3>

                  {/* Tier Switcher Control (All In vs Paket Hemat) */}
                  <div className="mt-4 p-1 bg-neutral-100 rounded-xl flex items-center border border-neutral-200">
                    <button
                      onClick={() => setTierForPackage(pkg.id, 'all_in')}
                      className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all text-center ${
                        isAllIn
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      All In (VIP)
                    </button>
                    <button
                      onClick={() => setTierForPackage(pkg.id, 'paket_hemat')}
                      className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all text-center ${
                        !isAllIn
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Paket Hemat
                    </button>
                  </div>

                  {/* Pricing Display */}
                  <div className="mt-3 py-2 px-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-neutral-500 block">
                        Harga Mulai ({isAllIn ? 'All In VIP' : 'Paket Hemat'})
                      </span>
                      <div className="text-lg font-extrabold text-neutral-900 font-mono" data-tabular>
                        Rp {price.toLocaleString('id-ID')}
                        <span className="text-xs font-normal text-neutral-500"> / pax</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block">Rekomendasi Armada</span>
                      <span className="text-xs font-semibold text-neutral-700 block truncate max-w-[140px]">
                        {pkg.recommendedVehicle.split('/')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Inclusions Detail Box based on Selected Tier */}
                  <div className="mt-4 space-y-2 text-xs border-t border-neutral-100 pt-3 flex-1">
                    {isAllIn ? (
                      <>
                        <div className="p-2 bg-orange-50/70 rounded-xl border border-orange-200/80 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 block">
                            Fasilitas Paket All In
                          </span>
                          <span className="text-[11px] font-semibold text-neutral-800 block mt-0.5 leading-snug">
                            Kendaraan, driver, bbm, parkir, tiket wisata, hotel, makan 1x di hotel dan 2x/ hari di luar hotel
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-neutral-600">
                          <Car className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">
                            <strong>Kendaraan:</strong> Driver, BBM & Parkir Include
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-neutral-600">
                          <Hotel className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">
                            <strong>Hotel:</strong> Mitra Bintang 3-4 Pilihan
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-neutral-600">
                          <Utensils className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">
                            <strong>Makan:</strong> 1x di Hotel & 2x/hari di Luar Hotel
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-neutral-600">
                          <Ticket className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">
                            <strong>Tiket Wisata:</strong> {pkg.included.tickets.length} Lokasi Tercover Penuh
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2 bg-blue-50/70 rounded-xl border border-blue-200/80 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">
                            Fasilitas Paket Hemat
                          </span>
                          <span className="text-[11px] font-semibold text-neutral-800 block mt-0.5 leading-snug">
                            Kendaraan, driver, bbm, parkir
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-neutral-600">
                          <Car className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">
                            <strong>Kendaraan:</strong> Unit Pariwisata AC Terawat
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-neutral-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">
                            <strong>Driver & BBM:</strong> Supir Ramah & Bensin Full
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-neutral-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">
                            <strong>Parkir:</strong> Bebas Retribusi Seluruh Tempat
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-400 italic pt-1">
                          *Hotel, tiket wisata & makan mandiri (opsional fleksibel)
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
                    <button
                      onClick={() => onOpenDetail(pkg)}
                      className="py-2.5 px-3 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors text-center"
                    >
                      Detail & Rute
                    </button>
                    <button
                      onClick={() => onStartBooking(pkg, currentTier)}
                      className="py-2.5 px-3 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
                    >
                      <span>Booking</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
};
