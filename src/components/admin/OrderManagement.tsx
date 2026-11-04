import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingOrder, OrderStatus, PaymentStatus } from '../../types/travel';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  CreditCard,
  User, 
  Phone, 
  MapPin, 
  Calendar,
  Building,
  FileText,
  X
} from 'lucide-react';

export const OrderManagement: React.FC = () => {
  const { 
    orders, 
    fleet, 
    drivers, 
    updateOrderStatus, 
    updatePaymentStatus, 
    assignFleetAndDriver, 
    deleteOrder,
    currentRole 
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  
  // Modals state
  const [detailOrder, setDetailOrder] = useState<BookingOrder | null>(null);
  const [assigningOrder, setAssigningOrder] = useState<BookingOrder | null>(null);
  const [selectedFleetId, setSelectedFleetId] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [deletingOrder, setDeletingOrder] = useState<BookingOrder | null>(null);

  const isSuperAdmin = currentRole === 'super_admin';
  const isFinance = currentRole === 'finance' || isSuperAdmin;
  const isOps = currentRole === 'ops_admin' || isSuperAdmin;

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.packageTitle.toLowerCase().includes(q) ||
      o.customer.whatsapp.includes(q) ||
      (o.customer.companyOrFamilyName && o.customer.companyOrFamilyName.toLowerCase().includes(q));

    const matchStatus = filterStatus === 'all' || o.orderStatus === filterStatus;
    const matchPayment = filterPayment === 'all' || o.paymentStatus === filterPayment;

    return matchSearch && matchStatus && matchPayment;
  });

  const handleOpenAssignModal = (order: BookingOrder) => {
    setAssigningOrder(order);
    setSelectedFleetId(order.assignedFleetId || (fleet.find((f) => f.status === 'tersedia')?.id || ''));
    setSelectedDriverId(order.assignedDriverId || (drivers.find((d) => d.status === 'tersedia')?.id || ''));
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (assigningOrder && selectedFleetId && selectedDriverId) {
      assignFleetAndDriver(assigningOrder.id, selectedFleetId, selectedDriverId);
      setAssigningOrder(null);
    }
  };

  const getOrderStatusBadge = (status: OrderStatus) => {
    const badges: Record<OrderStatus, { label: string; class: string }> = {
      baru: { label: 'Order Baru', class: 'bg-blue-50 text-blue-700 border-blue-200' },
      dikonfirmasi: { label: 'Dikonfirmasi', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      armada_ditugaskan: { label: 'Armada Siap', class: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      sedang_berjalan: { label: 'Dalam Tour', class: 'bg-amber-50 text-amber-700 border-amber-200' },
      selesai: { label: 'Selesai', class: 'bg-neutral-100 text-neutral-800 border-neutral-300' },
      dibatalkan: { label: 'Dibatalkan', class: 'bg-rose-50 text-rose-700 border-rose-200' }
    };
    const b = badges[status] || { label: status, class: 'bg-neutral-100 text-neutral-700 border-neutral-200' };
    return (
      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md border ${b.class}`}>
        {b.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
      case 'verified':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">Lunas</span>;
      case 'pending':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">Menunggu Bayar</span>;
      case 'refunded':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-purple-100 text-purple-800 border border-purple-200">Refund</span>;
      case 'failed':
      default:
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-rose-100 text-rose-800 border border-rose-200">Gagal</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action & filter header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Antrean Order Masuk & Status Transaksi
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Manajemen pesanan calon pelanggan, verifikasi pembayaran, penugasan armada dan driver.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-medium text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            Total {orders.length} Pesanan Tercatat
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari order, pemesan, paket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs py-2 pl-9 pr-3 border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs py-2 px-3 border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">Semua Status Order</option>
              <option value="baru">Order Baru</option>
              <option value="dikonfirmasi">Dikonfirmasi</option>
              <option value="armada_ditugaskan">Armada Ditugaskan</option>
              <option value="sedang_berjalan">Sedang Berjalan</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>

          <div>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full text-xs py-2 px-3 border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">Semua Status Pembayaran</option>
              <option value="paid">Lunas (Paid / Verified)</option>
              <option value="pending">Menunggu Pembayaran (Pending)</option>
              <option value="failed">Gagal / Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">No. Order / Tanggal</th>
                <th className="py-3 px-4">Data Pemesan</th>
                <th className="py-3 px-4">Paket & Kategori</th>
                <th className="py-3 px-4">Jadwal / Pax</th>
                <th className="py-3 px-4">Status Bayar</th>
                <th className="py-3 px-4">Status Order</th>
                <th className="py-3 px-4">Armada & Supir</th>
                <th className="py-3 px-4 text-right">Total Biaya</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-neutral-400">
                    Tidak ada pesanan yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Order ID & Time */}
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 whitespace-nowrap">
                      <div>{ord.orderNumber}</div>
                      <span className="text-[10px] font-sans font-normal text-neutral-400">
                        {ord.createdAt}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900">{ord.customer.fullName}</div>
                      <div className="text-[11px] text-neutral-500">{ord.customer.whatsapp}</div>
                      {ord.customer.companyOrFamilyName && (
                        <div className="text-[10px] text-emerald-700 font-medium truncate max-w-[150px]">
                          {ord.customer.companyOrFamilyName}
                        </div>
                      )}
                    </td>

                    {/* Package */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-800 line-clamp-1 max-w-[180px]">
                        {ord.packageTitle}
                      </div>
                      <span className="text-[10px] text-neutral-500">
                        {ord.tier === 'all_in' ? 'All In VIP' : 'Paket Hemat'} · {ord.destinationLabel}
                      </span>
                    </td>

                    {/* Schedule & Pax */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono text-neutral-800" data-tabular>{ord.tourStartDate}</div>
                      <div className="text-[11px] text-neutral-500 font-semibold">{ord.paxCount} Orang</div>
                    </td>

                    {/* Payment Status with Quick Change for Finance */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isFinance ? (
                        <select
                          value={ord.paymentStatus}
                          onChange={(e) => updatePaymentStatus(ord.id, e.target.value as PaymentStatus)}
                          className="text-xs font-bold py-1 px-2 border border-neutral-300 rounded-md bg-white cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Lunas (Paid)</option>
                          <option value="failed">Gagal</option>
                          <option value="refunded">Refund</option>
                        </select>
                      ) : (
                        getPaymentStatusBadge(ord.paymentStatus)
                      )}
                    </td>

                    {/* Order Status with Quick Change for Ops */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isOps ? (
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="text-xs font-bold py-1 px-2 border border-neutral-300 rounded-md bg-white cursor-pointer"
                        >
                          <option value="baru">Baru</option>
                          <option value="dikonfirmasi">Dikonfirmasi</option>
                          <option value="armada_ditugaskan">Armada Ditugaskan</option>
                          <option value="sedang_berjalan">Sedang Berjalan</option>
                          <option value="selesai">Selesai</option>
                          <option value="dibatalkan">Dibatalkan</option>
                        </select>
                      ) : (
                        getOrderStatusBadge(ord.orderStatus)
                      )}
                    </td>

                    {/* Assigned Fleet & Driver */}
                    <td className="py-3.5 px-4">
                      {ord.assignedFleetName ? (
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-neutral-900 block truncate max-w-[150px]">
                            {ord.assignedFleetName}
                          </span>
                          <span className="text-[10px] text-neutral-500 block truncate max-w-[150px]">
                            Supir: {ord.assignedDriverName || '-'}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenAssignModal(ord)}
                          className="py-1 px-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors whitespace-nowrap"
                        >
                          + Tugaskan Unit
                        </button>
                      )}
                    </td>

                    {/* Grand Total */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900 whitespace-nowrap" data-tabular>
                      Rp {ord.grandTotal.toLocaleString('id-ID')}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setDetailOrder(ord)}
                          title="Lihat Rincian Seluruh Data Pemesan"
                          className="p-1.5 text-neutral-600 hover:text-emerald-700 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {isOps && (
                          <button
                            onClick={() => handleOpenAssignModal(ord)}
                            title="Ganti Armada & Supir"
                            className="p-1.5 text-neutral-600 hover:text-indigo-700 hover:bg-neutral-100 rounded-lg transition-colors"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}

                        {isSuperAdmin && (
                          <button
                            onClick={() => setDeletingOrder(ord)}
                            title="Hapus Data Pesanan Penuh"
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal: Entire Customer Profile and Order Details */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setDetailOrder(null)} />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 z-10 border border-neutral-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  {detailOrder.orderNumber}
                </span>
                <h3 className="text-lg font-bold text-neutral-900">
                  Data Lengkap Pemesan & Tour
                </h3>
              </div>
              <button onClick={() => setDetailOrder(null)} className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Contact */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" /> Identitas Pemesan
              </h4>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Nama Lengkap</span>
                  <span className="font-bold text-neutral-900">{detailOrder.customer.fullName}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">WhatsApp / Telp</span>
                  <span className="font-bold text-neutral-900">{detailOrder.customer.whatsapp}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Email</span>
                  <span className="font-medium text-neutral-800">{detailOrder.customer.email}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Instansi / Keluarga</span>
                  <span className="font-medium text-neutral-800">{detailOrder.customer.companyOrFamilyName || '-'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-neutral-400 block text-[10px] uppercase">Titik Penjemputan</span>
                  <span className="font-semibold text-neutral-900">{detailOrder.customer.pickupAddress}</span>
                </div>
                {detailOrder.customer.specialRequests && (
                  <div className="sm:col-span-2 pt-2 border-t border-neutral-200">
                    <span className="text-neutral-400 block text-[10px] uppercase">Permintaan Khusus</span>
                    <span className="text-neutral-700">{detailOrder.customer.specialRequests}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tour & Cost Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" /> Rincian Biaya & Add-Ons
              </h4>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span>Paket: {detailOrder.packageTitle} ({detailOrder.tier === 'all_in' ? 'All In VIP' : 'Paket Hemat'})</span>
                  <span className="font-mono">Rp {detailOrder.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {detailOrder.addOnsList && detailOrder.addOnsList.length > 0 && (
                  <div className="pt-2 border-t border-neutral-200">
                    <span className="text-[11px] font-bold text-neutral-700 block mb-1">Add-ons Tambahan:</span>
                    <ul className="list-disc list-inside text-neutral-600 text-[11px] space-y-0.5">
                      {detailOrder.addOnsList.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                )}
                <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-neutral-900 text-sm">
                  <span>Total Tagihan:</span>
                  <span className="font-mono text-emerald-700">Rp {detailOrder.grandTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[11px] text-neutral-500 pt-1">
                  <span>Referensi Transaksi:</span>
                  <span className="font-mono">{detailOrder.paymentReference || 'Belum Dibayar'}</span>
                </div>
              </div>
            </div>

            {/* Assigned vehicle */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" /> Armada & Kru Bertugas
              </h4>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-neutral-900 block">{detailOrder.assignedFleetName || 'Belum Ditugaskan'}</span>
                  <span className="text-neutral-500">Supir: {detailOrder.assignedDriverName || '-'} ({detailOrder.assignedDriverPhone || '-'})</span>
                </div>
                {isOps && (
                  <button
                    onClick={() => {
                      setDetailOrder(null);
                      handleOpenAssignModal(detailOrder);
                    }}
                    className="py-1 px-3 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                  >
                    Atur Armada
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailOrder(null)}
                className="py-2 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Fleet & Driver Modal */}
      {assigningOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setAssigningOrder(null)} />
          <form
            onSubmit={handleConfirmAssignment}
            className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 z-10 border border-neutral-200 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">
                  {assigningOrder.orderNumber}
                </span>
                <h3 className="text-base font-bold text-neutral-900">
                  Tugaskan Armada & Driver
                </h3>
              </div>
              <button type="button" onClick={() => setAssigningOrder(null)} className="p-1 text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-neutral-500 block">Pesanan untuk:</span>
                <span className="font-bold text-neutral-900">{assigningOrder.packageTitle}</span>
                <span className="text-neutral-600 block mt-0.5">
                  Tamu: {assigningOrder.customer.fullName} · {assigningOrder.paxCount} Orang · Mulai {assigningOrder.tourStartDate}
                </span>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1.5">
                  Pilih Unit Armada (Inventaris Sinkron)
                </label>
                <select
                  value={selectedFleetId}
                  onChange={(e) => setSelectedFleetId(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl bg-white font-medium"
                >
                  <option value="">-- Pilih Kendaraan Tersedia --</option>
                  {fleet.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.plateNumber}) · Kapasitas {f.capacitySeats} Seat · [{f.status.toUpperCase()}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1.5">
                  Pilih Driver Berpengalaman
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl bg-white font-medium"
                >
                  <option value="">-- Pilih Driver --</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.licenseType}) · {d.totalTripsCompleted} Trip · Rating {d.rating} ★ · [{d.status.toUpperCase()}]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setAssigningOrder(null)}
                className="py-2 px-3.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Simpan & Kunci Inventaris
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingOrder}
        title="Konfirmasi Hapus Pesanan Secara Penuh"
        message="Tindakan ini akan menghapus data pesanan secara permanen dari sistem dan melepaskan unit armada serta supir yang telah ditugaskan."
        confirmItemName={deletingOrder ? `${deletingOrder.orderNumber} - ${deletingOrder.customer.fullName}` : undefined}
        onClose={() => setDeletingOrder(null)}
        onConfirm={() => {
          if (deletingOrder) {
            deleteOrder(deletingOrder.id);
            setDeletingOrder(null);
          }
        }}
      />
    </div>
  );
};
