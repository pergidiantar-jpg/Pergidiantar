import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { EmailDispatchRecord } from '../../services/emailService';
import { googleSignIn, getAccessToken, logoutGoogle, auth } from '../../services/gmailAuth';
import { 
  Mail, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Send, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User,
  LogIn,
  LogOut,
  Info
} from 'lucide-react';

export const EmailOutboxView: React.FC = () => {
  const { emailOutbox, adminEmail } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'customer_autoreply' | 'admin_alert'>('all');
  const [selectedEmail, setSelectedEmail] = useState<EmailDispatchRecord | null>(emailOutbox[0] || null);
  const [copied, setCopied] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [connectedUserEmail, setConnectedUserEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    const currentUser = auth.currentUser;
    if (token && currentUser) {
      setIsGoogleConnected(true);
      setConnectedUserEmail(currentUser.email);
    }
  }, []);

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

  const filteredList = emailOutbox.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">
                Integrasi Email & Balasan Otomatis ({adminEmail})
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Setiap pendaftaran pelanggan & pesanan baru otomatis dibalas oleh sistem menggunakan email resmi <strong>{adminEmail}</strong>.
            </p>
          </div>

          {/* Google Workspace Sign-In Connection */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {isGoogleConnected ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 py-1.5 px-3 rounded-xl text-xs text-emerald-900 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate max-w-[180px]">Gmail Aktif ({connectedUserEmail || adminEmail})</span>
                <button
                  onClick={handleGoogleLogout}
                  className="text-neutral-400 hover:text-neutral-700 ml-1"
                  title="Putuskan Akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="py-2 px-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Hubungkan Akun Google ({adminEmail})</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-100 text-xs">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">
              1. Balasan Otomatis Pelanggan
            </span>
            <p className="text-neutral-600 mt-0.5">
              Terkirim dari <strong>{adminEmail}</strong> langsung ke email tamu yang mendaftar, berisi invoice, itinerary, dan kontak darurat.
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
      <div className="flex items-center gap-2">
        <button
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
          onClick={() => setFilterType('customer_autoreply')}
          className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
            filterType === 'customer_autoreply'
              ? 'bg-neutral-900 text-white'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          Balasan Otomatis ke Pelanggan ({emailOutbox.filter((e) => e.type === 'customer_autoreply').length})
        </button>
        <button
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
              Belum ada email yang cocok dengan filter. Silakan lakukan pemesanan atau pendaftaran baru di halaman utama.
            </div>
          ) : (
            filteredList.map((eml) => {
              const isSelected = selectedEmail?.id === eml.id;
              const isCustomerReply = eml.type === 'customer_autoreply';

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
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isCustomerReply ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isCustomerReply ? 'Balasan Otomatis Pelanggan' : 'Notif Masuk Admin'}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">{eml.timestamp.split(' ')[1] || eml.timestamp}</span>
                  </div>

                  <h3 className="font-bold text-neutral-900 line-clamp-1">
                    {eml.subject}
                  </h3>

                  <div className="text-[11px] text-neutral-500 flex items-center justify-between pt-1 border-t border-neutral-100">
                    <span className="truncate max-w-[170px]">Kepada: {eml.recipient}</span>
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Terkirim
                    </span>
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
                  <div className="flex justify-between">
                    <span>Pengirim (From): <strong>{selectedEmail.sender || adminEmail}</strong></span>
                    <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {selectedEmail.status === 'sent_via_gmail_api' ? 'Terkirim via Gmail API' : 'Terkirim via Pergidiantar Mailer'}
                    </span>
                  </div>
                  <div>
                    <span>Penerima (To): <strong>{selectedEmail.recipient}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-xs">
                <span className="text-neutral-600 font-semibold">Salinan Email Asli</span>
                <button
                  onClick={() => handleCopy(selectedEmail.body)}
                  className="py-1 px-3 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Isi Email'}</span>
                </button>
              </div>

              {/* Email Body */}
              <div className="p-6 bg-white overflow-x-auto">
                <pre className="font-mono text-xs text-neutral-800 whitespace-pre-wrap leading-relaxed">
                  {selectedEmail.body}
                </pre>
              </div>

              {/* Footer */}
              <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-500 flex items-center justify-between">
                <span>Pengirim Resmi: PT PERGI DIANTAR WISATA NUSANTARA</span>
                <a
                  href={`mailto:${selectedEmail.recipient}?subject=${encodeURIComponent(selectedEmail.subject)}&body=${encodeURIComponent(selectedEmail.body)}`}
                  className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                >
                  <span>Buka di Gmail Web</span>
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
