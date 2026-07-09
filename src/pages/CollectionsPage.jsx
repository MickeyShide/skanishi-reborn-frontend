import { useState, useEffect } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Body, EmptyState, GlassCard, RarityTag, Screen, TgHeader } from '../components/ui.jsx';
import { fetchCollections, claimCollectionReward } from '../utils/api.js';
import { useAppState } from '../context/AppStateContext.jsx';

export function CollectionsPage() {
  const { refreshAppState } = useAppState();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingIds, setClaimingIds] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    try {
      setLoading(true);
      const data = await fetchCollections();
      setCollections(data || []);
    } catch (err) {
      console.error('Failed to load collections:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleClaim = async (collectionId) => {
    if (claimingIds.has(collectionId)) return;
    
    setClaimingIds((prev) => new Set([...prev, collectionId]));
    try {
      await claimCollectionReward(collectionId);
      // Reload collections to reflect claimed status
      await loadCollections();
      refreshAppState();
    } catch (err) {
      console.error('Failed to claim collection:', err);
    } finally {
      setClaimingIds((prev) => {
        const next = new Set(prev);
        next.delete(collectionId);
        return next;
      });
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  return (
    <Screen nav="profile">
      <TgHeader title="Коллекции" sub="СОБРАННЫЕ НАБОРЫ" />
      <Body>
        {loading ? (
          <div className="flex justify-center p-8 text-sk-text3">
            <Icon name="spinner" size={24} className="animate-spin" />
          </div>
        ) : collections.length === 0 ? (
          <EmptyState title="Коллекций пока нет" text="Собирайте предметы, чтобы заполнять коллекции." />
        ) : (
          <div className="flex flex-col gap-3">
            {collections.map((col) => {
              const expanded = expandedId === col.id;
              const canClaim = col.is_completed && !col.reward_claimed;
              
              return (
                <GlassCard key={col.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-ui text-[17px] font-bold text-sk-text">{col.name}</div>
                      <div className="mt-1 font-mono text-[10.5px] text-sk-text3">ПРОГРЕСС: {col.progress_percent}%</div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-sk-text2">
                    {col.description}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-sk-surface/10">
                      <div className="h-full rounded-full" style={{ width: `${col.progress_percent}%`, background: 'var(--gradient-primary)' }} />
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {col.items.map((item) => (
                        <div 
                          key={item.id} 
                          className={`flex aspect-square flex-col items-center justify-center rounded-lg border p-1 ${
                            item.is_acquired 
                              ? 'border-sk-cyan/30 bg-sk-cyan/10 text-sk-text' 
                              : 'border-sk-line/10 bg-sk-surface/5 text-sk-text3 opacity-50'
                          }`}
                        >
                          <Icon name="qr" size={20} />
                          <span className="mt-1 truncate w-full text-center font-mono text-[8px]">{item.number}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between rounded-[14px] border border-sk-line/10 bg-sk-surface/5 px-3.5 py-3">
                    <div className="flex items-center gap-2">
                      <Icon name="bolt" size={16} color="rgb(var(--color-gold))" />
                      <span className="font-mono text-sm font-bold text-sk-text">+{col.reward_xp} XP</span>
                    </div>
                    {canClaim ? (
                      <button
                        type="button"
                        onClick={() => handleClaim(col.id)}
                        disabled={claimingIds.has(col.id)}
                        className="rounded-lg bg-sk-cyan px-3 py-1.5 font-mono text-[11px] font-bold text-[#000]"
                      >
                        {claimingIds.has(col.id) ? 'ЗАБИРАЕМ...' : 'ЗАБРАТЬ'}
                      </button>
                    ) : col.reward_claimed ? (
                      <span className="font-mono text-[11px] text-sk-text3">ПОЛУЧЕНО</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleExpand(col.id)}
                        className="font-mono text-[11px] text-sk-cyan"
                      >
                        {expanded ? 'СВЕРНУТЬ' : 'ПРЕДМЕТЫ'}
                      </button>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </Body>
    </Screen>
  );
}
