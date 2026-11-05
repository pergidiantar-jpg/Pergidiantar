import React from 'react';
import { 
  Car, 
  Hotel, 
  Ticket, 
  CheckCircle2, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { PackageCategory, DestinationRegion } from '../../types/travel';

interface HeroSectionProps {
  selectedCategory: PackageCategory | 'all';
  onSelectCategory: (cat: PackageCategory | 'all') => void;
  selectedDestination: DestinationRegion | 'all';
  onSelectDestination: (dest: DestinationRegion | 'all') => void;
  onScrollToCatalog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDestination,
  onSelectDestination,
  onScrollToCatalog
}) => {
  return (
    <section className="relative overflow-hidden bg-neutral-900 text-white">
      {/* Background Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_pergidiantar_travel_1793579233622.jpg"
          alt="Wisatawan PERGIDIANTAR di Yogyakarta"
          className="w-full h-full object-cover opacity-35"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-900/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Top Kicker */}
        <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-4 tracking-wide">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>JASA PERJALANAN WISATA RESMI & TERPERCAYA DI INDONESIA</span>
        </div>

        {/* Main Headline */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Liburan Nyaman, Berkesan & Bebas Ribet Bersama <span className="text-white">PERGI</span><span className="text-orange-400">DIANTAR</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed">
            Pilihan <strong>Paket Hemat</strong> (kendaraan, driver, bbm, parkir) dan <strong>Paket All In</strong> (kendaraan, driver, bbm, parkir, tiket wisata, hotel, makan 1x di hotel dan 2x/ hari di luar hotel) untuk destinasi unggulan <strong>Jogja, Malang, dan Bali</strong>.
          </p>
        </div>

        {/* 3 Core Inclusions Banner - strictly as requested */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-start gap-3.5">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-lg shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Transportasi Lengkap</h3>
              <p className="text-xs text-neutral-300 mt-0.5 leading-snug">
                Unit armada (HiAce/Bus), driver ramah berpengalaman, BBM, parkir & tol tercover penuh.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-start gap-3.5">
            <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-lg shrink-0">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Akomodasi Nyaman & Makan</h3>
              <p className="text-xs text-neutral-300 mt-0.5 leading-snug">
                Hotel mitra pilihan bintang terpercaya dan makan sesuai jadwal di restoran khas lokal.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-start gap-3.5">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-lg shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Tiket Wisata Termasuk</h3>
              <p className="text-xs text-neutral-300 mt-0.5 leading-snug">
                Tiket masuk seluruh objek wisata dalam paket sudah disiapkan tanpa ribet mengantre.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Filter Box */}
        <div className="mt-8 p-4 bg-white rounded-2xl shadow-xl text-neutral-900 border border-neutral-200 max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Destinasi Wisata
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => onSelectDestination(e.target.value as DestinationRegion | 'all')}
                className="w-full text-xs font-medium py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
              >
                <option value="all">Semua Destinasi (Jogja, Malang, Bali)</option>
                <option value="jogja">Yogyakarta (Candi, Merapi, Pantai)</option>
                <option value="malang">Malang & Bromo (Kaldera, Petik Apel)</option>
                <option value="bali">Pulau Bali (Uluwatu, Penglipuran, Pantai)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Kategori Rombongan
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value as PackageCategory | 'all')}
                className="w-full text-xs font-medium py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
              >
                <option value="all">Semua Kategori Perjalanan</option>
                <option value="single_trip">Single Trip (Jogja)</option>
                <option value="family_trip">Family Trip (Jogja)</option>
                <option value="family_gathering">Family Gathering (Jogja, Malang, Bali)</option>
                <option value="company_gathering">Company Gathering (Jogja)</option>
                <option value="study_tour">Study Tour (Jogja, Malang, Bali)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={onScrollToCatalog}
                className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Cari Paket Penawaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Social Proof Strip */}
        <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
            <span>1,450+ Rombongan Sukses Diantar</span>
          </div>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Armada Milik Sendiri & Driver Berlisensi</span>
          </div>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Pembayaran Aman Terintegrasi QRIS & VA</span>
          </div>
        </div>
      </div>
    </section>
  );
};
