import React, { useState } from 'react';
import {
  ItineraryDay,
  ItineraryTimelineItem,
  ItineraryActivityType,
  DestinationRegion
} from '../../types/travel';
import {
  createDefaultDayTimeline,
  recalculateTimelineWithDistances,
  hasGatheringKeyword,
  summarizeItineraryMetrics,
  convertActivitiesToTimeline
} from '../../utils/itineraryGenerator';
import {
  Plus,
  Trash2,
  Clock,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Car,
  Hotel,
  Utensils,
  Ticket,
  ShoppingBag,
  Moon,
  Compass,
  Target,
  Route,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface ItineraryTimelineEditorProps {
  days: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
  cityLabel?: string;
  destinationRegion?: DestinationRegion;
  packageTitle?: string;
  packageCategory?: string;
}

const ACTIVITY_TYPE_CONFIG: Record<ItineraryActivityType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  pickup: { label: 'Penjemputan / Kedatangan', icon: Car, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  transport: { label: 'Perjalanan / Mobilisasi', icon: Compass, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  outbound: { label: 'Outbound + Fasilitator', icon: Target, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  sightseeing: { label: 'Kunjungan Destinasi Wisata', icon: Ticket, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  meal: { label: 'Makan (Pagi/Siang/Malam)', icon: Utensils, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  hotel_checkin: { label: 'Check-in Hotel', icon: Hotel, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  hotel_checkout: { label: 'Check-out Hotel', icon: Hotel, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  shopping: { label: 'Belanja Oleh-Oleh Khas', icon: ShoppingBag, color: 'text-pink-600 bg-pink-50 border-pink-200' },
  free_time: { label: 'Waktu Bebas / Istirahat', icon: Moon, color: 'text-neutral-600 bg-neutral-100 border-neutral-300' },
  dropoff: { label: 'Pengantaran Kepulangan (Drop-off)', icon: Car, color: 'text-blue-700 bg-blue-100 border-blue-300' }
};

export const ItineraryTimelineEditor: React.FC<ItineraryTimelineEditorProps> = ({
  days,
  onChange,
  cityLabel = 'Yogyakarta',
  destinationRegion,
  packageTitle,
  packageCategory
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [templateOrigin, setTemplateOrigin] = useState<string>('');

  const resolvedRegion: DestinationRegion =
    destinationRegion ||
    (cityLabel.toLowerCase().includes('bali')
      ? 'bali'
      : cityLabel.toLowerCase().includes('malang')
      ? 'malang'
      : 'jogja');

  const isGatheringPkg = hasGatheringKeyword(packageTitle, packageCategory);
  const metrics = summarizeItineraryMetrics(days);

  const activeDay = days[activeDayIndex] || days[0];

  const handleDayTitleChange = (newTitle: string) => {
    const updated = [...days];
    updated[activeDayIndex] = {
      ...updated[activeDayIndex],
      title: newTitle
    };
    onChange(updated);
  };

  const handleDayDescriptionChange = (newDesc: string) => {
    const updated = [...days];
    updated[activeDayIndex] = {
      ...updated[activeDayIndex],
      description: newDesc
    };
    onChange(updated);
  };

  const handleTimelineChange = (newTimeline: ItineraryTimelineItem[], retimeSchedule = true) => {
    const recalculated = recalculateTimelineWithDistances(newTimeline, resolvedRegion, {
      retimeSchedule
    });
    const updated = [...days];
    const activitiesStr = recalculated.map((t) => `${t.time} - ${t.title}`);
    updated[activeDayIndex] = {
      ...updated[activeDayIndex],
      timeline: recalculated,
      activities: activitiesStr
    };
    onChange(updated);
  };

  const handleAddTimelineItem = () => {
    const currentTimeline = activeDay.timeline || [];
    const newItem: ItineraryTimelineItem = {
      id: `tl-item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      time: '14:00 - 15:30',
      title: 'Kunjungan Destinasi Wisata Pilihan',
      location: cityLabel,
      description: 'Aktivitas eksplorasi, foto bersama, dan menikmati wahana wisata.',
      type: 'sightseeing'
    };
    handleTimelineChange([...currentTimeline, newItem], true);
  };

  const handleUpdateItem = (
    itemId: string,
    updates: Partial<ItineraryTimelineItem>,
    shouldRetime: boolean
  ) => {
    const currentTimeline = activeDay.timeline || [];
    const updated = currentTimeline.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    handleTimelineChange(updated, shouldRetime);
  };

  const handleDeleteItem = (itemId: string) => {
    const currentTimeline = activeDay.timeline || [];
    if (currentTimeline.length <= 1) return;
    const updated = currentTimeline.filter((item) => item.id !== itemId);
    handleTimelineChange(updated, true);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const currentTimeline = [...(activeDay.timeline || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentTimeline.length) return;
    const [moved] = currentTimeline.splice(index, 1);
    currentTimeline.splice(targetIndex, 0, moved);
    handleTimelineChange(currentTimeline, true);
  };

  const handleApplyDefaultTemplate = () => {
    const isLast = activeDayIndex === days.length - 1;
    const defaultTimeline = createDefaultDayTimeline(
      activeDay.day,
      isLast,
      cityLabel,
      templateOrigin || undefined,
      isGatheringPkg && activeDay.day === 2
    );
    handleTimelineChange(defaultTimeline, true);
  };

  const handleRecalculateAllDistancesAndTimes = () => {
    const currentTimeline =
      activeDay.timeline && activeDay.timeline.length > 0
        ? activeDay.timeline
        : convertActivitiesToTimeline(activeDay.activities || [], activeDay.day);
    handleTimelineChange(currentTimeline, true);
  };

  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    const isLast = true;
    const defaultTimeline = createDefaultDayTimeline(
      nextDayNum,
      isLast,
      cityLabel,
      templateOrigin || undefined,
      isGatheringPkg && nextDayNum === 2
    );
    const newDay: ItineraryDay = {
      day: nextDayNum,
      title: `Hari Ke-${nextDayNum}: Eksplorasi Lanjutan`,
      description: `Rangkaian kegiatan wisata terstruktur di ${cityLabel}.`,
      timeline: defaultTimeline,
      activities: defaultTimeline.map((t) => `${t.time} - ${t.title}`)
    };
    const updated = [...days, newDay];
    onChange(updated);
    setActiveDayIndex(updated.length - 1);
  };

  const handleRemoveDay = () => {
    if (days.length <= 1) return;
    const updated = days.slice(0, -1);
    onChange(updated);
    if (activeDayIndex >= updated.length) {
      setActiveDayIndex(updated.length - 1);
    }
  };

  const currentTimeline =
    activeDay.timeline && activeDay.timeline.length > 0
      ? activeDay.timeline
      : activeDay.activities && activeDay.activities.length > 0
      ? convertActivitiesToTimeline(activeDay.activities, activeDay.day)
      : createDefaultDayTimeline(
          activeDay.day,
          activeDayIndex === days.length - 1,
          cityLabel,
          undefined,
          isGatheringPkg && activeDay.day === 2
        );

  return (
    <div className="space-y-4 bg-neutral-50/80 p-4 sm:p-5 rounded-2xl border border-neutral-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider flex-wrap">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>Penyusunan Jadwal & Itinerary Timeline Wisatawan</span>
            {metrics.totalDistanceKm > 0 && (
              <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full normal-case flex items-center gap-1">
                <Route className="w-3 h-3" />
                Total Rute ±{metrics.totalDistanceKm} km ({metrics.totalTransitMinutes} mnt transit)
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Ubah destinasi atau lokasi untuk menghitung jarak tempuh & menyesuaikan jam secara otomatis dan real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddDay}
            className="py-1.5 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Hari</span>
          </button>
          {days.length > 1 && (
            <button
              type="button"
              onClick={handleRemoveDay}
              className="py-1.5 px-2.5 bg-neutral-200 hover:bg-rose-100 hover:text-rose-700 text-neutral-700 rounded-lg text-xs font-semibold transition-colors"
              title="Hapus hari terakhir"
            >
              Hapus Hari Terakhir
            </button>
          )}
        </div>
      </div>

      {/* Gathering Day-2 Outbound Auto-Sync Banner */}
      {isGatheringPkg && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-2.5 text-xs text-teal-900">
          <Target className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold block">
              Paket Gathering Terdeteksi — Outbound + Fasilitator Hari Ke-2 Aktif Otomatis
            </span>
            <span className="text-[11px] text-teal-800">
              Sistem menyisipkan sesi Outbound & Team Building pada Hari Ke-2 dan menyesuaikan seluruh estimasi jam serta jarak antar lokasi secara logis.
            </span>
          </div>
        </div>
      )}

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {days.map((d, idx) => {
          const isActive = idx === activeDayIndex;
          return (
            <button
              key={d.day}
              type="button"
              onClick={() => setActiveDayIndex(idx)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              <span>Hari {d.day}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-orange-600 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {(d.timeline || d.activities || []).length} Agenda
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Form */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-neutral-700 mb-1">
              Judul Hari Ke-{activeDay.day} *
            </label>
            <input
              type="text"
              value={activeDay.title}
              onChange={(e) => handleDayTitleChange(e.target.value)}
              placeholder="Contoh: Hari 1: Penjemputan, Wisata Candi & Check-in Hotel"
              className="w-full text-xs py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-neutral-700 mb-1">
              Ringkasan Keterangan Hari *
            </label>
            <input
              type="text"
              value={activeDay.description || ''}
              onChange={(e) => handleDayDescriptionChange(e.target.value)}
              placeholder="Contoh: Penyambutan ramah di bandara/stasiun dengan armada AC dingin."
              className="w-full text-xs py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
            />
          </div>
        </div>

        {/* Timeline Header & Quick Auto Template */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-neutral-900">
              Rangkaian Waktu & Aktivitas (Jam Logis)
            </span>
            <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-bold">
              {currentTimeline.length} Kegiatan
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={templateOrigin}
              onChange={(e) => setTemplateOrigin(e.target.value)}
              className="text-[11px] py-1 px-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-700 font-semibold"
              title="Pilih kota asal penjemputan untuk template perjalanan antar kota"
            >
              <option value="">Rute Lokal ({cityLabel})</option>
              <option value="Yogyakarta">Dari Yogyakarta</option>
              <option value="Jakarta">Dari Jakarta / Jawa Barat</option>
              <option value="Surabaya">Dari Surabaya / Sidoarjo</option>
              <option value="Solo">Dari Solo / Surakarta</option>
              <option value="Semarang">Dari Semarang</option>
            </select>
            <button
              type="button"
              onClick={handleApplyDefaultTemplate}
              className="text-[11px] text-orange-600 hover:text-orange-700 font-bold bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
              title="Isi otomatis dengan urutan jam standar pariwisata"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Template Jam Logis</span>
            </button>
            <button
              type="button"
              onClick={handleRecalculateAllDistancesAndTimes}
              className="text-[11px] text-blue-700 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
              title="Hitung ulang estimasi jarak antar destinasi dan sesuaikan jam otomatis"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span>Hitung Ulang Jarak & Jam</span>
            </button>
            <button
              type="button"
              onClick={handleAddTimelineItem}
              className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Jam Baru</span>
            </button>
          </div>
        </div>

        {/* Timeline Items List */}
        <div className="space-y-3">
          {currentTimeline.map((item, idx) => {
            const typeConfig = ACTIVITY_TYPE_CONFIG[item.type || 'sightseeing'] || ACTIVITY_TYPE_CONFIG.sightseeing;
            const TypeIcon = typeConfig.icon;
            const isOutbound = item.type === 'outbound';

            return (
              <div
                key={item.id || idx}
                className={`p-3 rounded-xl border transition-all space-y-2.5 ${
                  isOutbound
                    ? 'bg-teal-50/60 border-teal-300 hover:border-teal-400'
                    : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Time Input */}
                    <div className="flex items-center gap-1 bg-white border border-neutral-300 rounded-lg px-2 py-1 text-xs">
                      <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => handleUpdateItem(item.id, { time: e.target.value }, false)}
                        placeholder="08:00 - 09:30"
                        className="w-28 text-xs font-bold font-mono focus:outline-none bg-transparent"
                      />
                    </div>

                    {/* Activity Type Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={item.type || 'sightseeing'}
                        onChange={(e) =>
                          handleUpdateItem(item.id, { type: e.target.value as ItineraryActivityType }, true)
                        }
                        className="text-xs py-1 px-2.5 rounded-lg border border-neutral-300 bg-white font-semibold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="pickup">🚗 Penjemputan / Kedatangan</option>
                        <option value="transport">🧭 Perjalanan / Mobilisasi</option>
                        <option value="outbound">🎯 Outbound + Fasilitator</option>
                        <option value="sightseeing">🏛️ Kunjungan Objek Wisata</option>
                        <option value="meal">🍽️ Makan (Pagi/Siang/Malam)</option>
                        <option value="hotel_checkin">🏨 Check-in Hotel</option>
                        <option value="hotel_checkout">🏨 Check-out Hotel</option>
                        <option value="shopping">🛍️ Belanja Oleh-Oleh Khas</option>
                        <option value="free_time">⏱️ Waktu Bebas / Istirahat</option>
                        <option value="dropoff">✈️ Pengantaran Pulang (Drop-off)</option>
                      </select>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${typeConfig.color}`}
                    >
                      <TypeIcon className="w-3 h-3" />
                      <span>{typeConfig.label}</span>
                    </span>

                    {typeof item.distanceKm === 'number' && item.distanceKm > 0 && (
                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Route className="w-3 h-3" />
                        +{item.distanceKm} km · Est. {item.travelMinutes || 15} mnt transit
                      </span>
                    )}
                  </div>

                  {/* Actions: Move Up, Move Down, Delete */}
                  <div className="flex items-center gap-1 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveItem(idx, 'up')}
                      className="p-1 text-neutral-500 hover:text-neutral-800 disabled:opacity-30 transition-colors"
                      title="Pindah ke atas"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === currentTimeline.length - 1}
                      onClick={() => handleMoveItem(idx, 'down')}
                      className="p-1 text-neutral-500 hover:text-neutral-800 disabled:opacity-30 transition-colors"
                      title="Pindah ke bawah"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={currentTimeline.length <= 1}
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-neutral-400 hover:text-rose-600 disabled:opacity-30 transition-colors ml-1"
                      title="Hapus slot jam ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title, Location & Description Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateItem(item.id, { title: e.target.value }, true)}
                      placeholder="Judul Aktivitas (Contoh: Kunjungan Candi Prambanan)"
                      className="w-full text-xs font-semibold py-1.5 px-2.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={item.location || ''}
                      onChange={(e) => handleUpdateItem(item.id, { location: e.target.value }, true)}
                      placeholder="Lokasi / Nama Destinasi (Hitung Jarak)"
                      className="w-full text-xs font-semibold py-1.5 pl-8 pr-2.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-800"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => handleUpdateItem(item.id, { description: e.target.value }, false)}
                      placeholder="Catatan / Detail Kegiatan"
                      className="w-full text-xs py-1.5 px-2.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 text-neutral-600"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
