import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TourPackage, DestinationRegion, PackageCategory } from '../../types/travel';
import { 
  Compass, 
  Edit3, 
  Trash2, 
  Plus, 
  MapPin, 
  DollarSign, 
  Check, 
  X, 
  Save, 
  AlertCircle,
  ShieldCheck,
  Calendar,
  Users,
  Car
} from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const PackageManagement: React.FC = () => {
  const { packages, updatePackage, deletePackage, currentRole } = useApp();

  const isSuperAdmin = currentRole === 'super_admin';

  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<TourPackage | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for editing
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PackageCategory>('single_trip');
  const [categoryLabel, setCategoryLabel] = useState('Single Trip');
  const [destinationRegion, setDestinationRegion] = useState<DestinationRegion>('jogja');
  const [destinationLabel, setDestinationLabel] = useState('Yogyakarta');
  const [priceHemat, setPriceHemat] = useState<number>(0);
  const [priceAllIn, setPriceAllIn] = useState<number>(0);
  const [durationDays, setDurationDays] = useState<number>(2);
  const [durationNights, setDurationNights] = useState<number>(1);
  const [minPax, setMinPax] = useState<number>(1);
  const [maxPax, setMaxPax] = useState<number>(12);
  const [recommendedVehicle, setRecommendedVehicle] = useState('');
  const [highlightPointsStr, setHighlightPointsStr] = useState('');

  const openEditModal = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setTitle(pkg.title);
    setCategory(pkg.category);
    setCategoryLabel(pkg.categoryLabel);
    setDestinationRegion(pkg.destinations[0] || 'jogja');
    setDestinationLabel(pkg.destinationLabel);
    setPriceHemat(pkg.priceHematPerPax);
    setPriceAllIn(pkg.priceAllInPerPax);
    setDurationDays(pkg.durationDays);
    setDurationNights(pkg.durationNights);
    setMinPax(pkg.minPax);
    setMaxPax(pkg.maxPax);
    setRecommendedVehicle(pkg.recommendedVehicle);
    setHighlightPointsStr(pkg.highlightPoints.join('\n'));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    const updated: TourPackage = {
      ...editingPackage,
      title: title.trim(),
      category,
      categoryLabel: 
        category === 'single_trip' ? 'Single Trip' :
        category === 'family_trip' ? 'Family Trip' :
        category === 'family_gathering' ? 'Family Gathering' :
        category === 'company_gathering' ? 'Company Gathering' : 'Study Tour',
      destinations: [destinationRegion],
      destinationLabel: 
        destinationRegion === 'jogja' ? 'Yogyakarta' :
        destinationRegion === 'malang' ? 'Malang & Bromo' : 'Bali',
      priceHematPerPax: Number(priceHemat),
      priceAllInPerPax: Number(priceAllIn),
      durationDays: Number(durationDays),
      durationNights: Number(durationNights),
      minPax: Number(minPax),
      maxPax: Number(maxPax),
      recommendedVehicle: recommendedVehicle.trim() || 'Toyota Avanza / Innova / Hi-Ace',
      highlightPoints: highlightPointsStr
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0)
    };

    updatePackage(updated);
    setEditingPackage(null);
  };

  const confirmDelete = () => {
    if (deletingPackage) {
      deletePackage(deletingPackage.id);
      setDeletingPackage(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" /> Hak Akses Khusus Super Admin
              </span>
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mt-1">
              Pengelolaan Paket Wisata & Penyesuaian Harga
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Super Admin berwenang mengubah harga paket (Hemat & All-In), mengubah kota tujuan wisata (Jogja, Malang, Bali), kuota peserta, dan armada rekomendasi.
            </p>
          </div>
        </div>
      </div>

      {/* Package Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4 hover:border-neutral-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                      {pkg.categoryLabel}
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      {pkg.destinationLabel}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 mt-2">
                    {pkg.title}
                  </h3>
                  <span className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    {pkg.durationDays} Hari {pkg.durationNights} Malam · Min {pkg.minPax} - {pkg.maxPax} Pax
                  </span>
                </div>
              </div>

              {/* Price comparison box */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold block uppercase">
                    Harga Paket Hemat:
                  </span>
                  <span className="text-sm font-black text-blue-700 font-mono">
                    Rp {pkg.priceHematPerPax.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-neutral-500 block">/ pax (kendaraan, driver, bbm, parkir)</span>
                </div>
                <div>
                  <span className="text-[10px] text-orange-600 font-bold block uppercase">
                    Harga Paket All In:
                  </span>
                  <span className="text-sm font-black text-orange-600 font-mono">
                    Rp {pkg.priceAllInPerPax.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-orange-700/80 block">/ pax (lengkap tiket, hotel, makan)</span>
                </div>
              </div>

              {/* Vehicle & Inclusions */}
              <div className="text-xs text-neutral-600 space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
                  <Car className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="truncate">Armada: {pkg.recommendedVehicle}</span>
                </div>
                <div className="text-[11px] text-neutral-500 truncate">
                  Fasilitas: Transport + Driver + BBM + Hotel + Makan + Tiket Wisata
                </div>
              </div>
            </div>

            {/* Super Admin Action Buttons */}
            {isSuperAdmin ? (
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="py-1.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Edit Harga & Tujuan</span>
                </button>
                <button
                  onClick={() => setDeletingPackage(pkg)}
                  className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Hapus Paket Wisata"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="pt-2 text-[11px] text-neutral-400 italic">
                *Hanya Super Admin yang berhak mengubah harga paket ini
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Package Modal */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setEditingPackage(null)}
          />

          <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl p-6 sm:p-7 z-10 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                    Hak Akses Super Admin
                  </span>
                  <h3 className="text-base font-extrabold text-neutral-900 leading-tight">
                    Edit Harga Paket & Tujuan Wisata
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setEditingPackage(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Nama / Judul Paket Wisata *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl font-semibold text-neutral-900 focus:ring-2 focus:ring-orange-500 bg-neutral-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" /> Kota Tujuan Wisata *
                  </label>
                  <select
                    value={destinationRegion}
                    onChange={(e) => {
                      const val = e.target.value as DestinationRegion;
                      setDestinationRegion(val);
                      setDestinationLabel(val === 'jogja' ? 'Yogyakarta' : val === 'malang' ? 'Malang & Bromo' : 'Bali');
                    }}
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl font-bold text-neutral-800 bg-neutral-50 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="jogja">Yogyakarta (Jogja)</option>
                    <option value="malang">Malang & Bromo</option>
                    <option value="bali">Bali Pulau Dewata</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">
                    Kategori Penawaran *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PackageCategory)}
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl font-bold text-neutral-800 bg-neutral-50 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="single_trip">Single Trip (Jogja)</option>
                    <option value="family_trip">Family Trip (Jogja)</option>
                    <option value="family_gathering">Family Gathering (Jogja, Malang, Bali)</option>
                    <option value="company_gathering">Company Gathering (Jogja)</option>
                    <option value="study_tour">Study Tour (Jogja, Malang, Bali)</option>
                  </select>
                </div>
              </div>

              {/* Price inputs: Hemat & All-In */}
              <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-3">
                <span className="text-[11px] font-bold text-orange-900 uppercase tracking-wider block">
                  Penetapan Harga Tarif per Pax (Peserta)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">
                      Harga Paket Hemat (Rp/pax) *
                    </label>
                    <span className="text-[10px] text-blue-700 block mb-1 font-medium">
                      Inklusi: (kendaraan, driver, bbm, parkir)
                    </span>
                    <input
                      type="number"
                      step={50000}
                      min={100000}
                      value={priceHemat}
                      onChange={(e) => setPriceHemat(Number(e.target.value))}
                      required
                      className="w-full py-2 px-3 border border-neutral-300 rounded-xl font-mono font-bold text-neutral-900 bg-white focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-[10px] text-neutral-500 mt-0.5 block">
                      Rp {Number(priceHemat).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">
                      Harga Paket All In (Rp/pax) *
                    </label>
                    <span className="text-[10px] text-orange-700 block mb-1 font-medium">
                      Inklusi: (kendaraan, driver, bbm, parkir, tiket wisata, hotel, makan 1x di hotel dan 2x/ hari di luar hotel)
                    </span>
                    <input
                      type="number"
                      step={50000}
                      min={100000}
                      value={priceAllIn}
                      onChange={(e) => setPriceAllIn(Number(e.target.value))}
                      required
                      className="w-full py-2 px-3 border border-neutral-300 rounded-xl font-mono font-bold text-orange-600 bg-white focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-[10px] text-neutral-500 mt-0.5 block">
                      Rp {Number(priceAllIn).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Duration and capacity */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Durasi Hari *</label>
                  <input
                    type="number"
                    min={1}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    required
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl font-bold bg-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Durasi Malam *</label>
                  <input
                    type="number"
                    min={0}
                    value={durationNights}
                    onChange={(e) => setDurationNights(Number(e.target.value))}
                    required
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl font-bold bg-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Min Pax *</label>
                  <input
                    type="number"
                    min={1}
                    value={minPax}
                    onChange={(e) => setMinPax(Number(e.target.value))}
                    required
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl font-bold bg-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Max Pax *</label>
                  <input
                    type="number"
                    min={1}
                    value={maxPax}
                    onChange={(e) => setMaxPax(Number(e.target.value))}
                    required
                    className="w-full py-2 px-3 border border-neutral-300 rounded-xl font-bold bg-neutral-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Rekomendasi Armada Kendaraan
                </label>
                <input
                  type="text"
                  value={recommendedVehicle}
                  onChange={(e) => setRecommendedVehicle(e.target.value)}
                  placeholder="Contoh: Toyota Avanza / Kijang Innova / HiAce Premio"
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl font-medium bg-neutral-50 text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Highlight Poin Wisata (Satu poin per baris)
                </label>
                <textarea
                  rows={3}
                  value={highlightPointsStr}
                  onChange={(e) => setHighlightPointsStr(e.target.value)}
                  className="w-full py-2 px-3 border border-neutral-300 rounded-xl bg-neutral-50 text-neutral-900 font-medium"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="py-2 px-4 rounded-xl text-neutral-600 hover:bg-neutral-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Paket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPackage && (
        <DeleteConfirmModal
          isOpen={true}
          title="Hapus Paket Wisata"
          confirmItemName={`Paket ${deletingPackage.title} (${deletingPackage.destinationLabel})`}
          message="Paket wisata ini akan dihapus permanen dari sistem katalog pelanggan PERGIDIANTAR."
          onConfirm={confirmDelete}
          onClose={() => setDeletingPackage(null)}
        />
      )}
    </div>
  );
};
