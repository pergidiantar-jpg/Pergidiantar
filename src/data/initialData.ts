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
      transport: 'Unit HiAce Premio / Private AC, Driver ramah, BBM full, Parkir semua lokasi, Biaya Tol',
      accommodation: 'Hotel Bintang 3-4 (All In) atau Hotel Nyaman Pilihan Bintang 2-3 (Hemat)',
      meals: 'Makan sesuai jadwal (3x sehari All In, 2x sehari Hemat) di restoran lokal khas',
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
      transport: 'Toyota HiAce Premio Luxury, Driver profesional sabar, BBM, Tol & Parkir tercover',
      accommodation: '2 Malam di Hotel Bintang 4 (All In) / Hotel Bintang 3 Nyaman (Hemat)',
      meals: 'Makan teratur (Pagi, Siang, Malam All In / Siang Malam Hemat) di restoran ramah keluarga',
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

export const INITIAL_ORDERS: BookingOrder[] = [
  {
    id: 'ord-01',
    orderNumber: 'PGD-202611-0089',
    packageId: 'pkg-jogja-family',
    packageTitle: 'Family Trip Sweet Jogja Memories',
    category: 'family_trip',
    categoryLabel: 'Family Trip',
    destination: 'jogja',
    destinationLabel: 'Yogyakarta',
    tier: 'all_in',
    tourStartDate: '2026-11-05',
    tourEndDate: '2026-11-07',
    paxCount: 6,
    customer: {
      fullName: 'Bapak Arya Rahardjo',
      whatsapp: '0812-8822-9900',
      email: 'arya.rahardjo@gmail.com',
      companyOrFamilyName: 'Keluarga Besar Rahardjo',
      pickupAddress: 'Bandara YIA (Yogyakarta International Airport)',
      city: 'Jakarta Selatan',
      specialRequests: 'Mohon siapkan 1 baby car seat dan kursi roda lipat untuk nenek.'
    },
    pricePerPax: 1980000,
    subtotal: 11880000,
    addOnsTotal: 600000,
    addOnsList: ['Dokumentasi Drone & Video Teaser', 'Snack Box Premium Upgrade'],
    grandTotal: 12480000,
    paymentMethod: 'qris',
    paymentStatus: 'paid',
    paymentReference: 'QRIS-NMID-992817263541',
    paidAt: '2026-11-01 10:15 WIB',
    orderStatus: 'armada_ditugaskan',
    assignedFleetId: 'flt-01',
    assignedFleetName: 'Toyota HiAce Premio Executive 01 (AB 1256 ST)',
    assignedDriverId: 'drv-01',
    assignedDriverName: 'Pak Joko Santoso',
    assignedDriverPhone: '0812-3456-7890',
    hotelAllotment: 'Gaia Cosmo Hotel (2 Kamar Deluxe)',
    createdAt: '2026-11-01 09:42',
    notes: 'Pembayaran QRIS telah diverifikasi finance. Tamu mendarat di YIA pk 08.45 WIB.'
  },
  {
    id: 'ord-02',
    orderNumber: 'PGD-202611-0090',
    packageId: 'pkg-studytour-jogja',
    packageTitle: 'Study Tour Edukasi & Budaya Jogja Istimewa',
    category: 'study_tour',
    categoryLabel: 'Study Tour',
    destination: 'jogja',
    destinationLabel: 'Yogyakarta',
    tier: 'paket_hemat',
    tourStartDate: '2026-11-10',
    tourEndDate: '2026-11-12',
    paxCount: 48,
    customer: {
      fullName: 'Dra. Hj. Sri Wahyuni, M.Pd.',
      whatsapp: '0813-2244-6688',
      email: 'sri.wahyuni@sman1bandung.sch.id',
      companyOrFamilyName: 'SMA Negeri 1 Bandung (Kelas XI IPS)',
      pickupAddress: 'Kampus SMAN 1 Bandung, Jl. Ir. H. Juanda',
      city: 'Bandung',
      specialRequests: 'Perlu sertifikat kegiatan study tour untuk 48 siswa dan 4 guru pendamping.'
    },
    pricePerPax: 1150000,
    subtotal: 55200000,
    addOnsTotal: 2000000,
    addOnsList: ['Spanduk Bus & Acara Ekstra 4 Pcs', 'Dokumentasi Video Dokumenter Sekolah'],
    grandTotal: 57200000,
    paymentMethod: 'va_bca',
    paymentStatus: 'paid',
    paymentReference: 'VA-BCA-807771239821',
    paidAt: '2026-10-30 14:20 WIB',
    orderStatus: 'sedang_berjalan',
    assignedFleetId: 'flt-06',
    assignedFleetName: 'Big Bus Pariwisata SHD Jetbus 5 (AB 7900 BP)',
    assignedDriverId: 'drv-06',
    assignedDriverName: 'Pak Hendro Wibowo',
    assignedDriverPhone: '0812-9988-7711',
    hotelAllotment: 'Grand Mercure Jogja (16 Kamar Pelajar)',
    createdAt: '2026-10-28 11:15',
    notes: 'Tour sedang berlangsung rute Candi Prambanan menuju Malioboro.'
  },
  {
    id: 'ord-03',
    orderNumber: 'PGD-202611-0091',
    packageId: 'pkg-gathering-malang',
    packageTitle: 'Family Gathering Malang & Bromo Adventure',
    category: 'family_gathering',
    categoryLabel: 'Family Gathering',
    destination: 'malang',
    destinationLabel: 'Malang & Bromo',
    tier: 'all_in',
    tourStartDate: '2026-11-18',
    tourEndDate: '2026-11-20',
    paxCount: 24,
    customer: {
      fullName: 'dr. Hendra Wijaya, Sp.A',
      whatsapp: '0811-9090-1234',
      email: 'hendra.wijaya@gmail.com',
      companyOrFamilyName: 'Keluarga Besar Bani Wijaya',
      pickupAddress: 'Stasiun Malang Kotabaru',
      city: 'Surabaya',
      specialRequests: 'Request 6 unit Jeep Hardtop Bromo dengan driver yang berpengalaman.'
    },
    pricePerPax: 2550000,
    subtotal: 61200000,
    addOnsTotal: 3500000,
    addOnsList: ['Gala Dinner BBQ Kambing Guling di Batu', 'Upgrade Jeep Hardtop Luxury'],
    grandTotal: 64700000,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    paymentReference: 'TF-MANDIRI-449102911',
    paidAt: '2026-10-29 16:45 WIB',
    orderStatus: 'armada_ditugaskan',
    assignedFleetId: 'flt-05',
    assignedFleetName: 'Medium Bus Jetbus 5 33 Seats (AB 7119 ND)',
    assignedDriverId: 'drv-05',
    assignedDriverName: 'Yanto Kurniawan',
    assignedDriverPhone: '0821-3344-5566',
    hotelAllotment: 'Jambuluwuk Convention Resort Batu (8 Kamar Deluxe)',
    createdAt: '2026-10-27 15:30',
    notes: 'Tiket TNBTS Bromo dan Jeep sudah di-booking konfirmasi.'
  },
  {
    id: 'ord-04',
    orderNumber: 'PGD-202611-0092',
    packageId: 'pkg-company-jogja',
    packageTitle: 'Company Gathering & Team Building Jogja',
    category: 'company_gathering',
    categoryLabel: 'Company Gathering',
    destination: 'jogja',
    destinationLabel: 'Yogyakarta',
    tier: 'all_in',
    tourStartDate: '2026-11-25',
    tourEndDate: '2026-11-27',
    paxCount: 40,
    customer: {
      fullName: 'Maya Anindita, S.Psi (HR Director)',
      whatsapp: '0815-6677-8899',
      email: 'maya.hrd@nusantara-tech.co.id',
      companyOrFamilyName: 'PT Nusantara Teknologi Digital',
      pickupAddress: 'Gedung Cyber 2 Tower Kuningan, Jakarta Selatan',
      city: 'Jakarta',
      specialRequests: 'Request banner logo perusahaan di bus, gala dinner tema Hawaiian, sound system panggung.'
    },
    pricePerPax: 2450000,
    subtotal: 98000000,
    addOnsTotal: 7500000,
    addOnsList: ['Live Acoustic Band Gala Dinner', 'Video Cinematic Aftermovie 4K', 'Merchandise Polo Shirt 40 Pcs'],
    grandTotal: 105500000,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'pending',
    orderStatus: 'baru',
    createdAt: '2026-11-01 14:10',
    notes: 'Menunggu konfirmasi transfer termin pertama (DP 50%) dari finance kantor pemesan.'
  },
  {
    id: 'ord-05',
    orderNumber: 'PGD-202611-0093',
    packageId: 'pkg-jogja-single',
    packageTitle: 'Single Trip Heritage & Scenic Jogja',
    category: 'single_trip',
    categoryLabel: 'Single Trip',
    destination: 'jogja',
    destinationLabel: 'Yogyakarta',
    tier: 'all_in',
    tourStartDate: '2026-11-03',
    tourEndDate: '2026-11-04',
    paxCount: 2,
    customer: {
      fullName: 'Rizky Pratama & Salsa',
      whatsapp: '0878-1122-3344',
      email: 'rizky.pratama@gmail.com',
      companyOrFamilyName: 'Couple Weekend Getaway',
      pickupAddress: 'Stasiun Tugu Yogyakarta Pintu Selatan',
      city: 'Semarang',
      specialRequests: 'Driver mohon bisa bantu ambil foto estetik di Prambanan dan HeHa Sky View.'
    },
    pricePerPax: 1450000,
    subtotal: 2900000,
    addOnsTotal: 0,
    addOnsList: [],
    grandTotal: 2900000,
    paymentMethod: 'qris',
    paymentStatus: 'paid',
    paymentReference: 'QRIS-BCA-778219011',
    paidAt: '2026-11-01 12:05 WIB',
    orderStatus: 'dikonfirmasi',
    assignedFleetId: 'flt-02',
    assignedFleetName: 'Toyota HiAce Premio Executive 02 (AB 7821 JK)',
    assignedDriverId: 'drv-02',
    assignedDriverName: 'Mas Danang Prasetyo',
    assignedDriverPhone: '0813-9876-5432',
    hotelAllotment: 'Gaia Cosmo Malioboro (1 King Room)',
    createdAt: '2026-11-01 11:45',
    notes: 'Jadwal penjemputan Stasiun Tugu KA Argo Sindoro pukul 10.15 WIB besok lusa.'
  }
];

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
  },
  {
    id: 'usr-02',
    name: 'Rian Firmansyah',
    email: 'rian.ops@pergidiantar.com',
    role: 'ops_admin',
    roleLabel: 'Admin Operasional',
    department: 'Manajemen Armada & Driver'
  },
  {
    id: 'usr-03',
    name: 'Dewi Lestari, S.E.',
    email: 'dewi.finance@pergidiantar.com',
    role: 'finance',
    roleLabel: 'Finance & Keuangan',
    department: 'Pembukuan & Verifikasi Pembayaran'
  },
  {
    id: 'usr-04',
    name: 'Siti Sarah',
    email: 'cs.siti@pergidiantar.com',
    role: 'customer_service',
    roleLabel: 'Customer Service (CS)',
    department: 'Layanan Pelanggan & Konsultasi'
  },
  {
    id: 'usr-05',
    name: 'Calon Wisatawan (Tamu)',
    email: 'tamu@pergidiantar.com',
    role: 'customer',
    roleLabel: 'Calon Pelanggan',
    department: 'Portal Wisatawan Publik'
  }
];

export const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'msg-01',
    sender: 'customer',
    senderName: 'Ibu Ratna Kumala',
    text: 'Halo admin PERGIDIANTAR! Mau tanya untuk Family Gathering Jogja 25 orang di bulan Desember apakah armada bus dan hotelnya masih ada kuota?',
    timestamp: '14:25 WIB',
    isRead: true,
    packageContext: 'Family Gathering Jogja'
  },
  {
    id: 'msg-02',
    sender: 'cs_admin',
    senderName: 'Siti Sarah (CS Pergidiantar)',
    text: 'Halo Ibu Ratna! Selamat siang. Masih tersedia Bu, untuk 25 pax kami siapkan Medium Bus Jetbus 5 terbaru 33 seats dan kamar di Gaia Cosmo atau Eastparc. Mau kami buatkan estimasi penawaran All In atau Paket Hemat Bu?',
    timestamp: '14:27 WIB',
    isRead: true
  },
  {
    id: 'msg-03',
    sender: 'customer',
    senderName: 'Ibu Ratna Kumala',
    text: 'Boleh dibantu yang Paket All In ya Mba. Sudah termasuk makan 3x sehari dan tiket Merapi jeep kan?',
    timestamp: '14:30 WIB',
    isRead: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Pesanan Baru Masuk!',
    message: 'Pesanan #PGD-202611-0092 dari PT Nusantara Teknologi Digital (40 Pax) berhasil dibuat.',
    timestamp: 'Baru saja',
    type: 'order',
    isRead: false,
    orderId: 'ord-04'
  },
  {
    id: 'notif-02',
    title: 'Pembayaran QRIS Terverifikasi',
    message: 'Pembayaran pesanan #PGD-202611-0089 (Rp 12.480.000) oleh Bapak Arya Rahardjo telah lunas.',
    timestamp: '30 menit yang lalu',
    type: 'payment',
    isRead: false,
    orderId: 'ord-01'
  },
  {
    id: 'notif-03',
    title: 'Armada & Driver Ditugaskan',
    message: 'HiAce Premio Executive (AB 1256 ST) & Pak Joko Santoso siap untuk jadwal 5 Nov 2026.',
    timestamp: '1 jam yang lalu',
    type: 'fleet',
    isRead: true,
    orderId: 'ord-01'
  }
];

export const INITIAL_VENDOR_PAYMENTS: VendorPayment[] = [
  // 1. Pembayaran Driver
  {
    id: 'pay-drv-01',
    paymentNumber: 'PAY-DRV-202611-001',
    category: 'driver',
    categoryLabel: 'Pembayaran Driver & Kru',
    vendorName: 'Bambang Sudiro (Driver Wisata)',
    recipientContact: '0812-3456-7890',
    relatedOrderId: 'ord-01',
    relatedOrderNumber: 'PGD-202611-0089',
    packageName: 'Family Trip Sweet Jogja Memories',
    destination: 'Yogyakarta',
    amount: 1200000,
    date: '2026-11-05',
    status: 'selesai',
    paymentMethod: 'transfer_bca',
    paymentMethodLabel: 'Transfer Bank BCA',
    bankAccount: 'BCA 8465019283 a/n Bambang Sudiro',
    referenceNumber: 'TRF-BCA-9812450',
    description: 'Honor supir trip 3D2N Jogja + Uang makan kru harian',
    createdAt: '2026-11-04 10:15',
    approvedBy: 'Benisius Rahmat Basuki (Super Admin)'
  },
  {
    id: 'pay-drv-02',
    paymentNumber: 'PAY-DRV-202611-002',
    category: 'driver',
    categoryLabel: 'Pembayaran Driver & Kru',
    vendorName: 'Joko Santoso (Driver Wisata)',
    recipientContact: '0813-8877-6655',
    relatedOrderId: 'ord-02',
    relatedOrderNumber: 'PGD-202611-0090',
    packageName: 'Bromo Sunrise & Batu Malang Leisure',
    destination: 'Malang & Batu',
    amount: 1750000,
    date: '2026-11-10',
    status: 'selesai',
    paymentMethod: 'transfer_mandiri',
    paymentMethodLabel: 'Transfer Bank Mandiri',
    bankAccount: 'Mandiri 137001928374 a/n Joko Santoso',
    referenceNumber: 'TRF-MDR-881920',
    description: 'Honor driver rute Malang - Bromo + Uang operasional tol & BBM dinas',
    createdAt: '2026-11-03 14:20',
    approvedBy: 'Benisius Rahmat Basuki (Super Admin)'
  },
  {
    id: 'pay-drv-03',
    paymentNumber: 'PAY-DRV-202611-003',
    category: 'driver',
    categoryLabel: 'Pembayaran Driver & Kru',
    vendorName: 'I Wayan Sudirta (Driver Bali Tour)',
    recipientContact: '0819-2233-4455',
    relatedOrderId: 'ord-03',
    relatedOrderNumber: 'PGD-202611-0091',
    packageName: 'Eksotika Nusa Penida & Ubud Sunset',
    destination: 'Bali',
    amount: 1400000,
    date: '2026-11-15',
    status: 'menunggu',
    paymentMethod: 'kas_operasional',
    paymentMethodLabel: 'Kas Operasional / Tunai',
    bankAccount: 'Tunai Kas Lapangan Bali',
    referenceNumber: 'VCR-KAS-0081',
    description: 'Uang jalan & fee driver wisata Nusa Penida & Ubud',
    createdAt: '2026-11-04 16:00',
    approvedBy: 'Benisius Rahmat Basuki (Super Admin)'
  },

  // 2. Pembayaran ke Hotel
  {
    id: 'pay-htl-01',
    paymentNumber: 'PAY-HTL-202611-001',
    category: 'hotel',
    categoryLabel: 'Pembayaran Hotel Mitra',
    vendorName: 'Gaia Cosmo Hotel Malioboro',
    recipientContact: '0274-567890 (Reservasi Group)',
    relatedOrderId: 'ord-01',
    relatedOrderNumber: 'PGD-202611-0089',
    packageName: 'Family Trip Sweet Jogja Memories',
    destination: 'Yogyakarta',
    amount: 2600000,
    date: '2026-11-05',
    status: 'selesai',
    paymentMethod: 'transfer_bca',
    paymentMethodLabel: 'Transfer Bank BCA',
    bankAccount: 'BCA Corporate 0378829100 a/n PT Cosmo Hospitality',
    referenceNumber: 'VCR-HTL-GAIA-091',
    description: 'Pelunasan 2 Kamar Deluxe Twin (2 Malam) include sarapan buffet rombongan',
    createdAt: '2026-11-04 09:30',
    approvedBy: 'Finance PERGIDIANTAR'
  },
  {
    id: 'pay-htl-02',
    paymentNumber: 'PAY-HTL-202611-002',
    category: 'hotel',
    categoryLabel: 'Pembayaran Hotel Mitra',
    vendorName: 'Jambuluwuk Convention Resort Batu Malang',
    recipientContact: '0341-591234 (Sales Corporate)',
    relatedOrderId: 'ord-02',
    relatedOrderNumber: 'PGD-202611-0090',
    packageName: 'Bromo Sunrise & Batu Malang Leisure',
    destination: 'Malang & Batu',
    amount: 5760000,
    date: '2026-11-10',
    status: 'selesai',
    paymentMethod: 'transfer_mandiri',
    paymentMethodLabel: 'Transfer Bank Mandiri',
    bankAccount: 'Mandiri 144009988112 a/n PT Jambuluwuk Batu Resort',
    referenceNumber: 'VCR-HTL-JMB-2026',
    description: 'Pelunasan 8 Kamar Deluxe Mountain View untuk Gathering Wisatawan',
    createdAt: '2026-11-03 11:00',
    approvedBy: 'Finance PERGIDIANTAR'
  },
  {
    id: 'pay-htl-03',
    paymentNumber: 'PAY-HTL-202611-003',
    category: 'hotel',
    categoryLabel: 'Pembayaran Hotel Mitra',
    vendorName: 'The Haven Bali Seminyak',
    recipientContact: '0361-738900 (Front Office Group)',
    relatedOrderId: 'ord-03',
    relatedOrderNumber: 'PGD-202611-0091',
    packageName: 'Eksotika Nusa Penida & Ubud Sunset',
    destination: 'Bali',
    amount: 3400000,
    date: '2026-11-15',
    status: 'menunggu',
    paymentMethod: 'transfer_bca',
    paymentMethodLabel: 'Transfer Bank BCA',
    bankAccount: 'BCA 7720918273 a/n PT The Haven Seminyak',
    referenceNumber: 'INV-HVN-11029',
    description: 'Pembayaran 4 Kamar Haven Pool View (2 Malam) rombongan Bali Private',
    createdAt: '2026-11-04 15:45',
    approvedBy: 'Benisius Rahmat Basuki (Super Admin)'
  },

  // 3. Pembayaran ke Vendor Kendaraan
  {
    id: 'pay-veh-01',
    paymentNumber: 'PAY-VEH-202611-001',
    category: 'vehicle_vendor',
    categoryLabel: 'Pembayaran Vendor Kendaraan',
    vendorName: 'PO Nusantara Trans Mandiri (Pool Bus Jogja)',
    recipientContact: '0811-9988-7711 (Pak Heru - Dispatcher)',
    relatedOrderId: 'ord-04',
    relatedOrderNumber: 'PGD-202611-0092',
    packageName: 'Corporate Gathering Malioboro & Merapi',
    destination: 'Yogyakarta',
    amount: 6500000,
    date: '2026-11-04',
    status: 'selesai',
    paymentMethod: 'transfer_bri',
    paymentMethodLabel: 'Transfer Bank BRI',
    bankAccount: 'BRI 0029018273645 a/n PT Nusantara Trans Mandiri',
    referenceNumber: 'SPK-BUS-NST-4401',
    description: 'Sewa 1 Unit Big Bus SHD 50 Seats (3 Hari) BBM & Tol termasuk rute Jogja All In',
    createdAt: '2026-11-04 08:30',
    approvedBy: 'Benisius Rahmat Basuki (Super Admin)'
  },
  {
    id: 'pay-veh-02',
    paymentNumber: 'PAY-VEH-202611-002',
    category: 'vehicle_vendor',
    categoryLabel: 'Pembayaran Vendor Kendaraan',
    vendorName: 'Rental Auto Prima Malang',
    recipientContact: '0857-4433-2211 (Marketing Vendor)',
    relatedOrderId: 'ord-02',
    relatedOrderNumber: 'PGD-202611-0090',
    packageName: 'Bromo Sunrise & Batu Malang Leisure',
    destination: 'Malang & Batu',
    amount: 2800000,
    date: '2026-11-10',
    status: 'selesai',
    paymentMethod: 'transfer_bca',
    paymentMethodLabel: 'Transfer Bank BCA',
    bankAccount: 'BCA 3159082736 a/n CV Auto Prima Malang',
    referenceNumber: 'KONTRAK-ARM-MLG-08',
    description: 'Sewa 2 Unit Toyota Innova Reborn All New (2 Hari) standby Kota Malang & Batu',
    createdAt: '2026-11-03 13:00',
    approvedBy: 'Finance PERGIDIANTAR'
  },
  {
    id: 'pay-veh-03',
    paymentNumber: 'PAY-VEH-202611-003',
    category: 'vehicle_vendor',
    categoryLabel: 'Pembayaran Vendor Kendaraan',
    vendorName: 'Dewata Luxury HiAce Rental Bali',
    recipientContact: '0812-9090-8800 (Ketut Rental)',
    relatedOrderId: 'ord-03',
    relatedOrderNumber: 'PGD-202611-0091',
    packageName: 'Eksotika Nusa Penida & Ubud Sunset',
    destination: 'Bali',
    amount: 3200000,
    date: '2026-11-15',
    status: 'proses',
    paymentMethod: 'transfer_bca',
    paymentMethodLabel: 'Transfer Bank BCA',
    bankAccount: 'BCA 0409887766 a/n Dewata Transport Bali',
    referenceNumber: 'PO-HIACE-BALI-99',
    description: 'Sewa 1 Unit HiAce Premio Luxury Captain Seat (3 Hari) rute Denpasar - Ubud',
    createdAt: '2026-11-04 16:20',
    approvedBy: 'Benisius Rahmat Basuki (Super Admin)'
  },

  // 4. Pembayaran ke Tempat Wisata
  {
    id: 'pay-tkt-01',
    paymentNumber: 'PAY-TKT-202611-001',
    category: 'tourist_spot',
    categoryLabel: 'Pembayaran Tiket Tempat Wisata',
    vendorName: 'PT Taman Wisata Candi Borobudur & Prambanan',
    recipientContact: '0274-496401 (Loket Rombongan Agency)',
    relatedOrderId: 'ord-01',
    relatedOrderNumber: 'PGD-202611-0089',
    packageName: 'Family Trip Sweet Jogja Memories',
    destination: 'Yogyakarta',
    amount: 900000,
    date: '2026-11-05',
    status: 'selesai',
    paymentMethod: 'qris',
    paymentMethodLabel: 'QRIS Tiket Wisata',
    bankAccount: 'QRIS Merchant Candi Prambanan Resmi',
    referenceNumber: 'QR-TWC-PRMB-9018',
    description: 'Pembelian tiket masuk terusan prioritas Candi Prambanan & Ratu Boko (6 Pax)',
    createdAt: '2026-11-04 11:00',
    approvedBy: 'Finance PERGIDIANTAR'
  },
  {
    id: 'pay-tkt-02',
    paymentNumber: 'PAY-TKT-202611-002',
    category: 'tourist_spot',
    categoryLabel: 'Pembayaran Tiket Tempat Wisata',
    vendorName: 'Paguyuban Jeep 4x4 Wisata Bromo Tengger',
    recipientContact: '0812-4980-2211 (Koperasi Jeep Sukapura)',
    relatedOrderId: 'ord-02',
    relatedOrderNumber: 'PGD-202611-0090',
    packageName: 'Bromo Sunrise & Batu Malang Leisure',
    destination: 'Malang & Batu',
    amount: 1950000,
    date: '2026-11-10',
    status: 'selesai',
    paymentMethod: 'transfer_bca',
    paymentMethodLabel: 'Transfer Bank BCA',
    bankAccount: 'BCA 1250987341 a/n Paguyuban Jeep Wisata Bromo',
    referenceNumber: 'TKT-JEEP-BRM-04',
    description: 'Sewa 2 Unit Hardtop Jeep 4x4 Sunrise Penanjakan, Kawah Bromo & Pasir Berbisik + Tiket TNBTS',
    createdAt: '2026-11-03 15:10',
    approvedBy: 'Finance PERGIDIANTAR'
  },
  {
    id: 'pay-tkt-03',
    paymentNumber: 'PAY-TKT-202611-003',
    category: 'tourist_spot',
    categoryLabel: 'Pembayaran Tiket Tempat Wisata',
    vendorName: 'Maruti Fastboat & Tiket Nusa Penida Island',
    recipientContact: '0361-282110 (Dermaga Sanur)',
    relatedOrderId: 'ord-03',
    relatedOrderNumber: 'PGD-202611-0091',
    packageName: 'Eksotika Nusa Penida & Ubud Sunset',
    destination: 'Bali',
    amount: 1800000,
    date: '2026-11-15',
    status: 'menunggu',
    paymentMethod: 'transfer_bca',
    paymentMethodLabel: 'Transfer Bank BCA',
    bankAccount: 'BCA 7720192837 a/n Maruti Express Bali',
    referenceNumber: 'TKT-FSTBT-NP-332',
    description: 'Tiket Fastboat PP Sanur - Nusa Penida (8 Pax) & Retribusi Konservasi Wisata Pulau',
    createdAt: '2026-11-04 17:00',
    approvedBy: 'Benisius Rahmat Basuki (Super Admin)'
  },
  {
    id: 'pay-tkt-04',
    paymentNumber: 'PAY-TKT-202611-004',
    category: 'tourist_spot',
    categoryLabel: 'Pembayaran Tiket Tempat Wisata',
    vendorName: 'Jawa Timur Park Group (Jatim Park 3 & Museum Angkut)',
    recipientContact: '0341-597777 (Sales Group Batu)',
    relatedOrderId: 'ord-02',
    relatedOrderNumber: 'PGD-202611-0090',
    packageName: 'Bromo Sunrise & Batu Malang Leisure',
    destination: 'Malang & Batu',
    amount: 1600000,
    date: '2026-11-11',
    status: 'selesai',
    paymentMethod: 'transfer_mandiri',
    paymentMethodLabel: 'Transfer Bank Mandiri',
    bankAccount: 'Mandiri 144001928374 a/n PT Bunga Wangsa Sedjati (JTP Group)',
    referenceNumber: 'E-TKT-JTP-2026',
    description: 'Tiket masuk terusan Dino Park Jatim Park 3 & Museum Angkut Batu Malang',
    createdAt: '2026-11-03 16:30',
    approvedBy: 'Finance PERGIDIANTAR'
  }
];
