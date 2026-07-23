import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon.jsx';
import { Avatar, Body, GlassCard, Screen, TgHeader, XPBar } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';
import { getPrivacySettings, logout, updatePrivacySettings } from '../utils/api.js';
import { formatNumber } from '../utils/format.js';
import { StandalonePage } from '../components/StandalonePage.jsx';

const colorVar = {
  cyan: 'rgb(var(--color-cyan))',
  violetHi: 'rgb(var(--color-violet-hi))',
  gold: 'rgb(var(--color-gold))',
  pink: 'rgb(var(--color-pink))',
};

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, stats, profileLinks, dispatch } = useAppState();
  const [isPublic, setIsPublic] = useState(false);
  const [isLoadingPrivacy, setIsLoadingPrivacy] = useState(true);

  useEffect(() => {
    let mounted = true;
    getPrivacySettings()
      .then((res) => {
        if (mounted) {
          setIsPublic(!res.privacy);
          setIsLoadingPrivacy(false);
        }
      })
      .catch((err) => {
        console.warn('Failed to load privacy settings', err);
        if (mounted) setIsLoadingPrivacy(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handlePrivacyToggle = async () => {
    const nextPublic = !isPublic;
    setIsPublic(nextPublic); // Optimistic UI
    try {
      await updatePrivacySettings(!nextPublic); // Send 'privacy: true' when turning off public mode
    } catch (err) {
      console.error('Failed to update privacy', err);
      setIsPublic(isPublic); // Rollback on error
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      dispatch({ type: 'logout' });
      navigate('/');
    }
  };

  const resolvedProfileLinks = useMemo(() => {
    const existingTargets = new Set((profileLinks ?? []).map((link) => link.to));
    const extraLinks = [
      { icon: 'trophy', title: 'Рейтинг', subtitle: `Место: ${user?.rank ?? '-'}`, color: 'gold', to: '/leaderboard' },
      { icon: 'user', title: 'Друзья', subtitle: 'Приглашай и получай XP', color: 'cyan', to: '/friends' },
      { icon: 'gem', title: 'Магазин', subtitle: `${user?.coins ?? 0} коинов доступно`, color: 'pink', to: '/shop' },
      { icon: 'layer', title: 'Коллекции', subtitle: 'Собранные наборы и награды', color: 'violetHi', to: '/collections' },
      { icon: 'bolt', title: 'Мой Стикер (UGC)', subtitle: 'Пассивный доход от сканирований', color: 'cyan', to: '/ugc' },
    ];

    return [...(profileLinks ?? []), ...extraLinks.filter((link) => !existingTargets.has(link.to))];
  }, [profileLinks, user?.coins, user?.rank]);

  return (
    <Screen nav="profile">
      <TgHeader />
      <Body>
        <div className="pt-2 flex flex-col items-center">
          <div className="relative">
            <div className="holo absolute -inset-1.5 rounded-full opacity-80 blur-[2px]" style={{ background: 'var(--gradient-holo)' }} />
            <div className="relative rounded-full bg-sk-bg p-[3px]">
              <Avatar size={88} seed={1} />
            </div>
          </div>
          <div className="mt-3.5 font-ui text-[22px] font-bold text-sk-text">@{user.username}</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-lg border border-sk-violetHi/30 bg-sk-violetHi/10 px-2.5 py-1 font-mono text-[11px] text-sk-violetHi">LVL {user.level} · ОХОТНИК</span>
            <span className="inline-flex items-center gap-1 rounded-lg border border-sk-gold/30 bg-sk-gold/10 px-2.5 py-1 font-mono text-[11px] text-sk-gold">
              <Icon name="fire" size={12} color="rgb(var(--color-gold))" />
              {user.streakDays} ДН
            </span>
          </div>
        </div>

        <GlassCard className="mt-5">
          <div className="mb-2.5 flex items-baseline justify-between">
            <span className="font-ui text-[13.5px] text-sk-text2">До {user.level + 1} уровня</span>
            <span className="font-mono text-xs text-sk-cyan">{formatNumber(user.nextLevelXp - user.xp)} XP</span>
          </div>
          <XPBar value={user.xp} max={user.nextLevelXp} showText={false} />
          <div className="mt-2 flex justify-between font-mono text-[10.5px] text-sk-text3">
            <span>LVL {user.level}</span>
            <span>LVL {user.level + 1}</span>
          </div>
        </GlassCard>

        <div className="mt-3.5 grid grid-cols-4 gap-2">
          {stats.map((stat) => (
            <GlassCard key={stat.label} className="rounded-[15px] px-1.5 py-3.5 text-center shadow-none">
              <div className="font-mono text-xl font-bold" style={{ color: colorVar[stat.color] }}>
                {stat.value}
              </div>
              <div className="mt-1 font-mono text-[8.5px] tracking-[0.8px] text-sk-text3">{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {resolvedProfileLinks.map((link) => {
            const color = colorVar[link.color];

            return (
              <button
                key={link.title}
                type="button"
                onClick={() => navigate(link.to)}
                className="glass flex w-full items-center gap-[13px] rounded-2xl p-3.5 text-left active:scale-[0.99]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                  style={{ background: `color-mix(in srgb, ${color} 10%, transparent)`, borderColor: `color-mix(in srgb, ${color} 22%, transparent)` }}
                >
                  <Icon name={link.icon} size={20} color={color} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-ui text-[15px] font-semibold text-sk-text">{link.title}</div>
                  <div className="mt-0.5 font-ui text-xs text-sk-text3">{link.subtitle}</div>
                </div>
                <Icon name="chev" size={18} color="rgb(var(--color-text3))" />
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <div className="px-4 font-mono text-[10px] tracking-[1px] text-sk-text3">НАСТРОЙКИ</div>
          
          <div className="glass flex items-center justify-between rounded-2xl p-4">
            <div className="min-w-0 flex-1">
              <div className="font-ui text-[15px] font-semibold text-sk-text">Публичный профиль</div>
              <div className="mt-0.5 font-ui text-xs text-sk-text3">Показывать ваше имя в рейтинге</div>
            </div>
            {isLoadingPrivacy ? (
              <div className="h-6 w-11 rounded-full bg-sk-line/10 animate-pulse" />
            ) : (
              <button
                type="button"
                onClick={handlePrivacyToggle}
                className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${isPublic ? 'bg-sk-cyan' : 'bg-sk-line/20'}`}
              >
                <div className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="glass flex items-center justify-center gap-2 rounded-2xl p-4 text-sk-pink active:scale-[0.99]"
          >
            <Icon name="logout" size={18} color="rgb(var(--color-pink))" />
            <span className="font-ui text-[15px] font-bold">Выйти из аккаунта</span>
          </button>
        </div>
      </Body>
    </Screen>
  );
}

export default function ProfilePageStandalone(props) {
  return <StandalonePage><ProfilePage {...props} /></StandalonePage>;
}
