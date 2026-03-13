import { useState } from "react";
import Icon from "@/components/ui/icon";
import { User } from "@/types/spark";
import { CURRENT_USER } from "@/data/mockData";

interface Props {
  mode: 'login' | 'register';
  onSuccess: (user: User) => void;
  onBack: () => void;
  onSwitchMode: () => void;
}

const INTERESTS = ["Путешествия", "Музыка", "Кино", "Спорт", "Кулинария", "Йога", "Книги", "Арт", "Технологии", "Природа", "Фотография", "Танцы"];

export default function AuthPage({ mode, onSuccess, onBack, onSwitchMode }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", age: "", city: "Москва", bio: "" });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Заполните все поля");
      return;
    }
    if (mode === 'register' && step < 3) {
      setStep(s => s + 1);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        ...CURRENT_USER,
        name: form.name || "Максим",
        age: parseInt(form.age) || 27,
        bio: form.bio || CURRENT_USER.bio,
        interests: selectedInterests.length > 0 ? selectedInterests : CURRENT_USER.interests,
      });
    }, 1500);
  };

  const isRegister = mode === 'register';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #FF3D6E, transparent 70%)" }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6 animate-slide-up">
        {/* Back */}
        <button onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <Icon name="ArrowLeft" size={18} />
          <span className="text-sm">Назад</span>
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center">
              <span className="text-white text-2xl">⚡</span>
            </div>
          </div>
          <h1 className="font-caveat text-4xl font-bold gradient-text mb-1">Spark</h1>
          <p className="text-white/50 text-sm">
            {isRegister ? "Создай аккаунт и начни знакомиться" : "Рады снова видеть тебя"}
          </p>
        </div>

        {/* Progress for register */}
        {isRegister && (
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
                <div className="h-full btn-gradient transition-all duration-500"
                  style={{ width: step >= s ? "100%" : "0%" }} />
              </div>
            ))}
          </div>
        )}

        <div className="glass rounded-3xl p-8">
          {/* Step 1: Credentials */}
          {(!isRegister || step === 1) && (
            <div className="space-y-4 animate-fade-in">
              {isRegister && (
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Имя</label>
                  <input
                    type="text"
                    placeholder="Твоё имя"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 outline-none focus:border-pink-500/50 transition-all"
                  />
                </div>
              )}
              <div>
                <label className="text-white/70 text-sm mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder="твой@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 outline-none focus:border-pink-500/50 transition-all"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-2 block">Пароль</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 outline-none focus:border-pink-500/50 transition-all"
                />
              </div>
            </div>
          )}

          {/* Step 2: Profile info */}
          {isRegister && step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-2">
                <h3 className="text-white font-bold text-xl">Расскажи о себе</h3>
                <p className="text-white/50 text-sm">Это поможет найти лучших людей</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Возраст</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={form.age}
                    onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 outline-none focus:border-pink-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Город</label>
                  <input
                    type="text"
                    placeholder="Москва"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 outline-none focus:border-pink-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-2 block">О себе</label>
                <textarea
                  placeholder="Расскажи что-нибудь интересное о себе..."
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 outline-none focus:border-pink-500/50 transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {isRegister && step === 3 && (
            <div className="animate-fade-in">
              <div className="text-center mb-4">
                <h3 className="text-white font-bold text-xl">Твои интересы</h3>
                <p className="text-white/50 text-sm">Выбери минимум 3</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedInterests.includes(interest)
                        ? "btn-gradient text-white"
                        : "glass text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 btn-gradient text-white font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isRegister && step < 3 ? "Далее" : isRegister ? "Создать аккаунт" : "Войти"}
                <Icon name="ArrowRight" size={18} />
              </>
            )}
          </button>

          {/* Social auth */}
          <div className="mt-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-sm">или</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="glass rounded-2xl py-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                <span className="text-lg">🇬</span>
                <span className="text-white/70 text-sm">Google</span>
              </button>
              <button className="glass rounded-2xl py-3 flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                <span className="text-lg">📱</span>
                <span className="text-white/70 text-sm">Телефон</span>
              </button>
            </div>
          </div>

          <p className="text-center text-white/40 text-sm mt-5">
            {isRegister ? "Уже есть аккаунт? " : "Нет аккаунта? "}
            <button onClick={onSwitchMode} className="text-pink-400 hover:text-pink-300 transition-colors">
              {isRegister ? "Войти" : "Зарегистрироваться"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
