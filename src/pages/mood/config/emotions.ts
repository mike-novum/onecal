export interface EmotionItem {
  id: string;
  label: string;
  emoji: string;
  weight: number;
}

export const EMOTIONS: EmotionItem[] = [
  { id: 'joy', label: 'Радость', emoji: '😊', weight: 0 },
  { id: 'calm', label: 'Спокойствие', emoji: '😌', weight: 0 },
  { id: 'love', label: 'Любовь', emoji: '🥰', weight: 0 },
  { id: 'inspiration', label: 'Вдохновение', emoji: '✨', weight: 1 },
  { id: 'gratitude', label: 'Благодарность', emoji: '🙏', weight: 0 },
  { id: 'pride', label: 'Гордость', emoji: '💪', weight: 0 },
  { id: 'boredom', label: 'Скука', emoji: '😑', weight: 2 },
  { id: 'apathy', label: 'Апатия', emoji: '😶', weight: 3 },
  { id: 'tiredness', label: 'Усталость', emoji: '😴', weight: 2 },
  { id: 'anxiety', label: 'Тревога', emoji: '😟', weight: 4 },
  { id: 'sadness', label: 'Грусть', emoji: '😢', weight: 4 },
  { id: 'loneliness', label: 'Одиночество', emoji: '🥺', weight: 4 },
  { id: 'irritation', label: 'Раздражение', emoji: '😤', weight: 5 },
  { id: 'anger', label: 'Злость', emoji: '😠', weight: 6 },
  { id: 'fear', label: 'Страх', emoji: '😨', weight: 5 },
  { id: 'despair', label: 'Отчаяние', emoji: '😞', weight: 7 },
  { id: 'stress', label: 'Стресс', emoji: '🤯', weight: 7 },
  { id: 'panic', label: 'Паника', emoji: '😱', weight: 8 },
];
