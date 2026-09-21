export interface Rate {
  id: string;
  vendor: string;
  from: string;
  to: string;
  ratePerKg: number;
  minCharge: number;
  fuelPct: number;
  transitDays: number;
  validTill: string;
  active: boolean;
}

export type NewRate = Omit<Rate, 'id'>;

export const MAX_ROWS = 2000;
export const MAX_FILE_BYTES = 2 * 1024 * 1024;

export const TEMPLATE_HEADERS = [
  'Vendor', 'From', 'To', 'Rate per kg', 'Min charge', 'Fuel %', 'Transit days', 'Valid till', 'Active',
];

export const TEMPLATE_ROWS: (string | number)[][] = [
  ['Vendor A', 'Pune', 'Delhi', 4.2, 420, 10, 3, '2026-12-31', 'Yes'],
  ['Vendor B', 'Mumbai', 'Bangalore', 5.5, 550, 8, 2, '2026-12-31', 'Yes'],
];

// Accepted header spellings (compared after lower-casing and stripping non-alphanumerics)
const ALIASES: Record<keyof NewRate, string[]> = {
  vendor: ['vendor', 'vendorname', 'transporter', 'carrier'],
  from: ['from', 'origin', 'fromcity', 'pickup', 'pickupcity'],
  to: ['to', 'destination', 'tocity', 'delivery', 'deliverycity'],
  ratePerKg: ['rateperkg', 'rate', 'ratekg', 'perkg', 'rs/kg', 'ratekg'],
  minCharge: ['mincharge', 'minimumcharge', 'minimum', 'min'],
  fuelPct: ['fuel', 'fuelpct', 'fuel%', 'fuelsurcharge', 'fuelsurcharge%'],
  transitDays: ['transitdays', 'transit', 'days', 'tat'],
  validTill: ['validtill', 'validuntil', 'validity', 'expiry', 'expires'],
  active: ['active', 'status', 'enabled'],
};

const key = (s: unknown) => String(s ?? '').toLowerCase().replace(/[^a-z0-9%/]/g, '');

export interface RowError { row: number; message: string }
export interface ParseResult {
  rates: NewRate[];
  errors: RowError[];
  missingColumns: string[];
  totalRows: number;
}

function toNumber(v: unknown): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    const n = Number(v.replace(/[₹,\s%]/g, ''));
    return v.trim() !== '' && Number.isFinite(n) ? n : null;
  }
  return null;
}

function toDate(v: unknown): string | null {
  if (v === null || v === undefined || v === '') return '';
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.toISOString().slice(0, 10);
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return Number.isNaN(Date.parse(s)) ? null : s;
  const m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/); // dd/mm/yyyy (Indian format)
  if (m) {
    const iso = `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    return Number.isNaN(Date.parse(iso)) ? null : iso;
  }
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

const text = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

export function parseRateSheet(data: unknown[][]): ParseResult {
  const result: ParseResult = { rates: [], errors: [], missingColumns: [], totalRows: 0 };
  if (data.length === 0) return result;

  const headers = data[0].map(key);
  const col = {} as Record<keyof NewRate, number>;
  (Object.keys(ALIASES) as (keyof NewRate)[]).forEach((field) => {
    col[field] = headers.findIndex((h) => ALIASES[field].includes(h));
  });

  const required: [keyof NewRate, string][] = [['vendor', 'Vendor'], ['from', 'From'], ['to', 'To'], ['ratePerKg', 'Rate per kg']];
  result.missingColumns = required.filter(([f]) => col[f] < 0).map(([, label]) => label);
  if (result.missingColumns.length) return result;

  const cell = (row: unknown[], f: keyof NewRate) => (col[f] >= 0 ? row[col[f]] : undefined);
  const body = data.slice(1).filter((r) => r.some((c) => c !== null && c !== undefined && String(c).trim() !== ''));
  result.totalRows = body.length;

  body.forEach((row, i) => {
    const rowNo = i + 2; // spreadsheet row number, header is row 1
    const problems: string[] = [];

    const vendor = text(cell(row, 'vendor'), 60);
    const from = text(cell(row, 'from'), 60);
    const to = text(cell(row, 'to'), 60);
    if (!vendor) problems.push('Vendor is empty');
    if (!from) problems.push('From is empty');
    if (!to) problems.push('To is empty');

    const ratePerKg = toNumber(cell(row, 'ratePerKg'));
    if (ratePerKg === null || ratePerKg <= 0) problems.push('Rate per kg must be a number above 0');


    const rawMin = cell(row, 'minCharge');
    const minCharge = rawMin === undefined || rawMin === null || rawMin === '' ? 0 : toNumber(rawMin);
    if (minCharge === null || minCharge < 0) problems.push('Min charge must be a number, 0 or more');

    const rawFuel = cell(row, 'fuelPct');
    const fuelPct = rawFuel === undefined || rawFuel === null || rawFuel === '' ? 10 : toNumber(rawFuel);
    if (fuelPct === null || fuelPct < 0 || fuelPct > 100) problems.push('Fuel % must be between 0 and 100');

    const rawDays = cell(row, 'transitDays');
    const transitDays = rawDays === undefined || rawDays === null || rawDays === '' ? 3 : toNumber(rawDays);
    if (transitDays === null || transitDays < 1 || !Number.isInteger(transitDays)) problems.push('Transit days must be a whole number, 1 or more');

    const validTill = toDate(cell(row, 'validTill'));
    if (validTill === null) problems.push('Valid till must be a date like 2026-12-31 or 31/12/2026');

    const active = toBool(cell(row, 'active'));
    if (active === null) problems.push('Active must be Yes or No');

    if (problems.length) {
      result.errors.push({ row: rowNo, message: problems.join('; ') });
      return;
    }

    result.rates.push({
      vendor, from, to, ratePerKg: ratePerKg as number, minCharge: minCharge as number,
      fuelPct: fuelPct as number, transitDays: transitDays as number, validTill: validTill as string, active: active as boolean,
    });
  });

  return result;
}

const sameRoute = (a: NewRate, b: NewRate) =>
  a.vendor.toLowerCase() === b.vendor.toLowerCase() &&
  a.from.toLowerCase() === b.from.toLowerCase() &&
  a.to.toLowerCase() === b.to.toLowerCase();

/** Merges imported rates into existing ones. A rate for the same vendor and route is updated in place. */
export function mergeRates(existing: Rate[], incoming: NewRate[], replaceAll: boolean): { rates: Rate[]; added: number; updated: number } {
  let next = replaceAll ? [] : [...existing];
  let added = 0;
  let updated = 0;
  let counter = Math.max(0, ...next.map((r) => parseInt(r.id.slice(1), 10) || 0));

  // Later rows in the file win when the same vendor and route appears twice
  const dedup: NewRate[] = [];
  incoming.forEach((r) => {
    const at = dedup.findIndex((d) => sameRoute(d, r));
    if (at >= 0) dedup[at] = r; else dedup.push(r);
  });

  dedup.forEach((r) => {
    const at = next.findIndex((e) => sameRoute(e, r));
    if (at >= 0) {
      next = next.map((e, n) => (n === at ? { ...r, id: e.id } : e));
      updated += 1;
    } else {
      counter += 1;
      next = [{ ...r, id: `R${String(counter).padStart(3, '0')}` }, ...next];
      added += 1;
    }
  });

  return { rates: next, added, updated };
}
