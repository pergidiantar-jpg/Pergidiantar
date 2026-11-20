export type SchoolUserRole = 'customer' | 'driver' | 'super_admin';

export interface SchoolUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: SchoolUserRole;
  createdAt: string;
}

export interface SchoolDriver {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  vehicleModel: string; // Avanza, Ertiga, HiAce, Motor, etc.
  plateNumber: string;
  ktpNumber: string;
  ktpImage: string;
  selfieImage: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  rating: number;
  totalTrips: number;
  availableSlots: number;
  maxSlots: number;
  baseFare: number; // Max 10000 (default 10000 for 3km)
  currentLat: number;
  currentLng: number;
  dailyRevenue: number;
  feeOwedToAdmin: number; // 8% of transactions
  feeStatus: 'paid' | 'unpaid' | 'reminded';
  lastPaymentDate?: string;
  createdAt: string;
}

export interface SchoolOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  studentName: string;
  schoolName: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  driverId: string;
  driverName: string;
  driverVehicle: string;
  distanceKm: number;
  baseFare: number;
  totalFare: number;
  appFee8Percent: number;
  driverEarnings: number;
  paymentStatus: 'pending' | 'paid_dana';
  tripStatus: 'searching' | 'accepted' | 'heading_pickup' | 'on_trip' | 'arrived_school' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface SchoolFeePayment {
  id: string;
  driverId: string;
  driverName: string;
  amount: number;
  danaAccount: string; // '087716443331'
  date: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  proofNote: string;
}
