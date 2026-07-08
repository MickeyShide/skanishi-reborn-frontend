import { useEffect, useRef } from 'react';
import { useAppState } from '../context/AppStateContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getStoredAccessToken } from '../utils/api.js';

export function useSSE() {
  const { isAuthenticated, dispatch } = useAppState();
  const { showToast } = useToast();
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    // Depending on deployment, API might be on a different origin. In Vite dev server it's proxied.
    const token = getStoredAccessToken();
    const url = token ? `/api/v1/stream/events?token=${token}` : '/api/v1/stream/events';
    const eventSource = new EventSource(url, {
      withCredentials: true,
    });

    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'xp_gained') {
          dispatch({ type: 'sseXpGained', payload: data });
          showToast(`+${data.xp} XP!`, 'success');
        } else if (data.type === 'level_up') {
          dispatch({ type: 'sseLevelUp', payload: data });
          showToast(`🎉 Новый уровень: ${data.new_level}!`, 'levelup', 6000);
        }
      } catch (e) {
        console.error('Failed to parse SSE message', e);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Connection Error:', error);
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isAuthenticated, dispatch, showToast]);
}
