import { useState } from "react";
import Icon from "@/components/ui/icon";
import { User } from "@/types/spark";
import { api, setToken } from "@/lib/api";
import { mapApiUser } from "@/pages/Index";

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

  const handleSubmit = async () => {
    setError("");

    if (mode === 'register') {
      if (step === 1) {
        if (!form.name || !form.email || !form.password) { setError("Заполните все поля"); return; }
        if (form.password.length < 6) { setError("Пароль — минимум 6 символов"); return; }
        setStep(2);
        return;
      }
      if (step === 2) {
        setStep(3);
        return;
      }
      // Step 3 — финальная регистрация
      setLoading(true);
      try {
        const data = await api.register({
          email: form.email,
          password: form.password,
          name: form.name,
          age: form.age ? parseInt(form.age) : undefined,
          city: form.city,
          bio: form.bio,
          interests: selectedInterests,
        });
        setToken(data.token);
        onSuccess(mapApiUser(data.user));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Ошибка регистрации");
      } finally {
        setLoading(false);
      }
      return;
    }

    // LOGIN
    if (!form.email || !form.password) { setError("Заполните все поля"); return; }
    setLoading(true);
    try {
      const data = await api.login(form.email, form.password);
      setToken(data.token);
      onSuccess(mapApiUser(data.user));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
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

      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-8 animate-slide-up">
        {/* Back */}
        <button onClick={step > 1 ? () => setStep(s => s - 1) : onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <Icon name="ArrowLeft" size={18} />
          <span className="text-sm">{step > 1 ? "Назад" : "На главную"}</span>
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
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
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
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
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
              <div className="flex flex-wrap gap-2 mb-2">
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
              <p className="text-white/30 text-xs text-center mt-2">
                Выбрано: {selectedInterests.length}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 glass rounded-xl px-4 py-3 border border-red-500/30 animate-fade-in">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-gradient text-white font-semibold py-4 rounded-2xl mt-6 flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{mode === 'login' ? "Входим..." : "Создаём профиль..."}</span>
              </>
            ) : (
              <>
                <Icon name={isRegister && step < 3 ? "ArrowRight" : "Zap"} size={18} />
                <span>
                  {!isRegister ? "Войти" : step < 3 ? "Далее" : "Создать аккаунт"}
                </span>
              </>
            )}
          </button>

          {/* Switch mode */}
          <div className="text-center mt-5">
            <span className="text-white/40 text-sm">
              {isRegister ? "Уже есть аккаунт? " : "Нет аккаунта? "}
            </span>
            <button onClick={onSwitchMode}
              className="text-pink-400 hover:text-pink-300 text-sm font-medium transition-colors">
              {isRegister ? "Войти" : "Зарегистрироваться"}
            </button>
          </div>
        </div>

        {/* Social auth hint */}
        <div className="mt-6 text-center">
          <p className="text-white/20 text-xs">
            Регистрируясь, ты соглашаешься с условиями использования
          </p>
        </div>
      </div>
    </div>
  );
}
