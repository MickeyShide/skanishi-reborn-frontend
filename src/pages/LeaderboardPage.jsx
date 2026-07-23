import { useState, useEffect } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Body, EmptyState, Screen, TgHeader, GlassCard } from '../components/ui.jsx';
import { fetchLeaderboard } from '../utils/api.js';
import { useAppState } from '../context/AppStateContext.jsx';
import { formatNumber } from '../utils/format.js';
import { Avatar } from '../components/ui.jsx';
import { StandalonePage } from '../components/StandalonePage.jsx';

export function LeaderboardPage() {
  const { user } = useAppState();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    try {
      setLoading(true);
      const data = await fetchLeaderboard();
      setLeaders(data || []);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }

  const myRank = leaders.findIndex((u) => u.id === user.id) + 1;
  const isMeTop = myRank > 0;

  return (
    <Screen nav="home">
      <TgHeader title="Рейтинг" sub="ЛУЧШИЕ ОХОТНИКИ СЕЗОНА" />
      <Body>
        <div className="flex flex-col gap-3">
          {/* User's current standing if they are not in the top */}
          {!isMeTop && !loading && (
            <GlassCard className="mb-2 p-3 bg-sk-pink/5 border-sk-pink/20">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center font-mono text-[14px] font-bold text-sk-pink">
                  {user.rank || '-'}
                </div>
                <Avatar size={40} seed={user.id} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-ui text-[15px] font-bold text-white">@{user.username}</div>
                  <div className="font-mono text-[10px] text-sk-text3">ВЫ</div>
                </div>
                <div className="font-mono text-[15px] font-bold text-sk-cyan">
                  {formatNumber(user.xp)}
                </div>
              </div>
            </GlassCard>
          )}

          {loading ? (
            <div className="flex justify-center p-8 text-sk-text3">
              <Icon name="spinner" size={24} className="animate-spin" />
            </div>
          ) : leaders.length === 0 ? (
            <EmptyState title="Рейтинг пуст" text="Пока нет игроков в публичном рейтинге." />
          ) : (
            leaders.map((leader, index) => {
              const rank = index + 1;
              const isMe = leader.id === user.id;
              
              let rankColor = 'text-sk-text3';
              let bgColor = '';
              if (rank === 1) {
                rankColor = 'text-sk-gold';
                bgColor = 'bg-sk-gold/5 border-sk-gold/20';
              } else if (rank === 2) {
                rankColor = 'text-gray-300';
              } else if (rank === 3) {
                rankColor = 'text-orange-300';
              }

              return (
                <GlassCard key={leader.id} className={`p-3 ${bgColor} ${isMe ? 'ring-1 ring-sk-cyan/50 bg-sk-cyan/5' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center font-mono text-[14px] font-bold ${rankColor}`}>
                      {rank}
                    </div>
                    
                    <Avatar size={40} seed={leader.id} />
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <div className={`truncate font-ui text-[15px] font-bold ${isMe ? 'text-sk-cyan' : 'text-white'}`}>
                          @{leader.username}
                        </div>
                        {isMe && <span className="rounded bg-sk-cyan/20 px-1 py-0.5 font-mono text-[9px] text-sk-cyan">ВЫ</span>}
                      </div>
                      <div className="font-mono text-[10px] text-sk-text3">LVL {leader.level}</div>
                    </div>
                    
                    <div className="font-mono text-[15px] font-bold text-sk-cyan">
                      {formatNumber(leader.xp)}
                    </div>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </Body>
    </Screen>
  );
}

export default function LeaderboardPageStandalone(props) {
  return <StandalonePage><LeaderboardPage {...props} /></StandalonePage>;
}
