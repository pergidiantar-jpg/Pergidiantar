import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FleetUnit, DriverCrew, FleetStatus, FleetType } from '../../types/travel';
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
  Check
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
    currentRole 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'armada' | 'driver' | 'hotel'>('armada');
  const [filterFleetStatus, setFilterFleetStatus] = useState<string>('all');
  
  // Add modals
  const [isAddFleetOpen, setIsAddFleetOpen] = useState(false);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

  // Edit states
  const [editingFleet, setEditingFleet] = useState<FleetUnit | null>(null);
  const [editingDriver, setEditingDriver] = useState<DriverCrew | null>(null);
  
  // Delete modals
  const [deletingFleet, setDeletingFleet] = useState<FleetUnit | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<DriverCrew | null>(null);

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
              Manajemen Inventaris Armada & Driver
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Kelola unit kendaraan (Avanza, Innova, Hi-Ace, Bus), penugasan supir, serta pantau sinkronisasi otomatis dengan pesanan aktif.
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
        </div>
      )}

      {/* Tab 2: Driver & Crew */}
      {activeTab === 'driver' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
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
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Edit Driver"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-orange-500" />
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

      {/* Tab 3: Hotel Partners */}
      {activeTab === 'hotel' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hotels.map((htl) => (
            <div key={htl.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wide">
                    {htl.cityLabel}
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900 mt-0.5">{htl.name}</h3>
                </div>
                <div className="flex text-amber-500 text-xs">
                  {Array.from({ length: htl.starRating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Tipe Kamar:</span>
                  <span className="font-semibold text-neutral-800">{htl.roomType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Sisa Kuota Kamar:</span>
                  <span className="font-bold text-emerald-700">{htl.quotaAvailable} Kamar Siap</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-neutral-200">
                  <span className="text-neutral-500">Harga Kontrak:</span>
                  <span className="font-mono font-bold text-neutral-900" data-tabular>Rp {htl.pricePerNight.toLocaleString('id-ID')} / malam</span>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
};
