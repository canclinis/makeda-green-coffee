import type { CoffeeLot } from '#lib/home/coffee-lots.ts';

export type StockLevels = Record<string, number>;

export function applyStock(lots: CoffeeLot[], stock: StockLevels): CoffeeLot[] {
  return lots.map((lot) =>
    Object.hasOwn(stock, lot.id) ? { ...lot, bags: String(stock[lot.id]) } : lot
  );
}
