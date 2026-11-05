import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VendorPayment, VendorCategory } from '../../types/travel';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { 
  CreditCard, 
  Users, 
  Hotel, 
  Car, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Printer, 
  FileText, 
  DollarSign, 
  X, 
  Eye, 
  Calendar,
  Building2,
  Check,
  Download,
  Share2
} from 'lucide-react';

export const VendorPaymentManagement: React.FC = () => {
  const { 
    vendorPayments, 
    addVendorPayment, 
    updateVendorPayment, 
    deleteVendorPayment, 
    updateVendorPaymentStatus,
    drivers,
    hotels,
    orders,
    currentRole 
  } = useApp();

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState<VendorCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'selesai' | 'menunggu' | 'proses'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<VendorPayment | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<VendorPayment | null>(null);
  const [viewingVoucher, setViewingVoucher] = useState<VendorPayment | null>(null);

  // New Payment Form State
  const [newCategory, setNewCategory] = useState<VendorCategory>('driver');
  const [newVendorName, setNewVendorName] = useState('');
  const [newRecipientContact, setNewRecipientContact] = useState('');
  const [newOrderId, setNewOrderId] = useState('');
  const [newAmount, setNewAmount] = useState<number>(1000000);
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newStatus, setNewStatus] = useState<'selesai' | 'menunggu' | 'proses'>('selesai');
  const [newMethod, setNewMethod] = useState<VendorPayment['paymentMethod']>('transfer_bca');
  const [newBankAccount, setNewBankAccount] = useState('');
  const [newRefNumber, setNewRefNumber] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Edit Payment Form State
  const [editCategory, setEditCategory] = useState<VendorCategory>('driver');
  const [editVendorName, setEditVendorName] = useState('');
  const [editRecipientContact, setEditRecipientContact] = useState('');
  const [editOrderId, setEditOrderId] = useState('');
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editDate, setEditDate] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'selesai' | 'menunggu' | 'proses'>('selesai');
  const [editMethod, setEditMethod] = useState<VendorPayment['paymentMethod']>('transfer_bca');
  const [editBankAccount, setEditBankAccount] = useState('');
  const [editRefNumber, setEditRefNumber] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const isSuperAdmin = currentRole === 'super_admin';

  // Filter Payments
  const filteredPayments = vendorPayments.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      p.vendorName.toLowerCase().includes(q) ||
      p.paymentNumber.toLowerCase().includes(q) ||
      (p.relatedOrderNumber && p.relatedOrderNumber.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q) ||
      (p.bankAccount && p.bankAccount.toLowerCase().includes(q));

    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Category counts and metrics
  const totalDisbursements = vendorPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = vendorPayments.filter(p => p.status === 'selesai').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = vendorPayments.filter(p => p.status === 'menunggu').reduce((sum, p) => sum + p.amount, 0);

  const driverTotal = vendorPayments.filter(p => p.category === 'driver').reduce((sum, p) => sum + p.amount, 0);
  const hotelTotal = vendorPayments.filter(p => p.category === 'hotel').reduce((sum, p) => sum + p.amount, 0);
  const vehicleTotal = vendorPayments.filter(p => p.category === 'vehicle_vendor').reduce((sum, p) => sum + p.amount, 0);
  const touristSpotTotal = vendorPayments.filter(p => p.category === 'tourist_spot').reduce((sum, p) => sum + p.amount, 0);

  const driverCount = vendorPayments.filter(p => p.category === 'driver').length;
  const hotelCount = vendorPayments.filter(p => p.category === 'hotel').length;
  const vehicleCount = vendorPayments.filter(p => p.category === 'vehicle_vendor').length;
  const touristSpotCount = vendorPayments.filter(p => p.category === 'tourist_spot').length;

  const getCategoryLabel = (cat: VendorCategory) => {
    switch (cat) {
      case 'driver': return 'Pembayaran Driver & Kru';
      case 'hotel': return 'Pembayaran Hotel Mitra';
      case 'vehicle_vendor': return 'Pembayaran Vendor Kendaraan';
      case 'tourist_spot': return 'Pembayaran Tiket Tempat Wisata';
      default: return 'Pembayaran Vendor';
    }
  };

  const getMethodLabel = (method: VendorPayment['paymentMethod']) => {
    switch (method) {
      case 'transfer_bca': return 'Transfer Bank BCA';
      case 'transfer_mandiri': return 'Transfer Bank Mandiri';
      case 'transfer_bri': return 'Transfer Bank BRI';
      case 'kas_operasional': return 'Kas Operasional / Tunai';
      case 'qris': return 'QRIS Vendor';
      default: return 'Transfer Bank';
    }
  };

  const handleOpenEdit = (p: VendorPayment) => {
    setEditingPayment(p);
    setEditCategory(p.category);
    setEditVendorName(p.vendorName);
    setEditRecipientContact(p.recipientContact || '');
    setEditOrderId(p.relatedOrderId || '');
    setEditAmount(p.amount);
    setEditDate(p.date);
    setEditStatus(p.status);
    setEditMethod(p.paymentMethod);
    setEditBankAccount(p.bankAccount || '');
    setEditRefNumber(p.referenceNumber || '');
    setEditDescription(p.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment || !editVendorName.trim() || editAmount <= 0) return;

    const matchedOrder = orders.find(o => o.id === editOrderId);

    updateVendorPayment({
      ...editingPayment,
      category: editCategory,
      categoryLabel: getCategoryLabel(editCategory),
      vendorName: editVendorName.trim(),
      recipientContact: editRecipientContact.trim(),
      relatedOrderId: editOrderId || undefined,
      relatedOrderNumber: matchedOrder?.orderNumber || editingPayment.relatedOrderNumber,
      packageName: matchedOrder?.packageTitle || editingPayment.packageName,
      destination: matchedOrder?.destinationLabel || editingPayment.destination,
      amount: Number(editAmount),
      date: editDate,
      status: editStatus,
      paymentMethod: editMethod,
      paymentMethodLabel: getMethodLabel(editMethod),
      bankAccount: editBankAccount.trim(),
      referenceNumber: editRefNumber.trim(),
      description: editDescription.trim()
    });

    setEditingPayment(null);
  };

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim() || newAmount <= 0) return;

    const matchedOrder = orders.find(o => o.id === newOrderId);

    addVendorPayment({
      category: newCategory,
      categoryLabel: getCategoryLabel(newCategory),
      vendorName: newVendorName.trim(),
      recipientContact: newRecipientContact.trim(),
      relatedOrderId: newOrderId || undefined,
      relatedOrderNumber: matchedOrder?.orderNumber,
      packageName: matchedOrder?.packageTitle,
      destination: matchedOrder?.destinationLabel,
      amount: Number(newAmount),
      date: newDate,
      status: newStatus,
      paymentMethod: newMethod,
      paymentMethodLabel: getMethodLabel(newMethod),
      bankAccount: newBankAccount.trim(),
      referenceNumber: newRefNumber.trim() || `REF-${Date.now().toString().slice(-6)}`,
      description: newDescription.trim() || `Pengeluaran ${getCategoryLabel(newCategory)}`,
      approvedBy: newStatus === 'selesai' ? 'Super Admin (Benisius Rahmat Basuki)' : undefined
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewVendorName('');
    setNewRecipientContact('');
    setNewOrderId('');
    setNewAmount(1000000);
    setNewBankAccount('');
    setNewRefNumber('');
    setNewDescription('');
    setNewStatus('selesai');
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-bold uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5 text-orange-600" />
              <span>Manajemen Keuangan Operasional & Vendor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Pusat Pembayaran Mitra & Vendor (Disbursement)
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Pengelolaan pengeluaran biaya operasional wisata: <strong>Pembayaran Driver</strong>, <strong>Pelunasan Hotel Mitra</strong>, <strong>Sewa Vendor Kendaraan</strong>, dan <strong>Tiket Masuk Tempat Wisata</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Pembayaran Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Stat Chips for All 4 Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Category 1: Driver */}
        <div 
          onClick={() => setActiveCategory(activeCategory === 'driver' ? 'all' : 'driver')}
          className={`bg-white rounded-2xl border p-4 shadow-2xs cursor-pointer transition-all ${
            activeCategory === 'driver' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider truncate">
                Pembayaran Driver
              </span>
              <span className="text-sm sm:text-base font-extrabold text-neutral-900 truncate block">
                Rp {driverTotal.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block">
                {driverCount} Transaksi Supir
              </span>
            </div>
          </div>
        </div>

        {/* Category 2: Hotel */}
        <div 
          onClick={() => setActiveCategory(activeCategory === 'hotel' ? 'all' : 'hotel')}
          className={`bg-white rounded-2xl border p-4 shadow-2xs cursor-pointer transition-all ${
            activeCategory === 'hotel' ? 'border-orange-500 ring-2 ring-orange-100' : 'border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <Hotel className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider truncate">
                Pembayaran ke Hotel
              </span>
              <span className="text-sm sm:text-base font-extrabold text-neutral-900 truncate block">
                Rp {hotelTotal.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-orange-600 font-semibold block">
                {hotelCount} Tagihan Kamar
              </span>
            </div>
          </div>
        </div>

        {/* Category 3: Vehicle Vendor */}
        <div 
          onClick={() => setActiveCategory(activeCategory === 'vehicle_vendor' ? 'all' : 'vehicle_vendor')}
          className={`bg-white rounded-2xl border p-4 shadow-2xs cursor-pointer transition-all ${
            activeCategory === 'vehicle_vendor' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Car className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider truncate">
                Vendor Kendaraan
              </span>
              <span className="text-sm sm:text-base font-extrabold text-neutral-900 truncate block">
                Rp {vehicleTotal.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-blue-600 font-semibold block">
                {vehicleCount} Sewa Unit Pool
              </span>
            </div>
          </div>
        </div>

        {/* Category 4: Tourist Spot */}
        <div 
          onClick={() => setActiveCategory(activeCategory === 'tourist_spot' ? 'all' : 'tourist_spot')}
          className={`bg-white rounded-2xl border p-4 shadow-2xs cursor-pointer transition-all ${
            activeCategory === 'tourist_spot' ? 'border-purple-500 ring-2 ring-purple-100' : 'border-neutral-200 hover:border-neutral-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider truncate">
                Tiket Tempat Wisata
              </span>
              <span className="text-sm sm:text-base font-extrabold text-neutral-900 truncate block">
                Rp {touristSpotTotal.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-purple-600 font-semibold block">
                {touristSpotCount} Tiket Destinasi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-3 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold">
            <button
              onClick={() => setActiveCategory('all')}
              className={`py-2 px-3 rounded-xl transition-colors whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-neutral-900 text-white font-bold'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              Semua Kategori ({vendorPayments.length})
            </button>

            <button
              onClick={() => setActiveCategory('driver')}
              className={`py-2 px-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'driver'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Pembayaran Driver ({driverCount})</span>
            </button>

            <button
              onClick={() => setActiveCategory('hotel')}
              className={`py-2 px-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'hotel'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
              }`}
            >
              <Hotel className="w-3.5 h-3.5" />
              <span>Pembayaran ke Hotel ({hotelCount})</span>
            </button>

            <button
              onClick={() => setActiveCategory('vehicle_vendor')}
              className={`py-2 px-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'vehicle_vendor'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Vendor Kendaraan ({vehicleCount})</span>
            </button>

            <button
              onClick={() => setActiveCategory('tourist_spot')}
              className={`py-2 px-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'tourist_spot'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Tiket Tempat Wisata ({touristSpotCount})</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-semibold hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-1.5 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 outline-none focus:border-orange-500"
            >
              <option value="all">Semua Status</option>
              <option value="selesai">Selesai / Lunas</option>
              <option value="menunggu">Menunggu Pembayaran</option>
              <option value="proses">Dalam Proses Bank</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 pt-3 border-t border-neutral-100">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama vendor, nomor pembayaran, order booking, rekening..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-200 focus:border-orange-500 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Payments Table / List */}
      {filteredPayments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-500 flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            Tidak ada transaksi pembayaran vendor ditemukan
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            {searchQuery || activeCategory !== 'all' || statusFilter !== 'all'
              ? 'Sesuaikan kata kunci pencarian atau filter kategori pembayaran.'
              : 'Belum ada catatan pembayaran vendor yang tersimpan di sistem.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Pembayaran Pertama</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-white font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">No. Transaksi</th>
                  <th className="py-3.5 px-4">Kategori & Penerima</th>
                  <th className="py-3.5 px-4">Terkait Order / Rute</th>
                  <th className="py-3.5 px-4">Tanggal & Metode</th>
                  <th className="py-3.5 px-4 text-right">Nominal (Rp)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredPayments.map((p) => {
                  const categoryBadgeColor = 
                    p.category === 'driver' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    p.category === 'hotel' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                    p.category === 'vehicle_vendor' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-purple-100 text-purple-800 border-purple-200';

                  const isSelesai = p.status === 'selesai';
                  const isMenunggu = p.status === 'menunggu';

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* No. Transaksi */}
                      <td className="py-4 px-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                        <span className="block text-orange-600 font-extrabold">{p.paymentNumber}</span>
                        <span className="text-[10px] text-neutral-400 font-normal">{p.createdAt}</span>
                      </td>

                      {/* Kategori & Penerima */}
                      <td className="py-4 px-4">
                        <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border mb-1 ${categoryBadgeColor}`}>
                          {p.categoryLabel}
                        </span>
                        <span className="font-bold text-neutral-900 block">{p.vendorName}</span>
                        {p.bankAccount && (
                          <span className="text-[11px] text-neutral-500 block truncate max-w-xs mt-0.5">
                            {p.bankAccount}
                          </span>
                        )}
                        <span className="text-[11px] text-neutral-600 italic block mt-0.5">
                          "{p.description}"
                        </span>
                      </td>

                      {/* Terkait Order */}
                      <td className="py-4 px-4">
                        {p.relatedOrderNumber ? (
                          <div>
                            <span className="font-mono text-xs font-bold text-neutral-800 block">
                              #{p.relatedOrderNumber}
                            </span>
                            <span className="text-[11px] text-neutral-500 block truncate max-w-[180px]">
                              {p.packageName || 'Paket Wisata Terjadwal'}
                            </span>
                            {p.destination && (
                              <span className="text-[10px] text-neutral-400 font-semibold block">
                                {p.destination}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">Pengeluaran Rutin / Non-Order</span>
                        )}
                      </td>

                      {/* Tanggal & Metode */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-semibold text-neutral-800 block">{p.date}</span>
                        <span className="text-[11px] text-neutral-500 block">{p.paymentMethodLabel}</span>
                        {p.referenceNumber && (
                          <span className="font-mono text-[10px] text-neutral-400 block">
                            Ref: {p.referenceNumber}
                          </span>
                        )}
                      </td>

                      {/* Nominal */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <span className="font-mono text-sm font-extrabold text-neutral-900" data-tabular>
                          Rp {p.amount.toLocaleString('id-ID')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {isSelesai ? (
                          <button
                            onClick={() => updateVendorPaymentStatus(p.id, 'menunggu')}
                            title="Klik untuk ubah status ke Menunggu"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-colors"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Lunas / Selesai</span>
                          </button>
                        ) : isMenunggu ? (
                          <button
                            onClick={() => updateVendorPaymentStatus(p.id, 'selesai')}
                            title="Klik untuk verifikasi Lunas"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 transition-colors"
                          >
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Menunggu Bayar</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => updateVendorPaymentStatus(p.id, 'selesai')}
                            title="Klik untuk verifikasi Lunas"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 transition-colors"
                          >
                            <AlertCircle className="w-3 h-3 text-blue-600" />
                            <span>Proses Bank</span>
                          </button>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Voucher Cetak */}
                          <button
                            onClick={() => setViewingVoucher(p)}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-lg transition-colors"
                            title="Lihat & Cetak Voucher Kas Keluar"
                          >
                            <FileText className="w-4 h-4 text-blue-600" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded-lg transition-colors"
                            title="Edit Data Pembayaran"
                          >
                            <Edit3 className="w-4 h-4 text-orange-600" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingPayment(p)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Catatan Pembayaran"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Catat Pembayaran Vendor Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          <form
            onSubmit={handleCreatePayment}
            className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl p-6 z-10 border border-neutral-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                  Disbursement Kas Keluar
                </span>
                <h3 className="text-base font-extrabold text-neutral-900">
                  Catat Pembayaran Mitra / Vendor Baru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Category selector */}
              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Kategori Pembayaran Vendor
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as VendorCategory)}
                  className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 font-bold outline-none bg-white"
                >
                  <option value="driver">1. Pembayaran Driver & Kru Wisata</option>
                  <option value="hotel">2. Pembayaran ke Hotel Mitra</option>
                  <option value="vehicle_vendor">3. Pembayaran Vendor Kendaraan (Sewa Pool / Rekanan)</option>
                  <option value="tourist_spot">4. Pembayaran Tiket Tempat Wisata (Destinasi)</option>
                </select>
              </div>

              {/* Vendor Name */}
              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Nama Vendor / Penerima
                </label>
                <input
                  type="text"
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  placeholder={
                    newCategory === 'driver' ? 'Contoh: Bambang Sudiro (Driver)' :
                    newCategory === 'hotel' ? 'Contoh: Gaia Cosmo Hotel Malioboro' :
                    newCategory === 'vehicle_vendor' ? 'Contoh: PO Nusantara Trans Mandiri' :
                    'Contoh: Pengelola Candi Prambanan'
                  }
                  required
                  className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none"
                />

                {/* Quick suggestions based on active category */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="text-[10px] text-neutral-400">Rekomendasi Cepat:</span>
                  {newCategory === 'driver' && drivers.slice(0, 3).map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setNewVendorName(d.name);
                        setNewRecipientContact(d.phone);
                        setNewBankAccount(`Rekening Bank a/n ${d.name}`);
                      }}
                      className="text-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-md"
                    >
                      {d.name}
                    </button>
                  ))}
                  {newCategory === 'hotel' && hotels.slice(0, 3).map(h => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        setNewVendorName(h.name);
                        setNewDescription(`Pelunasan kamar kuota ${h.name} (${h.cityLabel})`);
                      }}
                      className="text-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-md"
                    >
                      {h.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Jumlah Pembayaran (Rp)
                  </label>
                  <input
                    type="number"
                    min={10000}
                    step={50000}
                    value={newAmount}
                    onChange={(e) => setNewAmount(parseInt(e.target.value) || 0)}
                    required
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 font-mono font-bold text-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Tanggal Pembayaran
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 font-medium outline-none bg-white"
                  />
                </div>
              </div>

              {/* Related Order Link */}
              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Hubungkan ke Order Booking (Opsional)
                </label>
                <select
                  value={newOrderId}
                  onChange={(e) => setNewOrderId(e.target.value)}
                  className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                >
                  <option value="">-- Tanpa Kaitan Order Tertentu --</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>
                      #{o.orderNumber} - {o.customer.fullName} ({o.packageTitle} - {o.destinationLabel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method & Bank */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="transfer_bca">Transfer Bank BCA</option>
                    <option value="transfer_mandiri">Transfer Bank Mandiri</option>
                    <option value="transfer_bri">Transfer Bank BRI</option>
                    <option value="kas_operasional">Kas Operasional / Tunai</option>
                    <option value="qris">QRIS Vendor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Status Pembayaran
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 font-bold outline-none bg-white"
                  >
                    <option value="selesai">Selesai / Lunas</option>
                    <option value="menunggu">Menunggu Pembayaran</option>
                    <option value="proses">Dalam Proses Bank</option>
                  </select>
                </div>
              </div>

              {/* Bank Account / Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    No. Rekening / Info Pembayaran
                  </label>
                  <input
                    type="text"
                    value={newBankAccount}
                    onChange={(e) => setNewBankAccount(e.target.value)}
                    placeholder="Contoh: BCA 8465019283 a/n Bambang"
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    No. Referensi / Bukti Transfer
                  </label>
                  <input
                    type="text"
                    value={newRefNumber}
                    onChange={(e) => setNewRefNumber(e.target.value)}
                    placeholder="Contoh: TRF-BCA-981245"
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Keterangan / Rincian Pengeluaran
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Rincian pembayaran, misalnya: Honor 3 hari supir Jogja + uang makan harian..."
                  className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="py-2.5 px-4 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Simpan Pembayaran</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Edit Pembayaran Vendor */}
      {editingPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setEditingPayment(null)} />
          <form
            onSubmit={handleSaveEdit}
            className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl p-6 z-10 border border-neutral-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                  Perbarui Transaksi #{editingPayment.paymentNumber}
                </span>
                <h3 className="text-base font-extrabold text-neutral-900">
                  Edit Data Pembayaran Vendor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPayment(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Kategori Pembayaran
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as VendorCategory)}
                  className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 font-bold outline-none bg-white"
                >
                  <option value="driver">1. Pembayaran Driver & Kru Wisata</option>
                  <option value="hotel">2. Pembayaran ke Hotel Mitra</option>
                  <option value="vehicle_vendor">3. Pembayaran Vendor Kendaraan</option>
                  <option value="tourist_spot">4. Pembayaran Tiket Tempat Wisata</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Nama Vendor / Penerima
                </label>
                <input
                  type="text"
                  value={editVendorName}
                  onChange={(e) => setEditVendorName(e.target.value)}
                  required
                  className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Jumlah Pembayaran (Rp)
                  </label>
                  <input
                    type="number"
                    min={10000}
                    step={50000}
                    value={editAmount}
                    onChange={(e) => setEditAmount(parseInt(e.target.value) || 0)}
                    required
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 font-mono font-bold text-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Tanggal Pembayaran
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    required
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 font-medium outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={editMethod}
                    onChange={(e) => setEditMethod(e.target.value as any)}
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                  >
                    <option value="transfer_bca">Transfer Bank BCA</option>
                    <option value="transfer_mandiri">Transfer Bank Mandiri</option>
                    <option value="transfer_bri">Transfer Bank BRI</option>
                    <option value="kas_operasional">Kas Operasional / Tunai</option>
                    <option value="qris">QRIS Vendor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Status Pembayaran
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 font-bold outline-none bg-white"
                  >
                    <option value="selesai">Selesai / Lunas</option>
                    <option value="menunggu">Menunggu Pembayaran</option>
                    <option value="proses">Dalam Proses Bank</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    No. Rekening / Info Pembayaran
                  </label>
                  <input
                    type="text"
                    value={editBankAccount}
                    onChange={(e) => setEditBankAccount(e.target.value)}
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    No. Referensi Transfer
                  </label>
                  <input
                    type="text"
                    value={editRefNumber}
                    onChange={(e) => setEditRefNumber(e.target.value)}
                    className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Keterangan / Rincian Pengeluaran
                </label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full py-2.5 px-3 border border-neutral-300 rounded-xl focus:border-orange-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setEditingPayment(null)}
                className="py-2.5 px-4 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 3: Bukti Voucher Kas Keluar (Printable) */}
      {viewingVoucher && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 print:p-0">
          <div 
            className="fixed inset-0 bg-neutral-900/70 backdrop-blur-xs print:hidden" 
            onClick={() => setViewingVoucher(null)} 
          />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-neutral-200 z-10 overflow-hidden my-4 print:shadow-none print:border-none print:my-0 print:rounded-none">
            {/* Header Toolbar */}
            <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Voucher Bukti Pengeluaran Kas (Disbursement Receipt)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintVoucher}
                  className="py-1.5 px-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Voucher</span>
                </button>
                <button
                  onClick={() => setViewingVoucher(null)}
                  className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Voucher Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Kop Perusahaan */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-neutral-200 p-0.5 shrink-0">
                    <img 
                      src="/assets/aistudio/1793582722648_90a12056.jpg" 
                      alt="Logo PERGIDIANTAR" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div>
                    <span className="text-xl font-black text-neutral-900 tracking-tight leading-none block">
                      PERGI<span className="text-orange-500">DIANTAR</span>
                    </span>
                    <span className="text-[11px] text-neutral-500 font-semibold block mt-0.5">
                      PT PERGI DIANTAR WISATA INDONESIA
                    </span>
                    <span className="text-[10px] text-neutral-400 block">
                      Jambon - Kota Jogjakarta · WA: 087716443331
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-neutral-900 block">
                    VOUCHER PENGELUARAN KAS
                  </span>
                  <span className="font-mono text-xs font-bold text-orange-600 block mt-0.5">
                    {viewingVoucher.paymentNumber}
                  </span>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                    Status: {viewingVoucher.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Rincian Voucher */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Dibayarkan Kepada (Vendor / Rekanan):
                  </span>
                  <span className="text-sm font-bold text-neutral-900 block mt-0.5">
                    {viewingVoucher.vendorName}
                  </span>
                  <span className="text-[11px] text-neutral-600 block">
                    Kategori: {viewingVoucher.categoryLabel}
                  </span>
                  {viewingVoucher.bankAccount && (
                    <span className="text-[11px] text-neutral-600 block mt-0.5">
                      Rekening: {viewingVoucher.bankAccount}
                    </span>
                  )}
                </div>

                <div className="text-right space-y-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400">Tanggal Bayar:</span>
                    <span className="font-semibold text-neutral-800 ml-2">{viewingVoucher.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400">Metode:</span>
                    <span className="font-semibold text-neutral-800 ml-2">{viewingVoucher.paymentMethodLabel}</span>
                  </div>
                  {viewingVoucher.referenceNumber && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400">No. Bukti / Ref:</span>
                      <span className="font-mono text-neutral-800 ml-2">{viewingVoucher.referenceNumber}</span>
                    </div>
                  )}
                  {viewingVoucher.relatedOrderNumber && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Order Terkait:</span>
                      <span className="font-mono font-bold text-orange-600 ml-2">#{viewingVoucher.relatedOrderNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Highlight */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Uraian / Deskripsi Pembayaran:
                  </span>
                  <span className="text-xs font-semibold text-neutral-800 block mt-0.5">
                    {viewingVoucher.description}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Total Nominal Keluar:
                  </span>
                  <span className="text-xl font-black font-mono text-neutral-900" data-tabular>
                    Rp {viewingVoucher.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Signature Columns */}
              <div className="grid grid-cols-2 pt-6 border-t border-neutral-200 text-center text-xs">
                <div>
                  <span className="text-neutral-500 block mb-12">Disetujui Oleh (Finance / Super Admin):</span>
                  <span className="font-bold text-neutral-900 block underline">
                    {viewingVoucher.approvedBy || 'Benisius Rahmat Basuki'}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">PT PERGI DIANTAR WISATA</span>
                </div>

                <div>
                  <span className="text-neutral-500 block mb-12">Penerima Dana / Rekanan:</span>
                  <span className="font-bold text-neutral-900 block underline">
                    {viewingVoucher.vendorName}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">Tanda Tangan / Cap Rekanan</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between print:hidden">
              <span className="text-xs text-neutral-500">
                Dokumen pengeluaran kas operasional resmi PERGIDIANTAR.
              </span>
              <button
                onClick={() => setViewingVoucher(null)}
                className="py-1.5 px-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Konfirmasi Hapus Pembayaran */}
      {deletingPayment && (
        <DeleteConfirmModal
          isOpen={true}
          title="Konfirmasi Hapus Catatan Pembayaran"
          message="Menghapus data transaksi pembayaran vendor ini secara permanen dari sistem pencatatan keuangan."
          confirmItemName={deletingPayment ? `${deletingPayment.paymentNumber} - ${deletingPayment.vendorName} (Rp ${deletingPayment.amount.toLocaleString('id-ID')})` : undefined}
          onClose={() => setDeletingPayment(null)}
          onConfirm={() => {
            if (deletingPayment) {
              deleteVendorPayment(deletingPayment.id);
              setDeletingPayment(null);
            }
          }}
        />
      )}
    </div>
  );
};
