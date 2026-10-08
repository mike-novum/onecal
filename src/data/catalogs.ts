import type { CatalogItem } from '../types';

export const ALCOHOL_ITEMS: CatalogItem[] = [
  { id: 'beer', label: 'Пиво', emoji: '🍺' },
  { id: 'wine', label: 'Вино', emoji: '🍷' },
  { id: 'champagne', label: 'Шампанское', emoji: '🍾' },
  { id: 'strong', label: 'Крепкое (водка, виски)', emoji: '🥃' },
  { id: 'cocktail', label: 'Коктейль', emoji: '🍸' },
  { id: 'tropical', label: 'Тропический коктейль', emoji: '🍹' },
  { id: 'sake', label: 'Саке', emoji: '🍶' },
];

export const FASTFOOD_ITEMS: CatalogItem[] = [
  { id: 'burger', label: 'Бургер', emoji: '🍔' },
  // В Unicode нет официального эмодзи пиццы — используем сыр как замену.
  { id: 'pizza', label: 'Пицца', emoji: '🧀' },
  { id: 'shawarma', label: 'Шаурма', emoji: '🌯' },
  { id: 'fries', label: 'Картошка фри', emoji: '🍟' },
  { id: 'hotdog', label: 'Хот-дог', emoji: '🌭' },
  { id: 'wings', label: 'Куриные крылышки', emoji: '🍗' },
  { id: 'donut', label: 'Пончик', emoji: '🍩' },
  { id: 'noodles', label: 'Лапша', emoji: '🍜' },
];
