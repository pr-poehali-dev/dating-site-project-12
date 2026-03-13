import { useState } from "react";
import Icon from "@/components/ui/icon";
import { MOCK_NOTIFICATIONS } from "@/data/mockData";
import { Notification } from "@/types/spark";

const notifIcon: Record<string, string> = {
  like: "Heart",
  match: "Zap",
  message: "MessageCircle",
  super_like: "Star",
  visit: "Eye",
};

const notifColor: Record<string, string> = {
  like: "text-pink-400",
  match: "text-yellow-400",
  message: "text-blue-400",
  super_like: "text-purple-400",
  visit: "text-green-400",
};

const notifBg: Record<string, string> = {
  like: "bg-pink-500/20",
  match: "bg-yellow-500/20",
  message: "bg-blue-500/20",
  super_like: "bg-purple-500/20",
  visit: "bg-green-500/20",
};

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="h-[calc(100vh-130px)] overflow-y-auto px-4 py-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-white font-bold text-xl">Уведомления</h2>
          {unread > 0 && <span className="text-white/40 text-sm">{unread} непрочитанных</span>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-pink-400 text-sm hover:text-pink-300 transition-colors">
            Прочитать все
          </button>
        )}
      </div>

      {/* Activity summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Лайков", value: "24", icon: "Heart", color: "text-pink-400", bg: "bg-pink-500/10" },
          { label: "Просмотров", value: "89", icon: "Eye", color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Матчей", value: "5", icon: "Zap", color: "text-yellow-400", bg: "bg-yellow-500/10" },
        ].map((stat, i) => (
          <div key={i} className={`glass rounded-2xl p-3 text-center ${stat.bg}`}>
            <Icon name={stat.icon as never} size={20} className={`${stat.color} mx-auto mb-1`} />
            <div className={`font-black text-xl ${stat.color}`}>{stat.value}</div>
            <div className="text-white/40 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        {notifications.map(notif => (
          <div key={notif.id}
            className={`glass rounded-2xl p-4 flex items-center gap-4 transition-all ${
              !notif.read ? "border border-pink-500/20" : "opacity-70"
            }`}>
            <div className="relative flex-shrink-0">
              <img src={notif.user.avatar} alt={notif.user.name}
                className="w-12 h-12 rounded-full object-cover" />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${notifBg[notif.type]}`}>
                <Icon name={notifIcon[notif.type] as never} size={12} className={notifColor[notif.type]} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm">
                <span className="font-semibold">{notif.user.name}</span>
                {" "}<span className="text-white/60">{notif.text}</span>
              </p>
              <span className="text-white/30 text-xs">{notif.time}</span>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 bg-pink-400 rounded-full flex-shrink-0 animate-ping-slow" />
            )}
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔔</div>
          <p className="text-white/40">Уведомлений пока нет</p>
        </div>
      )}
    </div>
  );
}
