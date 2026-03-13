import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { PROFILE_IMAGES } from "@/data/mockData";

interface Props {
  onLogin: () => void;
  onRegister: () => void;
}

const features = [
  { icon: "MapPin", title: "Геолокация", desc: "Находи людей рядом с тобой" },
  { icon: "ShieldCheck", title: "Верификация", desc: "Только реальные профили" },
  { icon: "Star", title: "Рейтинг", desc: "Умный алгоритм совместимости" },
  { icon: "Sparkles", title: "Рекомендации", desc: "ИИ подбирает твою пару" },
  { icon: "Crown", title: "Премиум", desc: "Безлимитные лайки и суперлайки" },
  { icon: "Shield", title: "Модерация", desc: "Безопасная среда 24/7" },
];

const stats = [
  { value: "2М+", label: "Пользователей" },
  { value: "150К+", label: "Пар нашли друг друга" },
  { value: "98%", label: "Реальных профилей" },
];

export default function LandingPage({ onLogin, onRegister }: Props) {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveCard(p => (p + 1) % 3), 3000);
    return () => clearInterval(t);
  }, []);

  const cards = [
    { img: PROFILE_IMAGES.anna, name: "Анна, 25", city: "Москва", match: 94 },
    { img: PROFILE_IMAGES.kate, name: "Катя, 23", city: "Москва", match: 88 },
    { img: PROFILE_IMAGES.masha, name: "Маша, 26", city: "Москва", match: 92 },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FF3D6E, transparent 70%)" }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }} />
        <div className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FF7A40, transparent 70%)" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center">
            <span className="text-white text-lg">⚡</span>
          </div>
          <span className="font-caveat text-2xl font-bold gradient-text">Spark</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLogin}
            className="px-5 py-2.5 rounded-xl glass text-white text-sm font-medium hover:bg-white/10 transition-all">
            Войти
          </button>
          <button onClick={onRegister}
            className="px-5 py-2.5 rounded-xl btn-gradient text-white text-sm font-semibold">
            Начать бесплатно
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-ping-slow" />
            <span className="text-sm text-white/70">Более 2 миллионов пользователей</span>
          </div>

          <h1 className="font-golos font-black text-6xl lg:text-7xl leading-tight mb-6 text-white">
            Найди свою{" "}
            <span className="gradient-text font-caveat text-7xl lg:text-8xl">искру</span>
          </h1>
          <p className="text-white/60 text-xl mb-10 leading-relaxed max-w-lg">
            Умный алгоритм подбора, верифицированные профили и безопасная среда для настоящих знакомств
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <button onClick={onRegister}
              className="btn-gradient text-white font-semibold px-8 py-4 rounded-2xl text-lg flex items-center gap-2">
              <Icon name="Zap" size={20} />
              Начать знакомства
            </button>
            <button onClick={onLogin}
              className="glass text-white font-medium px-8 py-4 rounded-2xl text-lg hover:bg-white/10 transition-all border border-white/10">
              Уже есть аккаунт
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="font-black text-2xl gradient-text">{s.value}</div>
                <div className="text-white/50 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card deck preview */}
        <div className="relative flex justify-center animate-float">
          <div className="relative w-72 h-[480px]">
            {cards.map((card, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-3xl overflow-hidden transition-all duration-700 cursor-pointer"
                style={{
                  transform: i === activeCard
                    ? "rotate(0deg) translateY(0)"
                    : i === (activeCard + 1) % 3
                    ? "rotate(-3deg) translateY(8px) scale(0.96)"
                    : "rotate(3deg) translateY(16px) scale(0.92)",
                  zIndex: i === activeCard ? 3 : i === (activeCard + 1) % 3 ? 2 : 1,
                  opacity: i === activeCard ? 1 : i === (activeCard + 1) % 3 ? 0.8 : 0.6,
                }}
                onClick={() => setActiveCard(i)}
              >
                <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)"
                }} />
                <div className="absolute bottom-6 left-5 right-5">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <h3 className="text-white font-bold text-2xl">{card.name}</h3>
                      <div className="flex items-center gap-1 text-white/70 text-sm">
                        <Icon name="MapPin" size={12} />
                        <span>{card.city}</span>
                      </div>
                    </div>
                    <div className="glass rounded-2xl px-3 py-1.5 text-center">
                      <div className="gradient-text font-black text-lg">{card.match}%</div>
                      <div className="text-white/60 text-xs">совп.</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-3 rounded-xl glass text-white font-medium text-sm flex items-center justify-center gap-1 hover:bg-red-500/30 transition-all">
                      <Icon name="X" size={16} />
                    </button>
                    <button className="flex-1 py-3 rounded-xl btn-gradient text-white font-medium text-sm flex items-center justify-center gap-1">
                      <Icon name="Heart" size={16} />
                    </button>
                  </div>
                </div>
                {i === activeCard && (
                  <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-white text-xs">онлайн</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Floating badges */}
          <div className="absolute -left-8 top-20 glass rounded-2xl p-3 animate-float" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💥</span>
              <div>
                <div className="text-white font-bold text-sm">Новый матч!</div>
                <div className="text-white/50 text-xs">Анна понравилась тебе</div>
              </div>
            </div>
          </div>
          <div className="absolute -right-6 bottom-32 glass rounded-2xl p-3 animate-float" style={{ animationDelay: "1.5s" }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="text-white font-bold text-sm">Суперлайк</div>
                <div className="text-white/50 text-xs">Тебя заметили</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-golos font-black text-4xl text-white mb-3">
            Почему выбирают <span className="gradient-text">Spark</span>
          </h2>
          <p className="text-white/50 text-lg">Всё для настоящих знакомств</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:bg-white/10 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon name={f.icon as never} size={24} className="text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-white/50 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="glass rounded-3xl p-12 card-glow relative overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ background: "linear-gradient(135deg, #FF3D6E, #8B5CF6, #FF7A40)", backgroundSize: "200% 200%", animation: "gradient-shift 4s ease infinite" }} />
          <div className="relative z-10">
            <h2 className="font-golos font-black text-4xl text-white mb-4">
              Готов найти свою искру? ⚡
            </h2>
            <p className="text-white/70 text-lg mb-8">Регистрация бесплатная. Начни прямо сейчас.</p>
            <button onClick={onRegister}
              className="btn-gradient text-white font-bold px-10 py-4 rounded-2xl text-xl">
              Создать профиль бесплатно
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
