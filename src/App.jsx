import { useCallback } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppStateProvider, useAppState } from './context/AppStateContext.jsx';
import { useTelegram, useTelegramBackButton } from './hooks/useTelegram.js';
import { AchievementsPage } from './pages/AchievementsPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { MapPage } from './pages/MapPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { PointDetailPage } from './pages/PointDetailPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { QuestsPage } from './pages/QuestsPage.jsx';
import { ScanResultPage } from './pages/ScanResultPage.jsx';
import { SplashPage } from './pages/SplashPage.jsx';
import { XpHistoryPage } from './pages/XpHistoryPage.jsx';
import { QrDeepLinkPage } from './pages/QrDeepLinkPage.jsx';
import { EmptyState, LoadingState, PrimaryButton, Screen } from './components/ui.jsx';

const BACK_TARGETS = {
  '/result': '/home',
  '/xp': '/profile',
  '/achievements': '/profile',
};

function BackButtonBridge() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const visible = path.startsWith('/point/') || Boolean(BACK_TARGETS[path]);

  const handleBack = useCallback(() => {
    if (path.startsWith('/point/')) {
      navigate('/map');
      return;
    }

    navigate(BACK_TARGETS[path] ?? '/home');
  }, [navigate, path]);

  useTelegramBackButton(visible, handleBack);
  return null;
}

function ErrorScreen({ message }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppState();

  return (
    <Screen>
      <div className="safe-page-x flex flex-1 flex-col justify-center gap-4">
        <EmptyState title="Ошибка синхронизации" text={message || 'Не удалось получить данные. Попробуй открыть приложение заново.'} />
        <PrimaryButton onClick={() => navigate(isAuthenticated ? '/home' : '/login')}>Повторить</PrimaryButton>
      </div>
    </Screen>
  );
}

function AppRoutes() {
  const { isLoading, error, isAuthenticated } = useAppState();
  const location = useLocation();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorScreen message={error} />;

  const RequireAuth = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
  };

  return (
    <>
      <BackButtonBridge />
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />} />
        <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/map" element={<RequireAuth><MapPage /></RequireAuth>} />
        <Route path="/point/:pointId" element={<RequireAuth><PointDetailPage /></RequireAuth>} />
        <Route path="/qr" element={<RequireAuth><QrDeepLinkPage /></RequireAuth>} />
        <Route path="/qr/*" element={<RequireAuth><QrDeepLinkPage /></RequireAuth>} />
        <Route path="/result" element={<RequireAuth><ScanResultPage /></RequireAuth>} />
        <Route path="/quests" element={<RequireAuth><QuestsPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/xp" element={<RequireAuth><XpHistoryPage /></RequireAuth>} />
        <Route path="/achievements" element={<RequireAuth><AchievementsPage /></RequireAuth>} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

function AppShell() {
  useTelegram();

  return (
    <div className="app-shell">
      <AppRoutes />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppStateProvider>
        <AppShell />
      </AppStateProvider>
    </HashRouter>
  );
}
