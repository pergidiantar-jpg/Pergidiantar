import React, { useState } from 'react';
import { 
  ItineraryDay, 
  ItineraryTimelineItem, 
  ItineraryActivityType 
} from '../../types/travel';
import { createDefaultDayTimeline } from '../../utils/itineraryGenerator';
import { 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
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
  AlertCircle
} from 'lucide-react';

interface ItineraryTimelineEditorProps {
  days: ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
  cityLabel?: string;
}

const ACTIVITY_TYPE_CONFIG: Record<ItineraryActivityType, { label: string; icon: any; color: string }> = {
  pickup: { label: 'Penjemputan / Kedatangan', icon: Car, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  transport: { label: 'Perjalanan / Mobilisasi', icon: Compass, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
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
  cityLabel = 'Yogyakarta'
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [templateOrigin, setTemplateOrigin] = useState<string>('');

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

  const handleTimelineChange = (newTimeline: ItineraryTimelineItem[]) => {
    const updated = [...days];
    // Sync activities string list as well for backward compatibility
    const activitiesStr = newTimeline.map(t => `${t.time} - ${t.title}`);
    updated[activeDayIndex] = {
      ...updated[activeDayIndex],
      timeline: newTimeline,
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
      description: 'Aktivitas eksplorasi, foto bersama, dan menikmati wahana wisata.',
      type: 'sightseeing'
    };
    handleTimelineChange([...currentTimeline, newItem]);
  };

  const handleUpdateItem = (itemId: string, updates: Partial<ItineraryTimelineItem>) => {
    const currentTimeline = activeDay.timeline || [];
    const updated = currentTimeline.map(item => item.id === itemId ? { ...item, ...updates } : item);
    handleTimelineChange(updated);
  };

  const handleDeleteItem = (itemId: string) => {
    const currentTimeline = activeDay.timeline || [];
    if (currentTimeline.length <= 1) return;
    const updated = currentTimeline.filter(item => item.id !== itemId);
    handleTimelineChange(updated);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const currentTimeline = [...(activeDay.timeline || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentTimeline.length) return;
    const [moved] = currentTimeline.splice(index, 1);
    currentTimeline.splice(targetIndex, 0, moved);
    handleTimelineChange(currentTimeline);
  };

  const handleApplyDefaultTemplate = () => {
    const isLast = activeDayIndex === days.length - 1;
    const defaultTimeline = createDefaultDayTimeline(activeDay.day, isLast, cityLabel, templateOrigin || undefined);
    handleTimelineChange(defaultTimeline);
  };

  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    const isLast = true;
    const defaultTimeline = createDefaultDayTimeline(nextDayNum, isLast, cityLabel, templateOrigin || undefined);
    const newDay: ItineraryDay = {
      day: nextDayNum,
      title: `Hari Ke-${nextDayNum}: Eksplorasi Lanjutan`,
      description: `Rangkaian kegiatan wisata terstruktur di ${cityLabel}.`,
      timeline: defaultTimeline,
      activities: defaultTimeline.map(t => `${t.time} - ${t.title}`)
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

  const currentTimeline = activeDay.timeline && activeDay.timeline.length > 0
    ? activeDay.timeline
    : (activeDay.activities && activeDay.activities.length > 0)
    ? activeDay.activities.map((act, i) => {
        const timeMatch = act.match(/^(\d{2}:\d{2}\s*-\s*\d{2}:\d{2}|\d{2}:\d{2})/);
        const time = timeMatch ? timeMatch[0] : (i === 0 ? '08:00 - 10:00' : i === 1 ? '10:30 - 12:30' : i === 2 ? '13:00 - 14:00' : '15:00 - 17:00');
        const cleanTitle = timeMatch ? act.replace(timeMatch[0], '').replace(/^(\s*-\s*|\s*:\s*)/, '').trim() : act;
        let type: ItineraryActivityType = 'sightseeing';
        const low = act.toLowerCase();
        if (low.includes('jemput') || low.includes('antar') || low.includes('stasiun') || low.includes('bandara')) type = 'pickup';
        else if (low.includes('makan') || low.includes('sarapan') || low.includes('kuliner')) type = 'meal';
        else if (low.includes('check-in') || low.includes('check in')) type = 'hotel_checkin';
        else if (low.includes('check-out') || low.includes('check out')) type = 'hotel_checkout';
        else if (low.includes('oleh-oleh') || low.includes('belanja')) type = 'shopping';

        return {
          id: `tl-converted-${i}-${Date.now()}`,
          time,
          title: cleanTitle,
          description: 'Aktivitas terencana rombongan.',
          type
        };
      })
    : createDefaultDayTimeline(activeDay.day, activeDayIndex === days.length - 1, cityLabel);

  return (
    <div className="space-y-4 bg-neutral-50/80 p-4 sm:p-5 rounded-2xl border border-neutral-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>Penyusunan Jadwal & Itinerary Timeline Wisatawan</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Susun jadwal harian lengkap dengan pencantuman jam, tipe kegiatan, dan catatan rute agar tampil rapi di portal customer & pelacak pesanan.
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
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-orange-600 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}>
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
              <span>Terapkan Jam Template Logis</span>
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

            return (
              <div 
                key={item.id || idx}
                className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Time Input */}
                    <div className="flex items-center gap-1 bg-white border border-neutral-300 rounded-lg px-2 py-1 text-xs">
                      <Clock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => handleUpdateItem(item.id, { time: e.target.value })}
                        placeholder="08:00 - 09:30"
                        className="w-28 text-xs font-bold font-mono focus:outline-none bg-transparent"
                      />
                    </div>

                    {/* Activity Type Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={item.type || 'sightseeing'}
                        onChange={(e) => handleUpdateItem(item.id, { type: e.target.value as ItineraryActivityType })}
                        className="text-xs py-1 px-2.5 rounded-lg border border-neutral-300 bg-white font-semibold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="pickup">🚗 Penjemputan / Kedatangan</option>
                        <option value="transport">🧭 Perjalanan / Mobilisasi</option>
                        <option value="sightseeing">🏛️ Kunjungan Objek Wisata</option>
                        <option value="meal">🍽️ Makan (Pagi/Siang/Malam)</option>
                        <option value="hotel_checkin">🏨 Check-in Hotel</option>
                        <option value="hotel_checkout">🏨 Check-out Hotel</option>
                        <option value="shopping">🛍️ Belanja Oleh-Oleh Khas</option>
                        <option value="free_time">⏱️ Waktu Bebas / Istirahat</option>
                        <option value="dropoff">✈️ Pengantaran Pulang (Drop-off)</option>
                      </select>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${typeConfig.color}`}>
                      <TypeIcon className="w-3 h-3" />
                      <span>{typeConfig.label}</span>
                    </span>
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

                {/* Title & Description Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                      placeholder="Judul Aktivitas / Nama Destinasi (Contoh: Kunjungan Candi Prambanan)"
                      className="w-full text-xs font-semibold py-1.5 px-2.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                      placeholder="Catatan / Detail Kegiatan (Contoh: Menikmati panorama candi & spot foto)"
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
