import { useState } from "react";
import Icon from "@/components/ui/icon";
import { User } from "@/types/spark";
import { CURRENT_USER } from "@/data/mockData";

interface Props {
  user: User | null;
  onLogout: () => void;
}

const settingsGroups = [
  {
    title: "Аккаунт",
    items: [
      { icon: "User", label: "Редактировать профиль", action: "edit" },
      { icon: "ShieldCheck", label: "Верификация профиля", badge: "Новое", action: "verify" },
      { icon: "MapPin", label: "Геолокация", sub: "Москва", action: "location" },
    ],
  },
  {
    title: "Поиск",
    items: [
      { icon: "SlidersHorizontal", label: "Фильтры поиска", action: "filters" },
      { icon: "Eye", label: "Кто смотрел профиль", action: "viewers" },
      { icon: "Heart", label: "Лайки от других", action: "likes" },
    ],
  },
  {
    title: "Настройки",
    items: [
      { icon: "Bell", label: "Уведомления", action: "notifications" },
      { icon: "Lock", label: "Приватность", action: "privacy" },
      { icon: "HelpCircle", label: "Поддержка", action: "support" },
    ],
  },
];

export default function ProfileTab({ user, onLogout }: Props) {
  const profile = user || CURRENT_USER;
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio);

  return (
    <div className="h-[calc(100vh-130px)] overflow-y-auto">
      {/* Profile header */}
      <div className="relative">
        {/* Cover gradient */}
        <div className="h-40 animate-gradient-shift"
          style={{ background: "linear-gradient(135deg, #FF3D6E, #8B5CF6, #FF7A40)" }} />

        {/* Avatar */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-12">
          <div className="story-ring p-[3px] rounded-full">
            <img src={profile.avatar} alt={profile.name}
              className="w-24 h-24 rounded-full object-cover border-3 border-background" />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 btn-gradient rounded-full flex items-center justify-center">
            <Icon name="Camera" size={14} className="text-white" />
          </button>
        </div>
      </div>

      <div className="pt-16 px-5">
        {/* Name & info */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-white font-bold text-2xl">{profile.name}, {profile.age}</h2>
            {profile.verified && <Icon name="BadgeCheck" size={20} className="text-blue-400" />}
          </div>
          <div className="flex items-center justify-center gap-1 text-white/50 text-sm mb-2">
            <Icon name="MapPin" size={13} />
            <span>{profile.city}</span>
          </div>
          {!profile.premium && (
            <button className="inline-flex items-center gap-2 glass border border-yellow-500/30 rounded-2xl px-4 py-2 hover:bg-yellow-500/10 transition-all">
              <Icon name="Crown" size={16} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">Получить Spark Premium</span>
            </button>
          )}
        </div>

        {/* Rating */}
        <div className="glass rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Рейтинг привлекательности</span>
            <span className="gradient-text font-black text-xl">{profile.rating}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full btn-gradient rounded-full transition-all"
              style={{ width: `${profile.rating}%` }} />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-white/30">
            <span>Заполни профиль чтобы поднять рейтинг</span>
            <span>🔥</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Матчей", value: "12", icon: "Heart" },
            { label: "Лайков", value: "89", icon: "ThumbsUp" },
            { label: "Чатов", value: "5", icon: "MessageCircle" },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-3 text-center">
              <div className="gradient-text font-black text-xl">{stat.value}</div>
              <div className="text-white/40 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="glass rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm font-medium">О себе</span>
            <button onClick={() => setEditing(!editing)}
              className="text-pink-400 text-sm hover:text-pink-300 transition-colors">
              {editing ? "Сохранить" : "Изменить"}
            </button>
          </div>
          {editing ? (
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full bg-transparent text-white/80 text-sm leading-relaxed outline-none resize-none border border-pink-500/30 rounded-xl p-2"
            />
          ) : (
            <p className="text-white/70 text-sm leading-relaxed">{bio}</p>
          )}
        </div>

        {/* Interests */}
        <div className="glass rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm font-medium">Интересы</span>
            <button className="text-pink-400 text-sm">Изменить</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map(i => (
              <span key={i} className="glass px-3 py-1 rounded-full text-sm text-white/70 border border-white/10">{i}</span>
            ))}
            <button className="glass px-3 py-1 rounded-full text-sm text-white/30 border border-dashed border-white/20">
              + Добавить
            </button>
          </div>
        </div>

        {/* Settings */}
        {settingsGroups.map(group => (
          <div key={group.title} className="mb-4">
            <h3 className="text-white/40 text-xs uppercase tracking-wider mb-2 px-1">{group.title}</h3>
            <div className="glass rounded-2xl overflow-hidden">
              {group.items.map((item, idx) => (
                <button key={idx}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/10 transition-all text-left border-b border-white/5 last:border-0">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon as never} size={16} className="text-white/60" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white/80 text-sm">{item.label}</span>
                    {item.sub && <div className="text-white/30 text-xs">{item.sub}</div>}
                  </div>
                  {item.badge && (
                    <span className="btn-gradient text-white text-[10px] px-2 py-0.5 rounded-full">{item.badge}</span>
                  )}
                  <Icon name="ChevronRight" size={16} className="text-white/20" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button onClick={onLogout}
          className="w-full glass rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all border border-red-500/20 mb-6">
          <Icon name="LogOut" size={18} className="text-red-400" />
          <span className="text-red-400 font-medium">Выйти из аккаунта</span>
        </button>
      </div>
    </div>
  );
}
