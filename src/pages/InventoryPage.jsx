import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon.jsx';
import { Body, EmptyState, GlassCard, Screen, TgHeader } from '../components/ui.jsx';
import { fetchMyItems } from '../utils/api.js';

const colorToken = {
  primary: 'rgb(var(--color-violet-hi))',
  secondary: 'rgb(var(--color-cyan))',
  success: 'rgb(var(--color-green))',
  warning: 'rgb(var(--color-gold))',
  danger: 'rgb(var(--color-pink))',
  info: 'rgb(var(--color-cyan))',
  neutral: 'rgb(var(--color-text3))',
};

function getCategoryColor(item) {
  const value = item?.category?.color;
  if (!value) return 'rgb(var(--color-violet-hi))';
  if (value.startsWith('#')) return value;
  return colorToken[value] ?? 'rgb(var(--color-violet-hi))';
}

function getItemImage(item) {
  return item?.prototype?.photo_url || item?.type?.photo_url || '';
}

function InventoryHeader({ collectedCount, totalCount }) {
  const navigate = useNavigate();

  return (
    <TgHeader
      content={(
        <>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            aria-label="Назад"
            className="glass flex h-[38px] w-[38px] scale-x-[-1] items-center justify-center rounded-xl text-sk-text"
          >
            <Icon name="chev" size={20} color="rgb(var(--color-text))" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="font-ui text-[18px] font-bold text-sk-text">Инвентарь</div>
            <div className="mt-0.5 font-mono text-[10px] tracking-[1.5px] text-sk-text3">
              СОБРАНО {collectedCount} / {totalCount}
            </div>
          </div>
        </>
      )}
    />
  );
}

function InventoryCard({ item }) {
  const color = getCategoryColor(item);
  const image = getItemImage(item);

  return (
    <GlassCard className="min-h-[178px] rounded-[18px] p-3 shadow-none">
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[14px] border"
        style={{
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          borderColor: `color-mix(in srgb, ${color} 26%, transparent)`,
        }}
      >
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <Icon name="gem" size={34} color={color} />
        )}
        <div className="absolute right-2 top-2 rounded-md border border-sk-line/15 bg-sk-bg2/80 px-1.5 py-0.5 font-mono text-[9px] text-sk-text2">
          #{item.number}
        </div>
      </div>

      <div className="mt-2.5 min-h-[34px] font-ui text-[12.5px] font-semibold leading-tight text-sk-text">
        {item.title}
      </div>
      <div className="mt-1 truncate font-mono text-[9.5px] tracking-[0.6px]" style={{ color }}>
        {item.category?.title || item.type?.title || 'ПРЕДМЕТ'}
      </div>
    </GlassCard>
  );
}

export function InventoryPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let canceled = false;

    setLoading(true);
    setError('');

    fetchMyItems({ limit: 200 })
      .then((payload) => {
        if (canceled) return;
        setItems(payload.items ?? []);
        setMeta(payload.meta ?? { total: 0 });
      })
      .catch((err) => {
        if (!canceled) setError(err.message || 'Не удалось загрузить инвентарь.');
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => {
      canceled = true;
    };
  }, []);

  const collectedItems = useMemo(
    () => items.filter((item) => item.state === 'collected'),
    [items],
  );

  return (
    <Screen>
      <InventoryHeader collectedCount={collectedItems.length} totalCount={meta.total || items.length} />
      <Body pb="40px">
        {loading ? (
          <GlassCard className="px-5 py-8 text-center font-ui text-sm text-sk-text2">Загружаем предметы...</GlassCard>
        ) : error ? (
          <EmptyState title="Инвентарь недоступен" text={error} />
        ) : collectedItems.length === 0 ? (
          <EmptyState title="Предметов пока нет" text="Собранные карточки появятся после успешного сканирования QR-кодов." />
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {collectedItems.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </Body>
    </Screen>
  );
}
