import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TourPackage,
  BookingOrder,
  FleetUnit,
  DriverCrew,
  HotelPartner,
  UserProfile,
  UserRole,
  ChatMessage,
  NotificationItem,
  PaymentStatus,
  OrderStatus,
  MonthlyReportSummary,
  VendorPayment
} from '../types/travel';
import {
  INITIAL_PACKAGES,
  INITIAL_FLEET,
  INITIAL_DRIVERS,
  INITIAL_HOTELS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  INITIAL_CHATS,
  INITIAL_NOTIFICATIONS,
  INITIAL_VENDOR_PAYMENTS
} from '../data/initialData';
import { 
  ADMIN_PRIMARY_EMAIL, 
  EmailDispatchRecord, 
  getStoredEmails, 
  dispatchOrderNotificationEmail,
  dispatchCustomerAutoReplyEmail
} from '../services/emailService';
import { 
  RegisteredCustomer, 
  getStoredCustomer, 
  registerCustomer, 
  loginCustomer, 
  logoutCustomer,
  updateCustomerProfile,
  clearStoredCustomer,
  getAllRegisteredCustomers,
  saveAllRegisteredCustomers,
  adminAddCustomer,
  adminDeleteCustomer,
  adminUpdateCustomer,
  adminPurgeAllCustomers,
  DEFAULT_REGISTERED_CUSTOMERS
} from '../services/firebaseAuthService';
import {
  cloudSyncDoc,
  cloudSyncDocIfNotExists,
  cloudDeleteDoc,
  cloudPurgeCollection,
  cloudSubscribeCollection,
  db
} from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { normalizeImagePath } from '../utils/imageUtils';
import { 
  DestinationOption, 
  INITIAL_DESTINATIONS, 
  BONUS_DESTINATIONS,
  getMaxDestinationsForDuration,
  BonusDestinationInfo
} from '../data/destinationsData';
import { 
  checkLoginLockout, 
  recordFailedLogin, 
  resetLoginLockout, 
  verifySecurePassword, 
  logSecurityEvent, 
  generateSessionToken, 
  sanitizeAuthInput,
  LoginAuditLog 
} from '../services/secureAuthService';
import { 
  trackSiteVisit, 
  subscribeToLiveSiteStats, 
  SiteVisitorStats, 
  DEFAULT_SITE_STATS 
} from '../services/visitorTrackingService';

interface AppContextType {
  packages: TourPackage[];
  orders: BookingOrder[];
  fleet: FleetUnit[];
  drivers: DriverCrew[];
  hotels: HotelPartner[];
  destinations: DestinationOption[];
  bonusDestinations: Record<string, BonusDestinationInfo>;
  getMaxDestinationsForDuration: (days: number) => number;
  addCustomDestination: (dest: Omit<DestinationOption, 'id'>) => Promise<DestinationOption>;
  users: UserProfile[];
  currentUser: UserProfile;
  currentRole: UserRole;
  staffUser: UserProfile | null;
  isStaffLoggedIn: boolean;
  customerUser: RegisteredCustomer | null;
  isCustomerLoggedIn: boolean;
  isLoggedIn: boolean;
  notifications: NotificationItem[];
  unreadNotifCount: number;
  chats: ChatMessage[];
  emailOutbox: EmailDispatchRecord[];
  adminEmail: string;
  pushPermission: NotificationPermission;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setCurrentRole: (role: UserRole) => void;
  requestPushPermission: () => Promise<void>;
  createBooking: (newOrder: Omit<BookingOrder, 'id' | 'orderNumber' | 'createdAt'>) => BookingOrder;
  updatePaymentStatus: (orderId: string, status: PaymentStatus, reference?: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignFleetAndDriver: (orderId: string, fleetId: string, driverId: string) => void;
  deleteOrder: (orderId: string) => void;
  deleteFleet: (fleetId: string) => void;
  deleteDriver: (driverId: string) => void;
  addFleet: (unit: Omit<FleetUnit, 'id'>) => void;
  addDriver: (driver: Omit<DriverCrew, 'id'>) => void;
  updateFleet: (unit: FleetUnit) => void;
  updateDriver: (driver: DriverCrew) => void;
  addPackage: (pkg: Omit<TourPackage, 'id'>) => TourPackage;
  updatePackage: (pkg: TourPackage) => void;
  deletePackage: (pkgId: string) => void;
  addHotel: (hotel: Omit<HotelPartner, 'id'>) => void;
  updateHotel: (hotel: HotelPartner) => void;
  deleteHotel: (hotelId: string) => void;
  sendChatMessage: (text: string, sender?: 'customer' | 'cs_admin', packageContext?: string) => void;
  markChatAsRead: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToDemoData: () => void;
  getMonthlySummary: (month: number, year: number) => MonthlyReportSummary;
  selectedOrderForDetail: BookingOrder | null;
  setSelectedOrderForDetail: (order: BookingOrder | null) => void;
  selectedPackageForBooking: TourPackage | null;
  setSelectedPackageForBooking: (pkg: TourPackage | null) => void;
  activeOrderForPayment: BookingOrder | null;
  setActiveOrderForPayment: (order: BookingOrder | null) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  // Auth & Roles
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  authModalMessage: string | null;
  openAuthModal: (mode?: 'login' | 'register', message?: string) => void;
  closeAuthModal: () => void;
  handleCustomerLogin: (email: string, password: string) => Promise<boolean>;
  handleCustomerRegister: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  handleCustomerLogout: () => Promise<void>;
  handleStaffLogin: (email: string, password?: string) => Promise<boolean>;
  handleStaffLogout: () => Promise<void>;
  updateUserProfile: (data: { name?: string; email?: string; phone?: string; department?: string; password?: string }) => Promise<boolean>;
  isEditProfileOpen: boolean;
  openEditProfileModal: () => void;
  closeEditProfileModal: () => void;
  pendingBooking: { pkg: TourPackage; tier: any } | null;
  setPendingBooking: (val: { pkg: TourPackage; tier: any } | null) => void;
  isNotifOpen: boolean;
  setIsNotifOpen: (open: boolean) => void;
  openNotifications: () => void;
  closeNotifications: () => void;
  // Customer Digital Invoice Modal
  selectedInvoiceForModal: BookingOrder | null;
  setSelectedInvoiceForModal: (order: BookingOrder | null) => void;
  // Vendor Disbursements (Driver, Hotel, Kendaraan, Tempat Wisata)
  vendorPayments: VendorPayment[];
  addVendorPayment: (payment: Omit<VendorPayment, 'id' | 'paymentNumber' | 'createdAt'>) => void;
  updateVendorPayment: (payment: VendorPayment) => void;
  deleteVendorPayment: (paymentId: string) => void;
  updateVendorPaymentStatus: (paymentId: string, status: 'selesai' | 'menunggu' | 'proses') => void;
  purgeVendorPayments: () => void;
  // User Registry & Admin Management
  registeredCustomers: RegisteredCustomer[];
  adminAddUser: (data: { name: string; email: string; role: UserRole; phone: string; password?: string }) => Promise<void>;
  adminUpdateUser: (id: string, updates: Partial<UserProfile> & { displayName?: string; phoneNumber?: string }) => Promise<void>;
  adminDeleteUser: (id: string) => Promise<void>;
  adminToggleUserStatus: (id: string) => Promise<void>;
  // Purge Center
  purgeOrders: (onlyDummy?: boolean) => void;
  purgeFleet: () => void;
  purgeDrivers: () => void;
  purgeChats: () => void;
  purgeNotifications: () => void;
  purgePackages: () => void;
  purgeHotels: () => void;
  purgeCustomers: () => void;
  purgeAllDataFactoryReset: () => void;
  // Inactivity Auto Logout
  autoLogoutNotice: string | null;
  clearAutoLogoutNotice: () => void;
  // Real-time Visitor & Analytics
  visitorStats: SiteVisitorStats;
  securityAuditLogs: LoginAuditLog[];
  trackVisit: (role?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ORDERS = 'pergidiantar_orders_v1';
const LOCAL_STORAGE_KEY_FLEET = 'pergidiantar_fleet_v1';
const LOCAL_STORAGE_KEY_DRIVERS = 'pergidiantar_drivers_v1';
const LOCAL_STORAGE_KEY_CHATS = 'pergidiantar_chats_v1';
const LOCAL_STORAGE_KEY_NOTIFS = 'pergidiantar_notifs_v1';
const LOCAL_STORAGE_KEY_USERS = 'pergidiantar_users_v2';
const LOCAL_STORAGE_KEY_STAFF_AUTH = 'pergidiantar_staff_session_v1';
const LOCAL_STORAGE_KEY_PACKAGES = 'pergidiantar_packages_v1';
const LOCAL_STORAGE_KEY_HOTELS = 'pergidiantar_hotels_v1';
const LOCAL_STORAGE_KEY_VENDOR_PAYMENTS = 'pergidiantar_vendor_payments_v1';
const LOCAL_STORAGE_KEY_TRIP_DESTINATIONS = 'pergidiantar_trip_destinations_v2';

// Purge permanence flags
const LOCAL_STORAGE_KEY_PURGED_ORDERS = 'pergidiantar_purged_orders';
const LOCAL_STORAGE_KEY_PURGED_FLEET = 'pergidiantar_purged_fleet';
const LOCAL_STORAGE_KEY_PURGED_DRIVERS = 'pergidiantar_purged_drivers';
const LOCAL_STORAGE_KEY_PURGED_CHATS = 'pergidiantar_purged_chats';
const LOCAL_STORAGE_KEY_PURGED_NOTIFS = 'pergidiantar_purged_notifs';
const LOCAL_STORAGE_KEY_PURGED_PACKAGES = 'pergidiantar_purged_packages';
const LOCAL_STORAGE_KEY_PURGED_HOTELS = 'pergidiantar_purged_hotels';
const LOCAL_STORAGE_KEY_PURGED_VENDOR_PAYMENTS = 'pergidiantar_purged_vendor_payments';
const LOCAL_STORAGE_KEY_PURGED_CUSTOMERS = 'pergidiantar_purged_customers';
const LOCAL_STORAGE_KEY_LAST_ACTIVITY = 'pergidiantar_last_activity_timestamp';
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<TourPackage[]>(() => {
    try {
      if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_PACKAGES) === 'true') return [];
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PACKAGES);
      const raw: TourPackage[] = saved !== null ? JSON.parse(saved) : INITIAL_PACKAGES;
      return raw.map(p => ({
        ...p,
        heroImage: normalizeImagePath(p.heroImage, p.destinations?.[0] as any)
      }));
    } catch {
      return INITIAL_PACKAGES;
    }
  });

  const [hotels, setHotels] = useState<HotelPartner[]>(() => {
    try {
      if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_HOTELS) === 'true') return [];
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_HOTELS);
      return saved !== null ? JSON.parse(saved) : INITIAL_HOTELS;
    } catch {
      return [];
    }
  });

  const [vendorPayments, setVendorPayments] = useState<VendorPayment[]>(() => {
    try {
      if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_VENDOR_PAYMENTS) === 'true') return [];
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_VENDOR_PAYMENTS);
      if (!saved) return INITIAL_VENDOR_PAYMENTS;
      const parsed: VendorPayment[] = JSON.parse(saved);
      // Clean legacy dummy payments
      return parsed.filter(v => !v.id.startsWith('pay-drv-0') && !v.id.startsWith('pay-htl-0') && !v.id.startsWith('pay-tkt-0') && !v.id.startsWith('pay-veh-0'));
    } catch {
      return [];
    }
  });

  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<BookingOrder | null>(null);

  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
      if (!saved) return INITIAL_USERS;
      const parsed: UserProfile[] = JSON.parse(saved);
      // Clean legacy dummy test roles
      const filtered = parsed.filter(u => u.role === 'super_admin');
      return filtered.length > 0 ? filtered : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [orders, setOrders] = useState<BookingOrder[]>(() => {
    try {
      if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_ORDERS) === 'true') return [];
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
      if (!saved) return INITIAL_ORDERS;
      const parsed: BookingOrder[] = JSON.parse(saved);
      // Clean legacy dummy test orders
      return parsed.filter(o => !['ord-01', 'ord-02', 'ord-03', 'ord-04', 'ord-05'].includes(o.id));
    } catch {
      return [];
    }
  });

  const [fleet, setFleet] = useState<FleetUnit[]>(() => {
    try {
      if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_FLEET) === 'true') return [];
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_FLEET);
      return saved !== null ? JSON.parse(saved) : INITIAL_FLEET;
    } catch {
      return [];
    }
  });

  const [drivers, setDrivers] = useState<DriverCrew[]>(() => {
    try {
      if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_DRIVERS) === 'true') return [];
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DRIVERS);
      return saved !== null ? JSON.parse(saved) : INITIAL_DRIVERS;
    } catch {
      return [];
    }
  });

  const [chats, setChats] = useState<ChatMessage[]>(() => {
    try {
      if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_CHATS) === 'true') return [];
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CHATS);
      if (!saved) return INITIAL_CHATS;
      const parsed: ChatMessage[] = JSON.parse(saved);
      return parsed.filter(c => !['c1', 'c2', 'c3', 'c4', 'c5'].includes(c.id));
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_NOTIFS) === 'true') return [];
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFS);
      if (!saved) return INITIAL_NOTIFICATIONS;
      const parsed: NotificationItem[] = JSON.parse(saved);
      return parsed.filter(n => !['n1', 'n2', 'n3', 'n4', 'n5'].includes(n.id));
    } catch {
      return [];
    }
  });

  const [registeredCustomers, setRegisteredCustomers] = useState<RegisteredCustomer[]>(() => {
    return getAllRegisteredCustomers();
  });

  const [emailOutbox, setEmailOutbox] = useState<EmailDispatchRecord[]>(() => {
    return getStoredEmails();
  });

  const [destinations, setDestinations] = useState<DestinationOption[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TRIP_DESTINATIONS);
      return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
    } catch {
      return INITIAL_DESTINATIONS;
    }
  });

  // Authenticated Sessions
  const [customerUser, setCustomerUser] = useState<RegisteredCustomer | null>(() => {
    return getStoredCustomer();
  });

  const [staffUser, setStaffUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STAFF_AUTH);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isCustomerLoggedIn = !!customerUser;
  const isStaffLoggedIn = !!staffUser;
  const isLoggedIn = isCustomerLoggedIn || isStaffLoggedIn;

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    if (staffUser) return staffUser.role;
    return 'customer';
  });

  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');

  // Real-time Visitor Tracking & Security Audit Logs
  const [visitorStats, setVisitorStats] = useState<SiteVisitorStats>(() => {
    try {
      const saved = localStorage.getItem('pergidiantar_cached_site_stats');
      return saved ? JSON.parse(saved) : DEFAULT_SITE_STATS;
    } catch {
      return DEFAULT_SITE_STATS;
    }
  });
  const [securityAuditLogs, setSecurityAuditLogs] = useState<LoginAuditLog[]>([]);

  const trackVisit = async (role?: string) => {
    try {
      const updated = await trackSiteVisit(role || currentRole || 'Pengunjung');
      setVisitorStats(updated);
    } catch {}
  };

  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<BookingOrder | null>(null);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<TourPackage | null>(null);
  const [activeOrderForPayment, setActiveOrderForPayment] = useState<BookingOrder | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Edit Profile Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const openEditProfileModal = () => setIsEditProfileOpen(true);
  const closeEditProfileModal = () => setIsEditProfileOpen(false);

  // Real-time notification drawer (Gated strictly to Super Admin)
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const openNotifications = () => {
    if (currentRole === 'super_admin') {
      setIsNotifOpen(true);
    }
  };
  const closeNotifications = () => setIsNotifOpen(false);

  // Customer Firebase Authentication modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalMessage, setAuthModalMessage] = useState<string | null>(null);
  const [pendingBooking, setPendingBooking] = useState<{ pkg: TourPackage; tier: any } | null>(null);

  const openAuthModal = (mode: 'login' | 'register' = 'login', message?: string) => {
    setAuthModalMode(mode);
    setAuthModalMessage(message || null);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthModalMessage(null);
  };

  const handleCustomerLogin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const user = await loginCustomer(email, pass);
      // Clear staff session when customer logs in
      setStaffUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY_STAFF_AUTH);
      setCustomerUser(user);
      setCurrentRoleState('customer');
      setActiveTab('catalog');
      closeAuthModal();
      triggerPush('Login Berhasil', `Selamat datang kembali di PERGIDIANTAR, ${user.displayName}!`, 'system');
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const handleCustomerRegister = async (name: string, email: string, pass: string, phone: string): Promise<boolean> => {
    try {
      const user = await registerCustomer(name, email, pass, phone);
      setStaffUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY_STAFF_AUTH);
      setCustomerUser(user);
      setRegisteredCustomers(getAllRegisteredCustomers());
      setCurrentRoleState('customer');
      setActiveTab('catalog');
      closeAuthModal();
      triggerPush('Pendaftaran Berhasil', `Akun Anda telah terdaftar di database PERGIDIANTAR. Selamat datang, ${user.displayName}!`, 'system');
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  const handleCustomerLogout = async (): Promise<void> => {
    await logoutCustomer();
    setCustomerUser(null);
    setCurrentRoleState('customer');
    setActiveTab('catalog');
    triggerPush('Logout Berhasil', 'Anda telah keluar dari akun pelanggan.', 'system');
  };

  const handleStaffLogin = async (identifier: string, password?: string): Promise<boolean> => {
    const cleanId = sanitizeAuthInput(identifier).toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId) {
      throw new Error('Username atau Email wajib diisi.');
    }
    if (!cleanPass) {
      throw new Error('Kata sandi wajib diisi.');
    }

    // 1. Brute-force Lockout Check
    const lockout = checkLoginLockout(cleanId);
    if (lockout.isLocked) {
      logSecurityEvent({
        email: cleanId,
        role: 'staff',
        status: 'locked',
        reason: 'Akses staf dikunci karena percobaan salah berulang kali'
      });
      throw new Error(`Akses staf diblokir sementara: Terlalu banyak percobaan login salah. Akun Anda dikunci selama ${lockout.remainingSeconds} detik demi keamanan.`);
    }

    let found = users.find(u => 
      u.email.toLowerCase() === cleanId ||
      u.name.toLowerCase() === cleanId ||
      (cleanId.includes('benisius') && u.role === 'super_admin') ||
      (cleanId === 'superadmin' && u.role === 'super_admin') ||
      (cleanId === 'admin' && u.role === 'super_admin')
    );

    // Fallback: Query live Cloud Firestore so any staff or superadmin can log in from any device
    if (!found) {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const remoteUsers: UserProfile[] = [];
        snap.forEach(d => remoteUsers.push(d.data() as UserProfile));
        if (remoteUsers.length > 0) {
          setUsers(remoteUsers);
          localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(remoteUsers));
          found = remoteUsers.find(u => 
            u.email.toLowerCase() === cleanId ||
            u.name.toLowerCase() === cleanId ||
            (cleanId.includes('benisius') && u.role === 'super_admin') ||
            (cleanId === 'superadmin' && u.role === 'super_admin') ||
            (cleanId === 'admin' && u.role === 'super_admin')
          );
        }
      } catch (err) {
        console.warn('Direct Firestore staff lookup error:', err);
      }
    }

    if (!found) {
      const fail = recordFailedLogin(cleanId);
      logSecurityEvent({
        email: cleanId,
        role: 'staff',
        status: 'failed',
        reason: 'Username staf tidak terdaftar'
      });
      throw new Error('Username atau Email tidak terdaftar di database PERGIDIANTAR.');
    }

    if (found.status === 'inactive') {
      logSecurityEvent({
        email: found.email,
        role: found.role,
        status: 'failed',
        reason: 'Akun staf berstatus non-aktif'
      });
      throw new Error('Akun staf Anda berstatus non-aktif. Harap hubungi Super Admin.');
    }

    // 2. Strict Password Verification
    const isPassValid = await verifySecurePassword(cleanPass, found.password);
    if (!isPassValid) {
      const fail = recordFailedLogin(cleanId);
      logSecurityEvent({
        email: found.email,
        role: found.role,
        status: fail.isLocked ? 'locked' : 'failed',
        reason: 'Password staf salah'
      });

      if (fail.isLocked) {
        throw new Error(`Kata sandi salah. Akun staf dikunci sementara selama 5 menit untuk proteksi keamanan (${fail.attempts}x percobaan salah).`);
      }
      throw new Error(`Kata sandi salah. Harap periksa kembali password Anda. (Sisa percobaan: ${5 - fail.attempts}x)`);
    }

    // 3. Login Success: Reset lockout, generate session token, record audit
    resetLoginLockout(cleanId);
    const sessionToken = generateSessionToken(found.id, found.role);
    const updatedStaff: UserProfile = {
      ...found,
      sessionToken,
      lastLoginAt: new Date().toISOString()
    };

    // Logout customer session
    setCustomerUser(null);
    clearStoredCustomer();

    setStaffUser(updatedStaff);
    localStorage.setItem(LOCAL_STORAGE_KEY_STAFF_AUTH, JSON.stringify(updatedStaff));
    setCurrentRoleState(found.role);
    setActiveTab('admin-orders');
    closeAuthModal();
    triggerPush('Login Staf Berhasil', `Selamat datang, ${found.name} (${found.roleLabel})!`, 'system');

    // Cloud Firebase Integration: Record verified login audit & update user document
    cloudSyncDoc('users', found.id, updatedStaff).catch(() => {});
    logSecurityEvent({
      email: found.email,
      role: found.role,
      status: 'success',
      reason: 'Login Staf Berhasil (Sesi Aman)'
    });

    return true;
  };

  const handleStaffLogout = async (): Promise<void> => {
    setStaffUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_STAFF_AUTH);
    setCurrentRoleState('customer');
    setActiveTab('catalog');
    triggerPush('Logout Berhasil', 'Anda telah keluar dari dashboard manajemen.', 'system');
  };

  // Profile update for all user roles
  const updateUserProfile = async (data: {
    name?: string;
    email?: string;
    phone?: string;
    department?: string;
    password?: string;
  }): Promise<boolean> => {
    try {
      if (customerUser && currentRole === 'customer') {
        const updated = updateCustomerProfile({
          displayName: data.name || customerUser.displayName,
          email: data.email || customerUser.email,
          phoneNumber: data.phone || customerUser.phoneNumber,
          password: data.password || customerUser.password
        });
        setCustomerUser(updated);

        // Update in users array if customer exists
        setUsers(prev => prev.map(u => {
          if (u.role === 'customer' || u.id === customerUser.uid) {
            return {
              ...u,
              name: data.name || u.name,
              email: data.email || u.email,
              phone: data.phone || u.phone,
              password: data.password || u.password
            };
          }
          return u;
        }));
      }

      if (staffUser) {
        const updatedStaff: UserProfile = {
          ...staffUser,
          name: data.name || staffUser.name,
          email: data.email || staffUser.email,
          phone: data.phone || staffUser.phone,
          department: data.department || staffUser.department,
          password: data.password || staffUser.password
        };
        setStaffUser(updatedStaff);
        localStorage.setItem(LOCAL_STORAGE_KEY_STAFF_AUTH, JSON.stringify(updatedStaff));
        cloudSyncDoc('users', updatedStaff.id, updatedStaff).catch(() => {});

        // Update in users list
        setUsers(prev => prev.map(u => {
          if (u.id === staffUser.id || u.role === staffUser.role) {
            return {
              ...u,
              name: data.name || u.name,
              email: data.email || u.email,
              phone: data.phone || u.phone,
              department: data.department || u.department,
              password: data.password || u.password
            };
          }
          return u;
        }));
      }

      triggerPush('Profil Diperbarui', 'Data akun Anda telah berhasil disimpan.', 'system');
      return true;
    } catch (err) {
      console.error('Error updating user profile:', err);
      return false;
    }
  };

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

  // Sync orders to localStorage & maintain purge permanence
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
    if (orders.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_ORDERS, 'true');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_PURGED_ORDERS);
    }
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PACKAGES, JSON.stringify(packages));
    if (packages.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_PACKAGES, 'true');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_PURGED_PACKAGES);
    }
  }, [packages]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_FLEET, JSON.stringify(fleet));
    if (fleet.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_FLEET, 'true');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_PURGED_FLEET);
    }
  }, [fleet]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_DRIVERS, JSON.stringify(drivers));
    if (drivers.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_DRIVERS, 'true');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_PURGED_DRIVERS);
    }
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(chats));
    if (chats.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_CHATS, 'true');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_PURGED_CHATS);
    }
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    if (notifications.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_NOTIFS, 'true');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_PURGED_NOTIFS);
    }
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_HOTELS, JSON.stringify(hotels));
    if (hotels.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_HOTELS, 'true');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_PURGED_HOTELS);
    }
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_VENDOR_PAYMENTS, JSON.stringify(vendorPayments));
    if (vendorPayments.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_VENDOR_PAYMENTS, 'true');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_PURGED_VENDOR_PAYMENTS);
    }
  }, [vendorPayments]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TRIP_DESTINATIONS, JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    saveAllRegisteredCustomers(registeredCustomers);
  }, [registeredCustomers]);

  // Real-time Cloud Firebase Synchronization across all online devices
  useEffect(() => {
    // 1. Subscribe to Orders
    const unsubOrders = cloudSubscribeCollection<BookingOrder>('orders', (cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
      }
    });

    // 2. Subscribe to Vendor Disbursements
    const unsubPayments = cloudSubscribeCollection<VendorPayment>('vendorPayments', (cloudPayments) => {
      if (cloudPayments && cloudPayments.length > 0) {
        setVendorPayments(cloudPayments);
      }
    });

    // 3. Subscribe to Fleet Inventory
    const unsubFleet = cloudSubscribeCollection<FleetUnit>('fleet', (cloudFleet) => {
      if (cloudFleet && cloudFleet.length > 0) {
        setFleet(cloudFleet);
      }
    });

    // 4. Subscribe to Drivers & Crew
    const unsubDrivers = cloudSubscribeCollection<DriverCrew>('drivers', (cloudDrivers) => {
      if (cloudDrivers && cloudDrivers.length > 0) {
        setDrivers(cloudDrivers);
      }
    });

    // 5. Subscribe to Hotel Partners
    const unsubHotels = cloudSubscribeCollection<HotelPartner>('hotels', (cloudHotels) => {
      if (cloudHotels && cloudHotels.length > 0) {
        setHotels(cloudHotels);
      }
    });

    // 6. Subscribe to Tour Packages
    const unsubPackages = cloudSubscribeCollection<TourPackage>('packages', (cloudPkgs) => {
      if (cloudPkgs && cloudPkgs.length > 0) {
        setPackages(cloudPkgs.map(p => ({
          ...p,
          heroImage: normalizeImagePath(p.heroImage, p.destinations?.[0] as any)
        })));
      }
    });

    // 7. Subscribe to Registered Customers (any device can login immediately)
    const unsubCustomers = cloudSubscribeCollection<RegisteredCustomer>('customers', (cloudCustomers) => {
      if (cloudCustomers && cloudCustomers.length > 0) {
        setRegisteredCustomers(cloudCustomers);
        saveAllRegisteredCustomers(cloudCustomers);
      }
    });

    // 8. Subscribe to Staff / Super Admin Users
    const unsubUsers = cloudSubscribeCollection<UserProfile>('users', (cloudUsers) => {
      if (cloudUsers && cloudUsers.length > 0) {
        setUsers(cloudUsers);
        localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(cloudUsers));
      }
    });

    // 9. Subscribe to Live Consultations Chat
    const unsubChats = cloudSubscribeCollection<ChatMessage>('chats', (cloudChats) => {
      if (cloudChats && cloudChats.length > 0) {
        setChats(cloudChats);
      }
    });

    // 10. Subscribe to Real-time Notifications
    const unsubNotifs = cloudSubscribeCollection<NotificationItem>('notifications', (cloudNotifs) => {
      if (cloudNotifs && cloudNotifs.length > 0) {
        setNotifications(cloudNotifs);
      }
    });

    // 11. Subscribe to Trip Destinations (Real-time Cloud Sync)
    const unsubDestinations = cloudSubscribeCollection<DestinationOption>('trip_destinations', (cloudDests) => {
      if (cloudDests && cloudDests.length > 0) {
        setDestinations(cloudDests);
      }
    });

    // 12. Real-time Visitor Tracking & Cloud Synchronization Across All Devices
    trackSiteVisit(staffUser?.roleLabel || (customerUser ? 'Pelanggan' : 'Pengunjung')).then(st => {
      setVisitorStats(st);
    }).catch(() => {});

    const unsubVisitor = subscribeToLiveSiteStats((stats) => {
      setVisitorStats(stats);
    });

    // 13. Real-time Login Security Audit Logs (Multi-device)
    const unsubSecurityLogs = cloudSubscribeCollection<LoginAuditLog>('login_logs', (logs) => {
      if (logs && logs.length > 0) {
        setSecurityAuditLogs(logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      }
    });

    // Seed initial users, customers, packages, hotels, fleet, drivers, and destinations to Cloud Firestore
    // CRITICAL: We use cloudSyncDocIfNotExists so any customized data, additions, or updates made by admin
    // are PERMANENTLY PRESERVED and never wiped out or reset by system updates or reloads!
    INITIAL_USERS.forEach((u) => {
      cloudSyncDocIfNotExists('users', u.id, u).catch(() => {});
    });

    if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_CUSTOMERS) !== 'true') {
      DEFAULT_REGISTERED_CUSTOMERS.forEach((c) => {
        cloudSyncDocIfNotExists('customers', c.uid, c).catch(() => {});
      });
    }

    INITIAL_PACKAGES.forEach((p) => {
      cloudSyncDocIfNotExists('packages', p.id, p).catch(() => {});
    });

    if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_FLEET) !== 'true') {
      INITIAL_FLEET.forEach((f) => {
        cloudSyncDocIfNotExists('fleet', f.id, f).catch(() => {});
      });
    }

    if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_DRIVERS) !== 'true') {
      INITIAL_DRIVERS.forEach((d) => {
        cloudSyncDocIfNotExists('drivers', d.id, d).catch(() => {});
      });
    }

    if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_HOTELS) !== 'true') {
      INITIAL_HOTELS.forEach((h) => {
        cloudSyncDocIfNotExists('hotels', h.id, h).catch(() => {});
      });
    }

    // Seed 60 initial viral destinations (20 Jogja, 20 Malang, 20 Bali)
    INITIAL_DESTINATIONS.forEach((d) => {
      cloudSyncDocIfNotExists('trip_destinations', d.id, d).catch(() => {});
    });

    if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_ORDERS) !== 'true') {
      INITIAL_ORDERS.forEach((o) => {
        cloudSyncDocIfNotExists('orders', o.id, o).catch(() => {});
      });
    }

    if (localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_VENDOR_PAYMENTS) !== 'true') {
      INITIAL_VENDOR_PAYMENTS.forEach((v) => {
        cloudSyncDocIfNotExists('vendorPayments', v.id, v).catch(() => {});
      });
    }

    return () => {
      unsubOrders();
      unsubPayments();
      unsubFleet();
      unsubDrivers();
      unsubHotels();
      unsubPackages();
      unsubCustomers();
      unsubUsers();
      unsubChats();
      unsubNotifs();
      unsubDestinations();
      unsubVisitor();
      unsubSecurityLogs();
    };
  }, []);

  // Inactivity auto-logout (30 minutes of inactivity)
  const [autoLogoutNotice, setAutoLogoutNotice] = useState<string | null>(null);
  const clearAutoLogoutNotice = () => setAutoLogoutNotice(null);

  useEffect(() => {
    // 1. Initial mount check: if last activity exceeded 30 mins, expire immediately
    const storedLastActive = localStorage.getItem(LOCAL_STORAGE_KEY_LAST_ACTIVITY);
    if (storedLastActive && (isCustomerLoggedIn || isStaffLoggedIn)) {
      const elapsed = Date.now() - parseInt(storedLastActive, 10);
      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        clearStoredCustomer();
        localStorage.removeItem(LOCAL_STORAGE_KEY_STAFF_AUTH);
        setCustomerUser(null);
        setStaffUser(null);
        setCurrentRoleState('customer');
        setActiveTab('catalog');
        setAutoLogoutNotice('Sesi Anda telah berakhir secara otomatis demi keamanan setelah 30 menit tidak aktif. Seluruh navigasi portal disembunyikan. Silakan login kembali.');
        return;
      }
    }

    const markActive = () => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_LAST_ACTIVITY, Date.now().toString());
      } catch {}
    };

    markActive();

    // 2. Listen to interactions to refresh inactivity timer
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    let lastThrottled = 0;

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastThrottled > 5000) {
        lastThrottled = now;
        markActive();
      }
    };

    events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));

    // 3. Periodic check every 10 seconds
    const interval = setInterval(() => {
      if (isLoggedIn) {
        const lastStr = localStorage.getItem(LOCAL_STORAGE_KEY_LAST_ACTIVITY);
        const lastTime = lastStr ? parseInt(lastStr, 10) : Date.now();
        if (Date.now() - lastTime >= INACTIVITY_TIMEOUT_MS) {
          clearStoredCustomer();
          localStorage.removeItem(LOCAL_STORAGE_KEY_STAFF_AUTH);
          setCustomerUser(null);
          setStaffUser(null);
          setCurrentRoleState('customer');
          setActiveTab('catalog');
          setAutoLogoutNotice('Sesi Anda telah berakhir secara otomatis demi keamanan setelah 30 menit tidak aktif. Seluruh navigasi portal disembunyikan. Silakan login kembali.');
        }
      }
    }, 10000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleActivity));
      clearInterval(interval);
    };
  }, [isLoggedIn, isCustomerLoggedIn, isStaffLoggedIn]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermission(Notification.permission);
    }
  }, []);

  const currentUser: UserProfile = staffUser
    ? (users.find(u => u.role === currentRole) || staffUser)
    : customerUser
    ? {
        id: customerUser.uid,
        name: customerUser.displayName,
        email: customerUser.email,
        role: 'customer',
        roleLabel: 'Pelanggan Terdaftar',
        department: 'Portal Pelanggan',
        phone: customerUser.phoneNumber,
        password: customerUser.password
      }
    : (users.find(u => u.role === 'super_admin') || users[0]);

  const setCurrentRole = (role: UserRole) => {
    if (role === 'customer') {
      setCurrentRoleState('customer');
      setActiveTab('catalog');
    } else {
      // Non-customer pages can ONLY be accessed after role user performs login!
      if (!staffUser) {
        openAuthModal('login', 'Halaman manajemen operasional hanya dapat diakses setelah melakukan login resmi dengan akun staf.');
        return;
      }
      setCurrentRoleState(role);
      setActiveTab('admin-orders');
    }
  };

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
        if (perm === 'granted') {
          new Notification('PERGIDIANTAR Notifikasi Aktif', {
            body: 'Anda akan menerima pembaruan real-time status order dan pembayaran.',
            icon: '/favicon.ico'
          });
        }
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    }
  };

  const triggerPush = (title: string, body: string, type: NotificationItem['type'] = 'system', orderId?: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message: body,
      timestamp: 'Baru saja',
      type,
      isRead: false,
      orderId
    };

    setNotifications((prev) => [newNotif, ...prev]);
    cloudSyncDoc('notifications', newNotif.id, newNotif).catch(() => {});

    // Push notif browser real-time HANYA aktif dan muncul untuk role Super Admin
    if (currentRole === 'super_admin' && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico'
        });
      } catch (e) {
        console.warn('Error firing push notification:', e);
      }
    }
  };

  const createBooking = (newOrderData: Omit<BookingOrder, 'id' | 'orderNumber' | 'createdAt'>): BookingOrder => {
    const timestamp = new Date();
    const orderNumber = `PGD-${timestamp.getFullYear()}${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const id = `ord-${Date.now()}`;

    const createdOrder: BookingOrder = {
      ...newOrderData,
      id,
      orderNumber,
      createdAt: `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(timestamp.getDate()).padStart(2, '0')} ${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}`
    };

    // Auto-allocate recommended fleet if pax matches and fleet is available
    let allocatedFleetId: string | undefined = undefined;
    let allocatedFleetName: string | undefined = undefined;
    let allocatedDriverId: string | undefined = undefined;
    let allocatedDriverName: string | undefined = undefined;
    let allocatedDriverPhone: string | undefined = undefined;

    // Find available vehicle with enough capacity
    const availableUnit = fleet.find(
      (f) => f.status === 'tersedia' && f.capacitySeats >= createdOrder.paxCount
    );

    if (availableUnit) {
      allocatedFleetId = availableUnit.id;
      allocatedFleetName = `${availableUnit.name} (${availableUnit.plateNumber})`;

      // Driver
      const availableDriver = drivers.find((d) => d.status === 'tersedia');
      if (availableDriver) {
        allocatedDriverId = availableDriver.id;
        allocatedDriverName = availableDriver.name;
        allocatedDriverPhone = availableDriver.phone;
      }
    }

    if (allocatedFleetId) {
      createdOrder.assignedFleetId = allocatedFleetId;
      createdOrder.assignedFleetName = allocatedFleetName;
      if (allocatedDriverId) {
        createdOrder.assignedDriverId = allocatedDriverId;
        createdOrder.assignedDriverName = allocatedDriverName;
        createdOrder.assignedDriverPhone = allocatedDriverPhone;
      }
      // Update fleet state
      setFleet((prev) =>
        prev.map((f) =>
          f.id === allocatedFleetId
            ? {
                ...f,
                status: 'ditugaskan',
                currentOrderId: createdOrder.orderNumber,
                assignedTour: `${createdOrder.packageTitle} (${createdOrder.customer.fullName})`,
                driverId: allocatedDriverId,
                driverName: allocatedDriverName
              }
            : f
        )
      );

      const targetUnit = fleet.find(f => f.id === allocatedFleetId);
      if (targetUnit) {
        cloudSyncDoc('fleet', allocatedFleetId, {
          ...targetUnit,
          status: 'ditugaskan',
          currentOrderId: createdOrder.orderNumber,
          assignedTour: `${createdOrder.packageTitle} (${createdOrder.customer.fullName})`,
          driverId: allocatedDriverId,
          driverName: allocatedDriverName
        }).catch(() => {});
      }

      // Update driver state
      if (allocatedDriverId) {
        setDrivers((prev) =>
          prev.map((d) =>
            d.id === allocatedDriverId
              ? { ...d, status: 'ditugaskan', currentOrderId: createdOrder.orderNumber }
              : d
          )
        );

        const targetDriver = drivers.find(d => d.id === allocatedDriverId);
        if (targetDriver) {
          cloudSyncDoc('drivers', allocatedDriverId, {
            ...targetDriver,
            status: 'ditugaskan',
            currentOrderId: createdOrder.orderNumber
          }).catch(() => {});
        }
      }
    }

    setOrders((prev) => [createdOrder, ...prev]);
    // Cloud Firebase Integration: Sync new booking directly to cloud
    cloudSyncDoc('orders', createdOrder.id, createdOrder).catch(() => {});

    // 1. Automated admin notification to pergi.diantar@gmail.com
    dispatchOrderNotificationEmail(createdOrder, 'new_order').then((adminEmailRec) => {
      setEmailOutbox((prev) => [adminEmailRec, ...prev]);
    });

    // 2. Automated auto-reply from pergi.diantar@gmail.com to customer's email
    dispatchCustomerAutoReplyEmail(createdOrder).then((customerEmailRec) => {
      setEmailOutbox((prev) => [customerEmailRec, ...prev]);
    });

    triggerPush(
      'Pesanan Baru Masuk!',
      `Order ${orderNumber} (${createdOrder.packageTitle}) oleh ${createdOrder.customer.fullName} telah diterima. Notifikasi terkirim ke ${ADMIN_PRIMARY_EMAIL} dan konfirmasi otomatis terkirim ke ${createdOrder.customer.email}.`,
      'order',
      createdOrder.id
    );

    return createdOrder;
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus, reference?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const isNowPaid = status === 'paid' || status === 'verified';
          const updated: BookingOrder = {
            ...ord,
            paymentStatus: status,
            paymentReference: reference || ord.paymentReference,
            paidAt: isNowPaid ? new Date().toLocaleString('id-ID') : ord.paidAt,
            orderStatus: isNowPaid && ord.orderStatus === 'baru' ? 'dikonfirmasi' : ord.orderStatus
          };

          // Cloud Firebase Integration: Sync payment status directly
          cloudSyncDoc('orders', updated.id, updated).catch(() => {});

          if (isNowPaid) {
            dispatchOrderNotificationEmail(updated, 'payment_verified').then((emailRec) => {
              setEmailOutbox((prevEmails) => [emailRec, ...prevEmails]);
            });

            triggerPush(
              'Pembayaran Berhasil Diverifikasi',
              `Pembayaran untuk ${ord.orderNumber} (Rp ${ord.grandTotal.toLocaleString('id-ID')}) lunas. Notifikasi terkirim ke ${ADMIN_PRIMARY_EMAIL}.`,
              'payment',
              ord.id
            );
          }
          return updated;
        }
        return ord;
      })
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, orderStatus: status };

          // Cloud Firebase Integration: Sync order status directly
          cloudSyncDoc('orders', updated.id, updated).catch(() => {});

          // If completed or cancelled, release fleet and driver
          if (status === 'selesai' || status === 'dibatalkan') {
            if (ord.assignedFleetId) {
              setFleet((fleetPrev) =>
                fleetPrev.map((f) =>
                  f.id === ord.assignedFleetId
                    ? { ...f, status: 'tersedia', currentOrderId: undefined, assignedTour: undefined }
                    : f
                )
              );
            }
            if (ord.assignedDriverId) {
              setDrivers((driverPrev) =>
                driverPrev.map((d) =>
                  d.id === ord.assignedDriverId
                    ? {
                        ...d,
                        status: 'tersedia',
                        currentOrderId: undefined,
                        totalTripsCompleted: status === 'selesai' ? d.totalTripsCompleted + 1 : d.totalTripsCompleted
                      }
                    : d
                )
              );
            }
          }

          triggerPush(
            'Status Order Diperbarui',
            `Pesanan ${ord.orderNumber} kini berstatus: ${status.replace('_', ' ').toUpperCase()}`,
            'order',
            ord.id
          );
          return updated;
        }
        return ord;
      })
    );
  };

  const assignFleetAndDriver = (orderId: string, fleetId: string, driverId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const fleetUnit = fleet.find((f) => f.id === fleetId);
    const driver = drivers.find((d) => d.id === driverId);

    // Release old fleet & driver if existed
    if (targetOrder.assignedFleetId && targetOrder.assignedFleetId !== fleetId) {
      setFleet((prev) =>
        prev.map((f) =>
          f.id === targetOrder.assignedFleetId ? { ...f, status: 'tersedia', currentOrderId: undefined, assignedTour: undefined } : f
        )
      );
    }
    if (targetOrder.assignedDriverId && targetOrder.assignedDriverId !== driverId) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === targetOrder.assignedDriverId ? { ...d, status: 'tersedia', currentOrderId: undefined } : d))
      );
    }

    // Assign new
    if (fleetUnit) {
      const updatedF = {
        ...fleetUnit,
        status: 'ditugaskan' as const,
        currentOrderId: targetOrder.orderNumber,
        assignedTour: `${targetOrder.packageTitle} (${targetOrder.customer.fullName})`,
        driverId: driver?.id,
        driverName: driver?.name
      };
      setFleet((prev) =>
        prev.map((f) => (f.id === fleetId ? updatedF : f))
      );
      cloudSyncDoc('fleet', fleetId, updatedF).catch(() => {});
    }

    if (driver) {
      const updatedD = {
        ...driver,
        status: 'ditugaskan' as const,
        currentOrderId: targetOrder.orderNumber
      };
      setDrivers((prev) =>
        prev.map((d) => (d.id === driverId ? updatedD : d))
      );
      cloudSyncDoc('drivers', driverId, updatedD).catch(() => {});
    }

    const updatedOrder: BookingOrder = {
      ...targetOrder,
      assignedFleetId: fleetUnit?.id,
      assignedFleetName: fleetUnit ? `${fleetUnit.name} (${fleetUnit.plateNumber})` : targetOrder.assignedFleetName,
      assignedDriverId: driver?.id,
      assignedDriverName: driver?.name,
      assignedDriverPhone: driver?.phone,
      orderStatus: targetOrder.orderStatus === 'baru' ? 'armada_ditugaskan' : targetOrder.orderStatus
    };

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? updatedOrder : ord))
    );
    cloudSyncDoc('orders', updatedOrder.id, updatedOrder).catch(() => {});

    triggerPush(
      'Armada & Driver Ditetapkan',
      `Armada ${fleetUnit?.name} dan Driver ${driver?.name} berhasil ditugaskan ke order ${targetOrder.orderNumber}.`,
      'fleet',
      orderId
    );
  };

  const deleteOrder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    // Release assigned fleet and driver
    if (target.assignedFleetId) {
      setFleet((prev) =>
        prev.map((f) =>
          f.id === target.assignedFleetId
            ? { ...f, status: 'tersedia', currentOrderId: undefined, assignedTour: undefined }
            : f
        )
      );
    }
    if (target.assignedDriverId) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === target.assignedDriverId ? { ...d, status: 'tersedia', currentOrderId: undefined } : d))
      );
    }

    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrderForDetail?.id === orderId) {
      setSelectedOrderForDetail(null);
    }
    // Cloud Firebase Integration: Delete order
    cloudDeleteDoc('orders', orderId).catch(() => {});

    triggerPush('Data Pesanan Dihapus', `Pesanan ${target.orderNumber} telah dihapus permanen oleh admin.`, 'system');
  };

  const deleteFleet = (fleetId: string) => {
    setFleet((prev) => prev.filter((f) => f.id !== fleetId));
    cloudDeleteDoc('fleet', fleetId).catch(() => {});
    triggerPush('Inventaris Armada Dihapus', 'Unit armada berhasil dihapus dari inventaris.', 'fleet');
  };

  const deleteDriver = (driverId: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== driverId));
    cloudDeleteDoc('drivers', driverId).catch(() => {});
    triggerPush('Data Driver Dihapus', 'Data driver berhasil dihapus dari sistem.', 'system');
  };

  const addFleet = (unitData: Omit<FleetUnit, 'id'>) => {
    const newUnit: FleetUnit = {
      ...unitData,
      id: `flt-${Date.now()}`
    };
    setFleet((prev) => [newUnit, ...prev]);
    cloudSyncDoc('fleet', newUnit.id, newUnit).catch(() => {});
    triggerPush('Armada Baru Ditambahkan', `Unit ${newUnit.name} (${newUnit.plateNumber}) telah masuk sistem.`, 'fleet');
  };

  const addDriver = (driverData: Omit<DriverCrew, 'id'>) => {
    const newDriver: DriverCrew = {
      ...driverData,
      id: `drv-${Date.now()}`
    };
    setDrivers((prev) => [newDriver, ...prev]);
    cloudSyncDoc('drivers', newDriver.id, newDriver).catch(() => {});
    triggerPush('Driver Baru Terdaftar', `Driver ${newDriver.name} telah didaftarkan.`, 'system');
  };

  const updateFleet = (unit: FleetUnit) => {
    setFleet((prev) => prev.map((f) => (f.id === unit.id ? unit : f)));
    cloudSyncDoc('fleet', unit.id, unit).catch(() => {});
    triggerPush('Data Armada Diperbarui', `Informasi armada ${unit.name} (${unit.plateNumber}) berhasil diperbarui.`, 'fleet');
  };

  const updateDriver = (driver: DriverCrew) => {
    setDrivers((prev) => prev.map((d) => (d.id === driver.id ? driver : d)));
    cloudSyncDoc('drivers', driver.id, driver).catch(() => {});
    triggerPush('Data Driver Diperbarui', `Informasi driver ${driver.name} berhasil diperbarui.`, 'system');
  };

  const addPackage = (pkgData: Omit<TourPackage, 'id'>) => {
    const newPkg: TourPackage = {
      ...pkgData,
      id: `pkg-${Date.now()}`
    };
    setPackages((prev) => [newPkg, ...prev]);
    cloudSyncDoc('packages', newPkg.id, newPkg).catch(() => {});
    triggerPush('Paket Wisata Ditambahkan', `Paket wisata baru "${newPkg.title}" (${newPkg.destinationLabel}) berhasil ditambahkan oleh Super Admin.`, 'system');
    return newPkg;
  };

  const updatePackage = (pkg: TourPackage) => {
    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? pkg : p)));
    cloudSyncDoc('packages', pkg.id, pkg).catch(() => {});
    triggerPush('Paket Wisata Diperbarui', `Harga & tujuan wisata paket "${pkg.title}" berhasil diperbarui oleh Super Admin.`, 'system');
  };

  const deletePackage = (pkgId: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== pkgId));
    cloudDeleteDoc('packages', pkgId).catch(() => {});
    triggerPush('Paket Wisata Dihapus', 'Paket wisata telah dihapus permanen oleh Super Admin.', 'system');
  };

  const addHotel = (hotelData: Omit<HotelPartner, 'id'>) => {
    const newHotel: HotelPartner = {
      ...hotelData,
      id: `htl-${Date.now()}`
    };
    setHotels((prev) => [newHotel, ...prev]);
    cloudSyncDoc('hotels', newHotel.id, newHotel).catch(() => {});
    triggerPush('Hotel Mitra Ditambahkan', `Hotel ${newHotel.name} (${newHotel.cityLabel}) dengan kuota ${newHotel.quotaAvailable} kamar berhasil ditambahkan.`, 'system');
  };

  const updateHotel = (hotel: HotelPartner) => {
    setHotels((prev) => prev.map((h) => (h.id === hotel.id ? hotel : h)));
    cloudSyncDoc('hotels', hotel.id, hotel).catch(() => {});
    triggerPush('Data Hotel Diperbarui', `Informasi hotel ${hotel.name} (${hotel.cityLabel}) berhasil diperbarui.`, 'system');
  };

  const deleteHotel = (hotelId: string) => {
    const target = hotels.find((h) => h.id === hotelId);
    setHotels((prev) => prev.filter((h) => h.id !== hotelId));
    cloudDeleteDoc('hotels', hotelId).catch(() => {});
    triggerPush('Hotel Mitra Dihapus', `Data hotel ${target?.name || ''} telah dihapus dari sistem.`, 'system');
  };

  const addCustomDestination = async (dest: Omit<DestinationOption, 'id'>): Promise<DestinationOption> => {
    const newId = `${dest.city}-${Date.now()}`;
    const created: DestinationOption = {
      ...dest,
      id: newId,
      isCustomAdded: true
    };
    setDestinations((prev) => [created, ...prev]);
    await cloudSyncDoc('trip_destinations', newId, created);
    triggerPush('Destinasi Baru Ditambahkan', `Destinasi ${created.name} (${created.city.toUpperCase()}) berhasil disinkronkan ke cloud.`, 'system');
    return created;
  };

  const addVendorPayment = (paymentData: Omit<VendorPayment, 'id' | 'paymentNumber' | 'createdAt'>) => {
    const timestamp = Date.now();
    const prefix = paymentData.category === 'driver' ? 'PAY-DRV' :
      paymentData.category === 'hotel' ? 'PAY-HTL' :
      paymentData.category === 'vehicle_vendor' ? 'PAY-VEH' : 'PAY-TKT';
    const cleanNum = `${prefix}-${new Date().toISOString().substring(0, 7).replace('-', '')}-${String(vendorPayments.length + 1).padStart(3, '0')}`;

    const newPayment: VendorPayment = {
      ...paymentData,
      id: `disb-${timestamp}`,
      paymentNumber: cleanNum,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setVendorPayments((prev) => [newPayment, ...prev]);
    cloudSyncDoc('vendorPayments', newPayment.id, newPayment).catch(() => {});
    triggerPush(
      'Pembayaran Vendor Berhasil Dicatat',
      `${newPayment.categoryLabel} sebesar Rp ${newPayment.amount.toLocaleString('id-ID')} ke ${newPayment.vendorName} berhasil dicatat.`,
      'payment'
    );
  };

  const updateVendorPayment = (payment: VendorPayment) => {
    setVendorPayments((prev) => prev.map((p) => (p.id === payment.id ? payment : p)));
    cloudSyncDoc('vendorPayments', payment.id, payment).catch(() => {});
    triggerPush(
      'Pembayaran Vendor Diperbarui',
      `Data pembayaran ${payment.paymentNumber} (${payment.vendorName}) berhasil diperbarui.`,
      'payment'
    );
  };

  const deleteVendorPayment = (paymentId: string) => {
    const target = vendorPayments.find((p) => p.id === paymentId);
    setVendorPayments((prev) => prev.filter((p) => p.id !== paymentId));
    cloudDeleteDoc('vendorPayments', paymentId).catch(() => {});
    triggerPush(
      'Pembayaran Vendor Dihapus',
      `Data pembayaran ${target?.paymentNumber || ''} telah dihapus dari sistem.`,
      'system'
    );
  };

  const updateVendorPaymentStatus = (paymentId: string, status: 'selesai' | 'menunggu' | 'proses') => {
    setVendorPayments((prev) =>
      prev.map((p) => {
        if (p.id === paymentId) {
          const updated = {
            ...p,
            status,
            approvedBy: status === 'selesai' ? (staffUser?.name || 'Super Admin (Benisius)') : p.approvedBy
          };
          cloudSyncDoc('vendorPayments', p.id, updated).catch(() => {});
          return updated;
        }
        return p;
      })
    );
    triggerPush(
      'Status Pembayaran Diperbarui',
      `Status pembayaran vendor #${paymentId} diperbarui menjadi: ${status.toUpperCase()}.`,
      'payment'
    );
  };

  const sendChatMessage = (text: string, sender: 'customer' | 'cs_admin' = 'customer', packageContext?: string) => {
    if (!text.trim()) return;

    const timeStr = `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} WIB`;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      senderName: sender === 'customer' ? 'Calon Wisatawan' : `${currentUser.name} (CS PERGIDIANTAR)`,
      text,
      timestamp: timeStr,
      isRead: sender === 'cs_admin',
      packageContext
    };

    setChats((prev) => [...prev, newMsg]);
    cloudSyncDoc('chats', newMsg.id, newMsg).catch(() => {});

    // If sent by customer, simulate CS auto acknowledgment or alert
    if (sender === 'customer') {
      triggerPush('Pesan Baru dari Pelanggan', `Pertanyaan baru: "${text.substring(0, 45)}..."`, 'chat');
      // Auto reply simulation after 2 seconds if first time
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'cs_admin',
          senderName: 'Siti Sarah (CS Pergidiantar)',
          text: 'Terima kasih telah menghubungi PERGIDIANTAR! Tim travel specialist kami sedang membaca pesan Anda. Kami siap membantu konsultasi rute, pilihan armada bus/HiAce, dan penawaran terbaik.',
          timestamp: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} WIB`,
          isRead: false
        };
        setChats((prev) => [...prev, autoReply]);
        cloudSyncDoc('chats', autoReply.id, autoReply).catch(() => {});
      }, 1800);
    }
  };

  const markChatAsRead = (id: string) => {
    setChats((prev) => prev.map((c) => {
      if (c.id === id) {
        const updated = { ...c, isRead: true };
        cloudSyncDoc('chats', id, updated).catch(() => {});
        return updated;
      }
      return c;
    }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const resetToDemoData = () => {
    setOrders(INITIAL_ORDERS);
    setFleet(INITIAL_FLEET);
    setDrivers(INITIAL_DRIVERS);
    setChats(INITIAL_CHATS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
    triggerPush('Sistem Direset', 'Data sistem telah dikembalikan ke kondisi demo awal.', 'system');
  };

  const getMonthlySummary = (month: number, year: number): MonthlyReportSummary => {
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const filtered = orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getMonth() + 1 === month && orderDate.getFullYear() === year;
    });

    const completed = filtered.filter((o) => o.orderStatus === 'selesai' || o.paymentStatus === 'paid');
    const totalRev = filtered
      .filter((o) => o.paymentStatus === 'paid' || o.paymentStatus === 'verified')
      .reduce((acc, curr) => acc + curr.grandTotal, 0);

    const totalPax = filtered.reduce((acc, curr) => acc + curr.paxCount, 0);
    const allInCount = filtered.filter((o) => o.tier === 'all_in').length;
    const hematCount = filtered.filter((o) => o.tier === 'paket_hemat').length;

    return {
      month,
      year,
      monthName: monthNames[month - 1],
      totalRevenue: totalRev,
      totalOrders: filtered.length,
      completedOrders: completed.length,
      totalPax,
      averageOrderValue: filtered.length > 0 ? Math.round(totalRev / filtered.length) : 0,
      allInOrdersCount: allInCount,
      hematOrdersCount: hematCount
    };
  };

  // Admin User Registry functions
  const adminAddUser = async (data: { name: string; email: string; role: UserRole; phone: string; password?: string }) => {
    if (data.role === 'customer') {
      adminAddCustomer({
        displayName: data.name,
        email: data.email,
        phoneNumber: data.phone,
        password: data.password
      });
      setRegisteredCustomers(getAllRegisteredCustomers());
    } else {
      const roleLabels: Record<UserRole, string> = {
        super_admin: 'Super Admin',
        ops_admin: 'Admin Operasional',
        finance: 'Finance & Keuangan',
        customer_service: 'Customer Service (CS)',
        customer: 'Pelanggan'
      };
      const deptLabels: Record<UserRole, string> = {
        super_admin: 'Direksi & Operasional Utama',
        ops_admin: 'Manajemen Armada & Driver',
        finance: 'Pembukuan & Verifikasi Pembayaran',
        customer_service: 'Layanan Pelanggan & Konsultasi',
        customer: 'Portal Wisatawan Publik'
      };
      const newStaff: UserProfile = {
        id: `usr-staff-${Date.now()}`,
        name: data.name,
        email: data.email.toLowerCase(),
        role: data.role,
        roleLabel: roleLabels[data.role],
        department: deptLabels[data.role],
        phone: data.phone,
        password: data.password || 'admin',
        status: 'active',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setUsers(prev => [...prev, newStaff]);
      await cloudSyncDoc('users', newStaff.id, newStaff);
    }
    triggerPush('User Baru Didaftarkan', `Akun ${data.name} (${data.email}) berhasil didaftarkan ke sistem.`, 'system');
  };

  const adminUpdateUser = async (id: string, updates: Partial<UserProfile> & { displayName?: string; phoneNumber?: string }) => {
    const isCust = registeredCustomers.some(c => c.uid === id);
    if (isCust) {
      adminUpdateCustomer(id, {
        displayName: updates.displayName || updates.name,
        email: updates.email,
        phoneNumber: updates.phoneNumber || updates.phone,
        password: updates.password,
        status: updates.status
      });
      setRegisteredCustomers(getAllRegisteredCustomers());
    } else {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
      const targetUser = users.find(u => u.id === id);
      if (targetUser) {
        await cloudSyncDoc('users', id, { ...targetUser, ...updates });
      }
    }
  };

  const adminDeleteUser = async (id: string) => {
    const isCust = registeredCustomers.some(c => c.uid === id);
    if (isCust) {
      adminDeleteCustomer(id);
      setRegisteredCustomers(getAllRegisteredCustomers());
    } else {
      const target = users.find(u => u.id === id);
      if (target?.email.toLowerCase() === 'pergi.diantar@gmail.com') {
        throw new Error('Akun Super Admin Utama (Benisius Rahmat Basuki) tidak dapat dihapus.');
      }
      setUsers(prev => prev.filter(u => u.id !== id));
      await cloudDeleteDoc('users', id);
    }
    triggerPush('User Dihapus', 'Data user telah dihapus secara permanen dari sistem.', 'system');
  };

  const adminToggleUserStatus = async (id: string) => {
    const isCust = registeredCustomers.some(c => c.uid === id);
    if (isCust) {
      const target = registeredCustomers.find(c => c.uid === id);
      const newStatus = target?.status === 'inactive' ? 'active' : 'inactive';
      adminUpdateCustomer(id, { status: newStatus });
      setRegisteredCustomers(getAllRegisteredCustomers());
    } else {
      const targetUser = users.find(u => u.id === id);
      const newStatus = targetUser?.status === 'inactive' ? 'active' : 'inactive';
      setUsers(prev => prev.map(u => {
        if (u.id === id) {
          return { ...u, status: newStatus };
        }
        return u;
      }));
      if (targetUser) {
        await cloudSyncDoc('users', id, { ...targetUser, status: newStatus });
      }
    }
  };

  // Admin Purge Center functions (Data permanently deleted, never reappears)
  const purgeOrders = (onlyDummy = false) => {
    if (onlyDummy) {
      const dummyIds = orders.filter(o => 
        o.id.startsWith('ord-0') || 
        o.orderNumber.includes('0089') || 
        o.orderNumber.includes('0090') || 
        o.orderNumber.includes('0091') || 
        o.orderNumber.includes('0092')
      ).map(o => o.id);
      cloudPurgeCollection('orders', dummyIds).catch(() => {});
      const realOrders = orders.filter(o => !dummyIds.includes(o.id));
      setOrders(realOrders);
      localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(realOrders));
      if (realOrders.length === 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_ORDERS, 'true');
      }
    } else {
      cloudPurgeCollection('orders', orders.map(o => o.id)).catch(() => {});
      setOrders([]);
      localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, '[]');
      localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_ORDERS, 'true');
    }
    triggerPush('Purge Orders', 'Pembersihan data pesanan berhasil dilakukan secara permanen.', 'system');
  };

  const purgeFleet = () => {
    cloudPurgeCollection('fleet', fleet.map(f => f.id)).catch(() => {});
    setFleet([]);
    localStorage.setItem(LOCAL_STORAGE_KEY_FLEET, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_FLEET, 'true');
    triggerPush('Purge Fleet', 'Seluruh unit armada kendaraan telah dihapus secara permanen.', 'system');
  };

  const purgeDrivers = () => {
    cloudPurgeCollection('drivers', drivers.map(d => d.id)).catch(() => {});
    setDrivers([]);
    localStorage.setItem(LOCAL_STORAGE_KEY_DRIVERS, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_DRIVERS, 'true');
    triggerPush('Purge Drivers', 'Seluruh data supir dan kru telah dihapus secara permanen.', 'system');
  };

  const purgeChats = () => {
    cloudPurgeCollection('chats', chats.map(c => c.id)).catch(() => {});
    setChats([]);
    localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_CHATS, 'true');
    triggerPush('Purge Chats', 'Riwayat obrolan tamu telah dibersihkan secara permanen.', 'system');
  };

  const purgeNotifications = () => {
    setNotifications([]);
    localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_NOTIFS, 'true');
  };

  const purgePackages = () => {
    cloudPurgeCollection('packages', packages.map(p => p.id)).catch(() => {});
    setPackages([]);
    localStorage.setItem(LOCAL_STORAGE_KEY_PACKAGES, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_PACKAGES, 'true');
    triggerPush('Purge Packages', 'Seluruh paket wisata telah dihapus secara permanen.', 'system');
  };

  const purgeHotels = () => {
    cloudPurgeCollection('hotels', hotels.map(h => h.id)).catch(() => {});
    setHotels([]);
    localStorage.setItem(LOCAL_STORAGE_KEY_HOTELS, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_HOTELS, 'true');
    triggerPush('Purge Hotel Mitra', 'Seluruh data hotel mitra dan kuota kamar telah dihapus secara permanen.', 'system');
  };

  const purgeVendorPayments = () => {
    cloudPurgeCollection('vendorPayments', vendorPayments.map(p => p.id)).catch(() => {});
    setVendorPayments([]);
    localStorage.setItem(LOCAL_STORAGE_KEY_VENDOR_PAYMENTS, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_VENDOR_PAYMENTS, 'true');
    triggerPush('Purge Vendor Payments', 'Seluruh data pembayaran vendor telah dihapus permanen.', 'system');
  };

  const purgeCustomers = () => {
    cloudPurgeCollection('customers', registeredCustomers.map(c => c.uid)).catch(() => {});
    adminPurgeAllCustomers();
    setRegisteredCustomers([]);
    triggerPush('Purge Pelanggan', 'Seluruh data akun pelanggan telah dihapus secara permanen.', 'system');
  };

  const purgeAllDataFactoryReset = () => {
    setOrders([]);
    setFleet([]);
    setDrivers([]);
    setChats([]);
    setNotifications([]);
    setPackages([]);
    setHotels([]);
    setVendorPayments([]);
    setRegisteredCustomers([]);

    // Keep only Super Admin Benisius
    const superAdmin = users.find(u => u.role === 'super_admin') || INITIAL_USERS[0];
    setUsers([superAdmin]);
    localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify([superAdmin]));

    // Set all purge permanence flags
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_ORDERS, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEY_FLEET, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_FLEET, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEY_DRIVERS, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_DRIVERS, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_CHATS, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_NOTIFS, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEY_PACKAGES, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_PACKAGES, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEY_HOTELS, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_HOTELS, 'true');
    localStorage.setItem(LOCAL_STORAGE_KEY_VENDOR_PAYMENTS, '[]');
    localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_VENDOR_PAYMENTS, 'true');

    adminPurgeAllCustomers();
    triggerPush('Factory Reset', 'RESET PABRIK TOTAL BERHASIL. Seluruh data portal telah dikosongkan permanen.', 'system');
  };

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        packages,
        orders,
        fleet,
        drivers,
        hotels,
        vendorPayments,
        selectedInvoiceForModal,
        setSelectedInvoiceForModal,
        users,
        currentUser,
        currentRole,
        staffUser,
        isStaffLoggedIn,
        customerUser,
        isCustomerLoggedIn,
        isLoggedIn,
        notifications,
        unreadNotifCount,
        chats,
        emailOutbox,
        adminEmail: ADMIN_PRIMARY_EMAIL,
        pushPermission,
        activeTab,
        setActiveTab,
        setCurrentRole,
        requestPushPermission,
        createBooking,
        updatePaymentStatus,
        updateOrderStatus,
        assignFleetAndDriver,
        deleteOrder,
        deleteFleet,
        deleteDriver,
        addFleet,
        addDriver,
        updateFleet,
        updateDriver,
        addPackage,
        updatePackage,
        deletePackage,
        addHotel,
        updateHotel,
        deleteHotel,
        destinations,
        bonusDestinations: BONUS_DESTINATIONS,
        getMaxDestinationsForDuration,
        addCustomDestination,
        addVendorPayment,
        updateVendorPayment,
        deleteVendorPayment,
        updateVendorPaymentStatus,
        purgeVendorPayments,
        sendChatMessage,
        markChatAsRead,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToDemoData,
        getMonthlySummary,
        selectedOrderForDetail,
        setSelectedOrderForDetail,
        selectedPackageForBooking,
        setSelectedPackageForBooking,
        activeOrderForPayment,
        setActiveOrderForPayment,
        isChatOpen,
        setIsChatOpen,
        authModalOpen,
        authModalMode,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
        handleCustomerLogin,
        handleCustomerRegister,
        handleCustomerLogout,
        handleStaffLogin,
        handleStaffLogout,
        updateUserProfile,
        isEditProfileOpen,
        openEditProfileModal,
        closeEditProfileModal,
        pendingBooking,
        setPendingBooking,
        isNotifOpen,
        setIsNotifOpen,
        openNotifications,
        closeNotifications,
        registeredCustomers,
        adminAddUser,
        adminUpdateUser,
        adminDeleteUser,
        adminToggleUserStatus,
        purgeOrders,
        purgeFleet,
        purgeDrivers,
        purgeChats,
        purgeNotifications,
        purgePackages,
        purgeHotels,
        purgeCustomers,
        purgeAllDataFactoryReset,
        autoLogoutNotice,
        clearAutoLogoutNotice,
        visitorStats,
        securityAuditLogs,
        trackVisit
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
