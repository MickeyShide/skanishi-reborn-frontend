import { useNavigate } from 'react-router-dom';
import { EmptyState, PrimaryButton, Screen } from '../components/ui.jsx';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Screen>
      <div className="safe-page-x flex flex-1 flex-col justify-center gap-4">
        <EmptyState title="Экран не найден" text="Маршрут не входит в текущий протокол Skanshi." />
        <PrimaryButton onClick={() => navigate('/home')}>На главную</PrimaryButton>
      </div>
    </Screen>
  );
}
