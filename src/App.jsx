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
import { InventoryPage } from './pages/InventoryPage.jsx';
import { LeaderboardPage } from './pages/LeaderboardPage.jsx';
import { FriendsPage } from './pages/FriendsPage.jsx';
import { ShopPage } from './pages/ShopPage.jsx';
import { EventsPage } from './pages/EventsPage.jsx';
import { CollectionsPage } from './pages/CollectionsPage.jsx';
import { QuestsPage } from './pages/QuestsPage.jsx';
import { ScanResultPage } from './pages/ScanResultPage.jsx';
import { SplashPage } from './pages/SplashPage.jsx';
import { XpHistoryPage } from './pages/XpHistoryPage.jsx';
import { QrDeepLinkPage } from './pages/QrDeepLinkPage.jsx';
import { UgcPage } from './pages/UgcPage.jsx';
import { EmptyState, LoadingState, PrimaryButton, Screen } from './components/ui.jsx';

const BACK_TARGETS = {
  '/result': '/home',
  '/xp': '/profile',
  '/achievements': '/profile',
  '/inventory': '/profile',
  '/collections': '/profile',
  '/leaderboard': '/profile',
  '/friends': '/profile',
  '/shop': '/profile',
  '/ugc': '/profile',
  '/events': '/home',
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

function RequireAuth({ children, location, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

function AppRoutes() {
  const { isLoading, error, isAuthenticated } = useAppState();
  const location = useLocation();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorScreen message={error} />;

  const wrapAuth = (element) => (
    <RequireAuth isAuthenticated={isAuthenticated} location={location}>
      {element}
    </RequireAuth>
  );

  return (
    <>
      <BackButtonBridge />
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />} />
        <Route path="/home" element={wrapAuth(<HomePage />)} />
        <Route path="/map" element={wrapAuth(<MapPage />)} />
        <Route path="/point/:pointId" element={wrapAuth(<PointDetailPage />)} />
        <Route path="/qr" element={wrapAuth(<QrDeepLinkPage />)} />
        <Route path="/qr/*" element={wrapAuth(<QrDeepLinkPage />)} />
        <Route path="/qrcode" element={wrapAuth(<QrDeepLinkPage />)} />
        <Route path="/qrcode/*" element={wrapAuth(<QrDeepLinkPage />)} />
        <Route path="/t.me/*" element={wrapAuth(<QrDeepLinkPage />)} />
        <Route path="/http:/*" element={wrapAuth(<QrDeepLinkPage />)} />
        <Route path="/https:/*" element={wrapAuth(<QrDeepLinkPage />)} />
        <Route path="/result" element={wrapAuth(<ScanResultPage />)} />
        <Route path="/quests" element={wrapAuth(<QuestsPage />)} />
        <Route path="/leaderboard" element={wrapAuth(<LeaderboardPage />)} />
        <Route path="/friends" element={wrapAuth(<FriendsPage />)} />
        <Route path="/shop" element={wrapAuth(<ShopPage />)} />
        <Route path="/events" element={wrapAuth(<EventsPage />)} />
        <Route path="/profile" element={wrapAuth(<ProfilePage />)} />
        <Route path="/inventory" element={wrapAuth(<InventoryPage />)} />
        <Route path="/collections" element={wrapAuth(<CollectionsPage />)} />
        <Route path="/xp" element={wrapAuth(<XpHistoryPage />)} />
        <Route path="/achievements" element={wrapAuth(<AchievementsPage />)} />
        <Route path="/ugc" element={wrapAuth(<UgcPage />)} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={wrapAuth(<QrDeepLinkPage />)} />
      </Routes>
    </>
  );
}

import { useSSE } from './hooks/useSSE.js';
import { ToastProvider } from './context/ToastContext.jsx';

function AppShell() {
  useTelegram();
  useSSE();

  return (
    <div className="app-shell">
      <AppRoutes />
    </div>
  );
}

export default function App() {
  console.log('App loaded - Vite HMR trigger');
  return (
    <HashRouter>
      <AppStateProvider>
        <ToastProvider>
          <AppShell />
        </ToastProvider>
      </AppStateProvider>
    </HashRouter>
  );
}
