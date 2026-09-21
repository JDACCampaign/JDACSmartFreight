export type Category = 'Metro to Metro' | 'Inter-state' | 'Intra-state' | 'Remote / ODA';

export interface Route {
  id: string;
  from: string;
  fromState: string;
  to: string;
  toState: string;
  distanceKm: number;
  transitDays: number;
  category: Category;
  active: boolean;
}

export type NewRoute = Omit<Route, 'id'>;

export const MAX_ROWS = 2000;
export const MAX_FILE_BYTES = 2 * 1024 * 1024;

export const TEMPLATE_HEADERS = ['From', 'From state', 'To', 'To state', 'Distance (km)', 'Transit days', 'Category', 'Active'];
export const TEMPLATE_ROWS: (string | number)[][] = [
  ['Pune', 'Maharashtra', 'Delhi', 'Delhi', 1450, 3, 'Metro to Metro', 'Yes'],
  ['Pune', 'Maharashtra', 'Goa', 'Goa', 450, 2, 'Inter-state', 'Yes'],
];

const ALIASES: Record<keyof NewRoute, string[]> = {
  from: ['from', 'origin', 'fromcity', 'pickup', 'pickupcity'],
  fromState: ['fromstate', 'originstate'],
  to: ['to', 'destination', 'tocity', 'delivery', 'deliverycity'],
  toState: ['tostate', 'destinationstate'],
  distanceKm: ['distancekm', 'distance', 'km', 'kms'],
  transitDays: ['transitdays', 'transit', 'days', 'tat'],
  category: ['category', 'type', 'routetype'],
  active: ['active', 'status', 'enabled'],
};

const key = (s: unknown) => String(s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
const text = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

export interface RowError { row: number; message: string }
export interface ParseResult { routes: NewRoute[]; errors: RowError[]; missingColumns: string[]; totalRows: number }

function toNumber(v: unknown): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    const n = Number(v.replace(/[,\s]|km/gi, ''));
    return v.trim() !== '' && Number.isFinite(n) ? n : null;
  }
  return null;
}

function toCategory(v: unknown): Category | '' | null {
  const k = key(v);
  if (!k) return '';
  if (k.includes('metro')) return 'Metro to Metro';
  if (k.includes('intra')) return 'Intra-state';
  if (k.includes('inter')) return 'Inter-state';
  if (k.includes('remote') || k.includes('oda')) return 'Remote / ODA';
  return null;
}

function toBool(v: unknown): boolean | null {
  if (v === null || v === undefined || v === '') return true;
  if (typeof v === 'boolean') return v;
  const k = key(v);
  if (['yes', 'y', 'true', '1', 'active', 'enabled'].includes(k)) return true;
  if (['no', 'n', 'false', '0', 'inactive', 'disabled'].includes(k)) return false;
  return null;
}

export function parseRouteSheet(data: unknown[][]): ParseResult {
  const result: ParseResult = { routes: [], errors: [], missingColumns: [], totalRows: 0 };
  if (data.length === 0) return result;

  const headers = data[0].map(key);
  const col = {} as Record<keyof NewRoute, number>;
  (Object.keys(ALIASES) as (keyof NewRoute)[]).forEach((f) => { col[f] = headers.findIndex((h) => ALIASES[f].includes(h)); });

  const required: [keyof NewRoute, string][] = [['from', 'From'], ['to', 'To'], ['distanceKm', 'Distance (km)']];
  result.missingColumns = required.filter(([f]) => col[f] < 0).map(([, l]) => l);
  if (result.missingColumns.length) return result;

  const cell = (row: unknown[], f: keyof NewRoute) => (col[f] >= 0 ? row[col[f]] : undefined);
  const body = data.slice(1).filter((r) => r.some((c) => c !== null && c !== undefined && String(c).trim() !== ''));
  result.totalRows = body.length;

  body.forEach((row, i) => {
    const problems: string[] = [];
    const from = text(cell(row, 'from'), 60);
    const to = text(cell(row, 'to'), 60);
    const fromState = text(cell(row, 'fromState'), 60);
    const toState = text(cell(row, 'toState'), 60);
    if (!from) problems.push('From is empty');
    if (!to) problems.push('To is empty');
    if (from && to && from.toLowerCase() === to.toLowerCase()) problems.push('From and To are the same city');

    const distanceKm = toNumber(cell(row, 'distanceKm'));
    if (distanceKm === null || distanceKm <= 0) problems.push('Distance must be a number above 0');

    const rawDays = cell(row, 'transitDays');
    const transitDays = rawDays === undefined || rawDays === null || rawDays === '' ? 3 : toNumber(rawDays);
    if (transitDays === null || transitDays < 1 || !Number.isInteger(transitDays)) problems.push('Transit days must be a whole number, 1 or more');

    const cat = toCategory(cell(row, 'category'));
    if (cat === null) problems.push('Category must be Metro to Metro, Inter-state, Intra-state or Remote / ODA');

    const active = toBool(cell(row, 'active'));
    if (active === null) problems.push('Active must be Yes or No');

    if (problems.length) { result.errors.push({ row: i + 2, message: problems.join('; ') }); return; }

    // Blank category: infer from the states when both are given
    const category: Category = cat || (fromState && toState && fromState.toLowerCase() === toState.toLowerCase() ? 'Intra-state' : 'Inter-state');
    result.routes.push({ from, fromState, to, toState, distanceKm: distanceKm as number, transitDays: transitDays as number, category, active: active as boolean });
  });

  return result;
}

const same = (a: NewRoute, b: NewRoute) => a.from.toLowerCase() === b.from.toLowerCase() && a.to.toLowerCase() === b.to.toLowerCase();

/** Merges imported routes into existing ones; a route with the same From and To is updated in place. */
export function mergeRoutes(existing: Route[], incoming: NewRoute[], replaceAll: boolean) {
  let next = replaceAll ? [] : [...existing];
  let added = 0;
  let updated = 0;
  let counter = Math.max(0, ...next.map((r) => parseInt(r.id.slice(2), 10) || 0));

  const dedup: NewRoute[] = [];
  incoming.forEach((r) => {
    const at = dedup.findIndex((d) => same(d, r));
    if (at >= 0) dedup[at] = r; else dedup.push(r);
  });

  dedup.forEach((r) => {
    const at = next.findIndex((e) => same(e, r));
    if (at >= 0) {
      next = next.map((e, n) => (n === at ? { ...r, id: e.id } : e));
      updated += 1;
    } else {
      counter += 1;
      next = [{ ...r, id: `RT${String(counter).padStart(3, '0')}` }, ...next];
      added += 1;
    }
  });
  return { routes: next, added, updated };
}
