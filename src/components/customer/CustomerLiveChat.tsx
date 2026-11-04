import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageCircle, 
  X, 
  Send, 
  Compass, 
  Bot, 
  CheckCheck,
  Sparkles
} from 'lucide-react';

export const CustomerLiveChat: React.FC = () => {
  const { chats, sendChatMessage, isChatOpen, setIsChatOpen } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chats, isChatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText, 'customer');
    setInputText('');
  };

  const quickQuestions = [
    'Fasilitas apa saja di Paket All In?',
    'Bagaimana alokasi armada HiAce & Bus?',
    'Apakah bisa custom destinasi Jogja & Bromo?'
  ];

  const unreadCount = chats.filter((c) => c.sender === 'cs_admin' && !c.isRead).length;

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-3.5 sm:p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-2xl transition-transform hover:scale-105 flex items-center gap-2.5 relative group border-2 border-white"
            aria-label="Buka Chat Dukungan Pelanggan"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-bold hidden sm:inline">
              Chat Wisatawan
            </span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[11px] font-black rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-92 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col h-[520px] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-orange-500 to-blue-600 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white p-0.5 shrink-0 shadow-xs">
                <img 
                  src="/assets/aistudio/1793582722648_90a12056.jpg" 
                  alt="Logo PERGIDIANTAR" 
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white leading-none">
                  Layanan Pelanggan PERGIDIANTAR
                </h3>
                <span className="text-[10px] text-white/90 mt-1 block">
                  Online · Respons Cepat Travel Specialist
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/60 text-xs">
            {/* Intro Welcome Box */}
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-orange-950 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-orange-900">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                Selamat Datang di PERGIDIANTAR!
              </p>
              <p className="text-[11px] text-orange-800">
                Ada yang bisa kami bantu seputar destinasi Jogja, Malang, Bali, atau pemesanan paket All In & Hemat?
              </p>
            </div>

            {/* Quick questions chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                Pertanyaan Cepat:
              </span>
              <div className="flex flex-col gap-1">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sendChatMessage(q, 'customer');
                    }}
                    className="text-left py-1.5 px-2.5 bg-white border border-neutral-200 hover:border-orange-400 hover:bg-orange-50/40 rounded-lg text-neutral-700 text-[11px] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Message items */}
            {chats.map((c) => {
              const isCustomer = c.sender === 'customer';
              return (
                <div
                  key={c.id}
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-neutral-400 mb-0.5 px-1">
                    {c.senderName} · {c.timestamp}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isCustomer
                        ? 'bg-orange-500 text-white rounded-br-xs'
                        : 'bg-white text-neutral-800 border border-neutral-200 shadow-2xs rounded-bl-xs'
                    }`}
                  >
                    {c.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-neutral-200 bg-white flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ketik pertanyaan liburan Anda..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-xs py-2 px-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
