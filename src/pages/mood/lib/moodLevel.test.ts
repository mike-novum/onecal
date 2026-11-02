import { describe, expect, it } from 'vitest';
import { getMoodLevel } from './moodLevel';

describe('getMoodLevel', () => {
  it('возвращает null для undefined или пустого массива эмоций', () => {
    expect(getMoodLevel(undefined)).toBeNull();
    expect(getMoodLevel({ emotions: [] })).toBeNull();
  });

  it('возвращает good для позитивных эмоций со средним весом <= 1', () => {
    expect(getMoodLevel({ emotions: ['joy'] })).toBe('good');
    expect(getMoodLevel({ emotions: ['joy', 'calm', 'love'] })).toBe('good');
    expect(getMoodLevel({ emotions: ['inspiration'] })).toBe('good');
  });

  it('возвращает warning для среднего веса от 1 до 3', () => {
    expect(getMoodLevel({ emotions: ['tiredness'] })).toBe('warning');
    expect(getMoodLevel({ emotions: ['apathy'] })).toBe('warning');
    expect(getMoodLevel({ emotions: ['joy', 'anxiety'] })).toBe('warning'); // (0 + 4) / 2 = 2
  });

  it('возвращает bad для среднего веса от 3 до 5', () => {
    expect(getMoodLevel({ emotions: ['anxiety'] })).toBe('bad');
    expect(getMoodLevel({ emotions: ['sadness', 'irritation'] })).toBe('bad'); // (4 + 5) / 2 = 4.5
    expect(getMoodLevel({ emotions: ['fear'] })).toBe('bad'); // 5
  });

  it('возвращает critical для среднего веса выше 5', () => {
    expect(getMoodLevel({ emotions: ['anger'] })).toBe('critical'); // 6
    expect(getMoodLevel({ emotions: ['stress'] })).toBe('critical'); // 7
    expect(getMoodLevel({ emotions: ['panic'] })).toBe('critical'); // 8
  });
});
