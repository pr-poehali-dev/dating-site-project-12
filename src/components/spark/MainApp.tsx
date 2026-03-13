import { useState } from "react";
import { User, AppTab } from "@/types/spark";
import Icon from "@/components/ui/icon";
import DiscoverTab from "./tabs/DiscoverTab";
import MatchesTab from "./tabs/MatchesTab";
import ChatsTab from "./tabs/ChatsTab";
import NotificationsTab from "./tabs/NotificationsTab";
import ProfileTab from "./tabs/ProfileTab";
import { MOCK_NOTIFICATIONS } from "@/data/mockData";

interface Props {
  user: User | null;
  onLogout: () => void;
}

const tabs: { id: AppTab; label: string; icon: string }[] = [
  { id: "discover", label: "Поиск", icon: "Flame" },
  { id: "matches", label: "Матчи", icon: "Heart" },
  { id: "chats", label: "Чаты", icon: "MessageCircle" },
  { id: "notifications", label: "Уведомления", icon: "Bell" },
  { id: "profile", label: "Профиль", icon: "User" },
];

export default function MainApp({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<AppTab>("discover");
  const unreadNotifs = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const renderTab = () => {
    switch (activeTab) {
      case "discover": return <DiscoverTab />;
      case "matches": return <MatchesTab onOpenChat={() => setActiveTab("chats")} />;
      case "chats": return <ChatsTab />;
      case "notifications": return <NotificationsTab />;
      case "profile": return <ProfileTab user={user} onLogout={onLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto relative">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 glass sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="font-caveat text-2xl font-bold gradient-text">Spark</span>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "discover" && (
            <>
              <button className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
                <Icon name="SlidersHorizontal" size={16} className="text-white/70" />
              </button>
              <button className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
                <Icon name="MapPin" size={16} className="text-white/70" />
              </button>
            </>
          )}
          <button className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
            <Icon name="Crown" size={16} className="text-yellow-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderTab()}
      </div>

      {/* Bottom nav */}
      <div className="glass border-t border-white/5 px-2 py-2 sticky bottom-0 z-50">
        <div className="flex items-center justify-around">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all relative ${
                activeTab === tab.id ? "tab-active" : "hover:bg-white/5"
              }`}
            >
              <div className="relative">
                <Icon
                  name={tab.icon as never}
                  size={22}
                  className={activeTab === tab.id ? "text-pink-400" : "text-white/40"}
                />
                {tab.id === "notifications" && unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 notif-badge rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                    {unreadNotifs}
                  </span>
                )}
                {tab.id === "chats" && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 notif-badge rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                    3
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${activeTab === tab.id ? "text-pink-400" : "text-white/30"}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
