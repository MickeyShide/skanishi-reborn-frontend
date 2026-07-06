import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon.jsx';
import { Body, GlassCard, LevelRing, RarityTag, Screen, SectionTitle, TgHeader, XPBar } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';
import { formatNumber } from '../utils/format.js';

const rewardColor = {
  cyan: 'rgb(var(--color-cyan))',
  violetHi: 'rgb(var(--color-violet-hi))',
  gold: 'rgb(var(--color-gold))',
};

export function HomePage() {
  const navigate = useNavigate();
  const { user, quests, activeEvent, recentRewards } = useAppState();

  return (
    <Screen nav="home">
      <TgHeader />

      <Body>
        <GlassCard glow="#8B6CFF">
          <div className="flex items-center gap-3.5">
            <LevelRing level={user.level} pct={user.levelProgress} size={66} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-ui text-lg font-bold text-sk-text">@{user.username}</div>
            </div>
          </div>

          <div className="mt-3.5">
            <XPBar value={user.xp} max={user.nextLevelXp} />
          </div>

          {/* <div className="mt-3.5 flex items-center justify-center gap-1.5 rounded-lg border border-sk-gold/30 bg-sk-gold/10 px-4 py-2">
            <Icon name="fire" size={13} color="rgb(var(--color-gold))" />
            <span className="font-mono text-[10.5px] font-bold text-sk-gold">СТРИК {user.streakDays} ДН · ×1.5 XP</span>
          </div> */}
        </GlassCard>

        {/* <button
          type="button"
          onClick={() => navigate('/map')}
          className="holo mt-3.5 block w-full rounded-card p-0.5 text-left shadow-[0_0_30px_rgba(139,108,255,0.33)] active:scale-[0.99]"
          style={{ background: 'var(--gradient-primary)', backgroundSize: '180% 180%' }}
        >
          <div className="flex items-center gap-[15px] rounded-[18px] bg-[linear-gradient(135deg,#15121f,#0d0b16)] px-[18px] py-[18px]">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[15px] border border-sk-line/20 bg-sk-surface/10">
              <Icon name="qr" size={28} color="rgb(var(--color-cyan))" sw={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-ui text-[17px] font-bold text-sk-text">Сканировать метку</div>
              <div className="mt-0.5 truncate font-ui text-[12.5px] text-sk-text2">Сначала выбери точку на карте и затем отсканируй её</div>
            </div>
            <Icon name="arrow" size={22} color="rgb(var(--color-text2))" />
          </div>
        </button> */}

        {activeEvent && (
          <>
            <SectionTitle>Активный ивент</SectionTitle>
            <div className="relative mt-2.5 overflow-hidden rounded-[18px] border border-sk-line/10">
              <div className="stripes absolute inset-0" />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(167,139,255,0.5),rgba(59,224,255,0.28)_55%,rgba(255,108,200,0.3))]" />
              <div className="relative p-4">
                <RarityTag rarity={activeEvent.rarity} />
                <div className="mt-2.5 font-ui text-[19px] font-bold text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">{activeEvent.title}</div>
                <div className="mt-2.5 flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <Icon name="bolt" size={14} color="#fff" />
                    <span className="font-mono text-[11.5px] font-bold text-white">{activeEvent.xpMultiplier}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon name="clock" size={14} color="#fff" />
                    <span className="font-mono text-[11.5px] font-bold text-white">{activeEvent.timeLeft}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <SectionTitle action={<button type="button" onClick={() => navigate('/quests')} className="font-mono text-[11px] text-sk-cyan">ВСЕ →</button>}>
          Активные квесты
        </SectionTitle>

        <div className="mt-2.5 flex flex-col gap-2.5">
          {quests.slice(0, 2).map((quest) => (
            <button key={quest.id} type="button" onClick={() => navigate('/quests')} className="glass rounded-2xl p-3.5 text-left active:scale-[0.99]">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-ui text-[14.5px] font-semibold text-sk-text">{quest.name}</span>
                <RarityTag rarity={quest.rarity} />
              </div>
              <div className="mt-[11px] flex items-center gap-2.5">
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-sk-surface/10">
                  <div className="h-full rounded-full" style={{ width: `${quest.progress}%`, background: 'var(--gradient-primary)' }} />
                </div>
                <span className="shrink-0 font-mono text-[10.5px] text-sk-text2">{quest.step}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mb-2.5 mt-5">
          <span className="font-ui text-[14.5px] font-semibold text-sk-text">Недавние награды</span>
        </div>

        <div className="flex flex-col gap-0.5">
          {recentRewards.map((reward) => {
            const color = rewardColor[reward.color];

            return (
              <div key={reward.source} className="flex items-center gap-3 border-b border-sk-line/10 px-0.5 py-[11px] last:border-b-0">
                <div
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] border"
                  style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, borderColor: `color-mix(in srgb, ${color} 22%, transparent)` }}
                >
                  <Icon name="bolt" size={16} color={color} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-ui text-[13.5px] text-sk-text">{reward.source}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-sk-text3">{reward.time}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  {reward.multiplier && <span className="font-mono text-[10px] font-bold text-sk-gold">{reward.multiplier}</span>}
                  <span className="font-mono text-sm font-bold" style={{ color }}>
                    +{formatNumber(reward.xp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Body>
    </Screen>
  );
}
