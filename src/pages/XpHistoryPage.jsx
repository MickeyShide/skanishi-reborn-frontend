import { useMemo, useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Body, EmptyState, GlassCard, Screen, TgHeader } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';
import { formatNumber } from '../utils/format.js';

const filterOptions = [
  { label: 'Все', tag: null },
  { label: 'Скан', tag: 'SCAN' },
  { label: 'Квесты', tag: 'QUEST' },
  { label: 'Бонусы', tag: 'BONUS' },
];

const colorVar = {
  cyan: 'rgb(var(--color-cyan))',
  violetHi: 'rgb(var(--color-violet-hi))',
  gold: 'rgb(var(--color-gold))',
  pink: 'rgb(var(--color-pink))',
};

export function XpHistoryPage() {
  const { xpHistoryGroups, xpWeekly, refreshXpHistory } = useAppState();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const [filterError, setFilterError] = useState('');

  const activeFilter = filterOptions.find((option) => option.tag === activeTag) ?? filterOptions[0];
  const weekDays = useMemo(() => {
    const days = Array.isArray(xpWeekly?.days) ? xpWeekly.days.slice(0, 7) : [];
    while (days.length < 7) days.push(0);
    return days;
  }, [xpWeekly]);
  const maxWeekDay = Math.max(...weekDays, 1);
  const todayIndex = (new Date().getDay() + 6) % 7;

  const handleFilterSelect = async (option) => {
    setActiveTag(option.tag);
    setFilterOpen(false);
    setFilterError('');

    try {
      await refreshXpHistory(option.tag ? { tag: option.tag } : {});
    } catch (error) {
      setFilterError(error.message || 'Не удалось применить фильтр.');
    }
  };

  return (
    <Screen>
      <TgHeader
        title="История XP"
        sub={`${activeFilter.label.toUpperCase()} · ${formatNumber(xpWeekly?.total ?? 0)} XP`}
        back
        right={<button type="button" onClick={() => setFilterOpen(true)} className="rounded-[10px] border border-sk-cyan/25 bg-sk-cyan/10 px-[11px] py-[7px] font-mono text-[11px] text-sk-cyan">ФИЛЬТР</button>}
      />
      <Body pb="40px">
        <GlassCard glow="#3BE0FF" className="mb-2">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[10.5px] tracking-[1px] text-sk-text3">ЗА НЕДЕЛЮ</div>
              <div className="mt-1 font-mono text-[32px] font-bold text-sk-text">+{formatNumber(xpWeekly?.total ?? 0)}</div>
            </div>
            <div className="flex h-[46px] items-end gap-[5px]">
              {weekDays.map((xp, index) => (
                <div
                  key={`${xp}-${index}`}
                  className="w-[7px] rounded-[3px]"
                  style={{
                    height: `${Math.max(8, Math.round((xp / maxWeekDay) * 100))}%`,
                    background: index === todayIndex ? 'rgb(var(--color-cyan))' : 'rgba(139,108,255,0.45)',
                    boxShadow: index === todayIndex ? '0 0 8px rgb(var(--color-cyan))' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </GlassCard>

        {filterError && <div className="mb-2 rounded-[14px] border border-sk-pink/20 bg-sk-pink/10 px-3.5 py-3 font-ui text-sm text-sk-pink">{filterError}</div>}

        {xpHistoryGroups.length === 0 ? (
          <EmptyState title="XP пока нет" text="История появится после сканов, квестов и бонусных начислений." />
        ) : xpHistoryGroups.map((group) => (
          <div key={group.day} className="mt-3.5">
            <div className="px-0.5 pb-2 font-mono text-[10px] tracking-[2px] text-sk-text3">{group.day}</div>
            <div className="overflow-hidden rounded-[18px] border border-sk-line/10 bg-sk-surface/5">
              {group.items.map((record, index) => {
                const color = colorVar[record.color];

                return (
                  <div key={record.source} className="flex items-center gap-3 border-b border-sk-line/10 px-3.5 py-[13px] last:border-b-0">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border"
                      style={{ background: `color-mix(in srgb, ${color} 10%, transparent)`, borderColor: `color-mix(in srgb, ${color} 20%, transparent)` }}
                    >
                      <Icon name="bolt" size={16} color={color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-ui text-[13.5px] text-sk-text">{record.source}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded px-1.5 py-0.5 font-mono text-[8.5px] tracking-[0.5px]" style={{ color, background: `color-mix(in srgb, ${color} 16%, transparent)` }}>
                          {record.tag}
                        </span>
                        <span className="font-mono text-[10px] text-sk-text3">{record.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {record.multiplier && <span className="font-mono text-[10px] font-bold text-sk-gold">{record.multiplier}</span>}
                      <span className="font-mono text-[15px] font-bold" style={{ color }}>
                        +{record.xp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </Body>

      {filterOpen && (
        <div className="absolute inset-0 z-50 flex items-end bg-sk-bg/55 backdrop-blur-[2px]">
          <button type="button" aria-label="Закрыть фильтр" className="absolute inset-0 cursor-default" onClick={() => setFilterOpen(false)} />
          <div className="relative w-full rounded-t-[28px] border border-b-0 border-sk-line/15 bg-[linear-gradient(180deg,#181426,#0c0a15)] px-5 pb-[calc(var(--safe-area-bottom)+28px)] pt-4 shadow-[0_-18px_55px_rgba(0,0,0,0.55)] animate-sheetIn">
            <div className="mx-auto mb-4 h-[5px] w-11 rounded-full bg-white/20" />
            <div className="mb-3 font-ui text-[16px] font-bold text-sk-text">Фильтр XP</div>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.map((option) => {
                const active = option.tag === activeTag;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handleFilterSelect(option)}
                    className="rounded-[14px] border px-3.5 py-3 text-left font-ui text-sm font-semibold"
                    style={{
                      color: active ? 'rgb(var(--color-ink))' : 'rgb(var(--color-text))',
                      background: active ? 'rgb(var(--color-cyan))' : 'rgb(var(--color-surface) / 0.05)',
                      borderColor: active ? 'transparent' : 'rgb(var(--color-line) / 0.10)',
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Screen>
  );
}
