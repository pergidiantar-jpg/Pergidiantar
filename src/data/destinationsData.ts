import { DestinationRegion } from '../types/travel';

export interface DestinationOption {
  id: string;
  name: string;
  city: DestinationRegion;
  category: string;
  avgTicketPrice: number;
  rating: number; // e.g. 4.8
  reviewCount: string; // e.g. '125rb+ ulasan'
  badge?: string; // e.g. 'Viral 2026', 'Ikon Dunia', 'Rating 4.9'
  highlight: string;
  lat?: number;
  lng?: number;
  isCustomAdded?: boolean;
}

export interface BonusDestinationInfo {
  city: DestinationRegion;
  title: string;
  description: string;
  items: string[];
}

export const KNOWN_LANDMARK_COORDS: Array<{
  keywords: string[];
  region: DestinationRegion;
  lat: number;
  lng: number;
  label: string;
}> = [
  // YOGYAKARTA LANDMARKS & HUBS
  { keywords: ['yia', 'kulon progo', 'kulonprogo'], region: 'jogja', lat: -7.9006, lng: 110.0547, label: 'Bandara YIA Kulon Progo' },
  { keywords: ['adisucipto', 'adisutjipto', 'maguwo'], region: 'jogja', lat: -7.7882, lng: 110.4318, label: 'Kawasan Bandara Adisucipto' },
  { keywords: ['tugu', 'malioboro', 'nol kilometer', 'pusat kota yogyakarta', 'kota jogja', 'jogja'], region: 'jogja', lat: -7.7926, lng: 110.3658, label: 'Pusat Kota / Stasiun Tugu Malioboro' },
  { keywords: ['lempuyangan'], region: 'jogja', lat: -7.7904, lng: 110.3755, label: 'Stasiun Lempuyangan' },
  { keywords: ['hotel', 'penginapan', 'resort', 'akomodasi'], region: 'jogja', lat: -7.7865, lng: 110.3780, label: 'Area Hotel Mitra Yogyakarta' },
  { keywords: ['kotagede', 'bakpia', 'pathok', 'oleh-oleh', 'beringharjo'], region: 'jogja', lat: -7.8014, lng: 110.3649, label: 'Sentra Oleh-Oleh & Bakpia Jogja' },
  { keywords: ['outbound', 'outbond', 'kaliurang', 'ledok sambi', 'pakem'], region: 'jogja', lat: -7.6489, lng: 110.4222, label: 'Kawasan Outbound Kaliurang Merapi' },
  { keywords: ['wonosari', 'gunungkidul', 'gunung kidul'], region: 'jogja', lat: -7.9668, lng: 110.6015, label: 'Kawasan Gunungkidul' },
  { keywords: ['bantul', 'kasongan', 'imogiri'], region: 'jogja', lat: -7.8886, lng: 110.3289, label: 'Kawasan Bantul' },
  { keywords: ['sleman', 'palagan', 'seturan'], region: 'jogja', lat: -7.7352, lng: 110.3775, label: 'Kawasan Sleman Utara' },
  { keywords: ['ratu boko', 'boko'], region: 'jogja', lat: -7.7705, lng: 110.4894, label: 'Candi Ratu Boko' },

  // MALANG & BROMO LANDMARKS & HUBS
  { keywords: ['abdulrachman', 'abdul rachman', 'bandara malang'], region: 'malang', lat: -7.9266, lng: 112.7145, label: 'Bandara Abdulrachman Saleh Malang' },
  { keywords: ['stasiun malang', 'kotabaru', 'kota baru', 'alun-alun malang', 'tugu malang', 'malang'], region: 'malang', lat: -7.9772, lng: 112.6338, label: 'Pusat Kota / Stasiun Malang Kota Baru' },
  { keywords: ['hotel', 'penginapan', 'resort', 'akomodasi'], region: 'malang', lat: -7.8825, lng: 112.5335, label: 'Area Hotel Mitra Batu / Malang' },
  { keywords: ['batu', 'kota batu', 'outbound', 'outbond', 'coban talun', 'selecta'], region: 'malang', lat: -7.8712, lng: 112.5269, label: 'Kawasan Kota Wisata Batu' },
  { keywords: ['bromo', 'penanjakan', 'cemoro lawang', 'tengger'], region: 'malang', lat: -7.9425, lng: 112.9530, label: 'Kawasan Gunung Bromo' },
  { keywords: ['sanan', 'oleh-oleh', 'strudel', 'keripik'], region: 'malang', lat: -7.9598, lng: 112.6416, label: 'Sentra Oleh-Oleh Malang (Sanan)' },
  { keywords: ['surabaya', 'juanda', 'gubeng'], region: 'malang', lat: -7.3798, lng: 112.7869, label: 'Bandara Juanda / Surabaya' },

  // BALI LANDMARKS & HUBS
  { keywords: ['ngurah rai', 'bandara bali', 'dps', 'tuban'], region: 'bali', lat: -8.7467, lng: 115.1668, label: 'Bandara Internasional Ngurah Rai' },
  { keywords: ['kuta', 'seminyak', 'legian', 'sunset road', 'krisna', 'joger'], region: 'bali', lat: -8.7185, lng: 115.1686, label: 'Kawasan Kuta / Sunset Road Bali' },
  { keywords: ['denpasar', 'sanur'], region: 'bali', lat: -8.6705, lng: 115.2126, label: 'Kawasan Denpasar / Sanur' },
  { keywords: ['hotel', 'penginapan', 'resort', 'akomodasi'], region: 'bali', lat: -8.7050, lng: 115.1765, label: 'Area Hotel Mitra Bali Selatan' },
  { keywords: ['ubud', 'gianyar', 'outbound', 'outbond'], region: 'bali', lat: -8.5069, lng: 115.2625, label: 'Kawasan Outbound & Alam Ubud' },
  { keywords: ['nusa dua', 'tanjung benoa', 'jimbaran'], region: 'bali', lat: -8.7952, lng: 115.2227, label: 'Kawasan Nusa Dua / Jimbaran' },
  { keywords: ['gilimanuk', 'jembrana', 'negara'], region: 'bali', lat: -8.1636, lng: 114.4383, label: 'Pelabuhan Gilimanuk / Bali Barat' },
  { keywords: ['canggu', 'tanah lot'], region: 'bali', lat: -8.6212, lng: 115.0868, label: 'Kawasan Canggu / Tanah Lot' },
  { keywords: ['bedugul', 'buleleng', 'lovina'], region: 'bali', lat: -8.2752, lng: 115.1668, label: 'Kawasan Bedugul Bali Utara' }
];

export const BONUS_DESTINATIONS: Record<DestinationRegion, BonusDestinationInfo> = {
  jogja: {
    city: 'jogja',
    title: 'Bonus Eksklusif: Ikon Kota, Malioboro & Sentra Oleh-Oleh',
    description: 'Semua pilihan paket sudah otomatis termasuk kunjungan bebas santai tanpa memotong kuota destinasi utama.',
    items: [
      'Kawasan Ikonik Malioboro & Titik Nol Kilometer Yogyakarta',
      'Sentra Pembuatan & Belanja Bakpia Pathok 25 / Bakpia Kukus Tugu',
      'Pusat Kerajinan Perak Kotagede & Batik Tradisional Pasar Beringharjo'
    ]
  },
  malang: {
    city: 'malang',
    title: 'Bonus Eksklusif: Ikon Kota Batu & Sentra Keripik Apel',
    description: 'Semua pilihan paket sudah otomatis termasuk kunjungan bebas santai tanpa memotong kuota destinasi utama.',
    items: [
      'Alun-Alun Kota Wisata Batu & Spot Foto Kincir Ria Legendaris',
      'Sentra Industri Keripik Tempe & Apel Khas Malang (Sanan)',
      'Pusat Oleh-Oleh Strudel Malang & Pos Ketan Legenda 1967'
    ]
  },
  bali: {
    city: 'bali',
    title: 'Bonus Eksklusif: Ikon Pantai Selatan & Sentra Krisna Bali',
    description: 'Semua pilihan paket sudah otomatis termasuk kunjungan bebas santai tanpa memotong kuota destinasi utama.',
    items: [
      'Panorama Sunset Ikonik Pantai Kuta / Teluk Jimbaran',
      'Pusat Oleh-Oleh Agung Bali / Krisna Sunset Road Terlengkap',
      'Sentra Kaos Kata-Kata Unik Joger Luwus & Pie Susu Asli Bali'
    ]
  }
};

/**
 * Kuota batas maksimal destinasi berdasarkan durasi tour:
 * - 2D1N (2 Hari) -> Maksimal 4 destinasi
 * - 3D2N (3 Hari) -> Maksimal 6 destinasi
 * - 4D3N (4 Hari) -> Maksimal 8 destinasi
 * - 5D4N (5 Hari) -> Maksimal 10 destinasi
 * - 6D5N (6 Hari) -> Maksimal 12 destinasi
 * - 7D6N (7 Hari) -> Maksimal 14 destinasi
 */
export const getMaxDestinationsForDuration = (days: number): number => {
  switch (days) {
    case 2: return 4;
    case 3: return 6;
    case 4: return 8;
    case 5: return 10;
    case 6: return 12;
    case 7: return 14;
    default: return Math.min(14, Math.max(4, days * 2));
  }
};

export const INITIAL_DESTINATIONS: DestinationOption[] = [
  // ==========================================
  // 1. YOGYAKARTA (20 Destinasi Terpopuler & Viral + Koordinat Presisi)
  // ==========================================
  {
    id: 'jog-01',
    name: 'Candi Borobudur & Dagi Abhirama',
    city: 'jogja',
    category: 'Cagar Budaya Dunia',
    avgTicketPrice: 50000,
    rating: 4.8,
    reviewCount: '125rb+ ulasan',
    badge: 'Ikon Dunia',
    highlight: 'Mahakarya arsitektur Buddha terbesar di dunia berlatar pegunungan menoreh',
    lat: -7.6079,
    lng: 110.2038
  },
  {
    id: 'jog-02',
    name: 'Candi Prambanan & Roro Jonggrang',
    city: 'jogja',
    category: 'Cagar Budaya Megah',
    avgTicketPrice: 50000,
    rating: 4.8,
    reviewCount: '98rb+ ulasan',
    badge: 'Warisan UNESCO',
    highlight: 'Kompleks candi Hindu terindah dengan relief Ramayana yang memukau',
    lat: -7.7520,
    lng: 110.4915
  },
  {
    id: 'jog-03',
    name: 'Lava Tour Merapi (Jeep 4x4 Offroad)',
    city: 'jogja',
    category: 'Petualangan Vulkanik',
    avgTicketPrice: 90000,
    rating: 4.9,
    reviewCount: '48rb+ ulasan',
    badge: 'Rating 4.9 · Viral',
    highlight: 'Sensasi offroad menyusuri bunker Kaliadem, Museum Sisa Hartaku & manuver air Kali Kuning',
    lat: -7.5961,
    lng: 110.4478
  },
  {
    id: 'jog-04',
    name: 'HeHa Sky View Patuk',
    city: 'jogja',
    category: 'Panorama & Citylight',
    avgTicketPrice: 35000,
    rating: 4.6,
    reviewCount: '42rb+ ulasan',
    badge: 'Hits & Kekinian',
    highlight: 'Restoran bertingkat dengan spot foto kaca berlatar gemerlap lampu malam kota Jogja',
    lat: -7.8495,
    lng: 110.4783
  },
  {
    id: 'jog-05',
    name: 'Obelix Hills Sunset Deck',
    city: 'jogja',
    category: 'Sunset & Musik Akustik',
    avgTicketPrice: 30000,
    rating: 4.7,
    reviewCount: '30rb+ ulasan',
    badge: 'Sunset Terbaik',
    highlight: 'Bersantai di atas perbukitan purba dengan 30+ spot foto dan live music syahdu',
    lat: -7.8058,
    lng: 110.5067
  },
  {
    id: 'jog-06',
    name: 'Cave Tubing Goa Pindul & Sungai Oya',
    city: 'jogja',
    category: 'Susur Sungai Alami',
    avgTicketPrice: 65000,
    rating: 4.8,
    reviewCount: '35rb+ ulasan',
    badge: 'Favorit Keluarga',
    highlight: 'Menyusuri stalaktit megah goa bawah tanah menggunakan ban pelampung dan air terjun Oya',
    lat: -7.9306,
    lng: 110.6486
  },
  {
    id: 'jog-07',
    name: 'Keraton Ngayogyakarta & Tamansari Water Castle',
    city: 'jogja',
    category: 'Sejarah & Budaya Istana',
    avgTicketPrice: 30000,
    rating: 4.7,
    reviewCount: '55rb+ ulasan',
    badge: 'Eksplorasi Sejarah',
    highlight: 'Kompleks pemandian permaisuri rahasia bawah tanah dan istana Sultan Mataram yang agung',
    lat: -7.8053,
    lng: 110.3642
  },
  {
    id: 'jog-08',
    name: 'Tebing Breksi & Amphitheater',
    city: 'jogja',
    category: 'Spot Seni Pahatan Kapur',
    avgTicketPrice: 20000,
    rating: 4.6,
    reviewCount: '45rb+ ulasan',
    badge: 'Spot Foto Unik',
    highlight: 'Tebing batu kapur purba yang diukir relief naga wayang megah menghadap panorama Jogja',
    lat: -7.7815,
    lng: 110.5046
  },
  {
    id: 'jog-09',
    name: 'Pantai Timang & Jembatan Gantung Karang',
    city: 'jogja',
    category: 'Petualangan Bahari Ekstrem',
    avgTicketPrice: 80000,
    rating: 4.8,
    reviewCount: '20rb+ ulasan',
    badge: 'Paling Menantang',
    highlight: 'Menyeberang ke pulau karang karang terjal dengan gondola manual di atas deburan ombak samudra',
    lat: -8.1764,
    lng: 110.6626
  },
  {
    id: 'jog-10',
    name: 'HeHa Ocean View Gunungkidul',
    city: 'jogja',
    category: 'Wisata Tebing Laut',
    avgTicketPrice: 35000,
    rating: 4.6,
    reviewCount: '32rb+ ulasan',
    badge: 'Instagramable',
    highlight: 'Spot foto modern di bibir tebing menghadap laut lepas Samudra Hindia nan biru',
    lat: -8.1202,
    lng: 110.4892
  },
  {
    id: 'jog-11',
    name: 'Hutan Pinus Mangunan & Asri Dlingo',
    city: 'jogja',
    category: 'Hutan Pinus & Alam Sejuk',
    avgTicketPrice: 15000,
    rating: 4.7,
    reviewCount: '38rb+ ulasan',
    badge: 'Teduh & Damai',
    highlight: 'Deretan pepohonan pinus menjulang tinggi dengan udara segar dan panggung teater kayu',
    lat: -7.9261,
    lng: 110.4319
  },
  {
    id: 'jog-12',
    name: 'Puncak Becici Dlingo',
    city: 'jogja',
    category: 'Panorama Alam & Sunset',
    avgTicketPrice: 15000,
    rating: 4.7,
    reviewCount: '24rb+ ulasan',
    badge: 'Kunjungan Tokoh Dunia',
    highlight: 'Gardu pandang kayu dengan lanskap hutan lebat, Candi Prambanan dan matahari terbenam',
    lat: -7.9016,
    lng: 110.4394
  },
  {
    id: 'jog-13',
    name: 'Studio Alam Gamplong (Mini Hollywood)',
    city: 'jogja',
    category: 'Studio Film & Vintage',
    avgTicketPrice: 25000,
    rating: 4.6,
    reviewCount: '18rb+ ulasan',
    badge: 'Sinematik',
    highlight: 'Replika benteng Batavia abad ke-16 karya sutradara Hanung Bramantyo dengan trem antik',
    lat: -7.8065,
    lng: 110.2389
  },
  {
    id: 'jog-14',
    name: 'Pantai Drini & Kano Transparan',
    city: 'jogja',
    category: 'Pantai Pasir Putih',
    avgTicketPrice: 20000,
    rating: 4.7,
    reviewCount: '28rb+ ulasan',
    badge: 'Air Jernih',
    highlight: 'Pantai berpasir putih lembut dengan pulau karang pembagi ombak dan kano kaca',
    lat: -8.1383,
    lng: 110.5776
  },
  {
    id: 'jog-15',
    name: 'Pantai Parangtritis & Gumuk Pasir Barchan',
    city: 'jogja',
    category: 'Bahari & Fenomena Pasir',
    avgTicketPrice: 20000,
    rating: 4.6,
    reviewCount: '85rb+ ulasan',
    badge: 'Legendaris',
    highlight: 'Gumuk pasir langka di dunia untuk sandboarding dan naik bendi santai di tepi pantai',
    lat: -8.0252,
    lng: 110.3333
  },
  {
    id: 'jog-16',
    name: 'Agrowisata Bhumi Merapi (Santorini Jogja)',
    city: 'jogja',
    category: 'Edukasi & Arsitektur Mediterania',
    avgTicketPrice: 35000,
    rating: 4.6,
    reviewCount: '16rb+ ulasan',
    badge: 'Spot Eropa',
    highlight: 'Lorong-lorong putih biru khas Santorini Yunani dan interaksi satwa kelinci jinak',
    lat: -7.6579,
    lng: 110.4158
  },
  {
    id: 'jog-17',
    name: 'Tumpeng Menoreh & Sunrise View',
    city: 'jogja',
    category: 'Puncak Bukit 360 Derajat',
    avgTicketPrice: 50000,
    rating: 4.7,
    reviewCount: '16rb+ ulasan',
    badge: 'Sunrise Spektakuler',
    highlight: 'Bangunan berbentuk tumpeng di puncak bukit dengan pemandangan 4 gunung berapi sekaligus',
    lat: -7.6512,
    lng: 110.1235
  },
  {
    id: 'jog-18',
    name: 'Ledok Sambi Kaliurang Ecopark',
    city: 'jogja',
    category: 'Piknik & Outbound Sungai',
    avgTicketPrice: 25000,
    rating: 4.8,
    reviewCount: '22rb+ ulasan',
    badge: 'Piknik Santai',
    highlight: 'Menikmati kuliner hangat sembari merendam kaki di sungai jernih berhawa sejuk lereng Merapi',
    lat: -7.6657,
    lng: 110.4252
  },
  {
    id: 'jog-19',
    name: 'Nawang Jagad Kaliurang View Merapi',
    city: 'jogja',
    category: 'Panorama Merapi Terdekat',
    avgTicketPrice: 20000,
    rating: 4.8,
    reviewCount: '14rb+ ulasan',
    badge: 'Estetik Alami',
    highlight: 'Lembah hijau terbuka dengan pemandangan kubah puncak Gunung Merapi yang tampak sangat dekat',
    lat: -7.5882,
    lng: 110.4227
  },
  {
    id: 'jog-20',
    name: 'Suwatu Heritage by Mil&Bay',
    city: 'jogja',
    category: 'Sunset & Heritage Luxury',
    avgTicketPrice: 40000,
    rating: 4.7,
    reviewCount: '12rb+ ulasan',
    badge: 'Eksklusif VIP',
    highlight: 'Venue restoran terbuka eksklusif dengan view Candi Prambanan dan Gunung Merapi yang magis',
    lat: -7.7770,
    lng: 110.4898
  },

  // ==========================================
  // 2. MALANG & BROMO / BATU (20 Destinasi Terpopuler & Viral + Koordinat Presisi)
  // ==========================================
  {
    id: 'mlg-01',
    name: 'Bromo Sunrise Jeep Adventure (Penanjakan & Kawah)',
    city: 'malang',
    category: 'Petualangan Vulkanik Dunia',
    avgTicketPrice: 120000,
    rating: 4.9,
    reviewCount: '90rb+ ulasan',
    badge: 'Keajaiban Dunia',
    highlight: 'Konvoi Jeep 4x4 menyaksikan matahari terbit magis di atas lautan awan Bromo',
    lat: -7.9425,
    lng: 112.9530
  },
  {
    id: 'mlg-02',
    name: 'Museum Angkut Movie Star Studio',
    city: 'malang',
    category: 'Edukasi Transportasi & Sinema',
    avgTicketPrice: 100000,
    rating: 4.8,
    reviewCount: '70rb+ ulasan',
    badge: 'Terbesar di Asia',
    highlight: 'Koleksi 300+ mobil antik dunia dalam zona Broadway, Gangster Town, dan Istana Buckingham',
    lat: -7.8788,
    lng: 112.5200
  },
  {
    id: 'mlg-03',
    name: 'Jatim Park 2 (Batu Secret Zoo & Museum Satwa)',
    city: 'malang',
    category: 'Kebun Binatang Modern',
    avgTicketPrice: 125000,
    rating: 4.8,
    reviewCount: '60rb+ ulasan',
    badge: 'Terbaik Asia Tenggara',
    highlight: 'Kebun binatang berstandar internasional dengan habitat alami satwa dan fosil purba raksasa',
    lat: -7.8891,
    lng: 112.5295
  },
  {
    id: 'mlg-04',
    name: 'Jatim Park 3 (Dino Park & Legend Stars)',
    city: 'malang',
    category: 'Theme Park Prasejarah',
    avgTicketPrice: 110000,
    rating: 4.7,
    reviewCount: '48rb+ ulasan',
    badge: 'Favorit Anak & Keluarga',
    highlight: 'Jelajah zaman dinosaurus animatronik bergerak dan berfoto bersama replika lilin tokoh dunia',
    lat: -7.8967,
    lng: 112.5532
  },
  {
    id: 'mlg-05',
    name: 'Flora Wisata San Terra de Laponte',
    city: 'malang',
    category: 'Taman Bunga & Rainbow Slide',
    avgTicketPrice: 35000,
    rating: 4.7,
    reviewCount: '40rb+ ulasan',
    badge: 'Viral TikTok',
    highlight: 'Taman ratusan jenis bunga dengan seluncuran pelangi terpanjang dan bangunan arsitektur Eropa',
    lat: -7.8323,
    lng: 112.4631
  },
  {
    id: 'mlg-06',
    name: 'Coban Rondo Air Terjun & Taman Labirin',
    city: 'malang',
    category: 'Air Terjun & Hutan Wisata',
    avgTicketPrice: 40000,
    rating: 4.6,
    reviewCount: '35rb+ ulasan',
    badge: 'Sejuk Alami',
    highlight: 'Air terjun setinggi 84 meter yang melegenda dengan labirin tanaman hijau raksasa',
    lat: -7.8848,
    lng: 112.4774
  },
  {
    id: 'mlg-07',
    name: 'Coban Sewu / Tumpak Sewu Waterfall',
    city: 'malang',
    category: 'Wisata Alam Spektakuler',
    avgTicketPrice: 50000,
    rating: 4.9,
    reviewCount: '30rb+ ulasan',
    badge: 'Niagara Indonesia',
    highlight: 'Tirai air terjun melingkar setengah lingkaran yang memukau di lembah kaki Semeru',
    lat: -8.2305,
    lng: 112.9177
  },
  {
    id: 'mlg-08',
    name: 'Petik Apel Agro Kusuma Wisata Batu',
    city: 'malang',
    category: 'Agrowisata Khas Malang',
    avgTicketPrice: 50000,
    rating: 4.6,
    reviewCount: '32rb+ ulasan',
    badge: 'Ikonik Kota Batu',
    highlight: 'Sensasi memetik apel Manalagi segar langsung dari dahan pohon sepuasnya di perkebunan',
    lat: -7.8861,
    lng: 112.5138
  },
  {
    id: 'mlg-09',
    name: 'Batu Night Spectacular (BNS)',
    city: 'malang',
    category: 'Taman Lampion & Wahana Malam',
    avgTicketPrice: 45000,
    rating: 4.6,
    reviewCount: '42rb+ ulasan',
    badge: 'Hiburan Malam',
    highlight: 'Ratusan instalasi lampion menyala warna-warni, rumah hantu, dan wahana sepeda udara malam',
    lat: -7.8965,
    lng: 112.5348
  },
  {
    id: 'mlg-10',
    name: 'Lembah Savana & Pasir Berbisik Bromo',
    city: 'malang',
    category: 'Savana Hijau Teletubbies',
    avgTicketPrice: 40000,
    rating: 4.8,
    reviewCount: '25rb+ ulasan',
    badge: 'Eksotis Alam',
    highlight: 'Padang rumput berbukit hijau yang luas kontras dengan lautan pasir vulkanik yang berbisik',
    lat: -7.9685,
    lng: 112.9612
  },
  {
    id: 'mlg-11',
    name: 'Taman Rekreasi Selecta Batu',
    city: 'malang',
    category: 'Taman Bunga Legendaris',
    avgTicketPrice: 45000,
    rating: 4.7,
    reviewCount: '50rb+ ulasan',
    badge: 'Klasik Bersejarah',
    highlight: 'Taman bunga terawat peninggalan era kolonial dengan kolam renang alami air pegunungan',
    lat: -7.8181,
    lng: 112.5256
  },
  {
    id: 'mlg-12',
    name: 'Pantai Balekambang (Tanah Lot Jawa Timur)',
    city: 'malang',
    category: 'Bahari & Pura Karang',
    avgTicketPrice: 30000,
    rating: 4.6,
    reviewCount: '38rb+ ulasan',
    badge: 'Pura Laut Megah',
    highlight: 'Pura Amarta Jati yang berdiri anggun di atas pulau karang dihubungkan jembatan panjang',
    lat: -8.4036,
    lng: 112.5393
  },
  {
    id: 'mlg-13',
    name: 'Malang Night Paradise & Glowing River',
    city: 'malang',
    category: 'Wisata Cahaya & Wahana Air',
    avgTicketPrice: 65000,
    rating: 4.7,
    reviewCount: '22rb+ ulasan',
    badge: 'Gemerlap Malam',
    highlight: 'Menyusuri terowongan sungai cahaya futuristik pertama di Indonesia dengan perahu santai',
    lat: -7.9168,
    lng: 112.6499
  },
  {
    id: 'mlg-14',
    name: 'Cafe Sawah Pujon Kidul',
    city: 'malang',
    category: 'Agro Kuliner Pedesaan',
    avgTicketPrice: 25000,
    rating: 4.6,
    reviewCount: '28rb+ ulasan',
    badge: 'Asri Pedesaan',
    highlight: 'Menikmati hidangan nasi jagung tradisional di saung-saung di tengah hamparan sawah hijau',
    lat: -7.8473,
    lng: 112.4608
  },
  {
    id: 'mlg-15',
    name: 'Eco Green Park Batu',
    city: 'malang',
    category: 'Edukasi Ekologi & Konservasi',
    avgTicketPrice: 60000,
    rating: 4.7,
    reviewCount: '26rb+ ulasan',
    badge: 'Edukasi Lingkungan',
    highlight: 'Kandang burung raksasa berjalan, wahana edukasi sains gempa bumi dan pengolahan limbah ramah lingkungan',
    lat: -7.8878,
    lng: 112.5276
  },
  {
    id: 'mlg-16',
    name: 'Paralayang & Omah Kayu Gunung Banyak',
    city: 'malang',
    category: 'Ketinggian & Rumah Pohon',
    avgTicketPrice: 25000,
    rating: 4.7,
    reviewCount: '32rb+ ulasan',
    badge: 'Pemandangan 180°',
    highlight: 'Memandang gemerlap lampu kota Batu dari atas rumah pohon pinus di ketinggian 1.300 mdpl',
    lat: -7.8555,
    lng: 112.4956
  },
  {
    id: 'mlg-17',
    name: 'Predator Fun Park Batu',
    city: 'malang',
    category: 'Satwa Predator & Outbound',
    avgTicketPrice: 50000,
    rating: 4.6,
    reviewCount: '20rb+ ulasan',
    badge: 'Seru & Edukatif',
    highlight: 'Melihat interaksi penangkaran buaya dan wahana outbond air flying fox yang memicu adrenalin',
    lat: -7.9126,
    lng: 112.5491
  },
  {
    id: 'mlg-18',
    name: 'Sumber Sira Putukrejo',
    city: 'malang',
    category: 'Mata Air Snorkeling Tawar',
    avgTicketPrice: 15000,
    rating: 4.7,
    reviewCount: '18rb+ ulasan',
    badge: 'Kejernihan Kristal',
    highlight: 'Berenang dan snorkeling air tawar sebening kaca dengan pemandangan lumut hijau bawah air',
    lat: -8.1204,
    lng: 112.6177
  },
  {
    id: 'mlg-19',
    name: 'Batu Love Garden (BALOGA)',
    city: 'malang',
    category: 'Konservasi Bunga Tropis',
    avgTicketPrice: 60000,
    rating: 4.7,
    reviewCount: '18rb+ ulasan',
    badge: 'Ribuan Spesies',
    highlight: 'Rumah kaca megah dengan koleksi 600 varietas bunga langka dan rangkaian karya seni flora',
    lat: -7.8576,
    lng: 112.5332
  },
  {
    id: 'mlg-20',
    name: 'Alun-Alun Kota Wisata Batu & Bianglala',
    city: 'malang',
    category: 'Pusat Kota & Kuliner Legendaris',
    avgTicketPrice: 10000,
    rating: 4.7,
    reviewCount: '52rb+ ulasan',
    badge: 'Ikon Ramai',
    highlight: 'Naik bianglala raksasa melihat kota Batu dan berburu Pos Ketan Legenda legendaris',
    lat: -7.8712,
    lng: 112.5269
  },

  // ==========================================
  // 3. BALI (20 Destinasi Terpopuler & Viral + Koordinat Presisi)
  // ==========================================
  {
    id: 'bli-01',
    name: 'Pura Luhur Uluwatu & Tari Kecak Sunset',
    city: 'bali',
    category: 'Budaya & Sunset Tebing Samudra',
    avgTicketPrice: 100000,
    rating: 4.8,
    reviewCount: '95rb+ ulasan',
    badge: 'Ikon Budaya Dunia',
    highlight: 'Pura di atas tebing setinggi 70 meter dengan pertunjukan Tari Kecak berlatar sunset samudera',
    lat: -8.8291,
    lng: 115.0849
  },
  {
    id: 'bli-02',
    name: 'Pura Tanah Lot & Karang Bolong',
    city: 'bali',
    category: 'Ikon Religi & Karang Samudra',
    avgTicketPrice: 60000,
    rating: 4.8,
    reviewCount: '115rb+ ulasan',
    badge: 'Wajib Kunjung',
    highlight: 'Pura sakral yang tampak mengapung di atas laut saat air pasang dengan pemandangan siluet sunset',
    lat: -8.6212,
    lng: 115.0868
  },
  {
    id: 'bli-03',
    name: 'Kintamani & Panorama Danau Batur',
    city: 'bali',
    category: 'Kaldera Berapi & Cafe Awan',
    avgTicketPrice: 50000,
    rating: 4.8,
    reviewCount: '48rb+ ulasan',
    badge: 'Cafe Awan Viral',
    highlight: 'Menikmati kopi Bali sembari memandang megahnya Gunung Batur dan danau biru berkabut sejuk',
    lat: -8.2820,
    lng: 115.3662
  },
  {
    id: 'bli-04',
    name: 'Nusa Penida (Kelingking Beach & Broken Beach)',
    city: 'bali',
    category: 'Kepulauan Fenomenal Dunia',
    avgTicketPrice: 150000,
    rating: 4.9,
    reviewCount: '65rb+ ulasan',
    badge: 'T-Rex Viral Dunia',
    highlight: 'Tebing karang legendaris berbentuk kepala dinosaurus T-Rex dan terowongan laut Broken Beach',
    lat: -8.7509,
    lng: 115.4743
  },
  {
    id: 'bli-05',
    name: 'Pura Ulun Danu Beratan Bedugul',
    city: 'bali',
    category: 'Danau Terapung Pegunungan',
    avgTicketPrice: 60000,
    rating: 4.8,
    reviewCount: '75rb+ ulasan',
    badge: 'Ikon Uang Kertas 50K',
    highlight: 'Pura air bersejarah yang seolah terapung di atas danau berkabut dingin Bedugul',
    lat: -8.2752,
    lng: 115.1668
  },
  {
    id: 'bli-06',
    name: 'Ubud Monkey Forest Sanctuary',
    city: 'bali',
    category: 'Hutan Lindung Sakral & Budaya',
    avgTicketPrice: 80000,
    rating: 4.7,
    reviewCount: '58rb+ ulasan',
    badge: 'Alami & Mistis',
    highlight: 'Hutan sakral seluas 12 hektar dihuni ratusan kera ekor panjang dan candi kuno bernuansa mistis',
    lat: -8.5194,
    lng: 115.2606
  },
  {
    id: 'bli-07',
    name: 'Pantai Melasti Ungasan & Tebing Kapur',
    city: 'bali',
    category: 'Pantai Tebing Selatan',
    avgTicketPrice: 30000,
    rating: 4.8,
    reviewCount: '45rb+ ulasan',
    badge: 'Pantai Paling Eksotis',
    highlight: 'Jalanan berkelok menembus dinding tebing kapur putih megah menuju air laut bergradasi toska',
    lat: -8.8481,
    lng: 115.1610
  },
  {
    id: 'bli-08',
    name: 'Pantai Pandawa & Patung Lima Ksatria',
    city: 'bali',
    category: 'Pasir Putih & Tebing Pahat',
    avgTicketPrice: 30000,
    rating: 4.7,
    reviewCount: '70rb+ ulasan',
    badge: 'Populer Nusantara',
    highlight: 'Pantai berpasir putih luas dengan ceruk tebing pahat patung lima ksatria Pandawa',
    lat: -8.8453,
    lng: 115.1869
  },
  {
    id: 'bli-09',
    name: 'Pura Tirta Empul Tampaksiring',
    city: 'bali',
    category: 'Mata Air Suci & Ritual Melukat',
    avgTicketPrice: 50000,
    rating: 4.7,
    reviewCount: '40rb+ ulasan',
    badge: 'Penyucian Jiwa',
    highlight: 'Kompleks kolam mata air alami suci untuk ritual melukat pembersihan spiritual',
    lat: -8.4156,
    lng: 115.3153
  },
  {
    id: 'bli-10',
    name: 'Tegalalang Rice Terrace & Bali Swing',
    city: 'bali',
    category: 'Lanskap Sawah Terasering',
    avgTicketPrice: 50000,
    rating: 4.7,
    reviewCount: '52rb+ ulasan',
    badge: 'Ikonik Ubud',
    highlight: 'Terasering sawah bertingkat hijau sistem Subak Bali dengan ayunan lembah yang ikonik',
    lat: -8.4316,
    lng: 115.2793
  },
  {
    id: 'bli-11',
    name: 'Watersport Tanjung Benoa (Banana Boat & Donut)',
    city: 'bali',
    category: 'Wahana Olahraga Air Bahari',
    avgTicketPrice: 120000,
    rating: 4.8,
    reviewCount: '42rb+ ulasan',
    badge: 'Adrenalin Bahari',
    highlight: 'Pusat wahana air terlengkap: banana boat, flying fish, parasailing, hingga snorkeling',
    lat: -8.7582,
    lng: 115.2233
  },
  {
    id: 'bli-12',
    name: 'Pantai Jimbaran Seafood Sunset Dinner',
    city: 'bali',
    category: 'Kuliner Romantis Tepi Pantai',
    avgTicketPrice: 35000,
    rating: 4.7,
    reviewCount: '48rb+ ulasan',
    badge: 'Sunset Kuliner',
    highlight: 'Menikmati hidangan olahan laut bakar khas bumbu Bali langsung di atas pasir pantai bertabur lilin',
    lat: -8.7824,
    lng: 115.1666
  },
  {
    id: 'bli-13',
    name: 'Alas Harum Bali Agrotourism',
    city: 'bali',
    category: 'Agrowisata Kopi & Glass Bridge',
    avgTicketPrice: 50000,
    rating: 4.8,
    reviewCount: '28rb+ ulasan',
    badge: 'Jembatan Kaca Viral',
    highlight: 'Jembatan kaca pertama di Bali berlatar lembah sawah, sangkar burung dan edukasi kopi luwak',
    lat: -8.4408,
    lng: 115.2799
  },
  {
    id: 'bli-14',
    name: 'Garuda Wisnu Kencana (GWK) Cultural Park',
    city: 'bali',
    category: 'Monumen Kebudayaan Mahakarya',
    avgTicketPrice: 125000,
    rating: 4.7,
    reviewCount: '80rb+ ulasan',
    badge: 'Patung Raksasa Dunia',
    highlight: 'Patung tembaga Dewa Wisnu menunggangi burung Garuda setinggi 121 meter karya Nyoman Nuarta',
    lat: -8.8104,
    lng: 115.1676
  },
  {
    id: 'bli-15',
    name: 'Air Terjun Kanto Lampo Gianyar',
    city: 'bali',
    category: 'Air Terjun Berundak Alami',
    avgTicketPrice: 35000,
    rating: 4.8,
    reviewCount: '25rb+ ulasan',
    badge: 'Spot Foto Eksotis',
    highlight: 'Formasi tebing batu hitam berundak di mana aliran air menyebar cantik untuk latar berfoto',
    lat: -8.5322,
    lng: 115.3316
  },
  {
    id: 'bli-16',
    name: 'Desa Wisata Penglipuran Bangli',
    city: 'bali',
    category: 'Desa Tradisional Terbersih Dunia',
    avgTicketPrice: 35000,
    rating: 4.9,
    reviewCount: '35rb+ ulasan',
    badge: 'Desa Terbersih Dunia',
    highlight: 'Tata ruang desa adat Bali kuno yang asri, tenang, bebas kendaraan bermotor dan penuh bunga',
    lat: -8.4222,
    lng: 115.3592
  },
  {
    id: 'bli-17',
    name: 'Pura Lempuyang Luhur (Gates of Heaven)',
    city: 'bali',
    category: 'Candi Puncak Gunung & Refleksi',
    avgTicketPrice: 55000,
    rating: 4.6,
    reviewCount: '30rb+ ulasan',
    badge: 'Gerbang Surga',
    highlight: 'Foto di antara celah gerbang candi belah dengan latar megah kerucut Gunung Agung',
    lat: -8.3915,
    lng: 115.6313
  },
  {
    id: 'bli-18',
    name: 'Pantai Sanur & Jalur Sepeda Tepi Laut',
    city: 'bali',
    category: 'Bahari & Matahari Terbit',
    avgTicketPrice: 15000,
    rating: 4.7,
    reviewCount: '42rb+ ulasan',
    badge: 'Sunrise Tenang',
    highlight: 'Pantai dengan ombak tenang yang ramah anak, gazebo tepi laut, dan trek bersepeda santai',
    lat: -8.6908,
    lng: 115.2634
  },
  {
    id: 'bli-19',
    name: 'Atlas Beach Fest & Canggu Coastline',
    city: 'bali',
    category: 'Lifestyle Beach Club & Pantai',
    avgTicketPrice: 100000,
    rating: 4.7,
    reviewCount: '36rb+ ulasan',
    badge: 'Lifestyle Terbesar',
    highlight: 'Beach club terbesar di Asia Tenggara dengan kolam renang tanpa batas dan pemandangan senja Canggu',
    lat: -8.6619,
    lng: 115.1381
  },
  {
    id: 'bli-20',
    name: 'Pasar Seni Sukawati & Ubud Art Market',
    city: 'bali',
    category: 'Sentra Seni & Kerajinan Tangan',
    avgTicketPrice: 10000,
    rating: 4.6,
    reviewCount: '32rb+ ulasan',
    badge: 'Pusat Kerajinan Seni',
    highlight: 'Pusat belanja lukisan, ukiran kayu, kain pantai dan kerajinan khas seniman Bali terotentik',
    lat: -8.5960,
    lng: 115.2830
  }
];
