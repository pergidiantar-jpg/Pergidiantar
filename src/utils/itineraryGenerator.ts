/**
 * Itinerary Generator & Timeline Utilities for PERGIDIANTAR
 * Handles automatic chronological scheduling for Custom Trip Calculator
 * and default template generation for Admin Package Management.
 */

import { 
  ItineraryDay, 
  ItineraryTimelineItem, 
  ItineraryActivityType, 
  DestinationRegion 
} from '../types/travel';
import { DestinationOption } from '../data/destinationsData';

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
 */
export function generateCustomTripItinerary(params: GenerateCustomItineraryParams): ItineraryDay[] {
  const {
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

    // --- DAY 1: ARRIVAL, SIGHTSEEING, CHECK-IN, NIGHT CULINARY ---
    if (isFirstDay) {
      // 1. Pickup
      timeline.push({
        id: `tl-d1-1`,
        time: '08:00 - 09:00',
        title: `Penjemputan di ${pickupCity || 'Titik Kumpul'}`,
        description: `Penyambutan ramah oleh driver & kru berseragam PERGIDIANTAR dengan armada ber-AC bersih. Pemuatan bagasi aman.`,
        location: pickupCity || 'Bandara / Stasiun',
        type: 'pickup'
      });

      // 2. Morning / Early Sightseeing
      if (currentDests.length > 0) {
        const d1 = currentDests[0];
        timeline.push({
          id: `tl-d1-2`,
          time: '09:30 - 11:30',
          title: `Eksplorasi ${d1.name}`,
          description: `Kunjungan destinasi ${d1.category || 'wisata unggulan'} di ${destinationLabel}. ${d1.highlight || 'Spot foto favorit dan panorama terbaik.'}`,
          location: d1.name,
          type: 'sightseeing'
        });
      }

      // 3. Lunch (if lunch requested)
      timeline.push({
        id: `tl-d1-3`,
        time: '12:00 - 13:00',
        title: `Makan Siang Resto Lokal Autentik`,
        description: lunchCount > 0 
          ? `Menikmati hidangan makan siang kuliner khas ${destinationLabel} di restoran mitra higienis & lezat.`
          : `Istirahat santap makan siang di kawasan kuliner populer rekomendasi driver.`,
        location: `Restoran Kuliner Khas ${destinationLabel}`,
        type: 'meal'
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
          type: 'hotel_checkin'
        });
      }

      // 6. Sunset / Evening Spot if any extra
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
        type: 'meal'
      });

      // 8. Return to hotel
      timeline.push({
        id: `tl-d1-8`,
        time: '21:00',
        title: hasHotel ? `Kembali ke Hotel & Istirahat Malam` : `Pengantaran ke Penginapan & Istirahat`,
        description: `Armada mengantar kembali ke hotel untuk beristirahat memulihkan energi untuk petualangan esok hari.`,
        location: effectiveHotelName,
        type: 'free_time'
      });
    }

    // --- INTERMEDIATE DAYS: FULL DAY EXPLORATION ---
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
        type: 'meal'
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
          type: 'sightseeing'
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
        type: 'meal'
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
        type: 'meal'
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

    // --- FINAL DAY: SIGHTSEEING, CHECK-OUT, OLEH-OLEH & DROPOFF ---
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
          time: '09:00 - 10:00',
          title: `Proses Check-out Hotel & Pemuatan Bagasi`,
          description: `Penyelesaian administrasi hotel, kunci kamar diserahkan ke resepsionis, dan koper dimuat ke armada.`,
          location: effectiveHotelName,
          type: 'hotel_checkout'
        });
      }

      // 3. Final Destinasi Wisata
      if (currentDests.length > 0) {
        const d1 = currentDests[0];
        timeline.push({
          id: `tl-d${day}-3`,
          time: '10:30 - 12:00',
          title: `Kunjungan Destinasi Terakhir: ${d1.name}`,
          description: `Kunjungan wisata penutup yang menyenangkan sebelum waktu kepulangan.`,
          location: d1.name,
          type: 'sightseeing'
        });
      }

      // 4. Lunch
      timeline.push({
        id: `tl-d${day}-4`,
        time: '12:30 - 13:30',
        title: `Makan Siang Perpisahan Khas ${destinationLabel}`,
        description: `Santap siang kuliner khas legendaris sebagai penutup manis perjalanan wisata.`,
        location: `Restoran Khas ${destinationLabel}`,
        type: 'meal'
      });

      // 5. Bonus Oleh-Oleh & Ikon Kota
      const bonusText = bonusItems.length > 0 ? bonusItems.join(' & ') : 'Pusat Oleh-Oleh Khas & Cenderamata';
      timeline.push({
        id: `tl-d${day}-5`,
        time: '14:00 - 15:30',
        title: `Bonus: Belanja Oleh-Oleh & Wisata Ikon Kota`,
        description: `Membeli buah tangan khas (${bonusText}), kaos, kerajinan lokal, dan cinderamata untuk keluarga di rumah.`,
        location: `Sentra Oleh-Oleh Khas ${destinationLabel}`,
        type: 'shopping'
      });

      // 6. Dropoff to airport / station
      timeline.push({
        id: `tl-d${day}-6`,
        time: '16:00 - 17:30',
        title: `Pengantaran Kembali (Drop-off) ke Bandara / Stasiun`,
        description: `Pengantaran aman tepat waktu menuju Bandara / Stasiun / Titik Kepulangan. Tour selesai dengan kenangan berkesan bersama PERGIDIANTAR!`,
        location: `Bandara / Stasiun / Titik Drop-off`,
        type: 'dropoff'
      });
    }

    const dayTitles: Record<number, string> = {
      1: `Hari 1: Penjemputan, Wisata Ikonik & Check-in Hotel`,
      2: totalDays === 2 ? `Hari 2: Wisata Alam, Oleh-Oleh & Kepulangan` : `Hari 2: Eksplorasi Alam & Panorama Memukau`,
      3: totalDays === 3 ? `Hari 3: Belanja Oleh-Oleh & Pengantaran Kepulangan` : `Hari 3: Wisata Budaya & Petualangan Seru`,
      4: totalDays === 4 ? `Hari 4: Sentra Cenderamata & Drop-Off Bandara` : `Hari 4: Wisata Bahari & Relaksasi Keluarga`,
      5: totalDays === 5 ? `Hari 5: Belanja Buah Tangan & Kepulangan` : `Hari 5: Eksotisme Panorama & Kuliner Legendaris`,
      6: totalDays === 6 ? `Hari 6: Oleh-Oleh Khas & Pengantaran Bandara` : `Hari 6: Petualangan Lanjutan & Wisata Edukasi`,
      7: `Hari 7: Belanja Cenderamata & Pengantaran Kembali ke Bandara`
    };

    itineraryDays.push({
      day,
      title: dayTitles[day] || `Hari ${day}: Aktivitas Wisata & Eksplorasi ${destinationLabel}`,
      description: isFirstDay 
        ? `Penyambutan ramah di ${pickupCity}, wisata pembuka, dan check-in hotel.`
        : isLastDay 
        ? `Check-out hotel, belanja oleh-oleh khas, dan pengantaran pulang ke bandara/stasiun.`
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
        title: `Penjemputan Peserta di Bandara / Stasiun`,
        description: `Penyambutan tamu dengan sign board nama rombongan, armada AC dingin, dan pemuatan koper.`,
        type: 'pickup'
      },
      {
        id: `tl-edit-${Date.now()}-2`,
        time: '10:00 - 12:00',
        title: `Kunjungan Destinasi Ikonik Pertama`,
        description: `Eksplorasi cagar budaya dan spot foto instagramable.`,
        type: 'sightseeing'
      },
      {
        id: `tl-edit-${Date.now()}-3`,
        time: '12:30 - 13:30',
        title: `Makan Siang Resto Lokal Autentik`,
        description: `Menikmati hidangan lezat masakan tradisional khas daerah.`,
        type: 'meal'
      },
      {
        id: `tl-edit-${Date.now()}-4`,
        time: '14:00 - 15:30',
        title: `Check-in Hotel Mitra & Istirahat`,
        description: `Pembagian kunci kamar hotel mitra, istirahat sejenak setelah perjalanan.`,
        type: 'hotel_checkin'
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
        type: 'hotel_checkout'
      },
      {
        id: `tl-edit-${Date.now()}-3`,
        time: '10:30 - 12:00',
        title: `Wisata Belanja Pusat Oleh-Oleh Khas`,
        description: `Membeli buah tangan, kerajinan lokal, bakpia, dodol, kaos, dan cenderamata khas daerah.`,
        type: 'shopping'
      },
      {
        id: `tl-edit-${Date.now()}-4`,
        time: '12:30 - 13:30',
        title: `Makan Siang Perpisahan`,
        description: `Makan siang penutup dengan santap kuliner legendaris.`,
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
        type: 'dropoff'
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
      type: 'sightseeing'
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
