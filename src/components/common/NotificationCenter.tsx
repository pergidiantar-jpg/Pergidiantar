import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Bell, 
  CheckCheck, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  MessageSquare, 
  Radio
} from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadNotifCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    pushPermission,
    requestPushPermission,
    setSelectedOrderForDetail,
    orders,
    setActiveTab,
    currentRole
  } = useApp();

  if (!isOpen || currentRole !== 'super_admin') return null;

  const handleNotificationClick = (notifId: string, orderId?: string) => {
    markNotificationAsRead(notifId);
    if (orderId) {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setSelectedOrderForDetail(order);
        setActiveTab('admin-orders');
        onClose();
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'fleet':
        return <Truck className="w-4 h-4 text-amber-600" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-neutral-200">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-neutral-900 leading-tight">Notifikasi Real-Time</h2>
                {unreadNotifCount > 0 && (
                  <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full">
                    {unreadNotifCount} Baru
                  </span>
                )}
              </div>
              <span className="text-[10px] text-orange-600 font-semibold tracking-wide uppercase">
                Panel Khusus Super Admin
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Push Permission Banner */}
        <div className="p-3 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${pushPermission === 'granted' ? 'text-emerald-600' : 'text-amber-500'}`} />
            <span className="text-neutral-700 font-medium">
              Push Notif Browser: {pushPermission === 'granted' ? 'Aktif' : 'Belum Diaktifkan'}
            </span>
          </div>
          {pushPermission !== 'granted' && (
            <button
              onClick={requestPushPermission}
              className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors"
            >
              Aktifkan
            </button>
          )}
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>Riwayat aktivitas order & sistem</span>
          {unreadNotifCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Tandai Semua Dibaca
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-neutral-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Belum ada notifikasi baru.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item.id, item.orderId)}
                className={`p-4 transition-colors cursor-pointer flex gap-3 ${
                  !item.isRead ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="mt-0.5 p-2 rounded-lg bg-white border border-neutral-200 shadow-2xs shrink-0 self-start">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold text-neutral-900 truncate">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-neutral-400 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5 line-clamp-2">
                    {item.message}
                  </p>
                  {item.orderId && (
                    <span className="inline-block mt-1 text-[11px] text-emerald-700 font-medium">
                      Buka detail pesanan &rarr;
                    </span>
                  )}
                </div>
                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-2 self-start" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50 text-[11px] text-neutral-500 text-center">
          PERGIDIANTAR Notification System v2.4 · Real-time status sync
        </div>
      </div>
    </div>
  );
};
