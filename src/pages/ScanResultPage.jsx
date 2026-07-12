import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon.jsx';
import { PrimaryButton, RarityTag, Screen } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';

import { useScanner } from '../hooks/useScanner.js';

export function ScanResultPage() {
  const navigate = useNavigate();
  const { claimReward, claimError, lastClaimResult, clearClaimState } = useAppState();
  const { handleScan } = useScanner();

  const item = lastClaimResult?.item;
  const status = lastClaimResult?.status; // 'created' | 'already_collected'

  const handleClose = () => {
    clearClaimState();
    navigate('/home');
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
          {claimError === 'QR_ON_COOLDOWN' ? (
            <>
              <div className="font-mono text-[11px] tracking-[3px] text-sk-violetHi">ОШИБКА</div>
              <div className="mt-2 font-mono text-[28px] font-bold leading-tight text-sk-text [text-shadow:0_0_30px_rgb(var(--color-pink))]">
                ТОЧКА НА КУЛДАУНЕ
              </div>
            </>
          ) : claimError ? (
            <>
              <div className="font-mono text-[11px] tracking-[3px] text-sk-pink">ОШИБКА</div>
              <div className="mt-2 font-mono text-[28px] font-bold leading-tight text-sk-text [text-shadow:0_0_30px_rgb(var(--color-pink))]">
                СБОЙ СКАНА
              </div>
            </>
          ) : (
            <>
              <div className="font-mono text-[11px] tracking-[3px] text-sk-cyan">СКАН УСПЕШЕН</div>
              <div className="mt-2 font-mono text-[28px] font-bold leading-tight text-sk-text [text-shadow:0_0_30px_rgb(var(--color-violet))]">
                {status === 'already_collected' ? 'УЖЕ ПОЛУЧЕНО' : 'ПРЕДМЕТ НАЙДЕН'}
              </div>
            </>
          )}
        </div>

        {lastClaimResult?.is_first_blood && (
          <div className="mx-auto mt-4 mb-2 flex w-max items-center gap-1.5 rounded-full border border-sk-gold/40 bg-[linear-gradient(90deg,rgba(255,215,0,0.1),rgba(255,165,0,0.1))] px-3 py-1 text-sk-gold shadow-[0_0_15px_rgba(255,215,0,0.3)] animate-pulse">
            <Icon name="star" size={14} color="currentColor" />
            <span className="font-ui text-[12px] font-bold uppercase tracking-wider">Первооткрыватель</span>
          </div>
        )}

        {item && (
          <div className="holo mt-[22px] rounded-card p-[1.5px]" style={{ background: 'var(--gradient-holo)', backgroundSize: '200% 200%' }}>
            <div className="flex items-center gap-[15px] rounded-[18px] bg-[linear-gradient(135deg,#181426,#100d1a)] p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-sk-pink/40 bg-sk-pink/15 shadow-[0_0_22px_rgba(255,108,200,0.5)]">
                {item.type?.photo_url ? (
                  <img src={item.type.photo_url} alt="" className="h-10 w-10 object-contain" />
                ) : (
                  <Icon name="gem" size={36} color="rgb(var(--color-pink))" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <RarityTag rarity="mythic" />
                <div className="mt-2 truncate font-ui text-[17px] font-bold text-sk-text">{item.title}</div>
                <div className="mt-0.5 font-ui text-xs text-sk-text2">{item.category?.title || 'Секретный предмет'}</div>
              </div>
            </div>
          </div>
        )}
        
        {lastClaimResult?.rewards?.length > 0 && status !== 'already_collected' && (
          <div className="mt-6 flex flex-col gap-2">
            {lastClaimResult.rewards.map((reward, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 animate-sheetIn" style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}>
                <div className="flex items-center gap-3">
                  {reward.type === 'xp' ? (
                    <Icon name="bolt" size={24} color="rgb(var(--color-cyan))" />
                  ) : reward.type === 'coin' ? (
                    <Icon name="coin" size={24} color="rgb(var(--color-gold))" />
                  ) : (
                    <Icon name="fragment" size={24} color="rgb(var(--color-pink))" />
                  )}
                  <span className="font-ui text-[15px] font-semibold text-sk-text">{reward.name}</span>
                </div>
                <span className="font-mono text-[16px] font-bold" style={{ color: reward.type === 'xp' ? 'rgb(var(--color-cyan))' : reward.type === 'coin' ? 'rgb(var(--color-gold))' : 'rgb(var(--color-pink))' }}>
                  +{reward.amount}
                </span>
              </div>
            ))}
          </div>
        )}

        {claimError === 'QR_ON_COOLDOWN' && (
          <div className="mt-6 text-center font-ui text-[14px] text-sk-text2">
            Кто-то уже отсканировал этот код. Он восстановится в течение 24 часов!
          </div>
        )}
        
        {claimError && claimError !== 'QR_ON_COOLDOWN' && (
          <div className="mt-6 text-center font-ui text-[14px] text-sk-pink">{claimError}</div>
        )}

        <div className="mt-8">
          <PrimaryButton onClick={handleClose}>На главную</PrimaryButton>
        </div>
        <button type="button" onClick={() => {
          clearClaimState();
          handleScan();
        }} className="mt-3.5 w-full text-center font-ui text-[13px] text-sk-text3">
          Сканировать ещё
        </button>
      </div>
    </Screen>
  );
}
