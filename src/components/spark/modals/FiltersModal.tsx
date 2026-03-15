import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onClose: () => void;
}

export default function FiltersModal({ onClose }: Props) {
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(35);
  const [distance, setDistance] = useState(50);
  const [gender, setGender] = useState<"all" | "women" | "men">("women");
  const [showOnline, setShowOnline] = useState(false);
  const [showVerified, setShowVerified] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f0f1a] rounded-t-3xl md:rounded-3xl border border-white/10 overflow-hidden max-h-[85vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 sticky top-0 bg-[#0f0f1a] z-10">
          <div className="flex items-center gap-2">
            <Icon name="SlidersHorizontal" size={20} className="text-pink-400" />
            <h2 className="text-white font-bold text-lg">Фильтры поиска</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 glass rounded-full flex items-center justify-center">
            <Icon name="X" size={16} className="text-white/60" />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* Gender */}
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Показывать</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "women", label: "Девушки" },
                { id: "men", label: "Парни" },
                { id: "all", label: "Все" },
              ].map(g => (
                <button key={g.id}
                  onClick={() => setGender(g.id as typeof gender)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${gender === g.id ? "btn-gradient text-white" : "glass text-white/50 hover:bg-white/10"}`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-white/50 text-xs uppercase tracking-wider">Возраст</label>
              <span className="gradient-text font-bold text-sm">{ageMin} – {ageMax} лет</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-white/30 text-xs w-4">от</span>
                <input type="range" min={18} max={ageMax - 1} value={ageMin}
                  onChange={e => setAgeMin(+e.target.value)}
                  className="flex-1 accent-pink-500" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/30 text-xs w-4">до</span>
                <input type="range" min={ageMin + 1} max={60} value={ageMax}
                  onChange={e => setAgeMax(+e.target.value)}
                  className="flex-1 accent-pink-500" />
              </div>
            </div>
          </div>

          {/* Distance */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-white/50 text-xs uppercase tracking-wider">Расстояние</label>
              <span className="gradient-text font-bold text-sm">{distance} км</span>
            </div>
            <input type="range" min={1} max={200} value={distance}
              onChange={e => setDistance(+e.target.value)}
              className="w-full accent-pink-500" />
            <div className="flex justify-between text-white/20 text-xs mt-1">
              <span>1 км</span><span>200 км</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="glass rounded-2xl overflow-hidden">
            {[
              { label: "Только онлайн", sub: "Показывать только тех, кто сейчас онлайн", value: showOnline, set: setShowOnline },
              { label: "Только верифицированные", sub: "Анкеты со значком верификации", value: showVerified, set: setShowVerified },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0">
                <div className="flex-1">
                  <div className="text-white/80 text-sm">{item.label}</div>
                  <div className="text-white/30 text-xs">{item.sub}</div>
                </div>
                <button onClick={() => item.set(v => !v)}
                  className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 ${item.value ? "btn-gradient" : "bg-white/10"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${item.value ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={onClose}
            className="w-full btn-gradient text-white font-bold py-3.5 rounded-2xl">
            Применить фильтры
          </button>
        </div>
      </div>
    </div>
  );
}
