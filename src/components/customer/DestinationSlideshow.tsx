import React, { useState, useEffect, useRef } from 'react';
import { DestinationRegion } from '../../types/travel';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  SunMedium, 
  Utensils, 
  Sparkles, 
  Compass, 
  ArrowRight,
  Camera,
  Calendar,
  CheckCircle2
} from 'lucide-react';

import jogjaImg from '../../assets/images/dest_jogja_heritage_1793579234240.jpg';
import malangImg from '../../assets/images/dest_malang_bromo_1793579235303.jpg';
import baliImg from '../../assets/images/dest_bali_paradise_1793579235747.jpg';

interface DestinationSlide {
  id: DestinationRegion;
  name: string;
  subtitle: string;
  tagline: string;
  image: string;
  badge: string;
  accentColor: string;
  bestTime: string;
  popularSpots: string[];
  culinaryHighlights: string[];
  culturalTrivia: string;
  recommendedPackages: string;
}

const DESTINATION_SLIDES: DestinationSlide[] = [
  {
    id: 'jogja',
    name: 'Yogyakarta Istimewa',
    subtitle: 'Daerah Istimewa Yogyakarta',
    tagline: 'Harmoni Cagar Budaya Luhur Kraton, Candi Megah Prambanan, dan Eksotisme Pesisir Selatan',
    image: jogjaImg,
    badge: 'Kota Kebudayaan & Pelajar',
    accentColor: 'from-amber-500/30 to-emerald-700/80',
    bestTime: 'Mei - Oktober (Musim kemarau sejuk, momen terbaik untuk sunrise candi & sunset pantai)',
    popularSpots: [
      'Candi Prambanan & Ratu Boko',
      'Goa Pindul & Rafting Oya',
      'Tebing Breksi & HeHa Sky View',
      'Malioboro & Titik Nol Kilometer',
      'Pantai Parangtritis & Gumuk Pasir'
    ],
    culinaryHighlights: [
      'Gudeg Yu Djum & Wijilan',
      'Kopi Jos Arang Malioboro',
      'Bakpia Kukus Tugu Jogja',
      'Mangut Lele Mbah Marto'
    ],
    culturalTrivia: 'Jogja didesain berporoskan Garis Imajiner mistis yang membentang lurus menghubungkan Gunung Merapi di utara, Tugu Golong Gilig, Kraton Ngayogyakarta, hingga Laut Selatan.',
    recommendedPackages: 'Single Trip, Family Trip, Company Gathering & Study Tour'
  },
  {
    id: 'malang',
    name: 'Malang & Bromo Adventure',
    subtitle: 'Jawa Timur',
    tagline: 'Sensasi Magis Lautan Pasir & Sunrise Bromo, Hawa Dingin Pegunungan Kota Batu, serta Wahana Modern',
    image: malangImg,
    badge: 'Kota Apel & Vulkanik Eksotis',
    accentColor: 'from-orange-500/30 to-blue-900/80',
    bestTime: 'Juli - November (Suhu udara sejuk dan kabut lautan awan Bromo terpampang paling jelas)',
    popularSpots: [
      'Penanjakan 1 & Kawah Bromo',
      'Pasir Berbisik & Savana Teletubbies',
      'Museum Angkut Kota Batu',
      'Jatim Park 2 & Predator Fun Park',
      'Air Terjun Coban Rondo & Labirin'
    ],
    culinaryHighlights: [
      'Bakso Malang Presiden Kuah Kaldu Gurih',
      'Rawon Nguling Daging Empuk',
      'Apel Manalagi Segar Petik Sendiri',
      'Pos Ketan Legenda 1967 Alun-Alun Batu'
    ],
    culturalTrivia: 'Kota Batu dijuluki "De Kleine Zwitserland" (Swiss Kecil di Jawa) oleh bangsa Belanda berkat lembah pegunungannya yang hijau, subur, serta udara sejuk yang menyerupai Eropa.',
    recommendedPackages: 'Family Gathering & Study Tour Malang Bromo All In'
  },
  {
    id: 'bali',
    name: 'Bali Pulau Dewata',
    subtitle: 'Provinsi Bali',
    tagline: 'Kemegahan Pura Sakral di Tebing Samudra, Pasir Putih Berombak Tenang, dan Seni Tari Berkelas Dunia',
    image: baliImg,
    badge: 'Destinasi Pariwisata Global',
    accentColor: 'from-cyan-500/30 to-emerald-900/80',
    bestTime: 'April - Oktober (Hari cerah tanpa hujan, sangat pas untuk watersport & sunset beach club)',
    popularSpots: [
      'Pura Uluwatu & Tari Kecak Sunset',
      'Tanah Lot Pura di Atas Karang Laut',
      'Kelingking Beach Nusa Penida',
      'Desa Penglipuran Terbersih Dunia',
      'Pantai Pandawa & Melasti Ungasan'
    ],
    culinaryHighlights: [
      'Ayam Betutu Gilimanuk Rempah Khas',
      'Sate Lilit Ikan Laut Bumbu Bali',
      'Nasi Pedas Ibu Andika Kuta',
      'Bebek Bengil Crispy Ubud'
    ],
    culturalTrivia: 'Kehidupan masyarakat Bali berpedoman pada filosofi luhur Tri Hita Karana—menjaga tiga pilar keharmonisan abadi: hubungan manusia dengan Tuhan, alam semesta, dan sesama umat.',
    recommendedPackages: 'Family Gathering & Study Tour Bali Eksklusif All In'
  }
];

interface DestinationSlideshowProps {
  onSelectDestination: (dest: DestinationRegion) => void;
  onExplorePackages: () => void;
}

export const DestinationSlideshow: React.FC<DestinationSlideshowProps> = ({
  onSelectDestination,
  onExplorePackages
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = DESTINATION_SLIDES[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % DESTINATION_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + DESTINATION_SLIDES.length) % DESTINATION_SLIDES.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 7000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex]);

  const handleExploreThisDest = (destId: DestinationRegion) => {
    onSelectDestination(destId);
    onExplorePackages();
  };

  return (
    <section 
      id="destinations-showcase" 
      className="py-12 bg-neutral-900 text-white relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 animate-spin-slow text-orange-400" />
              <span>Destinasi Unggulan PERGIDIANTAR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Jelajahi Info Menarik Jogja, Malang & Bali
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Simak daya tarik ikonik, kuliner khas wajib, serta waktu terbaik berkunjung. Klik destinasi untuk melihat pilihan paket hemat dan all-in.
            </p>
          </div>

          {/* Destination Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-800/90 rounded-2xl border border-neutral-700/60 overflow-x-auto shrink-0">
            {DESTINATION_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  currentIndex === idx
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
                }`}
              >
                <span>{slide.name.split(' ')[0]}</span>
                {currentIndex === idx && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Card Container */}
        <div className="relative rounded-3xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-neutral-950">
          {/* Main Slide Presentation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Visual Image Banner with Gradient Overlay (LHS) */}
            <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden group">
              <img
                src={currentSlide.image}
                alt={currentSlide.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-neutral-950/30 lg:to-neutral-950" />
              
              {/* Floating Badge on Image */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-semibold">
                  {currentSlide.badge}
                </span>
                <span className="px-2.5 py-1 bg-blue-600 text-white rounded-full text-[11px] font-bold">
                  {currentSlide.subtitle}
                </span>
              </div>

              {/* Tagline overlay on mobile view */}
              <div className="absolute bottom-4 left-4 right-4 lg:hidden z-10">
                <h3 className="text-xl font-black text-white drop-shadow-md">
                  {currentSlide.name}
                </h3>
                <p className="text-xs text-neutral-200 line-clamp-2 mt-0.5">
                  {currentSlide.tagline}
                </p>
              </div>

              {/* Navigation Arrows on Image */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  aria-label="Destinasi Sebelumnya"
                  className="w-9 h-9 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white flex items-center justify-center border border-neutral-700 transition-colors backdrop-blur-md shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Destinasi Berikutnya"
                  className="w-9 h-9 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white flex items-center justify-center border border-neutral-700 transition-colors backdrop-blur-md shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Interesting Info & Trivia Panel (RHS) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-neutral-950">
              <div className="space-y-4">
                {/* Header */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold mb-1">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{currentSlide.subtitle}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {currentSlide.name}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    {currentSlide.tagline}
                  </p>
                </div>

                {/* Info Cards Grid */}
                <div className="space-y-3 pt-2">
                  {/* Waktu Terbaik */}
                  <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                      <SunMedium className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide block">
                        Waktu Terbaik Berkunjung
                      </span>
                      <p className="text-xs text-neutral-200 mt-0.5">
                        {currentSlide.bestTime}
                      </p>
                    </div>
                  </div>

                  {/* Destinasi Ikonik */}
                  <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="w-full">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide block">
                        Spot Wisata Favorit
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {currentSlide.popularSpots.slice(0, 4).map((spot, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 bg-neutral-800 border border-neutral-700/60 rounded-md text-[11px] text-neutral-200"
                          >
                            {spot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Kuliner Khas */}
                  <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div className="w-full">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide block">
                        Kuliner Otentik Rekomendasi
                      </span>
                      <p className="text-xs text-neutral-200 mt-0.5">
                        {currentSlide.culinaryHighlights.join(' · ')}
                      </p>
                    </div>
                  </div>

                  {/* Fakta Unik / Trivia */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-950/40 to-neutral-900 border border-orange-900/50 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wide block">
                        Fakta Menarik & Budaya
                      </span>
                      <p className="text-xs text-neutral-300 mt-0.5 leading-snug">
                        {currentSlide.culturalTrivia}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-5 mt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">
                    Tersedia di Paket:
                  </span>
                  <span className="text-xs font-semibold text-orange-300 block truncate max-w-[240px]">
                    {currentSlide.recommendedPackages}
                  </span>
                </div>

                <button
                  onClick={() => handleExploreThisDest(currentSlide.id)}
                  className="w-full sm:w-auto py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0 group"
                >
                  <span>Pilih Paket {currentSlide.name.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Slide Progress / Indicators Bar */}
          <div className="h-1 w-full bg-neutral-800 flex">
            {DESTINATION_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`flex-1 h-full transition-all duration-300 ${
                  currentIndex === idx ? 'bg-orange-500' : 'bg-transparent hover:bg-neutral-600'
                }`}
                title={`Pindah ke slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
