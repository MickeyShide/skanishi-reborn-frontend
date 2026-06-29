import { createContext, useContext, useMemo, useReducer, useEffect } from 'react';
import {
  achievements,
  activeEvent,
  mapPins,
  nearbyPoints,
  pointDetails,
  profileLinks,
  quests,
  recentRewards,
  stats,
  user,
  xpHistoryGroups,
} from '../data/mockData.js';

const AppStateContext = createContext(null);

const initialState = {
  isLoading: true,
  error: null,
  rewardClaimed: false,
  user,
  activeEvent,
  quests,
  recentRewards,
  mapPins,
  nearbyPoints,
  pointDetails,
  stats,
  profileLinks,
  xpHistoryGroups,
  achievements,
};

function reducer(state, action) {
  switch (action.type) {
    case 'loaded':
      return { ...state, isLoading: false };
    case 'failed':
      return { ...state, isLoading: false, error: action.payload };
    case 'claimReward':
      return {
        ...state,
        rewardClaimed: true,
        user: { ...state.user, xp: Math.min(state.user.nextLevelXp, state.user.xp + 250) },
      };
    default:
      return state;
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timer = window.setTimeout(() => dispatch({ type: 'loaded' }), 250);
    return () => window.clearTimeout(timer);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      claimReward: () => dispatch({ type: 'claimReward' }),
    }),
    [state],
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
