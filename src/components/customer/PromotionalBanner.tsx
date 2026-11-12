import React, { useState, useEffect, useId } from 'react';
import { 
  Tag, 
  Copy, 
  Check, 
  Clock, 
  ArrowRight, 
  Percent, 
  Sparkles, 
  Users, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PackageCategory, DestinationRegion } from '../../types/travel';

export interface PromoOffer {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  code: string;
  discountDisplay: string;
  targetCategory?: PackageCategory | 'all';
  targetDestination?: DestinationRegion | 'all';
  perks: string[];
  expiresInDays: number;
  remainingQuota: number;
}

export const SEASONAL_PROMOS: PromoOffer[] = [
  {
    id: 'promo-liburan-allin',
    badge: 'PROMO MUSIM LIBURAN & AKHIR TAHUN',
    title: 'Diskon 10% Paket All In Lengkap',
    highlight: 'Hemat Hingga Rp 750.000',
    description: 'Nikmati liburan bebas repot mencakup unit armada, driver berlisensi, BBM, tiket seluruh objek wisata, hotel pilihan dan makan 3x sehari.',
    code: 'LIBURANALLIN',
    discountDisplay: 'DISKON 10%',
    targetCategory: 'all',
    targetDestination: 'all',
    perks: ['Free Snack Box Premium', 'Dokumentasi Foto Wisata', 'Jaminan Unit Bersih & Prima'],
    expiresInDays: 3,
    remainingQuota: 7
  },
  {
    id: 'promo-rombongan-gathering',
    badge: 'FLASH SALE ROMBONGAN & GATHERING',
    title: 'Potongan Rp 1.500.000 Rombongan',
    highlight: 'Spesial Min. 15 Pax (HiAce / Bus)',
    description: 'Cocok untuk family gathering, reuni akbar, dan study tour ke Jogja, Malang/Bromo, atau Bali dengan itinerary tersusun rapi.',
    code: 'ROMBONGANSERU',
    discountDisplay: 'POTONGAN RP 1.5 JT',
    targetCategory: 'family_gathering',
    targetDestination: 'all',
    perks: ['Gratis Banner / Spanduk Custom', 'Bonus Kaos Wisata PERGIDIANTAR', 'Tour Leader Bersertifikat'],
    expiresInDays: 5,
    remainingQuota: 4
  },
  {
    id: 'promo-earlybird-custom',
    badge: 'EARLY BIRD TRIP KHUSUS',
    title: 'Cashback Rp 500.000 Booking H-14',
    highlight: 'Jogja, Bromo & Nusa Penida',
    description: 'Booking lebih awal untuk memastikan ketersediaan armada tipe favorit Anda pada musim liburan tanpa lonjakan harga tinggi.',
    code: 'EARLYBIRDTRIP',
    discountDisplay: 'CASHBACK RP 500 RB',
    targetCategory: 'all',
    targetDestination: 'jogja',
    perks: ['Bebas Reschedule 1x', 'Konsultasi Itinerary Gratis', 'Penjemputan Tepat Waktu'],
    expiresInDays: 6,
    remainingQuota: 9
  }
];

interface PromotionalBannerProps {
  onClaimPromo?: (promo: PromoOffer) => void;
  className?: string;
  initiallyCollapsed?: boolean;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  onClaimPromo,
  className = '',
  initiallyCollapsed = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  const [isPaused, setIsPaused] = useState(false);

  const activePromo = SEASONAL_PROMOS[currentIndex];

  // Countdown timer state initialized for realistic seasonal deadline
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: activePromo.expiresInDays,
    hours: 14,
    minutes: 36,
    seconds: 42
  });

  // Tick countdown timer smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          // Loop reset for demo continuity
          return { days: 2, hours: 18, minutes: 45, seconds: 30 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // Auto rotate offers every 8 seconds unless hovered
  useEffect(() => {
    if (isPaused || isCollapsed) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SEASONAL_PROMOS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isPaused, isCollapsed]);

  const handleCopyCode = (code: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(code);
      }
    } catch {
      // Fallback
    }
    // Also save in localStorage/sessionStorage so checkout can auto-fill
    try {
      localStorage.setItem('pergidiantar_promo_code', code);
      sessionStorage.setItem('pergidiantar_promo_code', code);
    } catch {
      // safe fallback
    }

    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  const handleClaim = () => {
    handleCopyCode(activePromo.code);
    if (onClaimPromo) {
      onClaimPromo(activePromo);
    }
  };

  const padZero = (num: number) => num.toString().padStart(2, '0');

  return (
    <div 
      className={`w-full transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Collapsed State Minimal Pill/Bar */}
      {isCollapsed ? (
        <div className="bg-neutral-900/90 backdrop-blur-md border border-orange-500/30 rounded-xl px-4 py-2.5 flex items-center justify-between text-white shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 bg-orange-500/20 text-orange-400 rounded-lg shrink-0">
              <Flame className="w-4 h-4" />
            </span>
            <div className="text-xs truncate">
              <span className="font-bold text-orange-400 mr-2">{activePromo.discountDisplay}</span>
              <span className="text-neutral-200">{activePromo.title}</span>
              <span className="text-neutral-400 hidden sm:inline ml-2">· Kode: <code className="text-orange-300 font-mono font-bold">{activePromo.code}</code></span>
            </div>
          </div>
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300 px-3 py-1 rounded-lg hover:bg-white/5 transition-colors shrink-0"
          >
            <span>Lihat Detail Promo</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Expanded Full High-Conversion Banner */
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-neutral-950 border border-orange-500/25 shadow-2xl backdrop-blur-md">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Control Bar: Promo Tabs + Carousel Controls + Collapse */}
          <div className="px-4 sm:px-6 pt-3.5 pb-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
              {SEASONAL_PROMOS.map((promo, idx) => (
                <button
                  key={promo.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                    currentIndex === idx
                      ? 'bg-orange-500 text-white shadow-sm font-semibold'
                      : 'text-neutral-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{promo.discountDisplay}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-neutral-400">
              <span className="text-[11px] hidden md:inline text-neutral-400 font-medium">
                {currentIndex + 1} dari {SEASONAL_PROMOS.length} Promo Aktif
              </span>
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + SEASONAL_PROMOS.length) % SEASONAL_PROMOS.length)}
                className="p-1 rounded-md hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                title="Promo Sebelumnya"
                aria-label="Promo Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % SEASONAL_PROMOS.length)}
                className="p-1 rounded-md hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                title="Promo Berikutnya"
                aria-label="Promo Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="w-px h-3.5 bg-neutral-700 mx-1" />
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1 rounded-md hover:bg-white/10 text-neutral-400 hover:text-neutral-200 transition-colors"
                title="Ciutkan Banner"
                aria-label="Ciutkan Banner"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Content Body */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Left Column: Promotion Details & Value Propositions (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {/* Badge & Urgency Kicker */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-orange-400 font-bold uppercase tracking-wider text-[11px]">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  {activePromo.badge}
                </span>
                <span className="text-neutral-600 hidden sm:inline">·</span>
                <span className="text-neutral-300 text-[11px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  Sisa Kuota: <strong className="text-orange-400">{activePromo.remainingQuota} Paket</strong>
                </span>
              </div>

              {/* Title & Highlight */}
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>{activePromo.title}</span>
                </h3>
                <p className="text-sm font-semibold text-orange-300 mt-0.5">
                  {activePromo.highlight}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
                {activePromo.description}
              </p>

              {/* Perks List */}
              <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-300">
                {activePromo.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Live Countdown Box + Voucher Code Copy + Claim Action (5 cols) */}
            <div className="lg:col-span-5 bg-neutral-950/70 border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
              {/* Countdown Ticker Header */}
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                  <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                    <Clock className="w-3.5 h-3.5 text-orange-400" /> WAKTU PENAWARAN TERBATAS
                  </span>
                  <span className="text-[11px] text-orange-400 font-medium">Batas Akhir Musim</span>
                </div>

                {/* 4 Digit Clock Blocks */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 px-1">
                    <div className="text-base sm:text-lg font-mono font-bold text-white">
                      {padZero(timeLeft.days)}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">HARI</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 px-1">
                    <div className="text-base sm:text-lg font-mono font-bold text-white">
                      {padZero(timeLeft.hours)}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">JAM</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 px-1">
                    <div className="text-base sm:text-lg font-mono font-bold text-white">
                      {padZero(timeLeft.minutes)}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">MENIT</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg py-1.5 px-1">
                    <div className="text-base sm:text-lg font-mono font-bold text-orange-400 animate-pulse">
                      {padZero(timeLeft.seconds)}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">DETIK</div>
                  </div>
                </div>
              </div>

              {/* Voucher Code Copy Box */}
              <div className="bg-neutral-900/80 border border-dashed border-orange-500/40 rounded-xl p-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="block text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                    Kode Kupon Promo:
                  </span>
                  <code className="text-sm sm:text-base font-mono font-black text-orange-400 tracking-wider">
                    {activePromo.code}
                  </code>
                </div>
                <button
                  onClick={() => handleCopyCode(activePromo.code)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                    copiedCode === activePromo.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-neutral-100'
                  }`}
                  title="Salin Kode Diskon"
                >
                  {copiedCode === activePromo.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              {/* Main CTA: Klaim Promo & Jelajahi Paket */}
              <button
                onClick={handleClaim}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-orange-500/25 flex items-center justify-center gap-2 group active:scale-[0.99]"
              >
                <span>Klaim Promo & Pilih Paket</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
