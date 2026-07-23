import { useState, useEffect } from 'react';
import { fetchDailyStatus, claimDailyReward } from '../utils/api';
import { useAppState } from '../context/AppStateContext';
import './DailyRewardWidget.css';

function ControlledDailyRewardWidget({ streakDays = 0, hasClaimedToday = false, onClaim }) {
  const [claimed, setClaimed] = useState(hasClaimedToday);

  const handleClaim = () => {
    if (claimed) return;
    onClaim?.();
    setClaimed(true);
  };

  return (
    <div className={`daily-reward-widget ${claimed ? 'claimed' : 'available'}`}>
      <div className="daily-reward-info">
        <h3>Ежедневная награда</h3>
        <p className="daily-reward-streak">День {streakDays}</p>
      </div>
      <button className="daily-reward-btn" onClick={handleClaim} disabled={claimed}>
        {claimed ? 'Получено' : 'Получить'}
      </button>
    </div>
  );
}

function ConnectedDailyRewardWidget() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const { refreshAppState } = useAppState();

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      setLoading(true);
      const data = await fetchDailyStatus();
      setStatus(data);
    } catch (err) {
      console.error('Failed to load daily status:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleClaim() {
    if (!status || status.claimed_today || claiming) return;

    try {
      setClaiming(true);
      const data = await claimDailyReward();
      // Show celebration toast here eventually
      
      // Update local state instantly
      setStatus({
        ...status,
        claimed_today: true,
        current_streak: data.current_streak,
        streak_multiplier: data.streak_multiplier,
      });

      // Refresh global app state to reflect XP changes
      refreshAppState();
    } catch (err) {
      console.error('Failed to claim daily reward:', err);
    } finally {
      setClaiming(false);
    }
  }

  if (loading) return null; // Or a skeleton loader
  if (!status) return null;

  const { claimed_today, current_streak, xp_reward, next_reward_xp, streak_multiplier } = status;

  return (
    <div className={`daily-reward-widget ${claimed_today ? 'claimed' : 'available'}`}>
      <div className="daily-reward-content">
        <div className="daily-reward-icon">
          <i className="fa-solid fa-gift"></i>
          {streak_multiplier > 1 && (
            <span className="streak-badge">x{streak_multiplier}</span>
          )}
        </div>
        <div className="daily-reward-info">
          <h3>Ежедневная награда</h3>
          <p className="daily-reward-xp">
            +{claimed_today ? next_reward_xp : xp_reward} XP
          </p>
          <p className="daily-reward-streak">
            День {current_streak + (claimed_today ? 0 : 1)}
          </p>
        </div>
      </div>
      
      <button 
        className="daily-reward-btn" 
        onClick={handleClaim} 
        disabled={claimed_today || claiming}
      >
        {claiming ? 'Забираем...' : claimed_today ? 'Получено' : 'Забрать'}
      </button>
    </div>
  );
}

export function DailyRewardWidget(props) {
  if (Object.prototype.hasOwnProperty.call(props, 'streakDays')) {
    return <ControlledDailyRewardWidget {...props} />;
  }

  return <ConnectedDailyRewardWidget />;
}

export default DailyRewardWidget;
