import { jsPDF } from 'jspdf';
import { BookingOrder } from '../types/travel';

export const generateBookingInvoicePdf = (order: BookingOrder) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);

  // 1. Top Header Banner (Brand Navy with Orange Accent)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Orange accent line below banner
  doc.setFillColor(249, 115, 22); // orange-500
  doc.rect(0, 38, pageWidth, 3, 'F');

  // Company Wordmark
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('PERGI', margin, 18);
  
  const pergiWidth = doc.getTextWidth('PERGI');
  doc.setTextColor(249, 115, 22);
  doc.text('DIANTAR', margin + pergiWidth, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Jasa Perjalanan Wisata & Transportasi Terpercaya', margin, 24);
  doc.text('Alamat: Jambon - Kota Jogjakarta  |  WA: 087716443331  |  Email: pergi.diantar@gmail.com', margin, 30);

  // Document Title & Status Pill on Right Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE RESERVASI', pageWidth - margin, 18, { align: 'right' });

  const isPaid = order.paymentStatus === 'paid' || order.paymentStatus === 'verified';
  if (isPaid) {
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.roundedRect(pageWidth - margin - 35, 24, 35, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('LUNAS / PAID', pageWidth - margin - 17.5, 28.5, { align: 'center' });
  } else {
    doc.setFillColor(245, 158, 11); // amber-500
    doc.roundedRect(pageWidth - margin - 48, 24, 48, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('MENUNGGU BAYAR', pageWidth - margin - 24, 28.5, { align: 'center' });
  }

  // 2. Order Metadata Subheader
  let currentY = 48;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('No. Invoice / Booking:', margin + 4, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(order.orderNumber, margin + 4, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Tanggal Pemesanan:', margin + 65, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(order.createdAt, margin + 65, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Metode Pembayaran:', margin + 125, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(order.paymentMethod.toUpperCase() + (order.paymentReference ? ` (${order.paymentReference})` : ''), margin + 125, currentY + 12);

  // 3. Two Columns: Customer Information & Tour Itinerary
  currentY = 72;
  const colWidth = (contentWidth - 6) / 2;

  // Box Left: Data Pemesan
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, colWidth, 54, 2, 2, 'FD');

  // Left Box Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, colWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('DATA PEMESAN & KOORDINATOR', margin + 4, currentY + 5.5);

  let leftY = currentY + 14;
  const renderRow = (label: string, val: string, xPos: number, yPos: number, maxW = colWidth - 8) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(label, xPos, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const splitVal = doc.splitTextToSize(val, maxW);
    doc.text(splitVal, xPos + 28, yPos);
    return Math.max(7, splitVal.length * 4.5);
  };

  leftY += renderRow('Nama:', order.customer.fullName, margin + 4, leftY);
  leftY += renderRow('WhatsApp:', order.customer.whatsapp, margin + 4, leftY);
  leftY += renderRow('Email:', order.customer.email, margin + 4, leftY);
  if (order.customer.companyOrFamilyName) {
    leftY += renderRow('Instansi:', order.customer.companyOrFamilyName, margin + 4, leftY);
  }
  renderRow('Penjemputan:', order.customer.pickupAddress + (order.customer.city ? `, ${order.customer.city}` : ''), margin + 4, leftY, colWidth - 32);

  // Box Right: Detail Paket & Layanan Wisata
  const rightX = margin + colWidth + 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightX, currentY, colWidth, 54, 2, 2, 'FD');

  // Right Box Header
  doc.setFillColor(241, 245, 249);
  doc.rect(rightX, currentY, colWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('DETAIL PAKET & FASILITAS TOUR', rightX + 4, currentY + 5.5);

  let rightY = currentY + 14;
  rightY += renderRow('Paket Wisata:', `${order.packageTitle} (${order.destinationLabel})`, rightX + 4, rightY);
  rightY += renderRow(
    'Tipe Penawaran:',
    order.tier === 'all_in'
      ? 'Paket All In (kendaraan, driver, bbm, parkir, tiket, hotel, makan)'
      : 'Paket Hemat (kendaraan, driver, bbm, parkir)',
    rightX + 4,
    rightY
  );
  rightY += renderRow('Jadwal Tour:', `${order.tourStartDate} s/d ${order.tourEndDate}`, rightX + 4, rightY);
  rightY += renderRow('Jumlah Peserta:', `${order.paxCount} Orang (Pax)`, rightX + 4, rightY);
  
  const vehicleText = order.selectedVehicle || order.assignedFleetName || 'Toyota Avanza (Standar)';
  renderRow('Pilihan Armada:', vehicleText, rightX + 4, rightY);

  // 4. Financial Breakdown Table
  currentY = 132;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('RINCIAN BIAYA RESERVASI (IDR)', margin, currentY);

  currentY += 4;
  // Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, currentY, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Deskripsi Fasilitas & Layanan', margin + 4, currentY + 5.5);
  doc.text('Kuantitas', margin + 105, currentY + 5.5, { align: 'center' });
  doc.text('Tarif / Pax', margin + 140, currentY + 5.5, { align: 'right' });
  doc.text('Subtotal (IDR)', pageWidth - margin - 4, currentY + 5.5, { align: 'right' });

  currentY += 8;

  // Table Row 1: Paket Wisata Dasar
  const baseRatePerPax = order.pricePerPax || Math.round(order.subtotal / (order.paxCount || 1));
  const basePackageSubtotal = baseRatePerPax * order.paxCount;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, contentWidth, 9, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Paket ${order.packageTitle} (${order.tier === 'all_in' ? 'Paket All In' : 'Paket Hemat'})`, margin + 4, currentY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${order.paxCount} Pax`, margin + 105, currentY + 5.5, { align: 'center' });
  doc.text(`Rp ${baseRatePerPax.toLocaleString('id-ID')}`, margin + 140, currentY + 5.5, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text(`Rp ${basePackageSubtotal.toLocaleString('id-ID')}`, pageWidth - margin - 4, currentY + 5.5, { align: 'right' });

  currentY += 9;

  // Table Row 2: Pilihan Armada (Avanza, Innova, Hi-Ace)
  const vehicleUpgradePerPax = order.vehicleRateAdjustment || 0;
  const vehicleUpgradeTotal = vehicleUpgradePerPax * order.paxCount;

  doc.setFillColor(248, 250, 252);
  doc.rect(margin, currentY, contentWidth, 9, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Pilihan Armada: ${order.selectedVehicle || order.assignedFleetName || 'Toyota Avanza'}`, margin + 4, currentY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${order.paxCount} Pax`, margin + 105, currentY + 5.5, { align: 'center' });
  doc.text(
    vehicleUpgradePerPax > 0 ? `+Rp ${vehicleUpgradePerPax.toLocaleString('id-ID')}` : 'Rp 0 (Standar)',
    margin + 140,
    currentY + 5.5,
    { align: 'right' }
  );
  doc.setFont('helvetica', 'bold');
  doc.text(
    vehicleUpgradeTotal > 0 ? `+Rp ${vehicleUpgradeTotal.toLocaleString('id-ID')}` : 'Rp 0',
    pageWidth - margin - 4,
    currentY + 5.5,
    { align: 'right' }
  );

  currentY += 9;

  // Table Row 3: Add-ons (jika ada)
  if (order.addOnsTotal > 0) {
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, currentY, contentWidth, 9, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const addonsLabel = order.addOnsList && order.addOnsList.length > 0 
      ? `Layanan Tambahan: ${order.addOnsList.join(', ')}`
      : 'Layanan Tambahan (Add-ons Spesial)';
    doc.text(doc.splitTextToSize(addonsLabel, 85), margin + 4, currentY + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Paket', margin + 105, currentY + 5.5, { align: 'center' });
    doc.text('-', margin + 140, currentY + 5.5, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text(`+Rp ${order.addOnsTotal.toLocaleString('id-ID')}`, pageWidth - margin - 4, currentY + 5.5, { align: 'right' });
    currentY += 9;
  }

  // Grand Total Box (Prominent Orange/Navy styling)
  doc.setFillColor(255, 247, 237); // orange-50
  doc.setDrawColor(249, 115, 22); // orange-500
  doc.rect(margin, currentY, contentWidth, 12, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(194, 65, 12); // orange-700
  doc.text('TOTAL BIAYA RESERVASI:', margin + 4, currentY + 8);
  doc.setFontSize(12);
  doc.setTextColor(234, 88, 12); // orange-600
  doc.text(`Rp ${order.grandTotal.toLocaleString('id-ID')}`, pageWidth - margin - 4, currentY + 8, { align: 'right' });

  // 5. Inclusions Notice & Hotel/Driver Assignment
  currentY += 17;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(
    order.tier === 'all_in' ? 'FASILITAS PAKET ALL IN TERMASUK:' : 'FASILITAS PAKET HEMAT TERMASUK:',
    margin + 4,
    currentY + 6
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  if (order.tier === 'all_in') {
    doc.text('• Fasilitas Lengkap: Kendaraan, driver, bbm, parkir, tiket wisata, hotel, makan 1x di hotel dan 2x/ hari di luar hotel.', margin + 4, currentY + 11);
    doc.text('• Akomodasi: Hotel mitra bintang terverifikasi, kamar bersih, shower hangat & WiFi lancar.', margin + 4, currentY + 15.5);
    doc.text('• Konsumsi & Wisata: Makan higienis terjadwal, air mineral harian & seluruh tiket masuk objek wisata.', margin + 4, currentY + 20);
  } else {
    doc.text('• Transportasi: Kendaraan, driver, bbm, parkir tercover penuh untuk seluruh rute perjalanan.', margin + 4, currentY + 11);
    doc.text('• Fleksibilitas Budget: Hotel, makan, dan tiket masuk wisata dikelola mandiri sesuai kebutuhan tamu.', margin + 4, currentY + 15.5);
    doc.text('• Supir Profesional: Pengemudi ramah dan paham rute wisata terbaik siap mendampingi Anda.', margin + 4, currentY + 20);
  }

  // 6. Signatures and Official Company Seal
  currentY += 28;
  const sealWidth = contentWidth / 2;

  // Left side: Security & Terms
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('KETENTUAN & VERIFIKASI RESMI:', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('1. Invoice ini merupakan bukti pemesanan sah dari PT PERGI DIANTAR WISATA.', margin, currentY + 5);
  doc.text('2. Tunjukkan invoice digital atau cetak saat penjemputan awal di bandara / stasiun / hotel.', margin, currentY + 9);
  doc.text('3. Bantuan darurat & konfirmasi penugasan driver: WA 087716443331.', margin, currentY + 13);

  // Official Seal Badge
  doc.setDrawColor(37, 99, 235); // blue-600
  doc.setFillColor(239, 246, 255); // blue-50
  doc.roundedRect(margin, currentY + 18, 55, 16, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 64, 175);
  doc.text('TERVERIFIKASI OTOMATIS', margin + 4, currentY + 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(59, 130, 246);
  doc.text('Sistem ERP PERGIDIANTAR', margin + 4, currentY + 29);

  // Right side: Director Signature Block
  const sigX = pageWidth - margin - 65;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Yogyakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, sigX, currentY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('PT PERGI DIANTAR WISATA', sigX, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text('Direktur Operasional & Keuangan', sigX, currentY + 9);

  // Signature line
  const signY = currentY + 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Benisius Rahmat Basuki', sigX, signY);
  doc.line(sigX, signY + 1, sigX + 55, signY + 1);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('NIP. 19880219 201104 1 002', sigX, signY + 5);

  // 7. Bottom Page Footer
  doc.setFillColor(15, 23, 42);
  doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    'PERGIDIANTAR · Solusi Terpercaya Perjalanan Wisata Nusantara · www.pergidiantar.com',
    pageWidth / 2,
    pageHeight - 4,
    { align: 'center' }
  );

  // Trigger download with sanitized filename
  const cleanOrderNum = order.orderNumber.replace(/[^a-zA-Z0-9-_]/g, '_');
  doc.save(`Invoice_PERGIDIANTAR_${cleanOrderNum}.pdf`);
};
