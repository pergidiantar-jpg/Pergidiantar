import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  EmailDispatchRecord,
  EmailBackendStatus,
  getEmailBackendStatus
} from '../../services/emailService';
import { googleSignIn, getAccessToken, logoutGoogle, auth } from '../../services/gmailAuth';
import {
  Mail,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  LogIn,
  LogOut,
  AlertTriangle,
  RefreshCw,
  Server
} from 'lucide-react';

export const EmailOutboxView: React.FC = () => {
  const { emailOutbox, retryEmail, adminEmail } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'admin_alert'>('all');
  const [selectedEmail, setSelectedEmail] = useState<EmailDispatchRecord | null>(emailOutbox[0] || null);
  const [copied, setCopied] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [connectedUserEmail, setConnectedUserEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<EmailBackendStatus | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    const currentUser = auth.currentUser;
    if (token && currentUser) {
      setIsGoogleConnected(true);
      setConnectedUserEmail(currentUser.email);
    }
    getEmailBackendStatus().then(setBackendStatus).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedEmail) {
      const refreshed = emailOutbox.find((e) => e.id === selectedEmail.id);
      if (refreshed && refreshed !== selectedEmail) {
        setSelectedEmail(refreshed);
      }
    } else if (emailOutbox.length > 0) {
      setSelectedEmail(emailOutbox[0]);
    }
  }, [emailOutbox, selectedEmail]);

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setIsGoogleConnected(true);
        setConnectedUserEmail(res.user.email);
      }
    } catch (err) {
      console.warn('Login status:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logoutGoogle();
    setIsGoogleConnected(false);
    setConnectedUserEmail(null);
  };

  const handleRetrySend = async (id: string) => {
    setRetryingId(id);
    try {
      const updated = await retryEmail(id);
      if (updated) {
        setSelectedEmail(updated);
      }
    } finally {
      setRetryingId(null);
    }
  };

  const filteredList = emailOutbox.filter((e) => {
    if (filterType === 'all') return true;
    if (filterType === 'customer') {
      return (
        e.type === 'customer_autoreply' ||
        e.type === 'customer_registration' ||
        e.type === 'payment_verified'
      );
    }
    return e.type === 'admin_alert';
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAnyMailerActive = Boolean(backendStatus?.smtpConfigured || isGoogleConnected);

  const getStatusLabel = (status: EmailDispatchRecord['status']) => {
    switch (status) {
      case 'sent_via_gmail_api':
        return 'Terkirim via Gmail API';
      case 'sent_via_smtp':
        return `Terkirim via SMTP (${adminEmail})`;
      case 'delivered':
        return 'Terkirim';
      case 'queued':
      default:
        return 'Antrean (Perlu Aktivasi SMTP / Gmail)';
    }
  };

  const getTypeBadge = (type: EmailDispatchRecord['type']) => {
    switch (type) {
      case 'customer_registration':
        return { label: 'Konfirmasi Daftar Akun', cls: 'bg-blue-100 text-blue-800' };
      case 'payment_verified':
        return { label: 'E-Tiket & Lunas Pelanggan', cls: 'bg-emerald-100 text-emerald-800' };
      case 'customer_autoreply':
        return { label: 'Konfirmasi Order Pelanggan', cls: 'bg-purple-100 text-purple-800' };
      default:
        return { label: 'Notif Masuk Admin', cls: 'bg-amber-100 text-amber-800' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">
                Integrasi Email Resmi ({adminEmail})
              </h2>
              {backendStatus?.smtpConfigured && (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Server className="w-3 h-3" /> SMTP Server Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Setiap pendaftaran akun baru, konfirmasi pemesanan tour, dan verifikasi pembayaran lunas dikirim menggunakan pengirim resmi <strong>{adminEmail}</strong> langsung ke email pelanggan.
            </p>
          </div>

          {/* Google Workspace Sign-In Connection */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {isGoogleConnected ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 py-1.5 px-3 rounded-xl text-xs text-emerald-900 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate max-w-[180px]">Gmail API Aktif ({connectedUserEmail || adminEmail})</span>
                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  className="text-neutral-400 hover:text-neutral-700 ml-1"
                  title="Putuskan Akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="py-2 px-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Hubungkan Gmail API ({adminEmail})</span>
              </button>
            )}
          </div>
        </div>

        {/* SMTP Configuration Notice when neither Gmail OAuth nor SMTP Password is configured */}
        {!isAnyMailerActive && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-extrabold block">
                Menunggu Kredensial Pengiriman Email Nyata ({adminEmail})
              </span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Agar email otomatis terkirim langsung ke inbox pelanggan di seluruh perangkat (tanpa popup Google setiap order), tambahkan secret{' '}
                <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded font-bold">GMAIL_APP_PASSWORD</code> (App Password 16 digit dari akun Google{' '}
                <strong>{adminEmail}</strong>) dan{' '}
                <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded font-bold">GMAIL_USER={adminEmail}</code> pada panel Secrets/Environment Server, atau hubungkan akun Google melalui tombol di kanan atas.
              </p>
            </div>
          </div>
        )}

        {/* Feature highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100 text-xs">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">
              1. Konfirmasi Daftar, Booking & E-Tiket Pelanggan
            </span>
            <p className="text-neutral-600 mt-0.5">
              Terkirim dari <strong>{adminEmail}</strong> langsung ke email pelanggan saat daftar akun, membuat order, dan pelunasan terverifikasi.
            </p>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <span className="text-[10px] uppercase font-bold text-blue-700 block">
              2. Notifikasi Order Masuk Admin
            </span>
            <p className="text-neutral-600 mt-0.5">
              Terkirim langsung ke inbox <strong>{adminEmail}</strong> agar tim operasional segera mengunci armada & driver.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
            filterType === 'all'
              ? 'bg-neutral-900 text-white'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          Semua Pengiriman ({emailOutbox.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterType('customer')}
          className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
            filterType === 'customer'
              ? 'bg-neutral-900 text-white'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          Email ke Pelanggan (
          {
            emailOutbox.filter(
              (e) =>
                e.type === 'customer_autoreply' ||
                e.type === 'customer_registration' ||
                e.type === 'payment_verified'
            ).length
          }
          )
        </button>
        <button
          type="button"
          onClick={() => setFilterType('admin_alert')}
          className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
            filterType === 'admin_alert'
              ? 'bg-neutral-900 text-white'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          Alert Masuk ke Admin ({emailOutbox.filter((e) => e.type === 'admin_alert').length})
        </button>
      </div>

      {/* Two column view: Outbox List & Email Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Outbox Log */}
        <div className="lg:col-span-1 space-y-2 max-h-[620px] overflow-y-auto">
          {filteredList.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-neutral-200 text-center text-xs text-neutral-400">
              Belum ada email yang cocok dengan filter. Silakan lakukan pendaftaran akun atau pemesanan baru di portal utama.
            </div>
          ) : (
            filteredList.map((eml) => {
              const isSelected = selectedEmail?.id === eml.id;
              const badge = getTypeBadge(eml.type);
              const isQueued = eml.status === 'queued';

              return (
                <div
                  key={eml.id}
                  onClick={() => setSelectedEmail(eml)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-2xs'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.cls}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">{eml.timestamp.split(' ')[1] || eml.timestamp}</span>
                  </div>

                  <h3 className="font-bold text-neutral-900 line-clamp-1">
                    {eml.subject}
                  </h3>

                  <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1 border-t border-neutral-100">
                    <span className="truncate max-w-[160px]">Kepada: {eml.recipient}</span>
                    {isQueued ? (
                      <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Antrean
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Terkirim
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Full Email Content Inspector */}
        <div className="lg:col-span-2">
          {selectedEmail ? (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden flex flex-col">
              {/* Email Header */}
              <div className="p-5 bg-neutral-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-mono text-[10px] text-emerald-400">ID: {selectedEmail.id}</span>
                  <span className="text-[11px]">{selectedEmail.timestamp}</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {selectedEmail.subject}
                </h3>
                <div className="text-xs text-neutral-300 pt-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span>Pengirim (From): <strong>{selectedEmail.sender || adminEmail}</strong></span>
                    <span
                      className={`font-bold text-[11px] flex items-center gap-1 ${
                        selectedEmail.status === 'queued' ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {selectedEmail.status === 'queued' ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      {getStatusLabel(selectedEmail.status)}
                    </span>
                  </div>
                  <div>
                    <span>Penerima (To): <strong>{selectedEmail.recipient}</strong></span>
                  </div>
                </div>
              </div>

              {selectedEmail.status === 'queued' && selectedEmail.errorMessage && (
                <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-800 flex items-center justify-between gap-2">
                  <span>{selectedEmail.errorMessage}</span>
                  <button
                    type="button"
                    disabled={retryingId === selectedEmail.id}
                    onClick={() => handleRetrySend(selectedEmail.id)}
                    className="py-1 px-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${retryingId === selectedEmail.id ? 'animate-spin' : ''}`} />
                    <span>{retryingId === selectedEmail.id ? 'Mengirim...' : 'Kirim Ulang'}</span>
                  </button>
                </div>
              )}

              {/* Action bar */}
              <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-xs">
                <span className="text-neutral-600 font-semibold">Salinan Email Resmi</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={retryingId === selectedEmail.id}
                    onClick={() => handleRetrySend(selectedEmail.id)}
                    className="py-1 px-3 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${retryingId === selectedEmail.id ? 'animate-spin' : ''}`} />
                    <span>Kirim Ulang</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedEmail.body)}
                    className="py-1 px-3 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Isi Email'}</span>
                  </button>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-6 bg-white overflow-x-auto">
                <pre className="font-mono text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed">
                  {selectedEmail.body}
                </pre>
              </div>

              {/* Footer */}
              <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-500 flex items-center justify-between">
                <span>Pengirim Resmi: {adminEmail} (PT Pergi Diantar Wisata Nusantara)</span>
                <a
                  href={`mailto:${selectedEmail.recipient}?subject=${encodeURIComponent(selectedEmail.subject)}&body=${encodeURIComponent(selectedEmail.body)}`}
                  className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                >
                  <span>Buka di Email Client</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-400 text-xs">
              Pilih salah satu pesan email dari daftar di sebelah kiri untuk melihat rincian pengiriman.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
