import { Emblem, Wordmark } from '../components/Brand.jsx';
import { Screen } from '../components/ui.jsx';
import { useDelayedNavigate } from '../hooks/useDelayedNavigate.js';

export function SplashPage() {
  useDelayedNavigate('/login', 1150);

  return (
    <Screen>
      <div className="relative flex flex-1 flex-col items-center justify-center gap-[30px] px-6">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sk-line/10 opacity-60" />
        <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sk-line/10 opacity-50" />
        <Emblem size={108} />
        <Wordmark size={30} sub="AR Quest Protocol" />
        <div className="absolute bottom-[90px] flex items-center gap-2">
          {[0, 1, 2].map((item) => (
            <span key={item} className="dot h-[7px] w-[7px] rounded-full" style={{ background: item === 0 ? 'rgb(var(--color-cyan))' : 'rgb(var(--color-line) / 0.18)' }} />
          ))}
        </div>
        <div className="absolute bottom-[54px] font-mono text-[10px] tracking-[2px] text-sk-text3">ИНИЦИАЛИЗАЦИЯ · v0.9</div>
      </div>
    </Screen>
  );
}
