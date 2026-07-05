import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon.jsx';
import { GlassCard, PrimaryButton, RarityTag, Screen } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';

export function ScanResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { claimReward, rewardClaimed, isClaiming, claimError, lastClaimResult, selectedScanId, pointDetails, mapPins, selectScanPoint } = useAppState();

  const activeScanId = location.state?.scanId ?? selectedScanId;

  useEffect(() => {
    if (location.state?.scanId) {
      selectScanPoint(location.state.scanId);
    }
  }, [location.state, selectScanPoint]);

  const selectedPoint = useMemo(() => {
    if (!activeScanId) return null;
    return pointDetails[activeScanId] ?? mapPins.find((point) => point.id === activeScanId) ?? null;
  }, [activeScanId, mapPins, pointDetails]);

  const claimedXp = lastClaimResult?.xp ?? selectedPoint?.reward ?? 0;

  const handleClaim = async () => {
    try {
      await claimReward(activeScanId);
      navigate('/home');
    } catch {
      // Error is already shown from context state.
    }
  };

  return (
    <Screen glow={false}>
      <div className="absolute inset-0 bg-sk-bg">
        <div className="absolute -right-10 -top-16 h-[260px] w-[260px] rounded-full bg-sk-violet/40 blur-[28px]" />
        <div className="absolute inset-0 bg-sk-bg/55 backdrop-blur-sm" />
      </div>
      <div className="absolute left-1/2 top-[120px] h-80 w-80 -translate-x-1/2 rounded-full bg-sk-violetHi/40 blur-2xl" />

      <div className="absolute inset-x-0 bottom-0 z-[5] rounded-t-[30px] border border-b-0 border-sk-line/20 bg-[linear-gradient(180deg,#16121f,#0d0b16)] px-5 pb-[calc(var(--safe-area-bottom)+36px)] pt-3.5 shadow-[0_-20px_60px_rgba(0,0,0,0.6)]">
        <div className="mx-auto mb-[18px] h-[5px] w-11 rounded-full bg-white/20" />

        <div className="text-center">
          <div className="font-mono text-[11px] tracking-[3px] text-sk-cyan">СКАН УСПЕШЕН</div>
          <div className="mt-2 font-mono text-[52px] font-bold leading-none text-sk-text [text-shadow:0_0_30px_rgb(var(--color-violet))]">
            +{claimedXp}<span className="ml-1.5 text-[22px] text-sk-cyan">XP</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-sk-gold/30 bg-sk-gold/10 px-3 py-1.5">
            <Icon name="bolt" size={13} color="rgb(var(--color-gold))" />
            <span className="font-mono text-[11px] font-bold text-sk-gold">×3 БОНУС ИВЕНТА</span>
          </div>
        </div>

        <div className="holo mt-[22px] rounded-card p-[1.5px]" style={{ background: 'var(--gradient-holo)', backgroundSize: '200% 200%' }}>
          <div className="flex items-center gap-[15px] rounded-[18px] bg-[linear-gradient(135deg,#181426,#100d1a)] p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-sk-pink/40 bg-sk-pink/15 shadow-[0_0_22px_rgba(255,108,200,0.5)]">
              <Icon name="gem" size={36} color="rgb(var(--color-pink))" />
            </div>
            <div className="min-w-0 flex-1">
              <RarityTag rarity="mythic" />
              <div className="mt-2 truncate font-ui text-[17px] font-bold text-sk-text">{selectedPoint?.name ?? 'Выбранная точка'}</div>
              <div className="mt-0.5 font-ui text-xs text-sk-text2">{selectedPoint?.quest ?? 'Награда будет зачислена после подтверждения backend.'}</div>
            </div>
          </div>
        </div>

        <GlassCard className="mt-3.5 p-3.5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="font-ui text-[13.5px] text-sk-text2">Квест «Тени Старого города»</span>
            <span className="font-mono text-[11px] text-sk-cyan">4 / 5</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-sk-surface/10">
            <div className="h-full w-4/5 rounded-full" style={{ background: 'var(--gradient-primary)' }} />
          </div>
        </GlassCard>

        {claimError && <div className="mt-3 text-center font-ui text-[12.5px] text-sk-pink">{claimError}</div>}

        <div className="mt-5">
          <PrimaryButton onClick={handleClaim}>{rewardClaimed ? 'Награда получена' : isClaiming ? 'Забираем…' : 'Забрать награду'}</PrimaryButton>
        </div>
        <button type="button" onClick={() => navigate('/scan')} className="mt-3.5 w-full text-center font-ui text-[13px] text-sk-text3">
          Сканировать ещё
        </button>
      </div>
    </Screen>
  );
}
