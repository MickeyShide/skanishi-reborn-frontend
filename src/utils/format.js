export function formatNumber(value) {
  return new Intl.NumberFormat('ru-RU').format(value);
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getRarityColor(rarity) {
  return `var(--rarity-${rarity})`;
}

export function getRarityName(rarity) {
  const names = {
    common: 'ОБЫЧНЫЙ',
    rare: 'РЕДКИЙ',
    epic: 'ЭПИК',
    legendary: 'ЛЕГЕНДА',
    mythic: 'МИФ',
  };

  return names[rarity] ?? names.common;
}
