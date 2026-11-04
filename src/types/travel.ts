export type PackageCategory = 
  | 'single_trip' 
  | 'family_trip' 
  | 'family_gathering' 
  | 'company_gathering' 
  | 'study_tour';

export type DestinationRegion = 'jogja' | 'malang' | 'bali';

export type PackageTier = 'all_in' | 'paket_hemat';

export interface TourPackage {
  id: string;
  title: string;
  category: PackageCategory;
  categoryLabel: string;
  destinations: DestinationRegion[];
  destinationLabel: string;
  durationDays: number;
  durationNights: number;
  heroImage: string;
  priceHematPerPax: number;
  priceAllInPerPax: number;
  minPax: number;
  maxPax: number;
  highlightPoints: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
  }[];
  included: {
    transport: string;
    accommodation: string;
    meals: string;
    tickets: string[];
    additional: string[];
  };
  recommendedVehicle: string;
  badge?: string;
}

export type PaymentMethod = 'qris' | 'va_bca' | 'va_mandiri' | 'va_bri' | 'va_bni' | 'bank_transfer' | 'credit_card';

export type PaymentStatus = 'pending' | 'paid' | 'verified' | 'failed' | 'refunded';

export type OrderStatus = 
  | 'baru' 
  | 'dikonfirmasi' 
  | 'armada_ditugaskan' 
  | 'sedang_berjalan' 
  | 'selesai' 
  | 'dibatalkan';

export interface CustomerData {
  fullName: string;
  whatsapp: string;
  email: string;
  companyOrFamilyName?: string;
  pickupAddress: string;
  city: string;
  specialRequests?: string;
}

export interface BookingOrder {
  id: string;
  orderNumber: string;
  packageId: string;
  packageTitle: string;
  category: PackageCategory;
  categoryLabel: string;
  destination: DestinationRegion;
  destinationLabel: string;
  tier: PackageTier;
  tourStartDate: string;
  tourEndDate: string;
  paxCount: number;
  customer: CustomerData;
  pricePerPax: number;
  subtotal: number;
  addOnsTotal: number;
  addOnsList: string[];
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  paidAt?: string;
  orderStatus: OrderStatus;
  selectedVehicle?: string;
  vehicleRateAdjustment?: number;
  assignedFleetId?: string;
  assignedFleetName?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  hotelAllotment?: string;
  createdAt: string;
  notes?: string;
}

export type FleetType = 'avanza' | 'innova' | 'hiace_premio' | 'hiace_commuter' | 'elf_long' | 'medium_bus' | 'big_bus';

export type FleetStatus = 'tersedia' | 'ditugaskan' | 'perjalanan' | 'maintenance';

export interface FleetUnit {
  id: string;
  plateNumber: string;
  name: string;
  type: FleetType;
  typeLabel: string;
  capacitySeats: number;
  facilities: string[];
  status: FleetStatus;
  currentOrderId?: string;
  assignedTour?: string;
  driverId?: string;
  driverName?: string;
  lastServiceDate: string;
  nextServiceKm: number;
  currentKm: number;
  baseCity: string;
  imageUrl?: string;
}

export interface DriverCrew {
  id: string;
  name: string;
  phone: string;
  licenseType: string;
  status: 'tersedia' | 'ditugaskan' | 'istirahat';
  totalTripsCompleted: number;
  rating: number;
  currentOrderId?: string;
}

export interface HotelPartner {
  id: string;
  name: string;
  city: DestinationRegion;
  cityLabel: string;
  starRating: number;
  roomType: string;
  quotaAvailable: number;
  pricePerNight: number;
}

export type UserRole = 'super_admin' | 'ops_admin' | 'finance' | 'customer_service' | 'customer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  department: string;
  phone?: string;
  avatarUrl?: string;
  password?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'cs_admin' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  packageContext?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'order' | 'payment' | 'fleet' | 'chat' | 'system';
  isRead: boolean;
  orderId?: string;
}

export interface MonthlyReportSummary {
  month: number;
  year: number;
  monthName: string;
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  totalPax: number;
  averageOrderValue: number;
  allInOrdersCount: number;
  hematOrdersCount: number;
}
