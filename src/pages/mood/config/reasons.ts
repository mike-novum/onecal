export interface ReasonItem {
  id: string;
  label: string;
  emoji: string;
}

export const NEGATIVE_REASONS: ReasonItem[] = [
  { id: 'lack-of-sleep', label: 'Недосып', emoji: '😴' },
  { id: 'overload', label: 'Перегруз', emoji: '📚' },
  { id: 'health', label: 'Самочувствие', emoji: '🤒' },
  { id: 'work', label: 'Работа', emoji: '💼' },
  { id: 'money', label: 'Деньги', emoji: '💸' },
  { id: 'conflict', label: 'Конфликт', emoji: '⚡' },
  { id: 'loneliness', label: 'Одиночество', emoji: '🥀' },
  { id: 'family', label: 'Семья', emoji: '🏠' },
  { id: 'relationship', label: 'Отношения', emoji: '💔' },
  { id: 'weather', label: 'Погода', emoji: '🌧️' },
  { id: 'news', label: 'Новости', emoji: '📰' },
  { id: 'uncertainty', label: 'Неопределённость', emoji: '❓' },
];

export const POSITIVE_REASONS: ReasonItem[] = [
  { id: 'sleep', label: 'Сон', emoji: '😌' },
  { id: 'rest', label: 'Отдых', emoji: '🛋️' },
  { id: 'sport', label: 'Спорт', emoji: '🏃' },
  { id: 'health', label: 'Здоровье', emoji: '💚' },
  { id: 'food', label: 'Еда', emoji: '🍽️' },
  { id: 'work', label: 'Работа', emoji: '💼' },
  { id: 'achievement', label: 'Успех', emoji: '🏆' },
  { id: 'hobby', label: 'Хобби', emoji: '🎨' },
  { id: 'friends', label: 'Друзья', emoji: '👥' },
  { id: 'family', label: 'Семья', emoji: '🏠' },
  { id: 'relationship', label: 'Отношения', emoji: '💕' },
  { id: 'nature', label: 'Природа', emoji: '🌿' },
  { id: 'communication', label: 'Общение', emoji: '💬' },
  { id: 'weather', label: 'Погода', emoji: '☀️' },
];
