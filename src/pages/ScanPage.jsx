import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon.jsx';
import { Screen } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';

function Corner({ position }) {
  const base = 'absolute h-[34px] w-[34px] border-[3px] border-sk-cyan drop-shadow-[0_0_6px_rgb(var(--color-cyan))]';
  const positions = {
    tl: 'left-0 top-0 rounded-tl-lg border-b-0 border-r-0',
    tr: 'right-0 top-0 rounded-tr-lg border-b-0 border-l-0',
    bl: 'bottom-0 left-0 rounded-bl-lg border-r-0 border-t-0',
    br: 'bottom-0 right-0 rounded-br-lg border-l-0 border-t-0',
  };

  return <div className={`${base} ${positions[position]}`} />;
}

export function ScanPage() {
  const navigate = useNavigate();
  const { claimReward } = useAppState();
  const [isLocalClaiming, setIsLocalClaiming] = useState(false);

  const handleSimulateScan = async () => {
    if (isLocalClaiming) return;
    
    const webApp = window.Telegram?.WebApp;

    if (webApp && webApp.showScanQrPopup) {
      webApp.showScanQrPopup({ text: 'Наведите камеру на QR-код секрета' }, (token) => {
        if (!token) return true;

        setIsLocalClaiming(true);
        claimReward(token)
          .then(() => navigate('/result'))
          .catch((err) => alert(err.message || 'Ошибка сканирования'))
          .finally(() => setIsLocalClaiming(false));

        return true; // closes the scanner
      });
      return;
    }

    // Fallback for local testing in browser
    const token = window.prompt('Введите токен из QR-кода (имитация камеры):');
    if (!token) return;
    
    setIsLocalClaiming(true);
    try {
      await claimReward(token);
      navigate('/result');
    } catch (err) {
      alert(err.message || 'Ошибка сканирования');
    } finally {
      setIsLocalClaiming(false);
    }
  };

  return (
    <Screen glow={false}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,#1a1830,#0a0912_72%)]">
        <div className="stripes absolute inset-0 opacity-35" />
        <div className="grid-bg absolute inset-0 opacity-50" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,18,0.7),transparent_22%,transparent_70%,rgba(10,9,18,0.92))]" />

      <div className="safe-page-x relative z-[5] flex items-center justify-between pt-[calc(var(--safe-area-top)+56px)]">
        <button
          type="button"
          onClick={() => navigate('/home')}
          aria-label="Закрыть сканер"
          className="glass flex h-[38px] w-[38px] items-center justify-center rounded-xl text-sk-text backdrop-blur-lg"
        >
          <Icon name="plus" size={20} color="rgb(var(--color-text))" sw={2} />
        </button>
        <div className="flex items-center gap-2 rounded-full border border-sk-cyan/30 bg-sk-cyan/10 px-3 py-2 font-mono text-[11px] tracking-[2px] text-sk-cyan">
          <span className="dot h-1.5 w-1.5 rounded-full bg-sk-cyan shadow-[0_0_8px_rgb(var(--color-cyan))]" />
          AR · СКАНЕР
        </div>
        <button type="button" className="glass flex h-[38px] w-[38px] items-center justify-center rounded-xl text-sk-text backdrop-blur-lg">
          <Icon name="bolt" size={19} color="rgb(var(--color-text))" />
        </button>
      </div>

      <div className="absolute left-1/2 top-[40%] h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2">
        <Corner position="tl" />
        <Corner position="tr" />
        <Corner position="bl" />
        <Corner position="br" />
        <div className="absolute inset-[18px] rounded-lg border border-sk-cyan/20" />
        <div className="scanline absolute left-3.5 right-3.5 h-0.5 bg-[linear-gradient(90deg,transparent,rgb(var(--color-cyan)),transparent)] shadow-[0_0_14px_rgb(var(--color-cyan))]" />
        <div className="absolute left-1/2 top-1/2 flex h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[10px] border border-sk-violetHi bg-sk-violetHi/15 text-sk-violetHi shadow-[0_0_24px_rgba(139,108,255,0.53)]">
          <Icon name="gem" size={34} color="rgb(var(--color-violet-hi))" />
        </div>
      </div>

      <div className="absolute left-0 right-0 top-[calc(40%_+_140px)] text-center">
        <div className="font-ui text-base font-semibold text-sk-text">
          {isLocalClaiming ? 'Анализ QR-кода...' : 'Наведите камеру на QR-код'}
        </div>
        <div className="mt-1 font-ui text-[13px] text-sk-text2">Расположите код в центре экрана,<br/>он отсканируется автоматически.</div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[6] flex flex-col items-center gap-[18px] pb-[calc(var(--safe-area-bottom)+40px)]">
        <div className="flex gap-2">
          {['QR-метка', 'AR-сцена', 'Секрет'].map((chip, index) => (
            <span
              key={chip}
              className="rounded-full border px-[11px] py-1.5 font-mono text-[10.5px]"
              style={{
                color: index === 0 ? 'rgb(var(--color-ink))' : 'rgb(var(--color-text2))',
                background: index === 0 ? 'rgb(var(--color-cyan))' : 'rgb(var(--color-surface) / 0.06)',
                borderColor: index === 0 ? 'transparent' : 'rgb(var(--color-line) / 0.10)',
                fontWeight: index === 0 ? 700 : 500,
              }}
            >
              {chip}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={handleSimulateScan}
          aria-label="Имитировать сканирование"
          className="holo flex h-[78px] w-[78px] rounded-full p-1 shadow-[0_0_30px_rgba(139,108,255,0.67)] active:scale-[0.98]"
          style={{ background: 'var(--gradient-primary)', backgroundSize: '180% 180%', opacity: isLocalClaiming ? 0.7 : 1 }}
        >
          <span className="flex h-full w-full items-center justify-center rounded-full border-2 border-white/20 bg-sk-bg">
            <Icon name="scan" size={32} color="rgb(var(--color-cyan))" sw={2} />
          </span>
        </button>
      </div>
    </Screen>
  );
}
