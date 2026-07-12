import { useState, useEffect } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Body, EmptyState, Screen, TgHeader, GlassCard } from '../components/ui.jsx';
import { fetchShop, buyShopItem, equipShopItem } from '../utils/api.js';
import { useAppState } from '../contexts/AppStateContext.jsx';
import clsx from 'clsx';

export function ShopPage() {
  const { user, refreshState } = useAppState();
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
      await refreshState();
    } catch (err) {
      alert(err.message || 'Ошибка покупки');
    }
  }

  async function handleEquip(id) {
    try {
      await equipShopItem(id);
      await loadShop();
      await refreshState();
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
            
            {borders.length > 0 && (
              <div>
                <div className="text-[12px] font-mono text-sk-text2 mb-2 uppercase">Рамки профиля</div>
                <div className="grid grid-cols-2 gap-3">
                  {borders.map(item => (
                    <ShopCard 
                      key={item.id} 
                      item={item} 
                      onBuy={() => handleBuy(item.id)} 
                      onEquip={() => handleEquip(item.id)}
                      canBuy={(user?.coins || 0) >= item.price}
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
                      onBuy={() => handleBuy(item.id)} 
                      onEquip={() => handleEquip(item.id)}
                      canBuy={(user?.coins || 0) >= item.price}
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

function ShopCard({ item, onBuy, onEquip, canBuy }) {
  return (
    <GlassCard className={clsx(
      "p-3 flex flex-col items-center text-center gap-2",
      item.is_equipped ? "border-sk-cyan bg-sk-cyan/10" : ""
    )}>
      {/* Icon / Asset placeholder */}
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
        <button 
          onClick={onBuy} 
          disabled={!canBuy}
          className={clsx(
            "mt-2 w-full py-2 rounded-lg text-xs font-bold uppercase transition-transform",
            canBuy ? "bg-sk-gold text-black active:scale-95" : "bg-sk-surface text-sk-text3 cursor-not-allowed"
          )}
        >
          Купить
        </button>
      )}
    </GlassCard>
  );
}
