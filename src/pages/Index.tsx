import { useState, useEffect } from "react";
import LandingPage from "@/components/spark/LandingPage";
import AuthPage from "@/components/spark/AuthPage";
import MainApp from "@/components/spark/MainApp";
import { User, AppScreen } from "@/types/spark";
import { api, getToken, clearToken, getCachedUser, setCachedUser } from "@/lib/api";

export function mapApiUser(u: Record<string, unknown>): User {
  const avatar = String(u.avatar || "");
  const fallback = `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`;
  return {
    id: String(u.id),
    name: String(u.name || ""),
    age: Number(u.age || 0),
    avatar: avatar || fallback,
    bio: String(u.bio || ""),
    city: String(u.city || "Москва"),
    rating: Number(u.rating || 70),
    verified: Boolean(u.verified),
    premium: Boolean(u.premium),
    online: Boolean(u.online),
    interests: Array.isArray(u.interests) ? (u.interests as string[]) : [],
    photos: [avatar || fallback],
    lastSeen: "недавно",
  };
}

export default function Index() {
  const token = getToken();
  const cached = getCachedUser();

  // Если есть токен + кеш — сразу показываем приложение без мигания
  const [screen, setScreen] = useState<AppScreen>(
    token && cached ? 'app' : 'landing'
  );
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(
    token && cached ? mapApiUser(cached) : null
  );
  const [checkingSession, setCheckingSession] = useState(!!token);

  useEffect(() => {
    if (!token) return;

    // Фоновая проверка — обновляем данные с сервера
    api.me()
      .then(data => {
        const user = mapApiUser(data.user);
        setCachedUser(data.user);
        setCurrentUser(user);
        setScreen('app');
      })
      .catch(() => {
        // Токен протух — разлогиниваем
        clearToken();
        setCurrentUser(null);
        setScreen('landing');
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLogin = (user: User, rawUser: Record<string, unknown>) => {
    setCachedUser(rawUser);
    setCurrentUser(user);
    setScreen('app');
  };

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    clearToken();
    setCurrentUser(null);
    setScreen('landing');
  };

  const handleUserUpdate = (user: User, rawUser: Record<string, unknown>) => {
    setCachedUser(rawUser);
    setCurrentUser(user);
  };

  // Только первая загрузка без кеша — показываем спиннер
  if (checkingSession && !cached) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center animate-pulse">
            <span className="text-white text-2xl">⚡</span>
          </div>
          <p className="text-white/40 text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (screen === 'landing') {
    return (
      <LandingPage
        onLogin={() => { setAuthMode('login'); setScreen('auth'); }}
        onRegister={() => { setAuthMode('register'); setScreen('auth'); }}
      />
    );
  }

  if (screen === 'auth') {
    return (
      <AuthPage
        mode={authMode}
        onSuccess={handleLogin}
        onBack={() => setScreen('landing')}
        onSwitchMode={() => setAuthMode(m => m === 'login' ? 'register' : 'login')}
      />
    );
  }

  return (
    <MainApp
      user={currentUser}
      onLogout={handleLogout}
      onUserUpdate={handleUserUpdate}
    />
  );
}
