import React, { useState } from 'react';
import { BookingOrder, TourPackage } from '../../types/travel';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  Hotel, 
  Utensils, 
  Ticket, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ExternalLink, 
  Sparkles, 
  AlertCircle,
  Sun,
  Sunset,
  Moon,
  Compass,
  Phone,
  Info,
  Check,
  ShoppingBag
} from 'lucide-react';

interface OrderTripItineraryTrackerProps {
  order: BookingOrder;
  pkg?: TourPackage | null;
}

export const OrderTripItineraryTracker: React.FC<OrderTripItineraryTrackerProps> = ({ order, pkg }) => {
  // If order has an attached custom itinerary timeline, prioritize it!
  const itinerary = (order.itineraryTimeline && order.itineraryTimeline.length > 0)
    ? order.itineraryTimeline
    : (pkg?.itinerary && pkg.itinerary.length > 0 
        ? pkg.itinerary 
        : [
            {
              day: 1,
              title: `Hari Ke-1: Penjemputan & Eksplorasi ${order.destinationLabel}`,
              description: `Penyambutan tamu di titik jemput ${order.customer.pickupAddress} dengan armada nyaman.`,
              activities: [
                `Penjemputan di ${order.customer.pickupAddress} oleh supir ramah berlisensi`,
                `Perjalanan menuju destinasi wisata utama ${order.destinationLabel}`,
                order.tier === 'all_in' ? 'Makan siang kuliner khas lokal pilihan mitra' : 'Istirahat makan siang (mandiri/rekomendasi supir)',
                'Kunjungan destinasi ikonik & spot foto instagramable',
                order.tier === 'all_in' ? `Check-in hotel mitra: ${order.hotelAllotment || 'Hotel Bintang Pilihan'}` : 'Pengantaran ke penginapan tamu'
              ]
            },
            {
              day: 2,
              title: `Hari Ke-2: Wisata Alam & Kuliner ${order.destinationLabel}`,
              description: 'Aktivitas eksplorasi wisata penuh sepanjang hari dengan pemandangan menakjubkan.',
              activities: [
                order.tier === 'all_in' ? 'Sarapan pagi buffet lezat di hotel' : 'Persiapan perjalanan pagi',
                'Eksplorasi destinasi alam & budaya unggulan',
                order.tier === 'all_in' ? 'Makan siang & santap kuliner khas tradisional' : 'Makan siang kuliner lokal',
                'Hunting sunset & panorama senja terbaik',
                order.tier === 'all_in' ? 'Makan malam bersama keluarga / rombongan' : 'Makan malam santai mandiri'
              ]
            },
            {
              day: 3,
              title: `Hari Ke-3: Belanja Oleh-Oleh & Kepulangan`,
              description: 'Berburu cenderamata khas daerah dan pengantaran kepulangan tepat waktu.',
              activities: [
                'Proses check-out hotel & pemuatan bagasi ke armada',
                'Kunjungan pusat oleh-oleh khas & kerajinan lokal',
                'Makan siang perpisahan',
                'Pengantaran kembali ke Bandara / Stasiun / Titik Drop-off'
              ]
            }
          ]);

  const totalDays = itinerary.length;
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [completedStops, setCompletedStops] = useState<Record<string, boolean>>({});

  const getTimelineTypeMeta = (type: string) => {
    switch (type) {
      case 'pickup':
        return { label: 'Penjemputan', icon: Car, color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'dropoff':
        return { label: 'Drop-off / Kepulangan', icon: Car, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'meal':
        return { label: 'Makan & Kuliner', icon: Utensils, color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'hotel_checkin':
        return { label: 'Check-In Hotel', icon: Hotel, color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'hotel_checkout':
        return { label: 'Check-Out Hotel', icon: Hotel, color: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'shopping':
        return { label: 'Sentra Oleh-Oleh', icon: ShoppingBag, color: 'bg-pink-100 text-pink-800 border-pink-200' };
      case 'free_time':
        return { label: 'Waktu Bebas & Istirahat', icon: Clock, color: 'bg-neutral-100 text-neutral-800 border-neutral-200' };
      case 'sightseeing':
      default:
        return { label: 'Kunjungan Wisata', icon: Ticket, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
  };

  // Helper to compute date for a given day offset
  const getDayDateLabel = (dayNumber: number): string => {
    try {
      if (!order.tourStartDate) return `Hari ke-${dayNumber}`;
      const startDate = new Date(order.tourStartDate);
      if (isNaN(startDate.getTime())) return `Hari ke-${dayNumber}`;
      
      const targetDate = new Date(startDate);
      targetDate.setDate(startDate.getDate() + (dayNumber - 1));
      
      return targetDate.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return `Hari ke-${dayNumber}`;
    }
  };

  const toggleStopCompleted = (key: string) => {
    setCompletedStops((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Determine activity time phase and visual icon based on index
  const getActivityPhase = (index: number, total: number) => {
    if (index === 0) {
      return { label: 'Pagi (08:00 - 11:30)', icon: Sun, color: 'text-amber-500 bg-amber-50 border-amber-200' };
    }
    if (index === 1 || (total > 3 && index === 2)) {
      return { label: 'Siang (12:00 - 15:00)', icon: Compass, color: 'text-blue-500 bg-blue-50 border-blue-200' };
    }
    if (index === total - 2) {
      return { label: 'Sore (15:30 - 18:00)', icon: Sunset, color: 'text-orange-500 bg-orange-50 border-orange-200' };
    }
    return { label: 'Malam (18:30 - 21:00)', icon: Moon, color: 'text-purple-500 bg-purple-50 border-purple-200' };
  };

  // Detect type of activity from text
  const getActivityType = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('jemput') || lower.includes('armada') || lower.includes('stasiun') || lower.includes('bandara') || lower.includes('antar')) {
      return { type: 'transport', label: 'Transportasi', icon: Car, color: 'bg-blue-100 text-blue-800' };
    }
    if (lower.includes('makan') || lower.includes('sarapan') || lower.includes('kuliner') || lower.includes('snack') || lower.includes('dinner')) {
      return { type: 'meal', label: 'Kuliner', icon: Utensils, color: 'bg-amber-100 text-amber-800' };
    }
    if (lower.includes('hotel') || lower.includes('check-in') || lower.includes('check-out') || lower.includes('istirahat')) {
      return { type: 'hotel', label: 'Hotel & Istirahat', icon: Hotel, color: 'bg-purple-100 text-purple-800' };
    }
    return { type: 'sightseeing', label: 'Kunjungan Wisata', icon: Ticket, color: 'bg-emerald-100 text-emerald-800' };
  };

  const isAllIn = order.tier === 'all_in';
  const currentDayData = itinerary.find((it) => it.day === selectedDay) || itinerary[0];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden mt-6">
      {/* Component Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-500 text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> ITINERARY TIMELINE WISATAWAN
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isAllIn ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {isAllIn ? 'Paket All In' : 'Paket Hemat'}
              </span>
              <span className="text-xs text-neutral-300 font-mono">
                {order.tourStartDate} s/d {order.tourEndDate}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Susunan Rute Perjalanan: {order.packageTitle}
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-2xl">
              Panduan interaktif rute dan jadwal harian tour Anda di <strong>{order.destinationLabel}</strong>. Tandai setiap spot yang sudah Anda kunjungi!
            </p>
          </div>

          {/* Quick View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-neutral-800/80 p-1 rounded-xl border border-neutral-700 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                viewMode === 'single'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Fokus Per Hari
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                viewMode === 'all'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Semua Hari ({totalDays})
            </button>
          </div>
        </div>

        {/* Assigned Driver & Unit Summary Bar */}
        <div className="mt-4 pt-4 border-t border-neutral-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2.5 bg-neutral-800/60 p-2.5 rounded-xl border border-neutral-700">
            <Car className="w-4 h-4 text-orange-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-neutral-400 block font-medium">Armada Bertugas:</span>
              <span className="font-bold text-white text-xs truncate">
                {order.selectedVehicle || order.assignedFleetName || 'Toyota HiAce Premio'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-neutral-800/60 p-2.5 rounded-xl border border-neutral-700">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-neutral-400 block font-medium">Driver Pengemudi:</span>
              <span className="font-bold text-white text-xs truncate">
                {order.assignedDriverName || 'Budi Santoso (Standar)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-neutral-800/60 p-2.5 rounded-xl border border-neutral-700">
            <Hotel className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-neutral-400 block font-medium">Akomodasi:</span>
              <span className="font-bold text-white text-xs truncate">
                {isAllIn 
                  ? (order.hotelAllotment || 'Hotel Bintang Terverifikasi')
                  : 'Penginapan Mandiri (Hemat)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Day Selection Tabs */}
      <div className="border-b border-neutral-200 bg-neutral-50 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {itinerary.map((it) => {
            const isCurrent = selectedDay === it.day;
            const dateLabel = getDayDateLabel(it.day);

            return (
              <button
                key={it.day}
                type="button"
                onClick={() => {
                  setSelectedDay(it.day);
                  if (viewMode === 'all') setViewMode('single');
                }}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  isCurrent && viewMode === 'single'
                    ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center ${
                  isCurrent && viewMode === 'single'
                    ? 'bg-white text-orange-600'
                    : 'bg-neutral-200 text-neutral-700'
                }`}>
                  {it.day}
                </span>
                <div className="text-left leading-tight">
                  <span className="block text-xs">Hari Ke-{it.day}</span>
                  <span className={`text-[10px] font-normal ${
                    isCurrent && viewMode === 'single' ? 'text-orange-100' : 'text-neutral-500'
                  }`}>
                    {dateLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Timeline Render Section */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Render Day Block(s) */}
        {(viewMode === 'all' ? itinerary : [currentDayData]).map((dayIt) => {
          const dateLabel = getDayDateLabel(dayIt.day);

          return (
            <div key={dayIt.day} className="space-y-4">
              {/* Day Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-orange-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                    D{dayIt.day}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-neutral-900">
                      {dayIt.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      {dayIt.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-[11px] font-bold text-orange-700 bg-white border border-orange-200 px-2.5 py-1 rounded-lg">
                    {dateLabel}
                  </span>
                </div>
              </div>

              {/* Step-by-Step Interactive Timeline Nodes */}
              <div className="relative pl-6 sm:pl-8 space-y-4 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-neutral-200">
                {dayIt.timeline && dayIt.timeline.length > 0 ? (
                  dayIt.timeline.map((item, idx) => {
                    const stopKey = `day-${dayIt.day}-tl-${idx}`;
                    const isChecked = !!completedStops[stopKey];
                    const meta = getTimelineTypeMeta(item.type || 'sightseeing');
                    const MetaIcon = meta.icon;

                    return (
                      <div
                        key={idx}
                        className={`relative group rounded-xl p-3.5 border transition-all ${
                          isChecked 
                            ? 'bg-emerald-50/50 border-emerald-300' 
                            : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-2xs'
                        }`}
                      >
                        {/* Timeline Node Dot */}
                        <button
                          type="button"
                          onClick={() => toggleStopCompleted(stopKey)}
                          className={`absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white scale-110 shadow-xs'
                              : 'bg-white border-orange-500 text-orange-500 hover:bg-orange-50'
                          }`}
                          title={isChecked ? 'Tandai belum selesai' : 'Tandai sudah dikunjungi'}
                        >
                          {isChecked ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <span className="text-[10px] font-black">{idx + 1}</span>
                          )}
                        </button>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Time Badge */}
                            <span className="text-xs font-mono font-black text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-orange-600" />
                              {item.time}
                            </span>

                            {/* Activity Category Badge */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${meta.color}`}>
                              <MetaIcon className="w-3 h-3" />
                              {meta.label}
                            </span>

                            {isChecked && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai Dikunjungi
                              </span>
                            )}
                          </div>

                          {/* Interactive toggle button */}
                          <button
                            type="button"
                            onClick={() => toggleStopCompleted(stopKey)}
                            className={`text-[11px] font-semibold flex items-center gap-1 self-start sm:self-auto transition-colors ${
                              isChecked ? 'text-emerald-700 hover:text-emerald-800' : 'text-neutral-500 hover:text-orange-600'
                            }`}
                          >
                            {isChecked ? 'Sudah Dilakukan' : 'Tandai Selesai'}
                          </button>
                        </div>

                        {/* Activity Title */}
                        <h4 className={`text-xs sm:text-sm font-bold leading-relaxed ${
                          isChecked ? 'line-through text-neutral-500' : 'text-neutral-900'
                        }`}>
                          {item.title}
                        </h4>

                        {/* Activity Description */}
                        {item.description && (
                          <p className={`text-xs mt-1 leading-relaxed ${
                            isChecked ? 'line-through text-neutral-400' : 'text-neutral-600'
                          }`}>
                            {item.description}
                          </p>
                        )}

                        {/* Notes / Inclusion note */}
                        <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-neutral-400" />
                            {item.notes || (
                              item.type === 'pickup' ? 'Armada pariwisata ber-AC & driver standby.' :
                              item.type === 'meal' ? (isAllIn ? 'Makan terjadwal & reservasi tempat.' : 'Makan mandiri.') :
                              item.type === 'hotel_checkin' ? `Check-in hotel: ${order.hotelAllotment || 'Hotel Terdaftar'}.` :
                              item.type === 'hotel_checkout' ? 'Check-out hotel & pemuatan bagasi.' :
                              item.type === 'shopping' ? 'Pusat oleh-oleh khas & kerajinan tangan.' :
                              item.type === 'dropoff' ? 'Pengantaran ke titik drop-off / bandara / stasiun.' :
                              'Kunjungan destinasi pariwisata.'
                            )}
                          </span>

                          <span className="font-mono text-[10px] text-neutral-400 font-bold">
                            Stop #{idx + 1}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  dayIt.activities.map((act, idx) => {
                    const stopKey = `day-${dayIt.day}-stop-${idx}`;
                    const isChecked = !!completedStops[stopKey];
                    const phase = getActivityPhase(idx, dayIt.activities.length);
                    const type = getActivityType(act);
                    const TypeIcon = type.icon;
                    const PhaseIcon = phase.icon;

                    return (
                      <div
                        key={idx}
                        className={`relative group rounded-xl p-3.5 border transition-all ${
                          isChecked 
                            ? 'bg-emerald-50/50 border-emerald-300' 
                            : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-2xs'
                        }`}
                      >
                        {/* Timeline Node Dot */}
                        <button
                          type="button"
                          onClick={() => toggleStopCompleted(stopKey)}
                          className={`absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white scale-110 shadow-xs'
                              : 'bg-white border-orange-500 text-orange-500 hover:bg-orange-50'
                          }`}
                          title={isChecked ? 'Tandai belum selesai' : 'Tandai sudah dikunjungi'}
                        >
                          {isChecked ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <span className="text-[10px] font-black">{idx + 1}</span>
                          )}
                        </button>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Phase Badge */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${phase.color}`}>
                              <PhaseIcon className="w-3 h-3" />
                              {phase.label}
                            </span>

                            {/* Activity Type Badge */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${type.color}`}>
                              <TypeIcon className="w-3 h-3" />
                              {type.label}
                            </span>

                            {isChecked && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai Dikunjungi
                              </span>
                            )}
                          </div>

                          {/* Interactive toggle button */}
                          <button
                            type="button"
                            onClick={() => toggleStopCompleted(stopKey)}
                            className={`text-[11px] font-semibold flex items-center gap-1 self-start sm:self-auto transition-colors ${
                              isChecked ? 'text-emerald-700 hover:text-emerald-800' : 'text-neutral-500 hover:text-orange-600'
                            }`}
                          >
                            {isChecked ? 'Sudah Dilakukan' : 'Tandai Selesai'}
                          </button>
                        </div>

                        {/* Activity Description */}
                        <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                          isChecked ? 'line-through text-neutral-500' : 'text-neutral-800'
                        }`}>
                          {act}
                        </p>

                        {/* Inclusion note depending on tier */}
                        <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-neutral-400" />
                            {type.type === 'transport' && 'Armada pariwisata ber-AC & driver standby.'}
                            {type.type === 'meal' && (
                              isAllIn 
                                ? 'Konsumsi include (Makan 1x di hotel & 2x/ hari di luar hotel).' 
                                : 'Konsumsi mandiri sesuai selera kuliner Anda.'
                            )}
                            {type.type === 'hotel' && (
                              isAllIn 
                                ? `Akomodasi hotel mitra: ${order.hotelAllotment || 'Hotel Terverifikasi'}.` 
                                : 'Penginapan mandiri sesuai preferensi Anda.'
                            )}
                            {type.type === 'sightseeing' && (
                              isAllIn 
                                ? 'Tiket masuk tercover penuh (All In).' 
                                : 'Tiket masuk bayar mandiri di loket (Paket Hemat).'
                            )}
                          </span>

                          <span className="font-mono text-[10px] text-neutral-400 font-bold">
                            Stop #{idx + 1}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}

        {/* Travel Tips & Safety Guidance Card */}
        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 space-y-2">
          <div className="flex items-center gap-2 font-bold text-neutral-900">
            <Info className="w-4 h-4 text-orange-600" />
            <span>Tips & Perlengkapan Tour {order.destinationLabel}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
              <span className="font-bold text-neutral-800 block">Pakaian & Alas Kaki:</span>
              <span>Gunakan pakaian nyaman, jaket hangat jika ke Bromo/Kaliurang, dan sepatu/sandal santai.</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
              <span className="font-bold text-neutral-800 block">Kartu Identitas (KTP/Passport):</span>
              <span>Wajib dibawa untuk verifikasi tiket destinasi & proses check-in hotel.</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
              <span className="font-bold text-neutral-800 block">Koordinasi Pengemudi:</span>
              <span>Supir kami standby 15 menit sebelum waktu penjemputan harian di lobi hotel.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
