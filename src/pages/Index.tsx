import { useState } from "react";
import LandingPage from "@/components/spark/LandingPage";
import AuthPage from "@/components/spark/AuthPage";
import MainApp from "@/components/spark/MainApp";
import { User, AppScreen } from "@/types/spark";

export default function Index() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setScreen('app');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setScreen('landing');
  };

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