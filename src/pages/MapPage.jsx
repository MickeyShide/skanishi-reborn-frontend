import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { GlassCard, RarityTag, Screen, TgHeader } from '../components/ui.jsx';
import { useAppState } from '../context/AppStateContext.jsx';
import { usePointerCapture } from '../hooks/usePointerCapture.js';
import { useYMapLoader } from '../hooks/useYMapLoader.js';
import { getRarityColor } from '../utils/format.js';

const filters = [
  { id: 'all', label: 'Все', params: {} },
  { id: 'todo', label: 'Не пройдено', params: { done: false } },
  { id: 'rare', label: 'Редкие', params: { rarity: 'rare' } },
  { id: 'secrets', label: 'Секреты', params: { category: 'Секрет' } },
];
const DEFAULT_CENTER = [37.618423, 55.751244];
const POINT_ZOOM = 16;
const POINT_ZOOM_DURATION = 900;
const POINT_SHEET_FALLBACK_HEIGHT = 430;
const NEARBY_SHEET_COLLAPSED_EXTRA = 72;
const NEARBY_SHEET_FALLBACK_HEIGHT = 390;
const MAP_CUSTOMIZATION = [
  { elements: 'label.icon', stylers: [{ visibility: 'off' }] },
  { tags: { any: ['poi', 'shopping', 'medical', 'outdoor'] }, elements: 'label', stylers: [{ visibility: 'off' }] },
  { tags: { any: ['road_1', 'road_2', 'road_3', 'road_4', 'road_5', 'road_6'] }, elements: 'label', stylers: [{ opacity: 0.35 }] },
  { tags: { any: ['road_1', 'road_2', 'road_3', 'road_4', 'road_5', 'road_6'] }, elements: 'geometry', stylers: [{ opacity: 0.45 }] },
  { tags: { any: ['transit', 'transit_stop', 'transit_entrance'] }, elements: 'label', stylers: [{ opacity: 0.35 }] },
  { tags: { any: ['building', 'address'] }, elements: 'label', stylers: [{ opacity: 0.25 }] },
];
const ZOOM_RADIUS_STOPS = [
  { zoom: 9.5, radius: 3600 },
  { zoom: 10.5, radius: 3000 },
  { zoom: 11.5, radius: 2200 },
  { zoom: 12.5, radius: 1100 },
  { zoom: 13.5, radius: 500 },
  { zoom: 14.5, radius: 220 },
  { zoom: 16, radius: 120 },
];

function toYandexCoords(point) {
  if (!Array.isArray(point.coords) || point.coords.length !== 2) return null;

  const [lat, lon] = point.coords.map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  return [lon, lat];
}

function getCenter(points) {
  if (!points.length) return DEFAULT_CENTER;

  const sum = points.reduce(
    (acc, point) => {
      acc.lon += point.mapCoords[0];
      acc.lat += point.mapCoords[1];
      return acc;
    },
    { lon: 0, lat: 0 },
  );

  return [sum.lon / points.length, sum.lat / points.length];
}

function circleToPolygonLonLat(centerLonLat, radiusMeters, segments = 24) {
  const [lon, lat] = centerLonLat;
  const earthRadius = 6378137;
  const latRad = (lat * Math.PI) / 180;
  const ring = [];

  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * 2 * Math.PI;
    const dx = (radiusMeters * Math.cos(angle)) / (earthRadius * Math.cos(latRad));
    const dy = (radiusMeters * Math.sin(angle)) / earthRadius;
    ring.push([lon + (dx * 180) / Math.PI, lat + (dy * 180) / Math.PI]);
  }

  return [ring];
}

function radiusForZoom(zoom) {
  if (zoom <= ZOOM_RADIUS_STOPS[0].zoom) return ZOOM_RADIUS_STOPS[0].radius;

  const last = ZOOM_RADIUS_STOPS[ZOOM_RADIUS_STOPS.length - 1];
  if (zoom >= last.zoom) return last.radius;

  for (let index = 0; index < ZOOM_RADIUS_STOPS.length - 1; index += 1) {
    const current = ZOOM_RADIUS_STOPS[index];
    const next = ZOOM_RADIUS_STOPS[index + 1];
    if (zoom >= current.zoom && zoom <= next.zoom) {
      const progress = (zoom - current.zoom) / (next.zoom - current.zoom);
      return current.radius + (next.radius - current.radius) * progress;
    }
  }

  return last.radius;
}

function rgba(rgb, alpha) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function buildMaskedFeatures(YMapFeature, point) {
  const rarityColors = {
    common: '160, 160, 170',
    rare: '15, 200, 255',
    epic: '150, 70, 255',
    legendary: '255, 180, 20',
    mythic: '255, 70, 110',
  };
  const rgbStr = rarityColors[point.rarity] || rarityColors.common;
  
  return new YMapFeature({
    id: `masked-${point.id}`,
    geometry: {
      type: 'Polygon',
      coordinates: circleToPolygonLonLat(point.mapCoords, 50, 36),
    },
    style: {
      fill: `rgba(${rgbStr}, 0.25)`,
      stroke: [{ color: `rgba(${rgbStr}, 0.8)`, width: 2 }],
    },
  });
}

function createMaskedMarkerElement(point, onSelect) {
  const marker = document.createElement('button');
  marker.type = 'button';
  marker.className = 'ymap-masked-marker';
  marker.dataset.mapInteractive = 'true';
  marker.setAttribute('aria-label', point.name);
  marker.style.width = '80px';
  marker.style.height = '80px';
  marker.style.transform = 'translate(-50%, -50%)';
  marker.style.borderRadius = '50%';
  marker.style.cursor = 'pointer';
  marker.style.backgroundColor = 'transparent';
  marker.style.border = 'none';
  marker.style.outline = 'none';
  marker.style.touchAction = 'none';

  marker.addEventListener('pointerdown', (event) => event.stopPropagation());
  marker.addEventListener('pointerup', (event) => event.stopPropagation());
  marker.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(point.id);
  });

  return marker;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createPointMarkerElement(point, onSelect) {
  const color = getRarityColor(point.rarity);
  const marker = document.createElement('button');
  marker.type = 'button';
  marker.className = `ymap-point-marker${point.big ? ' ymap-point-marker--big' : ''}`;
  marker.style.setProperty('--pin-color', color);
  marker.dataset.mapInteractive = 'true';
  marker.setAttribute('aria-label', point.name);
  marker.title = point.name;

  const pulse = document.createElement('span');
  pulse.className = 'ymap-point-marker__pulse';

  const dot = document.createElement('span');
  dot.className = 'ymap-point-marker__dot';

  marker.append(pulse, dot);
  marker.addEventListener('pointerdown', (event) => event.stopPropagation());
  marker.addEventListener('pointerup', (event) => event.stopPropagation());
  marker.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(point.id);
  });

  return marker;
}

function createLocationMarkerElement() {
  const marker = document.createElement('span');
  marker.className = 'ymap-user-marker';
  return marker;
}

function requestLocationViaHTML5() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('No geolocation API'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      reject,
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    );
  });
}

async function canAutoRequestLocation() {
  if (!navigator.permissions?.query) return false;

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return permission.state === 'granted';
  } catch {
    return false;
  }
}

function createLocateButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ymap-locate-button';
  button.textContent = 'Моё место';
  button.setAttribute('aria-label', 'Показать моё местоположение');
  return button;
}

function MapStatus({ error, ready }) {
  if (!error && ready) return null;

  const title = error ? 'Карта ждёт подключение' : 'Подключаем Яндекс.Карты';
  const text = error
    ? 'Пока используется заглушка: нужен ключ VITE_YMAP_API_KEY или ответ /map/api-key.'
    : 'Загружаем слой карты и городские точки.';

  return (
    <div className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center px-8 text-center">
      <div className="rounded-[18px] border border-sk-line/10 bg-sk-bg2/85 px-5 py-4 shadow-card backdrop-blur-xl">
        <div className="font-ui text-[14px] font-semibold text-sk-text">{title}</div>
        <div className="mt-1.5 font-ui text-[12.5px] leading-relaxed text-sk-text2">{text}</div>
      </div>
    </div>
  );
}

function buildPointFallback(point) {
  return {
    id: point.id,
    name: point.name,
    category: 'ТОЧКА',
    distance: 'СКОРО',
    rarity: point.rarity ?? 'rare',
    reward: 0,
    status: 'Заглушка',
    quest: 'Будущий квест',
    description: 'Описание и условия появятся после подключения реальных данных по этой точке.',
  };
}

function PointSheet({ point, pointCoords, sheetRef, onClose }) {
  if (!point) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[45] flex items-end">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-sk-bg/10"
        aria-label="Закрыть точку"
        onClick={onClose}
      />

      <div
        ref={sheetRef}
        className="pointer-events-auto relative w-full rounded-t-[30px] border border-b-0 border-sk-line/20 bg-[linear-gradient(180deg,#16121f,#0c0a15)] px-5 pb-[calc(var(--safe-area-bottom)+34px)] pt-[14px] shadow-[0_-20px_60px_rgba(0,0,0,0.6)] animate-sheetIn"
      >
        <div className="mx-auto mb-3 h-[5px] w-11 rounded-full bg-white/20" />
        <button
          type="button"
          className="glass absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-sk-text2"
          aria-label="Закрыть"
          onClick={onClose}
        >
          <Icon name="plus" size={18} className="rotate-45" />
        </button>

        <div className="flex items-center gap-2 pr-10">
          <RarityTag rarity={point.rarity} />
          <span className="font-mono text-[10.5px] text-sk-text3">
            {point.category} · {point.distance}
          </span>
        </div>
        <h1 className="m-0 mt-3 font-ui text-2xl font-bold tracking-normal text-sk-text">{point.name}</h1>
        <p className="mt-2 font-ui text-sm leading-relaxed text-sk-text2">{point.description}</p>

        <div className="mt-4 flex gap-2.5">
          <GlassCard className="flex-1 rounded-[14px] p-3.5 shadow-none">
            <div className="font-mono text-[9.5px] tracking-[1px] text-sk-text3">НАГРАДА</div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Icon name="bolt" size={15} color="rgb(var(--color-cyan))" />
              <span className="font-mono text-[15px] font-bold text-sk-text">{point.reward} XP</span>
            </div>
          </GlassCard>
          <GlassCard className="flex-1 rounded-[14px] p-3.5 shadow-none">
            <div className="font-mono text-[9.5px] tracking-[1px] text-sk-text3">СТАТУС</div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="h-[7px] w-[7px] rounded-full bg-sk-gold shadow-[0_0_6px_rgb(var(--color-gold))]" />
              <span className="font-ui text-[13.5px] font-semibold text-sk-text">{point.status}</span>
            </div>
          </GlassCard>
        </div>

        <div className="mt-3 flex w-full items-center gap-3 rounded-[14px] border border-sk-violetHi/20 bg-sk-violetHi/10 p-[13px] text-left">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-sk-violetHi/20">
            <Icon name="quest" size={18} color="rgb(var(--color-violet-hi))" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[9.5px] tracking-[1px] text-sk-text3">КВЕСТ</div>
            <div className="mt-0.5 truncate font-ui text-sm font-semibold text-sk-text">{point.quest}</div>
          </div>
        </div>

        {pointCoords && (
          <div className="mt-4">
            <a
              href={`https://yandex.ru/maps/?pt=${pointCoords[0]},${pointCoords[1]}&z=18&l=map`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 py-3.5 font-ui text-[15px] font-semibold text-sk-text transition-colors hover:bg-white/15 active:bg-white/20"
            >
              <Icon name="map" size={18} />
              Маршрут
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function NearbySheet({
  points,
  sheetRef,
  onSelect,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onKeyDown,
  style,
  isCollapsed,
  hidden,
  isDragging,
}) {
  if (hidden) return null;

  return (
    <div
      ref={sheetRef}
      className={`pointer-events-auto absolute inset-x-0 bottom-0 z-[40] flex flex-col rounded-t-[30px] border border-b-0 border-sk-line/20 bg-[linear-gradient(180deg,#16121f,#0c0a15)] px-5 shadow-[0_-20px_60px_rgba(0,0,0,0.6)] will-change-[height] ${isDragging ? '' : 'transition-[height] duration-300 ease-out'}`}
      style={style}
    >
      <div
        className="flex h-[34px] w-full shrink-0 touch-none items-center justify-center cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Изменить размер списка"
      >
        <div className="h-[5px] w-11 rounded-full bg-white/20" />
      </div>

      <div className="flex shrink-0 items-center justify-between pb-3 pt-1">
        <h2 className="font-ui text-[17px] font-bold text-sk-text">Рядом с вами</h2>
        <span className="font-mono text-[11px] tracking-wider text-sk-text3">
          {points.length} {points.length === 1 ? 'МЕСТО' : 'МЕСТА'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pb-[calc(var(--safe-area-bottom)+110px)] hide-scrollbar">
        {points.length === 0 ? (
          <div className="mt-8 text-center font-ui text-[14px] text-sk-text3">
            Рядом ничего нет. Попробуйте обновить локацию.
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-4">
            {points.map((point) => (
              <button
                key={point.id}
                type="button"
                onClick={() => onSelect(point.id)}
                className="flex items-center gap-3.5 rounded-[16px] border border-sk-line/10 bg-white/5 p-3 text-left transition-colors hover:bg-white/10 active:bg-white/15"
              >
                <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] bg-sk-bg">
                  <Icon name="gem" size={20} color={getRarityColor(point.rarity)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <RarityTag rarity={point.rarity} className="!py-0.5 !px-1.5 !text-[9px]" />
                    <span className="shrink-0 font-mono text-[10px] text-sk-text3">{point.distance}</span>
                  </div>
                  <div className="mt-1.5 truncate font-ui text-[14.5px] font-semibold text-sk-text">
                    {point.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function MapPage() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const sheetRef = useRef(null);
  const nearbySheetRef = useRef(null);
  const nearbyDragRef = useRef({
    active: false,
    currentHeight: 0,
    maxHeight: 0,
    minHeight: 0,
    moved: false,
    startHeight: 0,
    startY: 0,
  });
  const { mapPins, nearbyPoints, pointDetails, refreshMapPoints, selectScanPoint } = useAppState();
  const { ready, error: loaderError } = useYMapLoader();
  const [activeFilterId, setActiveFilterId] = useState('all');
  const [mapError, setMapError] = useState(null);
  const [selectedPointId, setSelectedPointId] = useState(null);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [nearbyDragHeight, setNearbyDragHeight] = useState(null);
  const [nearbySheetHeight, setNearbySheetHeight] = useState(0);
  const [nearbySheetMode, setNearbySheetMode] = useState('collapsed');
  const [nearbySheetDragging, setNearbySheetDragging] = useState(false);

  const [userLocation, setUserLocation] = useState(null);

  const activeFilter = filters.find((filter) => filter.id === activeFilterId) ?? filters[0];

  usePointerCapture(mapRef);

  useEffect(() => {
    const filterParams = { ...activeFilter.params };
    if (userLocation) {
      filterParams.lat = userLocation[1];
      filterParams.lon = userLocation[0];
      filterParams.radius_meters = 2000;
    }
    refreshMapPoints(filterParams).catch((error) => {
      console.warn('[map] failed to refresh points', error);
    });
  }, [activeFilter, userLocation, refreshMapPoints]);

  const handleFilterChange = useCallback((filterId) => {
    setActiveFilterId(filterId);
    setSelectedPointId(null);
  }, []);

  const handlePointSelect = useCallback((pointId) => {
    setSelectedPointId(pointId);
    selectScanPoint(pointId);
  }, [selectScanPoint]);

  const getNearbySheetBounds = useCallback(() => {
    const shell = mapRef.current?.closest('.app-shell');
    const shellHeight = shell?.getBoundingClientRect().height || window.innerHeight || 800;
    const rootStyle = window.getComputedStyle(document.documentElement);
    const bottomNavSpace = Number.parseFloat(rootStyle.getPropertyValue('--bottom-nav-space')) || 110;
    const safeBottom = Number.parseFloat(rootStyle.getPropertyValue('--safe-area-bottom')) || 0;
    const minHeight = Math.round(bottomNavSpace + safeBottom + NEARBY_SHEET_COLLAPSED_EXTRA);
    const maxHeight = Math.round(Math.max(shellHeight * 0.42, minHeight + 140));

    return { minHeight, maxHeight };
  }, []);

  const toggleNearbySheet = useCallback(() => {
    setNearbySheetMode((mode) => (mode === 'expanded' ? 'collapsed' : 'expanded'));
  }, []);

  const handleNearbySheetPointerDown = useCallback(
    (event) => {
      if (event.button !== undefined && event.button !== 0) return;

      const { minHeight, maxHeight } = getNearbySheetBounds();
      const startHeight =
        nearbySheetRef.current?.getBoundingClientRect().height ||
        (nearbySheetMode === 'collapsed' ? minHeight : maxHeight);

      nearbyDragRef.current = {
        active: true,
        currentHeight: startHeight,
        maxHeight,
        minHeight,
        moved: false,
        startHeight,
        startY: event.clientY,
      };

      setNearbySheetDragging(true);
      setNearbyDragHeight(startHeight);
      event.currentTarget.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    },
    [getNearbySheetBounds, nearbySheetMode],
  );

  const handleNearbySheetPointerMove = useCallback((event) => {
    const drag = nearbyDragRef.current;
    if (!drag.active) return;

    const deltaY = event.clientY - drag.startY;
    const nextHeight = clamp(drag.startHeight - deltaY, drag.minHeight, drag.maxHeight);

    drag.currentHeight = nextHeight;
    drag.moved = drag.moved || Math.abs(deltaY) > 5;
    setNearbyDragHeight(nextHeight);
    event.preventDefault();
  }, []);

  const finishNearbySheetDrag = useCallback(
    (event) => {
      const drag = nearbyDragRef.current;
      if (!drag.active) return;

      drag.active = false;
      event.currentTarget.releasePointerCapture?.(event.pointerId);

      if (!drag.moved) {
        toggleNearbySheet();
      } else {
        const midpoint = drag.minHeight + (drag.maxHeight - drag.minHeight) * 0.5;
        setNearbySheetMode(drag.currentHeight >= midpoint ? 'expanded' : 'collapsed');
      }

      setNearbySheetDragging(false);
      setNearbyDragHeight(null);
      event.preventDefault();
    },
    [toggleNearbySheet],
  );

  const handleNearbySheetKeyDown = useCallback(
    (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggleNearbySheet();
    },
    [toggleNearbySheet],
  );

  const mapPoints = useMemo(
    () =>
      mapPins
        .map((pin) => ({ ...pin, mapCoords: toYandexCoords(pin) }))
        .filter((pin) => Boolean(pin.mapCoords)),
    [mapPins],
  );
  const initialCenter = useMemo(() => getCenter(mapPoints), [mapPoints]);
  const selectedMapPoint = useMemo(() => mapPoints.find((point) => point.id === selectedPointId) ?? null, [mapPoints, selectedPointId]);
  const selectedPoint = useMemo(() => {
    if (!selectedPointId) return null;

    const detail = pointDetails[selectedPointId];
    if (detail) return detail;

    const mapPoint = mapPins.find((point) => point.id === selectedPointId);
    return mapPoint ? buildPointFallback(mapPoint) : null;
  }, [mapPins, pointDetails, selectedPointId]);

  useEffect(() => {
    if (!selectedPoint) {
      setSheetHeight(0);
      return undefined;
    }

    const sheet = sheetRef.current;
    if (!sheet) return undefined;

    const syncSheetHeight = () => {
      setSheetHeight(Math.ceil(sheet.getBoundingClientRect().height));
    };

    syncSheetHeight();
    if (typeof ResizeObserver === 'undefined') return undefined;

    const resizeObserver = new ResizeObserver(syncSheetHeight);
    resizeObserver.observe(sheet);

    return () => resizeObserver.disconnect();
  }, [selectedPoint]);

  useEffect(() => {
    const sheet = nearbySheetRef.current;
    if (!sheet) return undefined;

    const syncNearbySheetHeight = () => {
      setNearbySheetHeight(Math.ceil(sheet.getBoundingClientRect().height));
    };

    syncNearbySheetHeight();
    if (typeof ResizeObserver === 'undefined') return undefined;

    const resizeObserver = new ResizeObserver(syncNearbySheetHeight);
    resizeObserver.observe(sheet);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const bottomMargin = selectedPoint
      ? sheetHeight || POINT_SHEET_FALLBACK_HEIGHT
      : nearbySheetHeight || NEARBY_SHEET_FALLBACK_HEIGHT;

    if (!selectedMapPoint) {
      mapInstanceRef.current.update({ margin: [0, 0, bottomMargin, 0] });
      return;
    }

    mapInstanceRef.current.update({
      margin: [0, 0, bottomMargin, 0],
      location: {
        center: selectedMapPoint.mapCoords,
        zoom: POINT_ZOOM,
        duration: POINT_ZOOM_DURATION,
        easing: 'ease-in-out',
      },
    });
  }, [nearbySheetHeight, selectedMapPoint, selectedPoint, sheetHeight]);

  useEffect(() => {
    if (!ready || !mapRef.current) return undefined;

    let canceled = false;
    let map = null;
    let listener = null;
    let mutationObserver = null;
    let locateButton = null;
    let locateHandler = null;

    setMapError(null);

    (async () => {
      try {
        const ymaps3 = window.ymaps3;
        await ymaps3.ready;
        if (canceled || !mapRef.current) return;

        const {
          YMap,
          YMapDefaultSchemeLayer,
          YMapDefaultFeaturesLayer,
          YMapFeature,
          YMapListener,
          YMapControls,
          YMapControl,
          YMapMarker,
        } = ymaps3;

        mapRef.current.replaceChildren();
        map = new YMap(
          mapRef.current,
          {
            location: { center: initialCenter, zoom: 13.2 },
            mode: 'vector',
            paddingViewportRatio: 0,
          },
          [
            new YMapDefaultSchemeLayer({
              theme: 'dark',
              customization: MAP_CUSTOMIZATION,
            }),
          ],
        );
        mapInstanceRef.current = map;

        map.addChild(new YMapDefaultFeaturesLayer());

        const applyYandexChrome = () => {
          const root = mapRef.current;
          if (!root) return;

          const openMapsButton = root.querySelector('.ymaps3--open-maps-button');
          const openMapsControl = openMapsButton?.closest('.ymaps3--controls');
          if (openMapsControl instanceof HTMLElement) {
            openMapsControl.style.display = 'none';
          }

          const copyrights = root.querySelector('.ymaps3x0--map-copyrights, [class*="map-copyrights"]');
          if (copyrights instanceof HTMLElement) {
            copyrights.style.bottom = 'calc(var(--safe-area-bottom, 0px) + 106px)';
            copyrights.style.opacity = '0.6';
          }
        };

        applyYandexChrome();
        mutationObserver = new MutationObserver(applyYandexChrome);
        mutationObserver.observe(mapRef.current, { childList: true, subtree: true });

        mapPoints.forEach((point) => {
          if (point.is_masked) {
            map.addChild(buildMaskedFeatures(YMapFeature, point));
            map.addChild(new YMapMarker({ coordinates: point.mapCoords }, createMaskedMarkerElement(point, handlePointSelect)));
          } else {
            map.addChild(new YMapMarker({ coordinates: point.mapCoords }, createPointMarkerElement(point, handlePointSelect)));
          }
        });

        listener = new YMapListener({
          onUpdate: ({ location }) => {
            if (typeof location?.zoom !== 'number') return;
          },
        });
        map.addChild(listener);

        let userMarker = null;
        const placeOrMoveUserMarker = (lon, lat) => {
          if (!userMarker) {
            userMarker = new YMapMarker({ coordinates: [lon, lat] }, createLocationMarkerElement());
            map.addChild(userMarker);
            return;
          }

          userMarker.update({ coordinates: [lon, lat] });
        };

        const controls = new YMapControls({ position: 'right' });
        map.addChild(controls);
        locateButton = createLocateButton();
        locateHandler = async () => {
          try {
            const location = await requestLocationViaHTML5();
            placeOrMoveUserMarker(location.longitude, location.latitude);
            setUserLocation([location.longitude, location.latitude]);
            map.update({ location: { center: [location.longitude, location.latitude], zoom: 15, duration: 650, easing: 'ease-in-out' } });
          } catch (error) {
            console.warn('[ymaps] geolocation failed', error);
            window.alert('Не удалось получить геолокацию. Проверьте разрешения Telegram или браузера.');
          }
        };
        locateButton.addEventListener('click', locateHandler);
        controls.addChild(new YMapControl({ element: locateButton }));

        if (await canAutoRequestLocation()) {
          try {
            const location = await requestLocationViaHTML5();
            if (!canceled) {
              placeOrMoveUserMarker(location.longitude, location.latitude);
              setUserLocation([location.longitude, location.latitude]);
              map.update({ location: { center: [location.longitude, location.latitude], zoom: 15, duration: 650, easing: 'ease-in-out' } });
            }
          } catch {
            // User can still request location with the button.
          }
        }
      } catch (error) {
        console.error('[ymaps] map init failed', error);
        if (!canceled) setMapError(error);
      }
    })();

    return () => {
      canceled = true;
      mutationObserver?.disconnect();
      listener?.destroy?.();

      if (locateButton && locateHandler) {
        locateButton.removeEventListener('click', locateHandler);
      }

      try {
        map?.destroy?.();
      } catch {
        // Some Yandex Maps builds do not expose destroy for the map instance.
      }

      if (mapInstanceRef.current === map) {
        mapInstanceRef.current = null;
      }
      mapRef.current?.replaceChildren();
    };
  }, [handlePointSelect, initialCenter, mapPoints, ready]);

  const visibleMapError = loaderError || mapError;
  const nearbySheetHeightStyle =
    nearbyDragHeight === null
      ? nearbySheetMode === 'collapsed'
        ? `calc(var(--bottom-nav-space) + var(--safe-area-bottom) + ${NEARBY_SHEET_COLLAPSED_EXTRA}px)`
        : '42%'
      : `${nearbyDragHeight}px`;
  const isNearbyCollapsed = nearbySheetMode === 'collapsed' && !nearbySheetDragging;

  return (
    <Screen nav={selectedPoint ? undefined : 'map'} glow={false}>
      <div className="absolute inset-0 overflow-hidden bg-[#0f172a]">
        <div
          ref={mapRef}
          className="absolute inset-0 yandex-map-surface"
          style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b from-sk-bg2/80 to-sk-bg/0" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-sk-bg/50 to-sk-bg/0" />
        <MapStatus ready={ready && !mapError} error={visibleMapError} />
      </div>

      {!selectedPoint && <TgHeader />}

      <div className={`noscroll safe-page-x inset-x-0 z-[6] flex gap-2 overflow-x-auto transition-opacity ${selectedPoint ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
        {filters.map((filter) => {
          const active = filter.id === activeFilterId;

          return (
          <button
            key={filter.id}
            type="button"
            onClick={() => handleFilterChange(filter.id)}
            className="shrink-0 rounded-full border px-3.5 py-2 font-ui text-[12.5px]"
            style={{
              color: active ? 'rgb(var(--color-ink))' : 'rgb(var(--color-text2))',
              background: active ? 'rgb(var(--color-cyan))' : 'rgba(20,18,32,0.8)',
              borderColor: active ? 'transparent' : 'rgb(var(--color-line) / 0.10)',
              fontWeight: active ? 700 : 500,
              backdropFilter: 'blur(8px)',
            }}
          >
            {filter.label}
          </button>
          );
        })}
      </div>

      <PointSheet
        point={selectedPoint}
        pointCoords={selectedMapPoint?.mapCoords}
        sheetRef={sheetRef}
        onClose={() => setSelectedPointId(null)}
      />

      <NearbySheet
        points={nearbyPoints}
        sheetRef={nearbySheetRef}
        onSelect={handlePointSelect}
        onPointerDown={handleNearbySheetPointerDown}
        onPointerMove={handleNearbySheetPointerMove}
        onPointerUp={finishNearbySheetDrag}
        onPointerCancel={finishNearbySheetDrag}
        onKeyDown={handleNearbySheetKeyDown}
        style={{ height: nearbySheetHeightStyle }}
        isCollapsed={isNearbyCollapsed}
        hidden={!!selectedPoint}
        isDragging={nearbySheetDragging}
      />
    </Screen>
  );
}
