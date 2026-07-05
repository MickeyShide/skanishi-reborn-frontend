import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext.jsx';

export function useScanner() {
  const navigate = useNavigate();
  const { claimReward } = useAppState();

  const handleScan = async () => {
    const webApp = window.Telegram?.WebApp;

    if (webApp && webApp.showScanQrPopup) {
      webApp.showScanQrPopup({ text: 'Наведите камеру на QR-код секрета' }, (token) => {
        if (!token) return true;

        claimReward(token)
          .then(() => navigate('/result'))
          .catch((err) => alert(err.message || 'Ошибка сканирования'));

        return true; // closes the scanner
      });
      return;
    }

    // Fallback for local testing in browser
    const token = window.prompt('Введите токен из QR-кода (имитация камеры):');
    if (!token) return;
    
    try {
      await claimReward(token);
      navigate('/result');
    } catch (err) {
      alert(err.message || 'Ошибка сканирования');
    }
  };

  return { handleScan };
}
