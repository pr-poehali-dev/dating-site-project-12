import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  city: string;
  onClose: () => void;
  onSave: (city: string) => void;
}

const CITIES = ["Москва", "Санкт-Петербург", "Екатеринбург", "Новосибирск", "Казань", "Нижний Новгород", "Краснодар", "Самара", "Уфа", "Челябинск"];

export default function LocationModal({ city, onClose, onSave }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(city);
  const [useGeo, setUseGeo] = useState(false);

  const filtered = CITIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  const handleGeo = () => {
    setUseGeo(true);
    setTimeout(() => {
      setSelected("Москва");
      setUseGeo(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f0f1a] rounded-t-3xl md:rounded-3xl border border-white/10 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Icon name="MapPin" size={20} className="text-pink-400" />
            <h2 className="text-white font-bold text-lg">Геолокация</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 glass rounded-full flex items-center justify-center">
            <Icon name="X" size={16} className="text-white/60" />
          </button>
        </div>

        <div className="p-5">
          {/* Auto geo */}
          <button onClick={handleGeo}
            className="w-full glass rounded-2xl p-4 flex items-center gap-3 mb-4 hover:bg-white/5 transition-all border border-white/10">
            {useGeo ? (
              <div className="w-9 h-9 btn-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <div className="w-9 h-9 btn-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="Navigation" size={16} className="text-white" />
              </div>
            )}
            <div className="text-left">
              <div className="text-white font-semibold text-sm">Определить автоматически</div>
              <div className="text-white/40 text-xs">Использовать GPS-геолокацию</div>
            </div>
          </button>

          {/* Search */}
          <div className="relative mb-3">
            <Icon name="Search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск города..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm outline-none focus:border-pink-500/50 transition-all placeholder:text-white/20"
            />
          </div>

          {/* City list */}
          <div className="glass rounded-2xl overflow-hidden max-h-52 overflow-y-auto mb-4">
            {filtered.map((c, i) => (
              <button key={i}
                onClick={() => setSelected(c)}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all border-b border-white/5 last:border-0 ${selected === c ? "bg-pink-500/10" : ""}`}>
                <span className={`text-sm ${selected === c ? "text-pink-400 font-medium" : "text-white/70"}`}>{c}</span>
                {selected === c && <Icon name="Check" size={15} className="text-pink-400" />}
              </button>
            ))}
          </div>

          <button onClick={() => { onSave(selected); onClose(); }}
            className="w-full btn-gradient text-white font-bold py-3.5 rounded-2xl">
            Сохранить — {selected}
          </button>
        </div>
      </div>
    </div>
  );
}
