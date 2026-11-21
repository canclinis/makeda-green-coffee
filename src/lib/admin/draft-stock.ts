import type { InvoiceStatus, ShippingStatus } from '#lib/home/stock-book.ts';
import { overdrawnStorage, type Overdrawn, type StorageCounts } from '#lib/home/storage-book.ts';

export type DraftSale = {
  id: string;
  customerId: string;
  bags: string;
  comment: string;
  shipping: ShippingStatus;
  invoice: InvoiceStatus;
  storage: string;
};

export type DraftLot = {
  id: string;
  origin: string;
  crop: string;
  arrived: string;
  sales: DraftSale[];
};

export function blankSale(sale: DraftSale): boolean {
  return sale.customerId === '' && sale.bags.trim() === '' && sale.comment.trim() === '';
}

/** Bags still free in the lot, or null while a number is missing or not a whole number. */
export function bagsLeftIn(lot: DraftLot): number | null {
  if (!/^\d{1,6}$/.test(lot.arrived.trim())) return null;
  let left = Number(lot.arrived.trim());
  for (const sale of lot.sales) {
    if (blankSale(sale)) continue;
    if (!/^[1-9]\d{0,5}$/.test(sale.bags.trim())) return null;
    left -= Number(sale.bags.trim());
  }
  return left;
}

/** The bags typed per storage, ignoring blank or unreadable rows. */
function orderedByStorage(lot: DraftLot): Record<string, number> {
  const ordered: Record<string, number> = {};
  for (const sale of lot.sales) {
    if (!/^[1-9]\d{0,5}$/.test(sale.bags.trim())) continue;
    ordered[sale.storage] = (ordered[sale.storage] ?? 0) + Number(sale.bags.trim());
  }
  return ordered;
}

/** The first storage with fewer bags than the lot orders from it, or null while the lot is fine. */
export function overdrawnIn(lot: DraftLot, counts: StorageCounts): Overdrawn | null {
  if (!/^\d{1,6}$/.test(lot.arrived.trim())) return null;
  return overdrawnStorage(Number(lot.arrived.trim()), counts, orderedByStorage(lot));
}

export function overbooked(lot: DraftLot, counts: StorageCounts = {}): boolean {
  const left = bagsLeftIn(lot);
  return (left !== null && left < 0) || overdrawnIn(lot, counts) !== null;
}
