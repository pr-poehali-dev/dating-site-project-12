import { useState, useEffect } from "react";
import LandingPage from "@/components/spark/LandingPage";
import AuthPage from "@/components/spark/AuthPage";
import MainApp from "@/components/spark/MainApp";
import { User, AppScreen } from "@/types/spark";
import { api, getToken, clearToken } from "@/lib/api";

export default function Index() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Восстанавливаем сессию при загрузке
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setCheckingSession(false);
      return;
    }
    api.me()
      .then(data => {
        setCurrentUser(mapApiUser(data.user));
        setScreen('app');
      })
      .catch(() => {
        clearToken();
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setScreen('app');
  };

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    clearToken();
    setCurrentUser(null);
    setScreen('landing');
  };

  if (checkingSession) {
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

  return <MainApp user={currentUser} onLogout={handleLogout} />;
}

// Маппинг ответа API → тип User
export function mapApiUser(u: Record<string, unknown>): User {
  return {
    id: String(u.id),
    name: String(u.name || ""),
    age: Number(u.age || 0),
    avatar: String(u.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + u.id),
    bio: String(u.bio || ""),
    city: String(u.city || "Москва"),
    rating: Number(u.rating || 70),
    verified: Boolean(u.verified),
    premium: Boolean(u.premium),
    online: Boolean(u.online),
    interests: Array.isArray(u.interests) ? (u.interests as string[]) : [],
    photos: [String(u.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + u.id)],
    lastSeen: "недавно",
  };
}
