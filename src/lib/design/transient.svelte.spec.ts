import { afterEach, describe, expect, it, vi } from 'vitest';
import { transientFlag } from './transient.svelte.ts';

describe('transientFlag', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('turns on, then clears itself', () => {
    vi.useFakeTimers();
    const flag = transientFlag(1000);

    expect(flag.active).toBe(false);
    flag.flash();
    expect(flag.active).toBe(true);
    vi.advanceTimersByTime(999);
    expect(flag.active).toBe(true);
    vi.advanceTimersByTime(1);
    expect(flag.active).toBe(false);
  });

  it('restarts the timer when flashed again', () => {
    vi.useFakeTimers();
    const flag = transientFlag(1000);

    flag.flash();
    vi.advanceTimersByTime(800);
    flag.flash();
    vi.advanceTimersByTime(800);
    expect(flag.active).toBe(true);
    vi.advanceTimersByTime(200);
    expect(flag.active).toBe(false);
  });

  it('can be cleared early', () => {
    const flag = transientFlag();

    flag.flash();
    flag.clear();
    expect(flag.active).toBe(false);
  });
});
