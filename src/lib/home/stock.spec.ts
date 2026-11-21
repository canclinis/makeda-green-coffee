import { describe, expect, it } from 'vitest';
import { specialtyLots } from '#lib/home/coffee-lots.ts';
import { applyStock } from './stock.ts';

const [first, second] = specialtyLots;

describe('applyStock', () => {
  it('shows the bag count saved by an admin', () => {
    const lots = applyStock(specialtyLots, { [first.id]: 17 });

    expect(lots[0].bags).toBe('17');
  });

  it('keeps the default count for lots an admin has not saved', () => {
    const lots = applyStock(specialtyLots, { [first.id]: 17 });

    expect(lots[1].bags).toBe(second.bags);
  });

  it('shows a count of 1 as a single bag', () => {
    const lots = applyStock(specialtyLots, { [first.id]: 1 });

    expect(lots[0].bags).toBe('1');
  });
});
