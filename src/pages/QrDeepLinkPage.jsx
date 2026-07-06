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
      // Grab everything after the initial matched path segments
      const match = location.pathname.match(/\/(?:qr|qrcode|https?:\/+\/?t\.me(?:\/[^/]+\/[^/]+)?|t\.me(?:\/[^/]+\/[^/]+)?)\/(.+)/);
      if (match) {
        rawSecret = match[1];
      }
      
      // Also check query string just in case it fell through to search
      if (!rawSecret && location.search.includes('startapp=')) {
        const urlParams = new URLSearchParams(location.search);
        rawSecret = urlParams.get('startapp');
      }
    }

    const secret = extractSecret(rawSecret);

    if (!secret) {
      if (!canceled) navigate('/404', { replace: true });
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
