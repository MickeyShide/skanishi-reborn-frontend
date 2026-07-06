import { useNavigate } from 'react-router-dom';
import { Emblem } from './Brand.jsx';
import { Icon } from './Icon.jsx';
import { cn, formatNumber, getRarityColor, getRarityName } from '../utils/format.js';

const paletteClass = {
  cyan: 'text-sk-cyan',
  violet: 'text-sk-violet',
  violetHi: 'text-sk-violetHi',
  gold: 'text-sk-gold',
  pink: 'text-sk-pink',
  green: 'text-sk-green',
};

export function Screen({ children, nav, glow = true, className = '' }) {
  return (
    <div className={cn('relative flex h-full flex-col overflow-hidden bg-sk-bg text-sk-text animate-screenIn', className)}>
      {glow && (
        <>
          <div className="pointer-events-none absolute -right-16 -top-20 h-[280px] w-[280px] rounded-full bg-sk-violet/30 blur-2xl" />
          <div className="pointer-events-none absolute -left-24 bottom-10 h-[260px] w-[260px] rounded-full bg-sk-cyan/20 blur-2xl" />
        </>
      )}
      <div className="grain pointer-events-none absolute inset-0 z-[1] opacity-50" />
      <div className="relative z-[2] flex min-h-0 flex-1 flex-col">{children}</div>
      {nav && <BottomNav active={nav} />}
    </div>
  );
}

export function Body({ children, className = '', pb = 'nav' }) {
  const paddingBottom = pb === 'nav' ? 'calc(var(--bottom-nav-space) + var(--content-safe-area-bottom))' : pb;

  return (
    <div className={cn('noscroll safe-page-x flex-1 overflow-y-auto', className)} style={{ paddingBottom }}>
      {children}
    </div>
  );
}

export function GlassCard({ children, className = '', glow, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn('glass relative rounded-card p-4 shadow-card', onClick && 'cursor-pointer active:scale-[0.99]', className)}
      style={glow ? { boxShadow: `0 0 0 1px ${glow}30, 0 12px 40px ${glow}22` } : undefined}
    >
      {children}
    </div>
  );
}

export function RarityTag({ rarity = 'rare', className = '' }) {
  const color = getRarityColor(rarity);

  return (
    <span
      className={cn('inline-flex shrink-0 rounded-[5px] border px-[7px] py-[3px] font-mono text-[9.5px] font-bold uppercase tracking-[1.5px]', className)}
      style={{
        color,
        background: `color-mix(in srgb, ${color} 16%, transparent)`,
        borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
      }}
    >
      {getRarityName(rarity)}
    </span>
  );
}

export function XPBar({ value, max, height = 8, showText = true }) {
  const pct = Math.max(4, Math.min(100, (value / max) * 100));

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-full bg-sk-surface/10" style={{ height }}>
        <div
          className="holo h-full rounded-full shadow-[0_0_12px_rgba(139,108,255,0.6)]"
          style={{ width: `${pct}%`, background: 'var(--gradient-primary)', backgroundSize: '180% 180%' }}
        />
      </div>
      {showText && (
        <div className="mt-1.5 flex justify-between font-mono text-[11px]">
          <span className="text-sk-cyan">{formatNumber(value)} XP</span>
          <span className="text-sk-text3">/ {formatNumber(max)}</span>
        </div>
      )}
    </div>
  );
}

export function LevelRing({ level, pct = 64, size = 64 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-gradient-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgb(var(--color-violet-hi))" />
            <stop offset="1" stopColor="rgb(var(--color-cyan))" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgb(var(--color-line) / 0.10)" strokeWidth="4" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#ring-gradient-${size})`}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct / 100)}
          style={{ filter: 'drop-shadow(0 0 4px rgb(var(--color-violet)))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[9px] tracking-[1px] text-sk-text3">LVL</span>
        <span className="font-mono text-xl font-bold leading-none text-sk-text">{level}</span>
      </div>
    </div>
  );
}

export function Avatar({ size = 44, ring, seed = 0 }) {
  const gradients = [
    'linear-gradient(135deg,#8B6CFF,#3BE0FF)',
    'linear-gradient(135deg,#FF6CC8,#A78BFF)',
    'linear-gradient(135deg,#3BE0FF,#5CE7A3)',
    'linear-gradient(135deg,#FFC061,#FF6CC8)',
  ];

  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        background: gradients[seed % gradients.length],
        boxShadow: ring ? `0 0 0 2px rgb(var(--color-bg)), 0 0 0 3.5px ${ring}` : 'none',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.35),transparent_55%)]" />
    </div>
  );
}

export function TgHeader({ content }) {

  return (
    <header className="safe-page-x z-[5] flex items-center gap-3 pb-3 pt-[calc(var(--safe-area-top)+58px)]">
      {content}
    </header>
  );
}

import { useScanner } from '../hooks/useScanner.js';

export function BottomNav({ active = 'home' }) {
  const navigate = useNavigate();
  const { handleScan } = useScanner();

  const items = [
    { id: 'home', icon: 'home', label: 'Главная', to: '/home' },
    { id: 'map', icon: 'map', label: 'Карта', to: '/map' },
    { id: 'scan', icon: 'qr', label: 'Скан', center: true, action: handleScan },
    { id: 'quests', icon: 'quest', label: 'Квесты', to: '/quests' },
    { id: 'profile', icon: 'user', label: 'Профиль', to: '/profile' },
  ];

  return (
    <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-40 bg-gradient-to-b from-sk-bg/0 to-sk-bg/95 pb-[calc(var(--safe-area-bottom)+26px)] pt-2.5">
      <div className="pointer-events-auto mx-3.5 flex h-[60px] items-center justify-around rounded-[22px] border border-sk-line/10 bg-sk-bg2/85 px-1.5 shadow-nav backdrop-blur-2xl">
        {items.map((item) => {
          const isActive = active === item.id;

          if (item.center) {
            return (
              <button key={item.id} type="button" onClick={item.action} aria-label={item.label} className="relative flex w-14 justify-center">
                <span
                  className="holo mt-[-26px] flex h-[54px] w-[54px] items-center justify-center rounded-[18px] border-2 border-white/20 text-sk-ink shadow-[0_0_22px_rgba(139,108,255,0.67),0_8px_20px_rgba(0,0,0,0.5)]"
                  style={{ background: 'var(--gradient-primary)', backgroundSize: '180% 180%' }}
                >
                  <Icon name="qr" size={26} color="rgb(var(--color-ink))" sw={2} />
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.to)}
              className={cn('flex w-[58px] flex-col items-center gap-1 text-sk-text3 transition-colors', isActive && 'text-sk-violetHi')}
            >
              <Icon name={item.icon} size={22} color={isActive ? 'rgb(var(--color-violet-hi))' : 'rgb(var(--color-text3) / 0.72)'} />
              <span className={cn('font-ui text-[9.5px] font-medium', isActive && 'font-semibold')}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function PrimaryButton({ children, icon, className = '', onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn('flex h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl font-ui text-base font-bold text-sk-ink shadow-[0_0_26px_rgba(139,108,255,0.40)] active:scale-[0.99]', className)}
      style={{ background: 'var(--gradient-primary)' }}
    >
      {icon}
      {children}
    </button>
  );
}

export function IconBadge({ icon, color = 'cyan', size = 40, className = '' }) {
  const cssColor = `rgb(var(--color-${color === 'violetHi' ? 'violet-hi' : color}))`;

  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-xl border', className)}
      style={{
        width: size,
        height: size,
        color: cssColor,
        background: `color-mix(in srgb, ${cssColor} 13%, transparent)`,
        borderColor: `color-mix(in srgb, ${cssColor} 24%, transparent)`,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.5)} color={cssColor} />
    </div>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <div className="mt-5 flex items-center justify-between">
      <span className="font-ui text-[14.5px] font-semibold text-sk-text">{children}</span>
      {action}
    </div>
  );
}

export function LoadingState() {
  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
        <Emblem size={72} />
        <div>
          <div className="font-ui text-lg font-semibold text-sk-text">Загрузка протокола</div>
          <div className="mt-2 font-ui text-sm text-sk-text2">Синхронизируем городские точки.</div>
        </div>
      </div>
    </Screen>
  );
}

export function EmptyState({ title = 'Пока пусто', text = 'Здесь появятся новые данные после синхронизации.' }) {
  return (
    <GlassCard className="flex flex-col items-center px-5 py-8 text-center">
      <Icon name="scan" size={34} color="rgb(var(--color-text3))" />
      <div className="mt-3 font-ui text-base font-semibold text-sk-text">{title}</div>
      <div className="mt-1.5 font-ui text-sm leading-relaxed text-sk-text2">{text}</div>
    </GlassCard>
  );
}

export function paletteText(color) {
  return paletteClass[color] ?? 'text-sk-text';
}
