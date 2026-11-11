import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/travel';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    authModalMode, 
    authModalMessage, 
    closeAuthModal,
    openAuthModal,
    handleCustomerLogin,
    handleCustomerRegister,
    handleStaffLogin,
    users
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'staff'>(
    authModalMode === 'register' ? 'register' : 'login'
  );

  // Sync tab with mode if mode changes
  React.useEffect(() => {
    if (authModalMode === 'register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
    setEmail('');
    setPassword('');
    setFullName('');
    setPhone('');
    setStaffUsername('');
    setStaffPassword('');
    setShowPassword(false);
    setErrorMsg(null);
  }, [authModalMode, authModalOpen]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Staff login state (Strictly empty by default on all devices)
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (activeTab === 'register') {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
          setErrorMsg('Nama lengkap, email, dan kata sandi wajib diisi.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Kata sandi minimal 6 karakter.');
          setLoading(false);
          return;
        }
        const success = await handleCustomerRegister(fullName.trim(), email.trim(), password, phone.trim() || '087716443331');
        if (!success) {
          setErrorMsg('Pendaftaran gagal. Silakan coba kembali.');
        }
      } else if (activeTab === 'login') {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Email dan kata sandi wajib diisi.');
          setLoading(false);
          return;
        }
        const success = await handleCustomerLogin(email.trim(), password);
        if (!success) {
          setErrorMsg('Email atau kata sandi tidak cocok. Silakan coba kembali.');
        }
      } else if (activeTab === 'staff') {
        const cleanUser = staffUsername.trim();
        const cleanPass = staffPassword.trim();
        if (!cleanUser || !cleanPass) {
          setErrorMsg('Username/email dan kata sandi superadmin/staf wajib diisi.');
          setLoading(false);
          return;
        }
        const success = await handleStaffLogin(cleanUser, cleanPass);
        if (!success) {
          setErrorMsg('Autentikasi gagal. Kata sandi tidak valid.');
        } else {
          setStaffUsername('');
          setStaffPassword('');
          closeAuthModal();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
        onClick={closeAuthModal} 
      />

      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 z-10 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-neutral-200 p-0.5 shrink-0 shadow-xs">
              <img 
                src="/assets/aistudio/1793582722648_90a12056.jpg" 
                alt="Logo PERGIDIANTAR" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Autentikasi Akun Resmi</span>
              </div>
              <h3 className="text-base font-black text-neutral-900 mt-0.5">
                {activeTab === 'register' ? 'Pendaftaran Pelanggan' : activeTab === 'staff' ? 'Masuk Staf & Role' : 'Masuk Akun Pelanggan'}
              </h3>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason notice (e.g. Order protection notice) */}
        {authModalMessage && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl text-xs text-orange-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Pemberitahuan:</span>
              <span>{authModalMessage}</span>
            </div>
          </div>
        )}

        {/* Tab switchers: Login vs Register vs Staff */}
        <div className="p-1 bg-neutral-100 rounded-xl flex items-center border border-neutral-200 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-white text-orange-600 shadow-2xs font-extrabold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-white text-orange-600 shadow-2xs font-extrabold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Daftar Baru
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('staff');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
              activeTab === 'staff'
                ? 'bg-white text-blue-600 shadow-2xs font-extrabold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Staf / Admin
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {activeTab === 'register' && (
            <div>
              <label className="block text-neutral-700 font-bold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-500" /> Nama Lengkap Anda *
              </label>
              <input
                type="text"
                placeholder="Contoh: Raden Mas Danu"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
              />
            </div>
          )}

          {activeTab !== 'staff' ? (
            <div>
              <label className="block text-neutral-700 font-bold mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" /> Alamat Email *
              </label>
              <input
                type="email"
                placeholder="Contoh: nama@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
              />
            </div>
          ) : (
            <div>
              <label className="block text-neutral-700 font-bold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" /> Username / Email Super Admin & Staf *
              </label>
              <input
                type="text"
                placeholder="Masukkan username atau email (contoh: pergi.diantar@gmail.com atau benisius)"
                value={staffUsername}
                onChange={(e) => setStaffUsername(e.target.value)}
                required
                autoComplete="off"
                className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-neutral-50 text-xs font-medium text-neutral-900 placeholder:text-neutral-400"
              />
            </div>
          )}

          {activeTab === 'register' && (
            <div>
              <label className="block text-neutral-700 font-bold mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-orange-500" /> Nomor WhatsApp Aktif *
              </label>
              <input
                type="tel"
                placeholder="Contoh: 0812-3456-7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-neutral-700 font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" /> Kata Sandi (Password) *
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-neutral-500 hover:text-neutral-800 flex items-center gap-1 transition-colors select-none font-medium"
                tabIndex={-1}
              >
                {showPassword ? (
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
                type={showPassword ? 'text' : 'password'}
                placeholder={activeTab === 'register' ? 'Minimal 6 karakter' : 'Masukkan kata sandi'}
                value={activeTab === 'staff' ? staffPassword : password}
                onChange={(e) => {
                  if (activeTab === 'staff') {
                    setStaffPassword(e.target.value);
                  } else {
                    setPassword(e.target.value);
                  }
                }}
                required
                autoComplete={activeTab === 'staff' ? 'new-password' : 'current-password'}
                className="w-full py-2 pl-3 pr-10 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 font-mono text-xs text-neutral-900 placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none"
                title={showPassword ? 'Sembunyikan Kata Sandi' : 'Lihat Kata Sandi'}
                aria-label={showPassword ? 'Sembunyikan Kata Sandi' : 'Lihat Kata Sandi'}
              >
                {showPassword ? (
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
            className={`w-full py-2.5 px-4 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 mt-4 ${
              activeTab === 'staff' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {activeTab === 'register' 
                    ? 'Daftar Sekarang & Buka Akses Portal' 
                    : activeTab === 'staff' 
                    ? 'Masuk ke Dashboard Super Admin'
                    : 'Masuk ke Akun Pelanggan'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-[10px] text-neutral-400 text-center flex items-center justify-center gap-1 border-t border-neutral-100">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Sistem Keamanan Akun Terenkripsi PERGIDIANTAR</span>
        </div>
      </div>
    </div>
  );
};
