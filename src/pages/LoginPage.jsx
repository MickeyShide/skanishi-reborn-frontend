import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Emblem } from '../components/Brand.jsx';
import { Icon } from '../components/Icon.jsx';
import { Screen } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';

const features = [
  { icon: 'qr', title: 'Сканируй метки', subtitle: 'QR и AR-точки в реальном мире' },
  { icon: 'gem', title: 'Собирай артефакты', subtitle: 'Редкие предметы и секреты' },
  { icon: 'bolt', title: 'Прокачивай уровень', subtitle: 'XP, стрики и достижения' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithTelegram, isAuthenticating, authError } = useAppState();
  const [localError, setLocalError] = useState('');

  const location = useLocation();

  const handleLogin = async () => {
    setLocalError('');

    try {
      await loginWithTelegram();
      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    } catch (error) {
      setLocalError(error.message || 'Не удалось войти через Telegram.');
    }
  };

  return (
    <Screen>
      <div className="flex flex-1 flex-col px-6">
        <div className="flex flex-col items-center gap-[22px] pt-[calc(var(--safe-area-top)+96px)]">
          <Emblem size={76} />
          <div className="text-center">
            <h1 className="m-0 font-ui text-[27px] font-bold leading-[1.15] tracking-normal text-sk-text">
              Начни охоту
              <br />
              за скрытым
            </h1>
            <p className="mx-auto mt-3 max-w-[280px] font-ui text-[14.5px] leading-normal text-sk-text2">
              Город - это карта. Найди метки, разгадай секреты и поднимись в рейтинге.
            </p>
          </div>
        </div>

        <div className="mt-[34px] flex flex-col gap-2.5">
          {features.map((feature) => (
            <div key={feature.title} className="glass flex items-center gap-3.5 rounded-2xl px-[15px] py-[13px]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sk-violet/25 bg-sk-violet/15">
                <Icon name={feature.icon} size={21} color="rgb(var(--color-violet-hi))" />
              </div>
              <div>
                <div className="font-ui text-[14.5px] font-semibold text-sk-text">{feature.title}</div>
                <div className="mt-0.5 font-ui text-xs text-sk-text3">{feature.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        <div className="pb-[calc(var(--safe-area-bottom)+40px)]">
          {(localError || authError) && <div className="mb-3 text-center font-ui text-[12.5px] text-sk-pink">{localError || authError}</div>}
          <button
            type="button"
            onClick={handleLogin}
            disabled={isAuthenticating}
            className="flex h-14 w-full items-center justify-center gap-[11px] rounded-[17px] bg-[linear-gradient(135deg,#2AABEE,#229ED9)] text-white shadow-[0_0_28px_rgba(42,171,238,0.45),0_10px_24px_rgba(0,0,0,0.4)] active:scale-[0.99]"
          >
            <Icon name="tg" size={22} color="#fff" sw={1.6} />
            <span className="font-ui text-[16.5px] font-semibold">{isAuthenticating ? 'Подключаем Telegram…' : 'Войти через Telegram'}</span>
          </button>
          <div className="mt-4 text-center font-ui text-[11px] leading-normal text-sk-text3">
            Продолжая, ты соглашаешься с <span className="text-sk-text2">правилами</span> и <span className="text-sk-text2">политикой данных</span>
          </div>
        </div>
      </div>
    </Screen>
  );
}
