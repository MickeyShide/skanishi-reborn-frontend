import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon.jsx';
import { GlassCard, PrimaryButton, RarityTag, Screen } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';

export function PointDetailPage() {
  const navigate = useNavigate();
  const { pointId } = useParams();
  const { pointDetails } = useAppState();
  const point = useMemo(() => pointDetails[pointId] ?? pointDetails['roof-beacon'], [pointDetails, pointId]);

  return (
    <Screen glow={false}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#15131f,#0a0912)]">
        <div className="grid-bg absolute inset-0 opacity-45" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,18,0.3),transparent_30%,rgba(10,9,18,0.95))]" />
      </div>

      <div className="safe-page-x relative z-[6] pt-[calc(var(--safe-area-top)+56px)]">
        <button
          type="button"
          onClick={() => navigate('/map')}
          aria-label="Назад"
          className="glass flex h-[38px] w-[38px] scale-x-[-1] items-center justify-center rounded-xl text-sk-text backdrop-blur-lg"
        >
          <Icon name="chev" size={20} color="rgb(var(--color-text))" />
        </button>
      </div>

      <div className="absolute left-1/2 top-[120px] z-[5] flex -translate-x-1/2 flex-col items-center gap-4">
        <div className="relative">
          <div className="pulse absolute left-1/2 top-1/2 h-[130px] w-[130px] rounded-full bg-sk-violetHi/25" />
          <div className="holo h-24 w-24 rounded-[26px] p-0.5 shadow-[0_0_36px_rgba(139,108,255,0.53)]" style={{ background: 'var(--gradient-holo)', backgroundSize: '200% 200%' }}>
            <div className="flex h-full w-full items-center justify-center rounded-3xl bg-sk-bg">
              <Icon name="map" size={44} color="rgb(var(--color-violet-hi))" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[6] rounded-t-[30px] border border-b-0 border-sk-line/20 bg-[linear-gradient(180deg,#16121f,#0c0a15)] px-5 pb-[calc(var(--safe-area-bottom)+38px)] pt-[22px] shadow-[0_-20px_60px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2">
          <RarityTag rarity={point.rarity} />
          <span className="font-mono text-[10.5px] text-sk-text3">
            {point.category} · {point.distance}
          </span>
        </div>
        <h1 className="m-0 mt-3 font-ui text-2xl font-bold tracking-normal text-sk-text">{point.name}</h1>
        <p className="mt-2 font-ui text-sm leading-relaxed text-sk-text2">{point.description}</p>

        <div className="mt-4 flex gap-2.5">
          <GlassCard className="flex-1 rounded-[14px] p-3.5 shadow-none">
            <div className="font-mono text-[9.5px] tracking-[1px] text-sk-text3">НАГРАДА</div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Icon name="bolt" size={15} color="rgb(var(--color-cyan))" />
              <span className="font-mono text-[15px] font-bold text-sk-text">{point.reward} XP</span>
            </div>
          </GlassCard>
          <GlassCard className="flex-1 rounded-[14px] p-3.5 shadow-none">
            <div className="font-mono text-[9.5px] tracking-[1px] text-sk-text3">СТАТУС</div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="h-[7px] w-[7px] rounded-full bg-sk-gold shadow-[0_0_6px_rgb(var(--color-gold))]" />
              <span className="font-ui text-[13.5px] font-semibold text-sk-text">{point.status}</span>
            </div>
          </GlassCard>
        </div>

        <button type="button" className="mt-3 flex w-full items-center gap-3 rounded-[14px] border border-sk-violetHi/20 bg-sk-violetHi/10 p-[13px] text-left active:scale-[0.99]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-sk-violetHi/20">
            <Icon name="quest" size={18} color="rgb(var(--color-violet-hi))" />
          </div>
          <div className="flex-1">
            <div className="font-mono text-[9.5px] tracking-[1px] text-sk-text3">КВЕСТ</div>
            <div className="mt-0.5 truncate font-ui text-sm font-semibold text-sk-text">{point.quest}</div>
          </div>
          <Icon name="chev" size={18} color="rgb(var(--color-text3))" />
        </button>

        <div className="mt-[18px] flex gap-3">
          <button type="button" className="glass flex h-[54px] w-14 shrink-0 items-center justify-center rounded-2xl">
            <Icon name="route" size={22} color="rgb(var(--color-text))" />
          </button>
          <PrimaryButton onClick={() => navigate('/scan')} icon={<Icon name="qr" size={20} color="rgb(var(--color-ink))" sw={2} />}>
            Сканировать
          </PrimaryButton>
        </div>
      </div>
    </Screen>
  );
}
