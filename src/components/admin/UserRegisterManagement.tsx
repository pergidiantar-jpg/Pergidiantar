import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/travel';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Mail, 
  Phone, 
  KeyRound, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  X,
  Save,
  Lock,
  UserCheck,
  Building
} from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const UserRegisterManagement: React.FC = () => {
  const { 
    users, 
    registeredCustomers, 
    adminAddUser, 
    adminUpdateUser, 
    adminDeleteUser, 
    adminToggleUserStatus,
    currentRole,
    staffUser
  } = useApp();

  const isSuperAdmin = currentRole === 'super_admin';

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Form state for creating new user
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('password123');
  const [newUserRole, setNewUserRole] = useState<UserRole>('customer');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Edit User State
  const [editingUser, setEditingUser] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: 'active' | 'inactive';
    password?: string;
    isCustomer: boolean;
  } | null>(null);

  // Delete User State
  const [deletingUser, setDeletingUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null>(null);

  // Unified list of all registered users (Customers + Internal Staff)
  const unifiedUsers = [
    // Registered customers
    ...registeredCustomers.map(c => ({
      id: c.uid,
      name: c.displayName,
      email: c.email,
      phone: c.phoneNumber || '087716443331',
      role: 'customer' as UserRole,
      roleLabel: 'Pelanggan Terdaftar',
      department: 'Portal Pelanggan',
      createdAt: c.createdAt || '2026-10-15',
      status: c.status || 'active',
      password: c.password || 'password123',
      isCustomer: true
    })),
    // Internal Staff users
    ...users.filter(u => u.role !== 'customer').map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || '087716443331',
      role: u.role,
      roleLabel: u.roleLabel,
      department: u.department,
      createdAt: u.createdAt || '2026-10-01',
      status: u.status || 'active',
      password: u.password || 'admin',
      isCustomer: false
    }))
  ];

  // Filtering
  const filteredUsers = unifiedUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q);

    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Metrics
  const totalUsers = unifiedUsers.length;
  const totalCustomers = unifiedUsers.filter(u => u.role === 'customer').length;
  const totalStaff = unifiedUsers.filter(u => u.role !== 'customer').length;
  const totalActive = unifiedUsers.filter(u => u.status === 'active').length;

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      setFormError('Nama lengkap, email, dan kata sandi wajib diisi.');
      return;
    }

    try {
      await adminAddUser({
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        phone: newUserPhone.trim() || '087716443331',
        password: newUserPassword,
        role: newUserRole
      });

      setFormSuccess(`User baru ${newUserName} (${newUserEmail}) berhasil didaftarkan dan langsung dapat login.`);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserPassword('password123');
      setNewUserRole('customer');
      setTimeout(() => {
        setIsAddUserModalOpen(false);
        setFormSuccess(null);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Gagal mendaftarkan user baru.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await adminUpdateUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        status: editingUser.status,
        password: editingUser.password
      });
      setEditingUser(null);
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui data user.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      await adminDeleteUser(deletingUser.id);
      setDeletingUser(null);
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus user.');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">Super Admin</span>;
      case 'ops_admin':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">Operasional</span>;
      case 'finance':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">Finance & Kas</span>;
      case 'customer_service':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">Customer Service</span>;
      case 'customer':
      default:
        return <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200">Pelanggan</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                Pusat Data User & Registrasi
              </span>
              <span className="text-xs text-neutral-400 font-medium">· Super Admin Access</span>
            </div>
            <h2 className="text-lg font-black text-neutral-900 mt-1">
              Data User Terdaftar & Pendaftaran Pengguna
            </h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              Kelola database akun pengguna resmi. Hanya pengguna yang terdaftar di database ini yang memiliki hak login ke portal.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setFormError(null);
                setFormSuccess(null);
                setIsAddUserModalOpen(true);
              }}
              className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftarkan User Baru</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-100">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
            <span className="text-neutral-500 block text-[10px] font-semibold">Total User Terdaftar</span>
            <span className="text-lg font-black text-neutral-900 font-mono">{totalUsers} Akun</span>
          </div>
          <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-200 text-xs">
            <span className="text-orange-700 block text-[10px] font-semibold">Pelanggan Terdaftar</span>
            <span className="text-lg font-black text-orange-600 font-mono">{totalCustomers} Wisatawan</span>
          </div>
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs">
            <span className="text-blue-700 block text-[10px] font-semibold">Staf & Manajemen</span>
            <span className="text-lg font-black text-blue-700 font-mono">{totalStaff} Staf</span>
          </div>
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs">
            <span className="text-emerald-700 block text-[10px] font-semibold">Akun Aktif</span>
            <span className="text-lg font-black text-emerald-700 font-mono">{totalActive} Aktif</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari user berdasarkan nama, email, atau no WhatsApp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs py-2 pl-9 pr-3 border border-neutral-300 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-neutral-500 shrink-0">Filter Role:</span>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="w-full sm:w-auto text-xs font-semibold py-2 px-3 border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Semua Role Pengguna</option>
              <option value="customer">Pelanggan (Customer)</option>
              <option value="super_admin">Super Admin</option>
              <option value="ops_admin">Admin Operasional</option>
              <option value="finance">Finance & Keuangan</option>
              <option value="customer_service">Customer Service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900 text-white text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Nama Pengguna</th>
                <th className="py-3 px-4">Email & No. WhatsApp</th>
                <th className="py-3 px-4">Role / Akses</th>
                <th className="py-3 px-4">Tgl Terdaftar</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Kata Sandi</th>
                <th className="py-3 px-4 text-right">Aksi Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs">Tidak ada data pengguna yang cocok dengan kriteria pencarian.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentSuperAdmin = u.email.toLowerCase() === 'pergi.diantar@gmail.com';

                  return (
                    <tr key={u.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                            u.isCustomer ? 'bg-orange-500' : 'bg-blue-600'
                          }`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900 block">{u.name}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">ID: {u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="text-neutral-800 font-medium block flex items-center gap-1">
                            <Mail className="w-3 h-3 text-neutral-400" /> {u.email}
                          </span>
                          <span className="text-neutral-500 text-[11px] block flex items-center gap-1">
                            <Phone className="w-3 h-3 text-neutral-400" /> {u.phone}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {getRoleBadge(u.role)}
                          <span className="text-[10px] text-neutral-500 block">{u.department}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">
                        {u.createdAt}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => !isCurrentSuperAdmin && adminToggleUserStatus(u.id)}
                          disabled={isCurrentSuperAdmin}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          } ${isCurrentSuperAdmin ? 'cursor-default opacity-90' : 'cursor-pointer'}`}
                          title={isCurrentSuperAdmin ? 'Akun Super Admin Utama selalu aktif' : 'Klik untuk mengubah status aktif/non-aktif'}
                        >
                          {u.status === 'active' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Aktif</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Non-aktif</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono text-[11px] bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 text-neutral-700">
                          {u.password || '******'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingUser({
                              id: u.id,
                              name: u.name,
                              email: u.email,
                              phone: u.phone,
                              role: u.role,
                              status: u.status as 'active' | 'inactive',
                              password: u.password,
                              isCustomer: u.isCustomer
                            })}
                            className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Data User"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          {!isCurrentSuperAdmin ? (
                            <button
                              type="button"
                              onClick={() => setDeletingUser({
                                id: u.id,
                                name: u.name,
                                email: u.email,
                                role: u.role
                              })}
                              className="p-1.5 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus User Secara Permanen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="p-1.5 text-neutral-300" title="Super Admin utama tidak dapat dihapus">
                              <ShieldCheck className="w-4 h-4 text-amber-500" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Daftarkan User Baru Langsung */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsAddUserModalOpen(false)} 
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 z-10 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-900">
                    Daftarkan User Baru ke Sistem
                  </h3>
                  <span className="text-xs text-neutral-500">
                    Akun yang didaftarkan langsung tersimpan di database dan dapat segera login.
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Nama Lengkap User *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Raden Mas Danu"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Alamat Email * (Digunakan untuk Login)
                </label>
                <input
                  type="email"
                  placeholder="Contoh: user.baru@gmail.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 0812-3456-7890"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    required
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Kata Sandi (Password) *
                  </label>
                  <input
                    type="text"
                    placeholder="Minimal 6 karakter"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    required
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Pilih Tingkat Akses / Role *
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white font-bold"
                >
                  <option value="customer">Pelanggan (Customer Wisata)</option>
                  <option value="super_admin">Super Admin (Hak Akses Penuh)</option>
                  <option value="ops_admin">Admin Operasional (Armada & Driver)</option>
                  <option value="finance">Finance (Keuangan & Invoice)</option>
                  <option value="customer_service">Customer Service (Chat & Tamu)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="py-2.5 px-4 text-neutral-600 hover:bg-neutral-100 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Daftarkan ke Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Data User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setEditingUser(null)} 
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 z-10 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-black text-neutral-900">
                Edit Data Pengguna: {editingUser.name}
              </h3>
              <button 
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    required
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Password Baru</label>
                  <input
                    type="text"
                    value={editingUser.password || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder="Kosongkan bila tidak diganti"
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Role Akun</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white font-bold"
                  >
                    <option value="customer">Pelanggan</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="ops_admin">Admin Operasional</option>
                    <option value="finance">Finance</option>
                    <option value="customer_service">Customer Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Status Akun</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white font-bold"
                  >
                    <option value="active">Aktif (Dapat Login)</option>
                    <option value="inactive">Non-aktif (Diblokir)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="py-2.5 px-4 text-neutral-600 hover:bg-neutral-100 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <DeleteConfirmModal
          isOpen={true}
          title="Hapus Akun Pengguna Secara Permanen"
          confirmItemName={`User: ${deletingUser.name} (${deletingUser.email}) - Role: ${deletingUser.role}`}
          message="Akun pengguna ini akan dihapus permanen dari sistem dan database PERGIDIANTAR. Pengguna tidak akan dapat melakukan login lagi ke portal."
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
};
