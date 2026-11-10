import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FleetUnit, DriverCrew, FleetStatus, FleetType, HotelPartner, DestinationRegion } from '../../types/travel';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { 
  Car, 
  Users, 
  Wrench, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Hotel, 
  ShieldCheck, 
  Phone, 
  Star,
  MapPin,
  X,
  Edit3,
  Save,
  Check,
  Search,
  BedDouble,
  Building2,
  DollarSign,
  Minus,
  Sparkles,
  Info
} from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const { 
    fleet, 
    drivers, 
    hotels, 
    deleteFleet, 
    deleteDriver, 
    addFleet, 
    addDriver,
    updateFleet,
    updateDriver,
    addHotel,
    updateHotel,
    deleteHotel,
    currentRole 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'armada' | 'driver' | 'hotel'>('armada');
  const [filterFleetStatus, setFilterFleetStatus] = useState<string>('all');
  
  // Add modals
  const [isAddFleetOpen, setIsAddFleetOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);

  // Edit states
  const [editingFleet, setEditingFleet] = useState<FleetUnit | null>(null);
  const [editingDriver, setEditingDriver] = useState<DriverCrew | null>(null);
  const [editingHotel, setEditingHotel] = useState<HotelPartner | null>(null);
  
  // Delete modals
  const [deletingFleet, setDeletingFleet] = useState<FleetUnit | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<DriverCrew | null>(null);
  const [deletingHotel, setDeletingHotel] = useState<HotelPartner | null>(null);

  // Hotel filters
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');
  const [hotelRegionFilter, setHotelRegionFilter] = useState<'all' | 'jogja' | 'malang' | 'bali'>('all');
  const [hotelQuotaFilter, setHotelQuotaFilter] = useState<'all' | 'low' | 'normal'>('all');

  // New hotel form
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelCity, setNewHotelCity] = useState<DestinationRegion>('jogja');
  const [newHotelStarRating, setNewHotelStarRating] = useState(4);
  const [newHotelRoomType, setNewHotelRoomType] = useState('Deluxe Twin / King');
  const [newHotelQuota, setNewHotelQuota] = useState(15);
  const [newHotelPrice, setNewHotelPrice] = useState(750000);

  // Edit hotel form
  const [editHotelName, setEditHotelName] = useState('');
  const [editHotelCity, setEditHotelCity] = useState<DestinationRegion>('jogja');
  const [editHotelStarRating, setEditHotelStarRating] = useState(4);
  const [editHotelRoomType, setEditHotelRoomType] = useState('');
  const [editHotelQuota, setEditHotelQuota] = useState(15);
  const [editHotelPrice, setEditHotelPrice] = useState(750000);

  // New fleet form
  const [newFleetName, setNewFleetName] = useState('');
  const [newFleetPlate, setNewFleetPlate] = useState('');
  const [newFleetType, setNewFleetType] = useState<FleetType>('hiace_premio');
  const [newFleetCapacity, setNewFleetCapacity] = useState(14);
  const [newFleetBaseCity, setNewFleetBaseCity] = useState('Yogyakarta');

  // Edit fleet form state
  const [editFleetName, setEditFleetName] = useState('');
  const [editFleetPlate, setEditFleetPlate] = useState('');
  const [editFleetType, setEditFleetType] = useState<FleetType>('hiace_premio');
  const [editFleetCapacity, setEditFleetCapacity] = useState(14);
  const [editFleetStatus, setEditFleetStatus] = useState<FleetStatus>('tersedia');
  const [editFleetBaseCity, setEditFleetBaseCity] = useState('Yogyakarta');

  // New driver form
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('');
  const [newDriverLicense, setNewDriverLicense] = useState('SIM B1 Umum');

  // Edit driver form state
  const [editDriverName, setEditDriverName] = useState('');
  const [editDriverPhone, setEditDriverPhone] = useState('');
  const [editDriverLicense, setEditDriverLicense] = useState('SIM B1 Umum');
  const [editDriverStatus, setEditDriverStatus] = useState<DriverCrew['status']>('tersedia');
  const [editDriverRating, setEditDriverRating] = useState(5.0);

  const isSuperAdmin = currentRole === 'super_admin';

  const filteredFleet = fleet.filter((f) => {
    if (filterFleetStatus === 'all') return true;
    return f.status === filterFleetStatus;
  });

  const getFleetTypeLabel = (type: FleetType) => {
    switch (type) {
      case 'avanza': return 'Toyota Avanza (1-5 Pax)';
      case 'innova': return 'Toyota Innova Reborn (4-7 Pax)';
      case 'hiace_premio': return 'HiAce Premio Luxury (8-14 Pax)';
      case 'hiace_commuter': return 'HiAce Commuter (15 Pax)';
      case 'elf_long': return 'Isuzu Elf Long (19 Pax)';
      case 'medium_bus': return 'Medium Bus (33 Pax)';
      case 'big_bus': return 'Big Bus SHD (50 Pax)';
      default: return 'Armada Wisata';
    }
  };

  const openFleetEdit = (unit: FleetUnit) => {
    setEditingFleet(unit);
    setEditFleetName(unit.name);
    setEditFleetPlate(unit.plateNumber);
    setEditFleetType(unit.type);
    setEditFleetCapacity(unit.capacitySeats);
    setEditFleetStatus(unit.status);
    setEditFleetBaseCity(unit.baseCity);
  };

  const handleSaveFleetEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFleet) return;

    updateFleet({
      ...editingFleet,
      name: editFleetName.trim(),
      plateNumber: editFleetPlate.trim().toUpperCase(),
      type: editFleetType,
      typeLabel: getFleetTypeLabel(editFleetType),
      capacitySeats: Number(editFleetCapacity),
      status: editFleetStatus,
      baseCity: editFleetBaseCity
    });

    setEditingFleet(null);
  };

  const openDriverEdit = (drv: DriverCrew) => {
    setEditingDriver(drv);
    setEditDriverName(drv.name);
    setEditDriverPhone(drv.phone);
    setEditDriverLicense(drv.licenseType);
    setEditDriverStatus(drv.status);
    setEditDriverRating(drv.rating);
  };

  const handleSaveDriverEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) return;

    updateDriver({
      ...editingDriver,
      name: editDriverName.trim(),
      phone: editDriverPhone.trim(),
      licenseType: editDriverLicense,
      status: editDriverStatus,
      rating: Number(editDriverRating)
    });

    setEditingDriver(null);
  };

  const handleCreateFleet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFleetName.trim() || !newFleetPlate.trim()) return;

    addFleet({
      name: newFleetName,
      plateNumber: newFleetPlate.toUpperCase(),
      type: newFleetType,
      typeLabel: getFleetTypeLabel(newFleetType),
      capacitySeats: Number(newFleetCapacity),
      facilities: ['AC Double Blower', 'Reclining Seats', 'Audio Stereo', 'Port USB'],
      status: 'tersedia',
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextServiceKm: 50000,
      currentKm: 12000,
      baseCity: newFleetBaseCity
    });

    setIsAddFleetOpen(false);
    setNewFleetName('');
    setNewFleetPlate('');
  };

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim() || !newDriverPhone.trim()) return;

    addDriver({
      name: newDriverName,
      phone: newDriverPhone,
      licenseType: newDriverLicense,
      status: 'tersedia',
      totalTripsCompleted: 0,
      rating: 5.0
    });

    setIsAddDriverOpen(false);
    setNewDriverName('');
    setNewDriverPhone('');
  };

  const getStatusBadge = (status: FleetStatus) => {
    switch (status) {
      case 'tersedia':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800">Tersedia</span>;
      case 'ditugaskan':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800">Ditugaskan (Order)</span>;
      case 'perjalanan':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800">Dalam Perjalanan</span>;
      case 'maintenance':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-800">Servis / Bengkel</span>;
      default:
        return null;
    }
  };

  const getCityLabel = (region: DestinationRegion) => {
    switch (region) {
      case 'jogja': return 'Yogyakarta';
      case 'malang': return 'Malang & Batu';
      case 'bali': return 'Bali';
      default: return 'Indonesia';
    }
  };

  const openHotelEdit = (htl: HotelPartner) => {
    setEditingHotel(htl);
    setEditHotelName(htl.name);
    setEditHotelCity(htl.city);
    setEditHotelStarRating(htl.starRating);
    setEditHotelRoomType(htl.roomType);
    setEditHotelQuota(htl.quotaAvailable);
    setEditHotelPrice(htl.pricePerNight);
  };

  const handleSaveHotelEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHotel || !editHotelName.trim() || !editHotelRoomType.trim()) return;

    updateHotel({
      ...editingHotel,
      name: editHotelName.trim(),
      city: editHotelCity,
      cityLabel: getCityLabel(editHotelCity),
      starRating: Number(editHotelStarRating),
      roomType: editHotelRoomType.trim(),
      quotaAvailable: Math.max(0, Number(editHotelQuota)),
      pricePerNight: Math.max(0, Number(editHotelPrice))
    });

    setEditingHotel(null);
  };

  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName.trim() || !newHotelRoomType.trim()) return;

    addHotel({
      name: newHotelName.trim(),
      city: newHotelCity,
      cityLabel: getCityLabel(newHotelCity),
      starRating: Number(newHotelStarRating),
      roomType: newHotelRoomType.trim(),
      quotaAvailable: Math.max(0, Number(newHotelQuota)),
      pricePerNight: Math.max(0, Number(newHotelPrice))
    });

    setIsAddHotelOpen(false);
    setNewHotelName('');
    setNewHotelCity('jogja');
    setNewHotelStarRating(4);
    setNewHotelRoomType('Deluxe Twin / King');
    setNewHotelQuota(15);
    setNewHotelPrice(750000);
  };

  const handleQuickAdjustQuota = (htl: HotelPartner, delta: number) => {
    const newQuota = Math.max(0, htl.quotaAvailable + delta);
    updateHotel({
      ...htl,
      quotaAvailable: newQuota
    });
  };

  const filteredHotels = hotels.filter((h) => {
    const q = hotelSearchQuery.toLowerCase();
    const matchesSearch = 
      h.name.toLowerCase().includes(q) ||
      h.roomType.toLowerCase().includes(q) ||
      h.cityLabel.toLowerCase().includes(q);
    const matchesRegion = hotelRegionFilter === 'all' || h.city === hotelRegionFilter;
    const matchesQuota = 
      hotelQuotaFilter === 'all' ? true :
      hotelQuotaFilter === 'low' ? h.quotaAvailable < 10 :
      h.quotaAvailable >= 10;
    return matchesSearch && matchesRegion && matchesQuota;
  });

  const totalHotelQuota = hotels.reduce((acc, curr) => acc + curr.quotaAvailable, 0);
  const avgStarRating = hotels.length > 0 
    ? (hotels.reduce((acc, curr) => acc + curr.starRating, 0) / hotels.length).toFixed(1)
    : '0';
  const avgPricePerNight = hotels.length > 0
    ? Math.round(hotels.reduce((acc, curr) => acc + curr.pricePerNight, 0) / hotels.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Controls */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" /> Hak Akses Edit & Hapus Khusus Super Admin
              </span>
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mt-1">
              Manajemen Inventaris Armada, Driver & Hotel Mitra
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Kelola unit kendaraan, kru pengemudi, hotel mitra & kuota kamar, serta pantau sinkronisasi otomatis dengan pesanan aktif.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'armada' && isSuperAdmin && (
              <button
                onClick={() => setIsAddFleetOpen(true)}
                className="py-2 px-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Armada</span>
              </button>
            )}
            {activeTab === 'driver' && isSuperAdmin && (
              <button
                onClick={() => setIsAddDriverOpen(true)}
                className="py-2 px-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Driver</span>
              </button>
            )}
            {activeTab === 'hotel' && isSuperAdmin && (
              <button
                onClick={() => setIsAddHotelOpen(true)}
                className="py-2 px-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Hotel Mitra</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pt-2">
          <button
            onClick={() => setActiveTab('armada')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'armada'
                ? 'border-orange-500 text-orange-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Unit Kendaraan ({fleet.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('driver')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'driver'
                ? 'border-orange-500 text-orange-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Driver & Kru ({drivers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('hotel')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'hotel'
                ? 'border-orange-500 text-orange-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Hotel className="w-4 h-4" />
            <span>Hotel Mitra & Kuota Kamar ({hotels.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Armada / Fleet */}
      {activeTab === 'armada' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Daftar seluruh unit Avanza, Innova, HiAce, Elf & Bus</span>
            <div className="flex items-center gap-2">
              <span>Filter Status:</span>
              <select
                value={filterFleetStatus}
                onChange={(e) => setFilterFleetStatus(e.target.value)}
                className="py-1 px-2.5 bg-white border border-neutral-200 rounded-lg font-medium text-xs text-neutral-700"
              >
                <option value="all">Semua Status</option>
                <option value="tersedia">Tersedia</option>
                <option value="ditugaskan">Ditugaskan</option>
                <option value="perjalanan">Dalam Perjalanan</option>
                <option value="maintenance">Servis</option>
              </select>
            </div>
          </div>

          {filteredFleet.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center shadow-2xs space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                <Car className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Belum Ada Unit Armada Terdaftar</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Data armada operasional masih kosong. Super Admin dapat mendaftarkan unit kendaraan resmi melalui tombol Tambah Armada.
              </p>
              {isSuperAdmin && (
                <button
                  onClick={() => setIsAddFleetOpen(true)}
                  className="mt-2 py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Unit Armada Pertama</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFleet.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header card */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200">
                        {unit.plateNumber}
                      </span>
                      <h3 className="text-sm font-bold text-neutral-900 mt-1.5">
                        {unit.name}
                      </h3>
                      <span className="text-[11px] text-neutral-500 block">
                        {unit.typeLabel} · Kapasitas {unit.capacitySeats} Penumpang · Base {unit.baseCity}
                      </span>
                    </div>
                    <div>{getStatusBadge(unit.status)}</div>
                  </div>

                  {/* Synchronized Order Info */}
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs space-y-1.5">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                      Sinkronisasi Pesanan Aktif:
                    </span>
                    {unit.currentOrderId ? (
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-orange-700 block">
                          Order #{unit.currentOrderId}
                        </span>
                        <span className="text-[11px] text-neutral-600 block truncate">
                          {unit.assignedTour}
                        </span>
                        {unit.driverName && (
                          <span className="text-[11px] text-blue-700 font-semibold block">
                            Driver: {unit.driverName}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-neutral-400 italic">Siaga di pool ({unit.baseCity})</span>
                    )}
                  </div>

                  {/* Facilities */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {unit.facilities.map((fac, idx) => (
                      <span key={idx} className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Super Admin Edit & Delete Actions */}
                {isSuperAdmin ? (
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openFleetEdit(unit)}
                      className="py-1 px-2.5 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-orange-500" />
                      <span>Edit Armada</span>
                    </button>
                    <button
                      onClick={() => setDeletingFleet(unit)}
                      className="py-1 px-2 text-xs text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Unit Armada"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 text-[10px] text-neutral-400 italic">
                    *Hak akses edit & hapus khusus Super Admin
                  </div>
                )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Driver & Crew */}
      {activeTab === 'driver' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
          {drivers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Belum Ada Driver Terdaftar</h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                Data kru supir/pengemudi masih kosong. Super Admin dapat mendaftarkan kru supir resmi melalui tombol Tambah Driver di bawah.
              </p>
              {isSuperAdmin && (
                <button
                  onClick={() => setIsAddDriverOpen(true)}
                  className="mt-2 py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Driver Pertama</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Nama Driver</th>
                    <th className="py-3 px-4">Kontak WhatsApp</th>
                    <th className="py-3 px-4">Lisensi Mengemudi</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Pesanan Aktif</th>
                    <th className="py-3 px-4">Total Trip & Rating</th>
                    {isSuperAdmin && <th className="py-3 px-4 text-center">Aksi Super Admin</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {drivers.map((drv) => (
                    <tr key={drv.id} className="hover:bg-neutral-50/70">
                      <td className="py-3.5 px-4 font-bold text-neutral-900">{drv.name}</td>
                      <td className="py-3.5 px-4 font-mono text-neutral-700">{drv.phone}</td>
                      <td className="py-3.5 px-4 font-semibold text-neutral-800">{drv.licenseType}</td>
                      <td className="py-3.5 px-4">
                        {drv.status === 'tersedia' ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800">Tersedia</span>
                        ) : drv.status === 'ditugaskan' ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800">Ditugaskan</span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-neutral-100 text-neutral-700">Istirahat</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {drv.currentOrderId ? (
                          <span className="font-mono text-xs font-bold text-orange-800">#{drv.currentOrderId}</span>
                        ) : (
                          <span className="text-neutral-400 italic">Siaga</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-neutral-800">{drv.totalTripsCompleted} Trip</span>
                        <span className="text-amber-500 font-bold ml-2">★ {drv.rating}</span>
                      </td>
                      {isSuperAdmin && (
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openDriverEdit(drv)}
                              className="py-1 px-2.5 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center gap-1 transition-colors"
                              title="Edit Data Driver"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-orange-500" />
                              <span>Edit Driver</span>
                            </button>
                            <button
                              onClick={() => setDeletingDriver(drv)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Hapus Driver"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Hotel Partners & Room Quotas */}
      {activeTab === 'hotel' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                    Total Hotel Mitra
                  </span>
                  <span className="text-base font-extrabold text-neutral-900">
                    {hotels.length} Hotel
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <BedDouble className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                    Sisa Kuota Kamar
                  </span>
                  <span className="text-base font-extrabold text-emerald-600">
                    {totalHotelQuota} Kamar Siap
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                    Rata-Rata Kelas
                  </span>
                  <span className="text-base font-extrabold text-amber-600">
                    ★ {avgStarRating} Bintang
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                    Rata-Rata Tarif
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-blue-600 truncate block">
                    Rp {avgPricePerNight.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search, Filter & Add Action Bar */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={hotelSearchQuery}
                  onChange={(e) => setHotelSearchQuery(e.target.value)}
                  placeholder="Cari hotel, tipe kamar, atau kota..."
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-200 focus:border-orange-500 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 outline-none transition-all"
                />
                {hotelSearchQuery && (
                  <button
                    onClick={() => setHotelSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Region filter */}
              <select
                value={hotelRegionFilter}
                onChange={(e) => setHotelRegionFilter(e.target.value as any)}
                className="py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 outline-none focus:border-orange-500"
              >
                <option value="all">Semua Wilayah</option>
                <option value="jogja">Yogyakarta (Jogja)</option>
                <option value="malang">Malang & Batu</option>
                <option value="bali">Bali</option>
              </select>

              {/* Quota filter */}
              <select
                value={hotelQuotaFilter}
                onChange={(e) => setHotelQuotaFilter(e.target.value as any)}
                className="py-2 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 outline-none focus:border-orange-500"
              >
                <option value="all">Semua Status Kuota</option>
                <option value="low">Kuota Menipis (&lt; 10 Kamar)</option>
                <option value="normal">Kuota Tersedia (≥ 10 Kamar)</option>
              </select>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={() => setIsAddHotelOpen(true)}
              className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Hotel Mitra</span>
            </button>
          </div>

          {/* Hotel Grid */}
          {filteredHotels.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-500 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900">
                Tidak ada data hotel mitra yang ditemukan
              </h4>
              <p className="text-xs text-neutral-500 max-w-md mx-auto">
                {hotelSearchQuery || hotelRegionFilter !== 'all' || hotelQuotaFilter !== 'all'
                  ? 'Coba sesuaikan kata kunci pencarian atau reset filter wilayah dan kuota kamar.'
                  : 'Belum ada data hotel mitra yang tersimpan di sistem. Silakan klik tombol di bawah untuk menambahkan hotel baru.'}
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                {(hotelSearchQuery || hotelRegionFilter !== 'all' || hotelQuotaFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setHotelSearchQuery('');
                      setHotelRegionFilter('all');
                      setHotelQuotaFilter('all');
                    }}
                    className="py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Reset Filter
                  </button>
                )}
                <button
                  onClick={() => setIsAddHotelOpen(true)}
                  className="py-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Hotel Baru</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredHotels.map((htl) => {
                const isCriticalQuota = htl.quotaAvailable < 5;
                const isWarningQuota = htl.quotaAvailable >= 5 && htl.quotaAvailable < 10;

                const cityColorClasses =
                  htl.city === 'jogja'
                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                    : htl.city === 'malang'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                return (
                  <div
                    key={htl.id}
                    className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      {/* Card Header: Region & Star Rating */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cityColorClasses}`}>
                            {htl.cityLabel}
                          </span>
                          <h3 className="text-sm font-extrabold text-neutral-900 mt-1.5 leading-snug">
                            {htl.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg text-amber-500 shrink-0">
                          {Array.from({ length: htl.starRating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-[11px] font-bold text-amber-800 ml-1">
                            {htl.starRating}.0
                          </span>
                        </div>
                      </div>

                      {/* Room & Quota Panel */}
                      <div className="p-3.5 bg-neutral-50/80 rounded-2xl border border-neutral-200/80 text-xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500 flex items-center gap-1.5">
                            <BedDouble className="w-3.5 h-3.5 text-neutral-400" />
                            Tipe Kamar:
                          </span>
                          <span className="font-bold text-neutral-800 text-right truncate max-w-[150px]">
                            {htl.roomType}
                          </span>
                        </div>

                        {/* Quota display with quick +/- */}
                        <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60">
                          <span className="text-neutral-500">Sisa Kuota Kamar:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleQuickAdjustQuota(htl, -1)}
                              disabled={htl.quotaAvailable <= 0}
                              title="Kurangi kuota 1 kamar"
                              className="w-5 h-5 rounded-md bg-white hover:bg-neutral-200 border border-neutral-300 text-neutral-700 font-bold flex items-center justify-center text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              -
                            </button>
                            <span
                              className={`px-2 py-0.5 text-[11px] font-extrabold rounded-md border ${
                                isCriticalQuota
                                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                                  : isWarningQuota
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              {htl.quotaAvailable} Kamar
                            </span>
                            <button
                              onClick={() => handleQuickAdjustQuota(htl, 1)}
                              title="Tambah kuota 1 kamar"
                              className="w-5 h-5 rounded-md bg-white hover:bg-neutral-200 border border-neutral-300 text-neutral-700 font-bold flex items-center justify-center text-xs transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Price per night */}
                        <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60">
                          <span className="text-neutral-500">Harga Kontrak:</span>
                          <span className="font-mono font-bold text-neutral-900 text-xs">
                            Rp {htl.pricePerNight.toLocaleString('id-ID')}{' '}
                            <span className="text-[10px] font-normal text-neutral-500">/ mlm</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Edit & Delete */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openHotelEdit(htl)}
                        className="py-1.5 px-3 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-orange-500" />
                        <span>Edit Hotel & Kuota</span>
                      </button>
                      <button
                        onClick={() => setDeletingHotel(htl)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Hapus Hotel Mitra"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Edit Fleet Modal */}
      {editingFleet && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setEditingFleet(null)} />
          <form
            onSubmit={handleSaveFleetEdit}
            className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 z-10 border border-neutral-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                  Super Admin Console
                </span>
                <h3 className="text-base font-bold text-neutral-900">Edit Data Armada Kendaraan</h3>
              </div>
              <button type="button" onClick={() => setEditingFleet(null)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Nama / Merk Kendaraan *</label>
                <input
                  type="text"
                  value={editFleetName}
                  onChange={(e) => setEditFleetName(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Nomor Polisi (Plat Nomor) *</label>
                <input
                  type="text"
                  value={editFleetPlate}
                  onChange={(e) => setEditFleetPlate(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Kategori Tipe</label>
                  <select
                    value={editFleetType}
                    onChange={(e) => setEditFleetType(e.target.value as FleetType)}
                    className="w-full py-2 px-2 border border-neutral-300 rounded-xl font-medium"
                  >
                    <option value="avanza">Toyota Avanza</option>
                    <option value="innova">Toyota Innova Reborn</option>
                    <option value="hiace_premio">HiAce Premio Luxury</option>
                    <option value="hiace_commuter">HiAce Commuter</option>
                    <option value="elf_long">Isuzu Elf Long</option>
                    <option value="medium_bus">Medium Bus</option>
                    <option value="big_bus">Big Bus SHD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Kapasitas Kursi</label>
                  <input
                    type="number"
                    min={1}
                    value={editFleetCapacity}
                    onChange={(e) => setEditFleetCapacity(Number(e.target.value))}
                    required
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Status Kesiapan</label>
                  <select
                    value={editFleetStatus}
                    onChange={(e) => setEditFleetStatus(e.target.value as FleetStatus)}
                    className="w-full py-2 px-2 border border-neutral-300 rounded-xl font-medium"
                  >
                    <option value="tersedia">Tersedia (Ready)</option>
                    <option value="ditugaskan">Ditugaskan</option>
                    <option value="perjalanan">Dalam Perjalanan</option>
                    <option value="maintenance">Servis / Bengkel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Kota Pangkalan</label>
                  <select
                    value={editFleetBaseCity}
                    onChange={(e) => setEditFleetBaseCity(e.target.value)}
                    className="w-full py-2 px-2 border border-neutral-300 rounded-xl"
                  >
                    <option value="Yogyakarta">Yogyakarta</option>
                    <option value="Malang">Malang</option>
                    <option value="Bali">Bali</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setEditingFleet(null)}
                className="py-2 px-3.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2 px-4 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Driver Modal */}
      {editingDriver && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setEditingDriver(null)} />
          <form
            onSubmit={handleSaveDriverEdit}
            className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 z-10 border border-neutral-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                  Super Admin Console
                </span>
                <h3 className="text-base font-bold text-neutral-900">Edit Data Driver</h3>
              </div>
              <button type="button" onClick={() => setEditingDriver(null)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Nama Lengkap Driver *</label>
                <input
                  type="text"
                  value={editDriverName}
                  onChange={(e) => setEditDriverName(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  value={editDriverPhone}
                  onChange={(e) => setEditDriverPhone(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Jenis Lisensi SIM</label>
                  <select
                    value={editDriverLicense}
                    onChange={(e) => setEditDriverLicense(e.target.value)}
                    className="w-full py-2 px-2 border border-neutral-300 rounded-xl"
                  >
                    <option value="SIM A">SIM A (Avanza / Innova)</option>
                    <option value="SIM B1 Umum">SIM B1 Umum (HiAce / Elf)</option>
                    <option value="SIM B2 Umum">SIM B2 Umum (Bus Pariwisata)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Status Kesiapan</label>
                  <select
                    value={editDriverStatus}
                    onChange={(e) => setEditDriverStatus(e.target.value as DriverCrew['status'])}
                    className="w-full py-2 px-2 border border-neutral-300 rounded-xl"
                  >
                    <option value="tersedia">Tersedia (Ready)</option>
                    <option value="ditugaskan">Ditugaskan</option>
                    <option value="istirahat">Istirahat / Libur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Rating Pengemudi (1 - 5)</label>
                <input
                  type="number"
                  step={0.1}
                  min={1}
                  max={5}
                  value={editDriverRating}
                  onChange={(e) => setEditDriverRating(Number(e.target.value))}
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setEditingDriver(null)}
                className="py-2 px-3.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2 px-4 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Driver</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Fleet Modal */}
      {isAddFleetOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setIsAddFleetOpen(false)} />
          <form
            onSubmit={handleCreateFleet}
            className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 z-10 border border-neutral-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">Tambah Unit Armada Baru</h3>
              <button type="button" onClick={() => setIsAddFleetOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Nama / Merk Kendaraan</label>
                <input
                  type="text"
                  placeholder="Contoh: Toyota Avanza Veloz Baru 08"
                  value={newFleetName}
                  onChange={(e) => setNewFleetName(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Nomor Polisi (Plat Nomor)</label>
                <input
                  type="text"
                  placeholder="Contoh: AB 9988 ZZ"
                  value={newFleetPlate}
                  onChange={(e) => setNewFleetPlate(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Kategori Armada</label>
                  <select
                    value={newFleetType}
                    onChange={(e) => {
                      const t = e.target.value as FleetType;
                      setNewFleetType(t);
                      if (t === 'avanza') setNewFleetCapacity(5);
                      else if (t === 'innova') setNewFleetCapacity(7);
                      else if (t === 'hiace_premio') setNewFleetCapacity(14);
                      else if (t === 'hiace_commuter') setNewFleetCapacity(15);
                      else if (t === 'medium_bus') setNewFleetCapacity(33);
                      else if (t === 'big_bus') setNewFleetCapacity(50);
                    }}
                    className="w-full py-2 px-2 border border-neutral-300 rounded-xl"
                  >
                    <option value="avanza">Toyota Avanza (1-5 Pax)</option>
                    <option value="innova">Toyota Innova Reborn (4-7 Pax)</option>
                    <option value="hiace_premio">HiAce Premio Luxury</option>
                    <option value="hiace_commuter">HiAce Commuter</option>
                    <option value="elf_long">Isuzu Elf Long</option>
                    <option value="medium_bus">Medium Bus</option>
                    <option value="big_bus">Big Bus SHD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Kapasitas Kursi</label>
                  <input
                    type="number"
                    value={newFleetCapacity}
                    onChange={(e) => setNewFleetCapacity(Number(e.target.value))}
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Kota Pangkalan (Base)</label>
                <select
                  value={newFleetBaseCity}
                  onChange={(e) => setNewFleetBaseCity(e.target.value)}
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl"
                >
                  <option value="Yogyakarta">Yogyakarta</option>
                  <option value="Malang">Malang</option>
                  <option value="Bali">Bali</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setIsAddFleetOpen(false)}
                className="py-2 px-3.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2 px-4 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl"
              >
                Simpan Armada
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Driver Modal */}
      {isAddDriverOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setIsAddDriverOpen(false)} />
          <form
            onSubmit={handleCreateDriver}
            className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 z-10 border border-neutral-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">Daftarkan Driver Baru</h3>
              <button type="button" onClick={() => setIsAddDriverOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Nama Lengkap Driver</label>
                <input
                  type="text"
                  placeholder="Contoh: Slamet Riyadi"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Nomor WhatsApp Aktif</label>
                <input
                  type="tel"
                  placeholder="Contoh: 0812-9876-0011"
                  value={newDriverPhone}
                  onChange={(e) => setNewDriverPhone(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Jenis Lisensi SIM</label>
                <select
                  value={newDriverLicense}
                  onChange={(e) => setNewDriverLicense(e.target.value)}
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl"
                >
                  <option value="SIM A">SIM A (Avanza / Innova)</option>
                  <option value="SIM B1 Umum">SIM B1 Umum (HiAce / Elf)</option>
                  <option value="SIM B2 Umum">SIM B2 Umum (Bus Medium / Big Bus)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setIsAddDriverOpen(false)}
                className="py-2 px-3.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2 px-4 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl"
              >
                Simpan Driver
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Fleet Modal */}
      {deletingFleet && (
        <DeleteConfirmModal
          isOpen={true}
          title="Konfirmasi Hapus Unit Armada"
          message="Menghapus unit kendaraan ini dari inventaris perusahaan. Tindakan ini hanya dapat dilakukan oleh Super Admin."
          confirmItemName={deletingFleet ? `${deletingFleet.name} (${deletingFleet.plateNumber})` : undefined}
          onClose={() => setDeletingFleet(null)}
          onConfirm={() => {
            if (deletingFleet) {
              deleteFleet(deletingFleet.id);
              setDeletingFleet(null);
            }
          }}
        />
      )}

      {/* Delete Driver Modal */}
      {deletingDriver && (
        <DeleteConfirmModal
          isOpen={true}
          title="Konfirmasi Hapus Data Driver"
          message="Menghapus data pengemudi ini secara permanen dari sistem. Tindakan ini hanya dapat dilakukan oleh Super Admin."
          confirmItemName={deletingDriver ? `${deletingDriver.name} (${deletingDriver.phone})` : undefined}
          onClose={() => setDeletingDriver(null)}
          onConfirm={() => {
            if (deletingDriver) {
              deleteDriver(deletingDriver.id);
              setDeletingDriver(null);
            }
          }}
        />
      )}

      {/* Edit Hotel Modal */}
      {editingHotel && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setEditingHotel(null)} />
          <form
            onSubmit={handleSaveHotelEdit}
            className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 z-10 border border-neutral-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                  Super Admin Console
                </span>
                <h3 className="text-base font-extrabold text-neutral-900">
                  Edit Data Hotel Mitra & Kuota Kamar
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingHotel(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Nama Hotel Mitra</label>
                <input
                  type="text"
                  value={editHotelName}
                  onChange={(e) => setEditHotelName(e.target.value)}
                  placeholder="Contoh: Gaia Cosmo Hotel Malioboro"
                  required
                  className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Wilayah / Kota</label>
                  <select
                    value={editHotelCity}
                    onChange={(e) => setEditHotelCity(e.target.value as DestinationRegion)}
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none bg-white font-medium"
                  >
                    <option value="jogja">Yogyakarta (Jogja)</option>
                    <option value="malang">Malang & Batu</option>
                    <option value="bali">Bali</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Kelas Bintang Hotel</label>
                  <div className="flex items-center gap-1 py-1 px-2 border border-neutral-300 rounded-xl bg-neutral-50 h-[42px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditHotelStarRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= editHotelStarRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-[11px] font-bold text-neutral-600 ml-auto mr-1">
                      {editHotelStarRating} Bintang
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Tipe Kamar Sesuai Kontrak</label>
                <input
                  type="text"
                  value={editHotelRoomType}
                  onChange={(e) => setEditHotelRoomType(e.target.value)}
                  placeholder="Contoh: Deluxe Twin / King / Superior Room"
                  required
                  className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Sisa Kuota Kamar Siap</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={editHotelQuota}
                      onChange={(e) => setEditHotelQuota(parseInt(e.target.value) || 0)}
                      required
                      className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">
                      Kamar
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Harga Kontrak / Malam (Rp)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      step={50000}
                      value={editHotelPrice}
                      onChange={(e) => setEditHotelPrice(parseInt(e.target.value) || 0)}
                      required
                      className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none font-mono font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">
                      / mlm
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setEditingHotel(null)}
                className="py-2.5 px-4 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Hotel Modal */}
      {isAddHotelOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setIsAddHotelOpen(false)} />
          <form
            onSubmit={handleCreateHotel}
            className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 z-10 border border-neutral-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                  Registrasi Mitra Baru
                </span>
                <h3 className="text-base font-extrabold text-neutral-900">
                  Tambah Hotel Mitra & Alokasi Kuota Kamar
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddHotelOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Nama Hotel Mitra</label>
                <input
                  type="text"
                  value={newHotelName}
                  onChange={(e) => setNewHotelName(e.target.value)}
                  placeholder="Contoh: Eastparc Hotel Yogyakarta / The Stones Legian Bali"
                  required
                  className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Wilayah / Kota</label>
                  <select
                    value={newHotelCity}
                    onChange={(e) => setNewHotelCity(e.target.value as DestinationRegion)}
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none bg-white font-medium"
                  >
                    <option value="jogja">Yogyakarta (Jogja)</option>
                    <option value="malang">Malang & Batu</option>
                    <option value="bali">Bali</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Kelas Bintang Hotel</label>
                  <div className="flex items-center gap-1 py-1 px-2 border border-neutral-300 rounded-xl bg-neutral-50 h-[42px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewHotelStarRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newHotelStarRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-[11px] font-bold text-neutral-600 ml-auto mr-1">
                      {newHotelStarRating} Bintang
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Tipe Kamar Sesuai Kontrak</label>
                <input
                  type="text"
                  value={newHotelRoomType}
                  onChange={(e) => setNewHotelRoomType(e.target.value)}
                  placeholder="Contoh: Deluxe Twin / Superior / Premier Suite"
                  required
                  className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Alokasi Awal Kuota Kamar</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={newHotelQuota}
                      onChange={(e) => setNewHotelQuota(parseInt(e.target.value) || 0)}
                      required
                      className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">
                      Kamar
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Harga Kontrak / Malam (Rp)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={100000}
                      step={50000}
                      value={newHotelPrice}
                      onChange={(e) => setNewHotelPrice(parseInt(e.target.value) || 0)}
                      required
                      className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none font-mono font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">
                      / mlm
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setIsAddHotelOpen(false)}
                className="py-2.5 px-4 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Simpan Hotel Mitra</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Hotel Modal */}
      {deletingHotel && (
        <DeleteConfirmModal
          isOpen={true}
          title="Konfirmasi Hapus Hotel Mitra"
          message="Menghapus hotel mitra dan seluruh kuota kamar ini secara permanen dari sistem inventaris PERGIDIANTAR. Tindakan ini hanya dapat dilakukan oleh Super Admin."
          confirmItemName={deletingHotel ? `${deletingHotel.name} (${deletingHotel.cityLabel})` : undefined}
          onClose={() => setDeletingHotel(null)}
          onConfirm={() => {
            if (deletingHotel) {
              deleteHotel(deletingHotel.id);
              setDeletingHotel(null);
            }
          }}
        />
      )}
    </div>
  );
};
