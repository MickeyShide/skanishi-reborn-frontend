import { Icon } from '../components/Icon.jsx';
import { Body, GlassCard, Screen, TgHeader } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';

const colorVar = {
  cyan: 'rgb(var(--color-cyan))',
  violetHi: 'rgb(var(--color-violet-hi))',
  gold: 'rgb(var(--color-gold))',
  pink: 'rgb(var(--color-pink))',
};

export function XpHistoryPage() {
  const { xpHistoryGroups } = useAppState();

  return (
    <Screen>
      <TgHeader
        title="История XP"
        sub="СЕЗОН 2 · 6 840 XP"
        back
        right={<button type="button" className="rounded-[10px] border border-sk-cyan/25 bg-sk-cyan/10 px-[11px] py-[7px] font-mono text-[11px] text-sk-cyan">ФИЛЬТР</button>}
      />
      <Body pb="40px">
        <GlassCard glow="#3BE0FF" className="mb-2">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[10.5px] tracking-[1px] text-sk-text3">ЗА НЕДЕЛЮ</div>
              <div className="mt-1 font-mono text-[32px] font-bold text-sk-text">+2 145</div>
            </div>
            <div className="flex h-[46px] items-end gap-[5px]">
              {[40, 62, 30, 80, 55, 95, 70].map((height, index) => (
                <div
                  key={`${height}-${index}`}
                  className="w-[7px] rounded-[3px]"
                  style={{
                    height: `${height}%`,
                    background: index === 5 ? 'rgb(var(--color-cyan))' : 'rgba(139,108,255,0.45)',
                    boxShadow: index === 5 ? '0 0 8px rgb(var(--color-cyan))' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </GlassCard>

        {xpHistoryGroups.map((group) => (
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
    </Screen>
  );
}
