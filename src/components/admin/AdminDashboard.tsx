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
  CreditCard,
  Eye,
  Activity,
  Globe,
  Smartphone,
  Laptop,
  Lock,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    currentRole, 
    setCurrentRole, 
    openNotifications, 
    unreadNotifCount,
    visitorStats 
  } = useApp();

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

      {/* Real-Time Total Visitor & Cloud Sync Metrics Bar */}
      <div className="mt-6 space-y-3">
        {/* Sync & Security Status Header */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-2xl p-4 shadow-sm border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  Cloud Firebase Multi-Perangkat Aktif
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  Live Real-Time
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Semua data pesanan, user, armada, dan penghitungan paket otomatis tersinkronisasi antar perangkat.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl shrink-0">
            <Lock className="w-3.5 h-3.5 text-orange-400" />
            <span>Sistem Login Aman (SHA-256 & Rate Limiting)</span>
          </div>
        </div>

        {/* 4 Cards: Total Visitor, Hari Ini, Unik, Aktif Sekarang */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Total Visitor All Time */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs hover:border-orange-300 transition-colors">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
              <span>Total Visitor</span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tracking-tight" data-tabular>
                {visitorStats.totalVisitors.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">kunjungan</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 w-fit px-2 py-0.5 rounded-md font-semibold">
              <Activity className="w-3 h-3" />
              <span>Semua Waktu (All-Time)</span>
            </div>
          </div>

          {/* Pengunjung Hari Ini */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
              <span>Pengunjung Hari Ini</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tracking-tight" data-tabular>
                {visitorStats.todayVisitors.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">hari ini</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-blue-700 bg-blue-50 w-fit px-2 py-0.5 rounded-md font-semibold">
              <span>Hari Ini: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>

          {/* Pengunjung Unik */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
              <span>Pengunjung Unik</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tracking-tight" data-tabular>
                {visitorStats.uniqueVisitors.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">perangkat</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-purple-700 bg-purple-50 w-fit px-2 py-0.5 rounded-md font-semibold">
              <span>ID Perangkat Unik</span>
            </div>
          </div>

          {/* Aktif Sekarang (Live) */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-2xs hover:border-emerald-300 transition-colors relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
              <span>Aktif Sekarang</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center relative">
                <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tracking-tight" data-tabular>
                {visitorStats.activeNow}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">tamu online</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 w-fit px-2 py-0.5 rounded-md font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online Real-Time</span>
            </div>
          </div>
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
