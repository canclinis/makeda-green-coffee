import { describe, expect, it } from 'vitest';
import { filmVolume } from './film-volume';

describe('filmVolume', () => {
  const duration = 28;

  it('fades the soundtrack in over the first two seconds', () => {
    expect(filmVolume(0, duration, 0)).toBe(0);
    expect(filmVolume(1, duration, 1)).toBe(0.5);
    expect(filmVolume(2, duration, 2)).toBe(1);
  });

  it('stays full once the fade-in has finished', () => {
    expect(filmVolume(10, duration, 10)).toBe(1);
  });

  it('fades the soundtrack in from the moment it is turned on', () => {
    expect(filmVolume(10, duration, 0)).toBe(0);
    expect(filmVolume(10, duration, 1)).toBe(0.5);
  });

  it('fades out at the end of a clip', () => {
    expect(filmVolume(27, duration, 27)).toBe(0.5);
    expect(filmVolume(28, duration, 28)).toBe(0);
  });

  it('keeps a loop at full volume through the end', () => {
    expect(filmVolume(27, duration, 27, 2, 0)).toBe(1);
  });
});
