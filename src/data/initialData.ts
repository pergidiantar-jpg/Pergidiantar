import { TourPackage, FleetUnit, DriverCrew, HotelPartner, BookingOrder, ChatMessage, NotificationItem, UserProfile, VendorPayment } from '../types/travel';

export const INITIAL_PACKAGES: TourPackage[] = [
  {
    id: 'pkg-jogja-single',
    title: 'Single Trip Heritage & Scenic Jogja',
    category: 'single_trip',
    categoryLabel: 'Single Trip',
    destinations: ['jogja'],
    destinationLabel: 'Yogyakarta',
    durationDays: 2,
    durationNights: 1,
    heroImage: '/src/assets/images/dest_jogja_heritage_1793579234240.jpg',
    priceHematPerPax: 950000,
    priceAllInPerPax: 1450000,
    minPax: 1,
    maxPax: 4,
    recommendedVehicle: 'Toyota HiAce Premio / Private Car AC',
    highlightPoints: [
      'Private trip solo/duo tanpa digabung orang asing',
      'Eksplor Candi Prambanan & Sunset Ratu Boko',
      'Merapi Jeep Lava Tour Sunrise',
      'Spot foto HeHa Sky View & Kuliner Khas Malioboro'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Kedatangan & Heritage Splendor',
        description: 'Penjemputan di Stasiun Tugu/Bandara YIA, check-in, dan eksplorasi cagar budaya bersejarah.',
        activities: [
          'Penjemputan khusus oleh driver & armada PERGIDIANTAR',
          'Tour Tamansari Water Castle & Keraton Yogyakarta',
          'Makan siang kuliner khas Gudeg Yu Djum legendaris',
          'Kunjungan Candi Prambanan hingga sunset di Spot Candi Ratu Boko',
          'Check-in hotel istirahat dan wisata malam Malioboro'
        ]
      },
      {
        day: 2,
        title: 'Adventure Merapi & Scenic Panorama',
        description: 'Sensasi seru offroad Merapi dan panorama perbukitan sebelum pengantaran kembali.',
        activities: [
          'Sarapan di hotel dan check-out',
          'Sunrise Jeep Tour Merapi (Bunker Kaliadem, Batu Alien, Museum Sisa Hartaku)',
          'Makan siang di Kopi Klotok Pakem Sleman',
          'HeHa Sky View panorama kota Jogja dari ketinggian',
          'Belanja oleh-oleh Bakpia Kukus & antar ke Stasiun/Bandara'
        ]
      }
    ],
    included: {
      transport: 'Kendaraan, driver, bbm, parkir (Termasuk Paket Hemat & All In)',
      accommodation: 'Hotel Bintang 3-4 Mitra Pilihan (Termasuk Paket All In)',
      meals: 'Makan 1x di hotel dan 2x/ hari di luar hotel (Termasuk Paket All In)',
      tickets: [
        'Tiket Masuk Candi Prambanan',
        'Tiket Masuk Keraton & Tamansari',
        'Tiket Jeep Merapi Lava Tour (Unit Short Route)',
        'Tiket HeHa Sky View VIP access'
      ],
      additional: [
        'Air mineral botol 600ml setiap hari',
        'Snack box kedatangan',
        'P3K standar perjalanan',
        'Dokumentasi foto oleh driver'
      ]
    }
  },
  {
    id: 'pkg-jogja-family',
    title: 'Family Trip Sweet Jogja Memories',
    category: 'family_trip',
    categoryLabel: 'Family Trip',
    destinations: ['jogja'],
    destinationLabel: 'Yogyakarta',
    durationDays: 3,
    durationNights: 2,
    heroImage: '/src/assets/images/hero_pergidiantar_travel_1793579233622.jpg',
    priceHematPerPax: 1350000,
    priceAllInPerPax: 1980000,
    minPax: 4,
    maxPax: 12,
    badge: 'Terfavorit Keluarga',
    recommendedVehicle: 'Toyota HiAce Premio Luxury (14 Seats)',
    highlightPoints: [
      'Itinerary santai dan fleksibel, sangat ramah anak-anak & lansia',
      'Jeep Merapi ramah keluarga & Sungai Oya Rafting santai',
      'Hotel keluarga bintang 4 dengan kolam renang & sarapan lengkap',
      'Driver berpengalaman merangkap tour assistant keluarga'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Welcome to Jogja & Cultural Exploration',
        description: 'Penyambutan keluarga besar dengan armada nyaman ber-AC dingin.',
        activities: [
          'Penjemputan bandara YIA / Stasiun Tugu dengan HiAce Premio',
          'Makan siang ayam goreng khas Kalasan & kopi nusantara',
          'Kunjungan Candi Borobudur dan Museum Karmawibhangga',
          'Check-in hotel bintang pilihan & istirahat sejenak',
          'Makan malam keluarga di Resto Bale Raos istana'
        ]
      },
      {
        day: 2,
        title: 'Alam Merapi & Serunya Gua Pindul',
        description: 'Aktivitas alam yang aman dan menyenangkan untuk seluruh generasi.',
        activities: [
          'Sarapan buffet lezat di hotel',
          'Lava Tour Merapi jalur santai (Bunker & Tebing Breksi)',
          'Makan siang prasmanan masakan ndeso tepi sawah',
          'Cave Tubing Goa Pindul & Body Rafting Sungai Oya (jaket pelampung lengkap)',
          'Sunset di Obelix Hills dengan pemandangan lampu kota malam hari'
        ]
      },
      {
        day: 3,
        title: 'Belanja Tradisi & Farewell Jogja',
        description: 'Membeli buah tangan khas dan santap penutup sebelum kepulangan.',
        activities: [
          'Sarapan hotel & proses check-out santai',
          'Belanja batik di Pasar Beringharjo & pusat oleh-oleh Bakpia',
          'Makan siang di Jejamuran Resto',
          'Pengantaran ke Stasiun/Bandara dengan kenangan manis'
        ]
      }
    ],
    included: {
      transport: 'Kendaraan, driver, bbm, parkir (Termasuk Paket Hemat & All In)',
      accommodation: '2 Malam di Hotel Bintang 4 Mitra (Termasuk Paket All In)',
      meals: 'Makan 1x di hotel dan 2x/ hari di luar hotel (Termasuk Paket All In)',
      tickets: [
        'Tiket Candi Borobudur / Prambanan',
        'Paket Jeep Merapi Family',
        'Tiket & Peralatan Cave Tubing Goa Pindul + Guide lokal',
        'Tiket Tebing Breksi & Obelix Hills'
      ],
      additional: [
        'Air mineral & minuman segar setiap hari',
        'Snack box aneka kue tradisional Jogja',
        'Hand sanitizer & tisu basah',
        'Dokumentasi foto & video pendek keluarga'
      ]
    }
  },
  {
    id: 'pkg-gathering-jogja',
    title: 'Family Gathering Jogja Istimewa',
    category: 'family_gathering',
    categoryLabel: 'Family Gathering',
    destinations: ['jogja'],
    destinationLabel: 'Yogyakarta',
    durationDays: 3,
    durationNights: 2,
    heroImage: '/src/assets/images/dest_jogja_heritage_1793579234240.jpg',
    priceHematPerPax: 1550000,
    priceAllInPerPax: 2250000,
    minPax: 15,
    maxPax: 80,
    recommendedVehicle: 'Medium Bus Jetbus 5 (33s) / Konvoi HiAce Premio',
    highlightPoints: [
      'Dirancang khusus untuk trah keluarga besar & perkumpulan komunitas',
      'Fun Games & Ice Breaking dipandu Game Master profesional',
      'Gala Dinner keakraban dengan panggung & sound system',
      'Akomodasi villa resort terpadu / hotel bintang kapasitas luas'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Konvoi Tiba di Yogyakarta & Ice Breaking',
        description: 'Tiba bersama, briefing acara keluarga besar, dan makan siang bersama.',
        activities: [
          'Penjemputan rombongan dengan armada bus pariwisata ber-AC dingin',
          'Makan siang sambung rasa di restoran tepi Kaliurang',
          'Check-in resort/hotel, pembagian kunci kamar terkoordinir',
          'Fun games santai keakraban di halaman resort',
          'Makan malam BBQ santai di tepi kolam'
        ]
      },
      {
        day: 2,
        title: 'Tour Pesona Candi & Gala Dinner Keluarga',
        description: 'Wisata bersama dan puncak acara malam keakraban keluarga.',
        activities: [
          'Sarapan bersama di resort',
          'Wisata Candi Prambanan dan Tebing Breksi',
          'Makan siang prasmanan khas tradisional',
          'Eksplorasi Malioboro dan Titik Nol Jogja',
          'Malam puncak: Gala Dinner, pembagian doorprize, pemutaran video kenangan'
        ]
      },
      {
        day: 3,
        title: 'Belanja Bersama & Pengantaran Rombongan',
        description: 'Hari terakhir belanja cinderamata dan foto bersama armada.',
        activities: [
          'Sarapan buffet dan sesi foto keluarga besar berlatar Merapi',
          'Belanja Bakpia Pathuk & batik Grosir',
          'Makan siang penutup dan drop off ke Stasiun/Bandara'
        ]
      }
    ],
    included: {
      transport: 'Unit Bus Pariwisata Medium/Big Bus, Driver & Crew, BBM, Tol, Parkir bus khusus',
      accommodation: '2 Malam Kamar Hotel Bintang / Resort Kapasitas Besar Twin/Triple Share',
      meals: 'Makan prasmanan 3x sehari + Gala Dinner BBQ khusus',
      tickets: [
        'Tiket Candi Prambanan rombongan',
        'Tiket Tebing Breksi rombongan',
        'Fasilitas fun games & peralatan outbound'
      ],
      additional: [
        'Banner/Spanduk Acara 4x1 Meter eksklusif',
        'MC / Fun Game Master berlisensi',
        'Sound system portable & mic wireless',
        'Dokumentasi Drone & Foto fotografer profesional'
      ]
    }
  },
  {
    id: 'pkg-gathering-malang',
    title: 'Family Gathering Malang & Bromo Adventure',
    category: 'family_gathering',
    categoryLabel: 'Family Gathering',
    destinations: ['malang'],
    destinationLabel: 'Malang & Bromo',
    durationDays: 3,
    durationNights: 2,
    heroImage: '/src/assets/images/dest_malang_bromo_1793579235303.jpg',
    priceHematPerPax: 1750000,
    priceAllInPerPax: 2550000,
    minPax: 12,
    maxPax: 60,
    recommendedVehicle: 'Medium Bus Pariwisata + Hardtop 4x4 Bromo',
    highlightPoints: [
      'Sunrise magis Gunung Bromo dengan konvoi Jeep Hardtop',
      'Petik Apel langsung di kebun Batu Malang',
      'Wahana seru Jatim Park 3 & Museum Angkut',
      'Udara sejuk pegunungan yang menyegarkan seluruh keluarga'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Eksplorasi Kota Apel Batu Malang',
        description: 'Tiba di Malang/Surabaya, menuju kawasan sejuk Batu.',
        activities: [
          'Penjemputan di Stasiun Malang Kotabaru / Bandara Juanda',
          'Makan siang Rawon Nguling legendaris Malang',
          'Wisata edukasi petik apel sepuasnya di perkebunan Batu',
          'Eksplorasi spektakuler Museum Angkut Movie Star Studio',
          'Check-in hotel di Batu dan makan malam suasana pegunungan'
        ]
      },
      {
        day: 2,
        title: 'Midnight Bromo Sunrise Expedition & Kawah',
        description: 'Sensasi petualangan kaldera Bromo terindah di dunia.',
        activities: [
          'Dini hari (00.30) bersiap naik armada bus transit ke rest area Jeep Bromo',
          'Konvoi Jeep 4x4 ke Penanjakan 1 / Kingkong Hill menyaksikan Golden Sunrise',
          'Eksplor Pasir Berbisik, Bukit Teletubbies, dan trekking ke Kawah Bromo',
          'Kembali ke hotel sarapan, istirahat dan mandi air hangat',
          'Sore santai di Flora Wisata San Terra & makan malam kuliner Bakso Malang'
        ]
      },
      {
        day: 3,
        title: 'Oleh-Oleh Khas Malang & Sayonara',
        description: 'Membeli keripik buah khas Malang dan persiapan pulang.',
        activities: [
          'Sarapan hotel & check-out',
          'Belanja keripik apel, pia mangkok & strudel Malang',
          'Makan siang soto ayam khas Jawa Timur',
          'Pengantaran ke Stasiun Malang / Bandara'
        ]
      }
    ],
    included: {
      transport: 'Armada Bus Pariwisata AC dingin + Armada Jeep Hardtop 4x4 Bromo, Driver, BBM & Tol',
      accommodation: '2 Malam Hotel Bintang 3-4 di kawasan sejuk Batu Malang',
      meals: 'Makan teratur (prasmanan lezat khas Jawa Timur), snack hangat di Bromo',
      tickets: [
        'Tiket Masuk TNBTS Bromo & Sewa Jeep',
        'Tiket Kebun Petik Apel Batu',
        'Tiket Museum Angkut',
        'Tiket Flora Wisata San Terra'
      ],
      additional: [
        'Air mineral hangat & dingin',
        'Masker & jas hujan darurat di Bromo',
        'Banner Gathering keluarga',
        'Dokumentasi foto perjalanan'
      ]
    }
  },
  {
    id: 'pkg-gathering-bali',
    title: 'Family Gathering Pesona Pulau Dewata Bali',
    category: 'family_gathering',
    categoryLabel: 'Family Gathering',
    destinations: ['bali'],
    destinationLabel: 'Bali',
    durationDays: 4,
    durationNights: 3,
    heroImage: '/src/assets/images/dest_bali_paradise_1793579235747.jpg',
    priceHematPerPax: 2200000,
    priceAllInPerPax: 3250000,
    minPax: 10,
    maxPax: 80,
    badge: 'Best Seller Gathering',
    recommendedVehicle: 'Executive Tourism Bus Bali / Toyota HiAce',
    highlightPoints: [
      'Sunset Uluwatu dengan Tari Kecak spektakuler',
      'Pantai Pandawa, Melasti, dan Tanjung Benoa Watersport',
      'Seafood Dinner Jimbaran di tepi pantai pasir putih romantis',
      'Pengalaman budaya Bali autentik di Desa Penglipuran'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Om Swastyastu Bali & Sunset Tanah Lot',
        description: 'Penyambutan khas kalungan bunga di Bandara Ngurah Rai.',
        activities: [
          'Penjemputan bandara dengan kalungan bunga frangipani Bali',
          'Makan siang Ayam Betutu Khas Gilimanuk',
          'Mengunjungi Pura Tanah Lot di atas bongkahan batu karang samudra',
          'Check-in hotel di Kuta/Seminyak',
          'Makan malam lokal dan istirahat'
        ]
      },
      {
        day: 2,
        title: 'Pesona Bali Selatan & Jimbaran Seafood',
        description: 'Eksplorasi tebing kapur eksotis dan pantai pasir putih.',
        activities: [
          'Sarapan buffet di hotel',
          'Watersport seru di Pantai Tanjung Benoa (Banana boat included All In)',
          'Tebing eksotis Pantai Melasti & Pantai Pandawa',
          'Pura Luhur Uluwatu tebing karang 70 meter & Tari Kecak Api',
          'Romantic Dinner Seafood di Pantai Jimbaran bertabur lilin'
        ]
      },
      {
        day: 3,
        title: 'Desa Terbersih Dunia Penglipuran & Kintamani',
        description: 'Sejuknya udara kaldera Gunung Batur dan desa adat terawat.',
        activities: [
          'Sarapan hotel',
          'Wisata budaya Desa Adat Penglipuran & Hutan Bambu',
          'Makan siang buffet di Kintamani dengan view Gunung & Danau Batur',
          'Eksplorasi kebun kopi luwak & Pura Tirta Empul Tampaksiring',
          'Makan malam di restoran khas Sanur'
        ]
      },
      {
        day: 4,
        title: 'Belanja Oleh-Oleh Krisna & Airport Transfer',
        description: 'Berburu suvenir Bali sebelum penerbangan pulang.',
        activities: [
          'Sarapan di hotel dan check-out',
          'Belanja kaos Joger & pusat oleh-oleh Krisna Agung',
          'Makan siang bebek tepi sawah',
          'Pengantaran ke Bandara Internasional I Gusti Ngurah Rai'
        ]
      }
    ],
    included: {
      transport: 'Unit Bus Pariwisata AC Bali / HiAce Premio, Driver lokal & Tour Guide HPI berlisensi, BBM, Parkir',
      accommodation: '3 Malam Hotel Bintang 3-4 di area Kuta / Legian / Seminyak',
      meals: 'Makan 3x sehari lengkap termasuk Gala Seafood Dinner Jimbaran',
      tickets: [
        'Tiket Tari Kecak Uluwatu',
        'Tiket Desa Penglipuran',
        'Tiket Tanah Lot & Pura Uluwatu',
        'Tiket Pantai Melasti & Pandawa'
      ],
      additional: [
        'Kalungan bunga selamat datang',
        'Banner kegiatan keluarga',
        'Dokumentasi DSLR & drone (All In)',
        'Air mineral dingin selalu sedia'
      ]
    }
  },
  {
    id: 'pkg-company-jogja',
    title: 'Company Gathering & Team Building Jogja',
    category: 'company_gathering',
    categoryLabel: 'Company Gathering',
    destinations: ['jogja'],
    destinationLabel: 'Yogyakarta',
    durationDays: 3,
    durationNights: 2,
    heroImage: '/src/assets/images/fleet_hiace_bus_pergidiantar_1793579236036.jpg',
    priceHematPerPax: 1650000,
    priceAllInPerPax: 2450000,
    minPax: 20,
    maxPax: 150,
    badge: 'Paket Korporat Unggulan',
    recommendedVehicle: 'Konvoi Big Bus Pariwisata HDD 50 Seats',
    highlightPoints: [
      'Program Team Building & Capacity Building tersertifikasi BNSP',
      'Meningkatkan sinergi & kekompakan tim perusahaan (collaboration boost)',
      'Gala Dinner Perusahaan lengkap dengan Multimedia, Lighting & Band Pengiring',
      'Faktur pajak resmi perusahaan, PO/Invoice term of payment fleksibel'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival, Corporate Kickoff & Warm Up',
        description: 'Tiba di Yogyakarta dengan sambutan eksekutif PERGIDIANTAR.',
        activities: [
          'Penjemputan VIP dari stasiun/bandara dengan armada bus eksekutif',
          'Makan siang prasmanan eksekutif di Restoran Bale Raos',
          'Check-in hotel berbintang dengan ruang ballroom siap pakai',
          'Sesi pembukaan internal perusahaan & Ice Breaking Games',
          'Makan malam prasmanan santai di ballroom'
        ]
      },
      {
        day: 2,
        title: 'Full Day Team Building & Gala Night',
        description: 'Simulasi outbound dinamika kelompok dan malam penganugerahan.',
        activities: [
          'Sarapan bergizi di hotel',
          'Outbound Capacity Building di kawasan Kaliurang (Fun, Teamwork, Leadership)',
          'Makan siang buffet outdoor di bawah rindang pinus',
          'Lava Tour Merapi jalur basah Kali Kuning (seru & membangun adrenalin)',
          'Puncak Acara: Gala Dinner Perusahaan, Awarding Night, Live Music Acoustic'
        ]
      },
      {
        day: 3,
        title: 'Jogja Heritage Souvenir & Farewell',
        description: 'Belanja cinderamata khas untuk keluarga di rumah.',
        activities: [
          'Sarapan buffet hotel dan penyerahan plakat/sertifikat kegiatan',
          'Kunjungan belanja sentra batik dan kuliner oleh-oleh',
          'Makan siang prasmanan penutup',
          'Drop off rombongan ke Stasiun Tugu / Bandara YIA dengan aman'
        ]
      }
    ],
    included: {
      transport: 'Unit Big Bus Pariwisata HDD (AC, Reclining Seats, USB Charger, Karaoke), Driver & Crew, BBM, Tol, Parkir',
      accommodation: '2 Malam di Hotel Bintang 4-5 dengan fasilitas Ballroom luas (Twin Share)',
      meals: 'Makan 3x sehari prasmanan korporat + Coffee Break 2x sehari + Gala Dinner Menu Eksklusif',
      tickets: [
        'Area privat Team Building di Kaliurang',
        'Jeep Merapi khusus rute seru Kali Kuning',
        'Peralatan games outbound lengkap & fasilitator profesional'
      ],
      additional: [
        'MC profesional pemandu acara',
        'Live acoustic band pengiring gala dinner',
        'Sound system 5000 watt, mic wireless & panggung mini',
        'Fotografer & videografer dengan hasil video aftermovie 4K cinematic',
        'Invoice, Kwitansi resmi & kelengkapan administrasi kantor'
      ]
    }
  },
  {
    id: 'pkg-studytour-jogja',
    title: 'Study Tour Edukasi & Budaya Jogja Istimewa',
    category: 'study_tour',
    categoryLabel: 'Study Tour',
    destinations: ['jogja'],
    destinationLabel: 'Yogyakarta',
    durationDays: 3,
    durationNights: 2,
    heroImage: '/src/assets/images/dest_jogja_heritage_1793579234240.jpg',
    priceHematPerPax: 1150000,
    priceAllInPerPax: 1650000,
    minPax: 30,
    maxPax: 250,
    recommendedVehicle: 'Konvoi Big Bus Pariwisata SHD 50 Seats',
    highlightPoints: [
      'Kurikulum edukasi interaktif sejarah, astronomi & vulkanologi',
      'Kunjungan kampus ternama (UGM / ISI) & Museum Benteng Vredeburg',
      'Keamanan siswa prioritas utama dengan asuransi perjalanan Jasa Raharja',
      'Bonus free seat untuk Guru Pendamping & Panitia Sekolah'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Kedatangan Siswa & Eksplorasi Sains Sejarah',
        description: 'Mengenal sejarah peradaban dan sains terapan.',
        activities: [
          'Penyambutan armada bus di Jogja dengan pengawalan ramah',
          'Kunjungan edukasi Museum Benteng Vredeburg & Keraton Yogyakarta',
          'Makan siang prasmanan lezat dan higienis',
          'Praktik sains di Taman Pintar Yogyakarta (Planetarium)',
          'Check-in hotel ramah pelajar dan makan malam'
        ]
      },
      {
        day: 2,
        title: 'Vulkanologi Merapi & Heritage Prambanan',
        description: 'Belajar langsung fenomena geologi dan sejarah arsitektur Hindu kuno.',
        activities: [
          'Sarapan di hotel',
          'Kunjungan edukasi Museum Gunung Merapi (Erupsi & Simulasi gempa)',
          'Makan siang di restoran lokal',
          'Observasi arsitektur dan relief Candi Prambanan didampingi pemandu edukasi',
          'Wisata belanja hemat di Malioboro didampingi guru pendamping'
        ]
      },
      {
        day: 3,
        title: 'Kunjungan Kampus Edukasi & Kepulangan',
        description: 'Memotivasi masa depan siswa dengan campus tour.',
        activities: [
          'Sarapan hotel dan check-out',
          'Campus tour Universitas Gadjah Mada (UGM) / sentra batik edukasi',
          'Makan siang bersama dan evaluasi lembar kerja siswa (LKS)',
          'Perjalanan pulang kembali ke kota asal'
        ]
      }
    ],
    included: {
      transport: 'Big Bus Pariwisata SHD kapasitas 50 kursi, Driver berpengalaman, BBM, Tol, Parkir',
      accommodation: '2 Malam Hotel Bintang 3 Bersih & Aman, kapasitas 3-4 siswa/kamar',
      meals: 'Makan teratur 3x sehari gizi seimbang, snack & air mineral harian',
      tickets: [
        'Tiket Candi Prambanan paket pelajar',
        'Tiket Museum Benteng Vredeburg',
        'Tiket Taman Pintar & Dome Planetarium',
        'Tiket Museum Gunung Merapi'
      ],
      additional: [
        'Lembar Kerja Siswa (Study Guide)',
        'Tour Leader khusus mendampingi setiap unit bus',
        'Spanduk Study Tour sekolah & dokumentasi foto',
        'Asuransi perjalanan wisata resmi'
      ]
    }
  },
  {
    id: 'pkg-studytour-malang',
    title: 'Study Tour Agrowisata & Sains Malang Bromo',
    category: 'study_tour',
    categoryLabel: 'Study Tour',
    destinations: ['malang'],
    destinationLabel: 'Malang & Batu',
    durationDays: 3,
    durationNights: 2,
    heroImage: '/src/assets/images/dest_malang_bromo_1793579235303.jpg',
    priceHematPerPax: 1350000,
    priceAllInPerPax: 1850000,
    minPax: 30,
    maxPax: 200,
    recommendedVehicle: 'Konvoi Big Bus Pariwisata Eksekutif',
    highlightPoints: [
      'Wisata edukasi biologi & pertanian di Agrowisata Petik Apel Kusuma',
      'Laboratorium sains interaktif di Eco Green Park & Jatim Park 2',
      'Edukasi geologi kaldera Bromo dan konservasi alam TNBTS',
      'Penginapan aman dengan pengawasan guru pendamping'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Tiba di Kota Dingin Malang & Edukasi Transportasi',
        description: 'Mengenal sejarah teknologi transportasi dunia.',
        activities: [
          'Penjemputan rombongan bus sekolah di Malang',
          'Makan siang prasmanan',
          'Belajar sejarah teknologi kendaraan di Museum Angkut & D\'Topeng',
          'Check-in hotel di Kota Batu & briefing malam'
        ]
      },
      {
        day: 2,
        title: 'Laboratorium Alam: Eco Green Park & Batu Secret Zoo',
        description: 'Edukasi ekologi, daur ulang limbah dan konservasi satwa langka.',
        activities: [
          'Sarapan di hotel',
          'Eksplorasi Eco Green Park (pembangkit listrik tenaga angin, daur ulang sampah)',
          'Makan siang siswa di resto area Jatim Park',
          'Edukasi keanekaragaman hayati di Museum Satwa & Batu Secret Zoo',
          'Makan malam dan istirahat'
        ]
      },
      {
        day: 3,
        title: 'Agrowisata Apel & Kembali ke Asal',
        description: 'Mempelajari budidaya apel khas pegunungan Batu.',
        activities: [
          'Sarapan hotel & check-out',
          'Praktek budidaya tanaman apel dan petik apel langsung di kebun',
          'Makan siang dan belanja oleh-oleh khas Malang',
          'Perjalanan kembali ke sekolah dengan wawasan baru'
        ]
      }
    ],
    included: {
      transport: 'Big Bus Pariwisata Eksekutif, Driver berpengalaman, BBM, Tol & Parkir',
      accommodation: '2 Malam Hotel Bintang di Batu Malang (3-4 siswa per kamar)',
      meals: 'Makan 3x sehari prasmanan bergizi, snack & air mineral harian',
      tickets: [
        'Tiket Eco Green Park & Batu Secret Zoo',
        'Tiket Museum Angkut',
        'Tiket Agrowisata Petik Apel Kusuma'
      ],
      additional: [
        'Tour guide edukatif untuk tiap kelompok',
        'Banner kegiatan sekolah',
        'Asuransi perjalanan',
        'Free seat 1 guru pendamping per 20 siswa'
      ]
    }
  },
  {
    id: 'pkg-studytour-bali',
    title: 'Study Tour Budaya Maritim & Konservasi Bali',
    category: 'study_tour',
    categoryLabel: 'Study Tour',
    destinations: ['bali'],
    destinationLabel: 'Bali',
    durationDays: 4,
    durationNights: 3,
    heroImage: '/src/assets/images/dest_bali_paradise_1793579235747.jpg',
    priceHematPerPax: 1850000,
    priceAllInPerPax: 2650000,
    minPax: 30,
    maxPax: 200,
    recommendedVehicle: 'Konvoi Big Bus Pariwisata SHD',
    highlightPoints: [
      'Edukasi pelestarian penyu langka di Pulau Penyu Tanjung Benoa',
      'Belajar toleransi budaya dan seni pertunjukan Tari Barong & Kecak',
      'Kunjungan universitas negeri ternama di Bali (Universitas Udayana)',
      'Dokumentasi lengkap dan piagam penghargaan partisipasi sekolah'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Kedatangan di Pulau Dewata & Sambutan Adat',
        description: 'Tiba via darat penyeberangan Ketapang-Gilimanuk atau Bandara.',
        activities: [
          'Penyambutan rombongan bus sekolah di Bali',
          'Makan siang prasmanan khas Bali halal',
          'Kunjungan observasi Pura Tanah Lot dan abrasi pantai',
          'Check-in hotel rombongan pelajar & makan malam'
        ]
      },
      {
        day: 2,
        title: 'Konservasi Maritim & Seni Tari Tradisional',
        description: 'Edukasi biota laut dan pelestarian satwa dilindungi.',
        activities: [
          'Sarapan pagi hotel',
          'Menyeberang dengan glass bottom boat ke Pusat Konservasi Penyu Tanjung Benoa',
          'Makan siang siswa di resto lokal',
          'Menonton pertunjukan seni budaya Tari Kecak di Uluwatu',
          'Makan malam prasmanan di resto Kuta'
        ]
      },
      {
        day: 3,
        title: 'Eksplorasi Desa Adat Tradisional Penglipuran',
        description: 'Mempelajari tata ruang desa adat Tri Hita Karana.',
        activities: [
          'Sarapan pagi hotel',
          'Studi lapangan tata ruang arsitektur di Desa Adat Penglipuran',
          'Makan siang dengan latar panorama Danau Batur Kintamani',
          'Kunjungan campus tour Universitas Udayana / Institut Seni Indonesia Denpasar',
          'Makan malam dan belanja suvenir di Krisna Oleh-Oleh'
        ]
      },
      {
        day: 4,
        title: 'Perjalanan Kembali dengan Wawasan Keberagaman',
        description: 'Refleksi perjalanan dan penutupan kegiatan study tour.',
        activities: [
          'Sarapan pagi dan check-out',
          'Sesi foto bersama di Monumen Bajra Sandhi Renon',
          'Makan siang bekal perjalanan',
          'Perjalanan pulang kembali ke daerah asal'
        ]
      }
    ],
    included: {
      transport: 'Big Bus Pariwisata Eksekutif Bali, Driver handal, BBM, Tiket Kapal Penyeberangan & Tol',
      accommodation: '3 Malam Hotel Bintang di kawasan aman Bali (kapasitas 3-4 siswa/kamar)',
      meals: 'Makan 3x sehari lengkap prasmanan higienis berlabel halal',
      tickets: [
        'Tiket Glass Bottom Boat & Konservasi Penyu',
        'Tiket Desa Adat Penglipuran',
        'Tiket Pura Tanah Lot & Uluwatu',
        'Tiket Monumen Bajra Sandhi'
      ],
      additional: [
        'Pemandu lokal berlisensi HPI Bali per bus',
        'Spanduk & modul studi lapangan',
        'Asuransi perjalanan wisata',
        'Fasilitas guru pendamping gratis'
      ]
    }
  }
];

export const INITIAL_FLEET: FleetUnit[] = [
  {
    id: 'flt-avanza-01',
    plateNumber: 'AB 1892 XY',
    name: 'Toyota Grand New Avanza Facelift',
    type: 'avanza',
    typeLabel: 'Toyota Avanza (1-5 Pax)',
    capacitySeats: 5,
    facilities: ['AC Double Blower Dingin', 'Ergonomic Seats', 'Audio Bluetooth & USB', 'Bagasi Koper Luas'],
    status: 'tersedia',
    driverId: 'drv-03',
    driverName: 'Bambang Triyono',
    lastServiceDate: '2026-10-22',
    nextServiceKm: 25000,
    currentKm: 21400,
    baseCity: 'Yogyakarta'
  },
  {
    id: 'flt-innova-01',
    plateNumber: 'AB 2468 CD',
    name: 'Toyota Kijang Innova Reborn Venturer',
    type: 'innova',
    typeLabel: 'Toyota Innova Reborn (4-7 Pax)',
    capacitySeats: 7,
    facilities: ['AC Digital Triple Blower', 'Captain Seats Mewah', 'Audio Premium JBL', 'Suspensi Halus & Senyap', 'Port Fast Charging'],
    status: 'tersedia',
    driverId: 'drv-02',
    driverName: 'Mas Danang Prasetyo',
    lastServiceDate: '2026-10-20',
    nextServiceKm: 30000,
    currentKm: 26800,
    baseCity: 'Yogyakarta'
  },
  {
    id: 'flt-01',
    plateNumber: 'AB 1256 ST',
    name: 'Toyota HiAce Premio Executive 01',
    type: 'hiace_premio',
    typeLabel: 'HiAce Premio Luxury',
    capacitySeats: 14,
    facilities: ['AC Double Blower', 'Reclining Seats Kulit', 'Port USB Charger tiap kursi', 'Audio Bluetooth', 'Cool Box'],
    status: 'ditugaskan',
    currentOrderId: 'PGD-202611-0089',
    assignedTour: 'Family Trip Jogja (Keluarga Rahardjo)',
    driverId: 'drv-01',
    driverName: 'Pak Joko Santoso',
    lastServiceDate: '2026-10-18',
    nextServiceKm: 45000,
    currentKm: 41200,
    baseCity: 'Yogyakarta',
    imageUrl: '/src/assets/images/hero_pergidiantar_travel_1793579233622.jpg'
  },
  {
    id: 'flt-02',
    plateNumber: 'AB 7821 JK',
    name: 'Toyota HiAce Premio Executive 02',
    type: 'hiace_premio',
    typeLabel: 'HiAce Premio Luxury',
    capacitySeats: 14,
    facilities: ['AC Double Blower', 'Reclining Seats Kulit', 'Port USB Charger', 'Smart Android TV', 'Mic Karaoke'],
    status: 'tersedia',
    driverId: 'drv-02',
    driverName: 'Mas Danang Prasetyo',
    lastServiceDate: '2026-10-25',
    nextServiceKm: 35000,
    currentKm: 31800,
    baseCity: 'Yogyakarta',
    imageUrl: '/src/assets/images/fleet_hiace_bus_pergidiantar_1793579236036.jpg'
  },
  {
    id: 'flt-03',
    plateNumber: 'AB 1904 UT',
    name: 'Toyota HiAce Commuter White 03',
    type: 'hiace_commuter',
    typeLabel: 'HiAce Commuter',
    capacitySeats: 15,
    facilities: ['AC Dingin Merata', 'Reclining Seats', 'Audio Stereo', 'Bagasi Luas'],
    status: 'tersedia',
    driverId: 'drv-03',
    driverName: 'Bambang Triyono',
    lastServiceDate: '2026-10-12',
    nextServiceKm: 60000,
    currentKm: 56400,
    baseCity: 'Yogyakarta'
  },
  {
    id: 'flt-04',
    plateNumber: 'AB 8832 PK',
    name: 'Isuzu Elf Long Giga 04',
    type: 'elf_long',
    typeLabel: 'Isuzu Elf Long',
    capacitySeats: 19,
    facilities: ['AC Ducting', 'Reclining Seats', 'LED TV & Audio', 'Suspensi Nyaman'],
    status: 'tersedia',
    driverId: 'drv-04',
    driverName: 'Agus Setiawan',
    lastServiceDate: '2026-10-05',
    nextServiceKm: 70000,
    currentKm: 68100,
    baseCity: 'Yogyakarta'
  },
  {
    id: 'flt-05',
    plateNumber: 'AB 7119 ND',
    name: 'Medium Bus Jetbus 5 (33 Seats)',
    type: 'medium_bus',
    typeLabel: 'Medium Bus Pariwisata',
    capacitySeats: 33,
    facilities: ['AC Central', 'Reclining Seats 2-2', '2 Unit Smart TV', 'Wireless Mic Karaoke', 'Bagasi Samping Luas'],
    status: 'ditugaskan',
    currentOrderId: 'PGD-202611-0091',
    assignedTour: 'Family Gathering Malang (Keluarga Besar dr. Wijaya)',
    driverId: 'drv-05',
    driverName: 'Yanto Kurniawan',
    lastServiceDate: '2026-10-20',
    nextServiceKm: 85000,
    currentKm: 80200,
    baseCity: 'Yogyakarta'
  },
  {
    id: 'flt-06',
    plateNumber: 'AB 7900 BP',
    name: 'Big Bus Pariwisata SHD Jetbus 5',
    type: 'big_bus',
    typeLabel: 'Big Bus Super High Deck',
    capacitySeats: 50,
    facilities: ['Air Suspension', 'AC Denso Dingin', 'Toilet Bersih', 'Smoking Area Belakang', 'Reclining 2-2 Aldilla', '3 TV LED & Subwoofer', 'Dispenser Air Panas'],
    status: 'perjalanan',
    currentOrderId: 'PGD-202611-0090',
    assignedTour: 'Study Tour SMA Negeri 1 (Jogja Heritage)',
    driverId: 'drv-06',
    driverName: 'Pak Hendro Wibowo',
    lastServiceDate: '2026-10-15',
    nextServiceKm: 110000,
    currentKm: 104500,
    baseCity: 'Yogyakarta',
    imageUrl: '/src/assets/images/fleet_hiace_bus_pergidiantar_1793579236036.jpg'
  },
  {
    id: 'flt-07',
    plateNumber: 'DK 8219 AB',
    name: 'Big Bus Pariwisata Bali Island 01',
    type: 'big_bus',
    typeLabel: 'Big Bus Pariwisata Bali',
    capacitySeats: 45,
    facilities: ['AC Central', 'Reclining Seats', 'Audio Video Karaoke', 'Coolbox'],
    status: 'tersedia',
    lastServiceDate: '2026-10-22',
    nextServiceKm: 50000,
    currentKm: 46200,
    baseCity: 'Bali'
  },
  {
    id: 'flt-08',
    plateNumber: 'N 7044 UB',
    name: 'Medium Bus Malang Bromo 02',
    type: 'medium_bus',
    typeLabel: 'Medium Bus Malang',
    capacitySeats: 35,
    facilities: ['AC Dingin', 'Reclining Seats', 'Audio Karaoke', 'Suspensi Prima'],
    status: 'maintenance',
    lastServiceDate: '2026-10-30',
    nextServiceKm: 90000,
    currentKm: 89950,
    baseCity: 'Malang'
  }
];

export const INITIAL_DRIVERS: DriverCrew[] = [
  {
    id: 'drv-01',
    name: 'Pak Joko Santoso',
    phone: '0812-3456-7890',
    licenseType: 'SIM B1 Umum',
    status: 'ditugaskan',
    totalTripsCompleted: 142,
    rating: 4.9,
    currentOrderId: 'PGD-202611-0089'
  },
  {
    id: 'drv-02',
    name: 'Mas Danang Prasetyo',
    phone: '0813-9876-5432',
    licenseType: 'SIM B1 Umum',
    status: 'tersedia',
    totalTripsCompleted: 98,
    rating: 4.95
  },
  {
    id: 'drv-03',
    name: 'Bambang Triyono',
    phone: '0818-0912-3444',
    licenseType: 'SIM B1 Umum',
    status: 'tersedia',
    totalTripsCompleted: 110,
    rating: 4.85
  },
  {
    id: 'drv-04',
    name: 'Agus Setiawan',
    phone: '0857-4321-7788',
    licenseType: 'SIM B1 Umum',
    status: 'tersedia',
    totalTripsCompleted: 75,
    rating: 4.88
  },
  {
    id: 'drv-05',
    name: 'Yanto Kurniawan',
    phone: '0821-3344-5566',
    licenseType: 'SIM B2 Umum',
    status: 'ditugaskan',
    totalTripsCompleted: 165,
    rating: 4.92,
    currentOrderId: 'PGD-202611-0091'
  },
  {
    id: 'drv-06',
    name: 'Pak Hendro Wibowo',
    phone: '0812-9988-7711',
    licenseType: 'SIM B2 Umum',
    status: 'ditugaskan',
    totalTripsCompleted: 215,
    rating: 4.97,
    currentOrderId: 'PGD-202611-0090'
  }
];

export const INITIAL_HOTELS: HotelPartner[] = [
  {
    id: 'htl-01',
    name: 'Gaia Cosmo Hotel Malioboro',
    city: 'jogja',
    cityLabel: 'Yogyakarta',
    starRating: 4,
    roomType: 'Deluxe Twin / King',
    quotaAvailable: 18,
    pricePerNight: 650000
  },
  {
    id: 'htl-02',
    name: 'Eastparc Hotel Yogyakarta',
    city: 'jogja',
    cityLabel: 'Yogyakarta',
    starRating: 5,
    roomType: 'Premier Family Room',
    quotaAvailable: 12,
    pricePerNight: 1150000
  },
  {
    id: 'htl-03',
    name: 'Grand Mercure Yogyakarta',
    city: 'jogja',
    cityLabel: 'Yogyakarta',
    starRating: 5,
    roomType: 'Superior Room',
    quotaAvailable: 14,
    pricePerNight: 850000
  },
  {
    id: 'htl-04',
    name: 'Jambuluwuk Convention Resort Batu Malang',
    city: 'malang',
    cityLabel: 'Malang & Batu',
    starRating: 4,
    roomType: 'Deluxe Mountain View',
    quotaAvailable: 15,
    pricePerNight: 720000
  },
  {
    id: 'htl-05',
    name: 'Golden Tulip Holland Resort Batu',
    city: 'malang',
    cityLabel: 'Malang & Batu',
    starRating: 5,
    roomType: 'Premier Room',
    quotaAvailable: 8,
    pricePerNight: 1250000
  },
  {
    id: 'htl-06',
    name: 'The Haven Bali Seminyak',
    city: 'bali',
    cityLabel: 'Bali',
    starRating: 4,
    roomType: 'Haven Room Pool View',
    quotaAvailable: 16,
    pricePerNight: 850000
  },
  {
    id: 'htl-07',
    name: 'Grand Istana Rama Kuta Beach',
    city: 'bali',
    cityLabel: 'Bali',
    starRating: 4,
    roomType: 'Superior Beachfront',
    quotaAvailable: 20,
    pricePerNight: 690000
  }
];

export const INITIAL_ORDERS: BookingOrder[] = [];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-01',
    name: 'Benisius Rahmat Basuki',
    email: 'pergi.diantar@gmail.com',
    role: 'super_admin',
    roleLabel: 'Super Admin',
    department: 'Direksi & Operasional Utama',
    phone: '087716443331',
    password: 'admin'
  }
];

export const INITIAL_CHATS: ChatMessage[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_VENDOR_PAYMENTS: VendorPayment[] = [];
