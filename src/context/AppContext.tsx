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
  MonthlyReportSummary
} from '../types/travel';
import {
  INITIAL_PACKAGES,
  INITIAL_FLEET,
  INITIAL_DRIVERS,
  INITIAL_HOTELS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  INITIAL_CHATS,
  INITIAL_NOTIFICATIONS
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
  clearStoredCustomer
} from '../services/firebaseAuthService';

interface AppContextType {
  packages: TourPackage[];
  orders: BookingOrder[];
  fleet: FleetUnit[];
  drivers: DriverCrew[];
  hotels: HotelPartner[];
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
  updatePackage: (pkg: TourPackage) => void;
  deletePackage: (pkgId: string) => void;
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<TourPackage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PACKAGES);
      return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
    } catch {
      return INITIAL_PACKAGES;
    }
  });

  const [hotels] = useState<HotelPartner[]>(INITIAL_HOTELS);

  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [orders, setOrders] = useState<BookingOrder[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [fleet, setFleet] = useState<FleetUnit[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_FLEET);
      return saved ? JSON.parse(saved) : INITIAL_FLEET;
    } catch {
      return INITIAL_FLEET;
    }
  });

  const [drivers, setDrivers] = useState<DriverCrew[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DRIVERS);
      return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
    } catch {
      return INITIAL_DRIVERS;
    }
  });

  const [chats, setChats] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CHATS);
      return saved ? JSON.parse(saved) : INITIAL_CHATS;
    } catch {
      return INITIAL_CHATS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [emailOutbox, setEmailOutbox] = useState<EmailDispatchRecord[]>(() => {
    return getStoredEmails();
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
    } catch {
      return false;
    }
  };

  const handleCustomerRegister = async (name: string, email: string, pass: string, phone: string): Promise<boolean> => {
    try {
      const user = await registerCustomer(name, email, pass, phone);
      setStaffUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY_STAFF_AUTH);
      setCustomerUser(user);
      setCurrentRoleState('customer');
      setActiveTab('catalog');
      closeAuthModal();
      triggerPush('Pendaftaran Berhasil', `Akun Anda telah terdaftar di cloud server Firebase. Selamat datang, ${user.displayName}!`, 'system');
      return true;
    } catch {
      return false;
    }
  };

  const handleCustomerLogout = async (): Promise<void> => {
    await logoutCustomer();
    setCustomerUser(null);
    setCurrentRoleState('customer');
    setActiveTab('catalog');
    triggerPush('Logout Berhasil', 'Anda telah keluar dari akun pelanggan.', 'system');
  };

  const handleStaffLogin = async (email: string, password?: string): Promise<boolean> => {
    try {
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        return false;
      }
      if (found.password && password && found.password !== password) {
        return false;
      }
      // Logout customer session
      setCustomerUser(null);
      clearStoredCustomer();

      setStaffUser(found);
      localStorage.setItem(LOCAL_STORAGE_KEY_STAFF_AUTH, JSON.stringify(found));
      setCurrentRoleState(found.role);
      setActiveTab('admin-orders');
      closeAuthModal();
      triggerPush('Login Staf Berhasil', `Selamat datang, ${found.name} (${found.roleLabel})!`, 'system');
      return true;
    } catch {
      return false;
    }
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

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PACKAGES, JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_FLEET, JSON.stringify(fleet));
  }, [fleet]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_DRIVERS, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CHATS, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

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

      // Update driver state
      if (allocatedDriverId) {
        setDrivers((prev) =>
          prev.map((d) =>
            d.id === allocatedDriverId
              ? { ...d, status: 'ditugaskan', currentOrderId: createdOrder.orderNumber }
              : d
          )
        );
      }
    }

    setOrders((prev) => [createdOrder, ...prev]);

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
      setFleet((prev) =>
        prev.map((f) =>
          f.id === fleetId
            ? {
                ...f,
                status: 'ditugaskan',
                currentOrderId: targetOrder.orderNumber,
                assignedTour: `${targetOrder.packageTitle} (${targetOrder.customer.fullName})`,
                driverId: driver?.id,
                driverName: driver?.name
              }
            : f
        )
      );
    }

    if (driver) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === driverId ? { ...d, status: 'ditugaskan', currentOrderId: targetOrder.orderNumber } : d
        )
      );
    }

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            assignedFleetId: fleetUnit?.id,
            assignedFleetName: fleetUnit ? `${fleetUnit.name} (${fleetUnit.plateNumber})` : ord.assignedFleetName,
            assignedDriverId: driver?.id,
            assignedDriverName: driver?.name,
            assignedDriverPhone: driver?.phone,
            orderStatus: ord.orderStatus === 'baru' ? 'armada_ditugaskan' : ord.orderStatus
          };
        }
        return ord;
      })
    );

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

    triggerPush('Data Pesanan Dihapus', `Pesanan ${target.orderNumber} telah dihapus permanen oleh admin.`, 'system');
  };

  const deleteFleet = (fleetId: string) => {
    setFleet((prev) => prev.filter((f) => f.id !== fleetId));
    triggerPush('Inventaris Armada Dihapus', 'Unit armada berhasil dihapus dari inventaris.', 'fleet');
  };

  const deleteDriver = (driverId: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== driverId));
    triggerPush('Data Driver Dihapus', 'Data driver berhasil dihapus dari sistem.', 'system');
  };

  const addFleet = (unitData: Omit<FleetUnit, 'id'>) => {
    const newUnit: FleetUnit = {
      ...unitData,
      id: `flt-${Date.now()}`
    };
    setFleet((prev) => [newUnit, ...prev]);
    triggerPush('Armada Baru Ditambahkan', `Unit ${newUnit.name} (${newUnit.plateNumber}) telah masuk sistem.`, 'fleet');
  };

  const addDriver = (driverData: Omit<DriverCrew, 'id'>) => {
    const newDriver: DriverCrew = {
      ...driverData,
      id: `drv-${Date.now()}`
    };
    setDrivers((prev) => [newDriver, ...prev]);
    triggerPush('Driver Baru Terdaftar', `Driver ${newDriver.name} telah didaftarkan.`, 'system');
  };

  const updateFleet = (unit: FleetUnit) => {
    setFleet((prev) => prev.map((f) => (f.id === unit.id ? unit : f)));
    triggerPush('Data Armada Diperbarui', `Informasi armada ${unit.name} (${unit.plateNumber}) berhasil diperbarui.`, 'fleet');
  };

  const updateDriver = (driver: DriverCrew) => {
    setDrivers((prev) => prev.map((d) => (d.id === driver.id ? driver : d)));
    triggerPush('Data Driver Diperbarui', `Informasi driver ${driver.name} berhasil diperbarui.`, 'system');
  };

  const updatePackage = (pkg: TourPackage) => {
    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? pkg : p)));
    triggerPush('Paket Wisata Diperbarui', `Harga & tujuan wisata paket "${pkg.title}" berhasil diperbarui oleh Super Admin.`, 'system');
  };

  const deletePackage = (pkgId: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== pkgId));
    triggerPush('Paket Wisata Dihapus', 'Paket wisata telah dihapus permanen oleh Super Admin.', 'system');
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
      }, 1800);
    }
  };

  const markChatAsRead = (id: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, isRead: true } : c)));
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

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        packages,
        orders,
        fleet,
        drivers,
        hotels,
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
        updatePackage,
        deletePackage,
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
        closeNotifications
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
