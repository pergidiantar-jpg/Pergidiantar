import React, { useState, useEffect } from 'react';
import { SchoolDriver, SchoolOrder } from '../../types/school';
import { Bus, ShieldCheck, CheckCircle2, XCircle, AlertCircle, DollarSign, Users, Lock, Unlock, Phone } from 'lucide-react';

const ADMIN_DANA = '087716443331';

export const SchoolAdminManagement: React.FC = () => {
  const [drivers, setDrivers] = useState<SchoolDriver[]>(() => {
    const saved = localStorage.getItem('pergidiantar_school_drivers_db');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<SchoolOrder[]>(() => {
    const saved = localStorage.getItem('pergidiantar_school_orders_db');
    return saved ? JSON.parse(saved) : [];
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('pergidiantar_school_drivers_db', JSON.stringify(drivers));
  }, [drivers]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleApproveDriver = (drvId: string, status: 'approved' | 'rejected' | 'blocked') => {
    setDrivers(prev => prev.map(d => d.id === drvId ? { ...d, status } : d));
    showToast(`Status pengemudi berhasil diubah menjadi: ${status.toUpperCase()}`);
  };

  const handleVerifyFeePayment = (drvId: string) => {
    setDrivers(prev => prev.map(d => d.id === drvId ? { ...d, feeStatus: 'paid', feeOwedToAdmin: 0 } : d));
    showToast('Setoran jasa aplikasi 8% diverifikasi lunas!');
  };

  return (
    <div className="space-y-6 text-xs">
      {toastMsg && (
        <div className="bg-neutral-900 text-white p-3 rounded-xl shadow-xl flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-orange-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Summary */}
      <div className="bg-gradient-to-r from-blue-900 to-neutral-900 text-white p-6 rounded-3xl shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-orange-400 font-bold uppercase tracking-wider">Superadmin Control Center</span>
          <h2 className="text-xl font-black">Manajemen & Verifikasi Jemput Sekolah</h2>
          <p className="text-neutral-300 text-xs">Kelola pendaftaran driver (KTP & Selfie), pantau order, dan setoran omzet 8% ke DANA Admin ({ADMIN_DANA}).</p>
        </div>
        <div className="bg-white/10 p-3 rounded-2xl border border-white/20 text-right">
          <span className="text-[11px] text-neutral-300 block">Total Driver Terdaftar</span>
          <span className="text-xl font-black text-orange-400">{drivers.length} Driver</span>
        </div>
      </div>

      {/* Driver Verification List */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span>Verifikasi Pengemudi & KTP / Selfie</span>
        </h3>

        <div className="space-y-3">
          {drivers.map(drv => (
            <div key={drv.id} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <img src={drv.selfieImage} alt={drv.name} className="w-12 h-12 rounded-full object-cover border shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-neutral-900">{drv.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${drv.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : drv.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                      {drv.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-neutral-600">Kendaraan: <strong>{drv.vehicleModel}</strong> ({drv.plateNumber})</p>
                  <p className="text-neutral-500">KTP: {drv.ktpNumber} · Telp: {drv.phone}</p>
                  <p className="text-neutral-500 font-mono text-[10px]">Fee 8% Owed: Rp {drv.feeOwedToAdmin.toLocaleString('id-ID')} ({drv.feeStatus.toUpperCase()})</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {drv.status !== 'approved' && (
                  <button
                    onClick={() => handleApproveDriver(drv.id, 'approved')}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Setujui Driver</span>
                  </button>
                )}
                {drv.feeStatus !== 'paid' && drv.feeOwedToAdmin > 0 && (
                  <button
                    onClick={() => handleVerifyFeePayment(drv.id)}
                    className="py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Verifikasi Setoran 8%</span>
                  </button>
                )}
                <button
                  onClick={() => handleApproveDriver(drv.id, drv.status === 'blocked' ? 'approved' : 'blocked')}
                  className={`py-2 px-3 font-bold rounded-xl transition-colors flex items-center gap-1 ${drv.status === 'blocked' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
                >
                  {drv.status === 'blocked' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{drv.status === 'blocked' ? 'Buka Blokir' : 'Blokir Akun'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
