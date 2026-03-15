import Icon from "@/components/ui/icon";

interface Props {
  onClose: () => void;
}

const features = [
  { icon: "Heart", text: "Безлимитные лайки" },
  { icon: "Zap", text: "Безлимитные суперлайки" },
  { icon: "TrendingUp", text: "Приоритетный показ" },
  { icon: "Eye", text: "Кто смотрел профиль" },
  { icon: "Rewind", text: "Отмена последнего свайпа" },
  { icon: "Globe", text: "Смена города поиска" },
];

const plans = [
  { id: "month", label: "1 месяц", price: "799 ₽", per: "в месяц", popular: false },
  { id: "3month", label: "3 месяца", price: "499 ₽", per: "в месяц", badge: "−37%", popular: true },
  { id: "year", label: "12 месяцев", price: "299 ₽", per: "в месяц", badge: "−63%", popular: false },
];

export default function PremiumModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f0f1a] rounded-t-3xl md:rounded-3xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="relative h-40 flex flex-col items-center justify-center animate-gradient-shift"
          style={{ background: "linear-gradient(135deg, #FF3D6E, #8B5CF6, #FF7A40)" }}>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 glass rounded-full flex items-center justify-center">
            <Icon name="X" size={16} className="text-white" />
          </button>
          <Icon name="Crown" size={40} className="text-yellow-300 mb-2" />
          <h2 className="text-white font-bold text-2xl">Spark Premium</h2>
          <p className="text-white/70 text-sm">Разблокируй все возможности</p>
        </div>

        <div className="p-5">
          {/* Features */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {features.map((f, i) => (
              <div key={i} className="glass rounded-2xl px-3 py-2.5 flex items-center gap-2">
                <div className="w-7 h-7 btn-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={f.icon as never} size={14} className="text-white" />
                </div>
                <span className="text-white/80 text-xs">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Plans */}
          <div className="space-y-2.5 mb-5">
            {plans.map(plan => (
              <div key={plan.id}
                className={`relative glass rounded-2xl p-4 border cursor-pointer transition-all hover:bg-white/5 ${plan.popular ? "border-pink-500/50 bg-pink-500/5" : "border-white/10"}`}>
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 btn-gradient text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                    ПОПУЛЯРНЫЙ
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold text-sm">{plan.label}</div>
                    <div className="text-white/40 text-xs">{plan.per}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.badge && (
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/30">
                        {plan.badge}
                      </span>
                    )}
                    <span className={`font-bold text-lg ${plan.popular ? "gradient-text" : "text-white"}`}>
                      {plan.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full btn-gradient text-white font-bold py-4 rounded-2xl text-base hover:opacity-90 transition-opacity">
            Попробовать бесплатно 7 дней
          </button>
          <p className="text-white/20 text-xs text-center mt-2">Отмена в любой момент. Без списаний до окончания пробного периода.</p>
        </div>
      </div>
    </div>
  );
}
