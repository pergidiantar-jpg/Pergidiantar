import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  Save
} from 'lucide-react';

export const EditProfileModal: React.FC = () => {
  const { 
    isEditProfileOpen, 
    closeEditProfileModal, 
    currentRole, 
    currentUser, 
    customerUser, 
    updateUserProfile 
  } = useApp();

  const isCustomer = currentRole === 'customer';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isEditProfileOpen) {
      if (isCustomer && customerUser) {
        setName(customerUser.displayName || '');
        setEmail(customerUser.email || '');
        setPhone(customerUser.phoneNumber || '');
        setDepartment('Pelanggan Terdaftar');
      } else if (currentUser) {
        setName(currentUser.name || '');
        setEmail(currentUser.email || '');
        setPhone(currentUser.phone || '087716443331');
        setDepartment(currentUser.department || '');
      }
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg(null);
      setErrorMsg(null);
    }
  }, [isEditProfileOpen, isCustomer, customerUser, currentUser]);

  if (!isEditProfileOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Nama lengkap tidak boleh kosong.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Masukkan alamat email yang valid.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMsg('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const success = await updateUserProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        department: !isCustomer ? department.trim() : undefined,
        password: newPassword ? newPassword : undefined
      });

      if (success) {
        setSuccessMsg('Profil berhasil diperbarui dan tersimpan di sistem!');
        setTimeout(() => {
          closeEditProfileModal();
        }, 1200);
      } else {
        setErrorMsg('Gagal memperbarui profil. Silakan coba kembali.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat menyimpan data profil.');
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = isCustomer 
    ? 'Pelanggan Terdaftar (Customer)' 
    : currentUser?.roleLabel || 'Manajemen';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
        onClick={closeEditProfileModal}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-7 z-10 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{roleLabel}</span>
              </div>
              <h3 className="text-lg font-black text-neutral-900 leading-tight">
                Pengaturan & Edit Profil
              </h3>
            </div>
          </div>
          <button
            onClick={closeEditProfileModal}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-700 font-bold mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-500" /> Nama Lengkap Pengguna *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full py-2.5 px-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 font-medium text-neutral-900"
              placeholder="Nama lengkap"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-neutral-700 font-bold mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" /> Alamat Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-2.5 px-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 font-medium text-neutral-900"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Nomor WhatsApp *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full py-2.5 px-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 font-medium text-neutral-900"
                placeholder="087716443331"
              />
            </div>
          </div>

          {!isCustomer && (
            <div>
              <label className="block text-neutral-700 font-bold mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-neutral-600" /> Departemen / Jabatan Operasional
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full py-2.5 px-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 font-medium text-neutral-900"
                placeholder="Departemen"
              />
            </div>
          )}

          {/* Change Password Block (Optional) */}
          <div className="pt-2 border-t border-neutral-100 space-y-3">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
              Ganti Kata Sandi (Opsional)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-neutral-700 font-medium mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" /> Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Kosongkan jika tetap"
                  className="w-full py-2.5 px-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" /> Konfirmasi Sandi
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang sandi"
                  className="w-full py-2.5 px-3.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={closeEditProfileModal}
              disabled={loading}
              className="py-2.5 px-4 text-neutral-600 hover:text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
