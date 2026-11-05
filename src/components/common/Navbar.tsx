import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/travel';
import { 
  Bell, 
  ShieldCheck, 
  User, 
  Menu, 
  X,
  ChevronDown,
  LogOut,
  UserCog,
  MapPin,
  Compass
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const { 
    currentRole, 
    setCurrentRole, 
    activeTab, 
    setActiveTab, 
    unreadNotifCount, 
    currentUser,
    customerUser,
    staffUser,
    isLoggedIn,
    isStaffLoggedIn,
    isCustomerLoggedIn,
    openAuthModal,
    handleCustomerLogout,
    handleStaffLogout,
    openEditProfileModal,
    users
  } = useApp();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCustomer = currentRole === 'customer';

  const staffRoles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'super_admin', label: 'Super Admin', desc: 'Akses penuh seluruh modul sistem' },
    { role: 'ops_admin', label: 'Admin Operasional', desc: 'Penugasan armada & driver' },
    { role: 'finance', label: 'Finance & Keuangan', desc: 'Verifikasi bayar & laporan bulanan' },
    { role: 'customer_service', label: 'Customer Service (CS)', desc: 'Live chat & konsultasi pelanggan' }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setIsUserMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    if (isStaffLoggedIn) {
      await handleStaffLogout();
    } else {
      await handleCustomerLogout();
    }
  };

  // Determine display name
  const displayName = isCustomerLoggedIn && customerUser
    ? customerUser.displayName
    : isStaffLoggedIn && staffUser
    ? staffUser.name
    : '';

  const displayRoleLabel = isCustomerLoggedIn
    ? 'Pelanggan Terdaftar'
    : isStaffLoggedIn && staffUser
    ? staffUser.roleLabel
    : '';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Official Logo and Wordmark */}
          <button 
            onClick={() => {
              if (isCustomer) {
                setActiveTab('catalog');
              } else {
                setActiveTab('admin-orders');
              }
            }}
            className="flex items-center gap-2.5 text-left group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-2xs border border-neutral-200 bg-white p-0.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <img 
                src="/assets/aistudio/1793582722648_90a12056.jpg" 
                alt="Logo PERGIDIANTAR" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-neutral-900 block leading-none">
                PERGI<span className="text-orange-500">DIANTAR</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-semibold tracking-wide uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Tour & Travel Nusantara
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Only shown when logged in or clean overview for guests) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-600">
            {!isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>Destinasi: Yogyakarta · Malang · Bali</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>Jambon - Kota Jogjakarta · WA: 087716443331</span>
                </div>
              </>
            ) : isCustomer ? (
              <>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                    activeTab === 'catalog' ? 'text-orange-600 font-semibold border-b-2 border-orange-500' : ''
                  }`}
                >
                  Pilihan Paket Tour
                </button>
                <button
                  onClick={() => setActiveTab('my-orders')}
                  className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                    activeTab === 'my-orders' ? 'text-orange-600 font-semibold border-b-2 border-orange-500' : ''
                  }`}
                >
                  Lacak Pesanan Saya
                </button>
                <button
                  onClick={() => setActiveTab('customer-invoices')}
                  className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                    activeTab === 'customer-invoices' ? 'text-orange-600 font-semibold border-b-2 border-orange-500' : ''
                  }`}
                >
                  Invoice & Tagihan
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('inclusions-info');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
                >
                  Fasilitas & Armada
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('faq-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
                >
                  FAQ Wisata
                </button>
              </>
            ) : (
              /* Staff Role Navigation */
              <>
                <button
                  onClick={() => setActiveTab('admin-orders')}
                  className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                    activeTab === 'admin-orders' ? 'text-orange-600 font-semibold border-b-2 border-orange-500' : ''
                  }`}
                >
                  Order Masuk
                </button>
                <button
                  onClick={() => setActiveTab('admin-inventory')}
                  className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                    activeTab === 'admin-inventory' ? 'text-orange-600 font-semibold border-b-2 border-orange-500' : ''
                  }`}
                >
                  Manajemen Inventaris
                </button>
                <button
                  onClick={() => setActiveTab('admin-reports')}
                  className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                    activeTab === 'admin-reports' ? 'text-orange-600 font-semibold border-b-2 border-orange-500' : ''
                  }`}
                >
                  Laporan Transaksi
                </button>
                <button
                  onClick={() => setActiveTab('admin-analytics')}
                  className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                    activeTab === 'admin-analytics' ? 'text-orange-600 font-semibold border-b-2 border-orange-500' : ''
                  }`}
                >
                  Analitik Penjualan
                </button>
                <button
                  onClick={() => setActiveTab('admin-chat')}
                  className={`hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                    activeTab === 'admin-chat' ? 'text-orange-600 font-semibold border-b-2 border-orange-500' : ''
                  }`}
                >
                  Chat Pelanggan
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: User actions & profile management */}
          <div className="flex items-center gap-2 shrink-0">
            {/* If NOT logged in: Show Login & Register CTA */}
            {!isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="py-1.5 px-3 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors whitespace-nowrap"
                >
                  Masuk Akun
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="py-1.5 px-3.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors whitespace-nowrap shadow-xs flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Daftar Sekarang</span>
                </button>
              </div>
            ) : (
              /* If Logged In: Show Notification Bell & User Account Menu with Edit Profile */
              <>
                {/* Notification Bell - Fitur notif real-time khusus muncul di halaman Super Admin */}
                {currentRole === 'super_admin' && (
                  <button
                    onClick={onOpenNotifications}
                    className="relative p-2 text-neutral-600 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors"
                    title="Notifikasi Real-Time (Super Admin)"
                    aria-label="Buka Notifikasi"
                  >
                    <Bell className="w-5 h-5 text-orange-600" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                      </span>
                    )}
                  </button>
                )}

                {/* User Menu with Edit Profil */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-2xl transition-colors text-xs"
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                      isStaffLoggedIn ? 'bg-blue-600' : 'bg-orange-500'
                    }`}>
                      {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="font-bold text-neutral-900 truncate max-w-[130px] leading-tight">
                        {displayName}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-semibold leading-none mt-0.5">
                        {displayRoleLabel}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        {/* User Header */}
                        <div className="px-4 py-2.5 border-b border-neutral-100">
                          <p className="text-xs font-bold text-neutral-900">{displayName}</p>
                          <p className="text-[11px] text-neutral-500 truncate">
                            {isCustomerLoggedIn && customerUser ? customerUser.email : currentUser.email}
                          </p>
                          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isStaffLoggedIn ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                          }`}>
                            {displayRoleLabel}
                          </span>
                        </div>

                        {/* Edit Profile Action (For ALL roles) */}
                        <div className="py-1 border-b border-neutral-100">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              openEditProfileModal();
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-neutral-700 hover:bg-orange-50 hover:text-orange-900 font-medium flex items-center gap-2.5 transition-colors"
                          >
                            <UserCog className="w-4 h-4 text-orange-500" />
                            <span>Edit Profil Saya</span>
                          </button>
                        </div>

                        {/* If Super Admin: Quick switch among internal staff roles for preview */}
                        {isStaffLoggedIn && staffUser?.role === 'super_admin' && (
                          <div className="py-1 border-b border-neutral-100">
                            <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                              Uji Tampilan Role Staf:
                            </div>
                            {staffRoles.map((r) => {
                              const isSel = r.role === currentRole;
                              return (
                                <button
                                  key={r.role}
                                  onClick={() => handleRoleSelect(r.role)}
                                  className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between transition-colors ${
                                    isSel ? 'bg-blue-50 text-blue-900 font-bold' : 'text-neutral-600 hover:bg-neutral-50'
                                  }`}
                                >
                                  <span>{r.label}</span>
                                  {isSel && <span className="text-[10px] text-blue-600 font-bold">Aktif</span>}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Logout Option */}
                        <div className="pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2.5 transition-colors"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>Keluar dari Akun (Logout)</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-xl hover:bg-neutral-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-4 space-y-2">
          {!isLoggedIn ? (
            <div className="space-y-2">
              <p className="text-xs text-neutral-500 font-medium">
                Masuk untuk mengakses katalog paket, rincian biaya, dan booking online:
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 px-3 text-xs font-bold text-center bg-neutral-100 rounded-xl text-neutral-800"
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 px-3 text-xs font-bold text-center bg-orange-500 text-white rounded-xl"
                >
                  Daftar
                </button>
              </div>
            </div>
          ) : isCustomer ? (
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab('catalog');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium rounded-xl hover:bg-neutral-100"
              >
                Pilihan Paket Tour
              </button>
              <button
                onClick={() => {
                  setActiveTab('my-orders');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium rounded-xl hover:bg-neutral-100"
              >
                Lacak Pesanan Saya
              </button>
              <button
                onClick={() => {
                  setActiveTab('customer-invoices');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium rounded-xl hover:bg-neutral-100"
              >
                Invoice & Tagihan
              </button>
              <button
                onClick={() => {
                  openEditProfileModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium rounded-xl text-orange-600 hover:bg-orange-50 flex items-center gap-2"
              >
                <UserCog className="w-4 h-4" />
                <span>Edit Profil Saya</span>
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab('admin-orders');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium rounded-xl hover:bg-neutral-100"
              >
                Order Masuk
              </button>
              <button
                onClick={() => {
                  setActiveTab('admin-inventory');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium rounded-xl hover:bg-neutral-100"
              >
                Manajemen Inventaris
              </button>
              <button
                onClick={() => {
                  setActiveTab('admin-reports');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium rounded-xl hover:bg-neutral-100"
              >
                Laporan Transaksi
              </button>
              <button
                onClick={() => {
                  setActiveTab('admin-analytics');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium rounded-xl hover:bg-neutral-100"
              >
                Analitik Penjualan
              </button>
              <button
                onClick={() => {
                  openEditProfileModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium rounded-xl text-orange-600 hover:bg-orange-50 flex items-center gap-2"
              >
                <UserCog className="w-4 h-4" />
                <span>Edit Profil Staf</span>
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-sm font-medium rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Dashboard</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
