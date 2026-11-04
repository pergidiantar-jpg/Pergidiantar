import React from 'react';
import { 
  Car, 
  Hotel, 
  Utensils, 
  Ticket, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Users,
  Compass,
  FileCheck
} from 'lucide-react';

export const InclusionsSection: React.FC = () => {
  const fleetTypes = [
    {
      title: 'Toyota HiAce Premio Luxury',
      capacity: '14 Penumpang',
      bestFor: 'Single Trip & Family Trip',
      features: 'Reclining leather seats, AC dingin, charger USB di setiap baris, peredam kabin senyap.',
      image: '/src/assets/images/hero_pergidiantar_travel_1793579233622.jpg'
    },
    {
      title: 'Medium Bus Jetbus 5',
      capacity: '31 - 33 Kursi',
      bestFor: 'Family Gathering & Outbound',
      features: 'Konfigurasi 2-2 nyaman, audio karaoke dual mic, Smart TV, bagasi luas bawah dan samping.',
      image: '/src/assets/images/fleet_hiace_bus_pergidiantar_1793579236036.jpg'
    },
    {
      title: 'Big Bus Pariwisata SHD',
      capacity: '48 - 50 Kursi',
      bestFor: 'Company Gathering & Study Tour',
      features: 'Air suspension empuk, toilet higienis, dispenser air panas, fasilitas keselamatan standar Kemenhub.',
      image: '/src/assets/images/fleet_hiace_bus_pergidiantar_1793579236036.jpg'
    }
  ];

  const faqs = [
    {
      q: 'Apa perbedaan mendasar antara Paket All In dan Paket Hemat?',
      a: 'Paket All In dirancang untuk kenyamanan tanpa beban tambahan: hotel bintang 3-4 pilihan, makan 3x sehari lengkap di restoran khas terfavorit, tiket wisata prioritas tanpa antre, snack & dokumentasi. Sedangkan Paket Hemat dirancang hemat budget: hotel bintang 2-3 / homestay bersih, makan 2x sehari, dan tiket wisata reguler. Keduanya sama-sama sudah mencakup armada transportasi, supir, BBM, parkir dan tol.'
    },
    {
      q: 'Bagaimana sistem pembayaran terintegrasi di PERGIDIANTAR?',
      a: 'Kami menyediakan pembayaran digital resmi melalui QRIS instan (mendukung seluruh e-wallet & m-banking di Indonesia), Virtual Account (BCA, Mandiri, BRI, BNI), serta transfer bank. Sistem langsung memverifikasi status pembayaran secara real-time dan menerbitkan bukti reservasi elektronik.'
    },
    {
      q: 'Apakah bisa melakukan penyesuaian rute (custom tour)?',
      a: 'Bisa! Anda dapat menghubungi Travel Specialist kami via fitur Live Chat di pojok kanan bawah atau menambahkan catatan khusus pada saat formulir reservasi online diisi.'
    },
    {
      q: 'Bagaimana penugasan armada kendaraan dan driver?',
      a: 'Sistem manajemen inventaris PERGIDIANTAR secara otomatis mencocokkan kapasitas jumlah peserta (pax) dengan unit kendaraan yang siap jalan (HiAce Premio untuk rombongan kecil, Medium Bus untuk rombongan sedang, dan Big Bus untuk gathering/study tour sekolah) lengkap dengan driver berpengalaman.'
    }
  ];

  return (
    <div id="inclusions-info" className="bg-neutral-100/60 py-16 border-t border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Core Inclusions Banner */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              STANDAR LAYANAN PERGIDIANTAR
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
              Seluruh Paket Penawaran Sudah Termasuk
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2">
              Tidak ada biaya tersembunyi. Dari penjemputan awal hingga kepulangan, seluruh kebutuhan perjalanan Anda telah disiapkan secara profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                1. Transportasi Penuh
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Unit armada pariwisata ber-AC dingin milik sendiri, supir ramah dan berlisensi, konsumsi bahan bakar (BBM), serta seluruh biaya retribusi tol dan parkir.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Hotel className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                2. Akomodasi & Konsumsi
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Pilihan hotel mitra terverifikasi bintang 3-4 (All In) atau hotel nyaman pilihan (Hemat) dengan fasilitas lengkap dan makan sesuai jadwal di restoran khas lokal.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                3. Tiket Wisata Lengkap
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Tiket masuk seluruh objek wisata unggulan (Candi Prambanan/Borobudur, Jeep Merapi/Bromo, Tari Kecak Uluwatu, Desa Penglipuran) tanpa perlu repot antre tiket.
              </p>
            </div>
          </div>
        </div>

        {/* Fleet Showcase */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                ARMADA PARIWISATA PRIMA
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
                Koleksi Kendaraan Terawat Siap Mengantar Anda
              </h2>
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              Uji Kelayakan KIR & Servis Rutin Terjamin
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fleetTypes.map((flt, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs flex flex-col">
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={flt.image}
                    alt={flt.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-neutral-900/80 backdrop-blur-md text-white rounded text-[11px] font-bold">
                    {flt.capacity}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase">
                      Cocok untuk: {flt.bestFor}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 mt-0.5">{flt.title}</h3>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {flt.features}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq-section">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              PUSAT INFORMASI
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {faqs.map((f, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
                <h3 className="text-xs font-bold text-neutral-900 flex items-start gap-2">
                  <span className="text-orange-500 font-black">Q.</span>
                  <span>{f.q}</span>
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed pl-5">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
