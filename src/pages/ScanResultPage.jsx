import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon.jsx';
import { PrimaryButton, RarityTag, Screen } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';

export function ScanResultPage() {
  const navigate = useNavigate();
  const { claimError, lastClaimResult, clearClaimState } = useAppState();

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
          <div className="font-mono text-[11px] tracking-[3px] text-sk-cyan">СКАН УСПЕШЕН</div>
          <div className="mt-2 font-mono text-[28px] font-bold leading-tight text-sk-text [text-shadow:0_0_30px_rgb(var(--color-violet))]">
            {status === 'already_collected' ? 'УЖЕ ПОЛУЧЕНО' : 'ПРЕДМЕТ НАЙДЕН'}
          </div>
        </div>

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

        {claimError && <div className="mt-6 text-center font-ui text-[14px] text-sk-pink">{claimError}</div>}

        <div className="mt-8">
          <PrimaryButton onClick={handleClose}>На главную</PrimaryButton>
        </div>
        <button type="button" onClick={() => { clearClaimState(); navigate('/scan'); }} className="mt-3.5 w-full text-center font-ui text-[13px] text-sk-text3">
          Сканировать ещё
        </button>
      </div>
    </Screen>
  );
}
