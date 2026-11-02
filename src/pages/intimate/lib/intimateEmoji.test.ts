import { describe, expect, it } from 'vitest';
import { getIntimateEmoji } from './intimateEmoji';

describe('getIntimateEmoji', () => {
  it('возвращает null для undefined и null', () => {
    expect(getIntimateEmoji(undefined)).toBeNull();
    expect(getIntimateEmoji(null)).toBeNull();
  });

  it('возвращает null если оба счетчика 0', () => {
    expect(getIntimateEmoji({ sex: 0, masturbation: 0 })).toBeNull();
  });

  it('возвращает сердечко если был только секс', () => {
    expect(getIntimateEmoji({ sex: 1, masturbation: 0 })).toBe('❤️');
    expect(getIntimateEmoji({ sex: 3, masturbation: 0 })).toBe('❤️');
  });

  it('возвращает капли если была только мастурбация', () => {
    expect(getIntimateEmoji({ sex: 0, masturbation: 1 })).toBe('💦');
    expect(getIntimateEmoji({ sex: 0, masturbation: 2 })).toBe('💦');
  });

  it('возвращает огонь если был и секс, и мастурбация', () => {
    expect(getIntimateEmoji({ sex: 1, masturbation: 1 })).toBe('🔥');
    expect(getIntimateEmoji({ sex: 2, masturbation: 3 })).toBe('🔥');
  });
});
