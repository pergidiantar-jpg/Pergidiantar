import { BookingOrder } from '../types/travel';
import { sendActualGmail } from './gmailAuth';
import { summarizeItineraryMetrics } from '../utils/itineraryGenerator';

export const ADMIN_PRIMARY_EMAIL = 'pergi.diantar@gmail.com';

export interface EmailDispatchRecord {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  orderNumber?: string;
  type:
    | 'customer_autoreply'
    | 'admin_alert'
    | 'payment_verified'
    | 'status_update'
    | 'customer_registration';
  status: 'sent_via_gmail_api' | 'sent_via_smtp' | 'delivered' | 'queued';
  timestamp: string;
  errorMessage?: string;
}

export interface EmailBackendStatus {
  smtpConfigured: boolean;
  sender: string;
  provider: string;
}

const LOCAL_STORAGE_KEY_EMAILS = 'pergidiantar_email_outbox_v2';

function formatNowWib(): string {
  const now = new Date();
  return `${now.toLocaleDateString('id-ID')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
}

function formatItineraryDigest(order: BookingOrder): string {
  const days = order.itineraryTimeline || [];
  if (days.length === 0) {
    return 'Susunan jadwal & rute lengkap tersedia di menu Lacak Pesanan portal PERGIDIANTAR.';
  }

  const metrics = summarizeItineraryMetrics(days);
  const lines: string[] = [];
  if (metrics.totalDistanceKm > 0) {
    lines.push(
      `Estimasi Total Jarak Rute: ±${metrics.totalDistanceKm} km (±${metrics.totalTransitMinutes} menit transit antar destinasi)`
    );
  }
  if (metrics.hasDay2Outbound) {
    lines.push('Highlight Khusus: Sesi Outbound & Team Building + Fasilitator terjadwal di Hari Ke-2');
  }
  lines.push('');

  days.forEach((d) => {
    lines.push(`Hari ${d.day} - ${d.title}`);
    const items = d.timeline || [];
    items.forEach((item) => {
      const distLabel =
        typeof item.distanceKm === 'number' && item.distanceKm > 0
          ? ` [±${item.distanceKm} km / ${item.travelMinutes || 15} mnt]`
          : '';
      lines.push(`  • ${item.time} — ${item.title}${distLabel}`);
    });
  });

  return lines.join('\n');
}

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

export const updateStoredEmailRecord = (updatedRecord: EmailDispatchRecord) => {
  try {
    const list = getStoredEmails();
    const updated = list.map((item) => (item.id === updatedRecord.id ? updatedRecord : item));
    localStorage.setItem(LOCAL_STORAGE_KEY_EMAILS, JSON.stringify(updated));
  } catch (err) {
    console.error('Error updating email record:', err);
  }
};

export const getEmailBackendStatus = async (): Promise<EmailBackendStatus> => {
  try {
    const res = await fetch('/api/email-status');
    if (res.ok) {
      return (await res.json()) as EmailBackendStatus;
    }
  } catch {
    // Backend might be restarting or offline
  }
  return {
    smtpConfigured: false,
    sender: ADMIN_PRIMARY_EMAIL,
    provider: 'gmail_smtp'
  };
};

/**
 * Attempts real dispatch via:
 * 1) Active Google Workspace OAuth Gmail API session (if admin logged in with Google)
 * 2) Backend Nodemailer SMTP mailer (/api/send-email) configured as pergi.diantar@gmail.com
 * Falls back honestly to 'queued' with reason if neither transport is active.
 */
async function sendEmailHybrid(
  to: string,
  subject: string,
  body: string
): Promise<{
  status: 'sent_via_gmail_api' | 'sent_via_smtp' | 'queued';
  errorMessage?: string;
}> {
  if (!to || !to.includes('@')) {
    return {
      status: 'queued',
      errorMessage: 'Alamat email penerima tidak valid.'
    };
  }

  // 1. Try client Gmail API if OAuth token is connected
  try {
    const gmailResult = await sendActualGmail(to, subject, body, ADMIN_PRIMARY_EMAIL);
    if (gmailResult.success) {
      return { status: 'sent_via_gmail_api' };
    }
  } catch {
    // Proceed to server SMTP fallback
  }

  // 2. Try backend Express SMTP endpoint (/api/send-email)
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject,
        body,
        replyTo: ADMIN_PRIMARY_EMAIL
      })
    });

    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      code?: string;
    };

    if (response.ok && data.ok) {
      return { status: 'sent_via_smtp' };
    }

    return {
      status: 'queued',
      errorMessage:
        data.error ||
        'Server SMTP belum dikonfigurasi (tambahkan GMAIL_APP_PASSWORD pada Secrets atau hubungkan Google Workspace).'
    };
  } catch {
    return {
      status: 'queued',
      errorMessage:
        'Tidak dapat terhubung ke endpoint pengiriman email (/api/send-email).'
    };
  }
}

/**
 * 0. Sends registration welcome confirmation from pergi.diantar@gmail.com to new customer
 */
export const dispatchCustomerRegistrationEmail = async (customer: {
  displayName: string;
  email: string;
  phoneNumber?: string;
}): Promise<EmailDispatchRecord> => {
  const recipient = (customer.email || '').trim();
  const timeStr = formatNowWib();
  const subject = `[PERGIDIANTAR] Konfirmasi Pendaftaran Akun Wisatawan — Selamat Datang ${customer.displayName}`;

  const body = `
Halo ${customer.displayName},

Selamat bergabung bersama PERGIDIANTAR Biro Perjalanan Wisata Nusantara!
Pendaftaran akun pelanggan Anda telah berhasil diverifikasi dan aktif di portal kami.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETAIL AKUN TERDAFTAR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nama Lengkap: ${customer.displayName}
• Email Resmi Terdaftar: ${recipient}
• Nomor WhatsApp: ${customer.phoneNumber || '-'}
• Waktu Pendaftaran: ${timeStr}

Kini Anda dapat memesan paket tour Yogyakarta, Malang & Bromo, maupun Bali serta menyusun rute mandiri melalui Kalkulator Trip Otomatis.

Jika membutuhkan bantuan konsultasi perjalanan atau penawaran rombongan, balas email ini ke ${ADMIN_PRIMARY_EMAIL} atau hubungi WhatsApp 087716443331.

Salam Hangat,
Tim PERGIDIANTAR
PT Pergi Diantar Wisata Nusantara
Email Resmi: ${ADMIN_PRIMARY_EMAIL}
Alamat: Jambon - Kota Jogjakarta
`.trim();

  const dispatchResult = await sendEmailHybrid(recipient, subject, body);

  const record: EmailDispatchRecord = {
    id: `eml-reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sender: ADMIN_PRIMARY_EMAIL,
    recipient,
    subject,
    body,
    type: 'customer_registration',
    status: dispatchResult.status,
    errorMessage: dispatchResult.errorMessage,
    timestamp: timeStr
  };

  saveEmailRecord(record);
  return record;
};

/**
 * 1. Sends automated reservation confirmation from pergi.diantar@gmail.com to customer
 */
export const dispatchCustomerAutoReplyEmail = async (
  order: BookingOrder
): Promise<EmailDispatchRecord> => {
  const customerEmail = (order.customer.email || '').trim();
  const timeStr = formatNowWib();

  const subject = `[PERGIDIANTAR] Konfirmasi Pendaftaran & Reservasi Tour #${order.orderNumber} - ${order.packageTitle}`;
  const itineraryDigest = formatItineraryDigest(order);

  const body = `
Halo ${order.customer.fullName},

Terima kasih telah melakukan pendaftaran dan pemesanan paket wisata bersama PERGIDIANTAR Biro Perjalanan Wisata Nusantara!
Email ini adalah konfirmasi otomatis resmi dari sistem kami (${ADMIN_PRIMARY_EMAIL}).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETAIL RESERVASI WISATA ANDA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nomor Booking: ${order.orderNumber}
• Paket Wisata: ${order.packageTitle}
• Kategori: ${order.categoryLabel} (${order.tier === 'all_in' ? 'All In VIP' : 'Paket Hemat'})
• Destinasi Tujuan: ${order.destinationLabel}
• Jadwal Perjalanan: ${order.tourStartDate} s/d ${order.tourEndDate}
• Jumlah Rombongan: ${order.paxCount} Orang (Pax)
• Armada Pilihan: ${order.selectedVehicle || 'Sesuai kuota rombongan'}
• Add-On Tambahan: ${order.addOnsList && order.addOnsList.length > 0 ? order.addOnsList.join(', ') : 'Tidak ada'}
• Total Biaya: Rp ${order.grandTotal.toLocaleString('id-ID')}
• Status Pembayaran: ${order.paymentStatus === 'paid' || order.paymentStatus === 'verified' ? 'LUNAS (VERIFIED)' : 'MENUNGGU PEMBAYARAN'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUSUNAN JADWAL & RUTE PERJALANAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${itineraryDigest}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TITIK PENJEMPUTAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Alamat: ${order.customer.pickupAddress} (${order.customer.city})
Catatan Khusus: ${order.customer.specialRequests || 'Tidak ada'}

Tim operasional PERGIDIANTAR akan menghubungi WhatsApp Anda (${order.customer.whatsapp}) H-2 sebelum keberangkatan untuk koordinasi nama armada dan nomor kontak driver bertugas.

Jika ada pertanyaan, silakan balas email ini ke ${ADMIN_PRIMARY_EMAIL} atau melalui WhatsApp Customer Care 087716443331.

Salam Hangat,
Customer Care PERGIDIANTAR
PT Pergi Diantar Wisata Nusantara
Alamat: Jambon - Kota Jogjakarta
Email: ${ADMIN_PRIMARY_EMAIL}
`.trim();

  const dispatchResult = await sendEmailHybrid(customerEmail, subject, body);

  const record: EmailDispatchRecord = {
    id: `eml-cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sender: ADMIN_PRIMARY_EMAIL,
    recipient: customerEmail,
    subject,
    body,
    orderNumber: order.orderNumber,
    type: 'customer_autoreply',
    status: dispatchResult.status,
    errorMessage: dispatchResult.errorMessage,
    timestamp: timeStr
  };

  saveEmailRecord(record);
  return record;
};

/**
 * 1b. Sends official payment receipt & confirmed itinerary from pergi.diantar@gmail.com to customer
 */
export const dispatchCustomerPaymentReceiptEmail = async (
  order: BookingOrder
): Promise<EmailDispatchRecord> => {
  const customerEmail = (order.customer.email || '').trim();
  const timeStr = formatNowWib();
  const subject = `[PERGIDIANTAR] Bukti Pembayaran Lunas & E-Tiket Tour #${order.orderNumber}`;
  const itineraryDigest = formatItineraryDigest(order);

  const body = `
Halo ${order.customer.fullName},

Pembayaran Anda untuk pemesanan wisata PERGIDIANTAR telah berhasil dikonfirmasi LUNAS!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUKTI PEMBAYARAN RESMI:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nomor Order: ${order.orderNumber}
• Referensi Pembayaran: ${order.paymentReference || 'Terverifikasi Sistem'}
• Tanggal Lunas: ${order.paidAt || timeStr}
• Paket Wisata: ${order.packageTitle} (${order.destinationLabel})
• Jadwal Tour: ${order.tourStartDate} s/d ${order.tourEndDate} (${order.paxCount} Pax)
• Total Dibayarkan: Rp ${order.grandTotal.toLocaleString('id-ID')}
• Status: LUNAS / TERVERIFIKASI

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JADWAL & ITINERARY TERKONFIRMASI:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${itineraryDigest}

Simpan email ini sebagai E-Tiket resmi keberangkatan Anda. Anda juga dapat memantau perkembangan armada, kontak driver, dan detail itinerary melalui menu Lacak Pesanan di portal PERGIDIANTAR.

Salam Hangat,
Finance & Customer Care PERGIDIANTAR
PT Pergi Diantar Wisata Nusantara
Email Resmi: ${ADMIN_PRIMARY_EMAIL}
WhatsApp: 087716443331
`.trim();

  const dispatchResult = await sendEmailHybrid(customerEmail, subject, body);

  const record: EmailDispatchRecord = {
    id: `eml-pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sender: ADMIN_PRIMARY_EMAIL,
    recipient: customerEmail,
    subject,
    body,
    orderNumber: order.orderNumber,
    type: 'payment_verified',
    status: dispatchResult.status,
    errorMessage: dispatchResult.errorMessage,
    timestamp: timeStr
  };

  saveEmailRecord(record);
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

  const timeStr = formatNowWib();

  const body = `
Kepada Tim Manajemen & Operasional PERGIDIANTAR,

Pemberitahuan otomatis sistem: ${
    event === 'payment_verified'
      ? 'Pembayaran pelanggan telah terverifikasi LUNAS.'
      : 'Pesanan wisata baru telah masuk ke sistem.'
  }

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
`.trim();

  const dispatchResult = await sendEmailHybrid(ADMIN_PRIMARY_EMAIL, subject, body);

  const record: EmailDispatchRecord = {
    id: `eml-adm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sender: ADMIN_PRIMARY_EMAIL,
    recipient: ADMIN_PRIMARY_EMAIL,
    subject,
    body,
    orderNumber: order.orderNumber,
    type: 'admin_alert',
    status: dispatchResult.status,
    errorMessage: dispatchResult.errorMessage,
    timestamp: timeStr
  };

  saveEmailRecord(record);
  return record;
};

/**
 * Re-attempts sending a queued email record
 */
export const retryEmailDispatch = async (
  record: EmailDispatchRecord
): Promise<EmailDispatchRecord> => {
  const result = await sendEmailHybrid(record.recipient, record.subject, record.body);
  const updated: EmailDispatchRecord = {
    ...record,
    status: result.status,
    errorMessage: result.errorMessage,
    timestamp: formatNowWib()
  };
  updateStoredEmailRecord(updated);
  return updated;
};
