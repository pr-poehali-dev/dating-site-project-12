import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { User } from "@/types/spark";
import { DISCOVER_CARDS } from "@/data/mockData";

type SwipeDir = "left" | "right" | "up" | null;

interface MatchPopup {
  user: User;
}

export default function DiscoverTab() {
  const [cards, setCards] = useState(DISCOVER_CARDS);
  const [swipeDir, setSwipeDir] = useState<SwipeDir>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showMatch, setShowMatch] = useState<MatchPopup | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);

  const currentCard = cards[0];

  const handleSwipe = (dir: SwipeDir) => {
    if (!currentCard || swipeDir) return;
    setSwipeDir(dir);
    if (dir === "right") {
      setTimeout(() => {
        setShowMatch({ user: currentCard });
        nextCard();
      }, 400);
    } else {
      setTimeout(nextCard, 450);
    }
  };

  const nextCard = () => {
    setCards(prev => [...prev.slice(1), prev[0]]);
    setSwipeDir(null);
    setDragX(0);
    setActivePhoto(0);
    setShowDetail(false);
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

  if (!currentCard) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <span className="text-6xl">🔄</span>
      <p className="text-white/50">Загружаем новые анкеты...</p>
    </div>
  );

  const rotation = dragging ? dragX * 0.08 : 0;
  const likeOpacity = Math.max(0, Math.min(1, dragX / 80));
  const nopeOpacity = Math.max(0, Math.min(1, -dragX / 80));

  return (
    <div className="flex h-[calc(100vh-130px)] md:h-[calc(100vh-81px)] overflow-hidden">

      {/* ── LEFT: Stories + Card stack ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Stories row */}
        <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide flex-shrink-0">
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center bg-white/5">
              <Icon name="Plus" size={20} className="text-white/40" />
            </div>
            <span className="text-white/40 text-[10px]">Моя</span>
          </div>
          {cards.slice(0, 7).map((card, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className="story-ring w-14 h-14">
                <img src={card.avatar} alt={card.name}
                  className="w-full h-full rounded-full object-cover border-2 border-background" />
              </div>
              <span className="text-white/50 text-[10px]">{card.name.split(" ")[0]}</span>
            </div>
          ))}
        </div>

        {/* Card stack */}
        <div className="flex-1 relative px-4 pb-2">
          {/* Background cards */}
          {cards.slice(1, 3).map((card, i) => (
            <div key={card.id} className="absolute inset-4 rounded-3xl overflow-hidden"
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

              {/* LIKE / NOPE indicators */}
              <div className="absolute top-12 left-6 rounded-2xl border-4 border-green-400 px-4 py-2 rotate-[-20deg] transition-opacity"
                style={{ opacity: likeOpacity }}>
                <span className="text-green-400 font-black text-2xl">LIKE</span>
              </div>
              <div className="absolute top-12 right-6 rounded-2xl border-4 border-red-400 px-4 py-2 rotate-[20deg] transition-opacity"
                style={{ opacity: nopeOpacity }}>
                <span className="text-red-400 font-black text-2xl">NOPE</span>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.2) 40%, transparent 60%)" }} />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                {/* Badges */}
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
                    <h2 className="text-white font-bold text-3xl">{currentCard.name}, {currentCard.age}</h2>
                    <div className="flex items-center gap-1 text-white/60 text-sm">
                      <Icon name="MapPin" size={13} />
                      <span>{currentCard.city}{currentCard.distance ? ` · ${currentCard.distance} км` : ""}</span>
                    </div>
                  </div>
                  <button onClick={() => setShowDetail(!showDetail)}
                    className="glass w-10 h-10 rounded-full flex items-center justify-center">
                    <Icon name="Info" size={18} className="text-white/70" />
                  </button>
                </div>

                {/* Bio / detail (mobile only — on desktop shown in sidebar) */}
                {showDetail && (
                  <div className="md:hidden animate-slide-up">
                    <p className="text-white/80 text-sm mb-3 leading-relaxed">{currentCard.bio}</p>
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

      {/* ── RIGHT: Profile detail panel (desktop only) ── */}
      <div className="hidden lg:flex flex-col w-80 xl:w-96 border-l border-white/5 overflow-y-auto flex-shrink-0">
        <div className="p-6">
          {/* Profile header */}
          <div className="flex items-center gap-3 mb-5">
            <img src={currentCard.avatar} alt={currentCard.name}
              className="w-14 h-14 rounded-2xl object-cover" />
            <div>
              <h3 className="text-white font-bold text-lg">{currentCard.name}, {currentCard.age}</h3>
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
              <span className="gradient-text font-black text-xl">{currentCard.matchScore || 87}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full btn-gradient rounded-full"
                style={{ width: `${currentCard.matchScore || 87}%` }} />
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4">
            <h4 className="text-white/40 text-xs uppercase tracking-wider mb-2">О себе</h4>
            <p className="text-white/70 text-sm leading-relaxed">{currentCard.bio}</p>
          </div>

          {/* Interests */}
          <div className="mb-4">
            <h4 className="text-white/40 text-xs uppercase tracking-wider mb-2">Интересы</h4>
            <div className="flex flex-wrap gap-2">
              {currentCard.interests.map(interest => (
                <span key={interest}
                  className="glass px-3 py-1 rounded-full text-xs text-white/70 border border-white/10">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: "Фото", value: currentCard.photos.length, icon: "Image" },
              { label: "Возраст", value: currentCard.age, icon: "Calendar" },
              { label: "км", value: currentCard.distance || "?", icon: "Navigation" },
            ].map((s, i) => (
              <div key={i} className="glass rounded-xl p-2.5 text-center">
                <Icon name={s.icon as never} size={14} className="text-white/40 mx-auto mb-1" />
                <div className="text-white font-bold text-sm">{s.value}</div>
                <div className="text-white/30 text-[10px]">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Photos grid */}
          <div className="mb-5">
            <h4 className="text-white/40 text-xs uppercase tracking-wider mb-2">Фотографии</h4>
            <div className="grid grid-cols-3 gap-2">
              {currentCard.photos.map((photo, i) => (
                <button key={i} onClick={() => setActivePhoto(i)}
                  className={`aspect-square rounded-xl overflow-hidden transition-all ${
                    activePhoto === i ? "ring-2 ring-pink-500" : "opacity-70 hover:opacity-100"
                  }`}>
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick actions */}
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
            <div className="flex justify-center gap-4 mb-6">
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
