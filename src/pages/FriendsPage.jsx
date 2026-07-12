import { useState, useEffect } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Body, EmptyState, Screen, TgHeader, GlassCard } from '../components/ui.jsx';
import { fetchReferrals } from '../utils/api.js';

export function FriendsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferrals();
  }, []);

  async function loadReferrals() {
    try {
      setLoading(true);
      const res = await fetchReferrals();
      setData(res);
    } catch (err) {
      console.error('Failed to load referrals:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    if (!data?.referral_link) return;
    navigator.clipboard.writeText(data.referral_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Screen nav="home">
      <TgHeader title="Друзья" sub="ПРИГЛАШАЙ И ПОЛУЧАЙ XP" />
      <Body>
        <div className="flex flex-col gap-4">
          <GlassCard className="p-4 border-sk-cyan/30 bg-sk-cyan/5">
            <div className="font-ui text-[16px] font-bold text-white text-center">Пригласи друга!</div>
            <div className="mt-2 text-sm text-sk-text2 text-center leading-tight">
              Отправь ссылку другу. Когда он присоединится, вы оба получите бонусные <span className="text-sk-cyan font-bold">500 XP</span>!
            </div>
            
            {data && (
              <div className="mt-4 flex flex-col gap-2">
                <div className="text-[10px] font-mono text-sk-text3 uppercase">Твоя ссылка:</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/40 rounded-lg p-3 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs text-sk-text">
                    {data.referral_link}
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="flex-shrink-0 h-[40px] w-[40px] bg-sk-cyan rounded-lg flex items-center justify-center text-black active:scale-95 transition-transform"
                  >
                    <Icon name={copied ? "check" : "scan"} size={20} />
                  </button>
                </div>
              </div>
            )}
          </GlassCard>

          {loading ? (
             <div className="flex justify-center p-8 text-sk-text3">
               <Icon name="spinner" size={24} className="animate-spin" />
             </div>
          ) : data?.friends_list?.length > 0 ? (
            <div className="flex flex-col gap-2 mt-4">
              <div className="text-[12px] font-mono text-sk-text2 mb-2 uppercase">Твои приглашенные друзья ({data.total_friends})</div>
              {data.friends_list.map((friend, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-[12px] bg-sk-surface border border-sk-line/10">
                  <div className="h-8 w-8 rounded-full bg-sk-line/20 flex items-center justify-center text-white">
                    <Icon name="profile" size={16} />
                  </div>
                  <div className="flex-1 font-ui font-semibold text-white">{friend}</div>
                  <div className="font-mono text-xs text-sk-gold font-bold">+500 XP</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState title="Пока никого нет" text="Приглашай друзей и получай награды вместе с ними!" />
            </div>
          )}
        </div>
      </Body>
    </Screen>
  );
}
