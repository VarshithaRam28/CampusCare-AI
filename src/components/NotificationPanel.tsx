import React from 'react';
import { useApp } from '../context/AppContext';
import { Info, AlertTriangle, CheckCircle, AlertOctagon, X, Check } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  if (!isOpen) return null;

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info size={18} className="text-blue-400" />;
      case 'warning': return <AlertTriangle size={18} className="text-amber-400" />;
      case 'success': return <CheckCircle size={18} className="text-green-400" />;
      case 'critical': return <AlertOctagon size={18} className="text-red-500" />;
      default: return <Info size={18} className="text-gray-400" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-14 w-80 sm:w-96 glass-card border border-white/10 shadow-2xl rounded-xl z-50 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <h3 className="font-semibold text-white">Notifications</h3>
          <div className="flex gap-2">
            <button 
              onClick={markAllNotificationsRead}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors p-1"
              title="Mark all as read"
            >
              <Check size={14} /> Mark all read
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2">
          {sortedNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {sortedNotifications.map(notification => (
                <div 
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-white/5 ${!notification.read ? 'bg-blue-500/5' : ''}`}
                >
                  <div className="mt-0.5 shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${!notification.read ? 'text-white' : 'text-gray-400'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      {getTimeAgo(notification.createdAt)}
                      {notification.complaintId && <span>• ID: {notification.complaintId}</span>}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 self-center" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
