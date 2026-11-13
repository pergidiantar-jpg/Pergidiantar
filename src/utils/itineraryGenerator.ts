/**
 * Itinerary Generator & Timeline Utilities for PERGIDIANTAR
 * Handles automatic chronological scheduling for Custom Trip Calculator
 * with intercity transit estimation (e.g. Jogja -> Bali, Jakarta -> Jogja/Malang, dll.)
 * and default template generation for Admin Package Management.
 */

import { 
  ItineraryDay, 
  ItineraryTimelineItem, 
  ItineraryActivityType, 
  DestinationRegion 
} from '../types/travel';
import { DestinationOption } from '../data/destinationsData';

export interface IntercityTransitStep {
  time: string;
  title: string;
  description: string;
  location: string;
  type: ItineraryActivityType;
  notes?: string;
}

export interface IntercityTravelInfo {
  isIntercity: boolean;
  pickupCityClean: string;
  destinationCityClean: string;
  destinationRegion: DestinationRegion;
  distanceKm: number;
  estimatedTravelHours: number;
  routeHighlights: string;
  departureNotice: string;
  isOvernightJourney: boolean;
  day1DepartureTime: string;
  day1ArrivalTime: string;
  day1TransitSteps: IntercityTransitStep[];
  returnTransitSteps: IntercityTransitStep[];
}

/**
 * Intelligent Estimator for Intercity Route & Travel Times in Indonesia
 * Examples:
 *  - Jogja -> Bali: ~680 km, 14-16 hours via Tol Trans-Jawa & Feri Ketapang-Gilimanuk
 *  - Jakarta -> Jogja: ~550 km, 7-9 hours via Tol Trans-Jawa
 *  - Jakarta -> Malang: ~850 km, 11-13 hours via Tol Trans-Jawa
 *  - Surabaya -> Bali: ~390 km, 8-10 hours
 *  - Surabaya -> Jogja: ~320 km, 4.5-5.5 hours
 */
export function getIntercityTravelInfo(pickupCity: string, destination: DestinationRegion): IntercityTravelInfo {
  const pCity = (pickupCity || '').trim();
  const clean = pCity.toLowerCase();

  const destMap: Record<DestinationRegion, string> = {
    jogja: 'Yogyakarta',
    malang: 'Malang & Bromo',
    bali: 'Bali'
  };
  const destName = destMap[destination];

  // Helper check if pickup city is local to destination
  const isLocalToBali = clean.includes('bali') || clean.includes('denpasar') || clean.includes('kuta') || 
    clean.includes('ubud') || clean.includes('sanur') || clean.includes('seminyak') || 
    clean.includes('jimbaran') || clean.includes('ngurah') || clean.includes('canggu') || clean.includes('nusadua');

  const isLocalToJogja = clean.includes('jogja') || clean.includes('yogyakarta') || clean.includes('sleman') || 
    clean.includes('bantul') || clean.includes('kulon') || clean.includes('gunungkidul') || 
    clean.includes('yia') || clean.includes('tugu');

  const isLocalToMalang = clean.includes('malang') || clean.includes('batu') || clean.includes('abdulrachman');

  // 1. DESTINATION: BALI
  if (destination === 'bali') {
    if (isLocalToBali) {
      return {
        isIntercity: false,
        pickupCityClean: pCity || 'Denpasar / Bali',
        destinationCityClean: destName,
        destinationRegion: destination,
        distanceKm: 25,
        estimatedTravelHours: 1,
        routeHighlights: 'Penjemputan Lokal Area Bali (Bandara Ngurah Rai / Hotel)',
        departureNotice: 'Penjemputan standar di hotel atau Bandara Internasional I Gusti Ngurah Rai Bali.',
        isOvernightJourney: false,
        day1DepartureTime: '08:00 WITA',
        day1ArrivalTime: '08:30 WITA',
        day1TransitSteps: [],
        returnTransitSteps: []
      };
    }

    // From Jogja / Solo / Central Java to Bali (~680 km, 14-16 hours)
    if (clean.includes('jogja') || clean.includes('yogyakarta') || clean.includes('solo') || clean.includes('surakarta') || clean.includes('semarang') || clean.includes('klaten')) {
      const originName = clean.includes('solo') ? 'Solo' : clean.includes('semarang') ? 'Semarang' : 'Yogyakarta';
      return {
        isIntercity: true,
        pickupCityClean: originName,
        destinationCityClean: 'Bali (Pulau Dewata)',
        destinationRegion: destination,
        distanceKm: 680,
        estimatedTravelHours: 15,
        routeHighlights: 'Tol Trans-Jawa (Solo - Surabaya - Probolinggo - Banyuwangi) & Kapal Feri Selat Bali (Ketapang - Gilimanuk)',
        departureNotice: `Penjemputan dimulai sore hari H-1 pukul 16:00 WIB di ${originName} untuk menempuh perjalanan darat lintas pulau via Tol Trans-Jawa & penyeberangan feri, sehingga tiba di Bali pagi hari pukul 07:30 WITA dan langsung bisa menikmati tour secara maksimal.`,
        isOvernightJourney: true,
        day1DepartureTime: '16:00 WIB (H-1 Sore)',
        day1ArrivalTime: '07:30 WITA (Pagi Hari 1)',
        day1TransitSteps: [
          {
            time: '16:00 - 17:00 WIB',
            title: `Penjemputan di ${originName} & Persiapan Perjalanan Antar Pulau`,
            description: `Penyambutan tamu di titik jemput ${originName}, pemuatan bagasi ke armada pariwisata ber-AC dingin, dan briefing keselamatan rute ekspedisi Bali.`,
            location: `Titik Kumpul ${originName}`,
            type: 'pickup',
            notes: 'Armada & driver pariwisata berlisensi standby'
          },
          {
            time: '17:30 - 23:30 WIB',
            title: 'Perjalanan Lintas Jawa via Tol Trans-Jawa & Santap Malam',
            description: 'Melintasi Tol Solo-Ngawi-Kertosono-Pasuruan dengan nyaman. Istirahat santap malam, ibadah, dan toilet di Rest Area Tol Trans-Jawa.',
            location: 'Tol Trans-Jawa & Rest Area Utama',
            type: 'transport',
            notes: 'Termasuk tol & BBM penuh'
          },
          {
            time: '23:30 - 05:00 WIB',
            title: 'Perjalanan Dini Hari Menuju Ujung Timur Jawa (Banyuwangi)',
            description: 'Melanjutkan perjalanan malam menuju Pelabuhan Ketapang Banyuwangi dengan pengemudi profesional bergantian demi keamanan.',
            location: 'Jalur Probolinggo - Situbondo - Banyuwangi',
            type: 'transport',
            notes: 'Armada nyaman & reclining seats'
          },
          {
            time: '05:30 - 07:00 WITA',
            title: 'Penyeberangan Kapal Feri Selat Bali (Ketapang ke Gilimanuk)',
            description: 'Boarding kapal feri penyeberangan Selat Bali. Tamu dapat naik ke dek atas menikmati panorama matahari terbit (sunrise) nan eksotis di atas perairan Selat Bali.',
            location: 'Pelabuhan Ketapang - Gilimanuk Bali',
            type: 'transport',
            notes: 'Tiket penyeberangan kapal feri include'
          },
          {
            time: '07:30 - 09:00 WITA',
            title: 'Selamat Datang di Bali! Sarapan Pagi & Istirahat Segar',
            description: 'Ketibaan di Pulau Dewata. Istirahat sejenak menyegarkan diri, cuci muka/mandi di rest area mitra, dan menikmati sarapan pagi hangat di Gilimanuk/Jembrana.',
            location: 'Kawasan Gilimanuk / Negara Bali',
            type: 'meal',
            notes: 'Sarapan pagi penyambutan di Bali'
          }
        ],
        returnTransitSteps: [
          {
            time: '13:30 - 16:00 WITA',
            title: 'Perjalanan Menuju Pelabuhan Gilimanuk Bali',
            description: 'Memulai perjalanan pulang menuju ujung barat pulau Bali dengan pemandangan pesisir dan perbukitan barat Bali.',
            location: 'Jalur Nasional Denpasar - Gilimanuk',
            type: 'transport',
            notes: 'Armada ber-AC'
          },
          {
            time: '16:30 - 18:00 WITA',
            title: 'Penyeberangan Feri Selat Bali (Gilimanuk ke Ketapang Banyuwangi)',
            description: 'Proses penyeberangan kembali ke Pulau Jawa dengan pemandangan senja di Selat Bali.',
            location: 'Pelabuhan Gilimanuk - Ketapang',
            type: 'transport',
            notes: 'Tiket feri penyeberangan include'
          },
          {
            time: '18:30 - 23:30 WIB',
            title: 'Perjalanan Tol Trans-Jawa & Santap Malam di Rest Area',
            description: 'Melintasi Tol Probolinggo-Surabaya-Solo dengan istirahat santap malam di Rest Area Tol.',
            location: 'Tol Trans-Jawa',
            type: 'transport',
            notes: 'Makan malam perjalanan'
          },
          {
            time: 'Est. 02:30 WIB',
            title: `Ketibaan Kembali di ${originName} dengan Selamat (Drop-off)`,
            description: `Pengantaran kembali ke titik kumpul / alamat wisatawan di ${originName}. Tour Bali selesai dengan kenangan indah bersama PERGIDIANTAR!`,
            location: `Titik Drop-off ${originName}`,
            type: 'dropoff',
            notes: 'Tour ekspedisi Bali selesai'
          }
        ]
      };
    }

    // From East Java (Surabaya / Malang) to Bali (~390 km, 8-10 hours)
    if (clean.includes('surabaya') || clean.includes('sidoarjo') || clean.includes('malang')) {
      const originName = clean.includes('malang') ? 'Malang' : 'Surabaya';
      return {
        isIntercity: true,
        pickupCityClean: originName,
        destinationCityClean: 'Bali (Pulau Dewata)',
        destinationRegion: destination,
        distanceKm: 400,
        estimatedTravelHours: 9,
        routeHighlights: 'Tol Pasuruan - Probolinggo - Banyuwangi & Feri Ketapang - Gilimanuk',
        departureNotice: `Penjemputan malam H-1 pukul 21:00 WIB di ${originName} via Tol Probolinggo, menyeberang feri dini hari, dan tiba di Bali pagi hari pukul 07:00 WITA.`,
        isOvernightJourney: true,
        day1DepartureTime: '21:00 WIB (H-1 Malam)',
        day1ArrivalTime: '07:00 WITA (Hari 1 Pagi)',
        day1TransitSteps: [
          {
            time: '21:00 - 22:00 WIB',
            title: `Penjemputan di ${originName} & Berangkat Menuju Banyuwangi`,
            description: `Penyambutan tamu di titik jemput ${originName}, pemuatan koper dan mulai perjalanan malam via Tol Pasuruan-Probolinggo.`,
            location: originName,
            type: 'pickup'
          },
          {
            time: '22:30 - 04:30 WIB',
            title: 'Perjalanan Darat Tol & Pesisir Menuju Pelabuhan Ketapang',
            description: 'Perjalanan malam santai dan istirahat di dalam armada yang ber-AC dingin dan nyaman.',
            location: 'Jalur Tol Probolinggo - Banyuwangi',
            type: 'transport'
          },
          {
            time: '05:00 - 06:30 WITA',
            title: 'Penyeberangan Feri Selat Bali & Sunrise',
            description: 'Penyeberangan kapal feri Ketapang - Gilimanuk menyambut fajar pagi di Selat Bali.',
            location: 'Pelabuhan Gilimanuk Bali',
            type: 'transport'
          },
          {
            time: '07:00 - 08:30 WITA',
            title: 'Tiba di Bali! Sarapan Pagi & Persiapan Tour',
            description: 'Menikmati sarapan pagi penyambutan di Bali dan menyegarkan diri sebelum tour.',
            location: 'Kawasan Gilimanuk / Tabanan Bali',
            type: 'meal'
          }
        ],
        returnTransitSteps: [
          {
            time: '14:00 - 17:00 WITA',
            title: 'Perjalanan Menuju Pelabuhan Gilimanuk Bali',
            description: 'Perjalanan kembali menuju pelabuhan ujung barat Bali.',
            location: 'Gilimanuk',
            type: 'transport'
          },
          {
            time: '17:30 - 19:00 WITA',
            title: 'Penyeberangan Feri Gilimanuk ke Ketapang',
            description: 'Penyeberangan feri kembali ke Pulau Jawa.',
            location: 'Selat Bali',
            type: 'transport'
          },
          {
            time: '19:30 - 23:30 WIB',
            title: `Perjalanan Tol Menuju ${originName} & Drop-off Selamat`,
            description: `Perjalanan via Tol Probolinggo dan tiba kembali di ${originName}. Tour selesai!`,
            location: originName,
            type: 'dropoff'
          }
        ]
      };
    }

    // From Jakarta / West Java to Bali (~1,150 km, 20-22 hours)
    return {
      isIntercity: true,
      pickupCityClean: pCity || 'Jakarta / Luar Bali',
      destinationCityClean: 'Bali (Pulau Dewata)',
      destinationRegion: destination,
      distanceKm: 1150,
      estimatedTravelHours: 21,
      routeHighlights: 'Tol Trans-Jawa Penuh (Jakarta - Surabaya - Banyuwangi) & Feri Selat Bali',
      departureNotice: `Rute jarak jauh dari ${pCity} menuju Bali (±1.150 km). Penjemputan dimulai H-1 pagi (pukul 09:00 WIB) melintasi Tol Trans-Jawa, tiba di Banyuwangi dini hari, menyeberang feri, dan tiba di Bali pagi hari pukul 07:30 WITA.`,
      isOvernightJourney: true,
      day1DepartureTime: '09:00 WIB (H-1 Pagi)',
      day1ArrivalTime: '07:30 WITA (Hari 1 Pagi)',
      day1TransitSteps: [
        {
          time: '09:00 - 10:00 WIB',
          title: `Penjemputan di ${pCity} & Memulai Ekspedisi Jawa - Bali`,
          description: `Penjemputan di titik kumpul ${pCity}, bagasi ditata rapi, dan briefing rute panjang Tol Trans-Jawa.`,
          location: pCity,
          type: 'pickup'
        },
        {
          time: '10:30 - 23:00 WIB',
          title: 'Perjalanan Tol Trans-Jawa, Makan Siang & Malam di Rest Area',
          description: 'Melintasi Tol Cipali, Batang, Semarang, Solo, Kertosono hingga Probolinggo dengan 2x istirahat santap di Rest Area.',
          location: 'Tol Trans-Jawa',
          type: 'transport'
        },
        {
          time: '23:30 - 05:00 WIB',
          title: 'Perjalanan Dini Hari Menuju Pelabuhan Ketapang Banyuwangi',
          description: 'Perjalanan etape akhir Jawa Timur menuju dermaga penyeberangan kapal feri ASDP.',
          location: 'Ketapang Banyuwangi',
          type: 'transport'
        },
        {
          time: '05:30 - 07:00 WITA',
          title: 'Penyeberangan Feri Selat Bali Menikmati Sunrise',
          description: 'Penyeberangan kapal feri Selat Bali dengan pemandangan memukau.',
          location: 'Selat Bali',
          type: 'transport'
        },
        {
          time: '07:30 - 09:00 WITA',
          title: 'Tiba di Bali! Sarapan Pagi & Mandi Segar',
          description: 'Sarapan pagi hangat di restoran tepi pantai Gilimanuk dan menyegarkan diri.',
          location: 'Gilimanuk Bali',
          type: 'meal'
        }
      ],
      returnTransitSteps: [
        {
          time: '13:00 - 16:30 WITA',
          title: 'Perjalanan Menuju Pelabuhan Gilimanuk Bali',
          description: 'Perjalanan darat menuju pelabuhan barat Bali.',
          location: 'Jembrana - Gilimanuk',
          type: 'transport'
        },
        {
          time: '17:00 - 18:30 WITA',
          title: 'Penyeberangan Feri Gilimanuk ke Ketapang',
          description: 'Penyeberangan kembali ke Jawa.',
          location: 'Selat Bali',
          type: 'transport'
        },
        {
          time: '19:00 - Besok Siang WIB',
          title: `Perjalanan Tol Trans-Jawa Menuju ${pCity} (Drop-off)`,
          description: `Perjalanan darat kembali menuju ${pCity}. Pengantaran selesai dengan selamat!`,
          location: pCity,
          type: 'dropoff'
        }
      ]
    };
  }

  // 2. DESTINATION: YOGYAKARTA (JOGJA)
  if (destination === 'jogja') {
    if (isLocalToJogja) {
      return {
        isIntercity: false,
        pickupCityClean: pCity || 'Yogyakarta',
        destinationCityClean: destName,
        destinationRegion: destination,
        distanceKm: 15,
        estimatedTravelHours: 0.5,
        routeHighlights: 'Penjemputan Lokal Area Yogyakarta (Bandara YIA / Stasiun Tugu / Hotel)',
        departureNotice: 'Penjemputan lokal di Bandara YIA, Stasiun Tugu, Lempuyangan atau hotel di Yogyakarta.',
        isOvernightJourney: false,
        day1DepartureTime: '08:00 WIB',
        day1ArrivalTime: '08:30 WIB',
        day1TransitSteps: [],
        returnTransitSteps: []
      };
    }

    // From Jakarta / Bandung / West Java to Jogja (~550 km, 7-8 hours)
    if (clean.includes('jakarta') || clean.includes('bandung') || clean.includes('bogor') || clean.includes('bekasi') || clean.includes('tangerang')) {
      const originName = clean.includes('bandung') ? 'Bandung' : 'Jakarta';
      return {
        isIntercity: true,
        pickupCityClean: originName,
        destinationCityClean: 'Yogyakarta',
        destinationRegion: destination,
        distanceKm: 550,
        estimatedTravelHours: 8,
        routeHighlights: 'Tol Cipali - Pejagan - Pemalang - Semarang - Solo - Yogyakarta',
        departureNotice: `Penjemputan subuh pukul 04:30 WIB di ${originName} via Tol Trans-Jawa. Estimasi perjalanan 7-8 jam sehingga tiba di Yogyakarta pukul 12:30 WIB pas untuk santap siang kuliner khas & check-in hotel.`,
        isOvernightJourney: false,
        day1DepartureTime: '04:30 WIB',
        day1ArrivalTime: '12:30 WIB',
        day1TransitSteps: [
          {
            time: '04:30 - 05:30 WIB',
            title: `Penjemputan Subuh di ${originName} & Masuk Tol Trans-Jawa`,
            description: `Penyambutan tamu di titik kumpul ${originName}, pemuatan koper dan mulai perjalanan subuh menghindari kepadatan tol.`,
            location: originName,
            type: 'pickup'
          },
          {
            time: '06:00 - 11:30 WIB',
            title: 'Perjalanan Lintas Tol Trans-Jawa & Sarapan di Rest Area',
            description: 'Melintasi Tol Cipali - Semarang - Solo dengan 1x istirahat sarapan dan toilet di Rest Area Tol.',
            location: 'Tol Trans-Jawa',
            type: 'transport'
          },
          {
            time: '12:00 - 13:30 WIB',
            title: 'Selamat Datang di Jogja! Santap Siang Kuliner Khas Gudeg / Resto Lokal',
            description: 'Tiba di Kota Gudeg. Menikmati hidangan makan siang autentik khas Yogyakarta di restoran mitra legendaris.',
            location: 'Restoran Khas Yogyakarta',
            type: 'meal'
          },
          {
            time: '14:00 - 15:30 WIB',
            title: 'Check-in Hotel di Yogyakarta & Istirahat Menyegarkan Diri',
            description: 'Proses check-in kamar hotel mitra, pembagian kunci dan istirahat sejenak setelah perjalanan darat.',
            location: 'Hotel Mitra Yogyakarta',
            type: 'hotel_checkin'
          }
        ],
        returnTransitSteps: [
          {
            time: '13:30 - 20:30 WIB',
            title: `Perjalanan Tol Trans-Jawa Kembali Menuju ${originName}`,
            description: `Melintasi Tol Solo-Semarang-Cipali dengan istirahat makan malam di Rest Area.`,
            location: 'Tol Trans-Jawa',
            type: 'transport'
          },
          {
            time: 'Est. 21:00 WIB',
            title: `Tiba Kembali di ${originName} dengan Selamat (Drop-off)`,
            description: `Pengantaran kembali ke titik kumpul ${originName}. Tour selesai!`,
            location: originName,
            type: 'dropoff'
          }
        ]
      };
    }

    // From East Java (Surabaya / Malang) to Jogja (~320 km, 4.5 - 5.5 hours)
    if (clean.includes('surabaya') || clean.includes('sidoarjo') || clean.includes('malang')) {
      const originName = clean.includes('malang') ? 'Malang' : 'Surabaya';
      return {
        isIntercity: true,
        pickupCityClean: originName,
        destinationCityClean: 'Yogyakarta',
        destinationRegion: destination,
        distanceKm: 320,
        estimatedTravelHours: 5,
        routeHighlights: 'Tol Trans-Jawa Kertosono - Ngawi - Solo - Yogyakarta',
        departureNotice: `Penjemputan pagi pukul 06:00 WIB di ${originName} via Tol Trans-Jawa, tiba di Yogyakarta pukul 11:30 WIB siap santap siang dan check-in.`,
        isOvernightJourney: false,
        day1DepartureTime: '06:00 WIB',
        day1ArrivalTime: '11:30 WIB',
        day1TransitSteps: [
          {
            time: '06:00 - 07:00 WIB',
            title: `Penjemputan Pagi di ${originName} & Memulai Perjalanan`,
            description: `Penjemputan tamu di ${originName} dan mulai perjalanan via Tol Trans-Jawa.`,
            location: originName,
            type: 'pickup'
          },
          {
            time: '07:30 - 11:00 WIB',
            title: 'Perjalanan Tol Trans-Jawa Menuju Yogyakarta',
            description: 'Perjalanan lancar via Tol Kertosono-Ngawi-Solo dengan istirahat sejenak di Rest Area.',
            location: 'Tol Trans-Jawa',
            type: 'transport'
          },
          {
            time: '11:30 - 13:00 WIB',
            title: 'Tiba di Yogyakarta! Makan Siang Kuliner Resto Lokal',
            description: 'Makan siang penyambutan kuliner khas Yogyakarta.',
            location: 'Yogyakarta',
            type: 'meal'
          }
        ],
        returnTransitSteps: [
          {
            time: '14:00 - 19:00 WIB',
            title: `Perjalanan Tol Trans-Jawa Kembali Menuju ${originName} (Drop-off)`,
            description: `Perjalanan pulang via tol dan tiba kembali di ${originName} dengan selamat.`,
            location: originName,
            type: 'dropoff'
          }
        ]
      };
    }

    // From Solo / Semarang to Jogja (Short Intercity: 1 - 2.5 hours)
    const isSolo = clean.includes('solo') || clean.includes('surakarta');
    const originName = isSolo ? 'Solo' : 'Semarang';
    return {
      isIntercity: true,
      pickupCityClean: originName,
      destinationCityClean: 'Yogyakarta',
      destinationRegion: destination,
      distanceKm: isSolo ? 65 : 120,
      estimatedTravelHours: isSolo ? 1.5 : 2.5,
      routeHighlights: isSolo ? 'Jalur Solo - Klaten - Yogyakarta' : 'Tol Semarang - Bawen - Secang - Yogyakarta',
      departureNotice: `Penjemputan pagi pukul 07:00 WIB di ${originName}, tiba di Yogyakarta pukul 08:30 - 09:30 WIB untuk langsung memulai wisata pagi!`,
      isOvernightJourney: false,
      day1DepartureTime: '07:00 WIB',
      day1ArrivalTime: '08:45 WIB',
      day1TransitSteps: [
        {
          time: '07:00 - 07:30 WIB',
          title: `Penjemputan di ${originName} & Persiapan Menuju Jogja`,
          description: `Penyambutan peserta di ${originName} dan langsung berangkat ke Yogyakarta.`,
          location: originName,
          type: 'pickup'
        },
        {
          time: '07:30 - 09:00 WIB',
          title: 'Perjalanan Menuju Yogyakarta & Ketibaan di Kota Pelajar',
          description: 'Perjalanan nyaman dengan armada AC menuju destinasi pertama di Yogyakarta.',
          location: 'Jalur Menuju Yogyakarta',
          type: 'transport'
        }
      ],
      returnTransitSteps: [
        {
          time: '16:00 - 18:00 WIB',
          title: `Pengantaran Kembali ke ${originName} (Drop-off)`,
          description: `Perjalanan pulang dan pengantaran kembali ke alamat di ${originName}.`,
          location: originName,
          type: 'dropoff'
        }
      ]
    };
  }

  // 3. DESTINATION: MALANG & BROMO
  if (isLocalToMalang) {
    return {
      isIntercity: false,
      pickupCityClean: pCity || 'Malang / Batu',
      destinationCityClean: destName,
      destinationRegion: destination,
      distanceKm: 20,
      estimatedTravelHours: 0.5,
      routeHighlights: 'Penjemputan Lokal Area Malang & Kota Batu',
      departureNotice: 'Penjemputan lokal di Bandara Abdulrachman Saleh, Stasiun Malang Kota Baru atau hotel di Malang/Batu.',
      isOvernightJourney: false,
      day1DepartureTime: '08:00 WIB',
      day1ArrivalTime: '08:30 WIB',
      day1TransitSteps: [],
      returnTransitSteps: []
    };
  }

  // From Surabaya to Malang (~90 km, 1.5 - 2 hours)
  if (clean.includes('surabaya') || clean.includes('sidoarjo')) {
    return {
      isIntercity: true,
      pickupCityClean: 'Surabaya / Sidoarjo',
      destinationCityClean: 'Malang & Bromo',
      destinationRegion: destination,
      distanceKm: 90,
      estimatedTravelHours: 2,
      routeHighlights: 'Tol Surabaya - Gempol - Pandaan - Malang',
      departureNotice: 'Penjemputan pagi pukul 07:00 WIB di Surabaya via Tol Pandaan-Malang, tiba di Malang pukul 09:00 WIB.',
      isOvernightJourney: false,
      day1DepartureTime: '07:00 WIB',
      day1ArrivalTime: '09:00 WIB',
      day1TransitSteps: [
        {
          time: '07:00 - 07:30 WIB',
          title: 'Penjemputan di Surabaya & Pemuatan Bagasi',
          description: 'Penyambutan tamu di Surabaya dan mulai perjalanan menuju kota apel Malang.',
          location: 'Surabaya',
          type: 'pickup'
        },
        {
          time: '07:30 - 09:00 WIB',
          title: 'Perjalanan Tol Pandaan Menuju Malang',
          description: 'Melintasi tol dengan pemandangan Gunung Arjuno-Welirang yang sejuk.',
          location: 'Tol Pandaan-Malang',
          type: 'transport'
        }
      ],
      returnTransitSteps: [
        {
          time: '15:30 - 17:30 WIB',
          title: 'Perjalanan Tol Kembali Menuju Surabaya (Drop-off)',
          description: 'Pengantaran kembali ke Bandara Juanda / Stasiun / Alamat Surabaya.',
          location: 'Surabaya',
          type: 'dropoff'
        }
      ]
    };
  }

  // From Jogja / Central Java to Malang (~350 km, 5.5 hours)
  if (clean.includes('jogja') || clean.includes('yogyakarta') || clean.includes('solo') || clean.includes('semarang')) {
    const originName = clean.includes('jogja') || clean.includes('yogyakarta') ? 'Yogyakarta' : 'Solo / Semarang';
    return {
      isIntercity: true,
      pickupCityClean: originName,
      destinationCityClean: 'Malang & Bromo',
      destinationRegion: destination,
      distanceKm: 350,
      estimatedTravelHours: 5.5,
      routeHighlights: 'Tol Trans-Jawa Solo - Ngawi - Kertosono - Pandaan - Malang',
      departureNotice: `Penjemputan subuh pukul 05:00 WIB di ${originName} via Tol Trans-Jawa, tiba di Malang pukul 10:30 WIB siap menikmati kuliner dan wisata Bromo/Batu.`,
      isOvernightJourney: false,
      day1DepartureTime: '05:00 WIB',
      day1ArrivalTime: '10:30 WIB',
      day1TransitSteps: [
        {
          time: '05:00 - 05:45 WIB',
          title: `Penjemputan di ${originName} & Masuk Tol Trans-Jawa`,
          description: `Penyambutan rombongan di ${originName} dan mulai perjalanan subuh.`,
          location: originName,
          type: 'pickup'
        },
        {
          time: '06:00 - 10:30 WIB',
          title: 'Perjalanan Tol Trans-Jawa Menuju Malang & Rest Area',
          description: 'Melintasi tol Jawa Timur dengan istirahat sarapan di Rest Area Tol.',
          location: 'Tol Trans-Jawa',
          type: 'transport'
        },
        {
          time: '11:00 - 12:30 WIB',
          title: 'Tiba di Malang! Makan Siang Bakso Malang & Kuliner Khas',
          description: 'Santap siang kuliner khas Malang yang hangat dan lezat.',
          location: 'Malang',
          type: 'meal'
        }
      ],
      returnTransitSteps: [
        {
          time: '13:30 - 19:30 WIB',
          title: `Perjalanan Tol Trans-Jawa Menuju ${originName} & Drop-off Selamat`,
          description: `Pengantaran kembali ke ${originName}. Tour Malang selesai!`,
          location: originName,
          type: 'dropoff'
        }
      ]
    };
  }

  // Default: Long distance to Malang (e.g. from Jakarta ~850 km, 12 hours)
  return {
    isIntercity: true,
    pickupCityClean: pCity || 'Luar Kota Malang',
    destinationCityClean: 'Malang & Bromo',
    destinationRegion: destination,
    distanceKm: 850,
    estimatedTravelHours: 12,
    routeHighlights: 'Tol Trans-Jawa Penuh Menuju Jawa Timur',
    departureNotice: `Penjemputan malam H-1 pukul 19:30 WIB di ${pCity} via Tol Trans-Jawa, tiba di Malang pagi hari pukul 07:30 WIB siap sarapan dan tour Bromo/Batu.`,
    isOvernightJourney: true,
    day1DepartureTime: '19:30 WIB (H-1 Malam)',
    day1ArrivalTime: '07:30 WIB (Hari 1 Pagi)',
    day1TransitSteps: [
      {
        time: '19:30 - 20:30 WIB',
        title: `Penjemputan di ${pCity} & Memulai Perjalanan Malam`,
        description: `Penyambutan tamu di titik jemput ${pCity} dan mulai melintasi Tol Trans-Jawa.`,
        location: pCity,
        type: 'pickup'
      },
      {
        time: '21:00 - 06:30 WIB',
        title: 'Perjalanan Malam Tol Trans-Jawa & Istirahat di Rest Area',
        description: 'Perjalanan malam yang nyaman dengan armada pariwisata ber-AC.',
        location: 'Tol Trans-Jawa',
        type: 'transport'
      },
      {
        time: '07:30 - 09:00 WIB',
        title: 'Tiba di Malang! Sarapan Pagi & Istirahat Segar',
        description: 'Menikmati sarapan pagi dan cuci muka menyegarkan diri di kota Malang yang sejuk.',
        location: 'Malang',
        type: 'meal'
      }
    ],
    returnTransitSteps: [
      {
        time: '13:30 - Besok Dini Hari WIB',
        title: `Perjalanan Tol Trans-Jawa Kembali Menuju ${pCity} (Drop-off)`,
        description: `Perjalanan darat kembali dan pengantaran ke titik drop-off di ${pCity}.`,
        location: pCity,
        type: 'dropoff'
      }
    ]
  };
}

import {
  INITIAL_DESTINATIONS,
  KNOWN_LANDMARK_COORDS
} from '../data/destinationsData';

export interface StopTravelEstimate {
  distanceKm: number;
  travelMinutes: number;
  fromLabel: string;
  toLabel: string;
}

const REGION_CENTER_COORDS: Record<DestinationRegion, { lat: number; lng: number; label: string }> = {
  jogja: { lat: -7.7926, lng: 110.3658, label: 'Kota Yogyakarta' },
  malang: { lat: -7.9772, lng: 112.6338, label: 'Kota Malang' },
  bali: { lat: -8.6705, lng: 115.2126, label: 'Denpasar / Bali' }
};

function haversineDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function normalizeStopName(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/^(kunjungan perdana:|kunjungan destinasi ikonik terakhir:|kunjungan:|eksplorasi|hunting sunset & panorama senja di|hunting panorama sore & sunset di|hunting sunset di|keseruan wisata di|wisata sore & hunting sunset di|eksplorasi suasana malam di|belanja oleh-oleh khas:|penjemputan di|penjemputan peserta di|check-in hotel|proses check-out hotel|check-out hotel)/i, '')
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Resolve approximate lat/lng coordinates for any destination, landmark, hotel, or typed stop title.
 */
export function resolveStopCoordinates(
  stopText: string,
  region: DestinationRegion,
  extraDestinations: DestinationOption[] = []
): { lat: number; lng: number; label: string; isExactMatch: boolean } {
  const raw = (stopText || '').trim();
  const clean = normalizeStopName(raw);
  const rawLower = raw.toLowerCase();

  // 1. Check same-hotel or meal indicators early
  if (
    rawLower.includes('hotel') ||
    rawLower.includes('lobby') ||
    rawLower.includes('packing') ||
    rawLower.includes('check-in') ||
    rawLower.includes('check-out') ||
    rawLower.includes('check out') ||
    rawLower.includes('check in') ||
    rawLower.includes('istirahat malam')
  ) {
    const hotelHub = KNOWN_LANDMARK_COORDS.find(
      (k) => k.region === region && k.keywords.includes('hotel')
    );
    if (hotelHub) {
      return { lat: hotelHub.lat, lng: hotelHub.lng, label: hotelHub.label, isExactMatch: true };
    }
  }

  // 2. Check all known DestinationOption entries (custom + initial 60 curated)
  const pool = [...extraDestinations, ...INITIAL_DESTINATIONS];
  for (const dest of pool) {
    if (typeof dest.lat !== 'number' || typeof dest.lng !== 'number') continue;
    const destLower = dest.name.toLowerCase();
    // Direct inclusion either way or significant first tokens
    if (clean.includes(destLower) || rawLower.includes(destLower) || destLower.includes(clean && clean.length >= 4 ? clean : '___')) {
      return { lat: dest.lat, lng: dest.lng, label: dest.name, isExactMatch: true };
    }
    // Token matching (match >=2 meaningful words or unique signature keyword like "borobudur", "prambanan", "timang")
    const destTokens = destLower
      .replace(/[()&/]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length >= 4 && !['wisata', 'pantai', 'candi', 'taman', 'agro', 'tour', 'bali', 'jogja', 'malang', 'batu'].includes(t));
    if (destTokens.some((tok) => rawLower.includes(tok))) {
      return { lat: dest.lat, lng: dest.lng, label: dest.name, isExactMatch: true };
    }
  }

  // 3. Check KNOWN_LANDMARK_COORDS (airports, stations, districts, outbound zones, oleh-oleh)
  const regionLandmarks = KNOWN_LANDMARK_COORDS.filter((k) => k.region === region);
  for (const lm of regionLandmarks) {
    if (lm.keywords.some((kw) => rawLower.includes(kw))) {
      return { lat: lm.lat, lng: lm.lng, label: lm.label, isExactMatch: true };
    }
  }
  for (const lm of KNOWN_LANDMARK_COORDS) {
    if (lm.keywords.some((kw) => rawLower.includes(kw))) {
      return { lat: lm.lat, lng: lm.lng, label: lm.label, isExactMatch: true };
    }
  }

  // 4. Meal restaurants usually located between/near tourist corridors
  if (rawLower.includes('makan') || rawLower.includes('resto') || rawLower.includes('kuliner') || rawLower.includes('sarapan')) {
    const center = REGION_CENTER_COORDS[region];
    return { lat: center.lat + 0.015, lng: center.lng + 0.015, label: `Resto Lokal ${center.label}`, isExactMatch: false };
  }

  // 5. Fallback for custom typed stop names -> derive consistent offset within region
  const center = REGION_CENTER_COORDS[region];
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) % 1000;
  }
  const latOffset = ((hash % 40) - 20) * 0.004;
  const lngOffset = (((Math.floor(hash / 40)) % 40) - 20) * 0.004;
  return {
    lat: center.lat + latOffset,
    lng: center.lng + lngOffset,
    label: raw || center.label,
    isExactMatch: false
  };
}

/**
 * Estimate driving distance (km) and travel duration (minutes) between two stops.
 */
export function estimateTravelBetweenStops(
  fromText: string,
  toText: string,
  region: DestinationRegion,
  extraDestinations: DestinationOption[] = []
): StopTravelEstimate {
  const fromClean = (fromText || '').trim();
  const toClean = (toText || '').trim();

  if (!fromClean || !toClean) {
    return { distanceKm: 0, travelMinutes: 0, fromLabel: fromClean, toLabel: toClean };
  }

  const fLow = fromClean.toLowerCase();
  const tLow = toClean.toLowerCase();

  // Same place checks (e.g. breakfast at hotel -> lobby pickup at hotel, or breakfast -> check-out at hotel)
  const bothHotel =
    (fLow.includes('hotel') || fLow.includes('sarapan') || fLow.includes('penginapan')) &&
    (tLow.includes('hotel') || tLow.includes('lobby') || tLow.includes('check-out') || tLow.includes('check out') || tLow.includes('istirahat'));
  if (bothHotel || normalizeStopName(fromClean) === normalizeStopName(toClean)) {
    return { distanceKm: 0, travelMinutes: 0, fromLabel: fromClean, toLabel: toClean };
  }

  const coordFrom = resolveStopCoordinates(fromClean, region, extraDestinations);
  const coordTo = resolveStopCoordinates(toClean, region, extraDestinations);

  const straightKm = haversineDistanceKm(coordFrom.lat, coordFrom.lng, coordTo.lat, coordTo.lng);

  if (straightKm < 0.8) {
    return { distanceKm: 1, travelMinutes: 5, fromLabel: coordFrom.label, toLabel: coordTo.label };
  }

  // Sea crossing special case for Nusa Penida
  const involvesNusaPenida =
    fLow.includes('penida') || tLow.includes('penida') || fLow.includes('kelingking') || tLow.includes('kelingking');
  const roadMultiplier = involvesNusaPenida ? 1.4 : straightKm > 80 ? 1.25 : 1.35;
  const roadKm = Math.max(2, Math.round(straightKm * roadMultiplier));

  // Speed calculation (accounting for Bali/mountain/city traffic vs intercity highways)
  let avgSpeedKmh = 36;
  if (involvesNusaPenida) {
    avgSpeedKmh = 28; // harbour boarding + fastboat + island road
  } else if (roadKm > 150) {
    avgSpeedKmh = 65; // Tol Trans-Jawa / highway
  } else if (roadKm > 45) {
    avgSpeedKmh = 42; // regional scenic road
  } else if (region === 'bali') {
    avgSpeedKmh = 28; // dense Bali tourist corridors
  } else if (region === 'malang' && (tLow.includes('bromo') || fLow.includes('bromo'))) {
    avgSpeedKmh = 30; // mountain winding roads
  }

  const rawMinutes = Math.round((roadKm / avgSpeedKmh) * 60);
  const travelMinutes = Math.max(10, Math.round(rawMinutes / 5) * 5);

  return {
    distanceKm: roadKm,
    travelMinutes,
    fromLabel: coordFrom.label,
    toLabel: coordTo.label
  };
}

function parseTimeRange(timeStr: string): {
  startMin: number;
  endMin: number | null;
  durationMin: number;
  suffix: string;
} | null {
  if (!timeStr) return null;
  const lower = timeStr.toLowerCase();
  if (lower.includes('est.') || lower.includes('besok') || lower.includes('h-1')) {
    return null;
  }

  const tzMatch = timeStr.match(/\b(WIB|WITA|WIT)\b/i);
  const suffix = tzMatch ? ` ${tzMatch[1].toUpperCase()}` : '';

  const matches = timeStr.match(/(\d{1,2})[:.](\d{2})/g);
  if (!matches || matches.length === 0) return null;

  const toMin = (hhmm: string) => {
    const [h, m] = hhmm.replace('.', ':').split(':').map(Number);
    if (isNaN(h) || isNaN(m) || h > 23 || m > 59) return null;
    return h * 60 + m;
  };

  const startMin = toMin(matches[0]);
  if (startMin === null) return null;

  if (matches.length >= 2) {
    const endMin = toMin(matches[1]);
    if (endMin !== null) {
      // Handle crossing midnight
      const duration = endMin >= startMin ? endMin - startMin : 24 * 60 - startMin + endMin;
      return { startMin, endMin, durationMin: Math.max(15, duration), suffix };
    }
  }

  return { startMin, endMin: null, durationMin: 60, suffix };
}

function formatMinHHMM(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function roundUpTo5Min(minutes: number): number {
  return Math.ceil(minutes / 5) * 5;
}

function getDefaultDurationForType(type?: ItineraryActivityType): number {
  switch (type) {
    case 'pickup':
      return 45;
    case 'transport':
      return 60;
    case 'outbound':
      return 150;
    case 'sightseeing':
      return 120;
    case 'meal':
      return 60;
    case 'hotel_checkin':
      return 60;
    case 'hotel_checkout':
      return 45;
    case 'shopping':
      return 90;
    case 'dropoff':
      return 60;
    case 'free_time':
    default:
      return 45;
  }
}

/**
 * Recalculates inter-destination distance (km), transit duration (minutes),
 * and optionally shifts activity timestamps logically in chronological order.
 */
export function recalculateTimelineWithDistances(
  timeline: ItineraryTimelineItem[],
  region: DestinationRegion,
  options?: {
    extraDestinations?: DestinationOption[];
    retimeSchedule?: boolean;
  }
): ItineraryTimelineItem[] {
  if (!timeline || timeline.length === 0) return [];
  const extraDests = options?.extraDestinations || [];
  const shouldRetime = options?.retimeSchedule !== false;

  const result: ItineraryTimelineItem[] = [];
  let cursorEndMin: number | null = null;

  for (let i = 0; i < timeline.length; i++) {
    const item = timeline[i];
    const prev = i > 0 ? result[i - 1] : null;
    const isFixedTransitStep =
      item.id.includes('-transit-') ||
      item.id.includes('-return-') ||
      item.type === 'transport';

    const currStopStr = (item.location || item.title || '').trim();
    const prevStopStr = prev ? (prev.location || prev.title || '').trim() : '';

    let distanceKm = item.distanceKm;
    let travelMinutes = item.travelMinutes;
    let routeFrom = item.routeFrom;

    if (prev && !isFixedTransitStep) {
      const est = estimateTravelBetweenStops(prevStopStr, currStopStr, region, extraDests);
      distanceKm = est.distanceKm;
      travelMinutes = est.travelMinutes;
      routeFrom = prevStopStr;
    } else if (i === 0) {
      distanceKm = 0;
      travelMinutes = 0;
      routeFrom = undefined;
    }

    let nextTime = item.time;
    const parsed = parseTimeRange(item.time);

    if (shouldRetime && parsed) {
      const activityDuration =
        parsed.endMin !== null ? parsed.durationMin : getDefaultDurationForType(item.type);

      if (i === 0 || isFixedTransitStep || cursorEndMin === null) {
        cursorEndMin = parsed.endMin !== null ? parsed.endMin : parsed.startMin;
      } else {
        // Compute logical start based on previous end + travel time
        const transit = typeof travelMinutes === 'number' ? travelMinutes : 15;
        let nextStart = roundUpTo5Min(cursorEndMin + transit);

        // Reasonable floor for lunch (don't put lunch before 11:30 unless already earlier) and dinner (not before 17:45)
        const lowTitle = (item.title || '').toLowerCase();
        if (item.type === 'meal' && lowTitle.includes('siang') && nextStart < 11 * 60 + 30) {
          nextStart = Math.max(nextStart, 11 * 60 + 45);
        }
        if (item.type === 'meal' && (lowTitle.includes('malam') || lowTitle.includes('dinner')) && nextStart < 17 * 60 + 45) {
          nextStart = Math.max(nextStart, 18 * 60);
        }

        // Preserve single timestamp for final return/rest or keep range
        const isFinalRest = item.type === 'free_time' && parsed.endMin === null && i === timeline.length - 1;
        if (isFinalRest) {
          nextTime = `${formatMinHHMM(nextStart)}${parsed.suffix}`;
          cursorEndMin = nextStart;
        } else {
          const nextEnd = nextStart + activityDuration;
          nextTime = `${formatMinHHMM(nextStart)} - ${formatMinHHMM(nextEnd)}${parsed.suffix}`;
          cursorEndMin = nextEnd;
        }
      }
    } else if (parsed) {
      cursorEndMin = parsed.endMin !== null ? parsed.endMin : parsed.startMin;
    }

    result.push({
      ...item,
      time: nextTime,
      distanceKm,
      travelMinutes,
      routeFrom
    });
  }

  return result;
}

/**
 * Checks whether a package or trip qualifies as a Gathering package.
 */
export function hasGatheringKeyword(
  title?: string,
  category?: string,
  notes?: string
): boolean {
  if (category === 'family_gathering' || category === 'company_gathering') {
    return true;
  }
  const combined = `${title || ''} ${notes || ''}`.toLowerCase();
  return combined.includes('gathering');
}

/**
 * Converts legacy activities array (without timeline items) to structured ItineraryTimelineItem[]
 */
export function convertActivitiesToTimeline(
  activities: string[],
  dayNum: number
): ItineraryTimelineItem[] {
  return (activities || []).map((act, i) => {
    const timeMatch = act.match(/^(\d{1,2}[:.]\d{2}\s*-\s*\d{1,2}[:.]\d{2}|\d{1,2}[:.]\d{2})/);
    const time = timeMatch
      ? timeMatch[0]
      : i === 0
      ? '08:00 - 09:30'
      : i === 1
      ? '10:00 - 12:00'
      : i === 2
      ? '12:30 - 13:30'
      : i === 3
      ? '14:00 - 16:00'
      : '16:30 - 18:30';
    const cleanTitle = timeMatch
      ? act.replace(timeMatch[0], '').replace(/^(\s*-\s*|\s*:\s*)/, '').trim()
      : act;
    let type: ItineraryActivityType = 'sightseeing';
    const low = act.toLowerCase();
    if (low.includes('outbound') || low.includes('outbond') || low.includes('team building')) type = 'outbound';
    else if (low.includes('jemput') || low.includes('stasiun') || low.includes('bandara')) type = 'pickup';
    else if (low.includes('drop-off') || low.includes('pengantaran')) type = 'dropoff';
    else if (low.includes('makan') || low.includes('sarapan') || low.includes('kuliner')) type = 'meal';
    else if (low.includes('check-in') || low.includes('check in')) type = 'hotel_checkin';
    else if (low.includes('check-out') || low.includes('check out')) type = 'hotel_checkout';
    else if (low.includes('oleh-oleh') || low.includes('belanja')) type = 'shopping';
    else if (low.includes('istirahat') || low.includes('bebas')) type = 'free_time';

    return {
      id: `tl-conv-d${dayNum}-${i}`,
      time,
      title: cleanTitle,
      location: cleanTitle,
      description: 'Aktivitas terencana rombongan.',
      type
    };
  });
}

/**
 * Automatically injects or removes Day 2 Outbound + Fasilitator activity
 * (for "gathering" packages or "outbond + fasilitator" add-on)
 * AND runs real-time distance & logical schedule recalculation across all days.
 */
export function applyOutboundAndDistanceToItinerary(
  days: ItineraryDay[],
  region: DestinationRegion,
  shouldIncludeOutbound: boolean,
  extraDestinations: DestinationOption[] = [],
  retimeSchedule = true
): ItineraryDay[] {
  if (!days || days.length === 0) return [];

  const destLabel =
    region === 'bali' ? 'Bali' : region === 'malang' ? 'Malang & Bromo' : 'Yogyakarta';

  const outboundArea =
    region === 'bali'
      ? 'Area Outbound Alam Ubud / Bedugul Bali'
      : region === 'malang'
      ? 'Area Outbound Pines & Agro Kota Batu Malang'
      : 'Area Outbound Kaliurang / Ledok Sambi Jogja';

  return days.map((dayObj) => {
    const baseTimeline: ItineraryTimelineItem[] =
      dayObj.timeline && dayObj.timeline.length > 0
        ? dayObj.timeline.map((t) => ({ ...t }))
        : dayObj.activities && dayObj.activities.length > 0
        ? convertActivitiesToTimeline(dayObj.activities, dayObj.day)
        : createDefaultDayTimeline(dayObj.day, dayObj.day === days.length, destLabel);

    let updatedTimeline = baseTimeline;
    let updatedTitle = dayObj.title;
    let updatedDescription = dayObj.description;

    if (dayObj.day === 2) {
      const hasOutboundAlready = updatedTimeline.some(
        (item) =>
          item.type === 'outbound' ||
          item.title.toLowerCase().includes('outbound') ||
          item.title.toLowerCase().includes('outbond')
      );

      if (shouldIncludeOutbound && !hasOutboundAlready) {
        const outboundItem: ItineraryTimelineItem = {
          id: 'tl-auto-outbound-d2',
          time: '09:00 - 11:30',
          title: 'Outbound & Team Building + Fasilitator (Fun Games & Ice Breaking)',
          description:
            'Kegiatan outbound interaktif dipandu Game Master & fasilitator profesional: ice breaking, team synergy games, sound system portable, dan peralatan lengkap.',
          location: outboundArea,
          type: 'outbound',
          notes: 'Termasuk Outbound + Fasilitator, Game Master & peralatan games'
        };

        // Insert right after Sarapan / Lobby pickup / Check-out (before lunch or morning sightseeing)
        let insertIdx = updatedTimeline.findIndex(
          (it) =>
            it.type !== 'meal' &&
            it.type !== 'pickup' &&
            it.type !== 'hotel_checkout'
        );
        if (insertIdx === -1) {
          insertIdx = Math.min(2, updatedTimeline.length);
        }

        updatedTimeline = [
          ...updatedTimeline.slice(0, insertIdx),
          outboundItem,
          ...updatedTimeline.slice(insertIdx)
        ];

        if (updatedTitle && !updatedTitle.toLowerCase().includes('outbound') && !updatedTitle.toLowerCase().includes('outbond')) {
          updatedTitle = `${updatedTitle} & Outbound Seru`;
        }
        if (updatedDescription && !updatedDescription.toLowerCase().includes('outbound')) {
          updatedDescription = `${updatedDescription} Termasuk sesi Outbound & Team Building bersama Fasilitator.`;
        }
      } else if (!shouldIncludeOutbound) {
        // Remove auto-injected outbound item if user toggled off
        updatedTimeline = updatedTimeline.filter((it) => it.id !== 'tl-auto-outbound-d2');
        if (updatedTitle) {
          updatedTitle = updatedTitle.replace(/\s*&\s*Outbound Seru/i, '');
        }
      }
    }

    const calculatedTimeline = recalculateTimelineWithDistances(updatedTimeline, region, {
      extraDestinations,
      retimeSchedule
    });

    return {
      ...dayObj,
      title: updatedTitle,
      description: updatedDescription,
      timeline: calculatedTimeline,
      activities: calculatedTimeline.map((t) => `${t.time} - ${t.title}`)
    };
  });
}

export function summarizeItineraryMetrics(days: ItineraryDay[]): {
  totalDistanceKm: number;
  totalTransitMinutes: number;
  hasDay2Outbound: boolean;
} {
  let totalDistanceKm = 0;
  let totalTransitMinutes = 0;
  let hasDay2Outbound = false;

  for (const d of days) {
    if (d.day === 2 && d.timeline) {
      if (
        d.timeline.some(
          (it) =>
            it.type === 'outbound' ||
            it.title.toLowerCase().includes('outbound') ||
            it.title.toLowerCase().includes('outbond')
        )
      ) {
        hasDay2Outbound = true;
      }
    }
    for (const item of d.timeline || []) {
      if (typeof item.distanceKm === 'number' && item.distanceKm > 0) {
        totalDistanceKm += item.distanceKm;
      }
      if (typeof item.travelMinutes === 'number' && item.travelMinutes > 0) {
        totalTransitMinutes += item.travelMinutes;
      }
    }
  }

  return { totalDistanceKm, totalTransitMinutes, hasDay2Outbound };
}

export interface GenerateCustomItineraryParams {
  destination: DestinationRegion;
  destinationLabel: string;
  durationDays: number;
  selectedDestinations: DestinationOption[];
  hotelTier: string;
  hotelTitle: string;
  pickupCity: string;
  bonusItems?: string[];
  breakfastCount: number;
  lunchCount: number;
  dinnerCount: number;
  hasOutbound?: boolean;
  isGathering?: boolean;
  allDestinations?: DestinationOption[];
}

/**
 * Generate logical, chronological Day-by-Day timeline for Custom Trip Calculator orders.
 * Calculates intercity travel times, inter-destination distance/time, and auto-injects
 * Day 2 Outbound + Fasilitator when selected or when package contains "gathering".
 */
export function generateCustomTripItinerary(params: GenerateCustomItineraryParams): ItineraryDay[] {
  const {
    destination,
    destinationLabel,
    durationDays,
    selectedDestinations,
    hotelTier,
    hotelTitle,
    pickupCity,
    bonusItems = [],
    breakfastCount,
    lunchCount,
    dinnerCount,
    hasOutbound = false,
    isGathering = false,
    allDestinations = []
  } = params;

  const totalDays = Math.max(2, Math.min(7, durationDays));
  const destPool = [...selectedDestinations];

  // Calculate intercity routing information
  const intercity = getIntercityTravelInfo(pickupCity, destination);

  // Distribute tourist spots across days evenly
  const perDayDestCount = Math.max(1, Math.ceil(destPool.length / totalDays));
  const daysDestinations: DestinationOption[][] = [];

  for (let d = 0; d < totalDays; d++) {
    const chunk = destPool.splice(0, perDayDestCount);
    daysDestinations.push(chunk);
  }
  let dayIdx = 0;
  while (destPool.length > 0) {
    const extra = destPool.shift();
    if (extra && daysDestinations[dayIdx]) {
      daysDestinations[dayIdx].push(extra);
    }
    dayIdx = (dayIdx + 1) % totalDays;
  }

  const hasHotel = hotelTier !== 'none';
  const effectiveHotelName = hasHotel ? hotelTitle : 'Akomodasi Pilihan Tamu';

  const itineraryDays: ItineraryDay[] = [];

  for (let day = 1; day <= totalDays; day++) {
    const isFirstDay = day === 1;
    const isLastDay = day === totalDays;
    const currentDests = daysDestinations[day - 1] || [];
    const timeline: ItineraryTimelineItem[] = [];

    if (isFirstDay) {
      if (intercity.isIntercity) {
        intercity.day1TransitSteps.forEach((step, sIdx) => {
          timeline.push({
            id: `tl-d1-transit-${sIdx + 1}`,
            time: step.time,
            title: step.title,
            description: step.description,
            location: step.location,
            type: step.type,
            notes: step.notes
          });
        });

        if (intercity.isOvernightJourney || intercity.estimatedTravelHours <= 3) {
          if (currentDests.length > 0) {
            const d1 = currentDests[0];
            timeline.push({
              id: `tl-d1-dest-1`,
              time: '09:30 - 11:30',
              title: `Kunjungan Perdana: ${d1.name}`,
              description: `Eksplorasi destinasi ${d1.category || 'wisata unggulan'} di ${destinationLabel}. ${d1.highlight || 'Spot foto favorit dan panorama terbaik.'}`,
              location: d1.name,
              type: 'sightseeing',
              notes: 'Tiket masuk destinasi tercover'
            });
          }

          timeline.push({
            id: `tl-d1-lunch`,
            time: '12:00 - 13:00',
            title: `Makan Siang Resto Lokal Autentik ${destinationLabel}`,
            description: lunchCount > 0
              ? `Menikmati hidangan makan siang kuliner khas ${destinationLabel} di restoran mitra terverifikasi.`
              : `Istirahat santap makan siang di kawasan kuliner populer rekomendasi driver.`,
            location: `Resto Khas ${destinationLabel}`,
            type: 'meal',
            notes: lunchCount > 0 ? 'Termasuk kuota makan siang' : 'Makan mandiri'
          });

          if (currentDests.length > 1) {
            const d2 = currentDests[1];
            timeline.push({
              id: `tl-d1-dest-2`,
              time: '13:30 - 15:30',
              title: `Eksplorasi ${d2.name}`,
              description: `Melanjutkan wisata ke ${d2.name}. Menikmati pesona budaya, alam dan wahana rekreasi.`,
              location: d2.name,
              type: 'sightseeing'
            });
          }

          if (hasHotel) {
            timeline.push({
              id: `tl-d1-checkin`,
              time: '16:00 - 17:00',
              title: `Check-in Hotel (${effectiveHotelName})`,
              description: `Proses check-in kamar hotel mitra, pembagian kunci dan istirahat sejenak menyegarkan diri.`,
              location: effectiveHotelName,
              type: 'hotel_checkin',
              notes: 'Kamar hotel AC, air hangat & WiFi'
            });
          }

          if (currentDests.length > 2) {
            const d3 = currentDests[2];
            timeline.push({
              id: `tl-d1-dest-3`,
              time: '17:30 - 19:00',
              title: `Hunting Sunset di ${d3.name}`,
              description: `Menikmati panorama matahari terbenam dan pesona senja nan syahdu.`,
              location: d3.name,
              type: 'sightseeing'
            });
          }

          timeline.push({
            id: `tl-d1-dinner`,
            time: '19:30 - 20:30',
            title: `Makan Malam Kuliner Khas ${destinationLabel}`,
            description: dinnerCount > 0
              ? `Makan malam hangat bersama rombongan dengan menu kuliner tradisional khas daerah.`
              : `Makan malam santai di pusat kuliner malam.`,
            location: `Sentra Kuliner Malam ${destinationLabel}`,
            type: 'meal',
            notes: dinnerCount > 0 ? 'Termasuk kuota makan malam' : 'Makan mandiri'
          });

          timeline.push({
            id: `tl-d1-rest`,
            time: '21:00',
            title: hasHotel ? `Kembali ke Hotel & Istirahat Malam` : `Pengantaran ke Penginapan & Istirahat`,
            description: `Armada mengantar kembali ke hotel untuk memulihkan energi setelah perjalanan panjang.`,
            location: effectiveHotelName,
            type: 'free_time'
          });
        } else {
          if (currentDests.length > 0) {
            const d1 = currentDests[0];
            timeline.push({
              id: `tl-d1-dest-1`,
              time: '15:30 - 17:30',
              title: `Wisata Sore & Hunting Sunset di ${d1.name}`,
              description: `Eksplorasi destinasi pertama ${d1.name}. Berfoto dan menikmati suasana sore yang sejuk.`,
              location: d1.name,
              type: 'sightseeing'
            });
          }

          timeline.push({
            id: `tl-d1-dinner`,
            time: '18:30 - 20:00',
            title: `Makan Malam Kuliner Malam Khas ${destinationLabel}`,
            description: `Santap malam khas di kawasan kuliner legendaris ${destinationLabel}.`,
            location: `Resto Khas ${destinationLabel}`,
            type: 'meal'
          });

          if (currentDests.length > 1) {
            const d2 = currentDests[1];
            timeline.push({
              id: `tl-d1-dest-2`,
              time: '20:00 - 21:30',
              title: `Eksplorasi Suasana Malam di ${d2.name}`,
              description: `Menikmati gemerlap lampu malam dan suasana ikonik kota.`,
              location: d2.name,
              type: 'sightseeing'
            });
          }

          timeline.push({
            id: `tl-d1-rest`,
            time: '22:00',
            title: `Kembali ke Hotel & Istirahat`,
            description: `Kembali ke hotel untuk istirahat malam.`,
            location: effectiveHotelName,
            type: 'free_time'
          });
        }
      } else {
        timeline.push({
          id: `tl-d1-1`,
          time: '08:00 - 09:00',
          title: `Penjemputan di ${pickupCity || 'Titik Kumpul'}`,
          description: `Penyambutan ramah oleh driver & kru berseragam PERGIDIANTAR dengan armada ber-AC bersih. Pemuatan bagasi aman.`,
          location: pickupCity || 'Bandara / Stasiun',
          type: 'pickup',
          notes: 'Driver & armada standby 15 menit sebelumnya'
        });

        if (currentDests.length > 0) {
          const d1 = currentDests[0];
          timeline.push({
            id: `tl-d1-2`,
            time: '09:30 - 11:30',
            title: `Eksplorasi ${d1.name}`,
            description: `Kunjungan destinasi ${d1.category || 'wisata unggulan'} di ${destinationLabel}. ${d1.highlight || 'Spot foto favorit dan panorama terbaik.'}`,
            location: d1.name,
            type: 'sightseeing',
            notes: 'Tiket masuk tercover'
          });
        }

        timeline.push({
          id: `tl-d1-3`,
          time: '12:00 - 13:00',
          title: `Makan Siang Resto Lokal Autentik`,
          description: lunchCount > 0
            ? `Menikmati hidangan makan siang kuliner khas ${destinationLabel} di restoran mitra higienis & lezat.`
            : `Istirahat santap makan siang di kawasan kuliner populer rekomendasi driver.`,
          location: `Restoran Kuliner Khas ${destinationLabel}`,
          type: 'meal',
          notes: lunchCount > 0 ? 'Termasuk kuota makan siang' : 'Makan mandiri'
        });

        if (currentDests.length > 1) {
          const d2 = currentDests[1];
          timeline.push({
            id: `tl-d1-4`,
            time: '13:30 - 15:30',
            title: `Kunjungan ${d2.name}`,
            description: `Melanjutkan perjalanan ke ${d2.name}. Menikmati suasana khas dan fasilitas atraksi wisata.`,
            location: d2.name,
            type: 'sightseeing'
          });
        }

        if (hasHotel) {
          timeline.push({
            id: `tl-d1-5`,
            time: '16:00 - 17:00',
            title: `Check-in Hotel (${effectiveHotelName})`,
            description: `Proses check-in kamar hotel mitra pilihan, pembagian kunci, dan istirahat sejenak menyegarkan diri setelah perjalanan.`,
            location: effectiveHotelName,
            type: 'hotel_checkin',
            notes: 'Akomodasi hotel mitra bersih & nyaman'
          });
        }

        if (currentDests.length > 2) {
          const d3 = currentDests[2];
          timeline.push({
            id: `tl-d1-6`,
            time: '17:30 - 19:00',
            title: `Hunting Sunset & Suasana Senja di ${d3.name}`,
            description: `Menikmati panorama matahari terbenam dan pesona senja nan syahdu.`,
            location: d3.name,
            type: 'sightseeing'
          });
        }

        timeline.push({
          id: `tl-d1-7`,
          time: '19:30 - 20:30',
          title: `Makan Malam Kuliner Malam Khas`,
          description: dinnerCount > 0
            ? `Makan malam hangat bersama rombongan dengan menu kuliner tradisional khas daerah.`
            : `Makan malam santai mandiri di pusat kuliner malam.`,
          location: `Sentra Kuliner Malam ${destinationLabel}`,
          type: 'meal',
          notes: dinnerCount > 0 ? 'Termasuk kuota makan malam' : 'Makan mandiri'
        });

        timeline.push({
          id: `tl-d1-8`,
          time: '21:00',
          title: hasHotel ? `Kembali ke Hotel & Istirahat Malam` : `Pengantaran ke Penginapan & Istirahat`,
          description: `Armada mengantar kembali ke hotel untuk beristirahat memulihkan energi untuk petualangan esok hari.`,
          location: effectiveHotelName,
          type: 'free_time'
        });
      }
    } else if (!isLastDay) {
      timeline.push({
        id: `tl-d${day}-1`,
        time: '07:00 - 08:30',
        title: hasHotel ? `Sarapan Pagi Buffet di Hotel` : `Sarapan Pagi & Persiapan Tour`,
        description: breakfastCount >= day
          ? `Menikmati sajian sarapan pagi lezat untuk bekal energi tur harian.`
          : `Sarapan pagi santai dan persiapan perjalanan.`,
        location: effectiveHotelName,
        type: 'meal',
        notes: breakfastCount >= day ? 'Termasuk kuota sarapan' : 'Makan mandiri'
      });

      timeline.push({
        id: `tl-d${day}-2`,
        time: '08:30 - 09:00',
        title: `Penjemputan di Lobby Hotel`,
        description: `Driver standby tepat waktu di lobby hotel. Briefing singkat rute wisata hari ini.`,
        location: effectiveHotelName,
        type: 'pickup'
      });

      if (currentDests.length > 0) {
        const d1 = currentDests[0];
        timeline.push({
          id: `tl-d${day}-3`,
          time: '09:30 - 11:30',
          title: `Kunjungan ${d1.name}`,
          description: `Eksplorasi spot utama ${d1.name}. Waktu luang berfoto, menikmati wahana, dan keindahan alam.`,
          location: d1.name,
          type: 'sightseeing',
          notes: 'Tiket masuk destinasi tercover'
        });
      }

      timeline.push({
        id: `tl-d${day}-4`,
        time: '12:00 - 13:00',
        title: `Makan Siang Resto Lokal Favorit`,
        description: lunchCount >= day
          ? `Makan siang bersama keluarga/rombongan di restoran lokal dengan view asri.`
          : `Istirahat makan siang santai di restoran sekitar objek wisata.`,
        location: `Resto Lokal ${destinationLabel}`,
        type: 'meal',
        notes: lunchCount >= day ? 'Termasuk kuota makan siang' : 'Makan mandiri'
      });

      if (currentDests.length > 1) {
        const d2 = currentDests[1];
        timeline.push({
          id: `tl-d${day}-5`,
          time: '13:30 - 15:30',
          title: `Keseruan Wisata di ${d2.name}`,
          description: `Aktivitas rekreasi dan kebersamaan di ${d2.name}. Spot foto instagramable.`,
          location: d2.name,
          type: 'sightseeing'
        });
      }

      if (currentDests.length > 2) {
        const d3 = currentDests[2];
        timeline.push({
          id: `tl-d${day}-6`,
          time: '16:00 - 18:00',
          title: `Hunting Panorama Sore & Sunset di ${d3.name}`,
          description: `Menikmati pemandangan sore hari yang eksotis dan sejuk di ${d3.name}.`,
          location: d3.name,
          type: 'sightseeing'
        });
      }

      timeline.push({
        id: `tl-d${day}-7`,
        time: '18:30 - 20:00',
        title: `Makan Malam Santap Kuliner Nusantara`,
        description: dinnerCount >= day
          ? `Menikmati hidangan makan malam lezat bersama seluruh anggota tour.`
          : `Makan malam mandiri di sentra kuliner kota.`,
        location: `Restoran Kuliner Malam ${destinationLabel}`,
        type: 'meal',
        notes: dinnerCount >= day ? 'Termasuk kuota makan malam' : 'Makan mandiri'
      });

      timeline.push({
        id: `tl-d${day}-8`,
        time: '20:30',
        title: `Kembali ke Hotel & Acara Bebas`,
        description: `Pengantaran kembali ke hotel. Waktu bebas bagi rombongan untuk beristirahat.`,
        location: effectiveHotelName,
        type: 'free_time'
      });
    } else {
      timeline.push({
        id: `tl-d${day}-1`,
        time: '07:00 - 08:30',
        title: hasHotel ? `Sarapan Pagi di Hotel & Persiapan Packing` : `Sarapan Pagi & Packing Barang`,
        description: `Menikmati sarapan terakhir di hotel dan memastikan semua barang bawaan terkemas rapi.`,
        location: effectiveHotelName,
        type: 'meal'
      });

      if (hasHotel) {
        timeline.push({
          id: `tl-d${day}-2`,
          time: '08:30 - 09:30',
          title: `Proses Check-out Hotel & Pemuatan Bagasi`,
          description: `Penyelesaian administrasi hotel, kunci kamar diserahkan ke resepsionis, dan koper dimuat ke armada.`,
          location: effectiveHotelName,
          type: 'hotel_checkout',
          notes: 'Pemeriksaan barang bawaan agar tidak tertinggal'
        });
      }

      const bonusText = bonusItems.length > 0 ? bonusItems.join(' & ') : 'Pusat Oleh-Oleh Khas & Cenderamata';
      timeline.push({
        id: `tl-d${day}-3`,
        time: '10:00 - 11:30',
        title: `Belanja Oleh-Oleh Khas: ${bonusText}`,
        description: `Membeli buah tangan khas (${bonusText}), kaos, kerajinan lokal, dan cinderamata untuk keluarga di rumah.`,
        location: `Sentra Oleh-Oleh Khas ${destinationLabel}`,
        type: 'shopping',
        notes: 'Termasuk bonus kunjungan oleh-oleh'
      });

      if (currentDests.length > 0) {
        const d1 = currentDests[0];
        timeline.push({
          id: `tl-d${day}-4`,
          time: '11:30 - 12:30',
          title: `Kunjungan Destinasi Ikonik Terakhir: ${d1.name}`,
          description: `Kunjungan wisata penutup dan sesi foto bersama sebelum kepulangan.`,
          location: d1.name,
          type: 'sightseeing'
        });
      }

      timeline.push({
        id: `tl-d${day}-5`,
        time: '12:30 - 13:30',
        title: `Makan Siang Perpisahan Khas ${destinationLabel}`,
        description: `Santap siang kuliner khas legendaris sebagai penutup manis perjalanan wisata.`,
        location: `Restoran Khas ${destinationLabel}`,
        type: 'meal'
      });

      if (intercity.isIntercity) {
        intercity.returnTransitSteps.forEach((rStep, rIdx) => {
          timeline.push({
            id: `tl-d${day}-return-${rIdx + 1}`,
            time: rStep.time,
            title: rStep.title,
            description: rStep.description,
            location: rStep.location,
            type: rStep.type,
            notes: rStep.notes
          });
        });
      } else {
        timeline.push({
          id: `tl-d${day}-dropoff`,
          time: '15:30 - 17:00',
          title: `Pengantaran Kembali (Drop-off) ke Bandara / Stasiun`,
          description: `Pengantaran aman tepat waktu menuju Bandara / Stasiun / Titik Kepulangan di ${destinationLabel}. Tour selesai dengan kenangan berkesan bersama PERGIDIANTAR!`,
          location: `Bandara / Stasiun / Titik Drop-off ${destinationLabel}`,
          type: 'dropoff',
          notes: 'Driver memastikan seluruh barang bawaan turun lengkap'
        });
      }
    }

    let dayTitle = `Hari ${day}: Aktivitas Wisata & Eksplorasi ${destinationLabel}`;
    let dayDesc = `Eksplorasi destinasi favorit, santap kuliner lezat, dan panorama senja.`;

    if (isFirstDay) {
      if (intercity.isIntercity) {
        dayTitle = `Hari 1: Penjemputan di ${intercity.pickupCityClean}, Perjalanan Lintas ${intercity.distanceKm} km & Eksplorasi ${destinationLabel}`;
        dayDesc = intercity.departureNotice;
      } else {
        dayTitle = `Hari 1: Penjemputan di ${pickupCity}, Wisata Ikonik & Check-in Hotel`;
        dayDesc = `Penyambutan ramah di ${pickupCity}, wisata pembuka, dan check-in hotel.`;
      }
    } else if (isLastDay) {
      if (intercity.isIntercity) {
        dayTitle = `Hari ${totalDays}: Check-out Hotel, Belanja Oleh-Oleh & Perjalanan Pulang Menuju ${intercity.pickupCityClean}`;
        dayDesc = `Belanja cenderamata khas, makan siang perpisahan, dan perjalanan darat lintas kota kembali ke ${intercity.pickupCityClean}.`;
      } else {
        dayTitle = `Hari ${totalDays}: Check-out Hotel, Oleh-Oleh Khas & Pengantaran Bandara/Stasiun`;
        dayDesc = `Check-out hotel, belanja oleh-oleh khas, dan pengantaran pulang ke bandara/stasiun.`;
      }
    } else {
      const midTitles: Record<number, string> = {
        2: totalDays === 2 ? `Hari 2: Wisata Alam & Kepulangan` : `Hari 2: Eksplorasi Alam & Panorama Memukau`,
        3: totalDays === 3 ? `Hari 3: Wisata Budaya & Kepulangan` : `Hari 3: Wisata Budaya & Petualangan Seru`,
        4: totalDays === 4 ? `Hari 4: Sentra Cenderamata & Kepulangan` : `Hari 4: Wisata Bahari & Relaksasi Keluarga`,
        5: totalDays === 5 ? `Hari 5: Belanja Buah Tangan & Kepulangan` : `Hari 5: Eksotisme Panorama & Kuliner Legendaris`,
        6: totalDays === 6 ? `Hari 6: Destinasi Favorit & Kepulangan` : `Hari 6: Petualangan Lanjutan & Wisata Edukasi`
      };
      dayTitle = midTitles[day] || `Hari ${day}: Eksplorasi Wisata ${destinationLabel}`;
    }

    itineraryDays.push({
      day,
      title: dayTitle,
      description: dayDesc,
      activities: timeline.map((t) => `${t.time} - ${t.title}`),
      timeline
    });
  }

  return applyOutboundAndDistanceToItinerary(
    itineraryDays,
    destination,
    Boolean(hasOutbound || isGathering),
    allDestinations.length > 0 ? allDestinations : selectedDestinations,
    true
  );
}

/**
 * Generate default editable timeline items for Admin Package Management
 * Supports optional origin city and optional gathering/outbound injection.
 */
export function createDefaultDayTimeline(
  dayNumber: number,
  isLastDay: boolean,
  cityLabel: string,
  originCity?: string,
  shouldIncludeOutbound = false
): ItineraryTimelineItem[] {
  const destRegion: DestinationRegion =
    cityLabel.toLowerCase().includes('bali')
      ? 'bali'
      : cityLabel.toLowerCase().includes('malang')
      ? 'malang'
      : 'jogja';

  const intercity = originCity ? getIntercityTravelInfo(originCity, destRegion) : null;
  let items: ItineraryTimelineItem[] = [];

  if (dayNumber === 1) {
    if (intercity && intercity.isIntercity) {
      intercity.day1TransitSteps.forEach((s, idx) => {
        items.push({
          id: `tl-edit-${Date.now()}-transit-${idx + 1}`,
          time: s.time,
          title: s.title,
          description: s.description,
          location: s.location,
          type: s.type,
          notes: s.notes
        });
      });
      items.push(
        {
          id: `tl-edit-${Date.now()}-1`,
          time: '09:30 - 11:30',
          title: `Kunjungan Destinasi Ikonik Perdana ${cityLabel}`,
          description: `Eksplorasi cagar budaya dan spot foto instagramable di ${cityLabel}.`,
          location: destRegion === 'bali' ? 'Tanah Lot Bali' : destRegion === 'malang' ? 'Museum Angkut Batu' : 'Candi Prambanan',
          type: 'sightseeing'
        },
        {
          id: `tl-edit-${Date.now()}-2`,
          time: '12:00 - 13:00',
          title: `Makan Siang Resto Lokal Autentik`,
          description: `Santap siang kuliner khas daerah di restoran mitra.`,
          location: `Resto Lokal ${cityLabel}`,
          type: 'meal'
        },
        {
          id: `tl-edit-${Date.now()}-3`,
          time: '14:30 - 16:00',
          title: `Check-in Hotel Mitra & Istirahat`,
          description: `Pembagian kunci kamar hotel mitra, istirahat sejenak setelah perjalanan lintas kota.`,
          location: `Hotel Mitra ${cityLabel}`,
          type: 'hotel_checkin'
        },
        {
          id: `tl-edit-${Date.now()}-4`,
          time: '17:00 - 18:30',
          title: `Hunting Sunset & Panorama Senja`,
          description: `Menikmati golden hour senja yang memukau.`,
          location: destRegion === 'bali' ? 'Pantai Kuta Bali' : destRegion === 'malang' ? 'Alun-Alun Batu' : 'HeHa Sky View Patuk',
          type: 'sightseeing'
        },
        {
          id: `tl-edit-${Date.now()}-5`,
          time: '19:00 - 20:30',
          title: `Makan Malam Kuliner Malam`,
          description: `Santap malam bersama rombongan di sentra kuliner khas malam hari.`,
          location: `Restoran Kuliner ${cityLabel}`,
          type: 'meal'
        },
        {
          id: `tl-edit-${Date.now()}-6`,
          time: '21:00',
          title: `Kembali ke Hotel & Istirahat`,
          description: `Pengantaran kembali ke hotel untuk istirahat malam.`,
          location: `Hotel Mitra ${cityLabel}`,
          type: 'free_time'
        }
      );
    } else {
      items = [
        {
          id: `tl-edit-${Date.now()}-1`,
          time: '08:00 - 09:30',
          title: `Penjemputan Peserta di Bandara / Stasiun`,
          description: `Penyambutan tamu dengan sign board nama rombongan, armada AC dingin, dan pemuatan koper.`,
          location: destRegion === 'bali' ? 'Bandara Ngurah Rai Bali' : destRegion === 'malang' ? 'Stasiun Malang' : 'Stasiun Tugu Yogyakarta',
          type: 'pickup',
          notes: 'Armada & driver standby'
        },
        {
          id: `tl-edit-${Date.now()}-2`,
          time: '10:00 - 12:00',
          title: `Kunjungan Destinasi Ikonik Pertama`,
          description: `Eksplorasi cagar budaya dan spot foto instagramable di ${cityLabel}.`,
          location: destRegion === 'bali' ? 'Pantai Melasti Bali' : destRegion === 'malang' ? 'Jatim Park 2 Batu' : 'Candi Prambanan',
          type: 'sightseeing',
          notes: 'Tiket masuk tercover'
        },
        {
          id: `tl-edit-${Date.now()}-3`,
          time: '12:30 - 13:30',
          title: `Makan Siang Resto Lokal Autentik`,
          description: `Menikmati hidangan lezat masakan tradisional khas ${cityLabel}.`,
          location: `Resto Khas ${cityLabel}`,
          type: 'meal',
          notes: 'Resto lokal higienis'
        },
        {
          id: `tl-edit-${Date.now()}-4`,
          time: '14:00 - 15:30',
          title: `Check-in Hotel Mitra & Istirahat`,
          description: `Pembagian kunci kamar hotel mitra, istirahat sejenak setelah perjalanan.`,
          location: `Hotel Mitra ${cityLabel}`,
          type: 'hotel_checkin',
          notes: 'Hotel bintang pilihan'
        },
        {
          id: `tl-edit-${Date.now()}-5`,
          time: '16:00 - 18:00',
          title: `Hunting Sunset & Panorama Senja`,
          description: `Menikmati momen golden hour dan pemandangan sore yang memukau.`,
          location: destRegion === 'bali' ? 'Pura Luhur Uluwatu' : destRegion === 'malang' ? 'Alun-Alun Kota Batu' : 'Obelix Hills',
          type: 'sightseeing'
        },
        {
          id: `tl-edit-${Date.now()}-6`,
          time: '18:30 - 20:00',
          title: `Makan Malam Kuliner Malam`,
          description: `Santap malam bersama rombongan di sentra kuliner khas malam hari.`,
          location: `Sentra Kuliner ${cityLabel}`,
          type: 'meal'
        },
        {
          id: `tl-edit-${Date.now()}-7`,
          time: '20:30',
          title: `Kembali ke Hotel & Istirahat`,
          description: `Pengantaran kembali ke hotel untuk istirahat malam.`,
          location: `Hotel Mitra ${cityLabel}`,
          type: 'free_time'
        }
      ];
    }
  } else if (isLastDay) {
    if (intercity && intercity.isIntercity) {
      items = [
        {
          id: `tl-edit-${Date.now()}-1`,
          time: '07:00 - 08:30',
          title: `Sarapan Pagi di Hotel & Packing`,
          description: `Sarapan pagi buffet hotel dan pengemasan koper.`,
          location: `Hotel Mitra ${cityLabel}`,
          type: 'meal'
        },
        {
          id: `tl-edit-${Date.now()}-2`,
          time: '08:30 - 09:30',
          title: `Check-out Hotel & Pemuatan Bagasi`,
          description: `Penyelesaian administrasi hotel dan pemuatan bagasi ke dalam armada.`,
          location: `Hotel Mitra ${cityLabel}`,
          type: 'hotel_checkout'
        },
        {
          id: `tl-edit-${Date.now()}-3`,
          time: '10:00 - 11:30',
          title: `Wisata Belanja Pusat Oleh-Oleh Khas`,
          description: `Membeli cenderamata, kerajinan tangan, dan makanan khas daerah.`,
          location: `Sentra Oleh-Oleh ${cityLabel}`,
          type: 'shopping'
        },
        {
          id: `tl-edit-${Date.now()}-4`,
          time: '12:00 - 13:00',
          title: `Makan Siang Perpisahan`,
          description: `Santap siang kuliner khas penutup sebelum perjalanan pulang.`,
          location: `Resto Lokal ${cityLabel}`,
          type: 'meal'
        }
      ];
      intercity.returnTransitSteps.forEach((s, idx) => {
        items.push({
          id: `tl-edit-${Date.now()}-return-${idx + 1}`,
          time: s.time,
          title: s.title,
          description: s.description,
          location: s.location,
          type: s.type,
          notes: s.notes
        });
      });
    } else {
      items = [
        {
          id: `tl-edit-${Date.now()}-1`,
          time: '07:00 - 08:30',
          title: `Sarapan Pagi di Hotel & Packing`,
          description: `Menikmati sarapan pagi buffet hotel dan pengemasan barang bawaan.`,
          location: `Hotel Mitra ${cityLabel}`,
          type: 'meal'
        },
        {
          id: `tl-edit-${Date.now()}-2`,
          time: '09:00 - 10:00',
          title: `Check-out Hotel & Pemuatan Bagasi`,
          description: `Penyelesaian check-out kamar dan pemuatan koper ke dalam armada.`,
          location: `Hotel Mitra ${cityLabel}`,
          type: 'hotel_checkout',
          notes: 'Pemeriksaan barang bawaan'
        },
        {
          id: `tl-edit-${Date.now()}-3`,
          time: '10:30 - 12:00',
          title: `Wisata Belanja Pusat Oleh-Oleh Khas`,
          description: `Membeli buah tangan, kerajinan lokal, bakpia, dodol, kaos, dan cenderamata khas daerah.`,
          location: `Sentra Oleh-Oleh ${cityLabel}`,
          type: 'shopping',
          notes: 'Bonus kunjungan oleh-oleh'
        },
        {
          id: `tl-edit-${Date.now()}-4`,
          time: '12:30 - 13:30',
          title: `Makan Siang Perpisahan`,
          description: `Makan siang penutup dengan santap kuliner legendaris ${cityLabel}.`,
          location: `Resto Khas ${cityLabel}`,
          type: 'meal'
        },
        {
          id: `tl-edit-${Date.now()}-5`,
          time: '14:00 - 15:30',
          title: `Kunjungan Ikon Kota & Foto Bersama`,
          description: `Sesi dokumentasi foto rombongan di landmark kebanggaan kota.`,
          location: destRegion === 'bali' ? 'Pantai Kuta' : destRegion === 'malang' ? 'Alun-Alun Batu' : 'Malioboro Yogyakarta',
          type: 'sightseeing'
        },
        {
          id: `tl-edit-${Date.now()}-6`,
          time: '16:00 - 17:30',
          title: `Pengantaran ke Bandara / Stasiun (Drop-off)`,
          description: `Pengantaran tepat waktu menuju Bandara / Stasiun. Perjalanan wisata selesai bersama PERGIDIANTAR.`,
          location: destRegion === 'bali' ? 'Bandara Ngurah Rai' : destRegion === 'malang' ? 'Stasiun Malang' : 'Stasiun Tugu Yogyakarta',
          type: 'dropoff',
          notes: 'Drop-off selesai dengan aman'
        }
      ];
    }
  } else {
    items = [
      {
        id: `tl-edit-${Date.now()}-1`,
        time: '07:00 - 08:30',
        title: `Sarapan Pagi Buffet di Hotel`,
        description: `Sarapan pagi lezat di restoran hotel.`,
        location: `Hotel Mitra ${cityLabel}`,
        type: 'meal'
      },
      {
        id: `tl-edit-${Date.now()}-2`,
        time: '08:30 - 09:00',
        title: `Penjemputan di Lobby Hotel`,
        description: `Driver bersiap di lobby hotel untuk penjemputan tur harian.`,
        location: `Hotel Mitra ${cityLabel}`,
        type: 'pickup'
      },
      ...(dayNumber === 2 && shouldIncludeOutbound
        ? [
            {
              id: 'tl-auto-outbound-d2',
              time: '09:00 - 11:30',
              title: 'Outbound & Team Building + Fasilitator (Fun Games & Ice Breaking)',
              description:
                'Sesi outbound seru bersama Game Master & fasilitator profesional: ice breaking, team synergy games, sound system portable, dan perlengkapan lengkap.',
              location:
                destRegion === 'bali'
                  ? 'Area Outbound Ubud Bali'
                  : destRegion === 'malang'
                  ? 'Area Outbound Kota Batu Malang'
                  : 'Area Outbound Kaliurang / Ledok Sambi Jogja',
              type: 'outbound' as ItineraryActivityType,
              notes: 'Termasuk Outbound + Fasilitator'
            }
          ]
        : [
            {
              id: `tl-edit-${Date.now()}-3`,
              time: '09:30 - 11:30',
              title: `Eksplorasi Destinasi Wisata Pagi`,
              description: `Menikmati keindahan alam & wahana rekreasi populer.`,
              location:
                destRegion === 'bali'
                  ? 'Tegalalang Rice Terrace'
                  : destRegion === 'malang'
                  ? 'Coban Rondo Waterfall'
                  : 'Lava Tour Merapi',
              type: 'sightseeing' as ItineraryActivityType,
              notes: 'Tiket masuk tercover'
            }
          ]),
      {
        id: `tl-edit-${Date.now()}-4`,
        time: '12:00 - 13:00',
        title: `Makan Siang Kuliner Resto Lokal`,
        description: `Makan siang bersama menu khas autentik daerah.`,
        location: `Resto Lokal ${cityLabel}`,
        type: 'meal'
      },
      {
        id: `tl-edit-${Date.now()}-5`,
        time: '13:30 - 15:30',
        title: `Kunjungan Destinasi Siang / Edukasi`,
        description: `Aktivitas seru dan hunting foto keluarga / rombongan.`,
        location: destRegion === 'bali' ? 'Desa Wisata Penglipuran' : destRegion === 'malang' ? 'Flora Wisata San Terra' : 'Candi Borobudur',
        type: 'sightseeing'
      },
      {
        id: `tl-edit-${Date.now()}-6`,
        time: '16:00 - 18:00',
        title: `Hunting Sunset & Panorama Sore`,
        description: `Menyaksikan keindahan matahari terbenam dengan pemandangan menawan.`,
        location: destRegion === 'bali' ? 'Pantai Jimbaran' : destRegion === 'malang' ? 'Batu Night Spectacular' : 'Tebing Breksi',
        type: 'sightseeing'
      },
      {
        id: `tl-edit-${Date.now()}-7`,
        time: '18:30 - 20:00',
        title: `Makan Malam Santap Kuliner Malam`,
        description: `Makan malam hangat bersama di restoran pilihan.`,
        location: `Sentra Kuliner ${cityLabel}`,
        type: 'meal'
      },
      {
        id: `tl-edit-${Date.now()}-8`,
        time: '20:30',
        title: `Kembali ke Hotel & Istirahat`,
        description: `Pengantaran kembali ke hotel untuk memulihkan tenaga.`,
        location: `Hotel Mitra ${cityLabel}`,
        type: 'free_time'
      }
    ];
  }

  return recalculateTimelineWithDistances(items, destRegion, { retimeSchedule: true });
}

