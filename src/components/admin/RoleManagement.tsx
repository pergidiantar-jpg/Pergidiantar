import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, UserCheck, KeyRound, Check, Lock, RotateCcw, UserCog } from 'lucide-react';

export const RoleManagement: React.FC = () => {
  const { users, currentRole, setCurrentRole, resetToDemoData, openEditProfileModal } = useApp();

  const permissionsMatrix = [
    { module: 'Lihat Katalog & Booking Online', customer: true, cs: true, ops: true, fin: true, super: true },
    { module: 'Lihat Antrean Order Masuk', customer: false, cs: true, ops: true, fin: true, super: true },
    { module: 'Verifikasi Pembayaran & Edit Status Finansial', customer: false, cs: false, ops: false, fin: true, super: true },
    { module: 'Penugasan Armada & Driver (Inventaris)', customer: false, cs: false, ops: true, fin: false, super: true },
    { module: 'Akses Laporan Bulanan & Ekspor PDF / Excel', customer: false, cs: false, ops: false, fin: true, super: true },
    { module: 'Analitik Penjualan & Tren Pendapatan', customer: false, cs: false, ops: true, fin: true, super: true },
    { module: 'Live Chat Dukungan Pelanggan (CS)', customer: false, cs: true, ops: false, fin: false, super: true },
    { module: 'Hapus Data Order & Inventaris Penuh', customer: false, cs: false, ops: false, fin: false, super: true }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Hak Akses Multi-Pengguna (Role-Based Access Control)
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Pemisahan tingkat izin pengguna sesuai jabatan operasional: Super Admin, Operasional, Keuangan, Customer Service & Pelanggan.
            </p>
          </div>
          <button
            onClick={resetToDemoData}
            className="py-2 px-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Demo Sistem</span>
          </button>
        </div>
      </div>

      {/* Users Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map((usr) => {
          const isCurrentActive = usr.role === currentRole;

          return (
            <div
              key={usr.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs space-y-3 transition-all ${
                isCurrentActive ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-neutral-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {usr.roleLabel}
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900 mt-1.5">{usr.name}</h3>
                  <span className="text-xs text-neutral-500">{usr.email}</span>
                </div>
                {isCurrentActive && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Sedang Digunakan
                  </span>
                )}
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl text-xs text-neutral-600 border border-neutral-100">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Departemen:</span>
                <span className="font-medium text-neutral-800">{usr.department}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentRole(usr.role)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                    isCurrentActive
                      ? 'bg-neutral-900 text-white cursor-default'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isCurrentActive ? 'Peran Aktif' : 'Beralih Akun'}
                </button>
                {isCurrentActive && (
                  <button
                    onClick={openEditProfileModal}
                    title="Edit Profil Akun Ini"
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-1 transition-colors"
                  >
                    <UserCog className="w-3.5 h-3.5" />
                    <span>Edit Profil</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-neutral-50 border-b border-neutral-200">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Matriks Hak Akses & Izin Setiap Peran
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/50 border-b border-neutral-200 text-neutral-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-4">Fitur / Modul Aplikasi</th>
                <th className="py-2.5 px-3 text-center">Pelanggan</th>
                <th className="py-2.5 px-3 text-center">Customer Service</th>
                <th className="py-2.5 px-3 text-center">Ops Admin</th>
                <th className="py-2.5 px-3 text-center">Finance</th>
                <th className="py-2.5 px-3 text-center bg-emerald-50/50 text-emerald-800">Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/60">
                  <td className="py-3 px-4 font-medium text-neutral-800">{item.module}</td>
                  <td className="py-3 px-3 text-center">
                    {item.customer ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-neutral-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.cs ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-neutral-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.ops ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-neutral-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.fin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <Lock className="w-3.5 h-3.5 text-neutral-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center bg-emerald-50/30">
                    <Check className="w-4 h-4 text-emerald-700 font-bold mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
