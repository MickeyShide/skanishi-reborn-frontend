import { Icon } from '../components/Icon.jsx';
import { Body, RarityTag, Screen, TgHeader } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';
import { getRarityColor } from '../utils/format.js';

export function AchievementsPage() {
  const { achievements, achievementSummary, latestAchievement } = useAppState();

  return (
    <Screen>
      <TgHeader title="Достижения" sub={`РАЗБЛОКИРОВАНО ${achievementSummary.unlocked} / ${achievementSummary.total}`} back />
      <Body pb="40px">
        {latestAchievement && (
          <div className="holo mb-4 rounded-card p-[1.5px]" style={{ background: 'var(--gradient-holo)', backgroundSize: '200% 200%' }}>
            <div className="flex items-center gap-3.5 rounded-[18px] bg-[linear-gradient(135deg,#181426,#100d1a)] p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sk-gold/40 bg-sk-gold/15 shadow-[0_0_20px_rgba(255,192,97,0.4)]">
                <Icon name="trophy" size={30} color="rgb(var(--color-gold))" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[9.5px] tracking-[1px] text-sk-gold">ПОСЛЕДНЕЕ</div>
                <div className="mt-1 truncate font-ui text-[16.5px] font-bold text-sk-text">{latestAchievement.name}</div>
                <div className="mt-0.5 font-ui text-xs text-sk-text2">{latestAchievement.description}</div>
              </div>
              {latestAchievement.xp > 0 && (
                <span className="font-mono text-[13px] font-bold text-sk-gold">+{latestAchievement.xp}</span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2.5">
          {achievements.map((achievement) => {
            const color = getRarityColor(achievement.rarity);

            return (
              <div
                key={achievement.name}
                className="relative flex min-h-[142px] flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 text-center"
                style={{
                  background: achievement.unlocked ? `color-mix(in srgb, ${color} 6%, transparent)` : 'rgb(var(--color-surface) / 0.05)',
                  borderColor: achievement.unlocked ? `color-mix(in srgb, ${color} 25%, transparent)` : 'rgb(var(--color-line) / 0.10)',
                  opacity: achievement.unlocked ? 1 : 0.92,
                }}
              >
                <div
                  className="relative flex h-[50px] w-[50px] items-center justify-center rounded-[14px] border"
                  style={{
                    background: achievement.unlocked ? `color-mix(in srgb, ${color} 12%, transparent)` : 'rgb(var(--color-surface) / 0.04)',
                    borderColor: achievement.unlocked ? `color-mix(in srgb, ${color} 34%, transparent)` : 'rgb(var(--color-line) / 0.10)',
                    boxShadow: achievement.unlocked ? `0 0 16px color-mix(in srgb, ${color} 34%, transparent)` : 'none',
                  }}
                >
                  <Icon name={achievement.icon} size={24} color={achievement.unlocked ? color : 'rgb(var(--color-text3) / 0.55)'} />
                  {!achievement.unlocked && (
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-sk-line/10 bg-sk-bg2 text-sk-text3">
                      <Icon name="lock" size={11} color="rgb(var(--color-text3))" sw={2} />
                    </div>
                  )}
                </div>
                <div className="flex min-h-[26px] items-center font-ui text-[11px] font-semibold leading-tight text-sk-text">{achievement.name}</div>
                {achievement.unlocked ? (
                  <RarityTag rarity={achievement.rarity} className="px-1.5 py-0.5 text-[8px]" />
                ) : (
                  <div className="h-1 w-[78%] overflow-hidden rounded-full bg-sk-surface/10">
                    <div className="h-full rounded-full" style={{ width: `${achievement.progress}%`, background: color }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Body>
    </Screen>
  );
}
