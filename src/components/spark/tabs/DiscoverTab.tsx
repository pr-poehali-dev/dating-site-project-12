import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { User, Story } from "@/types/spark";
import { DISCOVER_CARDS, MOCK_STORIES, CURRENT_USER } from "@/data/mockData";
import { api, getToken } from "@/lib/api";
import { mapApiUser } from "@/pages/Index";
import StoriesRow from "../stories/StoriesRow";

type SwipeDir = "left" | "right" | "up" | null;

interface MatchPopup {
  user: { name: string; avatar: string };
}

export default function DiscoverTab() {
  const [cards, setCards] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingReal, setUsingReal] = useState(false);

  const [swipeDir, setSwipeDir] = useState<SwipeDir>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showMatch, setShowMatch] = useState<MatchPopup | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);

  useEffect(() => {
    if (!getToken()) {
      setCards(DISCOVER_CARDS);
      setLoading(false);
      return;
    }
    api.getDiscoverUsers()
      .then(users => {
        if (users.length > 0) {
          setCards(users.map(u => mapApiUser(u)));
          setUsingReal(true);
        } else {
          // Нет реальных пользователей — показываем моковых
          setCards(DISCOVER_CARDS);
        }
      })
      .catch(() => setCards(DISCOVER_CARDS))
      .finally(() => setLoading(false));
  }, []);

  const currentCard = cards[0];

  const handleSwipe = (dir: SwipeDir) => {
    if (!currentCard || swipeDir) return;
    setSwipeDir(dir);

    const doSwipe = async () => {
      // Отправляем на сервер только если реальный пользователь
      if (usingReal && currentCard.id && !currentCard.id.startsWith("mock")) {
        try {
          const swipeType = dir === "right" ? "like" : dir === "up" ? "super_like" : "dislike";
          const result = await api.swipe(parseInt(currentCard.id), swipeType);
          if (result.match && result.match_user) {
            setShowMatch({ user: result.match_user });
          }
        } catch { /* тихо игнорируем */ }
      } else if (dir === "right") {
        setShowMatch({ user: { name: currentCard.name, avatar: currentCard.avatar } });
      }
      nextCard();
    };

    setTimeout(doSwipe, 400);
  };

  const nextCard = () => {
    setCards(prev => prev.slice(1));
    setSwipeDir(null);
    setDragX(0);
    setActivePhoto(0);
    setShowDetail(false);
  };

  const reloadCards = () => {
    setLoading(true);
    api.getDiscoverUsers()
      .then(users => {
        setCards(users.length > 0 ? users.map(u => mapApiUser(u)) : DISCOVER_CARDS);
        setUsingReal(users.length > 0);
      })
      .catch(() => setCards(DISCOVER_CARDS))
      .finally(() => setLoading(false));
  };

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    dragStart.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };

  const onDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragX(x - dragStart.current);
  };

  const onDragEnd = () => {
    setDragging(false);
    if (dragX > 80) handleSwipe("right");
    else if (dragX < -80) handleSwipe("left");
    else setDragX(0);
  };

  const rotation = dragging ? dragX * 0.08 : 0;
  const likeOpacity = Math.max(0, Math.min(1, dragX / 80));
  const nopeOpacity = Math.max(0, Math.min(1, -dragX / 80));

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-130px)] md:h-[calc(100vh-81px)] gap-4">
        <div className="w-16 h-16 rounded-3xl btn-gradient flex items-center justify-center animate-pulse">
          <Icon name="Flame" size={28} className="text-white" />
        </div>
        <p className="text-white/40 text-sm">Ищем людей рядом...</p>
      </div>
    );
  }

  // Empty state
  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-130px)] md:h-[calc(100vh-81px)] gap-4 px-8 text-center">
        <div className="text-6xl mb-2">🎉</div>
        <h3 className="text-white font-bold text-xl">Ты просмотрел всех!</h3>
        <p className="text-white/40 text-sm leading-relaxed">
          Новые пользователи появятся позже.<br />Загляни снова чуть позже.
        </p>
        <button onClick={reloadCards}
          className="btn-gradient text-white font-semibold px-6 py-3 rounded-2xl flex items-center gap-2 mt-2">
          <Icon name="RefreshCw" size={18} />
          Обновить
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-130px)] md:h-[calc(100vh-81px)] overflow-hidden">

      {/* ── LEFT: Stories + Card stack ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Stories row */}
        <StoriesRow
          stories={stories}
          currentUserId={CURRENT_USER.id}
          currentUserName={CURRENT_USER.name}
          currentUserAvatar={CURRENT_USER.avatar}
          onStoriesUpdate={setStories}
        />

        {/* Real users badge */}
        {usingReal && (
          <div className="flex items-center gap-1.5 px-4 pb-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping-slow" />
            <span className="text-green-400/70 text-xs">Реальные пользователи</span>
          </div>
        )}

        {/* Card stack */}
        <div className="flex-1 relative px-4 pb-2">
          {/* Background cards */}
          {cards.slice(1, 3).map((card, i) => (
            <div key={card.id + i} className="absolute inset-4 rounded-3xl overflow-hidden"
              style={{
                transform: `scale(${0.97 - i * 0.03}) translateY(${(i + 1) * 6}px)`,
                zIndex: 2 - i,
              }}>
              <img src={card.avatar} alt={card.name} className="w-full h-full object-cover" />
            </div>
          ))}

          {/* Main card */}
          <div
            className={`absolute inset-4 rounded-3xl overflow-hidden z-10 cursor-grab active:cursor-grabbing select-none
              ${swipeDir === "left" ? "animate-swipe-left" : ""}
              ${swipeDir === "right" ? "animate-swipe-right" : ""}
              ${swipeDir === "up" ? "animate-swipe-up" : ""}
              ${!swipeDir ? "animate-card-enter" : ""}
            `}
            style={{
              transform: swipeDir ? undefined : `translateX(${dragX}px) rotate(${rotation}deg)`,
              transition: dragging ? "none" : swipeDir ? undefined : "transform 0.3s ease",
            }}
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            onTouchStart={onDragStart}
            onTouchMove={onDragMove}
            onTouchEnd={onDragEnd}
          >
            <div className="relative w-full h-full">
              <img
                src={currentCard.photos[activePhoto] || currentCard.avatar}
                alt={currentCard.name}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />

              {/* Photo indicators */}
              <div className="absolute top-3 left-3 right-3 flex gap-1">
                {currentCard.photos.map((_, i) => (
                  <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/30">
                    <div className={`h-full bg-white transition-all ${i <= activePhoto ? "w-full" : "w-0"}`} />
                  </div>
                ))}
              </div>

              {/* Tap zones */}
              <div className="absolute inset-0 grid grid-cols-2">
                <div onClick={() => setActivePhoto(p => Math.max(0, p - 1))} />
                <div onClick={() => setActivePhoto(p => Math.min(currentCard.photos.length - 1, p + 1))} />
              </div>

              {/* LIKE / NOPE */}
              <div className="absolute top-12 left-6 rounded-2xl border-4 border-green-400 px-4 py-2 rotate-[-20deg] transition-opacity"
                style={{ opacity: likeOpacity }}>
                <span className="text-green-400 font-black text-2xl">LIKE</span>
              </div>
              <div className="absolute top-12 right-6 rounded-2xl border-4 border-red-400 px-4 py-2 rotate-[20deg] transition-opacity"
                style={{ opacity: nopeOpacity }}>
                <span className="text-red-400 font-black text-2xl">NOPE</span>
              </div>

              {/* Gradient */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 40%, transparent 60%)" }} />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex gap-2 mb-2">
                  {currentCard.verified && (
                    <span className="glass rounded-full px-2 py-0.5 text-xs flex items-center gap-1 text-blue-300">
                      <Icon name="BadgeCheck" size={12} /> Верифицирован
                    </span>
                  )}
                  {currentCard.premium && (
                    <span className="glass rounded-full px-2 py-0.5 text-xs flex items-center gap-1 text-yellow-300">
                      <Icon name="Crown" size={12} /> Премиум
                    </span>
                  )}
                  {currentCard.online && (
                    <span className="glass rounded-full px-2 py-0.5 text-xs flex items-center gap-1 text-green-300">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />Онлайн
                    </span>
                  )}
                </div>

                <div className="flex items-end justify-between mb-2">
                  <div>
                    <h2 className="text-white font-bold text-3xl">{currentCard.name}, {currentCard.age || "?"}</h2>
                    <div className="flex items-center gap-1 text-white/60 text-sm">
                      <Icon name="MapPin" size={13} />
                      <span>{currentCard.city}</span>
                    </div>
                  </div>
                  <button onClick={() => setShowDetail(!showDetail)}
                    className="glass w-10 h-10 rounded-full flex items-center justify-center">
                    <Icon name="Info" size={18} className="text-white/70" />
                  </button>
                </div>

                {showDetail && (
                  <div className="md:hidden animate-slide-up">
                    {currentCard.bio && <p className="text-white/80 text-sm mb-3 leading-relaxed">{currentCard.bio}</p>}
                    <div className="flex flex-wrap gap-1.5">
                      {currentCard.interests.slice(0, 4).map(i => (
                        <span key={i} className="glass px-2 py-1 rounded-full text-xs text-white/70">{i}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button onClick={() => handleSwipe("left")}
                    className="w-14 h-14 glass rounded-full flex items-center justify-center hover:bg-red-500/30 transition-all group border border-white/10">
                    <Icon name="X" size={24} className="text-red-400 group-hover:scale-110 transition-transform" />
                  </button>
                  <button onClick={() => handleSwipe("up")}
                    className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-all border border-white/10">
                    <Icon name="Star" size={20} className="text-blue-400" />
                  </button>
                  <button onClick={() => handleSwipe("right")}
                    className="w-14 h-14 btn-gradient rounded-full flex items-center justify-center group">
                    <Icon name="Heart" size={24} className="text-white group-hover:scale-110 transition-transform" />
                  </button>
                  <button className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-yellow-500/20 transition-all border border-white/10">
                    <Icon name="Zap" size={20} className="text-yellow-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Profile detail panel (desktop) ── */}
      <div className="hidden lg:flex flex-col w-80 xl:w-96 border-l border-white/5 overflow-y-auto flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <img src={currentCard.avatar} alt={currentCard.name}
              className="w-14 h-14 rounded-2xl object-cover" />
            <div>
              <h3 className="text-white font-bold text-lg">{currentCard.name}, {currentCard.age || "?"}</h3>
              <div className="flex items-center gap-1 text-white/50 text-sm">
                <Icon name="MapPin" size={12} />
                <span>{currentCard.city}</span>
              </div>
            </div>
          </div>

          {/* Match score */}
          <div className="glass rounded-2xl p-4 mb-4 card-glow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Совместимость</span>
              <span className="gradient-text font-black text-xl">{(currentCard as User & { matchScore?: number }).matchScore ?? 87}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full btn-gradient rounded-full"
                style={{ width: `${(currentCard as User & { matchScore?: number }).matchScore ?? 87}%` }} />
            </div>
          </div>

          {currentCard.bio && (
            <div className="mb-4">
              <h4 className="text-white/40 text-xs uppercase tracking-wider mb-2">О себе</h4>
              <p className="text-white/70 text-sm leading-relaxed">{currentCard.bio}</p>
            </div>
          )}

          {currentCard.interests.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white/40 text-xs uppercase tracking-wider mb-2">Интересы</h4>
              <div className="flex flex-wrap gap-2">
                {currentCard.interests.map(interest => (
                  <span key={interest} className="glass px-3 py-1 rounded-full text-xs text-white/70 border border-white/10">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: "Фото", value: currentCard.photos.length, icon: "Image" },
              { label: "Возраст", value: currentCard.age || "?", icon: "Calendar" },
              { label: "Город", value: currentCard.city.slice(0, 6), icon: "MapPin" },
            ].map((s, i) => (
              <div key={i} className="glass rounded-xl p-2.5 text-center">
                <Icon name={s.icon as never} size={14} className="text-white/40 mx-auto mb-1" />
                <div className="text-white font-bold text-sm">{s.value}</div>
                <div className="text-white/30 text-[10px]">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleSwipe("left")}
              className="flex-1 glass rounded-2xl py-3 flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all border border-white/10">
              <Icon name="X" size={18} className="text-red-400" />
              <span className="text-red-400 text-sm font-medium">Пропустить</span>
            </button>
            <button onClick={() => handleSwipe("right")}
              className="flex-1 btn-gradient rounded-2xl py-3 flex items-center justify-center gap-2">
              <Icon name="Heart" size={18} className="text-white" />
              <span className="text-white text-sm font-medium">Лайк</span>
            </button>
          </div>
        </div>
      </div>

      {/* Match popup */}
      {showMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass rounded-3xl p-8 mx-6 max-w-sm w-full text-center card-glow animate-bounce-in">
            <div className="text-6xl mb-4">💥</div>
            <h2 className="font-caveat text-4xl font-bold gradient-text mb-2">Это матч!</h2>
            <p className="text-white/60 mb-6">Ты и {showMatch.user.name} понравились друг другу</p>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img src={showMatch.user.avatar} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                <div className="absolute -bottom-2 -right-2 w-7 h-7 btn-gradient rounded-full flex items-center justify-center">
                  <Icon name="Heart" size={14} className="text-white" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowMatch(null)}
                className="flex-1 glass rounded-2xl py-3 text-white/60 font-medium hover:bg-white/10 transition-all">
                Позже
              </button>
              <button onClick={() => setShowMatch(null)}
                className="flex-1 btn-gradient rounded-2xl py-3 text-white font-semibold flex items-center justify-center gap-2">
                <Icon name="MessageCircle" size={16} />
                Написать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}