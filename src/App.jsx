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

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <>
      <BackButtonBridge />
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />} />
        <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} />
        <Route path="/map" element={isAuthenticated ? <MapPage /> : <Navigate to="/login" replace />} />
        <Route path="/point/:pointId" element={isAuthenticated ? <PointDetailPage /> : <Navigate to="/login" replace />} />
        <Route path="/result" element={isAuthenticated ? <ScanResultPage /> : <Navigate to="/login" replace />} />
        <Route path="/quests" element={isAuthenticated ? <QuestsPage /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
        <Route path="/xp" element={isAuthenticated ? <XpHistoryPage /> : <Navigate to="/login" replace />} />
        <Route path="/achievements" element={isAuthenticated ? <AchievementsPage /> : <Navigate to="/login" replace />} />
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
