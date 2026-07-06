import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Screen, LoadingState } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';
import { extractSecret } from '../utils/api.js';

export function QrDeepLinkPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { claimReward } = useAppState();

  useEffect(() => {
    let canceled = false;
    const webApp = window.Telegram?.WebApp;
    // Telegram start_param (from ?startapp=...) takes precedence
    let rawSecret = webApp?.initDataUnsafe?.start_param || '';

    if (!rawSecret) {
      const match = location.pathname.match(/\/qr\/(.+)/);
      if (match) {
        rawSecret = match[1];
      }
    }

    const secret = extractSecret(rawSecret);

    if (!secret) {
      if (!canceled) navigate('/home', { replace: true });
      return;
    }

    claimReward(secret)
      .then(() => {
        if (!canceled) navigate('/result', { replace: true });
      })
      .catch((err) => {
        if (!canceled) {
          alert(err.message || 'Ошибка сканирования');
          navigate('/home', { replace: true });
        }
      });

    return () => {
      canceled = true;
    };
  }, [claimReward, navigate, location.pathname]);

  return <LoadingState />;
}
