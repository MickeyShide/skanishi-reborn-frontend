import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { clearAccessToken, fetchAppState, fetchMapPoints, getTelegramInitData, loginWithTelegram, collectItemBySecret } from '../utils/api.js';

const AppStateContext = createContext(null);

const initialState = {
  isLoading: true,
  isAuthenticating: false,
  isAuthenticated: false,
  error: null,
  authError: null,
  isClaiming: false,
  claimError: null,
  lastClaimResult: null,
  rewardClaimed: false,
  selectedScanId: null,
  user: null,
  activeEvent: null,
  quests: [],
  recentRewards: [],
  mapPins: [],
  nearbyPoints: [],
  pointDetails: {},
  stats: [],
  profileLinks: [],
  xpHistoryGroups: [],
  achievements: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'loaded':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isAuthenticating: false,
        isAuthenticated: true,
        error: null,
        authError: null,
      };
    case 'authStart':
      return {
        ...state,
        isAuthenticating: true,
        authError: null,
      };
    case 'authRequired':
      return {
        ...state,
        isLoading: false,
        isAuthenticating: false,
        isAuthenticated: false,
        authError: action.payload,
      };
    case 'failed':
      return { ...state, isLoading: false, error: action.payload };
    case 'mapLoaded':
      return {
        ...state,
        mapPins: action.payload.mapPins,
        nearbyPoints: action.payload.nearbyPoints,
        pointDetails: action.payload.pointDetails,
      };
    case 'selectScanPoint':
      return {
        ...state,
        selectedScanId: action.payload,
        rewardClaimed: false,
        claimError: null,
        lastClaimResult: null,
      };
    case 'claimStart':
      return {
        ...state,
        isClaiming: true,
        claimError: null,
      };
    case 'claimRewardSuccess':
      return {
        ...state,
        isClaiming: false,
        rewardClaimed: true,
        claimError: null,
        lastClaimResult: action.payload,
      };
    case 'claimRewardFailed':
      return {
        ...state,
        isClaiming: false,
        claimError: action.payload,
      };
    case 'clearClaimState':
      return {
        ...state,
        rewardClaimed: false,
        claimError: null,
        lastClaimResult: null,
      };
    default:
      return state;
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const bootstrap = useCallback(async () => {
    try {
      const data = await fetchAppState();
      dispatch({ type: 'loaded', payload: data });
      return;
    } catch (error) {
      if (error?.status !== 401 && error?.status !== 403) {
        dispatch({ type: 'failed', payload: error.message || 'Не удалось загрузить приложение.' });
        return;
      }
    }

    const initData = getTelegramInitData();

    if (!initData) {
      clearAccessToken();
      dispatch({ type: 'authRequired', payload: null });
      return;
    }

    try {
      await loginWithTelegram(initData);
      const data = await fetchAppState();
      dispatch({ type: 'loaded', payload: data });
    } catch (error) {
      clearAccessToken();
      dispatch({ type: 'authRequired', payload: error.message || 'Не удалось войти через Telegram.' });
    }
  }, []);

  useEffect(() => {
    let canceled = false;

    bootstrap().catch((error) => {
      if (!canceled) {
        dispatch({ type: 'failed', payload: error.message || 'Не удалось инициализировать приложение.' });
      }
    });

    return () => {
      canceled = true;
    };
  }, [bootstrap]);

  const handleLogin = useCallback(async () => {
    dispatch({ type: 'authStart' });

    try {
      await loginWithTelegram();
      const data = await fetchAppState();
      dispatch({ type: 'loaded', payload: data });
      return data;
    } catch (error) {
      clearAccessToken();
      dispatch({ type: 'authRequired', payload: error.message || 'Не удалось войти через Telegram.' });
      throw error;
    }
  }, []);

  const refreshMap = useCallback(async (params = {}) => {
    const data = await fetchMapPoints(params);
    dispatch({ type: 'mapLoaded', payload: data });
    return data;
  }, []);

  const selectScanPoint = useCallback((scanId) => {
    dispatch({ type: 'selectScanPoint', payload: scanId ?? null });
  }, []);

  const clearClaimState = useCallback(() => {
    dispatch({ type: 'clearClaimState' });
  }, []);

  const handleCollectItem = useCallback(
    async (token) => {
      if (!token) {
        const error = new Error('Токен не передан.');
        dispatch({ type: 'claimRewardFailed', payload: error.message });
        throw error;
      }

      dispatch({ type: 'claimStart' });

      try {
        const res = await collectItemBySecret(token);
        dispatch({ type: 'claimRewardSuccess', payload: res });
        return res;
      } catch (error) {
        dispatch({ type: 'claimRewardFailed', payload: error.message || 'Не удалось получить предмет.' });
        throw error;
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      ...state,
      loginWithTelegram: handleLogin,
      refreshMapPoints: refreshMap,
      selectScanPoint,
      clearClaimState,
      claimReward: handleCollectItem,
    }),
    [clearClaimState, handleCollectItem, handleLogin, refreshMap, selectScanPoint, state],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }

  return context;
}
