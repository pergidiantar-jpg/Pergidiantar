import React, { useState, useEffect } from 'react';
import { 
  SchoolDriver, 
  SchoolOrder, 
  SchoolUser, 
  SchoolFeePayment 
} from '../../types/school';
import { 
  Bus, 
  ShieldCheck, 
  User, 
  MapPin, 
  Clock, 
  CreditCard, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Navigation, 
  Phone, 
  Mail, 
  Camera, 
  FileText, 
  Lock, 
  LogOut, 
  DollarSign, 
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

const ADMIN_DANA_NUMBER = '087716443331';

interface AddressItem {
  name: string;
  lat: number;
  lng: number;
}

const ADDRESS_DB: AddressItem[] = [
  // --- SD / MI SE-DIY ---
  { name: 'SD BOPKRI Gondolayu Yogyakarta', lat: -7.7812, lng: 110.3689 },
  { name: 'SD BOPKRI Klebengan Sleman', lat: -7.7654, lng: 110.3854 },
  { name: 'SDN Model Yogyakarta (Kasihan, Bantul)', lat: -7.8123, lng: 110.3521 },
  { name: 'SDN Percobaan 1 Yogyakarta', lat: -7.7821, lng: 110.3712 },
  { name: 'SDN Unggulan Sleman', lat: -7.7312, lng: 110.3654 },
  { name: 'SDN Condongcatur (Depok, Sleman)', lat: -7.7545, lng: 110.3921 },
  { name: 'SDN Keputran 1 Yogyakarta', lat: -7.8012, lng: 110.3654 },
  { name: 'SDN Jetis 1 Yogyakarta', lat: -7.7845, lng: 110.3678 },
  { name: 'SDN Kotagede 1 Yogyakarta', lat: -7.8321, lng: 110.3912 },
  { name: 'SDN Gamping 1 (Sleman)', lat: -7.8021, lng: 110.3312 },
  { name: 'SDN Banguntapan 1 (Bantul)', lat: -7.8045, lng: 110.4089 },
  { name: 'MIN 1 Yogyakarta', lat: -7.7891, lng: 110.3754 },
  { name: 'SD Muhammadiyah Sapen Yogyakarta', lat: -7.7854, lng: 110.3891 },
  { name: 'SD Kanisius Kotabaru Yogyakarta', lat: -7.7812, lng: 110.3721 },
  { name: 'SDIT LHI Condongcatur Sleman', lat: -7.7512, lng: 110.3981 },

  // --- SMP / MTs SE-DIY ---
  { name: 'SMP Negeri 1 Yogyakarta (Cik Di Tiro)', lat: -7.7812, lng: 110.3754 },
  { name: 'SMP Negeri 2 Yogyakarta', lat: -7.7912, lng: 110.3689 },
  { name: 'SMP Negeri 3 Yogyakarta', lat: -7.7854, lng: 110.3712 },
  { name: 'SMP Negeri 4 Yogyakarta', lat: -7.7989, lng: 110.3621 },
  { name: 'SMP Negeri 5 Yogyakarta', lat: -7.7821, lng: 110.3645 },
  { name: 'SMP Negeri 8 Yogyakarta', lat: -7.7712, lng: 110.3789 },
  { name: 'SMP Negeri 1 Depok (Sleman)', lat: -7.7589, lng: 110.3889 },
  { name: 'SMP Negeri 4 Depok (Sleman)', lat: -7.7612, lng: 110.4054 },
  { name: 'SMP Negeri 1 Gamping (Sleman)', lat: -7.7912, lng: 110.3387 },
  { name: 'SMP Negeri 1 Kasihan (Bantul)', lat: -7.8154, lng: 110.3389 },
  { name: 'SMP Negeri 1 Banguntapan (Bantul)', lat: -7.7989, lng: 110.4154 },
  { name: 'MTs Negeri 1 Yogyakarta', lat: -7.7891, lng: 110.3789 },
  { name: 'SMP Kolese De Britto Yogyakarta', lat: -7.7791, lng: 110.3891 },
  { name: 'SMP Budi Mulia Dua Yogyakarta', lat: -7.7454, lng: 110.4012 },
  { name: 'SMP BOPKRI 1 Yogyakarta', lat: -7.7912, lng: 110.3654 },
  { name: 'SMP BOPKRI 2 Yogyakarta', lat: -7.7854, lng: 110.3789 },
  { name: 'SMP BOPKRI 3 Yogyakarta', lat: -7.7821, lng: 110.3721 },

  // --- SMA / SMK / MA SE-DIY ---
  { name: 'SMA Negeri 1 Yogyakarta (Teladan)', lat: -7.7754, lng: 110.3721 },
  { name: 'SMA Negeri 2 Yogyakarta', lat: -7.7821, lng: 110.3612 },
  { name: 'SMA Negeri 3 Yogyakarta (Padmanaba)', lat: -7.7923, lng: 110.3712 },
  { name: 'SMA Negeri 4 Yogyakarta', lat: -7.8012, lng: 110.3754 },
  { name: 'SMA Negeri 5 Yogyakarta', lat: -7.8123, lng: 110.3689 },
  { name: 'SMA Negeri 6 Yogyakarta (Bopo)', lat: -7.7845, lng: 110.3612 },
  { name: 'SMA Negeri 7 Yogyakarta', lat: -7.7989, lng: 110.3721 },
  { name: 'SMA Negeri 8 Yogyakarta', lat: -7.7723, lng: 110.3921 },
  { name: 'SMA Negeri 1 Depok (Sleman)', lat: -7.7678, lng: 110.3987 },
  { name: 'SMA Negeri 2 Depok (Sleman)', lat: -7.7512, lng: 110.4123 },
  { name: 'SMA Negeri 1 Gamping (Sleman)', lat: -7.7889, lng: 110.3254 },
  { name: 'SMA Negeri 1 Kasihan (Bantul)', lat: -7.8212, lng: 110.3454 },
  { name: 'SMA Negeri 1 Banguntapan (Bantul)', lat: -7.7923, lng: 110.4189 },
  { name: 'SMK Negeri 2 Yogyakarta (Jetis)', lat: -7.7789, lng: 110.3689 },
  { name: 'SMK Negeri 3 Yogyakarta (Hokya)', lat: -7.7854, lng: 110.3754 },
  { name: 'SMK Negeri 1 Depok (Sleman)', lat: -7.7612, lng: 110.3954 },
  { name: 'SMK Muhammadiyah 1 Yogyakarta', lat: -7.7921, lng: 110.3689 },
  { name: 'MAN 1 Yogyakarta', lat: -7.7812, lng: 110.3789 },
  { name: 'MAN 2 Yogyakarta', lat: -7.8212, lng: 110.3712 },
  { name: 'SMA Kolese De Britto Yogyakarta', lat: -7.7791, lng: 110.3891 },
  { name: 'SMA Muhammadiyah 1 Yogyakarta', lat: -7.7954, lng: 110.3689 },
  { name: 'SMA Stella Duce 1 Yogyakarta', lat: -7.7854, lng: 110.3721 },
  { name: 'SMA BOPKRI 1 Yogyakarta', lat: -7.7821, lng: 110.3654 },
  { name: 'SMA BOPKRI 2 Yogyakarta', lat: -7.7891, lng: 110.3789 },

  // --- UNIVERSITAS / KAMPUS UTAMA SE-DIY ---
  { name: 'Universitas Gadjah Mada (UGM Bulaksumur)', lat: -7.7706, lng: 110.3787 },
  { name: 'Universitas Negeri Yogyakarta (UNY Depok)', lat: -7.7761, lng: 110.3912 },
  { name: 'Universitas Islam Indonesia (UII Kaliurang)', lat: -7.6891, lng: 110.4123 },
  { name: 'Universitas Pembangunan Nasional (UPN) Veteran Yogyakarta', lat: -7.7621, lng: 110.4021 },
  { name: 'Universitas Atma Jaya Yogyakarta (UAJY)', lat: -7.7754, lng: 110.4154 },
  { name: 'Universitas Sanata Dharma (USD Mrican)', lat: -7.7789, lng: 110.3889 },
  { name: 'Universitas Muhammadiyah Yogyakarta (UMY Tamantirto)', lat: -7.8134, lng: 110.3212 },
  { name: 'Universitas Ahmad Dahlan (UAD Yogyakarta)', lat: -7.8054, lng: 110.3821 },
  { name: 'Institut Seni Indonesia (ISI) Yogyakarta (Kasihan)', lat: -7.8345, lng: 110.3387 },
  { name: 'Universitas Mercu Buana Yogyakarta (UMBY)', lat: -7.8123, lng: 110.3154 },

  // --- KAWASAN JALAN UTAMA & KECAMATAN DI DIY ---
  { name: 'Condongcatur (Depok, Sleman)', lat: -7.7589, lng: 110.3954 },
  { name: 'Caturtunggal (Depok, Sleman)', lat: -7.7712, lng: 110.3854 },
  { name: 'Maguwoharjo (Depok, Sleman)', lat: -7.7654, lng: 110.4212 },
  { name: 'Jl. Seturan Raya (Depok, Sleman)', lat: -7.7634, lng: 110.4012 },
  { name: 'Jl. Affandi / Gejayan (Depok, Sleman)', lat: -7.7723, lng: 110.3871 },
  { name: 'Jl. Kaliurang KM 5-8 (Depok, Sleman)', lat: -7.7512, lng: 110.3821 },
  { name: 'Kawasan Malioboro (Kota Yogyakarta)', lat: -7.7927, lng: 110.3658 },
  { name: 'Kawasan Tugu / Jetis (Kota Yogyakarta)', lat: -7.7789, lng: 110.3662 },
  { name: 'Kawasan Lempuyangan (Danurejan, Kota Yogyakarta)', lat: -7.7912, lng: 110.3721 },
  { name: 'Kawasan Kotagede (Kota Yogyakarta)', lat: -7.8321, lng: 110.3912 },
  { name: 'Kawasan Kraton Yogyakarta', lat: -7.8054, lng: 110.3642 },
  { name: 'Ambarketawang (Gamping, Sleman)', lat: -7.8012, lng: 110.3345 },
  { name: 'Banyuraden (Gamping, Sleman)', lat: -7.7854, lng: 110.3321 },
  { name: 'Nogotirto (Gamping, Sleman)', lat: -7.7689, lng: 110.3454 },
  { name: 'Jl. Wates KM 3-7 (Gamping, Sleman)', lat: -7.7954, lng: 110.3212 },
  { name: 'Ngestiharjo (Kasihan, Bantul)', lat: -7.8012, lng: 110.3421 },
  { name: 'Tirtonirmolo (Kasihan, Bantul)', lat: -7.8189, lng: 110.3512 },
  { name: 'Tamantirto (Kasihan, Bantul)', lat: -7.8123, lng: 110.3289 },
  { name: 'Banguntapan (Banguntapan, Bantul)', lat: -7.8012, lng: 110.4012 },
  { name: 'Potorono (Banguntapan, Bantul)', lat: -7.8189, lng: 110.4212 },
  { name: 'Baturetno (Banguntapan, Bantul)', lat: -7.7889, lng: 110.4123 },
  { name: 'Jl. Ringroad Timur (Banguntapan, Bantul)', lat: -7.7954, lng: 110.4054 },
  { name: 'Jl. Wonosari KM 5-8 (Banguntapan, Bantul)', lat: -7.7821, lng: 110.4289 }
];

function computeDistance(addr1: string, addr2: string): number {
  const item1 = ADDRESS_DB.find(a => a.name.toLowerCase().includes(addr1.toLowerCase())) || ADDRESS_DB[0];
  const item2 = ADDRESS_DB.find(a => a.name.toLowerCase().includes(addr2.toLowerCase())) || ADDRESS_DB[2];
  
  const R = 6371;
  const dLat = (item2.lat - item1.lat) * Math.PI / 180;
  const dLon = (item2.lng - item1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(item1.lat * Math.PI / 180) * Math.cos(item2.lat * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const km = R * c;
  return Math.max(1.5, Number((km || 4.5).toFixed(1)));
}

export const SchoolPickUpPortal: React.FC<{ onBackToMain: () => void }> = ({ onBackToMain }) => {
  // Portal auth state for Jemput Sekolah: 'customer' | 'driver' | null
  const [userRole, setUserRole] = useState<'customer' | 'driver' | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Current logged in school user / driver
  const [loggedInCustomer, setLoggedInCustomer] = useState<SchoolUser | null>(() => {
    const saved = localStorage.getItem('pergidiantar_school_cust');
    return saved ? JSON.parse(saved) : null;
  });

  const [loggedInDriver, setLoggedInDriver] = useState<SchoolDriver | null>(() => {
    const saved = localStorage.getItem('pergidiantar_school_driver');
    return saved ? JSON.parse(saved) : null;
  });

  // Form states for login/register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Driver specific registration
  const [vehicleModel, setVehicleModel] = useState('Avanza / Ertiga');
  const [plateNumber, setPlateNumber] = useState('');
  const [ktpNumber, setKtpNumber] = useState('');
  const [ktpImage, setKtpImage] = useState('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400');
  const [selfieImage, setSelfieImage] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400');

  // Orders and Drivers Database in localStorage / State
  const [driversList, setDriversList] = useState<SchoolDriver[]>(() => {
    const saved = localStorage.getItem('pergidiantar_school_drivers_db');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'drv-1',
        userId: 'usr-d1',
        name: 'Bapak Slamet Riyadi',
        email: 'slamet.driver@pergidiantar.com',
        phone: '081234567890',
        vehicleModel: 'Toyota Avanza (Kapasitas 6 Anak)',
        plateNumber: 'AB 1234 XY',
        ktpNumber: '3471012345670001',
        ktpImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f',
        selfieImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        status: 'approved',
        rating: 4.9,
        totalTrips: 142,
        availableSlots: 3,
        maxSlots: 6,
        baseFare: 10000,
        currentLat: -7.7956,
        currentLng: 110.3695,
        dailyRevenue: 185000,
        feeOwedToAdmin: 14800, // 8% of 185k
        feeStatus: 'unpaid',
        createdAt: '2026-01-10'
      },
      {
        id: 'drv-2',
        userId: 'usr-d2',
        name: 'Ibu Siti Aminah',
        email: 'siti.driver@pergidiantar.com',
        phone: '081987654321',
        vehicleModel: 'Honda Mobilio (Kapasitas 5 Anak)',
        plateNumber: 'AB 5678 CD',
        ktpNumber: '3471098765430002',
        ktpImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f',
        selfieImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
        status: 'approved',
        rating: 4.8,
        totalTrips: 98,
        availableSlots: 2,
        maxSlots: 5,
        baseFare: 9000,
        currentLat: -7.7828,
        currentLng: 110.3671,
        dailyRevenue: 150000,
        feeOwedToAdmin: 12000, // 8%
        feeStatus: 'paid',
        lastPaymentDate: '2026-03-30',
        createdAt: '2026-01-15'
      }
    ];
  });

  const [ordersList, setOrdersList] = useState<SchoolOrder[]>(() => {
    const saved = localStorage.getItem('pergidiantar_school_orders_db');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'so-1',
        customerId: 'cust-1',
        customerName: 'Bunda Rina Astuti',
        customerPhone: '081122334455',
        studentName: 'Andika Putra',
        schoolName: 'SDN Model Yogyakarta',
        pickupAddress: 'Jl. Kaliurang KM 7, Sleman',
        pickupLat: -7.7512,
        pickupLng: 110.3821,
        dropoffAddress: 'SDN Model Yogyakarta',
        dropoffLat: -7.7421,
        dropoffLng: 110.3912,
        driverId: 'drv-1',
        driverName: 'Bapak Slamet Riyadi',
        driverVehicle: 'Toyota Avanza (Kapasitas 6 Anak)',
        distanceKm: 4.5,
        baseFare: 10000,
        totalFare: 14500, // 10k + (1.5 * 3k)
        appFee8Percent: 1160,
        driverEarnings: 13340,
        paymentStatus: 'paid_dana',
        tripStatus: 'completed',
        createdAt: '2026-03-30 06:30'
      }
    ];
  });

  // Customer booking wizard state
  const [studentName, setStudentName] = useState('');
  const [schoolName, setSchoolName] = useState('SDN Model Yogyakarta');
  const [pickupAddress, setPickupAddress] = useState('Rumah Utama (Jl. Kaliurang KM 7 Sleman)');
  const [dropoffAddress, setDropoffAddress] = useState('Sekolah (SDN Model Yogyakarta)');
  const [selectedDriverForBooking, setSelectedDriverForBooking] = useState<SchoolDriver | null>(null);
  const [estimatedDistanceKm, setEstimatedDistanceKm] = useState(4.5);
  const [activeCreatedOrder, setActiveCreatedOrder] = useState<SchoolOrder | null>(null);

  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [mapModalType, setMapModalType] = useState<'pickup' | 'dropoff' | null>(null);

  const pickupSuggestions = ADDRESS_DB.filter(a => a.name.toLowerCase().includes(pickupAddress.toLowerCase()));
  const dropoffSuggestions = ADDRESS_DB.filter(a => a.name.toLowerCase().includes(dropoffAddress.toLowerCase()));

  // Automatically calculate distance using computeDistance
  useEffect(() => {
    const dist = computeDistance(pickupAddress, dropoffAddress);
    setEstimatedDistanceKm(dist);
  }, [pickupAddress, dropoffAddress]);
  
  // Notification banner / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pergidiantar_school_drivers_db', JSON.stringify(driversList));
  }, [driversList]);

  useEffect(() => {
    localStorage.setItem('pergidiantar_school_orders_db', JSON.stringify(ordersList));
  }, [ordersList]);

  useEffect(() => {
    if (loggedInCustomer) {
      localStorage.setItem('pergidiantar_school_cust', JSON.stringify(loggedInCustomer));
    } else {
      localStorage.removeItem('pergidiantar_school_cust');
    }
  }, [loggedInCustomer]);

  useEffect(() => {
    if (loggedInDriver) {
      localStorage.setItem('pergidiantar_school_driver', JSON.stringify(loggedInDriver));
    } else {
      localStorage.removeItem('pergidiantar_school_driver');
    }
  }, [loggedInDriver]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Customer Login / Register
  const handleCustomerAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (authMode === 'register' && (!name || !phone))) {
      showToast('Harap lengkapi seluruh kolom formulir.');
      return;
    }
    const newUser: SchoolUser = {
      id: `cust-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      phone: phone || '08123456789',
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setLoggedInCustomer(newUser);
    setUserRole('customer');
    showToast('Berhasil masuk ke Portal Orangtua Jemput Sekolah!');
  };

  // Driver Login / Register
  const handleDriverAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Email dan Password wajib diisi.');
      return;
    }

    if (authMode === 'register') {
      if (!name || !phone || !plateNumber || !ktpNumber) {
        showToast('Mohon lengkapi data Driver, KTP, dan Nomor Plat kendaraan.');
        return;
      }
      const newDriver: SchoolDriver = {
        id: `drv-${Date.now()}`,
        userId: `usr-${Date.now()}`,
        name,
        email,
        phone,
        vehicleModel,
        plateNumber,
        ktpNumber,
        ktpImage,
        selfieImage,
        status: 'pending', // Requires superadmin approval
        rating: 5.0,
        totalTrips: 0,
        availableSlots: 4,
        maxSlots: 6,
        baseFare: 10000,
        currentLat: -7.7956,
        currentLng: 110.3695,
        dailyRevenue: 0,
        feeOwedToAdmin: 0,
        feeStatus: 'unpaid',
        createdAt: new Date().toISOString()
      };
      setDriversList(prev => [newDriver, ...prev]);
      setLoggedInDriver(newDriver);
      setUserRole('driver');
      showToast('Pendaftaran driver berhasil! Menunggu persetujuan Superadmin.');
    } else {
      // Login existing driver
      const found = driversList.find(d => d.email === email);
      if (found) {
        setLoggedInDriver(found);
        setUserRole('driver');
        showToast('Berhasil masuk sebagai Pengemudi.');
      } else {
        // Create demo driver if not found
        const demoDrv: SchoolDriver = {
          id: `drv-${Date.now()}`,
          userId: `usr-${Date.now()}`,
          name: email.split('@')[0],
          email,
          phone: '08123456789',
          vehicleModel: 'Toyota Avanza',
          plateNumber: 'AB 9999 XX',
          ktpNumber: '3471012345679999',
          ktpImage,
          selfieImage,
          status: 'approved',
          rating: 4.9,
          totalTrips: 25,
          availableSlots: 4,
          maxSlots: 6,
          baseFare: 10000,
          currentLat: -7.7956,
          currentLng: 110.3695,
          dailyRevenue: 50000,
          feeOwedToAdmin: 4000,
          feeStatus: 'unpaid',
          createdAt: new Date().toISOString()
        };
        setDriversList(prev => [demoDrv, ...prev]);
        setLoggedInDriver(demoDrv);
        setUserRole('driver');
        showToast('Login berhasil sebagai Driver.');
      }
    }
  };

  // Calculate fare
  const calculateFare = (distance: number, base: number) => {
    // Base fare covers up to 3km. Each km after is 3000.
    const extraKm = Math.max(0, distance - 3);
    const subtotal = base + (extraKm * 3000);
    const appFee = Math.round(subtotal * 0.08); // 8% service fee
    return { subtotal, appFee, total: subtotal };
  };

  const handleCreateOrder = (driver: SchoolDriver) => {
    if (!loggedInCustomer) {
      showToast('Silakan login sebagai Orangtua/Customer terlebih dahulu.');
      return;
    }
    if (!studentName || !schoolName || !pickupAddress) {
      showToast('Harap lengkapi nama anak, sekolah, dan titik penjemputan.');
      return;
    }

    const { subtotal, appFee } = calculateFare(estimatedDistanceKm, driver.baseFare);
    const newOrder: SchoolOrder = {
      id: `so-${Date.now()}`,
      customerId: loggedInCustomer.id,
      customerName: loggedInCustomer.name,
      customerPhone: loggedInCustomer.phone,
      studentName,
      schoolName,
      pickupAddress,
      pickupLat: -7.79,
      pickupLng: 110.37,
      dropoffAddress: schoolName,
      dropoffLat: -7.74,
      dropoffLng: 110.39,
      driverId: driver.id,
      driverName: driver.name,
      driverVehicle: driver.vehicleModel,
      distanceKm: estimatedDistanceKm,
      baseFare: driver.baseFare,
      totalFare: subtotal,
      appFee8Percent: appFee,
      driverEarnings: subtotal - appFee,
      paymentStatus: 'pending',
      tripStatus: 'accepted',
      createdAt: new Date().toISOString()
    };

    setOrdersList(prev => [newOrder, ...prev]);
    setActiveCreatedOrder(newOrder);
    showToast(`Pesanan antar jemput ke ${driver.name} berhasil dibuat! Silakan lakukan pembayaran.`);
  };

  const handlePayOrderWithDana = (orderId: string) => {
    setOrdersList(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, paymentStatus: 'paid_dana', tripStatus: 'heading_pickup' };
      }
      return o;
    }));
    if (activeCreatedOrder && activeCreatedOrder.id === orderId) {
      setActiveCreatedOrder({ ...activeCreatedOrder, paymentStatus: 'paid_dana', tripStatus: 'heading_pickup' });
    }
    showToast(`Pembayaran DANA ke Admin (${ADMIN_DANA_NUMBER}) berhasil dikonfirmasi! Driver dalam perjalanan.`);
  };

  // Driver pay 8% fee to DANA admin
  const handlePayDriverFeeToAdmin = (driverId: string) => {
    setDriversList(prev => prev.map(d => {
      if (d.id === driverId) {
        return { ...d, feeStatus: 'paid', feeOwedToAdmin: 0, lastPaymentDate: new Date().toISOString() };
      }
      return d;
    }));
    if (loggedInDriver && loggedInDriver.id === driverId) {
      setLoggedInDriver({ ...loggedInDriver, feeStatus: 'paid', feeOwedToAdmin: 0 });
    }
    showToast('Setoran jasa aplikasi 8% ke DANA Admin berhasil dicatat dan diverifikasi!');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-3 text-xs animate-bounce">
          <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-neutral-900 to-neutral-950 text-white py-8 px-4 sm:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <Bus className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                <span>Layanan Real-Time</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>GPS & Firebase Sync</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Jemput Sekolah <span className="text-orange-400">PERGIDIANTAR</span>
              </h1>
              <p className="text-xs text-neutral-300 mt-0.5">
                Antar jemput anak sekolah berbasis lokasi real-time, transparan, aman dengan notifikasi orangtua.
              </p>
            </div>
          </div>

          <button
            onClick={onBackToMain}
            className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors border border-white/20 flex items-center gap-2"
          >
            <span>&larr; Kembali ke Portal Utama</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* If neither logged in as customer nor driver */}
        {!loggedInCustomer && !loggedInDriver ? (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-neutral-200 overflow-hidden p-6 sm:p-8">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl font-black text-neutral-900">
                Pilih Portal Masuk / Pendaftaran
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Silakan pilih sebagai Orangtua (Customer) atau Pengemudi (Driver) untuk memulai layanan antar jemput sekolah.
              </p>

              {/* Role Toggle Tabs */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setUserRole('customer')}
                  className={`py-2.5 px-6 rounded-xl text-xs font-bold transition-all ${
                    userRole === 'customer' || userRole === null
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Portal Orangtua (Customer)
                </button>
                <button
                  onClick={() => setUserRole('driver')}
                  className={`py-2.5 px-6 rounded-xl text-xs font-bold transition-all ${
                    userRole === 'driver'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Portal Pengemudi (Driver)
                </button>
              </div>
            </div>

            {/* Auth Form Container */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200">
                <span className="text-xs font-bold text-neutral-800 uppercase">
                  {userRole === 'driver' ? 'Form Pengemudi Sekolah' : 'Form Orangtua (Customer)'}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setAuthMode('login')}
                    className={`font-bold pb-0.5 ${authMode === 'login' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-neutral-400'}`}
                  >
                    Masuk
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setAuthMode('register')}
                    className={`font-bold pb-0.5 ${authMode === 'register' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-neutral-400'}`}
                  >
                    Daftar Baru
                  </button>
                </div>
              </div>

              {userRole === 'driver' ? (
                /* Driver Auth Form */
                <form onSubmit={handleDriverAuth} className="space-y-4 text-xs">
                  {authMode === 'register' && (
                    <>
                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">Nama Lengkap Pengemudi</label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="cth. Bapak Budi Santoso"
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">Nomor WhatsApp / Telepon</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="cth. 081234567890"
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-neutral-700 mb-1">Model Kendaraan & Kapasitas</label>
                          <input
                            type="text"
                            value={vehicleModel}
                            onChange={e => setVehicleModel(e.target.value)}
                            placeholder="cth. Avanza (6 Anak)"
                            className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-neutral-700 mb-1">Nomor Plat Nomor</label>
                          <input
                            type="text"
                            value={plateNumber}
                            onChange={e => setPlateNumber(e.target.value)}
                            placeholder="cth. AB 1234 XX"
                            className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">Nomor KTP (Verifikasi Identitas)</label>
                        <input
                          type="text"
                          value={ktpNumber}
                          onChange={e => setKtpNumber(e.target.value)}
                          placeholder="347101xxxxxxxxxx"
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-neutral-700 mb-1">Foto KTP (URL / Upload)</label>
                          <input
                            type="text"
                            value={ktpImage}
                            onChange={e => setKtpImage(e.target.value)}
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-neutral-700 mb-1">Foto Selfie Wajah</label>
                          <input
                            type="text"
                            value={selfieImage}
                            onChange={e => setSelfieImage(e.target.value)}
                            className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-[11px]"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                        * Pendaftaran pengemudi memerlukan verifikasi KTP & selfie oleh Superadmin sebelum dapat menerima order.
                      </p>
                    </>
                  )}

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Email Pengemudi</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="driver@pergidiantar.com"
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Kata Sandi</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    {authMode === 'register' ? 'Daftar Sebagai Pengemudi' : 'Masuk Dashboard Pengemudi'}
                  </button>
                </form>
              ) : (
                /* Customer Auth Form */
                <form onSubmit={handleCustomerAuth} className="space-y-4 text-xs">
                  {authMode === 'register' && (
                    <>
                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">Nama Lengkap Orangtua</label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="cth. Bunda Rina"
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-neutral-700 mb-1">Nomor WhatsApp / Telepon</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="cth. 081122334455"
                          className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Email / No Telp Terhubung</label>
                    <input
                      type="text"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="orangtua@gmail.com"
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Kata Sandi</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl"
                      required
                    />
                  </div>

                  <p className="text-[11px] text-neutral-500">
                    * Pendaftaran penumpang terhubung otomatis tanpa persetujuan manual superadmin.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    {authMode === 'register' ? 'Daftar Akun Orangtua' : 'Masuk Portal Orangtua'}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : loggedInCustomer ? (
          /* ================= LOGGED IN CUSTOMER (ORANGTUA) VIEW ================= */
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                  {loggedInCustomer.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs text-orange-600 font-bold uppercase tracking-wider">Portal Orangtua / Customer</span>
                  <h2 className="text-xl font-extrabold text-neutral-900">Halo, {loggedInCustomer.name}</h2>
                  <p className="text-xs text-neutral-500">{loggedInCustomer.email} · {loggedInCustomer.phone}</p>
                </div>
              </div>

              <button
                onClick={() => { setLoggedInCustomer(null); localStorage.removeItem('pergidiantar_school_cust'); }}
                className="py-2 px-4 bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            </div>

            {/* Booking & Driver Proximity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Booking Form */}
              <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>Form Order Antar Jemput Sekolah</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Nama Lengkap Anak / Siswa</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={e => setStudentName(e.target.value)}
                      placeholder="cth. Andika Putra"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl"
                    />
                  </div>
                  <div className="relative">
                    <label className="block font-semibold text-neutral-700 mb-1">Titik Penjemputan (Ketik atau Pilih dari Peta)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pickupAddress}
                        onChange={e => {
                          setPickupAddress(e.target.value);
                          setShowPickupSuggestions(true);
                        }}
                        onFocus={() => setShowPickupSuggestions(true)}
                        placeholder="Ketik rumah atau sekolah..."
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setMapModalType('pickup')}
                        className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs"
                        title="Pilih dari Peta Google Maps"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Maps</span>
                      </button>
                    </div>
                    {showPickupSuggestions && pickupSuggestions.length > 0 && (
                      <div className="absolute z-30 left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-neutral-200 max-h-48 overflow-y-auto">
                        {pickupSuggestions.map((item, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setPickupAddress(item.name);
                              setShowPickupSuggestions(false);
                            }}
                            className="p-2.5 hover:bg-orange-50 hover:text-orange-900 cursor-pointer text-xs border-b border-neutral-100 last:border-0 font-medium flex items-center gap-2"
                          >
                            <span>📍</span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block font-semibold text-neutral-700 mb-1">Titik Tujuan (Ketik atau Pilih dari Peta)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={dropoffAddress}
                        onChange={e => {
                          setDropoffAddress(e.target.value);
                          setShowDropoffSuggestions(true);
                        }}
                        onFocus={() => setShowDropoffSuggestions(true)}
                        placeholder="Ketik sekolah atau rumah..."
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setMapModalType('dropoff')}
                        className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs"
                        title="Pilih dari Peta Google Maps"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Maps</span>
                      </button>
                    </div>
                    {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                      <div className="absolute z-30 left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-neutral-200 max-h-48 overflow-y-auto">
                        {dropoffSuggestions.map((item, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setDropoffAddress(item.name);
                              setShowDropoffSuggestions(false);
                            }}
                            className="p-2.5 hover:bg-orange-50 hover:text-orange-900 cursor-pointer text-xs border-b border-neutral-100 last:border-0 font-medium flex items-center gap-2"
                          >
                            <span>📍</span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between text-blue-900">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                      <span>Estimasi Jarak Otomatis (GPS):</span>
                    </span>
                    <span className="font-mono font-extrabold text-sm text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                      {estimatedDistanceKm} KM
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    * Rumah dan Sekolah dapat menjadi titik penjemputan maupun tujuan. Jarak terhitung otomatis oleh sistem. Tarif dasar: Rp 10.000 (3km pertama), +Rp 3.000/km berikutnya.
                  </p>
                </div>

                <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-200 text-xs text-orange-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    <span>Garansi Keamanan & Pelacakan GPS</span>
                  </div>
                  <p className="text-[11px] text-orange-800 leading-relaxed">
                    Pilih pengemudi terdekat dari daftar di sebelah kanan. Pembayaran digital aman ke DANA Admin <strong>{ADMIN_DANA_NUMBER}</strong>.
                  </p>
                </div>
              </div>

              {/* Right Column: Drivers Sorted by Proximity & Interactive Map */}
              <div className="lg:col-span-2 space-y-6">
                {/* Interactive Map Mockup with Google Maps API styling */}
                <div className="bg-neutral-900 text-white rounded-3xl p-6 shadow-sm border border-neutral-800 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-orange-400 animate-spin" />
                      <span className="text-sm font-bold">Peta Interaktif & Posisi Pengemudi Terdekat</span>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-mono">
                      Google Maps GPS Active
                    </span>
                  </div>

                  <div className="h-56 rounded-2xl bg-neutral-800 border border-neutral-700 flex flex-col items-center justify-center relative overflow-hidden p-4">
                    <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')` }} />
                    
                    {/* SVG Route Animation Line */}
                    <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex items-center justify-between z-10">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold shadow-lg animate-pulse">
                          🏠
                        </div>
                        <span className="text-[10px] font-bold text-white bg-neutral-900/80 px-2 py-0.5 rounded-full mt-1 max-w-[120px] truncate">
                          {pickupAddress.split('(')[0]}
                        </span>
                      </div>

                      {/* Animated Route Line */}
                      <div className="flex-1 mx-4 relative h-2">
                        <div className="absolute inset-0 border-t-2 border-dashed border-orange-400 animate-pulse" />
                        {/* Moving Vehicle Icon */}
                        <div className="absolute top-1/2 -translate-y-1/2 animate-[bounce_1.5s_infinite] left-1/2 -translate-x-1/2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg">
                          <Bus className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg animate-pulse">
                          🏫
                        </div>
                        <span className="text-[10px] font-bold text-white bg-neutral-900/80 px-2 py-0.5 rounded-full mt-1 max-w-[120px] truncate">
                          {dropoffAddress.split('(')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 text-center mt-24 space-y-1">
                      <p className="text-xs font-extrabold text-orange-400">⚡ Jalur Rute Aktif & Navigasi GPS Terdeteksi</p>
                      <p className="text-[11px] text-neutral-300">Jarak: <strong>{estimatedDistanceKm} KM</strong> · Estimasi Waktu Tempuh: <strong>~{Math.round(estimatedDistanceKm * 3.5)} Menit</strong></p>
                    </div>
                  </div>
                </div>

                {/* Driver List Sorted by Proximity */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide flex items-center justify-between">
                    <span>List Pengemudi Terdekat (Urut Berdasarkan Jarak & Rating)</span>
                    <span className="text-xs font-normal text-neutral-500">{driversList.filter(d => d.status === 'approved').length} Pengemudi Siap</span>
                  </h3>

                  <div className="space-y-3">
                    {driversList.filter(d => d.status === 'approved').map((drv, idx) => {
                      const { subtotal } = calculateFare(estimatedDistanceKm, drv.baseFare);
                      return (
                        <div key={drv.id} className="p-4 rounded-2xl border border-neutral-200 hover:border-orange-300 transition-all bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <img src={drv.selfieImage} alt={drv.name} className="w-12 h-12 rounded-full object-cover border border-neutral-300 shadow-xs shrink-0" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-neutral-900">{drv.name}</span>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                  #{idx + 1} Terdekat (~{(1.2 + idx * 0.8).toFixed(1)} km)
                                </span>
                              </div>
                              <p className="text-xs text-neutral-600 font-medium mt-0.5">{drv.vehicleModel} · Plat: {drv.plateNumber}</p>
                              <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                                <span className="flex items-center gap-1 text-amber-600 font-bold">
                                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                  {drv.rating} ({drv.totalTrips} Trip)
                                </span>
                                <span>Slot Anak: <strong className="text-neutral-800">{drv.availableSlots}/{drv.maxSlots} Tersedia</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                            <div className="text-right">
                              <span className="text-[11px] text-neutral-400 block">Estimasi Biaya</span>
                              <span className="text-sm font-black text-orange-600">Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <button
                              onClick={() => handleCreateOrder(drv)}
                              className="py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                            >
                              Pilih & Pesan
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Active Orders / Payment Section */}
                {activeCreatedOrder && (
                  <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-orange-500 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <h4 className="text-sm font-black text-neutral-900">Pesanan Aktif: #{activeCreatedOrder.id}</h4>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-800">
                        Status: {activeCreatedOrder.tripStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-700">
                      <div className="space-y-1.5">
                        <p><strong>Anak:</strong> {activeCreatedOrder.studentName}</p>
                        <p><strong>Sekolah:</strong> {activeCreatedOrder.schoolName}</p>
                        <p><strong>Penjemputan:</strong> {activeCreatedOrder.pickupAddress}</p>
                      </div>
                      <div className="space-y-1.5">
                        <p><strong>Pengemudi:</strong> {activeCreatedOrder.driverName} ({activeCreatedOrder.driverVehicle})</p>
                        <p><strong>Total Biaya:</strong> Rp {activeCreatedOrder.totalFare.toLocaleString('id-ID')} (Termasuk Jasa 8%)</p>
                        <p><strong>Status Pembayaran:</strong> <span className={activeCreatedOrder.paymentStatus === 'paid_dana' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{activeCreatedOrder.paymentStatus === 'paid_dana' ? 'Lunas (DANA Admin)' : 'Menunggu Pembayaran'}</span></p>
                      </div>
                    </div>

                    {activeCreatedOrder.paymentStatus !== 'paid_dana' && (
                      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-orange-900">Pembayaran Digital via DANA Admin</span>
                          <span className="text-xs font-mono font-bold bg-orange-600 text-white px-3 py-1 rounded-lg">
                            DANA: {ADMIN_DANA_NUMBER}
                          </span>
                        </div>
                        <p className="text-xs text-orange-800">
                          Silakan transfer total <strong>Rp {activeCreatedOrder.totalFare.toLocaleString('id-ID')}</strong> ke akun DANA Admin di atas, lalu klik tombol konfirmasi pembayaran di bawah.
                        </p>
                        <button
                          onClick={() => handlePayOrderWithDana(activeCreatedOrder.id)}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Konfirmasi Pembayaran DANA ({ADMIN_DANA_NUMBER})</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ================= LOGGED IN DRIVER VIEW ================= */
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={loggedInDriver?.selfieImage} alt={loggedInDriver?.name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-md shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Portal Pengemudi Sekolah</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${loggedInDriver?.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {loggedInDriver?.status === 'approved' ? 'Disetujui Superadmin' : 'Menunggu Persetujuan KTP & Selfie'}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-neutral-900">{loggedInDriver?.name}</h2>
                  <p className="text-xs text-neutral-500">{loggedInDriver?.vehicleModel} · Plat: {loggedInDriver?.plateNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setLoggedInDriver(null); localStorage.removeItem('pergidiantar_school_driver'); }}
                  className="py-2 px-4 bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>

            {loggedInDriver?.status !== 'approved' && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Akun Pengemudi Anda Masih Dalam Proses Verifikasi KTP & Wajah</strong>
                  Superadmin sedang memeriksa data KTP ({loggedInDriver?.ktpNumber}) dan foto selfie Anda. Setelah disetujui, Anda akan langsung dapat menerima pesanan antar jemput dari orangtua.
                </div>
              </div>
            )}

            {/* Driver Stats & Fee Settlement Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs space-y-2">
                <span className="text-xs text-neutral-500 font-medium">Pendapatan Harian</span>
                <div className="text-2xl font-black text-neutral-900">
                  Rp {loggedInDriver?.dailyRevenue.toLocaleString('id-ID')}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold">Total dari trip yang diselesaikan</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs space-y-2">
                <span className="text-xs text-neutral-500 font-medium">Biaya Jasa Aplikator (8% Wajib Setor)</span>
                <div className="text-2xl font-black text-orange-600">
                  Rp {(loggedInDriver?.feeOwedToAdmin || 0).toLocaleString('id-ID')}
                </div>
                <p className="text-[11px] text-neutral-500">Batas setoran ke DANA <strong>{ADMIN_DANA_NUMBER}</strong> pukul 23.59</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-2xs space-y-2">
                <span className="text-xs text-neutral-500 font-medium">Status Setoran & Blokir</span>
                <div className="flex items-center gap-2 pt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${loggedInDriver?.feeStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {loggedInDriver?.feeStatus === 'paid' ? 'Lunas (Aman)' : 'Belum Lunas (Wajib Bayar)'}
                  </span>
                </div>
                {loggedInDriver?.feeStatus !== 'paid' && (
                  <button
                    onClick={() => handlePayDriverFeeToAdmin(loggedInDriver!.id)}
                    className="w-full mt-2 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Bayar Jasa 8% ke DANA ({ADMIN_DANA_NUMBER})
                  </button>
                )}
              </div>
            </div>

            {/* Incoming Orders for Driver */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200 space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                Order Masuk & Riwayat Perjalanan Sekolah
              </h3>

              <div className="space-y-3">
                {ordersList.filter(o => o.driverId === loggedInDriver?.id || loggedInDriver?.status === 'approved').map(ord => (
                  <div key={ord.id} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-neutral-900">Anak: {ord.studentName}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">{ord.schoolName}</span>
                      </div>
                      <p className="text-neutral-600">Orangtua: <strong>{ord.customerName}</strong> ({ord.customerPhone})</p>
                      <p className="text-neutral-500">Penjemputan: {ord.pickupAddress} (~{ord.distanceKm} km)</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[11px] text-neutral-400 block">Pendapatan Bersih Driver</span>
                        <span className="text-sm font-black text-emerald-600">Rp {ord.driverEarnings.toLocaleString('id-ID')}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        {ord.tripStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Google Maps Picker Modal */}
      {mapModalType && (
        <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-neutral-900">
                  Pilih Lokasi dari Peta Interaktif Google Maps ({mapModalType === 'pickup' ? 'Titik Penjemputan' : 'Titik Tujuan'})
                </h3>
              </div>
              <button onClick={() => setMapModalType(null)} className="p-1 rounded-lg hover:bg-neutral-100">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Klik pada salah satu titik lokasi di bawah ini untuk memilih koordinat secara instan. Jarak dan harga akan menyesuaikan secara otomatis.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {ADDRESS_DB.map((loc, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (mapModalType === 'pickup') {
                      setPickupAddress(loc.name);
                    } else {
                      setDropoffAddress(loc.name);
                    }
                    setMapModalType(null);
                    showToast(`Lokasi ${mapModalType === 'pickup' ? 'Penjemputan' : 'Tujuan'} berhasil dipilih dari Maps! Jarak diperbarui.`);
                  }}
                  className="p-3 rounded-2xl border border-neutral-200 hover:border-orange-500 hover:bg-orange-50/50 cursor-pointer flex items-center justify-between transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      📍
                    </div>
                    <div>
                      <span className="font-bold text-neutral-900 block">{loc.name}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">Lat: {loc.lat}, Lng: {loc.lng}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-xl">Pilih Lokasi</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
