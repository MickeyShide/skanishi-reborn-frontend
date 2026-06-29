import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon.jsx';
import { RarityTag, Screen, TgHeader } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';
import { getRarityColor } from '../utils/format.js';

const filters = ['Все', 'Не пройдено', 'Редкие', 'Секреты'];

export function MapPage() {
  const navigate = useNavigate();
  const { mapPins, nearbyPoints } = useAppState();

  return (
    <Screen nav="map" glow={false}>
      <div className="absolute left-0 right-0 top-0 h-[64%] bg-[radial-gradient(circle_at_50%_40%,#15131f,#0a0912)]">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 L40 45 L55 30 L100 38" stroke="rgba(255,255,255,0.07)" strokeWidth="3" fill="none" />
          <path d="M20 0 L28 50 L24 100" stroke="rgba(255,255,255,0.07)" strokeWidth="3" fill="none" />
          <path d="M70 0 L62 55 L80 100" stroke="rgba(255,255,255,0.07)" strokeWidth="3" fill="none" />
          <path d="M0 75 L100 70" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" fill="none" />
        </svg>

        {mapPins.map((pin) => {
          const color = getRarityColor(pin.rarity);
          const size = pin.big ? 16 : 11;

          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => navigate(`/point/${pin.id}`)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              aria-label={pin.name}
            >
              {pin.big && <span className="pulse absolute left-1/2 top-1/2 h-11 w-11 rounded-full" style={{ background: `color-mix(in srgb, ${color} 20%, transparent)` }} />}
              <span
                className="block rounded-full"
                style={{
                  width: size,
                  height: size,
                  background: color,
                  boxShadow: `0 0 ${pin.big ? 16 : 8}px ${color}, 0 0 0 2px rgba(10,9,18,0.6)`,
                }}
              />
            </button>
          );
        })}

        <div className="absolute left-[46%] top-[40%] -translate-x-1/2 -translate-y-1/2">
          <div className="pulse absolute left-1/2 top-1/2 h-[60px] w-[60px] rounded-full bg-sk-cyan/20" />
          <div className="h-4 w-4 rounded-full border-[3px] border-white bg-sk-cyan shadow-[0_0_14px_rgb(var(--color-cyan))]" />
        </div>
      </div>

      <TgHeader title="Карта" sub="6 ТОЧЕК В РАДИУСЕ 1 КМ" />

      <div className="noscroll safe-page-x absolute inset-x-0 top-[calc(var(--safe-area-top)+116px)] z-[6] flex gap-2 overflow-x-auto">
        {filters.map((filter, index) => (
          <button
            key={filter}
            type="button"
            className="shrink-0 rounded-full border px-3.5 py-2 font-ui text-[12.5px]"
            style={{
              color: index === 0 ? 'rgb(var(--color-ink))' : 'rgb(var(--color-text2))',
              background: index === 0 ? 'rgb(var(--color-cyan))' : 'rgba(20,18,32,0.8)',
              borderColor: index === 0 ? 'transparent' : 'rgb(var(--color-line) / 0.10)',
              fontWeight: index === 0 ? 700 : 500,
              backdropFilter: 'blur(8px)',
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[7] flex h-[42%] flex-col rounded-t-[28px] border border-b-0 border-sk-line/20 bg-[linear-gradient(180deg,#14121f,#0c0a15)] shadow-[0_-16px_50px_rgba(0,0,0,0.55)]">
        <div className="mx-auto mb-2 mt-3 h-[5px] w-11 rounded-full bg-white/20" />
        <div className="flex items-center justify-between px-[18px] pb-2 pt-1">
          <span className="font-ui text-[15px] font-semibold text-sk-text">Точки рядом</span>
          <span className="font-mono text-[10.5px] text-sk-text3">ПО РАССТОЯНИЮ</span>
        </div>
        <div className="noscroll flex-1 overflow-y-auto px-3.5 pb-[calc(88px+var(--safe-area-bottom))]">
          {nearbyPoints.map((point) => {
            const color = getRarityColor(point.rarity);

            return (
              <button
                key={point.id}
                type="button"
                onClick={() => navigate(`/point/${point.id}`)}
                className="flex w-full items-center gap-[13px] border-b border-sk-line/10 px-2 py-3 text-left last:border-b-0 active:scale-[0.99]"
              >
                <div
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px] border"
                  style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, borderColor: `color-mix(in srgb, ${color} 25%, transparent)` }}
                >
                  <Icon name="map" size={20} color={color} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-ui text-[14.5px] font-semibold text-sk-text">{point.name}</span>
                    {point.done && <Icon name="check" size={14} color="rgb(var(--color-green))" sw={2.4} />}
                  </div>
                  <div className="mt-1 font-mono text-[10.5px] text-sk-text3">
                    {point.category} · {point.distance}
                  </div>
                </div>
                <RarityTag rarity={point.rarity} />
              </button>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
