import { Icon } from '../components/Icon.jsx';
import { Body, EmptyState, GlassCard, RarityTag, Screen, TgHeader } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';

export function QuestsPage() {
  const { quests } = useAppState();

  return (
    <Screen nav="quests">
      <TgHeader title="Квесты" sub="АКТИВНЫЕ МАРШРУТЫ · СЕЗОН 2" />
      <Body>
        {quests.length === 0 ? (
          <EmptyState title="Квестов пока нет" text="Новые маршруты появятся после обновления городских точек." />
        ) : (
          <div className="flex flex-col gap-3">
            {quests.map((quest) => (
              <GlassCard key={quest.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-ui text-[17px] font-bold text-sk-text">{quest.name}</div>
                    <div className="mt-1 font-mono text-[10.5px] text-sk-text3">{quest.step}</div>
                  </div>
                  <RarityTag rarity={quest.rarity} />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-sk-surface/10">
                    <div className="h-full rounded-full" style={{ width: `${quest.progress}%`, background: 'var(--gradient-primary)' }} />
                  </div>
                  <span className="font-mono text-xs text-sk-cyan">{quest.progress}%</span>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-[14px] border border-sk-line/10 bg-sk-surface/5 px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <Icon name="bolt" size={16} color="rgb(var(--color-gold))" />
                    <span className="font-mono text-sm font-bold text-sk-text">+{quest.xp} XP</span>
                  </div>
                  <button type="button" className="font-mono text-[11px] text-sk-cyan">
                    ОТКРЫТЬ
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </Body>
    </Screen>
  );
}
