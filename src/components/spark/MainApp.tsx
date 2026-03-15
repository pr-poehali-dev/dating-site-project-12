import { useState } from "react";
import { User, AppTab } from "@/types/spark";
import Icon from "@/components/ui/icon";
import DiscoverTab from "./tabs/DiscoverTab";
import MatchesTab from "./tabs/MatchesTab";
import ChatsTab from "./tabs/ChatsTab";
import NotificationsTab from "./tabs/NotificationsTab";
import ProfileTab from "./tabs/ProfileTab";
import PremiumModal from "./modals/PremiumModal";
import FiltersModal from "./modals/FiltersModal";
import LocationModal from "./modals/LocationModal";
import { MOCK_NOTIFICATIONS, CURRENT_USER } from "@/data/mockData";

interface Props {
  user: User | null;
  onLogout: () => void;
  onUserUpdate: (user: User, rawUser: Record<string, unknown>) => void;
}

const tabs: { id: AppTab; label: string; icon: string; desc: string }[] = [
  { id: "discover", label: "Поиск", icon: "Flame", desc: "Найти людей" },
  { id: "matches", label: "Матчи", icon: "Heart", desc: "Взаимные лайки" },
  { id: "chats", label: "Чаты", icon: "MessageCircle", desc: "Сообщения" },
  { id: "notifications", label: "Уведомления", icon: "Bell", desc: "Активность" },
  { id: "profile", label: "Профиль", icon: "User", desc: "Мой аккаунт" },
];

export default function MainApp({ user, onLogout, onUserUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<AppTab>("discover");
  const [showPremium, setShowPremium] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [city, setCity] = useState("Москва");
  const unreadNotifs = MOCK_NOTIFICATIONS.filter(n => !n.read).length;
  const profile = user || CURRENT_USER;

  const renderTab = () => {
    switch (activeTab) {
      case "discover": return <DiscoverTab />;
      case "matches": return <MatchesTab onOpenChat={() => setActiveTab("chats")} />;
      case "chats": return <ChatsTab />;
      case "notifications": return <NotificationsTab />;
      case "profile": return <ProfileTab user={user} onLogout={onLogout} onUserUpdate={onUserUpdate} />;
    }
  };

  return (
    <>
    <div className="min-h-screen bg-background flex">

      {/* ── DESKTOP/TABLET SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-20 lg:w-72 flex-shrink-0 glass border-r border-white/5 sticky top-0 h-screen z-50">

        {/* Logo */}
        <div className="px-4 lg:px-6 py-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl btn-gradient flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">⚡</span>
          </div>
          <span className="hidden lg:block font-caveat text-2xl font-bold gradient-text">Spark</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-3 py-3.5 rounded-2xl transition-all group relative ${
                activeTab === tab.id ? "tab-active" : "hover:bg-white/5"
              }`}
            >
              <div className="relative flex-shrink-0">
                <Icon
                  name={tab.icon as never}
                  size={22}
                  className={activeTab === tab.id ? "text-pink-400" : "text-white/40 group-hover:text-white/60 transition-colors"}
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
              <div className="hidden lg:block text-left">
                <div className={`font-semibold text-sm ${activeTab === tab.id ? "text-pink-400" : "text-white/70"}`}>
                  {tab.label}
                </div>
                <div className="text-white/30 text-xs">{tab.desc}</div>
              </div>
              {/* Tooltip for md (collapsed) */}
              <div className="lg:hidden absolute left-16 glass rounded-xl px-3 py-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                <span className="text-white text-xs font-medium">{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>

        {/* Premium banner (desktop only) */}
        <div className="hidden lg:block mx-4 mb-4">
          <div className="glass rounded-2xl p-4 card-glow">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Crown" size={18} className="text-yellow-400" />
              <span className="text-white font-semibold text-sm">Spark Premium</span>
            </div>
            <p className="text-white/50 text-xs mb-3 leading-relaxed">Безлимитные лайки, суперлайки и приоритетный показ</p>
            <button onClick={() => setShowPremium(true)} className="w-full btn-gradient text-white text-xs font-semibold py-2.5 rounded-xl">
              Попробовать бесплатно
            </button>
          </div>
        </div>

        {/* User avatar (bottom) */}
        <div className="border-t border-white/5 px-3 py-4 flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img src={profile.avatar} alt={profile.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-pink-500/30" />
            {profile.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <div className="text-white font-semibold text-sm truncate">{profile.name}</div>
            <div className="text-white/40 text-xs">онлайн</div>
          </div>
          <button onClick={onLogout}
            className="hidden lg:flex glass w-8 h-8 rounded-xl items-center justify-center hover:bg-red-500/20 transition-all group">
            <Icon name="LogOut" size={14} className="text-white/40 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar — mobile only */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 glass sticky top-0 z-50 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center">
              <span className="text-white">⚡</span>
            </div>
            <span className="font-caveat text-2xl font-bold gradient-text">Spark</span>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === "discover" && (
              <>
                <button onClick={() => setShowFilters(true)} className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
                  <Icon name="SlidersHorizontal" size={16} className="text-white/70" />
                </button>
                <button onClick={() => setShowLocation(true)} className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
                  <Icon name="MapPin" size={16} className="text-white/70" />
                </button>
              </>
            )}
            <button onClick={() => setShowPremium(true)} className="glass w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
              <Icon name="Crown" size={16} className="text-yellow-400" />
            </button>
          </div>
        </div>

        {/* Desktop top bar */}
        <div className="hidden md:flex items-center justify-between px-8 py-5 border-b border-white/5">
          <div>
            <h1 className="text-white font-bold text-xl capitalize">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-white/40 text-sm">{tabs.find(t => t.id === activeTab)?.desc}</p>
          </div>
          <div className="flex items-center gap-3">
            {activeTab === "discover" && (
              <>
                <button onClick={() => setShowFilters(true)} className="glass px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all">
                  <Icon name="SlidersHorizontal" size={15} className="text-white/70" />
                  <span className="text-white/70 text-sm">Фильтры</span>
                </button>
                <button onClick={() => setShowLocation(true)} className="glass px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all">
                  <Icon name="MapPin" size={15} className="text-white/70" />
                  <span className="text-white/70 text-sm">{city}</span>
                </button>
              </>
            )}
            <button onClick={() => setShowPremium(true)} className="glass px-4 py-2 rounded-xl flex items-center gap-2 border border-yellow-500/30 hover:bg-yellow-500/10 transition-all">
              <Icon name="Crown" size={15} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">Premium</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {renderTab()}
        </div>

        {/* Bottom nav — mobile only */}
        <div className="md:hidden glass border-t border-white/5 px-2 py-2 sticky bottom-0 z-50">
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
    </div>

    {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    {showFilters && <FiltersModal onClose={() => setShowFilters(false)} />}
    {showLocation && (
      <LocationModal
        city={city}
        onClose={() => setShowLocation(false)}
        onSave={c => setCity(c)}
      />
    )}
    </>
  );
}