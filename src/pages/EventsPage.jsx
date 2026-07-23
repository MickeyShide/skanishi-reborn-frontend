import { useState, useEffect } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Body, EmptyState, GlassCard, RarityTag, Screen, TgHeader } from '../components/ui.jsx';
import { fetchEvents, claimEventGoalReward } from '../utils/api.js';
import { useAppState } from '../context/AppStateContext.jsx';
import { formatNumber } from '../utils/format.js';
import { StandalonePage } from '../components/StandalonePage.jsx';

export function EventsPage() {
  const { refreshAppState } = useAppState();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingIds, setClaimingIds] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEvents(data || []);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleClaim = async (eventId, goalId) => {
    const claimKey = `${eventId}-${goalId}`;
    if (claimingIds.has(claimKey)) return;
    
    setClaimingIds((prev) => new Set([...prev, claimKey]));
    try {
      await claimEventGoalReward(eventId, goalId);
      await loadEvents();
      refreshAppState();
    } catch (err) {
      console.error('Failed to claim goal:', err);
    } finally {
      setClaimingIds((prev) => {
        const next = new Set(prev);
        next.delete(claimKey);
        return next;
      });
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  const formatGoalTitle = (goal, index) => {
    if (goal.description) return goal.description;
    if (goal.target_count) return `Цель: ${goal.target_count} действий`;
    if (goal.target_value) return `Цель: ${goal.target_value} очков прогресса`;
    return `Цель ${index + 1}`;
  };

  return (
    <Screen nav="home">
      <TgHeader title="Ивенты" sub="ОГРАНИЧЕННЫЕ ПО ВРЕМЕНИ СОБЫТИЯ" />
      <Body>
        {loading ? (
          <div className="flex justify-center p-8 text-sk-text3">
            <Icon name="spinner" size={24} className="animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <EmptyState title="Нет активных ивентов" text="Следите за новостями, скоро будут новые события!" />
        ) : (
          <div className="flex flex-col gap-5">
            {events.map((event) => {
              const expanded = expandedId === event.id;
              
              return (
                <div key={event.id} className="relative overflow-hidden rounded-[18px] border border-sk-line/10 bg-sk-surface">
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(167,139,255,0.2),rgba(59,224,255,0.1)_55%,rgba(255,108,200,0.1))]" />
                  
                  <div className="relative p-4">
                    <div className="flex justify-between items-start">
                      <RarityTag rarity={event.rarity} />
                      {event.xp_multiplier !== "1.00" && (
                        <div className="rounded-full bg-sk-gold px-2 py-0.5 font-mono text-[10px] font-bold text-sk-bg">
                          x{Number(event.xp_multiplier).toString()} XP
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2.5 font-ui text-[19px] font-bold text-white">
                      {event.title}
                    </div>
                    
                    {event.description && (
                      <div className="mt-2 text-sm text-sk-text2">
                        {event.description}
                      </div>
                    )}
                    
                    <div className="mt-4 flex gap-4">
                      <div className="flex items-center gap-1.5 rounded-lg bg-black/20 px-2 py-1">
                        <Icon name="clock" size={14} color="#fff" />
                        <span className="font-mono text-[11px] text-white/80">
                          ДО {new Date(event.ends_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative border-t border-sk-line/10 bg-black/10 p-4">
                    <button
                      type="button"
                      onClick={() => toggleExpand(event.id)}
                      className="w-full flex justify-between items-center font-mono text-[11px] text-sk-cyan"
                    >
                      <span>ЦЕЛИ ИВЕНТА ({event.goals.length})</span>
                      <Icon name={expanded ? "chev-up" : "chev-down"} size={16} />
                    </button>

                    {expanded && (
                      <div className="mt-4 flex flex-col gap-3">
                        {event.goals.map((goal) => {
                          const claimKey = `${event.id}-${goal.id}`;
                          const isClaiming = claimingIds.has(claimKey);
                          const targetValue = goal.target_count ?? goal.target_value ?? 0;
                          const progressValue = goal.progress ?? goal.current_value ?? 0;
                          const canClaim = Boolean(goal.is_completed) && !goal.reward_claimed;
                          const progressPct = targetValue > 0 ? Math.min(100, Math.round((progressValue / targetValue) * 100)) : 0;

                          return (
                            <GlassCard key={goal.id} className="p-3 shadow-none">
                              <div className="font-ui text-sm font-semibold">{formatGoalTitle(goal, event.goals.indexOf(goal))}</div>
                              <div className="mt-1 font-mono text-[10px] text-sk-text3">ПРОГРЕСС: {progressValue} / {targetValue}</div>
                              
                              <div className="mt-3 flex items-center gap-3">
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-sk-surface/20">
                                  <div className="h-full rounded-full bg-sk-cyan" style={{ width: `${progressPct}%` }} />
                                </div>
                              </div>

                              <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Icon name="bolt" size={14} color="rgb(var(--color-gold))" />
                                  <span className="font-mono text-xs font-bold text-sk-text">+{goal.reward_xp} XP</span>
                                </div>
                                {canClaim ? (
                                  <button
                                    onClick={() => handleClaim(event.id, goal.id)}
                                    disabled={isClaiming}
                                    className="rounded bg-sk-cyan px-2 py-1 font-mono text-[10px] font-bold text-[#000]"
                                  >
                                    {isClaiming ? 'ЗАБИРАЕМ...' : 'ЗАБРАТЬ'}
                                  </button>
                                ) : goal.reward_claimed ? (
                                  <span className="font-mono text-[10px] text-sk-text3">ПОЛУЧЕНО</span>
                                ) : (
                                  <span className="font-mono text-[10px] text-sk-text3/50">В ПРОЦЕССЕ</span>
                                )}
                              </div>
                            </GlassCard>
                          )
                        })}
                        {event.goals.length === 0 && (
                          <div className="text-center font-mono text-[10px] text-sk-text3">Целей нет</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Body>
    </Screen>
  );
}

export default function EventsPageStandalone(props) {
  return <StandalonePage><EventsPage {...props} /></StandalonePage>;
}
