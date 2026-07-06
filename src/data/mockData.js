export const user = {
  name: 'Нэйт',
  username: 'nate_void',
  id: '0xN4TE',
  rank: 142,
  level: 14,
  levelProgress: 68,
  xp: 6840,
  nextLevelXp: 10000,
  streakDays: 6,
  season: 'СЕЗОН 2 · ПУЛЬС ГОРОДА',
};

export const activeEvent = {
  rarity: 'mythic',
  title: 'Затмение: Ночь Реликвий',
  xpMultiplier: '×3 XP',
  timeLeft: '2Д 14Ч',
};

export const quests = [
  { id: 'old-town-shadows', name: 'Тени Старого города', step: 'Точка 3 из 5', progress: 60, rarity: 'epic', xp: 450 },
  { id: 'neon-trace', name: 'Неоновый след', step: 'Точка 1 из 3', progress: 28, rarity: 'rare', xp: 200 },
  { id: 'eclipse-cache', name: 'Кэш Затмения', step: 'Секрет 2 из 4', progress: 52, rarity: 'mythic', xp: 620 },
];

export const recentRewards = [
  { source: 'Скан · ТЦ «Орбита»', xp: 120, multiplier: '×2', time: '12 мин назад', color: 'cyan' },
  { source: 'Квест · Тени', xp: 300, multiplier: null, time: '1 ч назад', color: 'violetHi' },
  { source: 'Ачивка · Первооткрыватель', xp: 75, multiplier: null, time: 'вчера', color: 'gold' },
];

export const mapPins = [
  { id: 'roof-beacon', name: 'Маяк на крыше', coords: [55.75162, 37.61866], rarity: 'epic', big: true },
  { id: 'orbit-mall', name: 'ТЦ «Орбита»', coords: [55.75468, 37.62521], rarity: 'rare' },
  { id: 'eclipse-altar', name: 'Алтарь Затмения', coords: [55.74889, 37.61174], rarity: 'legendary', big: true, hint: true },
  { id: 'metro-sign', name: 'Метро · знак 17', coords: [55.75735, 37.63371], rarity: 'common' },
  { id: 'pulse-graffiti', name: 'Граффити «Пульс»', coords: [55.74648, 37.60497], rarity: 'rare' },
  { id: 'underground-whisper', name: 'Подземный шёпот', coords: [55.74309, 37.62077], rarity: 'mythic', big: true, hint: true },
];

export const nearbyPoints = [
  { id: 'roof-beacon', name: 'Маяк на крыше', coords: [55.75162, 37.61866], category: 'AR-сцена', rarity: 'epic', distance: '120 м', done: false },
  { id: 'pulse-graffiti', name: 'Граффити «Пульс»', coords: [55.74648, 37.60497], category: 'QR-метка', rarity: 'rare', distance: '340 м', done: true },
  { id: 'underground-whisper', name: 'Подземный шёпот', coords: [55.74309, 37.62077], category: 'Секрет', rarity: 'mythic', distance: '510 м', done: false },
];

export const pointDetails = {
  'roof-beacon': {
    id: 'roof-beacon',
    name: 'Маяк на крыше',
    category: 'AR-СЦЕНА',
    distance: '120 М',
    rarity: 'epic',
    reward: 180,
    status: 'Не пройдено',
    quest: 'Тени Старого города',
    description:
      'На вершине старой высотки спрятан AR-маяк. Наведи камеру в сумерках, чтобы поймать сигнал и открыть фрагмент карты Затмения.',
  },
  'pulse-graffiti': {
    id: 'pulse-graffiti',
    name: 'Граффити «Пульс»',
    category: 'QR-МЕТКА',
    distance: '340 М',
    rarity: 'rare',
    reward: 90,
    status: 'Пройдено',
    quest: 'Неоновый след',
    description:
      'Скан на стене старого перехода хранит быстрый QR-ключ. Он уже активирован, но повторный заход может открыть скрытую подсказку.',
  },
  'underground-whisper': {
    id: 'underground-whisper',
    name: 'Подземный шёпот',
    category: 'СЕКРЕТ',
    distance: '510 М',
    rarity: 'mythic',
    reward: 500,
    status: 'Не пройдено',
    quest: 'Кэш Затмения',
    description:
      'Секретная точка под старым вокзалом отвечает только на ночной сигнал. Подойди ближе и держи камеру ровно.',
  },
};

export const stats = [
  { value: '218', label: 'СКАНОВ', color: 'cyan' },
  { value: '47', label: 'ТОЧЕК', color: 'violetHi' },
  { value: '9', label: 'КВЕСТОВ', color: 'gold' },
  { value: '23', label: 'АЧИВОК', color: 'pink' },
];

export const profileLinks = [
  { icon: 'bolt', title: 'История XP', subtitle: '6 840 за сезон', color: 'cyan', to: '/xp' },
  { icon: 'trophy', title: 'Достижения', subtitle: '23 из 60', color: 'gold', to: '/achievements' },
  { icon: 'gem', title: 'Инвентарь', subtitle: '41 предмет', color: 'violetHi', to: '/inventory' },
];

export const xpWeekly = {
  total: 2145,
  days: [40, 62, 30, 80, 55, 95, 70],
};

export const xpHistoryGroups = [
  {
    day: 'СЕГОДНЯ',
    items: [
      { source: 'Скан · Маяк на крыше', tag: 'AR', xp: 180, multiplier: '×3', color: 'cyan', time: '14:22' },
      { source: 'Квест · Тени · шаг 4', tag: 'КВЕСТ', xp: 300, multiplier: null, color: 'violetHi', time: '13:05' },
      { source: 'Скан · ТЦ «Орбита»', tag: 'QR', xp: 120, multiplier: '×2', color: 'cyan', time: '11:40' },
    ],
  },
  {
    day: 'ВЧЕРА',
    items: [
      { source: 'Ачивка · Первооткрыватель', tag: 'АЧИВКА', xp: 75, multiplier: null, color: 'gold', time: '21:18' },
      { source: 'Секрет · Подземный шёпот', tag: 'СЕКРЕТ', xp: 500, multiplier: null, color: 'pink', time: '20:02' },
      { source: 'Скан · Граффити «Пульс»', tag: 'QR', xp: 90, multiplier: null, color: 'cyan', time: '18:47' },
    ],
  },
];

export const achievements = [
  { icon: 'qr', name: 'Первый скан', rarity: 'common', unlocked: true },
  { icon: 'fire', name: 'Стрик 7 дней', rarity: 'rare', unlocked: true },
  { icon: 'gem', name: 'Коллекционер', rarity: 'epic', unlocked: true },
  { icon: 'map', name: 'Картограф', rarity: 'rare', unlocked: true },
  { icon: 'bolt', name: 'Молниеносный', rarity: 'epic', unlocked: false, progress: 60 },
  { icon: 'star', name: 'Легенда города', rarity: 'legendary', unlocked: false, progress: 35 },
  { icon: 'trophy', name: 'Чемпион ивента', rarity: 'mythic', unlocked: false, progress: 15 },
  { icon: 'route', name: 'Марафонец', rarity: 'rare', unlocked: false, progress: 80 },
  { icon: 'gem', name: 'Хранитель тайн', rarity: 'legendary', unlocked: false, progress: 0 },
];
