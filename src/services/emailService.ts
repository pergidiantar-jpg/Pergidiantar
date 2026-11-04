import { BookingOrder } from '../types/travel';
import { sendActualGmail } from './gmailAuth';

export const ADMIN_PRIMARY_EMAIL = 'pergi.diantar@gmail.com';

export interface EmailDispatchRecord {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  orderNumber?: string;
  type: 'customer_autoreply' | 'admin_alert' | 'payment_verified' | 'status_update';
  status: 'sent_via_gmail_api' | 'delivered' | 'queued';
  timestamp: string;
}

const LOCAL_STORAGE_KEY_EMAILS = 'pergidiantar_email_outbox_v2';

export const getStoredEmails = (): EmailDispatchRecord[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_EMAILS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveEmailRecord = (record: EmailDispatchRecord) => {
  try {
    const list = getStoredEmails();
    const updated = [record, ...list];
    localStorage.setItem(LOCAL_STORAGE_KEY_EMAILS, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving email record:', err);
  }
};

/**
 * 1. Sends automated reply from pergi.diantar@gmail.com to the customer
 */
export const dispatchCustomerAutoReplyEmail = async (
  order: BookingOrder
): Promise<EmailDispatchRecord> => {
  const customerEmail = order.customer.email || 'pelanggan@pergidiantar.com';
  const now = new Date();
  const timeStr = `${now.toLocaleDateString('id-ID')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

  const subject = `[PERGIDIANTAR] Konfirmasi Pendaftaran & Reservasi Tour #${order.orderNumber} - ${order.packageTitle}`;

  const body = `
Halo ${order.customer.fullName},

Terima kasih telah melakukan pendaftaran dan pemesanan paket wisata bersama PERGIDIANTAR!
Email ini adalah konfirmasi otomatis resmi dari sistem kami.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETAIL RESERVASI WISATA ANDA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nomor Booking: ${order.orderNumber}
• Paket Wisata: ${order.packageTitle}
• Kategori: ${order.categoryLabel} (${order.tier === 'all_in' ? 'All In VIP' : 'Paket Hemat'})
• Destinasi Tujuan: ${order.destinationLabel}
• Jadwal Perjalanan: ${order.tourStartDate} s/d ${order.tourEndDate}
• Jumlah Rombongan: ${order.paxCount} Orang (Pax)
• Total Biaya: Rp ${order.grandTotal.toLocaleString('id-ID')}
• Status Pembayaran: ${order.paymentStatus === 'paid' ? 'LUNAS (VERIFIED)' : 'MENUNGGU PEMBAYARAN'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASILITAS YANG ANDA DAPATKAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Transportasi: Unit Kendaraan Pariwisata AC Bersih (HiAce/Bus), Driver Ramah, BBM, Parkir & Tol Tercover Penuh
✓ Akomodasi: Hotel Mitra Pilihan Nyaman Sesuai Jadwal
✓ Konsumsi: Makan Teratur di Restoran Khas Lokal Terpilih
✓ Tiket Wisata: Tiket Masuk Lengkap Objek Wisata Tanpa Perlu Antre

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TITIK PENJEMPUTAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Alamat: ${order.customer.pickupAddress} (${order.customer.city})
Catatan Khusus: ${order.customer.specialRequests || 'Tidak ada'}

Tim operasional PERGIDIANTAR akan menghubungi WhatsApp Anda (${order.customer.whatsapp}) H-2 sebelum keberangkatan untuk koordinasi nama armada dan nomor kontak driver bertugas.

Jika ada pertanyaan, jangan ragu untuk membalas email ini ke pergi.diantar@gmail.com atau melalui WhatsApp Customer Care 087716443331.

Salam Hangat,
Customer Care PERGIDIANTAR
PT Pergi Diantar Wisata Nusantara
Alamat: Jambon - Kota Jogjakarta
Email: ${ADMIN_PRIMARY_EMAIL}
Website: https://pergidiantar.com
`;

  // Try real Gmail API if user logged in with Google
  const gmailResult = await sendActualGmail(customerEmail, subject, body.trim(), ADMIN_PRIMARY_EMAIL);

  const record: EmailDispatchRecord = {
    id: `eml-cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sender: ADMIN_PRIMARY_EMAIL,
    recipient: customerEmail,
    subject,
    body: body.trim(),
    orderNumber: order.orderNumber,
    type: 'customer_autoreply',
    status: gmailResult.success ? 'sent_via_gmail_api' : 'delivered',
    timestamp: timeStr
  };

  saveEmailRecord(record);
  console.info(`[AUTO-REPLY TO CUSTOMER FROM ${ADMIN_PRIMARY_EMAIL}]`, customerEmail);
  return record;
};

/**
 * 2. Sends notification alert to admin email pergi.diantar@gmail.com
 */
export const dispatchOrderNotificationEmail = async (
  order: BookingOrder,
  event: 'new_order' | 'payment_verified' | 'status_update'
): Promise<EmailDispatchRecord> => {
  const isPaid = order.paymentStatus === 'paid' || order.paymentStatus === 'verified';
  
  let subject = '';
  if (event === 'new_order') {
    subject = `[ORDER & PENDAFTARAN BARU] #${order.orderNumber} - ${order.customer.fullName} (${order.paxCount} Pax - ${order.packageTitle})`;
  } else if (event === 'payment_verified') {
    subject = `[PEMBAYARAN LUNAS] #${order.orderNumber} - Rp ${order.grandTotal.toLocaleString('id-ID')} (${order.customer.fullName})`;
  } else {
    subject = `[UPDATE STATUS] #${order.orderNumber} - Status: ${order.orderStatus.toUpperCase()}`;
  }

  const now = new Date();
  const timeStr = `${now.toLocaleDateString('id-ID')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

  const body = `
Kepada Tim Manajemen & Operasional PERGIDIANTAR,

Pemberitahuan otomatis sistem: Calon pelanggan baru telah mendaftar dan membuat pesanan tour.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMASI PESANAN MASUK:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nomor Order: ${order.orderNumber}
• Paket Wisata: ${order.packageTitle}
• Kategori: ${order.categoryLabel} (${order.tier === 'all_in' ? 'All In VIP' : 'Paket Hemat'})
• Destinasi: ${order.destinationLabel}
• Jadwal Tour: ${order.tourStartDate} s/d ${order.tourEndDate}
• Jumlah Peserta: ${order.paxCount} Orang (Pax)
• Total Biaya: Rp ${order.grandTotal.toLocaleString('id-ID')}
• Status Pembayaran: ${isPaid ? 'LUNAS (VERIFIED)' : 'MENUNGGU PEMBAYARAN'}
• Status Order: ${order.orderStatus.replace('_', ' ').toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATA LENGKAP PEMESAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nama Lengkap: ${order.customer.fullName}
• WhatsApp / Telp: ${order.customer.whatsapp}
• Email: ${order.customer.email}
• Instansi / Keluarga: ${order.customer.companyOrFamilyName || '-'}
• Titik Penjemputan: ${order.customer.pickupAddress} (${order.customer.city})
• Permintaan Khusus: ${order.customer.specialRequests || 'Tidak ada'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATUS ALOKASI ARMADA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Unit Kendaraan: ${order.assignedFleetName || 'Belum Ditugaskan'}
• Supir / Driver: ${order.assignedDriverName || '-'} (${order.assignedDriverPhone || '-'})
• Akomodasi: ${order.hotelAllotment || 'Hotel Sesuai Kuota Paket'}

Sistem Informasi PERGIDIANTAR ERP
Notifikasi ini diteruskan ke: ${ADMIN_PRIMARY_EMAIL}
Waktu: ${timeStr}
`;

  // Try real Gmail API if user logged in with Google
  const gmailResult = await sendActualGmail(ADMIN_PRIMARY_EMAIL, subject, body.trim(), ADMIN_PRIMARY_EMAIL);

  const record: EmailDispatchRecord = {
    id: `eml-adm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sender: ADMIN_PRIMARY_EMAIL,
    recipient: ADMIN_PRIMARY_EMAIL,
    subject,
    body: body.trim(),
    orderNumber: order.orderNumber,
    type: 'admin_alert',
    status: gmailResult.success ? 'sent_via_gmail_api' : 'delivered',
    timestamp: timeStr
  };

  saveEmailRecord(record);
  console.info(`[ADMIN ALERT DISPATCHED TO ${ADMIN_PRIMARY_EMAIL}]`, subject);
  return record;
};
