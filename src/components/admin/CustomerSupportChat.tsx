import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  User, 
  Sparkles, 
  Clock, 
  CheckCheck,
  Zap,
  Phone
} from 'lucide-react';

export const CustomerSupportChat: React.FC = () => {
  const { chats, sendChatMessage, currentUser } = useApp();
  const [replyText, setReplyText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sendChatMessage(replyText, 'cs_admin');
    setReplyText('');
  };

  const cannedTemplates = [
    {
      title: 'Template Family Gathering',
      text: 'Halo Bapak/Ibu! Untuk tour Jogja/Malang/Bali, Paket All In kami mencakup: kendaraan, driver, bbm, parkir, tiket wisata, hotel, makan 1x di hotel dan 2x/ hari di luar hotel. Tersedia pula Paket Hemat (kendaraan, driver, bbm, parkir). Boleh kami tahu tanggal rencana dan perkiraan jumlah anggota rombongan?'
    },
    {
      title: 'Template Alokasi Bus & HiAce',
      text: 'Untuk rombongan di bawah 14 orang kami sediakan Toyota HiAce Premio Luxury (sangat nyaman untuk keluarga/lansia). Untuk rombongan 20-33 orang menggunakan Medium Bus Jetbus 5, dan rombongan 35-50 orang kami siapkan Big Bus SHD dengan fasilitas toilet & audio karaoke.'
    },
    {
      title: 'Template Rute Custom & Diskon',
      text: 'Tentu bisa sekali di-custom rutenya sesuai kebutuhan acara! Tim operasional kami dapat menyesuaikan jadwal kunjungan, titik penjemputan, maupun pilihan restoran lokal khas favorit Anda.'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden flex flex-col h-[650px]">
      {/* Header */}
      <div className="p-4 bg-neutral-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Konsol Dukungan Pelanggan & Live Chat Masuk
            </h2>
            <span className="text-[11px] text-emerald-400 font-medium">
              CS Bertugas: {currentUser.name} ({currentUser.roleLabel})
            </span>
          </div>
        </div>
        <span className="text-xs text-neutral-400 font-mono">
          {chats.length} Pesan Tersimpan
        </span>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left Side: Canned Quick Templates */}
        <div className="w-full md:w-80 border-r border-neutral-200 p-4 bg-neutral-50/70 overflow-y-auto space-y-3 shrink-0">
          <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Balasan Cepat (Template CS)
          </span>
          <p className="text-[11px] text-neutral-500 leading-snug">
            Klik template untuk langsung memasukkan jawaban standar resmi ke input teks balasan.
          </p>

          <div className="space-y-2 pt-1">
            {cannedTemplates.map((tpl, i) => (
              <div
                key={i}
                onClick={() => setReplyText(tpl.text)}
                className="p-3 bg-white border border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50/30 rounded-xl cursor-pointer transition-all text-xs space-y-1 group"
              >
                <div className="font-bold text-neutral-900 group-hover:text-emerald-700 flex items-center justify-between">
                  <span>{tpl.title}</span>
                  <span className="text-[10px] text-emerald-600 font-normal">Gunakan &rarr;</span>
                </div>
                <p className="text-[11px] text-neutral-600 line-clamp-2">
                  {tpl.text}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-200 text-[11px] text-neutral-500">
            <strong>Hotline WhatsApp Resmi:</strong>
            <p className="font-mono text-neutral-800 font-bold">087716443331</p>
            <p className="text-[10px] text-neutral-400">Jambon - Kota Jogjakarta</p>
          </div>
        </div>

        {/* Right Side: Conversation Thread */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white text-xs">
            {chats.map((c) => {
              const isCs = c.sender === 'cs_admin';
              return (
                <div
                  key={c.id}
                  className={`flex flex-col ${isCs ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mb-0.5 px-1">
                    <span className="font-semibold text-neutral-700">{c.senderName}</span>
                    <span>·</span>
                    <span>{c.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isCs
                        ? 'bg-neutral-900 text-white rounded-br-xs'
                        : 'bg-emerald-50 text-neutral-900 border border-emerald-200 rounded-bl-xs'
                    }`}
                  >
                    {c.text}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="p-3 border-t border-neutral-200 bg-neutral-50 flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ketik balasan resmi CS untuk calon tamu..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 text-xs py-2.5 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Balasan</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
