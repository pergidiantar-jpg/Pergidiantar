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
}

/**
 * Generate logical, chronological Day-by-Day timeline for Custom Trip Calculator orders
 * Now fully considers intercity travel times & realistic arrival/departure hours!
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
    dinnerCount
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
  // If there are leftovers, append to earlier days
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

    // =========================================================================
    // --- DAY 1: PENJEMPUTAN, PERJALANAN LINTAS KOTA (JIKA ADA), WISATA & HOTEL
    // =========================================================================
    if (isFirstDay) {
      if (intercity.isIntercity) {
        // PUSH REALISTIC INTERCITY TRANSIT STEPS
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

        // AFTER ARRIVAL: SIGHTSEEING IN DESTINATION CITY
        // Check arrival time: if morning (~07:30 - 08:30)
        if (intercity.isOvernightJourney || intercity.estimatedTravelHours <= 3) {
          // Destinasi 1
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

          // Lunch
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

          // Destinasi 2
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

          // Hotel Check-in
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

          // Sunset / Destinasi 3
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

          // Dinner
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

          // Rest
          timeline.push({
            id: `tl-d1-rest`,
            time: '21:00',
            title: hasHotel ? `Kembali ke Hotel & Istirahat Malam` : `Pengantaran ke Penginapan & Istirahat`,
            description: `Armada mengantar kembali ke hotel untuk memulihkan energi setelah perjalanan panjang.`,
            location: effectiveHotelName,
            type: 'free_time'
          });
        } 
        // Daytime arrival (~12:30) e.g. Jakarta to Jogja 8 hours
        else {
          // Destinasi 1 (Afternoon)
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

          // Dinner
          timeline.push({
            id: `tl-d1-dinner`,
            time: '18:30 - 20:00',
            title: `Makan Malam Kuliner Malam Khas ${destinationLabel}`,
            description: `Santap malam khas di kawasan kuliner legendaris ${destinationLabel}.`,
            location: `Resto Khas ${destinationLabel}`,
            type: 'meal'
          });

          // Destinasi 2 (Evening / Malioboro / Alun-alun)
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

          // Rest
          timeline.push({
            id: `tl-d1-rest`,
            time: '22:00',
            title: `Kembali ke Hotel & Istirahat`,
            description: `Kembali ke hotel untuk istirahat malam.`,
            location: effectiveHotelName,
            type: 'free_time'
          });
        }
      } 
      // LOCAL TRIP (Penjemputan di kota yang sama dengan destinasi)
      else {
        // 1. Pickup
        timeline.push({
          id: `tl-d1-1`,
          time: '08:00 - 09:00',
          title: `Penjemputan di ${pickupCity || 'Titik Kumpul'}`,
          description: `Penyambutan ramah oleh driver & kru berseragam PERGIDIANTAR dengan armada ber-AC bersih. Pemuatan bagasi aman.`,
          location: pickupCity || 'Bandara / Stasiun',
          type: 'pickup',
          notes: 'Driver & armada standby 15 menit sebelumnya'
        });

        // 2. Morning Sightseeing
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

        // 3. Lunch
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

        // 4. Afternoon Sightseeing
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

        // 5. Hotel Check-in
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

        // 6. Sunset
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

        // 7. Dinner
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

        // 8. Return
        timeline.push({
          id: `tl-d1-8`,
          time: '21:00',
          title: hasHotel ? `Kembali ke Hotel & Istirahat Malam` : `Pengantaran ke Penginapan & Istirahat`,
          description: `Armada mengantar kembali ke hotel untuk beristirahat memulihkan energi untuk petualangan esok hari.`,
          location: effectiveHotelName,
          type: 'free_time'
        });
      }
    }

    // =========================================================================
    // --- INTERMEDIATE DAYS: FULL DAY TOUR EXPLORATION
    // =========================================================================
    else if (!isLastDay) {
      // 1. Breakfast
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

      // 2. Morning Departure
      timeline.push({
        id: `tl-d${day}-2`,
        time: '08:30 - 09:00',
        title: `Penjemputan di Lobby Hotel`,
        description: `Driver standby tepat waktu di lobby hotel. Briefing singkat rute wisata hari ini.`,
        location: effectiveHotelName,
        type: 'pickup'
      });

      // 3. Destinasi 1
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

      // 4. Lunch
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

      // 5. Destinasi 2
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

      // 6. Destinasi 3 or Sunset
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

      // 7. Dinner
      timeline.push({
        id: `tl-d${day}-7`,
        time: '18:30 - 20:00',
        title: `Makan Malam Santap Kuliner Nusantara`,
        description: dinnerCount >= day
          ? `Menikmati hidangan makan malam lezat bersama seluruh anggota tour.`
          : `Makan malam mandiri di sentra kuliner kota.`,
        location: `Restoran Kuliner Malam`,
        type: 'meal',
        notes: dinnerCount >= day ? 'Termasuk kuota makan malam' : 'Makan mandiri'
      });

      // 8. Return
      timeline.push({
        id: `tl-d${day}-8`,
        time: '20:30',
        title: `Kembali ke Hotel & Acara Bebas`,
        description: `Pengantaran kembali ke hotel. Waktu bebas bagi rombongan untuk beristirahat.`,
        location: effectiveHotelName,
        type: 'free_time'
      });
    }

    // =========================================================================
    // --- FINAL DAY: CHECK-OUT, OLEH-OLEH, MAKAN SIANG & PERJALANAN PULANG
    // =========================================================================
    else {
      // 1. Breakfast
      timeline.push({
        id: `tl-d${day}-1`,
        time: '07:00 - 08:30',
        title: hasHotel ? `Sarapan Pagi di Hotel & Persiapan Packing` : `Sarapan Pagi & Packing Barang`,
        description: `Menikmati sarapan terakhir di hotel dan memastikan semua barang bawaan terkemas rapi.`,
        location: effectiveHotelName,
        type: 'meal'
      });

      // 2. Check-out
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

      // 3. Bonus Oleh-Oleh & Sentra Kerajinan
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

      // 4. Final Destination or Sightseeing before lunch
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

      // 5. Lunch
      timeline.push({
        id: `tl-d${day}-5`,
        time: '12:30 - 13:30',
        title: `Makan Siang Perpisahan Khas ${destinationLabel}`,
        description: `Santap siang kuliner khas legendaris sebagai penutup manis perjalanan wisata.`,
        location: `Restoran Khas ${destinationLabel}`,
        type: 'meal'
      });

      // 6. Kepulangan (Intercity Return Journey vs Local Drop-off)
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
          location: `Bandara / Stasiun / Titik Drop-off`,
          type: 'dropoff',
          notes: 'Driver memastikan seluruh barang bawaan turun lengkap'
        });
      }
    }

    // Dynamic Title per day
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
      activities: timeline.map(t => `${t.time} - ${t.title}`),
      timeline
    });
  }

  return itineraryDays;
}

/**
 * Generate default editable timeline items for Admin Package Management
 * Supports optional origin city to simulate intercity template (e.g. Tour Bali start dari Jogja)
 */
export function createDefaultDayTimeline(
  dayNumber: number, 
  isLastDay: boolean, 
  cityLabel: string, 
  originCity?: string
): ItineraryTimelineItem[] {
  const destRegion: DestinationRegion = 
    cityLabel.toLowerCase().includes('bali') ? 'bali' :
    cityLabel.toLowerCase().includes('malang') ? 'malang' : 'jogja';

  const intercity = originCity ? getIntercityTravelInfo(originCity, destRegion) : null;

  if (dayNumber === 1) {
    if (intercity && intercity.isIntercity) {
      const items: ItineraryTimelineItem[] = [];
      intercity.day1TransitSteps.forEach((s, idx) => {
        items.push({
          id: `tl-edit-${Date.now()}-transit-${idx + 1}`,
          time: s.time,
          title: s.title,
          description: s.description,
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
          type: 'sightseeing'
        },
        {
          id: `tl-edit-${Date.now()}-2`,
          time: '12:00 - 13:00',
          title: `Makan Siang Resto Lokal Autentik`,
          description: `Santap siang kuliner khas daerah di restoran mitra.`,
          type: 'meal'
        },
        {
          id: `tl-edit-${Date.now()}-3`,
          time: '14:30 - 16:00',
          title: `Check-in Hotel Mitra & Istirahat`,
          description: `Pembagian kunci kamar hotel mitra, istirahat sejenak setelah perjalanan lintas kota.`,
          type: 'hotel_checkin'
        },
        {
          id: `tl-edit-${Date.now()}-4`,
          time: '17:00 - 18:30',
          title: `Hunting Sunset & Panorama Senja`,
          description: `Menikmati golden hour senja yang memukau.`,
          type: 'sightseeing'
        },
        {
          id: `tl-edit-${Date.now()}-5`,
          time: '19:00 - 20:30',
          title: `Makan Malam Kuliner Malam`,
          description: `Santap malam bersama rombongan di sentra kuliner khas malam hari.`,
          type: 'meal'
        },
        {
          id: `tl-edit-${Date.now()}-6`,
          time: '21:00',
          title: `Kembali ke Hotel & Istirahat`,
          description: `Pengantaran kembali ke hotel untuk istirahat malam.`,
          type: 'free_time'
        }
      );
      return items;
    }

    return [
      {
        id: `tl-edit-${Date.now()}-1`,
        time: '08:00 - 09:30',
        title: `Penjemputan Peserta di Bandara / Stasiun`,
        description: `Penyambutan tamu dengan sign board nama rombongan, armada AC dingin, dan pemuatan koper.`,
        type: 'pickup',
        notes: 'Armada & driver standby'
      },
      {
        id: `tl-edit-${Date.now()}-2`,
        time: '10:00 - 12:00',
        title: `Kunjungan Destinasi Ikonik Pertama`,
        description: `Eksplorasi cagar budaya dan spot foto instagramable di ${cityLabel}.`,
        type: 'sightseeing',
        notes: 'Tiket masuk tercover'
      },
      {
        id: `tl-edit-${Date.now()}-3`,
        time: '12:30 - 13:30',
        title: `Makan Siang Resto Lokal Autentik`,
        description: `Menikmati hidangan lezat masakan tradisional khas ${cityLabel}.`,
        type: 'meal',
        notes: 'Resto lokal higienis'
      },
      {
        id: `tl-edit-${Date.now()}-4`,
        time: '14:00 - 15:30',
        title: `Check-in Hotel Mitra & Istirahat`,
        description: `Pembagian kunci kamar hotel mitra, istirahat sejenak setelah perjalanan.`,
        type: 'hotel_checkin',
        notes: 'Hotel bintang pilihan'
      },
      {
        id: `tl-edit-${Date.now()}-5`,
        time: '16:00 - 18:00',
        title: `Hunting Sunset & Panorama Senja`,
        description: `Menikmati momen golden hour dan pemandangan sore yang memukau.`,
        type: 'sightseeing'
      },
      {
        id: `tl-edit-${Date.now()}-6`,
        time: '18:30 - 20:00',
        title: `Makan Malam Kuliner Malam`,
        description: `Santap malam bersama rombongan di sentra kuliner khas malam hari.`,
        type: 'meal'
      },
      {
        id: `tl-edit-${Date.now()}-7`,
        time: '20:30',
        title: `Kembali ke Hotel & Istirahat`,
        description: `Pengantaran kembali ke hotel untuk istirahat malam.`,
        type: 'free_time'
      }
    ];
  }

  if (isLastDay) {
    if (intercity && intercity.isIntercity) {
      const items: ItineraryTimelineItem[] = [
        {
          id: `tl-edit-${Date.now()}-1`,
          time: '07:00 - 08:30',
          title: `Sarapan Pagi di Hotel & Packing`,
          description: `Sarapan pagi buffet hotel dan pengemasan koper.`,
          type: 'meal'
        },
        {
          id: `tl-edit-${Date.now()}-2`,
          time: '08:30 - 09:30',
          title: `Check-out Hotel & Pemuatan Bagasi`,
          description: `Penyelesaian administrasi hotel dan pemuatan bagasi ke dalam armada.`,
          type: 'hotel_checkout'
        },
        {
          id: `tl-edit-${Date.now()}-3`,
          time: '10:00 - 11:30',
          title: `Wisata Belanja Pusat Oleh-Oleh Khas`,
          description: `Membeli cenderamata, kerajinan tangan, dan makanan khas daerah.`,
          type: 'shopping'
        },
        {
          id: `tl-edit-${Date.now()}-4`,
          time: '12:00 - 13:00',
          title: `Makan Siang Perpisahan`,
          description: `Santap siang kuliner khas penutup sebelum perjalanan pulang.`,
          type: 'meal'
        }
      ];
      intercity.returnTransitSteps.forEach((s, idx) => {
        items.push({
          id: `tl-edit-${Date.now()}-return-${idx + 1}`,
          time: s.time,
          title: s.title,
          description: s.description,
          type: s.type,
          notes: s.notes
        });
      });
      return items;
    }

    return [
      {
        id: `tl-edit-${Date.now()}-1`,
        time: '07:00 - 08:30',
        title: `Sarapan Pagi di Hotel & Packing`,
        description: `Menikmati sarapan pagi buffet hotel dan pengemasan barang bawaan.`,
        type: 'meal'
      },
      {
        id: `tl-edit-${Date.now()}-2`,
        time: '09:00 - 10:00',
        title: `Check-out Hotel & Pemuatan Bagasi`,
        description: `Penyelesaian check-out kamar dan pemuatan koper ke dalam armada.`,
        type: 'hotel_checkout',
        notes: 'Pemeriksaan barang bawaan'
      },
      {
        id: `tl-edit-${Date.now()}-3`,
        time: '10:30 - 12:00',
        title: `Wisata Belanja Pusat Oleh-Oleh Khas`,
        description: `Membeli buah tangan, kerajinan lokal, bakpia, dodol, kaos, dan cenderamata khas daerah.`,
        type: 'shopping',
        notes: 'Bonus kunjungan oleh-oleh'
      },
      {
        id: `tl-edit-${Date.now()}-4`,
        time: '12:30 - 13:30',
        title: `Makan Siang Perpisahan`,
        description: `Makan siang penutup dengan santap kuliner legendaris ${cityLabel}.`,
        type: 'meal'
      },
      {
        id: `tl-edit-${Date.now()}-5`,
        time: '14:00 - 15:30',
        title: `Kunjungan Ikon Kota & Foto Bersama`,
        description: `Sesi dokumentasi foto rombongan di landmark kebanggaan kota.`,
        type: 'sightseeing'
      },
      {
        id: `tl-edit-${Date.now()}-6`,
        time: '16:00 - 17:30',
        title: `Pengantaran ke Bandara / Stasiun (Drop-off)`,
        description: `Pengantaran tepat waktu menuju Bandara / Stasiun. Perjalanan wisata selesai bersama PERGIDIANTAR.`,
        type: 'dropoff',
        notes: 'Drop-off selesai dengan aman'
      }
    ];
  }

  // Middle day
  return [
    {
      id: `tl-edit-${Date.now()}-1`,
      time: '07:00 - 08:30',
      title: `Sarapan Pagi Buffet di Hotel`,
      description: `Sarapan pagi lezat di restoran hotel.`,
      type: 'meal'
    },
    {
      id: `tl-edit-${Date.now()}-2`,
      time: '08:30 - 09:00',
      title: `Penjemputan di Lobby Hotel`,
      description: `Driver bersiap di lobby hotel untuk penjemputan tur harian.`,
      type: 'pickup'
    },
    {
      id: `tl-edit-${Date.now()}-3`,
      time: '09:30 - 11:30',
      title: `Eksplorasi Destinasi Wisata Pagi`,
      description: `Menikmati keindahan alam & wahana rekreasi populer.`,
      type: 'sightseeing',
      notes: 'Tiket masuk tercover'
    },
    {
      id: `tl-edit-${Date.now()}-4`,
      time: '12:00 - 13:00',
      title: `Makan Siang Kuliner Resto Lokal`,
      description: `Makan siang bersama menu khas autentik daerah.`,
      type: 'meal'
    },
    {
      id: `tl-edit-${Date.now()}-5`,
      time: '13:30 - 15:30',
      title: `Kunjungan Destinasi Siang / Edukasi`,
      description: `Aktivitas seru dan hunting foto keluarga / rombongan.`,
      type: 'sightseeing'
    },
    {
      id: `tl-edit-${Date.now()}-6`,
      time: '16:00 - 18:00',
      title: `Hunting Sunset & Panorama Sore`,
      description: `Menyaksikan keindahan matahari terbenam dengan pemandangan menawan.`,
      type: 'sightseeing'
    },
    {
      id: `tl-edit-${Date.now()}-7`,
      time: '18:30 - 20:00',
      title: `Makan Malam Santap Kuliner Malam`,
      description: `Makan malam hangat bersama di restoran pilihan.`,
      type: 'meal'
    },
    {
      id: `tl-edit-${Date.now()}-8`,
      time: '20:30',
      title: `Kembali ke Hotel & Istirahat`,
      description: `Pengantaran kembali ke hotel untuk memulihkan tenaga.`,
      type: 'free_time'
    }
  ];
}
