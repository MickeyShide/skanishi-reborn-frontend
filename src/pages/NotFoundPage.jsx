import { Link } from 'react-router-dom';
import { EmptyState, PrimaryButton, Screen } from '../components/ui.jsx';

export function NotFoundPage() {
  return (
    <Screen>
      <div className="safe-page-x flex flex-1 flex-col justify-center gap-4">
        <EmptyState title="404 · Экран не найден" text="Маршрут не входит в текущий протокол Skanshi." />
        <Link to="/" className="flex h-[54px] w-full items-center justify-center rounded-2xl font-ui text-base font-bold text-sk-ink shadow-[0_0_26px_rgba(139,108,255,0.40)]" style={{ background: 'var(--gradient-primary)' }}>
          На главную
        </Link>
      </div>
    </Screen>
  );
}

export default NotFoundPage;
