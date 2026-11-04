import React from 'react';
import { Compass, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentRole, setActiveTab } = useApp();

  return (
    <footer className="bg-neutral-950 text-white border-t border-neutral-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Summary */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white p-0.5 shrink-0 border border-neutral-700">
                <img 
                  src="/assets/aistudio/1793582722648_90a12056.jpg" 
                  alt="Logo PERGIDIANTAR" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                PERGI<span className="text-orange-500">DIANTAR</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Penyedia jasa perjalanan wisata terpercaya yang memfasilitasi kebutuhan tour Jogja, Malang, dan Bali. Paket All In & Hemat dengan jaminan unit armada prima.
            </p>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>PT Pergi Diantar Wisata Nusantara</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5 text-xs text-neutral-400">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-1">
              Pilihan Paket Tour
            </span>
            <p className="hover:text-orange-400 transition-colors cursor-pointer" onClick={() => { setActiveTab('catalog'); }}>
              Single Trip Jogja Heritage
            </p>
            <p className="hover:text-orange-400 transition-colors cursor-pointer" onClick={() => { setActiveTab('catalog'); }}>
              Family Trip Jogja Santai
            </p>
            <p className="hover:text-orange-400 transition-colors cursor-pointer" onClick={() => { setActiveTab('catalog'); }}>
              Family Gathering (Jogja, Malang, Bali)
            </p>
            <p className="hover:text-orange-400 transition-colors cursor-pointer" onClick={() => { setActiveTab('catalog'); }}>
              Company Gathering Team Building
            </p>
            <p className="hover:text-orange-400 transition-colors cursor-pointer" onClick={() => { setActiveTab('catalog'); }}>
              Study Tour Edukasi Siswa
            </p>
          </div>

          {/* Core Facilities */}
          <div className="space-y-2.5 text-xs text-neutral-400">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-1">
              Fasilitas Seluruh Paket
            </span>
            <p>1. Transportasi (Unit Armada, Driver, BBM, Parkir & Tol)</p>
            <p>2. Akomodasi (Hotel Bintang Pilihan & Makan Teratur)</p>
            <p>3. Tiket Masuk Lengkap Objek Wisata</p>
            <p>4. Sistem Pembayaran Terintegrasi (QRIS, VA & Transfer)</p>
          </div>

          {/* Contact & Admin Portal */}
          <div className="space-y-2.5 text-xs text-neutral-400">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-1">
              Hubungi Kantor Pusat
            </span>
            <a 
              href="https://wa.me/6287716443331" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-orange-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>WhatsApp: 087716443331</span>
            </a>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Pergi.diantar@gmail.com</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
              <span>Jambon - Kota Jogjakarta</span>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setCurrentRole('super_admin');
                  setActiveTab('admin-orders');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 hover:text-orange-400 text-neutral-200 rounded-lg text-[11px] font-semibold transition-colors"
              >
                Masuk Dashboard Admin &rarr;
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 PERGIDIANTAR. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Syarat & Ketentuan Reservasi</span>
            <span>·</span>
            <span>Kebijakan Privasi</span>
            <span>·</span>
            <span>Standar Keamanan Armada</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
