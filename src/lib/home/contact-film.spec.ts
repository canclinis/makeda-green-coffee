import { describe, expect, it } from 'vitest';
import { contactFilmVolume } from './contact-film';

describe('contactFilmVolume', () => {
  const duration = 28;

  it('ramps up at the start', () => {
    expect(contactFilmVolume(0, duration)).toBe(0);
    expect(contactFilmVolume(1, duration)).toBe(0.5);
    expect(contactFilmVolume(2, duration)).toBe(1);
  });

  it('stays full in the middle', () => {
    expect(contactFilmVolume(10, duration)).toBe(1);
  });

  it('ramps down at the end', () => {
    expect(contactFilmVolume(27, duration)).toBe(0.5);
    expect(contactFilmVolume(28, duration)).toBe(0);
  });
});
