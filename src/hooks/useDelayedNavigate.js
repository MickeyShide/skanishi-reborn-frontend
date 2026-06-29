import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useDelayedNavigate(to, delay) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate(to, { replace: true }), delay);
    return () => window.clearTimeout(timer);
  }, [delay, navigate, to]);
}
