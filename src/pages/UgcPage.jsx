import { useState, useEffect } from 'react';
import { Icon } from '../components/Icon.jsx';
import { Body, Screen, TgHeader, GlassCard } from '../components/ui.jsx';
import { fetchMySticker, generateSticker } from '../utils/api.js';

export function UgcPage() {
  const [sticker, setSticker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSticker();
  }, []);

  async function loadSticker() {
    try {
      setLoading(true);
      const res = await fetchMySticker();
      setSticker(res);
    } catch (err) {
      if (err.message && err.message.includes('Стикер не найден')) {
        setSticker(null);
      } else {
        console.error('Failed to load sticker:', err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    try {
      setLoading(true);
      const res = await generateSticker();
      setSticker(res);
    } catch (err) {
      alert(err.message || 'Ошибка генерации стикера');
      setLoading(false);
    }
  }

  const getQrUrl = (secret) => {
    const link = `https://t.me/skanishi_bot/app?startapp=${secret}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
  };

  return (
    <Screen nav="home">
      <TgHeader title="Мой UGC Стикер" />
      <Body>
        {loading ? (
          <div className="flex justify-center p-8 text-sk-text3">
            <Icon name="spinner" size={24} className="animate-spin" />
          </div>
        ) : !sticker ? (
          <div className="flex flex-col items-center justify-center p-6 text-center h-full gap-4">
            <div className="w-24 h-24 rounded-full bg-sk-surface flex items-center justify-center">
              <Icon name="bolt" size={48} className="text-sk-gold" />
            </div>
            <h2 className="font-ui text-xl font-bold text-white">Пассивный Доход</h2>
            <p className="font-ui text-[15px] text-sk-text2">
              Сгенерируй свой уникальный QR-код стикера. Распечатай его и наклей в интересном месте города.
            </p>
            <p className="font-ui text-[14px] text-sk-gold">
              За каждого игрока, который его отсканирует, ты будешь получать пассивный доход!
            </p>
            <button
              onClick={handleGenerate}
              className="mt-6 w-full py-4 rounded-2xl bg-sk-cyan text-black font-ui font-bold text-[16px] uppercase tracking-wide active:scale-95 transition-transform shadow-[0_0_20px_rgba(var(--color-cyan),0.3)]"
            >
              Сгенерировать Стикер
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 p-4 items-center">
            <GlassCard className="p-6 flex flex-col items-center gap-4 w-full max-w-[300px]">
              <div className="font-ui font-bold text-white text-lg">Твой QR-код</div>
              <div className="bg-white p-2 rounded-xl">
                <img src={getQrUrl(sticker.secret)} alt="UGC QR" className="w-[200px] h-[200px]" />
              </div>
              <p className="font-ui text-[12px] text-sk-text2 text-center mt-2">
                Сохрани это изображение (Долгое нажатие {'->'} Сохранить) и распечатай его!
              </p>
            </GlassCard>

            <div className="flex flex-col gap-3 w-full max-w-[300px]">
              <div className="font-ui font-bold text-sk-text2 text-[12px] uppercase">Статистика стикера</div>
              <GlassCard className="p-4 flex justify-between items-center">
                <div className="font-ui text-white">Уникальных сканов</div>
                <div className="font-mono text-lg font-bold text-sk-cyan">{sticker.scan_count}</div>
              </GlassCard>
              <GlassCard className="p-4 flex justify-between items-center">
                <div className="font-ui text-white">Заработано XP</div>
                <div className="font-mono text-lg font-bold text-sk-cyan flex items-center gap-1">
                  {sticker.total_passive_xp} <Icon name="bolt" size={16} />
                </div>
              </GlassCard>
              <GlassCard className="p-4 flex justify-between items-center">
                <div className="font-ui text-white">Заработано Монет</div>
                <div className="font-mono text-lg font-bold text-sk-gold flex items-center gap-1">
                  {sticker.total_passive_coins} <Icon name="coin" size={16} />
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </Body>
    </Screen>
  );
}
