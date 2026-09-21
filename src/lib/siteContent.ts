import { promises as fs } from 'fs';
import path from 'path';

export interface StatItem {
  icon: string;
  value: string;
  label: string;
}

export interface SiteContent {
  stats: StatItem[];
}

export const STAT_ICONS = ['users', 'pin', 'truck', 'star', 'chart', 'box', 'shield', 'headset'] as const;
export const MAX_STATS = 6;

export const DEFAULT_CONTENT: SiteContent = {
  stats: [
    { icon: 'users', value: '10,000+', label: 'Shipments Managed' },
    { icon: 'pin', value: '28,000+', label: 'PIN Codes Covered' },
    { icon: 'truck', value: '500+', label: 'Transport Partners' },
    { icon: 'star', value: '99%', label: 'Customer Satisfaction' },
  ],
};

const FILE = path.join(process.cwd(), 'data', 'site-content.json');

/** Validates untrusted input and returns a safe SiteContent, or null if it is malformed. */
export function sanitizeContent(input: unknown): SiteContent | null {
  if (typeof input !== 'object' || input === null) return null;
  const stats = (input as { stats?: unknown }).stats;
  if (!Array.isArray(stats) || stats.length < 1 || stats.length > MAX_STATS) return null;

  const clean: StatItem[] = [];
  for (const s of stats) {
    if (typeof s !== 'object' || s === null) return null;
    const { icon, value, label } = s as Record<string, unknown>;
    if (typeof icon !== 'string' || typeof value !== 'string' || typeof label !== 'string') return null;
    if (!(STAT_ICONS as readonly string[]).includes(icon)) return null;
    const v = value.trim().slice(0, 20);
    const l = label.trim().slice(0, 40);
    if (!v || !l) return null;
    clean.push({ icon, value: v, label: l });
  }
  return { stats: clean };
}

export async function getContent(): Promise<SiteContent> {
  try {
    const parsed = sanitizeContent(JSON.parse(await fs.readFile(FILE, 'utf8')));
    return parsed ?? DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(content, null, 2), 'utf8');
}
