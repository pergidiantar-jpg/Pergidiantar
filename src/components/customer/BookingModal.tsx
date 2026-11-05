import React, { useState } from 'react';
import { TourPackage, PackageTier, BookingOrder } from '../../types/travel';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Users, 
  Calendar, 
  MapPin, 
  Check, 
  Plus, 
  ShieldCheck, 
  CreditCard,
  Building,
  Phone,
  Mail,
  User,
  AlertCircle,
  Car,
  Sparkles
} from 'lucide-react';

interface BookingModalProps {
  packageData: TourPackage | null;
  initialTier?: PackageTier;
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: (order: BookingOrder) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  packageData,
  initialTier = 'all_in',
  isOpen,
  onClose,
  onProceedToPayment
}) => {
  const { createBooking, customerUser } = useApp();

  const [tier, setTier] = useState<PackageTier>(initialTier);
  const [paxCount, setPaxCount] = useState<number>(packageData?.minPax || 4);
  
  // Date calculation: default start date is 7 days from now
  const today = new Date();
  const defaultStart = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(defaultStart);

  // Customer details prefilled with registered Firebase user
  const [fullName, setFullName] = useState(customerUser?.displayName || '');
  const [whatsapp, setWhatsapp] = useState(customerUser?.phoneNumber || '087716443331');
  const [email, setEmail] = useState(customerUser?.email || '');
  const [companyOrFamily, setCompanyOrFamily] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [city, setCity] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Sync state if customer logs in or changes
  React.useEffect(() => {
    if (customerUser) {
      if (!fullName) setFullName(customerUser.displayName);
      if (!email) setEmail(customerUser.email);
      if (customerUser.phoneNumber && whatsapp === '087716443331') setWhatsapp(customerUser.phoneNumber);
    }
  }, [customerUser]);

  // Customer Fleet Selection Options: Avanza, Innova, Hi-Ace
  const CUSTOMER_FLEET_CHOICES = [
    {
      id: 'avanza' as const,
      name: 'Toyota Avanza',
      model: 'Grand New Avanza / Veloz',
      capacityText: '1 - 5 Kursi',
      maxPax: 5,
      ratePerPax: 0,
      badge: 'Termasuk Standar (Rp 0)',
      description: 'Armada lincah, AC double blower dingin, bagasi koper. Pilihan ideal untuk solo, duo, & keluarga kecil.'
    },
    {
      id: 'innova' as const,
      name: 'Toyota Innova Reborn',
      model: 'Kijang Innova Reborn / Venturer',
      capacityText: '4 - 7 Kursi',
      maxPax: 7,
      ratePerPax: 150000,
      badge: 'Upgrade Eksekutif (+Rp 150.000/pax)',
      description: 'Suspensi sangat empuk & senyap, kabin luas lega, captain seat. Rekomendasi utama kenyamanan keluarga.'
    },
    {
      id: 'hiace' as const,
      name: 'Toyota Hi-Ace Premio',
      model: 'HiAce Premio Luxury Executive',
      capacityText: '8 - 14 Kursi',
      maxPax: 14,
      ratePerPax: 250000,
      badge: 'Kapasitas Lega (+Rp 250.000/pax)',
      description: 'High-roof luas dapat berdiri, kursi reclining kulit, port USB tiap baris, mic karaoke audio.'
    }
  ];

  const [selectedFleetId, setSelectedFleetId] = useState<'avanza' | 'innova' | 'hiace'>(() => {
    if (paxCount <= 5) return 'avanza';
    if (paxCount <= 7) return 'innova';
    return 'hiace';
  });

  // Add-ons selection
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen || !packageData) return null;

  // Calculate End Date
  const start = new Date(startDate);
  const end = new Date(start.getTime() + (packageData.durationDays - 1) * 24 * 60 * 60 * 1000);
  const endDateStr = end.toISOString().split('T')[0];

  const selectedFleet = CUSTOMER_FLEET_CHOICES.find((f) => f.id === selectedFleetId) || CUSTOMER_FLEET_CHOICES[0];
  const vehicleUpgradePerPax = selectedFleet.ratePerPax;
  const vehicleUpgradeTotal = vehicleUpgradePerPax * paxCount;

  const pricePerPax = tier === 'all_in' ? packageData.priceAllInPerPax : packageData.priceHematPerPax;
  const basePackageSubtotal = pricePerPax * paxCount;
  const subtotal = basePackageSubtotal + vehicleUpgradeTotal;

  // Add-ons dictionary
  const availableAddOns = [
    { id: 'drone', label: 'Dokumentasi Drone & Video Teaser 4K', price: 600000, isPerPax: false },
    { id: 'bbq', label: 'Spesial BBQ / Gala Dinner Night', price: 150000, isPerPax: true },
    { id: 'merch', label: 'Kaos Polo Seragam Tour Keren', price: 75000, isPerPax: true },
    { id: 'snack_vip', label: 'Snack Box & Buah Segar Upgrade VIP', price: 25000, isPerPax: true }
  ];

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addOnsTotal = selectedAddOns.reduce((total, id) => {
    const item = availableAddOns.find((a) => a.id === id);
    if (!item) return total;
    return total + (item.isPerPax ? item.price * paxCount : item.price);
  }, 0);

  const grandTotal = subtotal + addOnsTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!fullName.trim() || !whatsapp.trim() || !pickupAddress.trim()) {
      setValidationError('Mohon lengkapi Nama Pemesan, WhatsApp, dan Alamat Titik Penjemputan.');
      return;
    }

    if (paxCount < packageData.minPax) {
      setValidationError(`Jumlah peserta minimal untuk paket ini adalah ${packageData.minPax} orang.`);
      return;
    }

    const addOnsNames = selectedAddOns.map(
      (id) => availableAddOns.find((a) => a.id === id)?.label || ''
    );

    const newOrderData = {
      packageId: packageData.id,
      packageTitle: packageData.title,
      category: packageData.category,
      categoryLabel: packageData.categoryLabel,
      destination: packageData.destinations[0],
      destinationLabel: packageData.destinationLabel,
      tier,
      tourStartDate: startDate,
      tourEndDate: endDateStr,
      paxCount,
      customer: {
        fullName,
        whatsapp,
        email: email || `${whatsapp.replace(/\D/g, '')}@pergidiantar.customer`,
        companyOrFamilyName: companyOrFamily || undefined,
        pickupAddress,
        city: city || 'Indonesia',
        specialRequests: specialRequests || undefined
      },
      pricePerPax,
      subtotal,
      addOnsTotal,
      addOnsList: addOnsNames,
      grandTotal,
      selectedVehicle: `${selectedFleet.name} (${selectedFleet.model})`,
      vehicleRateAdjustment: vehicleUpgradeTotal,
      paymentMethod: 'qris' as const,
      paymentStatus: 'pending' as const,
      orderStatus: 'baru' as const,
      notes: `Pemesanan online melalui website PERGIDIANTAR. Pilihan paket: ${tier === 'all_in' ? 'Paket All In (kendaraan, driver, bbm, parkir, tiket wisata, hotel, makan 1x di hotel dan 2x/ hari di luar hotel)' : 'Paket Hemat (kendaraan, driver, bbm, parkir)'}. Armada pilihan: ${selectedFleet.name} (${selectedFleet.model}) [Biaya: ${vehicleUpgradePerPax === 0 ? 'Termasuk Standar' : `+Rp ${vehicleUpgradePerPax.toLocaleString('id-ID')}/pax`}].`
    };

    const createdOrder = createBooking(newOrderData);
    onProceedToPayment(createdOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-neutral-200 p-0.5 shrink-0 shadow-xs">
              <img 
                src="/assets/aistudio/1793582722648_90a12056.jpg" 
                alt="Logo PERGIDIANTAR" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold text-orange-600 tracking-wider uppercase">
                FORMULIR RESERVASI ONLINE RESMI
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-neutral-900">
                {packageData.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Step 1: Package Tier & Dates */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-800 block">
                  Pilihan Fasilitas Paket
                </label>
                <span className="text-[11px] text-neutral-600 block mt-0.5">
                  {tier === 'all_in'
                    ? 'Paket All In (kendaraan, driver, bbm, parkir, tiket wisata, hotel, makan 1x di hotel dan 2x/ hari di luar hotel)'
                    : 'Paket Hemat (kendaraan, driver, bbm, parkir)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTier('all_in')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all border ${
                    tier === 'all_in'
                      ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                      : 'bg-white text-neutral-700 border-neutral-300'
                  }`}
                >
                  Paket All In
                </button>
                <button
                  type="button"
                  onClick={() => setTier('paket_hemat')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all border ${
                    tier === 'paket_hemat'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-neutral-700 border-neutral-300'
                  }`}
                >
                  Paket Hemat
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-neutral-200">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Tanggal Mulai Tour
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={today.toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full text-xs font-medium py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tanggal Selesai Tour
                </label>
                <input
                  type="date"
                  value={endDateStr}
                  disabled
                  className="w-full text-xs font-medium py-2 px-3 border border-neutral-200 rounded-lg bg-neutral-100 text-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" /> Jumlah Peserta (Pax)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={packageData.minPax}
                    max={packageData.maxPax}
                    value={paxCount}
                    onChange={(e) => setPaxCount(Math.max(1, parseInt(e.target.value) || 1))}
                    required
                    className="w-full text-xs font-bold py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <span className="text-xs text-neutral-500 shrink-0">Orang</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1.5: Pilihan Armada Kendaraan (Avanza, Innova, Hi-Ace) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Car className="w-4 h-4 text-orange-600" /> Pilihan Armada Kendaraan Wisata
              </h3>
              <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                {selectedFleet.name} dipilih
              </span>
            </div>

            <p className="text-[11px] text-neutral-500">
              Pilih kendaraan sesuai preferensi kenyamanan dan jumlah rombongan Anda. Semua unit ber-AC dingin, bersih, dan didampingi driver profesional.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {CUSTOMER_FLEET_CHOICES.map((fleet) => {
                const isSelected = selectedFleetId === fleet.id;
                const isOverPax = paxCount > fleet.maxPax;

                return (
                  <button
                    key={fleet.id}
                    type="button"
                    onClick={() => setSelectedFleetId(fleet.id)}
                    className={`text-left p-3 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/60 shadow-sm ring-1 ring-orange-400'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-neutral-900 flex items-center gap-1">
                          {fleet.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          isSelected ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {fleet.capacityText}
                        </span>
                      </div>

                      <p className="text-[10px] text-neutral-500 mb-2 leading-tight">
                        {fleet.model}
                      </p>

                      <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed mb-3">
                        {fleet.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <div className="text-[10px]">
                        {fleet.ratePerPax === 0 ? (
                          <span className="font-bold text-emerald-600">Rp 0 (Standar)</span>
                        ) : (
                          <span className="font-bold text-blue-700 font-mono">
                            +Rp {fleet.ratePerPax.toLocaleString('id-ID')}<span className="text-[9px] font-normal text-neutral-500">/pax</span>
                          </span>
                        )}
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-neutral-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-3" />}
                      </div>
                    </div>

                    {isOverPax && (
                      <div className="mt-1.5 text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        ⚠️ Peserta ({paxCount} pax) disarankan unit lebih besar.
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Customer Identity Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" /> Data Pemesan & Kontak Koordinator
              </h3>
              {customerUser && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Akun Terverifikasi ({customerUser.email})
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nama Lengkap Pemesan *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full text-xs py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Nomor WhatsApp Aktif *
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 0812-3456-7890"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  className="w-full text-xs py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" /> Email Konfirmasi (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="Contoh: budi@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-neutral-400" /> Nama Instansi / Keluarga
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PT Harapan Jaya / Trah Soedirman"
                  value={companyOrFamily}
                  onChange={(e) => setCompanyOrFamily(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Titik Penjemputan Rombongan *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bandara YIA / Stasiun Tugu Pintu Timur / Kantor SMAN 1"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  required
                  className="w-full text-xs py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Kota Asal Tamu
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Jakarta / Surabaya"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Catatan Khusus / Permintaan Tertentu (Opsional)
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Mohon sediakan menu makanan ramah vegetarian, kursi roda, atau banner khusus."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full text-xs py-2 px-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Step 3: Optional Add-ons */}
          <div>
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
              Layanan Tambahan (Add-On Pilihan)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableAddOns.map((addon) => {
                const isChecked = selectedAddOns.includes(addon.id);
                const itemCost = addon.isPerPax ? addon.price * paxCount : addon.price;

                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-400 text-neutral-900 shadow-2xs'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-orange-500 border-orange-500 text-white' : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                      <span className="font-medium text-neutral-800">{addon.label}</span>
                    </div>
                    <span className="font-mono text-neutral-600 font-semibold shrink-0" data-tabular>
                      +Rp {itemCost.toLocaleString('id-ID')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Breakdown Card */}
          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 text-xs space-y-2">
            <div className="flex justify-between text-neutral-600">
              <span>Paket {tier === 'all_in' ? 'All In VIP' : 'Paket Hemat'} ({paxCount} pax × Rp {pricePerPax.toLocaleString('id-ID')}):</span>
              <span className="font-mono font-medium" data-tabular>Rp {basePackageSubtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-orange-600" /> Armada {selectedFleet.name}:
              </span>
              <span className="font-mono font-medium" data-tabular>
                {vehicleUpgradeTotal > 0 ? (
                  <span className="text-blue-700 font-semibold">+Rp {vehicleUpgradeTotal.toLocaleString('id-ID')} (+Rp {selectedFleet.ratePerPax.toLocaleString('id-ID')}/pax)</span>
                ) : (
                  <span className="text-emerald-600 font-semibold">Termasuk Standar (Rp 0)</span>
                )}
              </span>
            </div>
            {addOnsTotal > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Total Layanan Tambahan (Add-ons):</span>
                <span className="font-mono font-medium" data-tabular>+Rp {addOnsTotal.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-orange-200 flex justify-between items-center text-neutral-900 font-bold">
              <span className="text-sm">Total Biaya Reservasi:</span>
              <span className="text-lg font-black text-orange-600 font-mono" data-tabular>
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-[11px] text-blue-700 font-medium">
              {tier === 'all_in'
                ? `Termasuk Paket All In: armada ${selectedFleet.name}, driver, bbm, parkir, tiket wisata, hotel, makan 1x di hotel dan 2x/ hari di luar hotel.`
                : `Termasuk Paket Hemat: armada ${selectedFleet.name}, driver, bbm, parkir.`}
            </p>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
            >
              <CreditCard className="w-4 h-4" />
              <span>Lanjut ke Pembayaran Terintegrasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
