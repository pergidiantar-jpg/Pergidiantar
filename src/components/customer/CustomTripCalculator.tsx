import React, { useState, useId } from 'react';
import { useApp } from '../../context/AppContext';
import { DestinationRegion, BookingOrder } from '../../types/travel';
import { 
  Calculator, 
  MapPin, 
  Calendar, 
  Users, 
  Car, 
  Camera, 
  Sparkles, 
  Utensils, 
  CheckCircle2, 
  ArrowRight, 
  Percent, 
  CreditCard, 
  Compass, 
  Tag, 
  ShieldCheck, 
  Info, 
  Plus, 
  Minus, 
  Check, 
  AlertCircle,
  Star,
  Gift,
  AlertTriangle
} from 'lucide-react';
import { handleImageFallback } from '../../utils/imageUtils';
import {
  DestinationOption,
  INITIAL_DESTINATIONS,
  BONUS_DESTINATIONS,
  getMaxDestinationsForDuration,
  BonusDestinationInfo
} from '../../data/destinationsData';

interface CustomTripCalculatorProps {
  onProceedToPayment?: (order: BookingOrder) => void;
  defaultDestination?: DestinationRegion;
}

export const CustomTripCalculator: React.FC<CustomTripCalculatorProps> = ({ 
  onProceedToPayment,
  defaultDestination = 'jogja'
}) => {
  const { 
    customerUser, 
    createBooking, 
    setActiveOrderForPayment,
    destinations: cloudDestinations,
    bonusDestinations: ctxBonusDestinations,
    getMaxDestinationsForDuration: ctxGetMaxDestinationsForDuration
  } = useApp();

  const allDestinations = cloudDestinations && cloudDestinations.length > 0 ? cloudDestinations : INITIAL_DESTINATIONS;

  // State: Inputs
  const [destination, setDestination] = useState<DestinationRegion>(defaultDestination);
  const activeBonus = (ctxBonusDestinations && ctxBonusDestinations[destination]) || BONUS_DESTINATIONS[destination];
  const [durationDays, setDurationDays] = useState<number>(3); // 2 to 7 days
  const [paxCount, setPaxCount] = useState<number>(6); // must be number >= 1
  const [selectedTransport, setSelectedTransport] = useState<'Innova' | 'HiAce' | 'Medium Bus' | 'Big Bus'>('Innova');
  const [pickupCity, setPickupCity] = useState<string>('Yogyakarta');
  
  // Add-ons
  const [hasDocumentation, setHasDocumentation] = useState<boolean>(false);
  const [hasOutbound, setHasOutbound] = useState<boolean>(false);
  const [breakfastCount, setBreakfastCount] = useState<number>(2); // 0 to durationDays
  const [lunchCount, setLunchCount] = useState<number>(3); // 0 to durationDays
  const [dinnerCount, setDinnerCount] = useState<number>(2); // 0 to durationDays

  // Quota and notification states
  const [quotaNotice, setQuotaNotice] = useState<string | null>(null);

  // Selected Destinations (minimum 1 wajib pilih, maksimal dibatasi durasi)
  const [selectedDestIds, setSelectedDestIds] = useState<string[]>(() => {
    const initialCityDests = INITIAL_DESTINATIONS.filter(d => d.city === defaultDestination);
    return initialCityDests.slice(0, 4).map(d => d.id);
  });

  // Selected pricing model: 'package_discount' (10% off) or 'per_pax'
  const [selectedPricingOption, setSelectedPricingOption] = useState<'package_discount' | 'per_pax'>('package_discount');

  // Calculation Results
  const [calculationResult, setCalculationResult] = useState<{
    calculated: boolean;
    transportCostTotal: number;
    ticketCostTotal: number;
    mealCostTotal: number;
    addOnDocTotal: number;
    addOnOutboundTotal: number;
    pickupSurchargeTotal: number;
    baseSubtotal: number;
    pricePerPaxNormal: number;
    discountAmount: number;
    packagePriceTotalDiscounted: number;
    packagePricePerPaxDiscounted: number;
    vehicleUnitCount: number;
    destinationsList: DestinationOption[];
  } | null>(null);

  const [validationError, setValidationError] = useState<string | null>(null);

  // Filter available destinations by active city (20 destinasi per kota)
  const availableDestinations = allDestinations.filter(d => d.city === destination);
  const maxAllowedDestinations = (ctxGetMaxDestinationsForDuration || getMaxDestinationsForDuration)(durationDays);

  // Auto-switch default pickup city when destination changes
  const handleDestinationChange = (newDest: DestinationRegion) => {
    setDestination(newDest);
    setQuotaNotice(null);
    setValidationError(null);
    const maxAllowed = (ctxGetMaxDestinationsForDuration || getMaxDestinationsForDuration)(durationDays);
    const cityDests = allDestinations.filter(d => d.city === newDest);
    if (newDest === 'jogja') {
      setPickupCity('Yogyakarta');
      setSelectedDestIds(cityDests.slice(0, Math.min(4, maxAllowed)).map(d => d.id));
    } else if (newDest === 'malang') {
      setPickupCity('Malang');
      setSelectedDestIds(cityDests.slice(0, Math.min(4, maxAllowed)).map(d => d.id));
    } else {
      setPickupCity('Denpasar / Bandara Ngurah Rai');
      setSelectedDestIds(cityDests.slice(0, Math.min(4, maxAllowed)).map(d => d.id));
    }
    // reset calculation
    setCalculationResult(null);
  };

  // Duration change handler enforcing strict destination quota limits
  const handleDurationChange = (days: number) => {
    setDurationDays(days);
    const newMax = (ctxGetMaxDestinationsForDuration || getMaxDestinationsForDuration)(days);
    if (selectedDestIds.length > newMax) {
      setSelectedDestIds(prev => prev.slice(0, newMax));
      setQuotaNotice(`Durasi tour diatur ke ${days}D${days - 1}N (maksimal ${newMax} destinasi). Pilihan destinasi otomatis disesuaikan dengan kuota maksimal.`);
    } else {
      setQuotaNotice(null);
    }
    // Adjust meal limits
    setBreakfastCount(prev => Math.min(days, prev));
    setLunchCount(prev => Math.min(days, prev));
    setDinnerCount(prev => Math.min(days, prev));
    setCalculationResult(null);
  };

  const toggleDestination = (destId: string) => {
    setValidationError(null);
    setQuotaNotice(null);
    if (selectedDestIds.includes(destId)) {
      if (selectedDestIds.length <= 1) {
        setValidationError('Jumlah destinasi wisata wajib dipilih minimal 1 destinasi.');
        return;
      }
      setSelectedDestIds(prev => prev.filter(id => id !== destId));
      setCalculationResult(null);
    } else {
      const maxAllowed = (ctxGetMaxDestinationsForDuration || getMaxDestinationsForDuration)(durationDays);
      if (selectedDestIds.length >= maxAllowed) {
        setQuotaNotice(`Batas kuota maksimal untuk durasi ${durationDays}D${durationDays - 1}N adalah ${maxAllowed} destinasi wisata. Hapus salah satu destinasi terlebih dahulu atau pilih durasi yang lebih panjang.`);
        return;
      }
      setSelectedDestIds(prev => [...prev, destId]);
      setCalculationResult(null);
    }
  };

  // Smart Transport Suggestion helper
  const getSuggestedTransport = (pax: number) => {
    if (pax <= 6) return 'Innova';
    if (pax <= 14) return 'HiAce';
    if (pax <= 33) return 'Medium Bus';
    return 'Big Bus';
  };

  // Run calculation based on average internet benchmark prices
  const handleCalculatePrice = () => {
    setValidationError(null);

    // Validation
    if (isNaN(paxCount) || paxCount < 1) {
      setValidationError('Jumlah peserta wajib diisi berupa angka minimal 1 orang.');
      return;
    }

    if (durationDays < 2 || durationDays > 7) {
      setValidationError('Durasi perjalanan minimal 2 hari 1 malam dan maksimal 7 hari 6 malam.');
      return;
    }

    if (selectedDestIds.length === 0) {
      setValidationError('Jumlah destinasi wisata wajib dipilih minimal 1 destinasi.');
      return;
    }

    if (!pickupCity.trim()) {
      setValidationError('Kota penjemputan wajib diisi.');
      return;
    }

    // 1. Transport Costs (Benchmark Tarif Pariwisata Indonesia include BBM, Driver, Parkir)
    // Innova Reborn: ~Rp 700.000 / hari
    // HiAce Premio: ~Rp 1.350.000 / hari
    // Medium Bus: ~Rp 2.100.000 / hari
    // Big Bus: ~Rp 3.500.000 / hari
    let vehicleRatePerDay = 700000;
    let vehicleCapacity = 6;
    if (selectedTransport === 'Innova') {
      vehicleRatePerDay = 700000;
      vehicleCapacity = 6;
    } else if (selectedTransport === 'HiAce') {
      vehicleRatePerDay = 1350000;
      vehicleCapacity = 14;
    } else if (selectedTransport === 'Medium Bus') {
      vehicleRatePerDay = 2100000;
      vehicleCapacity = 33;
    } else if (selectedTransport === 'Big Bus') {
      vehicleRatePerDay = 3500000;
      vehicleCapacity = 50;
    }

    // Calculate how many vehicles are needed based on pax count
    const vehicleUnitCount = Math.max(1, Math.ceil(paxCount / vehicleCapacity));
    const transportCostTotal = vehicleRatePerDay * durationDays * vehicleUnitCount;

    // 2. Destinations & Tickets Cost
    const selectedDestObjects = allDestinations.filter(d => selectedDestIds.includes(d.id));
    const avgTicketSum = selectedDestObjects.reduce((acc, d) => acc + d.avgTicketPrice, 0);
    const ticketCostTotal = avgTicketSum * paxCount;

    // 3. Meals Cost (Rata-rata internet: Pagi Rp 30k, Siang Rp 45k, Malam Rp 50k)
    const breakfastTotal = breakfastCount * 30000 * paxCount;
    const lunchTotal = lunchCount * 45000 * paxCount;
    const dinnerTotal = dinnerCount * 50000 * paxCount;
    const mealCostTotal = breakfastTotal + lunchTotal + dinnerTotal;

    // 4. Add-ons
    // Dokumentasi: Rp 750.000 per trip (Foto, Video & Drone)
    const addOnDocTotal = hasDocumentation ? 750000 * Math.max(1, Math.ceil(durationDays / 2)) : 0;
    // Outbound + Fasilitator: Rp 1.500.000
    const addOnOutboundTotal = hasOutbound ? 1500000 : 0;

    // 5. Pickup Surcharge if picked up from outside primary city
    let pickupSurchargeTotal = 0;
    const cleanPickup = pickupCity.toLowerCase();
    const isBaseCity = 
      (destination === 'jogja' && (cleanPickup.includes('jogja') || cleanPickup.includes('yogyakarta') || cleanPickup.includes('yia') || cleanPickup.includes('tugu'))) ||
      (destination === 'malang' && (cleanPickup.includes('malang') || cleanPickup.includes('batu') || cleanPickup.includes('abdulrachman'))) ||
      (destination === 'bali' && (cleanPickup.includes('bali') || cleanPickup.includes('denpasar') || cleanPickup.includes('ngurah') || cleanPickup.includes('kuta') || cleanPickup.includes('ubud')));

    if (!isBaseCity) {
      // Nearby outer cities (Solo, Semarang, Surabaya, Sidoarjo) vs Far cities (Jakarta, Bandung)
      if (cleanPickup.includes('solo') || cleanPickup.includes('surakarta') || cleanPickup.includes('semarang') || cleanPickup.includes('surabaya')) {
        pickupSurchargeTotal = 350000 * vehicleUnitCount;
      } else {
        pickupSurchargeTotal = 750000 * vehicleUnitCount;
      }
    }

    // Totals
    const baseSubtotal = transportCostTotal + ticketCostTotal + mealCostTotal + addOnDocTotal + addOnOutboundTotal + pickupSurchargeTotal;
    const pricePerPaxNormal = Math.round(baseSubtotal / paxCount);

    // 10% Discount for Package Pricing Option
    const discountAmount = Math.round(baseSubtotal * 0.10);
    const packagePriceTotalDiscounted = baseSubtotal - discountAmount;
    const packagePricePerPaxDiscounted = Math.round(packagePriceTotalDiscounted / paxCount);

    setCalculationResult({
      calculated: true,
      transportCostTotal,
      ticketCostTotal,
      mealCostTotal,
      addOnDocTotal,
      addOnOutboundTotal,
      pickupSurchargeTotal,
      baseSubtotal,
      pricePerPaxNormal,
      discountAmount,
      packagePriceTotalDiscounted,
      packagePricePerPaxDiscounted,
      vehicleUnitCount,
      destinationsList: selectedDestObjects
    });
  };

  // Proceed to booking and payment
  const handleProceedAgreement = () => {
    if (!calculationResult) return;

    const nights = Math.max(1, durationDays - 1);
    const destinationLabel = destination === 'jogja' ? 'Yogyakarta' : destination === 'malang' ? 'Malang & Bromo' : 'Bali';

    const chosenFinalPrice = selectedPricingOption === 'package_discount' 
      ? calculationResult.packagePriceTotalDiscounted 
      : calculationResult.baseSubtotal;

    const chosenFinalPerPax = selectedPricingOption === 'package_discount' 
      ? calculationResult.packagePricePerPaxDiscounted 
      : calculationResult.pricePerPaxNormal;

    const selectedAddOnsList: string[] = [];
    if (hasDocumentation) selectedAddOnsList.push(`Dokumentasi Foto/Video (Rp ${calculationResult.addOnDocTotal.toLocaleString('id-ID')})`);
    if (hasOutbound) selectedAddOnsList.push(`Outbound & Team Building + Fasilitator (Rp ${calculationResult.addOnOutboundTotal.toLocaleString('id-ID')})`);
    if (breakfastCount > 0) selectedAddOnsList.push(`Makan Pagi (${breakfastCount}x)`);
    if (lunchCount > 0) selectedAddOnsList.push(`Makan Siang (${lunchCount}x)`);
    if (dinnerCount > 0) selectedAddOnsList.push(`Makan Malam (${dinnerCount}x)`);

    const newOrderData: Omit<BookingOrder, 'id' | 'orderNumber' | 'createdAt'> = {
      packageId: `custom-${destination}-${Date.now()}`,
      packageTitle: `Custom Tour ${destinationLabel} ${durationDays}D${nights}N (${paxCount} Pax)`,
      category: paxCount > 15 ? 'company_gathering' : paxCount > 6 ? 'family_gathering' : 'family_trip',
      categoryLabel: 'Custom Tour Mandiri',
      destination,
      destinationLabel,
      tier: 'all_in',
      tourStartDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      tourEndDate: new Date(Date.now() + 86400000 * (3 + durationDays)).toISOString().split('T')[0],
      paxCount,
      pricePerPax: chosenFinalPerPax,
      subtotal: chosenFinalPrice,
      addOnsTotal: calculationResult.addOnDocTotal + calculationResult.addOnOutboundTotal,
      addOnsList: selectedAddOnsList,
      grandTotal: chosenFinalPrice,
      paymentMethod: 'qris',
      paymentStatus: 'pending',
      orderStatus: 'baru',
      selectedVehicle: `${selectedTransport} (${calculationResult.vehicleUnitCount} Unit)`,
      customer: {
        fullName: customerUser?.displayName || 'Pelanggan PERGIDIANTAR',
        whatsapp: customerUser?.phoneNumber || '087716443331',
        email: customerUser?.email || 'wisatawan@gmail.com',
        city: pickupCity || 'Yogyakarta',
        pickupAddress: `${pickupCity} (Titik Jemput Kustom Pelanggan)`,
        specialRequests: `Custom Tour: ${calculationResult.destinationsList.map(d => d.name).join(', ')}. Termasuk Bonus Ikonik & Oleh-Oleh: ${activeBonus.items.join(', ')}. Inklusi: Transport ${selectedTransport}, Makan (${breakfastCount}x pagi, ${lunchCount}x siang, ${dinnerCount}x malam)${hasDocumentation ? ', Dokumentasi Foto/Video' : ''}${hasOutbound ? ', Outbound + Fasilitator' : ''}.${selectedPricingOption === 'package_discount' ? ' (Mendapatkan Diskon 10% Harga Paket)' : ''}`
      },
      notes: `Order Custom Trip dihitung via Kalkulator Biaya Online PERGIDIANTAR. Diskon Paket: ${selectedPricingOption === 'package_discount' ? '10% Diterapkan' : 'Tarif Normal Per Pax'}.`
    };

    const created = createBooking(newOrderData);

    if (onProceedToPayment) {
      onProceedToPayment(created);
    } else {
      setActiveOrderForPayment(created);
    }
  };

  const destinationCities = [
    { 
      key: 'jogja' as const, 
      label: 'Yogyakarta (Jogja)', 
      desc: 'Budaya, Candi & Wisata Alam', 
      image: '/assets/images/dest_jogja_heritage_1793579234240.jpg',
      color: 'orange' 
    },
    { 
      key: 'malang' as const, 
      label: 'Malang & Bromo', 
      desc: 'Sunrise Bromo, Apel & Theme Park', 
      image: '/assets/images/dest_malang_bromo_1793579235303.jpg',
      color: 'blue' 
    },
    { 
      key: 'bali' as const, 
      label: 'Bali Pulau Dewata', 
      desc: 'Pantai, Pura & Tari Tradisional', 
      image: '/assets/images/dest_bali_paradise_1793579235747.jpg',
      color: 'emerald' 
    }
  ];

  const popularPickupCities = ['Yogyakarta', 'Solo', 'Semarang', 'Surabaya', 'Malang', 'Denpasar', 'Jakarta', 'Bandung'];

  const customTripId = useId();

  return (
    <div id="custom-trip-calculator" className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden my-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 p-6 sm:p-8 text-white relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30 mb-2">
              <Calculator className="w-4 h-4 text-orange-400" />
              <span>KALKULATOR CERDAS BIAYA TOUR ONLINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Atur Jenis Trip & Hitung Biaya Per Pax
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Sesuaikan kota tujuan, durasi liburan, jumlah destinasi, armada, dan fasilitas add-on sesuai rencana Anda. Sistem menghitung estimasi biaya riil dari benchmark rata-rata internet dengan <strong className="text-orange-400">Diskon 10% untuk Harga Paket</strong>!
            </p>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/40 rounded-2xl p-3.5 text-center shrink-0">
            <span className="text-[10px] font-black uppercase text-orange-400 block tracking-wider">
              PROMO KHUSUS CUSTOM
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono block mt-0.5">
              DISKON 10%
            </span>
            <span className="text-[11px] text-neutral-300 block">Pilihan Pembelian Paket</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Form */}
      <div className="p-6 sm:p-8 space-y-8">
        {validationError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold">{validationError}</span>
          </div>
        )}

        {/* STEP 1: KOTA TUJUAN */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">1</span>
            <label className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
              Pilih Kota Tujuan Wisata
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {destinationCities.map((c) => {
              const isSelected = destination === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => handleDestinationChange(c.key)}
                  className={`p-3.5 rounded-2xl border text-left transition-all group overflow-hidden ${
                    isSelected
                      ? 'bg-orange-50/90 border-orange-500 shadow-sm ring-2 ring-orange-500/20'
                      : 'bg-white hover:bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div className="relative h-28 rounded-xl overflow-hidden mb-3 bg-neutral-100">
                    <img
                      src={c.image}
                      alt={c.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => handleImageFallback(e, c.key)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white">
                      <span className="text-[11px] font-bold tracking-wide flex items-center gap-1 drop-shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-orange-400" />
                        {c.label.split(' ')[0]}
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-white/70 bg-black/40 text-transparent'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-neutral-900 block leading-tight">{c.label}</span>
                  <span className="text-xs text-neutral-500 mt-1 block line-clamp-1">{c.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: DURASI & JUMLAH PESERTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
          {/* Durasi (2D1N s/d 7D6N) */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">2</span>
              <label className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
                Durasi Tour (2 Hari 1 Malam s/d 7 Hari 6 Malam) *
              </label>
            </div>
            <p className="text-xs text-neutral-500">
              Pilih durasi liburan Anda. Minimal 2 hari 1 malam dan maksimal 7 hari 6 malam.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
              {[2, 3, 4, 5, 6, 7].map((days) => {
                const nights = days - 1;
                const isSelected = durationDays === days;
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() => handleDurationChange(days)}
                    className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md ring-2 ring-orange-400/30'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="block font-black text-sm">{days}D{nights}N</span>
                    <span className={`text-[9px] sm:text-[10px] block mt-0.5 font-medium leading-tight ${isSelected ? 'text-orange-100 font-bold' : 'text-neutral-500'}`}>
                      Maks. {getMaxDestinationsForDuration(days)} Wisata
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Jumlah Peserta (Wajib Angka) */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">3</span>
              <label htmlFor={`${customTripId}-pax`} className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
                Jumlah Peserta (Pax) - Wajib Angka *
              </label>
            </div>
            <p className="text-xs text-neutral-500">
              Kapasitas armada akan disesuaikan otomatis (rekomendasi: {getSuggestedTransport(paxCount)}).
            </p>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center bg-neutral-100 rounded-xl p-1 border border-neutral-300">
                <button
                  type="button"
                  onClick={() => {
                    setPaxCount(prev => Math.max(1, prev - 1));
                    setCalculationResult(null);
                  }}
                  className="w-10 h-10 rounded-lg bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center font-bold transition-colors shadow-2xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  id={`${customTripId}-pax`}
                  type="number"
                  min={1}
                  max={200}
                  value={paxCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setPaxCount(isNaN(val) ? 1 : Math.max(1, val));
                    setCalculationResult(null);
                  }}
                  required
                  className="w-20 text-center text-lg font-black font-mono bg-transparent text-neutral-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPaxCount(prev => prev + 1);
                    setCalculationResult(null);
                  }}
                  className="w-10 h-10 rounded-lg bg-white hover:bg-neutral-200 text-neutral-800 flex items-center justify-center font-bold transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 text-xs bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-800 block">Kategori Rombongan:</span>
                <span className="text-neutral-500">
                  {paxCount <= 6 ? 'Private / Keluarga Kecil' : paxCount <= 14 ? 'Family Gathering Sedang' : 'Rombongan Besar / Corporate Tour'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 3: PILIHAN JENIS TRANSPORT */}
        <div className="space-y-3 pt-4 border-t border-neutral-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">4</span>
              <label className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
                Pilihan Jenis Transportasi (Armada) *
              </label>
            </div>
            <span className="text-xs text-orange-600 font-semibold">
              Termasuk Unit Ber-AC, Driver Berlisensi, BBM Penuh & Retribusi Parkir
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              {
                id: 'Innova' as const,
                name: 'Kijang Innova Reborn',
                seats: '1 - 6 Kursi',
                desc: 'Suspensi empuk, kabin senyap, ideal untuk keluarga kecil',
                dailyRate: 'Rp 700.000 / hari'
              },
              {
                id: 'HiAce' as const,
                name: 'Toyota HiAce Premio Luxury',
                seats: '7 - 14 Kursi',
                desc: 'Reclining leather seats, AC dingin merata, charger USB',
                dailyRate: 'Rp 1.350.000 / hari'
              },
              {
                id: 'Medium Bus' as const,
                name: 'Medium Bus Jetbus 5',
                seats: '15 - 33 Kursi',
                desc: 'Konfigurasi 2-2 lega, audio karaoke, Smart TV & bagasi',
                dailyRate: 'Rp 2.100.000 / hari'
              },
              {
                id: 'Big Bus' as const,
                name: 'Big Bus SHD Pariwisata',
                seats: '34 - 50 Kursi',
                desc: 'Air suspension empuk, toilet higienis, dispenser air panas',
                dailyRate: 'Rp 3.500.000 / hari'
              }
            ].map((flt) => {
              const isSelected = selectedTransport === flt.id;
              const isRecommended = getSuggestedTransport(paxCount) === flt.id;

              return (
                <div
                  key={flt.id}
                  onClick={() => {
                    setSelectedTransport(flt.id);
                    setCalculationResult(null);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-orange-50/90 border-orange-500 shadow-sm ring-2 ring-orange-500/20'
                      : 'bg-white hover:bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm text-neutral-900">{flt.name}</span>
                      {isRecommended && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Saran Kapasitas
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block mb-1">
                      {flt.seats}
                    </span>
                    <p className="text-xs text-neutral-500 leading-snug">{flt.desc}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-neutral-700">{flt.dailyRate}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-orange-500 bg-orange-500 text-white' : 'border-neutral-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 4: JUMLAH DESTINASI WISATA (WAJIB PILIH DENGAN BATAS KUOTA DURASI) */}
        <div className="space-y-4 pt-4 border-t border-neutral-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">5</span>
              <label className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
                Pilih Destinasi Wisata
              </label>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                selectedDestIds.length >= maxAllowedDestinations 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {selectedDestIds.length} / {maxAllowedDestinations} Terpilih
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-100 px-3 py-1 rounded-xl">
              <Info className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Paket <strong>{durationDays}D{durationDays - 1}N</strong>: Maksimal <strong>{maxAllowedDestinations} Destinasi</strong></span>
            </div>
          </div>

          {/* Quota Rules Quick Guide */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-600 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-neutral-700 font-semibold">
              <Compass className="w-4 h-4 text-orange-500" />
              <span>Aturan Kuota Destinasi PERGIDIANTAR:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
              <span className={`px-2 py-0.5 rounded ${durationDays === 2 ? 'bg-orange-500 text-white font-bold' : 'bg-white border border-neutral-200 text-neutral-600'}`}>2D1N (Maks. 4)</span>
              <span className={`px-2 py-0.5 rounded ${durationDays === 3 ? 'bg-orange-500 text-white font-bold' : 'bg-white border border-neutral-200 text-neutral-600'}`}>3D2N (Maks. 6)</span>
              <span className={`px-2 py-0.5 rounded ${durationDays === 4 ? 'bg-orange-500 text-white font-bold' : 'bg-white border border-neutral-200 text-neutral-600'}`}>4D3N (Maks. 8)</span>
              <span className={`px-2 py-0.5 rounded ${durationDays === 5 ? 'bg-orange-500 text-white font-bold' : 'bg-white border border-neutral-200 text-neutral-600'}`}>5D4N (Maks. 10)</span>
              <span className={`px-2 py-0.5 rounded ${durationDays === 6 ? 'bg-orange-500 text-white font-bold' : 'bg-white border border-neutral-200 text-neutral-600'}`}>6D5N (Maks. 12)</span>
              <span className={`px-2 py-0.5 rounded ${durationDays === 7 ? 'bg-orange-500 text-white font-bold' : 'bg-white border border-neutral-200 text-neutral-600'}`}>7D6N (Maks. 14)</span>
            </div>
          </div>

          {/* Quota Alert / Notice */}
          {quotaNotice && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="flex-1">
                <span className="font-bold block">Pemberitahuan Kuota Destinasi:</span>
                <span className="text-[11px] leading-relaxed">{quotaNotice}</span>
              </div>
            </div>
          )}

          {/* BONUS DESTINASI KHUSUS (SUDAH TERMASUK OTOMATIS) */}
          <div className="p-4 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 border border-orange-200 rounded-2xl space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                  <Gift className="w-3 h-3" />
                  BONUS SUDAH TERMASUK
                </span>
                <h4 className="font-extrabold text-xs sm:text-sm text-neutral-900">
                  {activeBonus.title}
                </h4>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg shrink-0">
                ✓ Gratis Tanpa Memotong Kuota Pilihan
              </span>
            </div>

            <p className="text-xs text-neutral-600">
              {activeBonus.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {activeBonus.items.map((bonusItem, bIdx) => (
                <div key={bIdx} className="bg-white/90 backdrop-blur-xs border border-orange-200/80 rounded-xl p-2.5 flex items-center gap-2 text-xs font-semibold text-neutral-800 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="leading-tight">{bonusItem}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
            <span>
              Pilihan <strong>20 Destinasi Wisata Terpopuler & Viral di {destination === 'jogja' ? 'Yogyakarta' : destination === 'malang' ? 'Malang & Bromo' : 'Bali'}</strong> (Rating 4.6–4.9, review ribuan wisatawan):
            </span>
            <span className="font-semibold text-neutral-700">
              Tersisa {Math.max(0, maxAllowedDestinations - selectedDestIds.length)} Slot Pilihan
            </span>
          </div>

          {/* Grid 20 Destinasi Wisata Terkurasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1.5 border border-neutral-200 rounded-2xl bg-neutral-50/50">
            {availableDestinations.map((d) => {
              const isChecked = selectedDestIds.includes(d.id);
              const isMaxReached = selectedDestIds.length >= maxAllowedDestinations;
              const isDisabled = !isChecked && isMaxReached;

              return (
                <div
                  key={d.id}
                  onClick={() => toggleDestination(d.id)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                    isChecked
                      ? 'bg-white border-orange-500 shadow-sm ring-2 ring-orange-500/20'
                      : isDisabled
                      ? 'bg-neutral-100/60 border-neutral-200 opacity-60 hover:opacity-100 hover:border-neutral-300'
                      : 'bg-white border-neutral-200 hover:border-orange-300 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isChecked ? 'border-orange-500 bg-orange-500 text-white' : 'border-neutral-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="font-extrabold text-neutral-900 leading-tight">
                          {d.name}
                        </span>
                      </div>
                      {d.badge && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 shrink-0">
                          {d.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-2">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 font-medium text-neutral-700">
                        {d.category}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {d.rating}
                      </span>
                      <span className="text-neutral-400">({d.reviewCount})</span>
                    </div>

                    <p className="text-[11px] text-neutral-600 mt-1.5 leading-snug line-clamp-2">
                      {d.highlight}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500">Estimasi Tiket:</span>
                    <span className="font-mono font-bold text-orange-700">
                      ~Rp {d.avgTicketPrice.toLocaleString('id-ID')} / pax
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 5: ADD ON & KOTA PENJEMPUTAN */}
        <div className="space-y-4 pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-black flex items-center justify-center">6</span>
            <label className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
              Tambahan Add-On, Konsumsi & Kota Penjemputan
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Dokumentasi */}
            <div 
              onClick={() => {
                setHasDocumentation(!hasDocumentation);
                setCalculationResult(null);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                hasDocumentation ? 'bg-orange-50/80 border-orange-500 ring-1 ring-orange-500/20' : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-orange-600" /> Dokumentasi Tour
                </span>
                <input
                  type="checkbox"
                  checked={hasDocumentation}
                  onChange={() => {}}
                  className="rounded text-orange-500 focus:ring-orange-400 w-4 h-4"
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                Fotografer + videografer profesional, hasil cinematic edited & drone aerial video.
              </p>
              <span className="text-xs font-mono font-bold text-orange-700 block mt-2">
                +Rp 750.000 / trip
              </span>
            </div>

            {/* Outbound + Fasilitator */}
            <div 
              onClick={() => {
                setHasOutbound(!hasOutbound);
                setCalculationResult(null);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                hasOutbound ? 'bg-orange-50/80 border-orange-500 ring-1 ring-orange-500/20' : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Outbound + Fasilitator
                </span>
                <input
                  type="checkbox"
                  checked={hasOutbound}
                  onChange={() => {}}
                  className="rounded text-blue-600 focus:ring-blue-400 w-4 h-4"
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                Game Master, games equipment fun games, sound system portable & spanduk acara.
              </p>
              <span className="text-xs font-mono font-bold text-blue-700 block mt-2">
                +Rp 1.500.000 / paket
              </span>
            </div>

            {/* Kota Penjemputan */}
            <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2">
              <label htmlFor={`${customTripId}-pickup`} className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" /> Kota Penjemputan *
              </label>
              <input
                id={`${customTripId}-pickup`}
                type="text"
                placeholder="Ketik kota jemput / bandara / stasiun..."
                value={pickupCity}
                onChange={(e) => {
                  setPickupCity(e.target.value);
                  setCalculationResult(null);
                }}
                className="w-full text-xs py-2 px-3 border border-neutral-300 rounded-xl bg-white font-semibold text-neutral-900 focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {popularPickupCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setPickupCity(c);
                      setCalculationResult(null);
                    }}
                    className={`text-[10px] py-0.5 px-2 rounded-md border ${
                      pickupCity === c ? 'bg-orange-500 text-white border-orange-500 font-bold' : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pengaturan Konsumsi & Makan */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <span className="text-xs font-extrabold text-neutral-900 block flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-amber-600" /> Pengaturan Jumlah Konsumsi (Makan) Selama Trip
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor={`${customTripId}-breakfast`} className="text-xs text-neutral-700 font-bold block mb-1">
                  Makan Pagi (Sarapan)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id={`${customTripId}-breakfast`}
                    type="number"
                    min={0}
                    max={durationDays}
                    value={breakfastCount}
                    onChange={(e) => {
                      setBreakfastCount(Math.max(0, parseInt(e.target.value, 10) || 0));
                      setCalculationResult(null);
                    }}
                    className="w-20 text-center font-mono font-bold text-xs py-1.5 px-2 border border-neutral-300 rounded-lg bg-white"
                  />
                  <span className="text-[11px] text-neutral-500">kali (@Rp 30.000/pax)</span>
                </div>
              </div>

              <div>
                <label htmlFor={`${customTripId}-lunch`} className="text-xs text-neutral-700 font-bold block mb-1">
                  Makan Siang (Lunch)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id={`${customTripId}-lunch`}
                    type="number"
                    min={0}
                    max={durationDays}
                    value={lunchCount}
                    onChange={(e) => {
                      setLunchCount(Math.max(0, parseInt(e.target.value, 10) || 0));
                      setCalculationResult(null);
                    }}
                    className="w-20 text-center font-mono font-bold text-xs py-1.5 px-2 border border-neutral-300 rounded-lg bg-white"
                  />
                  <span className="text-[11px] text-neutral-500">kali (@Rp 45.000/pax)</span>
                </div>
              </div>

              <div>
                <label htmlFor={`${customTripId}-dinner`} className="text-xs text-neutral-700 font-bold block mb-1">
                  Makan Malam (Dinner)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id={`${customTripId}-dinner`}
                    type="number"
                    min={0}
                    max={durationDays}
                    value={dinnerCount}
                    onChange={(e) => {
                      setDinnerCount(Math.max(0, parseInt(e.target.value, 10) || 0));
                      setCalculationResult(null);
                    }}
                    className="w-20 text-center font-mono font-bold text-xs py-1.5 px-2 border border-neutral-300 rounded-lg bg-white"
                  />
                  <span className="text-[11px] text-neutral-500">kali (@Rp 50.000/pax)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTON: CEK HARGA */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={handleCalculatePrice}
            className="py-3.5 px-8 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm sm:text-base transition-all shadow-lg hover:shadow-orange-500/25 flex items-center gap-2.5 transform hover:-translate-y-0.5"
          >
            <Calculator className="w-5 h-5" />
            <span>Cek Harga & Hitung Estimasi Biaya</span>
          </button>
        </div>

        {/* RESULTS SECTION: MUNCOL HARGA PER PAX & HARGA PER PAKET DENGAN DISKON 10% */}
        {calculationResult && calculationResult.calculated && (
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white space-y-6 mt-6 border border-neutral-800 shadow-2xl animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 block">
                  HASIL KALKULASI ESTIMASI TARIF TOUR
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Rincian Biaya Tour {destination === 'jogja' ? 'Yogyakarta' : destination === 'malang' ? 'Malang & Bromo' : 'Bali'} ({durationDays} Hari {durationDays - 1} Malam)
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-neutral-800 py-1.5 px-3 rounded-xl border border-neutral-700 text-xs">
                <Users className="w-4 h-4 text-orange-400" />
                <span className="font-bold">{paxCount} Peserta</span>
                <span className="text-neutral-500">·</span>
                <span className="font-bold">{selectedTransport}</span>
              </div>
            </div>

            {/* Breakdown itemized list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-neutral-800/80 rounded-xl border border-neutral-700">
                <span className="text-neutral-400 block text-[11px]">Sewa Armada & Kru:</span>
                <span className="font-mono font-bold text-white text-sm">
                  Rp {calculationResult.transportCostTotal.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {calculationResult.vehicleUnitCount} Unit {selectedTransport} ({durationDays} Hari)
                </span>
              </div>

              <div className="p-3 bg-neutral-800/80 rounded-xl border border-neutral-700">
                <span className="text-neutral-400 block text-[11px]">Tiket Masuk Destinasi:</span>
                <span className="font-mono font-bold text-white text-sm">
                  Rp {calculationResult.ticketCostTotal.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {calculationResult.destinationsList.length} Destinasi x {paxCount} Pax
                </span>
              </div>

              <div className="p-3 bg-neutral-800/80 rounded-xl border border-neutral-700">
                <span className="text-neutral-400 block text-[11px]">Konsumsi & Makan:</span>
                <span className="font-mono font-bold text-white text-sm">
                  Rp {calculationResult.mealCostTotal.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {breakfastCount}x Pagi, {lunchCount}x Siang, {dinnerCount}x Malam
                </span>
              </div>

              <div className="p-3 bg-neutral-800/80 rounded-xl border border-neutral-700">
                <span className="text-neutral-400 block text-[11px]">Add-On & Penjemputan:</span>
                <span className="font-mono font-bold text-white text-sm">
                  Rp {(calculationResult.addOnDocTotal + calculationResult.addOnOutboundTotal + calculationResult.pickupSurchargeTotal).toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {pickupCity} {hasDocumentation ? '· Foto/Video' : ''} {hasOutbound ? '· Outbound' : ''}
                </span>
              </div>
            </div>

            {/* BONUS DESTINASI TERMASUK (IKON KOTA & SENTRA OLEH-OLEH) */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-amber-950/40 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-300">
                      Bonus Wisata Termasuk:
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      GRATIS / INCLUDE
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-300 block">
                    {activeBonus.title} &bull; Kunjungan: {activeBonus.items.join(', ')}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] text-emerald-400 font-bold block font-mono">Rp 0 (Bonus Trip)</span>
                <span className="text-[10px] text-neutral-400">Termasuk oleh-oleh & ikon kota</span>
              </div>
            </div>

            {/* DUA PILIHAN PENAWARAN: HARGA SATUAN (PER PAX) VS HARGA PAKET (DISKON 10%) */}
            <div className="pt-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-3 text-center sm:text-left">
                Pilih Skema Biaya Reservasi:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* OPTION 1: HARGA PAKET (DISKON 10%) - RECOMMENDED */}
                <div 
                  onClick={() => setSelectedPricingOption('package_discount')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all relative ${
                    selectedPricingOption === 'package_discount'
                      ? 'bg-gradient-to-br from-orange-950/80 to-neutral-900 border-orange-500 ring-2 ring-orange-500 shadow-xl'
                      : 'bg-neutral-800/60 border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500 text-white font-black text-[11px] uppercase tracking-wide">
                      <Percent className="w-3.5 h-3.5" /> Diskon Spesial 10%
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPricingOption === 'package_discount' ? 'border-orange-500 bg-orange-500 text-white' : 'border-neutral-500'
                    }`}>
                      {selectedPricingOption === 'package_discount' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white">
                    Harga per Paket (Paket Lengkap Diskon 10%)
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1">
                    Lebih hemat untuk seluruh rombongan dengan potongan harga 10% langsung dari total paket.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-700/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 block line-through font-mono">
                        Rp {calculationResult.baseSubtotal.toLocaleString('id-ID')}
                      </span>
                      <div className="text-2xl font-black text-orange-400 font-mono">
                        Rp {calculationResult.packagePriceTotalDiscounted.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-neutral-400 block">Setara per pax:</span>
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        Rp {calculationResult.packagePricePerPaxDiscounted.toLocaleString('id-ID')} / pax
                      </span>
                    </div>
                  </div>
                </div>

                {/* OPTION 2: HARGA PER PAX (STANDAR) */}
                <div 
                  onClick={() => setSelectedPricingOption('per_pax')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all relative ${
                    selectedPricingOption === 'per_pax'
                      ? 'bg-neutral-800 border-blue-500 ring-2 ring-blue-500 shadow-xl'
                      : 'bg-neutral-800/60 border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-700 text-neutral-300 font-bold text-[11px] uppercase tracking-wide">
                      Tarif Satuan Standar
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPricingOption === 'per_pax' ? 'border-blue-500 bg-blue-500 text-white' : 'border-neutral-500'
                    }`}>
                      {selectedPricingOption === 'per_pax' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white">
                    Harga per Pax (Satuan per Orang)
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Biaya dihitung tarif reguler per orang sesuai alokasi destinasi dan fasilitas yang dipilih.
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-700/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-neutral-400 block">Tarif Satuan per Orang:</span>
                      <div className="text-2xl font-black text-white font-mono">
                        Rp {calculationResult.pricePerPaxNormal.toLocaleString('id-ID')}
                        <span className="text-xs font-normal text-neutral-400"> / pax</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-neutral-400 block">Total Keseluruhan:</span>
                      <span className="text-sm font-bold font-mono text-neutral-200">
                        Rp {calculationResult.baseSubtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AGREEMENT & PROCEED TO PAYMENT BUTTON */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Dengan menekan tombol Setuju, pesanan langsung tersimpan ke Cloud Firebase & dialihkan ke halaman pembayaran.
                </span>
              </div>

              <button
                type="button"
                onClick={handleProceedAgreement}
                className="py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition-all shadow-lg flex items-center justify-center gap-2 shrink-0"
              >
                <CreditCard className="w-4 h-4" />
                <span>Setuju & Lanjut ke Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
