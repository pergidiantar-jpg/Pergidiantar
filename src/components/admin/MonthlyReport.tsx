import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileSpreadsheet, 
  Printer, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Download, 
  X,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const MonthlyReport: React.FC = () => {
  const { orders, getMonthlySummary } = useApp();

  const [selectedMonth, setSelectedMonth] = useState<number>(11); // November
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);

  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ];

  const years = [2026, 2025, 2024];

  const summary = getMonthlySummary(selectedMonth, selectedYear);

  // Filter orders for selected period
  const monthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
  });

  // Export to Excel / CSV with UTF-8 BOM
  const handleExportExcel = () => {
    const headers = [
      'No Order',
      'Tanggal Transaksi',
      'Nama Pemesan',
      'WhatsApp / Telp',
      'Instansi / Keluarga',
      'Titik Penjemputan',
      'Paket Wisata',
      'Kategori',
      'Tipe Paket',
      'Jumlah Pax',
      'Destinasi',
      'Metode Pembayaran',
      'Status Pembayaran',
      'Status Order',
      'Armada Bertugas',
      'Driver',
      'Total Biaya (IDR)'
    ];

    const rows = monthOrders.map((o) => [
      `"${o.orderNumber}"`,
      `"${o.createdAt}"`,
      `"${o.customer.fullName.replace(/"/g, '""')}"`,
      `"${o.customer.whatsapp}"`,
      `"${(o.customer.companyOrFamilyName || '-').replace(/"/g, '""')}"`,
      `"${o.customer.pickupAddress.replace(/"/g, '""')}"`,
      `"${o.packageTitle.replace(/"/g, '""')}"`,
      `"${o.categoryLabel}"`,
      `"${o.tier === 'all_in' ? 'All In VIP' : 'Paket Hemat'}"`,
      o.paxCount,
      `"${o.destinationLabel}"`,
      `"${o.paymentMethod.toUpperCase()}"`,
      `"${o.paymentStatus.toUpperCase()}"`,
      `"${o.orderStatus.replace('_', ' ').toUpperCase()}"`,
      `"${(o.assignedFleetName || '-').replace(/"/g, '""')}"`,
      `"${(o.assignedDriverName || '-').replace(/"/g, '""')}"`,
      o.grandTotal
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Transaksi_PERGIDIANTAR_${summary.monthName}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Filter and Export Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Laporan Bulanan Transaksi & Pembukuan
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Rekapitulasi omzet penjualan paket wisata, pesanan lunas, dan ekspor dokumen resmi.
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportExcel}
              className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Excel (.CSV)</span>
            </button>
            <button
              onClick={() => setIsPdfPreviewOpen(true)}
              className="py-2 px-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Ekspor PDF</span>
            </button>
          </div>
        </div>

        {/* Date Filter selector */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Pilih Periode:</span>
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="text-xs font-bold py-1.5 px-3 border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                Bulan {m.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-xs font-bold py-1.5 px-3 border border-neutral-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                Tahun {y}
              </option>
            ))}
          </select>

          <span className="text-xs text-neutral-400 ml-auto">
            Periode: <strong>{summary.monthName} {selectedYear}</strong>
          </span>
        </div>
      </div>

      {/* KPI Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>Total Pendapatan (Omzet)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-neutral-900 font-mono" data-tabular>
            Rp {summary.totalRevenue.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            Dari {summary.completedOrders} pesanan terverifikasi
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>Total Transaksi Masuk</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-neutral-900 font-mono" data-tabular>
            {summary.totalOrders} Pesanan
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            {summary.allInOrdersCount} All In · {summary.hematOrdersCount} Paket Hemat
          </span>
        </div>

        {/* Total Pax */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>Total Peserta Wisata</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-neutral-900 font-mono" data-tabular>
            {summary.totalPax} Tamu (Pax)
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Jogja, Malang, dan Bali
          </span>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>Rata-rata Nilai Order (AOV)</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-neutral-900 font-mono" data-tabular>
            Rp {summary.averageOrderValue.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Tingkat konversi 94.2%
          </span>
        </div>
      </div>

      {/* Transaction Table for the Period */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Rincian Buku Kas Transaksi ({summary.monthName} {selectedYear})
          </h3>
          <span className="text-xs text-neutral-500">
            {monthOrders.length} Catatan Ditemukan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/50 border-b border-neutral-200 text-neutral-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-4">No. Order</th>
                <th className="py-2.5 px-4">Tanggal</th>
                <th className="py-2.5 px-4">Klien / Pemesan</th>
                <th className="py-2.5 px-4">Paket Wisata</th>
                <th className="py-2.5 px-4">Pax</th>
                <th className="py-2.5 px-4">Metode & Bukti</th>
                <th className="py-2.5 px-4">Status Bayar</th>
                <th className="py-2.5 px-4 text-right">Nominal (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {monthOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    Tidak ada transaksi tercatat pada bulan {summary.monthName} {selectedYear}.
                  </td>
                </tr>
              ) : (
                monthOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">{ord.orderNumber}</td>
                    <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">{ord.createdAt}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-neutral-900 block">{ord.customer.fullName}</span>
                      <span className="text-[10px] text-neutral-500">{ord.customer.companyOrFamilyName || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-neutral-800 block truncate max-w-[200px]">{ord.packageTitle}</span>
                      <span className="text-[10px] text-neutral-500">{ord.tier === 'all_in' ? 'All In VIP' : 'Paket Hemat'}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-800">{ord.paxCount}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">
                      <div>{ord.paymentMethod.toUpperCase()}</div>
                      <span className="text-[10px] text-neutral-400">{ord.paymentReference || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.paymentStatus === 'paid' ? 'LUNAS' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900" data-tabular>
                      Rp {ord.grandTotal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {monthOrders.length > 0 && (
              <tfoot className="bg-neutral-50 font-bold border-t border-neutral-200">
                <tr>
                  <td colSpan={7} className="py-3 px-4 text-right text-neutral-800">
                    Total Omzet Transaksi Terverifikasi:
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-800 text-sm" data-tabular>
                    Rp {summary.totalRevenue.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Official PDF Preview Modal (Clean Printable Document) */}
      {isPdfPreviewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl p-8 z-10 border border-neutral-300 max-h-[95vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between no-print border-b border-neutral-200 pb-4">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Pratinjau Dokumen Cetak / PDF Resmi
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  onClick={() => setIsPdfPreviewOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Company Letterhead (KOP SURAT) */}
            <div className="border-b-2 border-neutral-900 pb-4 text-neutral-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl">
                  <Compass className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-neutral-950">
                    PT PERGI DIANTAR WISATA NUSANTARA
                  </h1>
                  <p className="text-[11px] text-neutral-600">
                    Izin Usaha Pariwisata: 912010892011 · NIB: 812903810291 · NPWP: 72.819.291.4-541.000
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Jambon - Kota Jogjakarta · WhatsApp: 087716443331
                  </p>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="font-bold block text-neutral-900">REKAPITULASI RESMI</span>
                <span className="text-[11px] text-neutral-500 font-mono">DOC-PGD-{selectedYear}{String(selectedMonth).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center py-2">
              <h2 className="text-base font-extrabold uppercase text-neutral-900 tracking-wide">
                LAPORAN BULANAN TRANSAKSI PERJALANAN WISATA
              </h2>
              <p className="text-xs text-neutral-600">
                Periode: <strong>{summary.monthName} {selectedYear}</strong>
              </p>
            </div>

            {/* Financial Summary Table */}
            <div className="grid grid-cols-4 gap-3 text-xs border border-neutral-200 rounded-xl p-3 bg-neutral-50">
              <div>
                <span className="text-neutral-500 block text-[10px]">Total Omzet:</span>
                <span className="font-mono font-bold text-neutral-900" data-tabular>Rp {summary.totalRevenue.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Pesanan Masuk:</span>
                <span className="font-mono font-bold text-neutral-900">{summary.totalOrders} Transaksi</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Total Tamu (Pax):</span>
                <span className="font-mono font-bold text-neutral-900">{summary.totalPax} Peserta</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Rata-rata Order:</span>
                <span className="font-mono font-bold text-neutral-900" data-tabular>Rp {summary.averageOrderValue.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Detailed Table for PDF */}
            <table className="w-full text-left text-xs border border-neutral-200">
              <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200 text-[10px]">
                <tr>
                  <th className="p-2">No. Order</th>
                  <th className="p-2">Tamu & Kontak</th>
                  <th className="p-2">Paket Tour</th>
                  <th className="p-2">Pax</th>
                  <th className="p-2">Armada & Supir</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 text-right">Total (IDR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-[11px]">
                {monthOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="p-2 font-mono">{ord.orderNumber}</td>
                    <td className="p-2">
                      <span className="font-bold block">{ord.customer.fullName}</span>
                      <span className="text-[10px] text-neutral-500">{ord.customer.whatsapp}</span>
                    </td>
                    <td className="p-2">{ord.packageTitle} ({ord.tier === 'all_in' ? 'All In' : 'Hemat'})</td>
                    <td className="p-2 font-bold">{ord.paxCount}</td>
                    <td className="p-2 text-[10px]">{ord.assignedFleetName || '-'}</td>
                    <td className="p-2 font-semibold uppercase">{ord.paymentStatus}</td>
                    <td className="p-2 text-right font-mono font-bold" data-tabular>
                      Rp {ord.grandTotal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signatures & Seal */}
            <div className="pt-8 grid grid-cols-2 text-xs text-neutral-800">
              <div>
                <p className="text-[11px] text-neutral-500">Dicetak otomatis dari Sistem PERGIDIANTAR ERP</p>
                <div className="w-24 h-24 mt-2 border-2 border-emerald-600 rounded-full flex items-center justify-center text-center p-2 text-[9px] font-bold text-emerald-800 uppercase tracking-tighter opacity-80 rotate-[-8deg]">
                  TERVERIFIKASI
                  <br />
                  PT PERGI DIANTAR
                  <br />
                  WISATA
                </div>
              </div>
              <div className="text-right">
                <p>Yogyakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold mt-1">Direktur Operasional & Keuangan</p>
                <div className="h-16" />
                <p className="font-bold underline">Benisius Rahmat Basuki</p>
                <p className="text-[11px] text-neutral-500">NIP. 19880219 201104 1 002</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
