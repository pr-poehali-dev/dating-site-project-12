import Icon from "@/components/ui/icon";

interface Props {
  onClose: () => void;
  onUpgrade: () => void;
}

const MOCK_LIKES = [
  { name: "Соня", age: 22, city: "Москва", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200", blurred: false },
  { name: "???", age: 0, city: "???", avatar: "", blurred: true },
  { name: "???", age: 0, city: "???", avatar: "", blurred: true },
  { name: "???", age: 0, city: "???", avatar: "", blurred: true },
  { name: "???", age: 0, city: "???", avatar: "", blurred: true },
  { name: "???", age: 0, city: "???", avatar: "", blurred: true },
];

export default function LikesModal({ onClose, onUpgrade }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f0f1a] rounded-t-3xl md:rounded-3xl border border-white/10 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Icon name="Heart" size={20} className="text-pink-400" />
            <h2 className="text-white font-bold text-lg">Лайки от других</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 glass rounded-full flex items-center justify-center">
            <Icon name="X" size={16} className="text-white/60" />
          </button>
        </div>

        {/* Stats */}
        <div className="px-5 py-3 border-b border-white/5">
          <div className="flex items-center gap-1.5 text-white/50 text-sm">
            <Icon name="Heart" size={14} className="text-pink-400" />
            <span>Тебя лайкнули <span className="gradient-text font-bold">24 человека</span> за эту неделю</span>
          </div>
        </div>

        <div className="p-5">
          {/* Premium lock banner */}
          <div className="glass rounded-2xl p-4 mb-4 border border-yellow-500/20 bg-yellow-500/5 flex items-center gap-3">
            <Icon name="Crown" size={22} className="text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">Узнай, кто лайкнул тебя</div>
              <div className="text-white/40 text-xs">С Premium видны все анкеты сразу</div>
            </div>
            <button onClick={onUpgrade}
              className="btn-gradient text-white text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0">
              Premium
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {MOCK_LIKES.map((v, i) => (
              <div key={i} className={`relative rounded-2xl overflow-hidden aspect-square ${v.blurred ? "opacity-70" : ""}`}>
                {v.blurred ? (
                  <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex flex-col items-center justify-center gap-1 border border-white/10">
                    <Icon name="Lock" size={20} className="text-white/30" />
                    <span className="text-white/30 text-[10px]">Скрыто</span>
                  </div>
                ) : (
                  <>
                    <img src={v.avatar} alt={v.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <div className="text-white font-semibold text-xs">{v.name}, {v.age}</div>
                    </div>
                    <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                      <Icon name="Heart" size={12} className="text-white" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
