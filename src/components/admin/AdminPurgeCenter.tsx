import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  ShoppingBag, 
  Car, 
  Users, 
  MessageSquare, 
  Bell, 
  Compass, 
  RefreshCcw, 
  CheckCircle2, 
  Lock,
  X,
  FileSpreadsheet,
  Hotel
} from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const AdminPurgeCenter: React.FC = () => {
  const { 
    orders, 
    fleet, 
    drivers, 
    hotels,
    chats, 
    notifications, 
    packages, 
    registeredCustomers,
    currentRole,
    purgeOrders,
    purgeFleet,
    purgeDrivers,
    purgeHotels,
    purgeChats,
    purgeNotifications,
    purgePackages,
    purgeCustomers,
    purgeAllDataFactoryReset
  } = useApp();

  const isSuperAdmin = currentRole === 'super_admin';

  // Confirmation state
  const [activePurgeAction, setActivePurgeAction] = useState<{
    key: string;
    title: string;
    itemName: string;
    message: string;
    onExecute: () => void;
  } | null>(null);

  // Master Factory Reset Modal State
  const [isFactoryResetModalOpen, setIsFactoryResetModalOpen] = useState(false);
  const [factoryConfirmText, setFactoryConfirmText] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const dummyOrdersCount = orders.filter(o => 
    o.id.startsWith('ord-0') || o.orderNumber.includes('0089') || o.orderNumber.includes('0090') || o.orderNumber.includes('0091') || o.orderNumber.includes('0092')
  ).length;

  if (!isSuperAdmin) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center text-rose-800">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold">Akses Dibatasi</h3>
        <p className="text-xs text-neutral-600 mt-1">
          Hanya Super Admin utama (Benisius Rahmat Basuki) yang memiliki izin mengakses Pusat Penghapusan & Pengelolaan Data (Admin Purge Center).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {successToast && (
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top duration-200 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-neutral-900 rounded-3xl p-6 text-white shadow-xl border border-neutral-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-full text-[10px] font-black uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Pusat Penghapusan & Pembersihan Data (Purge Center)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Penghapusan Data Permanen & Reset Portal
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Super Admin dapat menghapus data portal secara selektif berdasarkan jenisnya atau melakukan reset total. 
              <strong> Data yang sudah dihapus akan hilang secara permanen dan tidak akan muncul lagi</strong> (termasuk data dummy bawaan).
            </p>
          </div>

          <div className="shrink-0 flex items-center">
            <button
              onClick={() => {
                setFactoryConfirmText('');
                setIsFactoryResetModalOpen(true);
              }}
              className="py-3 px-5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-2xl flex items-center gap-2 shadow-lg transition-all border border-rose-500/50 hover:scale-102"
            >
              <Trash2 className="w-4 h-4" />
              <span>RESET PABRIK TOTAL (HAPUS SEMUA)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Category 1: Orders */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md">
                {orders.length} Pesanan
              </span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Data Pesanan Masuk (Orders)</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Mencakup seluruh transaksi reservasi tour, status pembayaran, dan data pemesan. 
              {dummyOrdersCount > 0 && ` Terdapat ${dummyOrdersCount} pesanan dummy.`}
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-neutral-100">
            <button
              onClick={() => setActivePurgeAction({
                key: 'orders-all',
                title: 'Hapus Seluruh Data Pesanan',
                itemName: `${orders.length} Pesanan Masuk & Reservasi`,
                message: 'Semua pesanan akan dihapus permanen. Data pemesan, histori transaksi, dan laporan omzet akan dikosongkan secara permanen.',
                onExecute: () => {
                  purgeOrders(false);
                  showSuccess('Seluruh data pesanan berhasil dihapus dan tidak akan muncul lagi.');
                }
              })}
              disabled={orders.length === 0}
              className="w-full py-2 px-3 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Pesanan ({orders.length})</span>
            </button>

            {dummyOrdersCount > 0 && (
              <button
                onClick={() => setActivePurgeAction({
                  key: 'orders-dummy',
                  title: 'Hapus Hanya Pesanan Dummy',
                  itemName: `${dummyOrdersCount} Pesanan Dummy Uji Coba`,
                  message: 'Hanya pesanan contoh/dummy bawaan yang akan dihapus. Pesanan asli dari pelanggan yang mendaftar akan tetap aman.',
                  onExecute: () => {
                    purgeOrders(true);
                    showSuccess(`${dummyOrdersCount} data pesanan dummy berhasil dibersihkan permanen.`);
                  }
                })}
                className="w-full py-2 px-3 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Hapus Khusus Data Dummy Saja ({dummyOrdersCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Category 2: Fleet */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md">
                {fleet.length} Unit
              </span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Data Armada Kendaraan</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Seluruh unit kendaraan operasional wisata (Avanza, Innova, HiAce, Bus, dsb).
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <button
              onClick={() => setActivePurgeAction({
                key: 'fleet-all',
                title: 'Hapus Seluruh Armada Kendaraan',
                itemName: `${fleet.length} Unit Armada Kendaraan`,
                message: 'Semua armada kendaraan akan dihapus permanen dari sistem inventaris.',
                onExecute: () => {
                  purgeFleet();
                  showSuccess('Seluruh data armada kendaraan berhasil dihapus permanen.');
                }
              })}
              disabled={fleet.length === 0}
              className="w-full py-2 px-3 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Armada ({fleet.length})</span>
            </button>
          </div>
        </div>

        {/* Category 3: Drivers */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md">
                {drivers.length} Driver
              </span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Data Pengemudi & Kru</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Daftar seluruh supir dan kru berlisensi mitra operasional PERGIDIANTAR.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <button
              onClick={() => setActivePurgeAction({
                key: 'drivers-all',
                title: 'Hapus Seluruh Data Supir / Driver',
                itemName: `${drivers.length} Supir / Kru`,
                message: 'Semua data pengemudi dan kontak kru akan dihapus permanen dari sistem.',
                onExecute: () => {
                  purgeDrivers();
                  showSuccess('Seluruh data driver berhasil dihapus permanen.');
                }
              })}
              disabled={drivers.length === 0}
              className="w-full py-2 px-3 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Driver ({drivers.length})</span>
            </button>
          </div>
        </div>

        {/* Category 4: Tour Packages */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md">
                {packages.length} Paket
              </span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Data Paket Wisata & Harga</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Katalog paket tour Jogja, Malang, dan Bali beserta jadwal itinerary dan tarif.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <button
              onClick={() => setActivePurgeAction({
                key: 'packages-all',
                title: 'Hapus Seluruh Paket Wisata',
                itemName: `${packages.length} Paket Tour Katalog`,
                message: 'Semua paket wisata akan dihapus dari katalog publik dan tidak akan muncul bagi pelanggan.',
                onExecute: () => {
                  purgePackages();
                  showSuccess('Seluruh data paket wisata berhasil dihapus permanen.');
                }
              })}
              disabled={packages.length === 0}
              className="w-full py-2 px-3 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Paket ({packages.length})</span>
            </button>
          </div>
        </div>

        {/* Category 5: Hotel Partners & Room Quotas */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                <Hotel className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md">
                {hotels.length} Hotel
              </span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Hotel Mitra & Kuota Kamar</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Seluruh data hotel mitra (Jogja, Malang, Bali), kuota kamar, dan harga kontrak.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <button
              onClick={() => setActivePurgeAction({
                key: 'hotels-all',
                title: 'Hapus Seluruh Hotel Mitra & Kuota Kamar',
                itemName: `${hotels.length} Hotel Mitra`,
                message: 'Semua data hotel mitra dan kuota kamar akan dihapus permanen dari sistem.',
                onExecute: () => {
                  purgeHotels();
                  showSuccess('Seluruh data hotel mitra dan kuota kamar berhasil dihapus permanen.');
                }
              })}
              disabled={hotels.length === 0}
              className="w-full py-2 px-3 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Hotel ({hotels.length})</span>
            </button>
          </div>
        </div>

        {/* Category 6: Live Chat History */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md">
                {chats.length} Pesan
              </span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Riwayat Chat Tamu</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Seluruh histori percakapan konsultasi antara calon tamu dan customer service.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <button
              onClick={() => setActivePurgeAction({
                key: 'chats-all',
                title: 'Hapus Seluruh Riwayat Chat',
                itemName: `${chats.length} Pesan Chat Masuk`,
                message: 'Seluruh riwayat chat tamu akan dibersihkan permanen.',
                onExecute: () => {
                  purgeChats();
                  showSuccess('Riwayat chat berhasil dibersihkan permanen.');
                }
              })}
              disabled={chats.length === 0}
              className="w-full py-2 px-3 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Chat ({chats.length})</span>
            </button>
          </div>
        </div>

        {/* Category 6: Notifications Log */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md">
                {notifications.length} Notifikasi
              </span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Log Notifikasi Real-time</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Riwayat notifikasi order masuk, konfirmasi pembayaran, dan penugasan armada.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <button
              onClick={() => setActivePurgeAction({
                key: 'notifs-all',
                title: 'Hapus Seluruh Riwayat Notifikasi',
                itemName: `${notifications.length} Notifikasi Sistem`,
                message: 'Seluruh log notifikasi akan dihapus permanen dari pusat notifikasi.',
                onExecute: () => {
                  purgeNotifications();
                  showSuccess('Log notifikasi berhasil dibersihkan permanen.');
                }
              })}
              disabled={notifications.length === 0}
              className="w-full py-2 px-3 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Notifikasi ({notifications.length})</span>
            </button>
          </div>
        </div>

        {/* Category 7: Registered Customers */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md">
                {registeredCustomers.length} Akun
              </span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Data Pelanggan Terdaftar</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Database akun pelanggan yang teregistrasi. Menghapus data ini akan menghapus akun pelanggan (Super Admin tetap aman).
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <button
              onClick={() => setActivePurgeAction({
                key: 'customers-all',
                title: 'Hapus Seluruh Data Pelanggan Terdaftar',
                itemName: `${registeredCustomers.length} Akun Pelanggan Terdaftar`,
                message: 'Seluruh akun pelanggan akan dihapus permanen dari database. Pelanggan harus mendaftar ulang untuk dapat login.',
                onExecute: () => {
                  purgeCustomers();
                  showSuccess('Seluruh akun pelanggan terdaftar berhasil dihapus permanen.');
                }
              })}
              disabled={registeredCustomers.length === 0}
              className="w-full py-2 px-3 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua Pelanggan ({registeredCustomers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for single purge action */}
      {activePurgeAction && (
        <DeleteConfirmModal
          isOpen={true}
          title={activePurgeAction.title}
          confirmItemName={activePurgeAction.itemName}
          message={activePurgeAction.message}
          onConfirm={() => {
            activePurgeAction.onExecute();
            setActivePurgeAction(null);
          }}
          onClose={() => setActivePurgeAction(null)}
        />
      )}

      {/* Master Factory Reset Modal */}
      {isFactoryResetModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsFactoryResetModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 z-10 border-2 border-rose-500 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Tindakan Tingkat Kritis
                </span>
                <h3 className="text-base font-black text-neutral-900 mt-1">
                  RESET PABRIK TOTAL (HAPUS SEMUA DATA PORTAL)
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  Tindakan ini akan <strong>menghapus seluruh data di portal secara permanen</strong>:
                </p>
                <ul className="text-xs text-neutral-700 list-disc list-inside mt-2 space-y-1 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <li>Seluruh pesanan masuk & histori pembayaran ({orders.length})</li>
                  <li>Seluruh unit armada kendaraan ({fleet.length})</li>
                  <li>Seluruh data driver / pengemudi ({drivers.length})</li>
                  <li>Seluruh riwayat chat tamu ({chats.length})</li>
                  <li>Seluruh log notifikasi ({notifications.length})</li>
                  <li>Seluruh paket tour custom ({packages.length})</li>
                  <li>Seluruh pelanggan terdaftar ({registeredCustomers.length})</li>
                </ul>
                <p className="text-xs text-rose-700 font-bold mt-2">
                  Data dummy maupun data asli tidak akan muncul lagi setelah reset ini dilakukan.
                </p>
              </div>
              <button
                onClick={() => setIsFactoryResetModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-xs">
              <label className="block text-neutral-800 font-bold">
                Ketik konfirmasi teks berikut: <span className="font-mono text-rose-600 select-all">HAPUS SEMUA DATA</span>
              </label>
              <input
                type="text"
                placeholder="Ketik persis: HAPUS SEMUA DATA"
                value={factoryConfirmText}
                onChange={(e) => setFactoryConfirmText(e.target.value)}
                className="w-full py-2 px-3 border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white font-mono text-center font-bold"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsFactoryResetModalOpen(false)}
                className="py-2.5 px-4 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={factoryConfirmText !== 'HAPUS SEMUA DATA'}
                onClick={() => {
                  purgeAllDataFactoryReset();
                  setIsFactoryResetModalOpen(false);
                  showSuccess('RESET PABRIK TOTAL BERHASIL! Seluruh data portal telah dikosongkan secara permanen.');
                }}
                className="py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>HAPUS SEMUA DATA SEKARANG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
