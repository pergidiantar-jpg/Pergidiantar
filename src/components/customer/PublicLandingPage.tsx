import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DestinationSlideshow } from './DestinationSlideshow';
import { PromotionalBanner } from './PromotionalBanner';
import { DestinationRegion, UserRole } from '../../types/travel';
import { 
  Lock, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Compass,
  MapPin,
  Car,
  Hotel,
  Ticket,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

export const PublicLandingPage: React.FC = () => {
  const { 
    handleCustomerLogin, 
    handleCustomerRegister, 
    handleStaffLogin,
    users 
  } = useApp();

  // Auth tabs on the landing page: 'login' | 'register' | 'staff'
  const [activeAuthTab, setActiveAuthTab] = useState<'login' | 'register' | 'staff'>('login');

  // Customer Login Form State
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);

  // Customer Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Staff / Super Admin Login Form State (Strictly empty by default on all devices)
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const scrollToAuthForm = () => {
    const el = document.getElementById('auth-portal-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Customer Login
  const onCustomerLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!customerEmail.trim() || !customerPassword.trim()) {
      setErrorMsg('Silakan masukkan email dan kata sandi Anda.');
      return;
    }

    setLoading(true);
    try {
      const ok = await handleCustomerLogin(customerEmail.trim(), customerPassword);
      if (!ok) {
        setErrorMsg('Email atau kata sandi tidak cocok. Silakan periksa kembali.');
      } else {
        setSuccessMsg('Login berhasil! Mengalihkan ke portal pelanggan...');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem login.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Customer Register
  const onCustomerRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regPhone.trim()) {
      setErrorMsg('Semua kolom pendaftaran wajib diisi.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const ok = await handleCustomerRegister(regName.trim(), regEmail.trim(), regPassword, regPhone.trim());
      if (!ok) {
        setErrorMsg('Pendaftaran gagal. Silakan coba kembali.');
      } else {
        setSuccessMsg('Pendaftaran berhasil! Akun Anda telah aktif.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan pendaftaran.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Staff / Super Admin Login (Strictly requires filling the form each time)
  const onStaffLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanUser = staffUsername.trim();
    const cleanPass = staffPassword.trim();

    if (!cleanUser) {
      setErrorMsg('Username / Email superadmin atau staf wajib diisi.');
      return;
    }

    if (!cleanPass) {
      setErrorMsg('Kata sandi (password) wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const ok = await handleStaffLogin(cleanUser, cleanPass);
      if (!ok) {
        setErrorMsg('Autentikasi gagal. Periksa kembali username dan kata sandi Anda.');
      } else {
        setSuccessMsg('Login berhasil! Mengalihkan ke portal manajemen...');
        setStaffUsername('');
        setStaffPassword('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Welcome Hero Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 text-white pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wide uppercase">
                <Compass className="w-4 h-4 text-orange-400" />
                <span>PERGIDIANTAR Biro Perjalanan Wisata Nusantara</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Jelajahi Pesona Nusantara Bersama <span className="text-orange-500">PERGIDIANTAR</span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Fasilitas perjalanan terlengkap dalam satu paket: Armada transportasi HiAce & Bus terbaru, driver berpengalaman, BBM, parkir, akomodasi hotel berbintang pilihan, makan lezat, dan tiket wisata terintegrasi.
              </p>

              {/* Inclusions summary pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
                <span className="px-3 py-1 bg-neutral-800/80 rounded-lg text-xs font-medium text-neutral-300 flex items-center gap-1.5 border border-neutral-700">
                  <Car className="w-3.5 h-3.5 text-orange-400" /> Unit & Driver + BBM
                </span>
                <span className="px-3 py-1 bg-neutral-800/80 rounded-lg text-xs font-medium text-neutral-300 flex items-center gap-1.5 border border-neutral-700">
                  <Hotel className="w-3.5 h-3.5 text-blue-400" /> Hotel Bintang & Makan
                </span>
                <span className="px-3 py-1 bg-neutral-800/80 rounded-lg text-xs font-medium text-neutral-300 flex items-center gap-1.5 border border-neutral-700">
                  <Ticket className="w-3.5 h-3.5 text-emerald-400" /> Tiket Wisata Lengkap
                </span>
              </div>
            </div>

            {/* Quick Action Prompt */}
            <div className="bg-neutral-800/90 border border-neutral-700 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl backdrop-blur-md space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto border border-orange-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Akses Portal Eksklusif</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Seluruh katalog paket wisata, rincian biaya hemat & all-in, serta sistem booking terintegrasi hanya dapat diakses setelah melakukan login.
                </p>
              </div>
              <button
                onClick={scrollToAuthForm}
                className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <span>Masuk / Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Slideshow Interaktif & Info Menarik Wisata (Jogja, Malang & Bali) */}
      <section className="px-4 sm:px-6 lg:px-8">
        <DestinationSlideshow
          onSelectDestination={(_dest: DestinationRegion) => {
            scrollToAuthForm();
          }}
          onExplorePackages={scrollToAuthForm}
        />
      </section>

      {/* Promotional Banner: Seasonal Travel Deals & Flash Sale */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-6">
        <PromotionalBanner
          onClaimPromo={(promo) => {
            setActiveAuthTab('register');
            setSuccessMsg(`Kode voucher ${promo.code} berhasil disalin! Silakan daftar atau masuk untuk klaim potongan harga ini.`);
            scrollToAuthForm();
          }}
        />
      </section>

      {/* 3. Form Login dan Registrasi Utama di Landing Page */}
      <section id="auth-portal-section" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-20">
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
          {/* Top Header of Form */}
          <div className="p-6 sm:p-8 bg-neutral-900 text-white border-b border-neutral-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-neutral-300 shrink-0 shadow-sm">
                  <img 
                    src="/assets/aistudio/1793582722648_90a12056.jpg" 
                    alt="Logo PERGIDIANTAR" 
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Portal Autentikasi Pengguna</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    Masuk ke Sistem PERGIDIANTAR
                  </h2>
                </div>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex items-center bg-neutral-800 p-1 rounded-2xl border border-neutral-700 text-xs font-bold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveAuthTab('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`py-2 px-3.5 rounded-xl transition-all ${
                    activeAuthTab === 'login'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Masuk Pelanggan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveAuthTab('register');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`py-2 px-3.5 rounded-xl transition-all ${
                    activeAuthTab === 'register'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Daftar Akun Baru
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveAuthTab('staff');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`py-2 px-3.5 rounded-xl transition-all ${
                    activeAuthTab === 'staff'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Login Staf & Role
                </button>
              </div>
            </div>
          </div>

          {/* Form Body Container */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Feedback Banners */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}

            {/* TAB 1: CUSTOMER LOGIN */}
            {activeAuthTab === 'login' && (
              <form onSubmit={onCustomerLoginSubmit} className="space-y-4 max-w-lg mx-auto">
                <div className="text-center pb-2">
                  <h3 className="text-base font-bold text-neutral-900">Masuk Akun Calon Pelanggan</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Masukkan email dan kata sandi Anda untuk membuka katalog paket, fasilitas lengkap, dan sistem booking online.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" /> Alamat Email Terdaftar *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Contoh: nama@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full py-2.5 px-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-orange-500" /> Kata Sandi (Password) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                      className="text-[11px] text-neutral-500 hover:text-neutral-800 flex items-center gap-1 transition-colors select-none font-medium"
                      tabIndex={-1}
                    >
                      {showCustomerPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-orange-600" />
                          <span>Sembunyikan</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Lihat Password</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showCustomerPassword ? 'text' : 'password'}
                      required
                      placeholder="Masukkan kata sandi akun Anda"
                      value={customerPassword}
                      onChange={(e) => setCustomerPassword(e.target.value)}
                      className="w-full py-2.5 pl-3.5 pr-10 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none"
                      title={showCustomerPassword ? 'Sembunyikan Kata Sandi' : 'Lihat Kata Sandi'}
                      aria-label={showCustomerPassword ? 'Sembunyikan Kata Sandi' : 'Lihat Kata Sandi'}
                    >
                      {showCustomerPassword ? (
                        <EyeOff className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Masuk ke Portal Wisatawan</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveAuthTab('register')}
                    className="text-xs text-orange-600 hover:underline font-semibold"
                  >
                    Belum punya akun? Daftar akun pelanggan baru di sini
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: CUSTOMER REGISTER */}
            {activeAuthTab === 'register' && (
              <form onSubmit={onCustomerRegisterSubmit} className="space-y-4 max-w-lg mx-auto">
                <div className="text-center pb-2">
                  <h3 className="text-base font-bold text-neutral-900">Pendaftaran Akun Pelanggan Baru</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Daftarkan data diri Anda untuk menikmati kemudahan reservasi paket Single Trip, Family Gathering, hingga Study Tour.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-500" /> Nama Lengkap Anda *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Raden Mas Danu"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full py-2.5 px-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-600" /> Alamat Email Aktif *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full py-2.5 px-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0812-3456-7890"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full py-2.5 px-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-orange-500" /> Buat Kata Sandi Baru *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="text-[11px] text-neutral-500 hover:text-neutral-800 flex items-center gap-1 transition-colors select-none font-medium"
                      tabIndex={-1}
                    >
                      {showRegPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-orange-600" />
                          <span>Sembunyikan</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Lihat Password</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimal 6 karakter"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full py-2.5 pl-3.5 pr-10 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none"
                      title={showRegPassword ? 'Sembunyikan Kata Sandi' : 'Lihat Kata Sandi'}
                      aria-label={showRegPassword ? 'Sembunyikan Kata Sandi' : 'Lihat Kata Sandi'}
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Daftar Akun & Buka Akses Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveAuthTab('login')}
                    className="text-xs text-orange-600 hover:underline font-semibold"
                  >
                    Sudah memiliki akun? Masuk di sini
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: STAFF / SUPER ADMIN LOGIN */}
            {activeAuthTab === 'staff' && (
              <form onSubmit={onStaffLoginSubmit} className="space-y-4 max-w-lg mx-auto" autoComplete="off">
                <div className="text-center pb-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Login Hak Akses Super Admin & Staf</span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">Masuk sebagai Pengguna Manajemen</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Username dan password wajib diisi manual pada setiap sesi login di semua perangkat demi keamanan.
                  </p>
                </div>

                {/* Input 1: Username / Email */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" /> Username atau Email Super Admin / Staf *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="Masukkan username atau email (contoh: pergi.diantar@gmail.com atau benisius)"
                    value={staffUsername}
                    onChange={(e) => setStaffUsername(e.target.value)}
                    className="w-full py-2.5 px-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-neutral-50 text-xs font-medium text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>

                {/* Input 2: Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-600" /> Kata Sandi (Password) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword(!showStaffPassword)}
                      className="text-[11px] text-neutral-500 hover:text-neutral-800 flex items-center gap-1 transition-colors select-none font-medium"
                      tabIndex={-1}
                    >
                      {showStaffPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-blue-600" />
                          <span>Sembunyikan</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Lihat Password</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showStaffPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      placeholder="Masukkan kata sandi akun"
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      className="w-full py-2.5 pl-3.5 pr-10 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-neutral-50 text-xs font-mono text-neutral-900 placeholder:text-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStaffPassword(!showStaffPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none"
                      title={showStaffPassword ? 'Sembunyikan Kata Sandi' : 'Lihat Kata Sandi'}
                      aria-label={showStaffPassword ? 'Sembunyikan Kata Sandi' : 'Lihat Kata Sandi'}
                    >
                      {showStaffPassword ? (
                        <EyeOff className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-neutral-400 hover:text-neutral-600" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Masuk ke Dashboard Super Admin</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-[11px] text-neutral-500 text-center flex items-center justify-center gap-1.5 border-t border-neutral-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Setiap perubahan data langsung terintegrasi secara real-time dengan Cloud Firebase</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
