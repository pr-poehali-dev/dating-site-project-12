import Icon from "@/components/ui/icon";

interface Props {
  onClose: () => void;
  onUpgrade: () => void;
}

const MOCK_VIEWERS = [
  { name: "Алина", age: 24, city: "Москва", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", time: "5 мин назад", blurred: false },
  { name: "???", age: 0, city: "???", avatar: "", time: "12 мин назад", blurred: true },
  { name: "???", age: 0, city: "???", avatar: "", time: "1 час назад", blurred: true },
  { name: "???", age: 0, city: "???", avatar: "", time: "3 часа назад", blurred: true },
  { name: "???", age: 0, city: "???", avatar: "", time: "Вчера", blurred: true },
];

export default function ViewersModal({ onClose, onUpgrade }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f0f1a] rounded-t-3xl md:rounded-3xl border border-white/10 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Icon name="Eye" size={20} className="text-purple-400" />
            <h2 className="text-white font-bold text-lg">Кто смотрел профиль</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 glass rounded-full flex items-center justify-center">
            <Icon name="X" size={16} className="text-white/60" />
          </button>
        </div>

        {/* Stats */}
        <div className="px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-1.5 text-white/50 text-sm">
            <Icon name="Eye" size={14} />
            <span>Твой профиль посмотрели <span className="gradient-text font-bold">89 человек</span> за эту неделю</span>
          </div>
        </div>

        <div className="p-5">
          {/* Premium lock banner */}
          <div className="glass rounded-2xl p-4 mb-4 border border-yellow-500/20 bg-yellow-500/5 flex items-center gap-3">
            <Icon name="Crown" size={22} className="text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">Разблокируй всех</div>
              <div className="text-white/40 text-xs">С Premium видны все, кто смотрел</div>
            </div>
            <button onClick={onUpgrade}
              className="btn-gradient text-white text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0">
              Premium
            </button>
          </div>

          <div className="space-y-2">
            {MOCK_VIEWERS.map((v, i) => (
              <div key={i} className={`glass rounded-2xl p-3 flex items-center gap-3 ${v.blurred ? "opacity-60" : ""}`}>
                <div className="relative flex-shrink-0">
                  {v.blurred ? (
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 backdrop-blur-sm flex items-center justify-center">
                        <Icon name="Lock" size={16} className="text-white/40" />
                      </div>
                    </div>
                  ) : (
                    <img src={v.avatar} alt={v.name} className="w-12 h-12 rounded-xl object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{v.blurred ? "???" : `${v.name}, ${v.age}`}</div>
                  <div className="text-white/30 text-xs">{v.blurred ? "Скрыто" : v.city}</div>
                </div>
                <span className="text-white/30 text-xs flex-shrink-0">{v.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
