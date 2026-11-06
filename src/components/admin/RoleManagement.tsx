import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, UserCog, Check, Lock } from 'lucide-react';

export const RoleManagement: React.FC = () => {
  const { users, openEditProfileModal } = useApp();

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
              Hak Akses & Manajemen Akun Administrator
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Akun resmi eksekutif Super Admin PERGIDIANTAR dengan wewenang penuh atas seluruh operasional travel dan database cloud.
            </p>
          </div>
          <button
            onClick={openEditProfileModal}
            className="py-2 px-3.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs cursor-pointer"
          >
            <UserCog className="w-3.5 h-3.5" />
            <span>Edit Profil Administrator</span>
          </button>
        </div>
      </div>

      {/* Users Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map((usr) => {
          return (
            <div
              key={usr.id}
              className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {usr.roleLabel}
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900 mt-1.5">{usr.name}</h3>
                  <span className="text-xs text-neutral-500">{usr.email}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  Akun Utama Aktif
                </span>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl text-xs text-neutral-600 border border-neutral-100">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Departemen & Wewenang:</span>
                <span className="font-medium text-neutral-800">{usr.department}</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={openEditProfileModal}
                  title="Edit Profil Akun Ini"
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <UserCog className="w-3.5 h-3.5 text-orange-400" />
                  <span>Kelola Profil Akun</span>
                </button>
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
