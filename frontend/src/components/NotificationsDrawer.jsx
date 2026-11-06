import React from 'react';
import { 
  Bell, Check, X, Heart, MessageSquare, Award, UserPlus, 
  Sparkles, CheckCircle2, ShieldCheck, ArrowRight
} from 'lucide-react';

export default function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onRespondFollow,
  onToast
}) {
  if (!isOpen) return null;

  const followRequests = notifications.filter(
    n => n.notification_type === 'follow_request' && n.status === 'active'
  );
  const otherNotifications = notifications.filter(
    n => !(n.notification_type === 'follow_request' && n.status === 'active')
  );

  const getIcon = (type) => {
    switch (type) {
      case 'follow_request':
        return <UserPlus className="w-4 h-4 text-[#587B6C]" />;
      case 'like':
        return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-[#587B6C]" />;
      case 'points':
        return <Award className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#7C9D8E]" />;
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#E2DDD1] animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2DDD1] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8EFEA] flex items-center justify-center text-[#2C4A3E]">
              <Bell className="w-5 h-5 text-[#587B6C]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[#2C4A3E]">Notifications</h2>
              <p className="text-[11px] text-[#8C857B]">Your Pune eco-community activity</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#587B6C] hover:bg-[#E8EFEA] transition-colors cursor-pointer"
              title="Mark all as read"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-[#F5F2EB] text-[#8C857B] hover:text-[#2C4A3E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Section: Follow Requests (Instagram Style) */}
          {followRequests.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#587B6C] animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C4A3E]">
                    Follow Requests ({followRequests.length})
                  </h3>
                </div>
                <span className="text-[10px] text-[#8C857B]">Pune Volunteers</span>
              </div>

              <div className="space-y-2">
                {followRequests.map((req) => (
                  <div 
                    key={req.id}
                    className="p-3 rounded-2xl bg-white border border-[#E2DDD1] shadow-xs hover:border-[#7C9D8E]/60 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={req.sender_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"}
                        alt={req.sender_name}
                        className="w-10 h-10 rounded-full object-cover border border-[#E2DDD1] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#2C4A3E] truncate">{req.sender_name}</p>
                        <p className="text-[11px] text-[#8C857B] line-clamp-1">Wants to follow your eco-stream</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onRespondFollow(req.id, 'accept');
                          onToast?.({
                            type: 'success',
                            title: 'Follow Request Accepted! 🤝',
                            message: `${req.sender_name} is now following your green stream.`
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#2C4A3E] hover:bg-[#587B6C] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          onRespondFollow(req.id, 'decline');
                          onToast?.({
                            type: 'info',
                            title: 'Request Removed',
                            message: 'Follow request was deleted.'
                          });
                        }}
                        className="p-1.5 rounded-xl bg-[#F5F2EB] hover:bg-red-50 text-[#8C857B] hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete request"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Activity & Cheers */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C4A3E] mb-2.5">
              Activity & Updates
            </h3>

            {otherNotifications.length === 0 && followRequests.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-white border border-[#E2DDD1]">
                <div className="w-12 h-12 rounded-full bg-[#E8EFEA] flex items-center justify-center mx-auto mb-2 text-[#587B6C]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-display font-bold text-sm text-[#2C4A3E]">You're all caught up!</p>
                <p className="text-xs text-[#8C857B] mt-1">No new alerts right now.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {otherNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onMarkRead(n.id)}
                    className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 border ${
                      n.is_read
                        ? 'bg-white/80 border-[#E2DDD1]/70'
                        : 'bg-[#F2F7F4] border-[#7C9D8E]/40 shadow-xs'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={n.sender_avatar || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&auto=format&fit=crop"}
                        alt={n.sender_name}
                        className="w-10 h-10 rounded-full object-cover border border-[#E2DDD1]"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-xs flex items-center justify-center">
                        {getIcon(n.notification_type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="font-bold text-xs text-[#2C4A3E] truncate">{n.title}</span>
                        <span className="text-[10px] text-[#8C857B] shrink-0">
                          {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recently'}
                        </span>
                      </div>
                      <p className="text-xs text-[#52635B] leading-relaxed">
                        <strong className="text-[#2C4A3E] font-medium">{n.sender_name} </strong>
                        {n.message}
                      </p>
                      {n.status === 'accepted' && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Connection Confirmed
                        </span>
                      )}
                    </div>

                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#587B6C] shrink-0 mt-2" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white border-t border-[#E2DDD1] text-center text-[11px] text-[#8C857B]">
          <span>PrithviNet Real-Time Eco Notification Engine · Supabase</span>
        </div>
      </div>
    </div>
  );
}

