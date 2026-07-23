import { AppStateProvider, useAppState } from '../context/AppStateContext.jsx';
import { LoadingState } from './ui.jsx';

function StandalonePageContent({ children }) {
  const { isLoading, user } = useAppState();

  if (isLoading || !user) return <LoadingState />;
  return children;
}

export function StandalonePage({ children }) {
  return (
    <AppStateProvider>
      <StandalonePageContent>{children}</StandalonePageContent>
    </AppStateProvider>
  );
}
