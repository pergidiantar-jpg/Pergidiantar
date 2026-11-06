import React from 'react';
import { useApp } from '../../context/AppContext';
import { OrderManagement } from './OrderManagement';
import { InventoryManagement } from './InventoryManagement';
import { MonthlyReport } from './MonthlyReport';
import { SalesAnalytics } from './SalesAnalytics';
import { CustomerSupportChat } from './CustomerSupportChat';
import { RoleManagement } from './RoleManagement';
import { EmailOutboxView } from './EmailOutboxView';
import { PackageManagement } from './PackageManagement';
import { UserRegisterManagement } from './UserRegisterManagement';
import { AdminPurgeCenter } from './AdminPurgeCenter';
import { VendorPaymentManagement } from './VendorPaymentManagement';
import { 
  ShoppingBag, 
  Car, 
  FileSpreadsheet, 
  TrendingUp, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  ExternalLink, 
  Mail, 
  Compass, 
  Bell, 
  Users, 
  Trash2,
  CreditCard
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, currentRole, setCurrentRole, openNotifications, unreadNotifCount } = useApp();

  const navigationItems = [
    { id: 'admin-orders', label: 'Order Masuk & Status', icon: ShoppingBag, desc: 'Kelola data pemesan & pembayaran' },
    { id: 'admin-users-registry', label: 'Data User & Register', icon: Users, desc: 'Database user & pendaftaran (Super Admin)' },
    { id: 'admin-packages', label: 'Kelola Paket & Harga', icon: Compass, desc: 'Edit harga & tujuan (Super Admin)' },
    { id: 'admin-inventory', label: 'Manajemen Inventaris', icon: Car, desc: 'Sinkronisasi armada & driver' },
    { id: 'admin-vendor-payments', label: 'Pembayaran Vendor & Mitra', icon: CreditCard, desc: 'Driver, hotel, armada & tiket wisata' },
    { id: 'admin-reports', label: 'Laporan Bulanan Transaksi', icon: FileSpreadsheet, desc: 'Rekap omzet, ekspor PDF & CSV' },
    { id: 'admin-analytics', label: 'Analitik Penjualan Visual', icon: TrendingUp, desc: 'Tren pendapatan & performa' },
    { id: 'admin-chat', label: 'Chat Dukungan Tamu', icon: MessageSquare, desc: 'Live CS & template balasan' },
    { id: 'admin-emails', label: 'Email Outbox (pergi.diantar)', icon: Mail, desc: 'Log integrasi email admin' },
    { id: 'admin-users', label: 'Hak Akses Administrator', icon: ShieldCheck, desc: 'Profil akun & wewenang Super Admin' },
    { id: 'admin-purge-center', label: 'Pusat Hapus Data (Purge)', icon: Trash2, desc: 'Hapus data & reset portal permanen' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & User Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-neutral-200 p-0.5 shrink-0 shadow-xs">
            <img 
              src="/assets/aistudio/1793582722648_90a12056.jpg" 
              alt="Logo PERGIDIANTAR" 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium mb-0.5">
              <span>PERGIDIANTAR Console</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-orange-600 font-semibold">{currentUser.roleLabel}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Dashboard Pengelolaan Wisata
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentRole === 'super_admin' && (
            <button
              onClick={openNotifications}
              className="py-2 px-3.5 bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors border border-orange-200 shadow-2xs relative"
              title="Buka panel notifikasi real-time khusus Super Admin"
            >
              <div className="relative">
                <Bell className="w-4 h-4 text-orange-600" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </span>
                )}
              </div>
              <span>Notifikasi Real-Time {unreadNotifCount > 0 && `(${unreadNotifCount} Baru)`}</span>
            </button>
          )}

          <button
            onClick={() => setCurrentRole('customer')}
            className="py-2 px-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-neutral-300"
          >
            <span>Buka Tampilan Pelanggan</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </button>
        </div>
      </div>

      {/* Main Admin Body */}
      <div className="mt-6 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 mb-2">
            Menu Operasional
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isActive ? 'bg-white/10 text-orange-400' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold block truncate">{item.label}</span>
                  <span
                    className={`text-[10px] block truncate ${
                      isActive ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                  >
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Logged User Info Box */}
          <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-neutral-700">
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wide block">
              Sesi Login Terverifikasi
            </span>
            <span className="font-bold text-neutral-900 block mt-1">{currentUser.name}</span>
            <span className="text-[11px] text-neutral-500">{currentUser.email}</span>
            <div className="mt-2 pt-2 border-t border-emerald-200 text-[11px] text-emerald-900 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{currentUser.roleLabel}</span>
            </div>
          </div>
        </div>

        {/* Tab Viewport */}
        <div className="flex-1 min-w-0">
          {activeTab === 'admin-orders' && <OrderManagement />}
          {activeTab === 'admin-users-registry' && <UserRegisterManagement />}
          {activeTab === 'admin-packages' && <PackageManagement />}
          {activeTab === 'admin-inventory' && <InventoryManagement />}
          {activeTab === 'admin-vendor-payments' && <VendorPaymentManagement />}
          {activeTab === 'admin-reports' && <MonthlyReport />}
          {activeTab === 'admin-analytics' && <SalesAnalytics />}
          {activeTab === 'admin-chat' && <CustomerSupportChat />}
          {activeTab === 'admin-emails' && <EmailOutboxView />}
          {activeTab === 'admin-users' && <RoleManagement />}
          {activeTab === 'admin-purge-center' && <AdminPurgeCenter />}
        </div>
      </div>
    </div>
  );
};
