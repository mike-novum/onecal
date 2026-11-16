import { describe, expect, test } from 'vitest';
import {
  calculateHabitMonthMarks,
  calculateHabitStreak,
  calculateIntimateMonthStats,
  calculateMoodMonthStats,
  getMoodPredominantInfo,
  getStreakEmoji,
  hasHabitMark,
  pluralize,
} from './stats';
import type { DayLog, MoodLog, IntimateLog } from '../model';

describe('pluralize', () => {
  test('правильно склоняет дни', () => {
    expect(pluralize(0, 'день', 'дня', 'дней')).toBe('дней');
    expect(pluralize(1, 'день', 'дня', 'дней')).toBe('день');
    expect(pluralize(2, 'день', 'дня', 'дней')).toBe('дня');
    expect(pluralize(4, 'день', 'дня', 'дней')).toBe('дня');
    expect(pluralize(5, 'день', 'дня', 'дней')).toBe('дней');
    expect(pluralize(11, 'день', 'дня', 'дней')).toBe('дней');
    expect(pluralize(21, 'день', 'дня', 'дней')).toBe('день');
    expect(pluralize(22, 'день', 'дня', 'дней')).toBe('дня');
  });

  test('правильно склоняет отметки и события', () => {
    expect(pluralize(1, 'отметка', 'отметки', 'отметок')).toBe('отметка');
    expect(pluralize(3, 'отметка', 'отметки', 'отметок')).toBe('отметки');
    expect(pluralize(5, 'отметка', 'отметки', 'отметок')).toBe('отметок');
    expect(pluralize(1, 'событие', 'события', 'событий')).toBe('событие');
    expect(pluralize(2, 'событие', 'события', 'событий')).toBe('события');
    expect(pluralize(10, 'событие', 'события', 'событий')).toBe('событий');
  });
});

describe('hasHabitMark', () => {
  test('возвращает false для пустого лога или лога без отметок', () => {
    expect(hasHabitMark(undefined)).toBe(false);
    expect(hasHabitMark({ items: [], wasBad: false })).toBe(false);
  });

  test('возвращает true если есть элементы или wasBad', () => {
    expect(hasHabitMark({ items: ['beer'], wasBad: false })).toBe(true);
    expect(hasHabitMark({ items: [], wasBad: true })).toBe(true);
    expect(hasHabitMark({ items: ['burger'], wasBad: true })).toBe(true);
  });
});

describe('calculateHabitStreak', () => {
  test('возвращает 0 при пустом трекере', () => {
    expect(calculateHabitStreak({}, '2026-11-16')).toBe(0);
  });

  test('возвращает 0, если сегодня есть отметка о привычке', () => {
    const records: Record<string, DayLog> = {
      '2026-11-16': { items: ['beer'], wasBad: false },
    };
    expect(calculateHabitStreak(records, '2026-11-16')).toBe(0);
  });

  test('возвращает 1, если последняя отметка была вчера', () => {
    const records: Record<string, DayLog> = {
      '2026-11-15': { items: ['beer'], wasBad: false },
    };
    expect(calculateHabitStreak(records, '2026-11-16')).toBe(1);
  });

  test('возвращает количество дней с момента последней отметки', () => {
    const records: Record<string, DayLog> = {
      '2026-11-01': { items: ['beer'], wasBad: false },
      '2026-11-10': { items: ['wine'], wasBad: true },
    };
    expect(calculateHabitStreak(records, '2026-11-16')).toBe(6);
  });

  test('игнорирует отметки в будущем', () => {
    const records: Record<string, DayLog> = {
      '2026-11-10': { items: ['beer'], wasBad: false },
      '2026-11-20': { items: ['beer'], wasBad: false },
    };
    expect(calculateHabitStreak(records, '2026-11-16')).toBe(6);
  });

  test('игнорирует пустые логи без отметок', () => {
    const records: Record<string, DayLog> = {
      '2026-11-15': { items: [], wasBad: false },
    };
    expect(calculateHabitStreak(records, '2026-11-16')).toBe(0);
  });
});

describe('getStreakEmoji', () => {
  test('возвращает 🌱 для серий меньше 3 дней', () => {
    expect(getStreakEmoji(0)).toBe('🌱');
    expect(getStreakEmoji(1)).toBe('🌱');
    expect(getStreakEmoji(2)).toBe('🌱');
  });

  test('возвращает 🔥 для серий от 3 дней и больше', () => {
    expect(getStreakEmoji(3)).toBe('🔥');
    expect(getStreakEmoji(7)).toBe('🔥');
    expect(getStreakEmoji(30)).toBe('🔥');
  });
});

describe('calculateHabitMonthMarks', () => {
  test('считает отметки только за указанный месяц и год', () => {
    const records: Record<string, DayLog> = {
      '2026-10-01': { items: ['beer'], wasBad: false },
      '2026-10-15': { items: [], wasBad: true },
      '2026-10-20': { items: [], wasBad: false },
      '2026-09-30': { items: ['beer'], wasBad: false },
      '2026-11-01': { items: ['beer'], wasBad: false },
      '2025-10-05': { items: ['beer'], wasBad: false },
    };

    expect(calculateHabitMonthMarks(records, 2026, 9)).toBe(2);
    expect(calculateHabitMonthMarks(records, 2026, 8)).toBe(1);
    expect(calculateHabitMonthMarks(records, 2026, 10)).toBe(1);
    expect(calculateHabitMonthMarks(records, 2026, 0)).toBe(0);
  });
});

describe('calculateMoodMonthStats', () => {
  test('возвращает count: 0 и null для пустого месяца', () => {
    const res = calculateMoodMonthStats({}, 2026, 9);
    expect(res).toEqual({ count: 0, predominant: null });
  });

  test('определяет преобладающее настроение и считает дни', () => {
    const records: Record<string, MoodLog> = {
      '2026-10-01': { emotions: ['joy'] },
      '2026-10-02': { emotions: ['calm'] },
      '2026-10-03': { emotions: ['sadness'] },
      '2026-09-30': { emotions: ['joy'] },
    };

    const res = calculateMoodMonthStats(records, 2026, 9);
    expect(res.count).toBe(3);
    expect(res.predominant).toBe('good');
  });

  test('выбирает преобладающее критическое или плохое при преобладании негатива', () => {
    const records: Record<string, MoodLog> = {
      '2026-10-01': { emotions: ['despair'] },
      '2026-10-02': { emotions: ['despair'] },
      '2026-10-03': { emotions: ['joy'] },
    };

    const res = calculateMoodMonthStats(records, 2026, 9);
    expect(res.count).toBe(3);
    expect(res.predominant).toBe('critical');
  });
});

describe('getMoodPredominantInfo', () => {
  test('возвращает правильные эмодзи и текст', () => {
    expect(getMoodPredominantInfo('good')).toEqual({ emoji: '😊', text: 'Всё хорошо' });
    expect(getMoodPredominantInfo('warning')).toEqual({ emoji: '😐', text: 'Есть сложности' });
    expect(getMoodPredominantInfo('bad')).toEqual({ emoji: '🙁', text: 'Много негатива' });
    expect(getMoodPredominantInfo('critical')).toEqual({ emoji: '😫', text: 'Очень тяжело' });
    expect(getMoodPredominantInfo(null)).toEqual({ emoji: '—', text: 'Нет отметок' });
  });
});

describe('calculateIntimateMonthStats', () => {
  test('возвращает 0 при отсутствии записей', () => {
    const res = calculateIntimateMonthStats({}, 2026, 9);
    expect(res).toEqual({ total: 0, sex: 0, masturbation: 0, activeDays: 0 });
  });

  test('суммирует секс и мастурбацию за выбранный месяц', () => {
    const records: Record<string, IntimateLog> = {
      '2026-10-01': { sex: 2, masturbation: 1 },
      '2026-10-05': { sex: 1, masturbation: 0 },
      '2026-10-10': { sex: 0, masturbation: 3 },
      '2026-09-30': { sex: 5, masturbation: 5 },
    };

    const res = calculateIntimateMonthStats(records, 2026, 9);
    expect(res.total).toBe(7);
    expect(res.sex).toBe(3);
    expect(res.masturbation).toBe(4);
    expect(res.activeDays).toBe(3);
  });
});
