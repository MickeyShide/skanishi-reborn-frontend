import { useState, useEffect } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Body, EmptyState, Screen, TgHeader, GlassCard } from '../components/ui.jsx';
import { fetchShop, buyShopItem, equipShopItem, craftShopItem } from '../utils/api.js';
import { useAppState } from '../context/AppStateContext.jsx';


export function ShopPage() {
  const { user, refreshAppState } = useAppState();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShop();
  }, []);

  async function loadShop() {
    try {
      setLoading(true);
      const res = await fetchShop();
      setItems(res);
    } catch (err) {
      console.error('Failed to load shop:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleBuy(id) {
    try {
      await buyShopItem(id);
      await loadShop();
      await refreshAppState();
    } catch (err) {
      alert(err.message || 'Ошибка покупки');
    }
  }

  async function handleCraft(id) {
    try {
      await craftShopItem(id);
      await loadShop();
      await refreshAppState();
    } catch (err) {
      alert(err.message || 'Ошибка крафта');
    }
  }

  async function handleEquip(id) {
    try {
      await equipShopItem(id);
      await loadShop();
      await refreshAppState();
    } catch (err) {
      alert(err.message || 'Ошибка экипировки');
    }
  }

  const borders = items.filter(i => i.item_type === 'border');
  const backgrounds = items.filter(i => i.item_type === 'background');

  return (
    <Screen nav="home">
      <TgHeader title="Магазин" sub={`Твои коины: ${user?.coins || 0} 💰`} />
      <Body>
        {loading ? (
          <div className="flex justify-center p-8 text-sk-text3">
            <Icon name="spinner" size={24} className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
              {['common', 'rare', 'epic', 'legendary', 'mythic'].map(r => {
                const count = user?.[`fragments_${r}`] || 0;
                if (count === 0 && r !== 'common') return null;
                const colors = {
                  common: 'text-sk-text3',
                  rare: 'text-sk-cyan',
                  epic: 'text-sk-pink',
                  legendary: 'text-sk-gold',
                  mythic: 'text-sk-violetHi'
                };
                return (
                  <div key={r} className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5">
                    <Icon name="fragment" size={16} className={colors[r]} />
                    <span className="font-mono text-[13px] font-bold text-sk-text">{count}</span>
                  </div>
                );
              })}
            </div>
            
            {borders.length > 0 && (
              <div>
                <div className="text-[12px] font-mono text-sk-text2 mb-2 uppercase">Рамки профиля</div>
                <div className="grid grid-cols-2 gap-3">
                  {borders.map(item => (
                    <ShopCard 
                      key={item.id} 
                      item={item} 
                      user={user}
                      onBuy={() => handleBuy(item.id)} 
                      onCraft={() => handleCraft(item.id)}
                      onEquip={() => handleEquip(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {backgrounds.length > 0 && (
              <div>
                <div className="text-[12px] font-mono text-sk-text2 mb-2 uppercase">Фоны профиля</div>
                <div className="grid grid-cols-2 gap-3">
                  {backgrounds.map(item => (
                    <ShopCard 
                      key={item.id} 
                      item={item} 
                      user={user}
                      onBuy={() => handleBuy(item.id)} 
                      onCraft={() => handleCraft(item.id)}
                      onEquip={() => handleEquip(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {items.length === 0 && (
              <EmptyState title="Магазин пуст" text="Новые товары скоро появятся!" />
            )}

          </div>
        )}
      </Body>
    </Screen>
  );
}

function ShopCard({ item, user, onBuy, onCraft, onEquip }) {
  const canBuy = (user?.coins || 0) >= item.price;
  const canCraft = item.fragment_cost && (user?.[`fragments_${item.fragment_rarity?.toLowerCase()}`] || 0) >= item.fragment_cost;

  return (
    <GlassCard className={`p-3 flex flex-col items-center text-center gap-2 ${item.is_equipped ? "border-sk-cyan bg-sk-cyan/10" : ""}`}>
      <div className="w-16 h-16 rounded-full bg-sk-surface border-2 border-sk-line flex items-center justify-center mb-2">
        {item.item_type === 'border' ? <Icon name="profile" size={24} className="text-sk-text2"/> : <Icon name="layer" size={24} className="text-sk-text2"/>}
      </div>
      
      <div className="font-ui font-bold text-sm text-white">{item.name}</div>
      <div className="font-mono text-[10px] text-sk-gold font-bold">{item.price} 💰</div>
      
      {item.is_equipped ? (
        <button disabled className="mt-2 w-full py-2 bg-sk-cyan/20 text-sk-cyan rounded-lg text-xs font-bold uppercase">
          Надето
        </button>
      ) : item.is_owned ? (
        <button onClick={onEquip} className="mt-2 w-full py-2 bg-sk-cyan text-black rounded-lg text-xs font-bold uppercase active:scale-95 transition-transform">
          Надеть
        </button>
      ) : (
        <div className="mt-2 flex w-full flex-col gap-1">
          <button 
            onClick={onBuy} 
            disabled={!canBuy}
            className={`w-full py-2 rounded-lg text-xs font-bold uppercase transition-transform ${canBuy ? "bg-sk-gold text-black active:scale-95" : "bg-sk-surface text-sk-text3 cursor-not-allowed"}`}
          >
            Купить
          </button>
          
          {item.fragment_cost && (
            <button 
              onClick={onCraft} 
              disabled={!canCraft}
              className={`w-full py-2 rounded-lg text-[10px] font-bold uppercase transition-transform flex items-center justify-center gap-1 border ${canCraft ? "border-sk-pink bg-sk-pink/20 text-white active:scale-95" : "border-transparent bg-sk-surface text-sk-text3 cursor-not-allowed"}`}
            >
              <Icon name="fragment" size={12} className={canCraft ? "text-sk-pink" : "text-sk-text3"} />
              Скрафтить {item.fragment_cost}
            </button>
          )}
        </div>
      )}
    </GlassCard>
  );
}
