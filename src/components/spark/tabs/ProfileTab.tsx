import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { User } from "@/types/spark";
import { CURRENT_USER } from "@/data/mockData";
import { api } from "@/lib/api";
import { mapApiUser } from "@/pages/Index";

interface Props {
  user: User | null;
  onLogout: () => void;
  onUserUpdate: (user: User, rawUser: Record<string, unknown>) => void;
}

const settingsGroups = [
  {
    title: "Аккаунт",
    items: [
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

const INTERESTS_LIST = ["Путешествия", "Музыка", "Кино", "Спорт", "Кулинария", "Йога", "Книги", "Арт", "Технологии", "Природа", "Фотография", "Танцы"];

export default function ProfileTab({ user, onLogout, onUserUpdate }: Props) {
  const profile = user || CURRENT_USER;

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    age: String(profile.age || ""),
    city: profile.city,
    bio: profile.bio,
    interests: [...profile.interests],
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Показываем превью сразу
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setAvatarUploading(true);

    try {
      const avatarUrl = await api.uploadAvatar(file);
      // Обновляем данные с сервера
      const data = await api.me();
      const updated = mapApiUser(data.user);
      updated.avatar = avatarUrl;
      onUserUpdate(updated, data.user);
      setAvatarPreview(avatarUrl);
      setSaveMsg("Фото обновлено!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Ошибка загрузки");
      setAvatarPreview(profile.avatar);
      setTimeout(() => setSaveMsg(""), 4000);
    } finally {
      setAvatarUploading(false);
    }
  };

  const toggleInterest = (i: string) => {
    setEditForm(f => ({
      ...f,
      interests: f.interests.includes(i)
        ? f.interests.filter(x => x !== i)
        : [...f.interests, i],
    }));
  };

  const saveProfile = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const data = await api.updateProfile({
        name: editForm.name,
        age: editForm.age ? parseInt(editForm.age) : undefined,
        city: editForm.city,
        bio: editForm.bio,
        interests: editForm.interests,
      });
      const updated = mapApiUser(data.user);
      onUserUpdate(updated, data.user);
      setEditing(false);
      setSaveMsg("Профиль сохранён!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-[calc(100vh-130px)] md:h-[calc(100vh-81px)] overflow-y-auto">
      <div className="md:flex md:h-full">

        {/* ── LEFT: Profile card ── */}
        <div className="md:w-80 lg:w-96 md:border-r md:border-white/5 md:overflow-y-auto md:flex-shrink-0">
          {/* Cover + Avatar */}
          <div className="relative">
            <div className="h-36 md:h-44 animate-gradient-shift"
              style={{ background: "linear-gradient(135deg, #FF3D6E, #8B5CF6, #FF7A40)" }} />
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-12">
              <div className="story-ring p-[3px] rounded-full">
                <div className="relative">
                  <img
                    src={avatarPreview || profile.avatar}
                    alt={profile.name}
                    className={`w-24 h-24 rounded-full object-cover border-3 border-background transition-opacity ${avatarUploading ? "opacity-50" : ""}`}
                  />
                  {avatarUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
              {/* Кнопка загрузки фото */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="absolute bottom-0 right-0 w-8 h-8 btn-gradient rounded-full flex items-center justify-center disabled:opacity-50 hover:scale-110 transition-transform"
              >
                <Icon name="Camera" size={14} className="text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="pt-16 px-5 pb-6">
            {/* Toast message */}
            {saveMsg && (
              <div className={`mb-4 glass rounded-xl px-4 py-2.5 text-center text-sm animate-fade-in ${saveMsg.includes("Ошибка") ? "border border-red-500/30 text-red-400" : "border border-green-500/30 text-green-400"}`}>
                {saveMsg}
              </div>
            )}

            {/* Name */}
            <div className="text-center mb-5">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-white font-bold text-2xl">{profile.name}, {profile.age}</h2>
                {profile.verified && <Icon name="BadgeCheck" size={20} className="text-blue-400" />}
              </div>
              <div className="flex items-center justify-center gap-1 text-white/50 text-sm mb-3">
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
                { label: "Матчей", value: "12" },
                { label: "Лайков", value: "89" },
                { label: "Чатов", value: "5" },
              ].map((stat, i) => (
                <div key={i} className="glass rounded-2xl p-3 text-center">
                  <div className="gradient-text font-black text-xl">{stat.value}</div>
                  <div className="text-white/40 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Logout */}
            <button onClick={onLogout}
              className="w-full glass rounded-2xl py-3 flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all border border-red-500/20">
              <Icon name="LogOut" size={16} className="text-red-400" />
              <span className="text-red-400 font-medium text-sm">Выйти</span>
            </button>
          </div>
        </div>

        {/* ── RIGHT: Edit & Settings ── */}
        <div className="flex-1 md:overflow-y-auto px-4 md:px-8 py-4 md:py-6">

          {/* Edit form / view */}
          <div className="glass rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Мой профиль</h3>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-xl text-pink-400 text-sm hover:bg-pink-500/10 transition-all">
                  <Icon name="Pencil" size={14} />
                  Изменить
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(false); setEditForm({ name: profile.name, age: String(profile.age || ""), city: profile.city, bio: profile.bio, interests: [...profile.interests] }); }}
                    className="glass px-3 py-1.5 rounded-xl text-white/40 text-sm hover:bg-white/5 transition-all">
                    Отмена
                  </button>
                  <button onClick={saveProfile} disabled={saving}
                    className="btn-gradient px-4 py-1.5 rounded-xl text-white text-sm font-medium disabled:opacity-60 flex items-center gap-1.5">
                    {saving ? <div className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" /> : <Icon name="Check" size={14} />}
                    Сохранить
                  </button>
                </div>
              )}
            </div>

            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/50 text-xs mb-1 block">Имя</label>
                    <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-pink-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs mb-1 block">Возраст</label>
                    <input type="number" value={editForm.age} onChange={e => setEditForm(f => ({ ...f, age: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-pink-500/50 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Город</label>
                  <input value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-pink-500/50 transition-all" />
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-1 block">О себе</label>
                  <textarea value={editForm.bio} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
                    rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-pink-500/50 transition-all resize-none" />
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-2 block">Интересы</label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS_LIST.map(i => (
                      <button key={i} onClick={() => toggleInterest(i)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${editForm.interests.includes(i) ? "btn-gradient text-white" : "glass text-white/60 hover:bg-white/10"}`}>
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-white/40 text-xs mb-0.5">Имя</div>
                    <div className="text-white">{profile.name}</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs mb-0.5">Возраст</div>
                    <div className="text-white">{profile.age || "—"}</div>
                  </div>
                  <div>
                    <div className="text-white/40 text-xs mb-0.5">Город</div>
                    <div className="text-white">{profile.city}</div>
                  </div>
                </div>
                {profile.bio && (
                  <div>
                    <div className="text-white/40 text-xs mb-0.5">О себе</div>
                    <p className="text-white/70 text-sm leading-relaxed">{profile.bio}</p>
                  </div>
                )}
                {profile.interests.length > 0 && (
                  <div>
                    <div className="text-white/40 text-xs mb-2">Интересы</div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.interests.map(i => (
                        <span key={i} className="glass px-3 py-1 rounded-full text-xs text-white/70 border border-white/10">{i}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="md:grid md:grid-cols-2 md:gap-4">
            {settingsGroups.map(group => (
              <div key={group.title} className="mb-4 md:mb-0">
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
          </div>

          {/* Logout mobile */}
          <button onClick={onLogout}
            className="md:hidden w-full glass rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all border border-red-500/20 mt-4 mb-6">
            <Icon name="LogOut" size={18} className="text-red-400" />
            <span className="text-red-400 font-medium">Выйти из аккаунта</span>
          </button>
        </div>
      </div>
    </div>
  );
}
