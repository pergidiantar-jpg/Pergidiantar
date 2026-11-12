/**
 * Itinerary Generator & Timeline Utilities for PERGIDIANTAR
 * Handles automatic chronological scheduling for Custom Trip Calculator
 * with intercity transit estimations, and timeline synchronization for Tour Packages.
 */

import { 
  ItineraryDay, 
  ItineraryTimelineItem, 
  ItineraryActivityType, 
  DestinationRegion,
  TourPackage
} from '../types/travel';
import { DestinationOption } from '../data/destinationsData';

export interface IntercityTransitInfo {
  isIntercity: boolean;
  transitHours: number;
  transitType: 'same_city' | 'short_intercity' | 'medium_intercity' | 'long_intercity_crossing' | 'far_intercity';
  originName: string;
  destinationName: string;
  summary: string;
}

/**
 * Detect whether the pickup city is outside the primary destination region
 * and calculate realistic intercity pariwisata transit time.
 */
export function detectIntercityTransit(pickupCity: string, destination: DestinationRegion): IntercityTransitInfo {
  const clean = (pickupCity || '').toLowerCase().trim();

  const isJogjaBase = clean.includes('jogja') || clean.includes('yogyakarta') || clean.includes('yia') || 
                      clean.includes('tugu') || clean.includes('lempuyangan') || clean.includes('sleman') || 
                      clean.includes('bantul') || clean.includes('kulon') || clean.includes('gunungkidul');

  const isMalangBase = clean.includes('malang') || clean.includes('batu') || clean.includes('abdulrachman') || 
                       clean.includes('kepanjen') || clean.includes('bromo');

  const isBaliBase = clean.includes('bali') || clean.includes('denpasar') || clean.includes('ngurah') || 
                     clean.includes('kuta') || clean.includes('ubud') || clean.includes('sanur') || 
                     clean.includes('seminyak') || clean.includes('jimbaran') || clean.includes('nusa dua') ||
                     clean.includes('canggu') || clean.includes('gilimanuk');

  // Check if within destination local territory
  if (destination === 'jogja' && isJogjaBase) {
    return { isIntercity: false, transitHours: 0.5, transitType: 'same_city', originName: pickupCity, destinationName: 'Yogyakarta', summary: 'Penjemputan area lokal Yogyakarta' };
  }
  if (destination === 'malang' && isMalangBase) {
    return { isIntercity: false, transitHours: 0.5, transitType: 'same_city', originName: pickupCity, destinationName: 'Malang & Bromo', summary: 'Penjemputan area lokal Malang & Batu' };
  }
  if (destination === 'bali' && isBaliBase) {
    return { isIntercity: false, transitHours: 0.5, transitType: 'same_city', originName: pickupCity, destinationName: 'Pulau Bali', summary: 'Penjemputan area lokal Pulau Bali' };
  }

  // Intercity Route Calculations:
  // Destination: BALI (Cross-Island with Ferry Crossing)
  if (destination === 'bali') {
    if (isJogjaBase || clean.includes('solo') || clean.includes('surakarta') || clean.includes('semarang') || clean.includes('klaten') || clean.includes('magelang')) {
      return {
        isIntercity: true,
        transitHours: 15,
        transitType: 'long_intercity_crossing',
        originName: pickupCity,
        destinationName: 'Pulau Bali',
        summary: `Perjalanan darat Tol Trans-Jawa (~650 km) & Penyeberangan Ferry Ketapang-Gilimanuk (Est. 14-16 Jam)`
      };
    }
    if (isMalangBase || clean.includes('surabaya') || clean.includes('sidoarjo') || clean.includes('pasuruan') || clean.includes('probolinggo')) {
      return {
        isIntercity: true,
        transitHours: 9,
        transitType: 'medium_intercity',
        originName: pickupCity,
        destinationName: 'Pulau Bali',
        summary: `Perjalanan darat Jawa Timur ke Banyuwangi & Penyeberangan Ferry ke Bali (Est. 8-10 Jam)`
      };
    }
    if (clean.includes('jakarta') || clean.includes('bandung') || clean.includes('bogor') || clean.includes('bekasi') || clean.includes('tangerang')) {
      return {
        isIntercity: true,
        transitHours: 20,
        transitType: 'far_intercity',
        originName: pickupCity,
        destinationName: 'Pulau Bali',
        summary: `Perjalanan overland jarak jauh Jakarta/Barat ke Bali via Tol Trans-Jawa & Kapal Ferry (Est. 18-20 Jam)`
      };
    }
    // Generic outer city to Bali
    return {
      isIntercity: true,
      transitHours: 14,
      transitType: 'long_intercity_crossing',
      originName: pickupCity,
      destinationName: 'Pulau Bali',
      summary: `Perjalanan antar-kota luar daerah menuju Pulau Bali via Tol & Penyeberangan Ferry`
    };
  }

  // Destination: MALANG
  if (destination === 'malang') {
    if (clean.includes('surabaya') || clean.includes('sidoarjo')) {
      return {
        isIntercity: true,
        transitHours: 2,
        transitType: 'short_intercity',
        originName: pickupCity,
        destinationName: 'Malang & Batu',
        summary: `Perjalanan Tol Pandaan-Malang (Est. 1.5 - 2 Jam)`
      };
    }
    if (isJogjaBase || clean.includes('solo') || clean.includes('surakarta') || clean.includes('semarang')) {
      return {
        isIntercity: true,
        transitHours: 6,
        transitType: 'medium_intercity',
        originName: pickupCity,
        destinationName: 'Malang & Batu',
        summary: `Perjalanan Tol Trans-Jawa Jawa Tengah ke Malang via Kertosono (Est. 5-6 Jam)`
      };
    }
    if (clean.includes('jakarta') || clean.includes('bandung')) {
      return {
        isIntercity: true,
        transitHours: 11,
        transitType: 'far_intercity',
        originName: pickupCity,
        destinationName: 'Malang & Batu',
        summary: `Perjalanan Tol Trans-Jawa Jakarta/Bandung ke Malang (Est. 10-12 Jam)`
      };
    }
    return {
      isIntercity: true,
      transitHours: 6,
      transitType: 'medium_intercity',
      originName: pickupCity,
      destinationName: 'Malang & Batu',
      summary: `Perjalanan antar kota menuju Malang & Bromo`
    };
  }

  // Destination: JOGJA
  if (destination === 'jogja') {
    if (clean.includes('solo') || clean.includes('surakarta') || clean.includes('klaten') || clean.includes('magelang')) {
      return {
        isIntercity: true,
        transitHours: 1.5,
        transitType: 'short_intercity',
        originName: pickupCity,
        destinationName: 'Yogyakarta',
        summary: `Perjalanan Solo/Magelang ke Jogja (Est. 1 - 1.5 Jam)`
      };
    }
    if (clean.includes('semarang') || clean.includes('salatiga') || clean.includes('boyolali')) {
      return {
        isIntercity: true,
        transitHours: 3,
        transitType: 'short_intercity',
        originName: pickupCity,
        destinationName: 'Yogyakarta',
        summary: `Perjalanan Semarang ke Jogja (Est. 2.5 - 3 Jam)`
      };
    }
    if (isMalangBase || clean.includes('surabaya') || clean.includes('sidoarjo') || clean.includes('kediri')) {
      return {
        isIntercity: true,
        transitHours: 5.5,
        transitType: 'medium_intercity',
        originName: pickupCity,
        destinationName: 'Yogyakarta',
        summary: `Perjalanan Tol Trans-Jawa Jawa Timur ke Jogja (Est. 4.5 - 5.5 Jam)`
      };
    }
    if (clean.includes('jakarta') || clean.includes('bandung') || clean.includes('cirebon')) {
      return {
        isIntercity: true,
        transitHours: 8,
        transitType: 'medium_intercity',
        originName: pickupCity,
        destinationName: 'Yogyakarta',
        summary: `Perjalanan Tol Cipali & Trans-Jawa Jakarta/Bandung ke Jogja (Est. 7 - 8 Jam)`
      };
    }
    return {
      isIntercity: true,
      transitHours: 5,
      transitType: 'medium_intercity',
      originName: pickupCity,
      destinationName: 'Yogyakarta',
      summary: `Perjalanan antar kota menuju Yogyakarta`
    };
  }

  return { isIntercity: false, transitHours: 1, transitType: 'same_city', originName: pickupCity, destinationName: destination, summary: 'Penjemputan standar' };
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
 * Generate logical, chronological Day-by-Day timeline for Custom Trip Calculator orders.
 * Automatically factors in realistic transit time if picked up outside destination city!
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
  const transit = detectIntercityTransit(pickupCity, destination);
  const destPool = [...selectedDestinations];

  // If long intercity crossing (e.g. Jogja to Bali):
  // Day 1 is dedicated to intercity road travel and ferry crossing.
  // Destinasi wisata Bali akan dialokasikan penuh mulai Day 2 hingga Day terakhir!
  const destinationAvailableDays = (transit.isIntercity && (transit.transitType === 'long_intercity_crossing' || transit.transitType === 'far_intercity'))
    ? Math.max(1, totalDays - 1)
    : totalDays;

  const perDayDestCount = Math.max(1, Math.ceil(destPool.length / destinationAvailableDays));
  const daysDestinations: DestinationOption[][] = [];

  for (let d = 0; d < totalDays; d++) {
    // If long crossing and Day 1, no tourist destinations on Day 1 (all travel)
    if (d === 0 && transit.isIntercity && (transit.transitType === 'long_intercity_crossing' || transit.transitType === 'far_intercity')) {
      daysDestinations.push([]);
      continue;
    }
    const chunk = destPool.splice(0, perDayDestCount);
    daysDestinations.push(chunk);
  }

  // Leftovers appended to available tour days
  let leftoverIdx = (transit.isIntercity && (transit.transitType === 'long_intercity_crossing' || transit.transitType === 'far_intercity')) ? 1 : 0;
  while (destPool.length > 0) {
    const extra = destPool.shift();
    if (extra && daysDestinations[leftoverIdx]) {
      daysDestinations[leftoverIdx].push(extra);
    }
    leftoverIdx = (leftoverIdx + 1) % totalDays;
    if (leftoverIdx === 0 && transit.isIntercity && (transit.transitType === 'long_intercity_crossing' || transit.transitType === 'far_intercity')) {
      leftoverIdx = 1;
    }
  }

  const hasHotel = hotelTier !== 'none';
  const effectiveHotelName = hasHotel ? hotelTitle : 'Akomodasi Pilihan Tamu';
  const itineraryDays: ItineraryDay[] = [];

  for (let day = 1; day <= totalDays; day++) {
    const isFirstDay = day === 1;
    const isLastDay = day === totalDays;
    const currentDests = daysDestinations[day - 1] || [];
    const timeline: ItineraryTimelineItem[] = [];

    // ==========================================
    // DAY 1: PENJEMPUTAN & PERJALANAN / WISATA
    // ==========================================
    if (isFirstDay) {
      // CASE A: LONG CROSSING (e.g. Yogyakarta to Bali)
      if (transit.isIntercity && (transit.transitType === 'long_intercity_crossing' || transit.transitType === 'far_intercity')) {
        timeline.push({
          id: `tl-d1-1`,
          time: '05:30 - 06:30',
          title: `Penjemputan di ${pickupCity} & Briefing Armada`,
          description: `Penyambutan tamu di titik kumpul ${pickupCity} oleh supir berpengalaman berlisensi. Pemuatan koper ke armada ber-AC dan doa bersama sebelum perjalanan darat menuju Pulau Bali.`,
          location: `${pickupCity} (Titik Jemput Tamu)`,
          type: 'pickup',
          notes: 'Armada long-trip pariwisata ber-AC'
        });

        timeline.push({
          id: `tl-d1-2`,
          time: '06:30 - 12:00',
          title: `Perjalanan Tol Trans-Jawa Menuju Jawa Timur`,
          description: `Melintasi ruas jalan Tol Trans-Jawa. Kru menjadwalkan coffee break dan peregangan fisik di rest area modern (km 519 / km 575) yang nyaman.`,
          location: 'Tol Trans-Jawa (Jawa Tengah - Jawa Timur)',
          type: 'transport',
          notes: 'Break rest area & kenyamanan perjalanan'
        });

        timeline.push({
          id: `tl-d1-3`,
          time: '12:00 - 13:00',
          title: `Istirahat Makan Siang di Rest Area Utama`,
          description: lunchCount > 0
            ? `Santap makan siang bersama rombongan dengan menu prasmanan khas di restoran rest area pilihan yang higienis.`
            : `Istirahat makan siang dan ibadah di rest area tol utama.`,
          location: 'Rest Area Tol Utama',
          type: 'meal',
          notes: 'Makan siang terjadwal'
        });

        timeline.push({
          id: `tl-d1-4`,
          time: '13:00 - 17:30',
          title: `Lanjutan Perjalanan Menuju Pelabuhan Ketapang Banyuwangi`,
          description: `Perjalanan darat melintasi Probolinggo, Situbondo, dan Hutan Baluran menuju gerbang timur Pulau Jawa di Pelabuhan Ketapang.`,
          location: 'Jalur Lintas Timur Banyuwangi',
          type: 'transport',
          notes: 'Estimasi tiba di pelabuhan sore hari'
        });

        timeline.push({
          id: `tl-d1-5`,
          time: '17:30 - 19:30',
          title: `Penyeberangan Ferry Selat Bali (Ketapang ke Gilimanuk) & Makan Malam`,
          description: `Proses boarding armada ke kapal ferry ASDP. Menikmati semilir angin Selat Bali saat senja dan makan malam hangat di kapal/kawasan pelabuhan Gilimanuk (WITA).`,
          location: 'Pelabuhan Ketapang - Gilimanuk (WITA)',
          type: 'transport',
          notes: 'Tiket kapal penyeberangan include'
        });

        timeline.push({
          id: `tl-d1-6`,
          time: '19:30 - 22:30',
          title: `Tiba di Bali & Perjalanan Menuju Hotel / Denpasar`,
          description: `Selamat datang di Pulau Dewata Bali! Perjalanan dilanjutkan melintasi jalur pesisir barat Pulau Bali menuju kawasan penginapan rombongan.`,
          location: 'Jalur Gilimanuk - Denpasar / Kuta',
          type: 'transport',
          notes: 'Memasuki zona waktu WITA (+1 jam)'
        });

        timeline.push({
          id: `tl-d1-7`,
          time: '22:30',
          title: `Check-in Hotel (${effectiveHotelName}) & Istirahat Malam`,
          description: `Proses check-in kamar di ${effectiveHotelName}, pembagian kunci, dan istirahat total agar kondisi fisik prima untuk eksplorasi wisata Bali esok pagi.`,
          location: effectiveHotelName,
          type: 'hotel_checkin',
          notes: 'Istirahat malam optimal'
        });
      }

      // CASE B: MEDIUM INTERCITY (e.g. Jogja -> Malang 5-6 jam, atau Surabaya -> Jogja 4.5 jam)
      else if (transit.isIntercity && transit.transitType === 'medium_intercity') {
        timeline.push({
          id: `tl-d1-1`,
          time: '06:00 - 07:00',
          title: `Penjemputan di ${pickupCity} & Briefing Perjalanan`,
          description: `Penyambutan ramah di titik kumpul ${pickupCity}. Pemuatan koper ke armada dan persiapan perjalanan tol menuju ${destinationLabel}.`,
          location: pickupCity,
          type: 'pickup',
          notes: 'Penjemputan luar kota pagi hari'
        });

        timeline.push({
          id: `tl-d1-2`,
          time: '07:00 - 11:30',
          title: `Perjalanan Via Tol Trans-Jawa Menuju ${destinationLabel}`,
          description: `Perjalanan via Tol Trans-Jawa dengan 1x break rest area untuk coffee break dan toilet stop. Driver mengemudi dengan aman dan nyaman.`,
          location: `Tol Trans-Jawa Menuju ${destinationLabel}`,
          type: 'transport',
          notes: 'Estimasi perjalanan 4.5 - 5.5 jam'
        });

        timeline.push({
          id: `tl-d1-3`,
          time: '12:00 - 13:00',
          title: `Tiba di ${destinationLabel} & Makan Siang Kuliner Khas`,
          description: `Tiba dengan selamat di ${destinationLabel}. Langsung disambut makan siang santap kuliner khas daerah autentik di resto mitra.`,
          location: `Resto Khas ${destinationLabel}`,
          type: 'meal',
          notes: 'Santap siang kuliner khas'
        });

        // First destination after arriving!
        if (currentDests.length > 0) {
          const d1 = currentDests[0];
          timeline.push({
            id: `tl-d1-4`,
            time: '13:30 - 15:30',
            title: `Kunjungan Destinasi Pertama: ${d1.name}`,
            description: `Setelah tiba di ${destinationLabel}, langsung memulai eksplorasi wisata seru di ${d1.name}. ${d1.highlight || 'Spot foto favorit dan wahana rekreasi.'}`,
            location: d1.name,
            type: 'sightseeing',
            notes: 'Wisata perdana setiba di kota tujuan'
          });
        }

        if (hasHotel) {
          timeline.push({
            id: `tl-d1-5`,
            time: '16:00 - 17:00',
            title: `Check-in Hotel (${effectiveHotelName})`,
            description: `Check-in kamar hotel mitra pilihan, pembagian kunci, dan istirahat sejenak setelah perjalanan luar kota.`,
            location: effectiveHotelName,
            type: 'hotel_checkin',
            notes: 'Check-in resmi hotel'
          });
        }

        if (currentDests.length > 1) {
          const d2 = currentDests[1];
          timeline.push({
            id: `tl-d1-6`,
            time: '17:30 - 19:00',
            title: `Hunting Sunset & Suasana Senja di ${d2.name}`,
            description: `Menikmati pesona senja dan keindahan panorama malam di ${d2.name}.`,
            location: d2.name,
            type: 'sightseeing',
            notes: 'Momen golden hour'
          });
        }

        timeline.push({
          id: `tl-d1-7`,
          time: '19:30 - 20:30',
          title: `Makan Malam Kuliner Malam Khas ${destinationLabel}`,
          description: dinnerCount > 0
            ? `Santap makan malam bersama rombongan di sentra kuliner malam khas daerah.`
            : `Makan malam santai mandiri.`,
          location: `Sentra Kuliner Malam ${destinationLabel}`,
          type: 'meal',
          notes: 'Makan malam hangat'
        });

        timeline.push({
          id: `tl-d1-8`,
          time: '21:00',
          title: `Kembali ke Hotel & Istirahat Malam`,
          description: `Armada mengantar kembali ke penginapan untuk beristirahat malam.`,
          location: effectiveHotelName,
          type: 'free_time',
          notes: 'Istirahat memulihkan tenaga'
        });
      }

      // CASE C: LOCAL PICKUP OR SHORT INTERCITY (e.g. Surabaya -> Malang 1.5 jam, Solo -> Jogja 1 jam)
      else {
        const isShort = transit.isIntercity && transit.transitType === 'short_intercity';
        timeline.push({
          id: `tl-d1-1`,
          time: isShort ? '07:00 - 08:30' : '08:00 - 09:00',
          title: `Penjemputan di ${pickupCity || 'Titik Kumpul'} ${isShort ? `(Perjalanan Menuju ${destinationLabel})` : ''}`,
          description: isShort
            ? `Penjemputan di ${pickupCity} dan langsung menempuh perjalanan tol singkat (~1.5 jam) menuju ${destinationLabel}.`
            : `Penyambutan ramah oleh driver & kru berseragam PERGIDIANTAR dengan armada ber-AC bersih di ${pickupCity}. Pemuatan bagasi aman.`,
          location: pickupCity || 'Bandara / Stasiun',
          type: 'pickup',
          notes: isShort ? 'Perjalanan antar-kota dekat' : 'Armada pariwisata ber-AC'
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
            notes: 'Tiket masuk tercover All-In'
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
          notes: 'Makan siang kuliner khas'
        });

        if (currentDests.length > 1) {
          const d2 = currentDests[1];
          timeline.push({
            id: `tl-d1-4`,
            time: '13:30 - 15:30',
            title: `Kunjungan ${d2.name}`,
            description: `Melanjutkan perjalanan ke ${d2.name}. Menikmati suasana khas dan fasilitas atraksi wisata.`,
            location: d2.name,
            type: 'sightseeing',
            notes: 'Aktivitas rekreasi keluarga'
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
            notes: 'Check-in hotel resmi'
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
            type: 'sightseeing',
            notes: 'Spot sunset terbaik'
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
          notes: 'Santap malam bersama'
        });

        timeline.push({
          id: `tl-d1-8`,
          time: '21:00',
          title: hasHotel ? `Kembali ke Hotel & Istirahat Malam` : `Pengantaran ke Penginapan & Istirahat`,
          description: `Armada mengantar kembali ke hotel untuk beristirahat memulihkan energi untuk petualangan esok hari.`,
          location: effectiveHotelName,
          type: 'free_time',
          notes: 'Waktu istirahat'
        });
      }
    }

    // ==========================================
    // INTERMEDIATE DAYS: FULL DAY EXPLORATION
    // ==========================================
    else if (!isLastDay) {
      timeline.push({
        id: `tl-d${day}-1`,
        time: '07:00 - 08:30',
        title: hasHotel ? `Sarapan Pagi Buffet di Hotel` : `Sarapan Pagi & Persiapan Tour`,
        description: breakfastCount >= day 
          ? `Menikmati sajian sarapan pagi lezat di ${effectiveHotelName} untuk bekal energi tur harian.`
          : `Sarapan pagi santai dan persiapan perjalanan.`,
        location: effectiveHotelName,
        type: 'meal',
        notes: hasHotel ? 'Sarapan hotel include' : 'Sarapan mandiri'
      });

      timeline.push({
        id: `tl-d${day}-2`,
        time: '08:30 - 09:00',
        title: `Penjemputan di Lobby Hotel & Briefing Harian`,
        description: `Driver standby tepat waktu di lobby hotel. Briefing singkat rute wisata hari ini di ${destinationLabel}.`,
        location: effectiveHotelName,
        type: 'pickup',
        notes: 'Supir standby 15 menit sebelumnya'
      });

      if (currentDests.length > 0) {
        const d1 = currentDests[0];
        timeline.push({
          id: `tl-d${day}-3`,
          time: '09:30 - 11:30',
          title: `Eksplorasi ${d1.name}`,
          description: `Eksplorasi spot utama ${d1.name}. Waktu luang berfoto, menikmati wahana, dan keindahan panorama ${destinationLabel}.`,
          location: d1.name,
          type: 'sightseeing',
          notes: 'Wisata pagi favorit'
        });
      }

      timeline.push({
        id: `tl-d${day}-4`,
        time: '12:00 - 13:00',
        title: `Makan Siang Resto Lokal Favorit`,
        description: lunchCount >= day 
          ? `Makan siang bersama keluarga/rombongan di restoran lokal dengan view asri khas ${destinationLabel}.`
          : `Istirahat makan siang santai di restoran sekitar objek wisata.`,
        location: `Resto Lokal ${destinationLabel}`,
        type: 'meal',
        notes: 'Makan siang include'
      });

      if (currentDests.length > 1) {
        const d2 = currentDests[1];
        timeline.push({
          id: `tl-d${day}-5`,
          time: '13:30 - 15:30',
          title: `Keseruan Wisata di ${d2.name}`,
          description: `Aktivitas rekreasi dan kebersamaan di ${d2.name}. Spot foto instagramable dan wahana seru.`,
          location: d2.name,
          type: 'sightseeing',
          notes: 'Wahana & spot foto'
        });
      }

      if (currentDests.length > 2) {
        const d3 = currentDests[2];
        timeline.push({
          id: `tl-d${day}-6`,
          time: '16:00 - 18:00',
          title: `Hunting Panorama Sore & Sunset di ${d3.name}`,
          description: `Menikmati pemandangan sore hari yang eksotis dan sejuk di ${d3.name}. Momen foto bersama rombongan.`,
          location: d3.name,
          type: 'sightseeing',
          notes: 'Panorama senja'
        });
      }

      timeline.push({
        id: `tl-d${day}-7`,
        time: '18:30 - 20:00',
        title: `Makan Malam Santap Kuliner Nusantara`,
        description: dinnerCount >= day
          ? `Menikmati hidangan makan malam lezat bersama seluruh anggota tour di kawasan kuliner populer.`
          : `Makan malam mandiri di sentra kuliner kota.`,
        location: `Restoran Kuliner Malam`,
        type: 'meal',
        notes: 'Makan malam santai'
      });

      timeline.push({
        id: `tl-d${day}-8`,
        time: '20:30',
        title: `Kembali ke Hotel & Acara Bebas`,
        description: `Pengantaran kembali ke hotel. Waktu bebas bagi rombongan untuk beristirahat.`,
        location: effectiveHotelName,
        type: 'free_time',
        notes: 'Waktu istirahat'
      });
    }

    // ==========================================
    // FINAL DAY: CHECK-OUT, OLEH-OLEH & KEPULANGAN
    // ==========================================
    else {
      timeline.push({
        id: `tl-d${day}-1`,
        time: '07:00 - 08:30',
        title: hasHotel ? `Sarapan Pagi di Hotel & Persiapan Packing` : `Sarapan Pagi & Packing Barang`,
        description: `Menikmati sarapan terakhir di hotel dan memastikan semua barang bawaan terkemas rapi.`,
        location: effectiveHotelName,
        type: 'meal',
        notes: 'Sarapan penutup'
      });

      if (hasHotel) {
        timeline.push({
          id: `tl-d${day}-2`,
          time: '08:30 - 09:30',
          title: `Proses Check-out Hotel & Pemuatan Bagasi`,
          description: `Penyelesaian administrasi hotel, kunci kamar diserahkan ke resepsionis, dan koper dimuat rapi ke bagasi armada.`,
          location: effectiveHotelName,
          type: 'hotel_checkout',
          notes: 'Check-out hotel selesai'
        });
      }

      // If long intercity return (e.g. Bali to Yogyakarta):
      if (transit.isIntercity && (transit.transitType === 'long_intercity_crossing' || transit.transitType === 'far_intercity')) {
        const bonusText = bonusItems.length > 0 ? bonusItems.join(' & ') : 'Sentra Oleh-Oleh Khas Bali (Krisna / Joger)';
        timeline.push({
          id: `tl-d${day}-3`,
          time: '09:30 - 11:30',
          title: `Belanja Oleh-Oleh Khas ${destinationLabel} (${bonusText})`,
          description: `Membeli oleh-oleh khas Bali (pie susu, kacang disco, kain pantai, kaos Joger/Krisna) sebelum memulai perjalanan darat kepulangan.`,
          location: `Pusat Oleh-Oleh Khas ${destinationLabel}`,
          type: 'shopping',
          notes: 'Belanja cenderamata'
        });

        timeline.push({
          id: `tl-d${day}-4`,
          time: '11:30 - 14:00',
          title: `Perjalanan Menuju Pelabuhan Gilimanuk`,
          description: `Perjalanan darat melintasi pesisir barat Pulau Bali menuju Pelabuhan Penyeberangan Gilimanuk.`,
          location: 'Jalur Denpasar - Gilimanuk',
          type: 'transport',
          notes: 'Menuju pelabuhan penyeberangan'
        });

        timeline.push({
          id: `tl-d${day}-5`,
          time: '14:00 - 15:30',
          title: `Penyeberangan Ferry Gilimanuk ke Ketapang & Makan Siang`,
          description: `Penyeberangan kembali melintasi Selat Bali menuju Pelabuhan Ketapang Banyuwangi dan santap siang perpisahan.`,
          location: 'Pelabuhan Gilimanuk - Ketapang (WIB)',
          type: 'transport',
          notes: 'Kembali ke waktu WIB'
        });

        timeline.push({
          id: `tl-d${day}-6`,
          time: '15:30 - 21:30',
          title: `Perjalanan Tol Trans-Jawa & Pengantaran ke ${pickupCity}`,
          description: `Perjalanan tol nyaman menuju ${pickupCity}. Pengantaran seluruh peserta sampai di titik kumpul awal dengan selamat dan penuh kenangan indah bersama PERGIDIANTAR.`,
          location: `${pickupCity} (Titik Drop-off)`,
          type: 'dropoff',
          notes: 'Pengantaran aman tiba di kota asal'
        });
      }

      // Medium Intercity return (e.g. Malang to Jogja, or Jogja to Malang):
      else if (transit.isIntercity && transit.transitType === 'medium_intercity') {
        if (currentDests.length > 0) {
          const d1 = currentDests[0];
          timeline.push({
            id: `tl-d${day}-3`,
            time: '09:30 - 11:00',
            title: `Kunjungan Destinasi Terakhir: ${d1.name}`,
            description: `Kunjungan penutup sebelum berbelanja oleh-oleh dan kepulangan.`,
            location: d1.name,
            type: 'sightseeing',
            notes: 'Spot penutup'
          });
        }

        const bonusText = bonusItems.length > 0 ? bonusItems.join(' & ') : 'Sentra Oleh-Oleh & Kerajinan Khas';
        timeline.push({
          id: `tl-d${day}-4`,
          time: '11:00 - 12:30',
          title: `Belanja Oleh-Oleh Khas (${bonusText})`,
          description: `Membeli buah tangan, makanan khas, dan cinderamata untuk keluarga di rumah.`,
          location: `Sentra Oleh-Oleh Khas ${destinationLabel}`,
          type: 'shopping',
          notes: 'Oleh-oleh khas'
        });

        timeline.push({
          id: `tl-d${day}-5`,
          time: '12:30 - 13:30',
          title: `Makan Siang Perpisahan Khas ${destinationLabel}`,
          description: `Santap siang kuliner khas legendaris sebagai penutup manis tour.`,
          location: `Resto Khas ${destinationLabel}`,
          type: 'meal',
          notes: 'Makan siang penutup'
        });

        timeline.push({
          id: `tl-d${day}-6`,
          time: '14:00 - 19:30',
          title: `Perjalanan Tol Trans-Jawa & Drop-off ke ${pickupCity}`,
          description: `Perjalanan tol kembali menuju ${pickupCity}. Armada mengantar langsung ke titik kumpul dengan aman.`,
          location: `${pickupCity} (Titik Drop-off)`,
          type: 'dropoff',
          notes: 'Pengantaran pulang ke kota asal'
        });
      }

      // Standard Local / Short Transit return:
      else {
        if (currentDests.length > 0) {
          const d1 = currentDests[0];
          timeline.push({
            id: `tl-d${day}-3`,
            time: '10:00 - 11:30',
            title: `Kunjungan Destinasi Terakhir: ${d1.name}`,
            description: `Kunjungan wisata penutup yang menyenangkan sebelum waktu kepulangan.`,
            location: d1.name,
            type: 'sightseeing',
            notes: 'Spot penutup'
          });
        }

        timeline.push({
          id: `tl-d${day}-4`,
          time: '12:00 - 13:00',
          title: `Makan Siang Perpisahan Khas ${destinationLabel}`,
          description: `Santap siang kuliner khas legendaris sebagai penutup manis perjalanan wisata.`,
          location: `Restoran Khas ${destinationLabel}`,
          type: 'meal',
          notes: 'Makan siang legendaris'
        });

        const bonusText = bonusItems.length > 0 ? bonusItems.join(' & ') : 'Pusat Oleh-Oleh Khas & Cenderamata';
        timeline.push({
          id: `tl-d${day}-5`,
          time: '13:30 - 15:30',
          title: `Bonus: Belanja Oleh-Oleh & Wisata Ikon Kota`,
          description: `Membeli buah tangan khas (${bonusText}), kaos, kerajinan lokal, dan cinderamata untuk keluarga di rumah.`,
          location: `Sentra Oleh-Oleh Khas ${destinationLabel}`,
          type: 'shopping',
          notes: 'Include oleh-oleh'
        });

        timeline.push({
          id: `tl-d${day}-6`,
          time: '16:00 - 17:30',
          title: `Pengantaran Kembali (Drop-off) ke Bandara / Stasiun / ${pickupCity}`,
          description: `Pengantaran aman tepat waktu menuju Bandara / Stasiun / Titik Kepulangan di ${pickupCity}. Tour selesai dengan kenangan berkesan bersama PERGIDIANTAR!`,
          location: `Bandara / Stasiun / ${pickupCity}`,
          type: 'dropoff',
          notes: 'Pengantaran selesai tepat waktu'
        });
      }
    }

    const dayTitles: Record<number, string> = {
      1: transit.isIntercity && (transit.transitType === 'long_intercity_crossing' || transit.transitType === 'far_intercity')
        ? `Hari 1: Penjemputan di ${pickupCity}, Perjalanan Trans-Jawa & Penyeberangan Ferry ke Bali`
        : transit.isIntercity && transit.transitType === 'medium_intercity'
        ? `Hari 1: Penjemputan di ${pickupCity}, Perjalanan Tol ke ${destinationLabel} & Wisata Pembuka`
        : `Hari 1: Penjemputan di ${pickupCity}, Wisata Ikonik & Check-in Hotel`,
      2: totalDays === 2 
        ? `Hari 2: Wisata Alam, Oleh-Oleh & Pengantaran Kepulangan` 
        : `Hari 2: Eksplorasi Alam & Panorama Memukau ${destinationLabel}`,
      3: totalDays === 3 
        ? `Hari 3: Belanja Oleh-Oleh & Pengantaran Kepulangan` 
        : `Hari 3: Wisata Budaya & Petualangan Seru ${destinationLabel}`,
      4: totalDays === 4 
        ? `Hari 4: Sentra Cenderamata & Drop-Off Kepulangan` 
        : `Hari 4: Wisata Bahari & Relaksasi Keluarga`,
      5: totalDays === 5 
        ? `Hari 5: Belanja Buah Tangan & Kepulangan` 
        : `Hari 5: Eksotisme Panorama & Kuliner Legendaris`,
      6: totalDays === 6 
        ? `Hari 6: Oleh-Oleh Khas & Pengantaran Kepulangan` 
        : `Hari 6: Petualangan Lanjutan & Wisata Edukasi`,
      7: `Hari 7: Belanja Cenderamata & Pengantaran Kembali ke Kota Asal`
    };

    itineraryDays.push({
      day,
      title: dayTitles[day] || `Hari ${day}: Aktivitas Wisata & Eksplorasi ${destinationLabel}`,
      description: isFirstDay 
        ? (transit.isIntercity 
            ? `Perjalanan antar-kota dari ${pickupCity} menuju ${destinationLabel} via tol dan penyeberangan.` 
            : `Penyambutan ramah di ${pickupCity}, wisata pembuka, dan check-in hotel.`)
        : isLastDay 
        ? `Check-out hotel, belanja oleh-oleh khas, dan pengantaran kepulangan ke ${pickupCity}.`
        : `Eksplorasi destinasi favorit, santap kuliner lezat, dan panorama senja.`,
      activities: timeline.map(t => `${t.time} - ${t.title}`),
      timeline
    });
  }

  return itineraryDays;
}

/**
 * Generate default editable timeline items for Admin Package Management
 */
export function createDefaultDayTimeline(dayNumber: number, isLastDay: boolean, cityLabel: string): ItineraryTimelineItem[] {
  if (dayNumber === 1) {
    return [
      {
        id: `tl-edit-${Date.now()}-1`,
        time: '08:00 - 09:30',
        title: `Penjemputan Peserta di Bandara / Stasiun / Hotel`,
        description: `Penyambutan ramah oleh kru & driver berseragam dengan sign board nama tamu. Pemuatan koper ke armada AC dingin.`,
        type: 'pickup',
        notes: 'Supir standby 15 menit sebelumnya'
      },
      {
        id: `tl-edit-${Date.now()}-2`,
        time: '10:00 - 12:00',
        title: `Kunjungan Destinasi Ikonik Pertama di ${cityLabel}`,
        description: `Eksplorasi cagar budaya dan spot foto instagramable unggulan di ${cityLabel}.`,
        type: 'sightseeing',
        notes: 'Tiket masuk tercover paket'
      },
      {
        id: `tl-edit-${Date.now()}-3`,
        time: '12:30 - 13:30',
        title: `Makan Siang Resto Lokal Autentik`,
        description: `Menikmati hidangan lezat masakan tradisional khas daerah di restoran mitra higienis.`,
        type: 'meal',
        notes: 'Makan siang include'
      },
      {
        id: `tl-edit-${Date.now()}-4`,
        time: '14:00 - 15:30',
        title: `Check-in Hotel Mitra & Istirahat`,
        description: `Pembagian kunci kamar hotel mitra, istirahat sejenak setelah perjalanan.`,
        type: 'hotel_checkin',
        notes: 'Check-in hotel resmi'
      },
      {
        id: `tl-edit-${Date.now()}-5`,
        time: '16:00 - 18:00',
        title: `Hunting Sunset & Panorama Senja`,
        description: `Menikmati momen golden hour dan pemandangan sore yang memukau.`,
        type: 'sightseeing',
        notes: 'Spot foto senja'
      },
      {
        id: `tl-edit-${Date.now()}-6`,
        time: '18:30 - 20:00',
        title: `Makan Malam Kuliner Malam Khas`,
        description: `Santap malam bersama rombongan di sentra kuliner khas malam hari.`,
        type: 'meal',
        notes: 'Makan malam hangat'
      },
      {
        id: `tl-edit-${Date.now()}-7`,
        time: '20:30',
        title: `Kembali ke Hotel & Istirahat`,
        description: `Pengantaran kembali ke hotel untuk istirahat malam.`,
        type: 'free_time',
        notes: 'Waktu istirahat'
      }
    ];
  }

  if (isLastDay) {
    return [
      {
        id: `tl-edit-${Date.now()}-1`,
        time: '07:00 - 08:30',
        title: `Sarapan Pagi di Hotel & Packing`,
        description: `Menikmati sarapan pagi buffet hotel dan pengemasan barang bawaan.`,
        type: 'meal',
        notes: 'Sarapan hotel include'
      },
      {
        id: `tl-edit-${Date.now()}-2`,
        time: '09:00 - 10:00',
        title: `Check-out Hotel & Pemuatan Bagasi`,
        description: `Penyelesaian check-out kamar dan pemuatan koper ke dalam armada.`,
        type: 'hotel_checkout',
        notes: 'Check-out selesai'
      },
      {
        id: `tl-edit-${Date.now()}-3`,
        time: '10:30 - 12:00',
        title: `Wisata Belanja Pusat Oleh-Oleh Khas ${cityLabel}`,
        description: `Membeli buah tangan, kerajinan lokal, bakpia/keripik/kaos, dan cenderamata khas daerah.`,
        type: 'shopping',
        notes: 'Sentra oleh-oleh resmi'
      },
      {
        id: `tl-edit-${Date.now()}-4`,
        time: '12:30 - 13:30',
        title: `Makan Siang Perpisahan Khas ${cityLabel}`,
        description: `Makan siang penutup dengan santap kuliner legendaris.`,
        type: 'meal',
        notes: 'Makan siang legendaris'
      },
      {
        id: `tl-edit-${Date.now()}-5`,
        time: '14:00 - 15:30',
        title: `Kunjungan Ikon Kota & Foto Bersama`,
        description: `Sesi dokumentasi foto rombongan di landmark kebanggaan kota.`,
        type: 'sightseeing',
        notes: 'Dokumentasi bersama'
      },
      {
        id: `tl-edit-${Date.now()}-6`,
        time: '16:00 - 17:30',
        title: `Pengantaran ke Bandara / Stasiun (Drop-off)`,
        description: `Pengantaran tepat waktu menuju Bandara / Stasiun. Perjalanan wisata selesai bersama PERGIDIANTAR.`,
        type: 'dropoff',
        notes: 'Pengantaran tepat waktu'
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
      type: 'meal',
      notes: 'Sarapan hotel include'
    },
    {
      id: `tl-edit-${Date.now()}-2`,
      time: '08:30 - 09:00',
      title: `Penjemputan di Lobby Hotel`,
      description: `Driver bersiap di lobby hotel untuk penjemputan tur harian.`,
      type: 'pickup',
      notes: 'Supir standby'
    },
    {
      id: `tl-edit-${Date.now()}-3`,
      time: '09:30 - 11:30',
      title: `Eksplorasi Destinasi Wisata Pagi di ${cityLabel}`,
      description: `Menikmati keindahan alam & wahana rekreasi populer.`,
      type: 'sightseeing',
      notes: 'Wisata pagi'
    },
    {
      id: `tl-edit-${Date.now()}-4`,
      time: '12:00 - 13:00',
      title: `Makan Siang Kuliner Resto Lokal`,
      description: `Makan siang bersama menu khas autentik daerah.`,
      type: 'meal',
      notes: 'Makan siang include'
    },
    {
      id: `tl-edit-${Date.now()}-5`,
      time: '13:30 - 15:30',
      title: `Kunjungan Destinasi Siang / Edukasi`,
      description: `Aktivitas seru dan hunting foto keluarga / rombongan.`,
      type: 'sightseeing',
      notes: 'Rekreasi bersama'
    },
    {
      id: `tl-edit-${Date.now()}-6`,
      time: '16:00 - 18:00',
      title: `Hunting Sunset & Panorama Sore`,
      description: `Menyaksikan keindahan matahari terbenam dengan pemandangan menawan.`,
      type: 'sightseeing',
      notes: 'Sunset indah'
    },
    {
      id: `tl-edit-${Date.now()}-7`,
      time: '18:30 - 20:00',
      title: `Makan Malam Santap Kuliner Malam`,
      description: `Makan malam hangat bersama di restoran pilihan.`,
      type: 'meal',
      notes: 'Makan malam hangat'
    },
    {
      id: `tl-edit-${Date.now()}-8`,
      time: '20:30',
      title: `Kembali ke Hotel & Istirahat`,
      description: `Pengantaran kembali ke hotel untuk memulihkan tenaga.`,
      type: 'free_time',
      notes: 'Waktu istirahat'
    }
  ];
}

/**
 * Ensures that every day of a tour package has a rich, structured timeline.
 * If a package's itinerary has days where timeline is missing or empty,
 * it synthesizes realistic pariwisata hours, categories, titles, and descriptions.
 */
export function ensurePackageTimeline(pkg: TourPackage): ItineraryDay[] {
  if (!pkg.itinerary || pkg.itinerary.length === 0) {
    const totalDays = pkg.durationDays || 3;
    const days: ItineraryDay[] = [];
    for (let d = 1; d <= totalDays; d++) {
      const isLast = d === totalDays;
      const timeline = createDefaultDayTimeline(d, isLast, pkg.destinationLabel || 'Destinasi Wisata');
      days.push({
        day: d,
        title: d === 1 
          ? `Hari 1: Penjemputan, Wisata Ikonik & Check-in Hotel` 
          : isLast 
          ? `Hari ${d}: Belanja Oleh-Oleh & Pengantaran Kepulangan` 
          : `Hari ${d}: Eksplorasi Alam & Budaya Unggulan`,
        description: d === 1
          ? `Penyambutan tamu di titik jemput, wisata pembuka, dan check-in hotel.`
          : isLast
          ? `Check-out hotel, belanja oleh-oleh khas, dan pengantaran kembali.`
          : `Eksplorasi destinasi unggulan, santap kuliner lezat, dan panorama senja.`,
        activities: timeline.map(t => `${t.time} - ${t.title}`),
        timeline
      });
    }
    return days;
  }

  const totalDays = pkg.itinerary.length;
  return pkg.itinerary.map((day, idx) => {
    // If timeline already populated with items, return as is
    if (day.timeline && day.timeline.length > 0) {
      return day;
    }

    // If day has simple string activities, parse them or create structured items
    const isLast = idx === totalDays - 1;
    const synthesizedTimeline: ItineraryTimelineItem[] = [];

    if (day.activities && day.activities.length > 0) {
      day.activities.forEach((act, actIdx) => {
        const timeMatch = act.match(/^(\d{1,2}[:.]\d{2}\s*-\s*\d{1,2}[:.]\d{2}|\d{1,2}[:.]\d{2})/);
        let time = timeMatch ? timeMatch[1].replace('.', ':') : '';
        let title = act;
        if (timeMatch) {
          title = act.substring(timeMatch[0].length).replace(/^[\s\-–—:]+/, '').trim();
        } else {
          // Provide logical default hours based on order in day
          if (idx === 0) {
            time = actIdx === 0 ? '08:00 - 09:30' : actIdx === 1 ? '10:00 - 12:00' : actIdx === 2 ? '12:30 - 13:30' : actIdx === 3 ? '14:00 - 15:30' : actIdx === 4 ? '16:00 - 18:00' : '18:30 - 20:00';
          } else if (isLast) {
            time = actIdx === 0 ? '07:00 - 08:30' : actIdx === 1 ? '09:00 - 10:00' : actIdx === 2 ? '10:30 - 12:00' : actIdx === 3 ? '12:30 - 13:30' : '15:00 - 16:30';
          } else {
            time = actIdx === 0 ? '07:00 - 08:30' : actIdx === 1 ? '09:00 - 11:30' : actIdx === 2 ? '12:00 - 13:00' : actIdx === 3 ? '13:30 - 15:30' : actIdx === 4 ? '16:00 - 18:00' : '18:30 - 20:00';
          }
        }

        const lower = act.toLowerCase();
        let type: ItineraryActivityType = 'sightseeing';
        if (lower.includes('jemput') || lower.includes('drop') || lower.includes('stasiun') || lower.includes('bandara')) {
          type = lower.includes('drop') || lower.includes('pulang') ? 'dropoff' : 'pickup';
        } else if (lower.includes('makan') || lower.includes('sarapan') || lower.includes('kuliner') || lower.includes('lunch') || lower.includes('dinner')) {
          type = 'meal';
        } else if (lower.includes('check-in') || lower.includes('check in')) {
          type = 'hotel_checkin';
        } else if (lower.includes('check-out') || lower.includes('check out')) {
          type = 'hotel_checkout';
        } else if (lower.includes('oleh') || lower.includes('belanja') || lower.includes('cenderamata') || lower.includes('bakpia') || lower.includes('souvenir')) {
          type = 'shopping';
        } else if (lower.includes('istirahat') || lower.includes('bebas')) {
          type = 'free_time';
        }

        synthesizedTimeline.push({
          id: `tl-syn-${day.day}-${actIdx}`,
          time,
          title: title || act,
          description: `Agenda kegiatan ${type.replace('_', ' ')} dalam rangkaian tour ${pkg.destinationLabel}.`,
          type,
          notes: 'Jadwal terpadu paket tour'
        });
      });
    } else {
      // Fallback to default day template
      synthesizedTimeline.push(...createDefaultDayTimeline(day.day, isLast, pkg.destinationLabel || 'Destinasi Wisata'));
    }

    return {
      ...day,
      timeline: synthesizedTimeline
    };
  });
}
