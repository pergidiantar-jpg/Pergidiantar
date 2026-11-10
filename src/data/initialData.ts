import { 
  TourPackage, 
  FleetUnit, 
  DriverCrew, 
  HotelPartner, 
  BookingOrder, 
  UserProfile, 
  ChatMessage, 
  NotificationItem, 
  VendorPayment 
} from '../types/travel';

/**
 * Data Master Inisial PERGIDIANTAR (Siap Produksi & Publikasi)
 * Seluruh data paket, armada, driver, hotel, dan pesanan dimulai dari kondisi bersih (clean state)
 * tanpa data contoh/uji coba, dan dikelola langsung oleh Super Admin melalui Portal Console.
 */

export const INITIAL_PACKAGES: TourPackage[] = [];

export const INITIAL_FLEET: FleetUnit[] = [];

export const INITIAL_DRIVERS: DriverCrew[] = [];

export const INITIAL_HOTELS: HotelPartner[] = [];

export const INITIAL_ORDERS: BookingOrder[] = [];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-01',
    name: 'Benisius Rahmat Basuki',
    email: 'pergi.diantar@gmail.com',
    role: 'super_admin',
    roleLabel: 'Super Admin',
    department: 'Direksi & Operasional Utama',
    phone: '087716443331',
    password: 'admin'
  }
];

export const INITIAL_CHATS: ChatMessage[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_VENDOR_PAYMENTS: VendorPayment[] = [];
