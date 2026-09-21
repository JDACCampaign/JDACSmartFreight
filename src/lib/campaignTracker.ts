// Reads campaign data from the JDAC Sales Work Tracker (https://campaign.kimi.pro).
// Only the three read-only "board" procedures below are requested; nothing is written back.

const BASE = 'https://campaign.kimi.pro/api/trpc';
const PROCEDURES = 'board.meta,board.kpis,board.byCampaign';

export interface Totals {
  spend: number;
  leadsReceived: number;
  validLeads: number;
  converted: number;
  revenue: number;
  cpl: number;
  roas: number;
}

export interface TrackerCampaign extends Totals {
  campaignId: number;
  campaignName: string;
  metaName: string;
  business: string;
  code: string;
  platform: string;
  defaultCseId: number | null;
  status: string;
  suggestion?: { kind: string; text: string };
}

export interface TrackerData {
  kpis: Totals;
  previous: Totals;
  campaigns: TrackerCampaign[];
  cses: Record<number, string>;
  fetchedAt: string;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
export const isDate = (s: string | null): s is string => !!s && DATE.test(s) && !Number.isNaN(Date.parse(s));

interface TrpcItem<T> { result?: { data?: { json?: T } }; error?: unknown }

export async function fetchTracker(from: string, to: string): Promise<TrackerData> {
  const range = { json: { from, to } };
  const input = { 0: { json: null, meta: { values: ['undefined'], v: 1 } }, 1: range, 2: range };
  const url = `${BASE}/${PROCEDURES}?batch=1&input=${encodeURIComponent(JSON.stringify(input))}`;

  const res = await fetch(url, { headers: { Accept: 'application/json' }, next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Tracker responded with ${res.status}`);

  const [meta, kpis, by] = (await res.json()) as [
    TrpcItem<{ cses: { id: number; name: string }[] }>,
    TrpcItem<{ current: Totals; previous: Totals }>,
    TrpcItem<TrackerCampaign[]>,
  ];
  const m = meta?.result?.data?.json;
  const k = kpis?.result?.data?.json;
  const c = by?.result?.data?.json;
  if (!m || !k || !c) throw new Error('Unexpected response from the tracker');

  return {
    kpis: k.current,
    previous: k.previous,
    campaigns: c,
    cses: Object.fromEntries(m.cses.map((x) => [x.id, x.name])),
    fetchedAt: new Date().toISOString(),
  };
}

// ---- Analytics: lead pipeline and sales-executive performance (read-only queries) ----

export interface ReasonCount { code: string; label: string; count: number }
export interface FunnelStage extends ReasonCount { phase: string }

export interface Pipeline {
  total: number;
  lost: number;
  irrelevant: number;
  notYetContacted: number;
  relevant: number;
  bookings: number;
  revenue: number;
  spend: number;
  costPerRelevant: number;
  lostByReason: ReasonCount[];
  irrByReason: ReasonCount[];
  funnel: FunnelStage[];
}

export interface CseStats {
  cseId: number;
  cseName: string;
  daysActive: number;
  spend: number;
  leadsReceived: number;
  revenue: number;
  convRate: number;
  cpl: number;
  roas: number;
  crmLeads: number;
  contacted: number;
  notYetContacted: number;
  lost: number;
  irrelevant: number;
  relevant: number;
  conversions: number;
  costPerBooking: number;
}

export interface AnalyticsData {
  pipeline: Pipeline;
  cses: CseStats[];
  campaigns: TrackerCampaign[];
  fetchedAt: string;
}

export async function fetchAnalytics(from: string, to: string): Promise<AnalyticsData> {
  const range = { json: { from, to } };
  const input = { 0: range, 1: range, 2: range };
  const url = `${BASE}/board.pipeline,board.byCse,board.byCampaign?batch=1&input=${encodeURIComponent(JSON.stringify(input))}`;

  const res = await fetch(url, { headers: { Accept: 'application/json' }, next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Tracker responded with ${res.status}`);

  const [p, c, b] = (await res.json()) as [TrpcItem<Pipeline>, TrpcItem<CseStats[]>, TrpcItem<TrackerCampaign[]>];
  const pipeline = p?.result?.data?.json;
  const cses = c?.result?.data?.json;
  const campaigns = b?.result?.data?.json;
  if (!pipeline || !cses || !campaigns) throw new Error('Unexpected response from the tracker');

  return { pipeline, cses, campaigns, fetchedAt: new Date().toISOString() };
}
