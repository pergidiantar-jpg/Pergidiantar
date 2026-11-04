import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  MapPin, 
  PieChart, 
  Award, 
  Car, 
  CheckCircle2, 
  BarChart3,
  Percent
} from 'lucide-react';

export const SalesAnalytics: React.FC = () => {
  const { orders, packages, fleet } = useApp();
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Revenue by months (simulate 6 months trend with real current orders included)
  const monthlyTrends = [
    { month: 'Jun 2026', revenue: 98000000, orders: 8 },
    { month: 'Jul 2026', revenue: 135000000, orders: 12 },
    { month: 'Agt 2026', revenue: 110000000, orders: 9 },
    { month: 'Sep 2026', revenue: 148000000, orders: 14 },
    { month: 'Okt 2026', revenue: 172000000, orders: 16 },
    { month: 'Nov 2026', revenue: orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.grandTotal : 0), 0) + 120000000, orders: orders.length + 10 }
  ];

  const maxRevenue = Math.max(...monthlyTrends.map((m) => m.revenue));

  // Destination Distribution
  const destinationData = [
    { 
      name: 'Yogyakarta', 
      orders: orders.filter((o) => o.destination === 'jogja').length + 22, 
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      share: 52 
    },
    { 
      name: 'Malang & Bromo', 
      orders: orders.filter((o) => o.destination === 'malang').length + 12, 
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      share: 28 
    },
    { 
      name: 'Pulau Bali', 
      orders: orders.filter((o) => o.destination === 'bali').length + 8, 
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      share: 20 
    }
  ];

  // Category Distribution
  const categoryData = [
    { name: 'Family Gathering', count: 18, share: 34, color: 'bg-emerald-600' },
    { name: 'Study Tour (Sekolah/Kampus)', count: 14, share: 26, color: 'bg-blue-600' },
    { name: 'Company Gathering', count: 10, share: 19, color: 'bg-purple-600' },
    { name: 'Family Trip Santai', count: 8, share: 15, color: 'bg-amber-500' },
    { name: 'Single Trip Heritage', count: 3, share: 6, color: 'bg-neutral-600' }
  ];

  // Tier comparison
  const allInCount = orders.filter((o) => o.tier === 'all_in').length + 28;
  const hematCount = orders.filter((o) => o.tier === 'paket_hemat').length + 14;
  const totalTiers = allInCount + hematCount;
  const allInPercent = Math.round((allInCount / totalTiers) * 100);
  const hematPercent = 100 - allInPercent;

  // Fleet utilization
  const activeFleetCount = fleet.filter((f) => f.status === 'ditugaskan' || f.status === 'perjalanan').length;
  const fleetUtilizationRate = Math.round((activeFleetCount / fleet.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs">
        <h2 className="text-lg font-bold text-neutral-900">
          Analitik Visual Penjualan & Tren Pendapatan
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Pemantauan performa bisnis, rute destinasi favorit, utilisasi armada dan pertumbuhan omzet semester ini.
        </p>
      </div>

      {/* Grid: 6-Month Revenue Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                GRAFIK PERTUMBUHAN OMZET
              </span>
              <h3 className="text-base font-extrabold text-neutral-900 mt-0.5">
                Tren Pendapatan Bulanan (Juni - November 2026)
              </h3>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              +38.5% YoY
            </span>
          </div>

          {/* Clean Interactive SVG Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 border-b border-neutral-200 px-2">
              {monthlyTrends.map((item, idx) => {
                const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
                const isHovered = hoveredBarIndex === idx;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-neutral-950 text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-xl font-mono whitespace-nowrap animate-in fade-in duration-100">
                        <span className="font-bold">Rp {item.revenue.toLocaleString('id-ID')}</span>
                        <span className="text-neutral-400 block text-[9px] font-sans font-normal">
                          {item.orders} Pesanan Sukses
                        </span>
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                        idx === monthlyTrends.length - 1
                          ? 'bg-emerald-600 group-hover:bg-emerald-700'
                          : 'bg-emerald-200 group-hover:bg-emerald-400'
                      }`}
                    />

                    {/* Month Label */}
                    <span className="text-[10px] sm:text-xs font-medium text-neutral-600 mt-2 whitespace-nowrap">
                      {item.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] text-neutral-400 pt-2 px-2">
              <span>Target Minimal: Rp 80 Jt</span>
              <span>Puncak Liburan: Nov 2026 (Rp {(maxRevenue / 1000000).toFixed(0)} Jt)</span>
            </div>
          </div>
        </div>

        {/* Tier Ratio & Fleet Utilization */}
        <div className="space-y-6">
          {/* Tier Preference Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-emerald-600" /> Preferensi Paket Wisatawan
            </h3>

            {/* Split bar */}
            <div className="h-4 rounded-full overflow-hidden flex bg-neutral-100">
              <div
                style={{ width: `${allInPercent}%` }}
                className="bg-emerald-600 transition-all duration-500"
                title={`All In: ${allInPercent}%`}
              />
              <div
                style={{ width: `${hematPercent}%` }}
                className="bg-neutral-800 transition-all duration-500"
                title={`Paket Hemat: ${hematPercent}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-800 font-semibold block">All In VIP</span>
                <span className="text-base font-black text-emerald-950 font-mono" data-tabular>{allInPercent}%</span>
                <span className="text-[10px] text-emerald-600 block">Hotel 4★ & Makan Penuh</span>
              </div>
              <div className="p-2.5 bg-neutral-100 rounded-xl border border-neutral-200">
                <span className="text-[11px] text-neutral-700 font-semibold block">Paket Hemat</span>
                <span className="text-base font-black text-neutral-900 font-mono" data-tabular>{hematPercent}%</span>
                <span className="text-[10px] text-neutral-500 block">Budget Friendly</span>
              </div>
            </div>
          </div>

          {/* Fleet Utilization */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4 text-emerald-600" /> Utilisasi Armada Wisata
              </h3>
              <span className="font-mono text-xs font-bold text-emerald-700">
                {fleetUtilizationRate}%
              </span>
            </div>

            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${fleetUtilizationRate}%` }}
                className="bg-emerald-600 h-full rounded-full"
              />
            </div>

            <p className="text-[11px] text-neutral-500">
              {activeFleetCount} dari {fleet.length} unit kendaraan (HiAce & Bus) sedang aktif bertugas mengantar tamu.
            </p>
          </div>
        </div>
      </div>

      {/* Destination & Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destination Distribution */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" /> Distribusi Wilayah Destinasi
          </h3>

          <div className="space-y-3 text-xs">
            {destinationData.map((d) => (
              <div key={d.name} className="space-y-1">
                <div className="flex justify-between items-center font-medium">
                  <span className="text-neutral-800">{d.name}</span>
                  <span className="font-mono font-bold text-neutral-900" data-tabular>{d.orders} Tour ({d.share}%)</span>
                </div>
                <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${d.share}%` }}
                    className={`h-full rounded-full ${d.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
            Yogyakarta tetap menjadi kontributor omzet terbesar dengan Candi Prambanan dan Merapi Lava Tour sebagai magnet utama.
          </p>
        </div>

        {/* Category Share */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" /> Kontribusi Kategori Perjalanan
          </h3>

          <div className="space-y-3 text-xs">
            {categoryData.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between items-center font-medium">
                  <span className="text-neutral-800">{c.name}</span>
                  <span className="font-mono font-bold text-neutral-900" data-tabular>{c.count} Rombongan ({c.share}%)</span>
                </div>
                <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${c.share}%` }}
                    className={`h-full rounded-full ${c.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
            Family Gathering dan Study Tour menghasilkan volume transaksi tertinggi per rombongan dengan penggunaan armada Big Bus.
          </p>
        </div>
      </div>
    </div>
  );
};
