'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/landing/Icon';
import type { TrackerData, Totals } from '@/lib/campaignTracker';
import styles from './campaigns.module.scss';
// Shares the card / table / filter look of the Rates page
import r from '../rates/rates.module.scss';

const TRACKER_URL = 'https://campaign.kimi.pro/';

type Preset = '7' | '30' | 'month' | 'lastMonth';
const PRESETS: [Preset, string][] = [['7', 'Last 7 days'], ['30', 'Last 30 days'], ['month', 'This month'], ['lastMonth', 'Last month']];

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function rangeFor(p: Preset): { from: string; to: string } {
  const now = new Date();
  const back = (n: number) => { const d = new Date(now); d.setDate(d.getDate() - n); return d; };
  if (p === '7') return { from: ymd(back(6)), to: ymd(now) };
  if (p === '30') return { from: ymd(back(29)), to: ymd(now) };
  if (p === 'month') return { from: ymd(new Date(now.getFullYear(), now.getMonth(), 1)), to: ymd(now) };
  return { from: ymd(new Date(now.getFullYear(), now.getMonth() - 1, 1)), to: ymd(new Date(now.getFullYear(), now.getMonth(), 0)) };
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const num = (n: number) => Math.round(n).toLocaleString('en-IN');

function delta(cur: number, prev: number) {
  if (!prev) return null;
  const pct = ((cur - prev) / prev) * 100;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`;
}

export default function CampaignsPage() {
  const [tab, setTab] = useState<'campaigns' | 'tracker'>('campaigns');
  const [preset, setPreset] = useState<Preset>('30');
  const [data, setData] = useState<TrackerData | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [business, setBusiness] = useState('Logistics');
  const [platform, setPlatform] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [frameKey, setFrameKey] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async (p: Preset, signal: AbortSignal) => {
    const { from, to } = rangeFor(p);
    setState('loading');
    try {
      const res = await fetch(`/api/campaigns?from=${from}&to=${to}`, { signal });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not load campaigns');
      setData(json);
      setState('ready');
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setError(e instanceof Error ? e.message : 'Could not load campaigns');
      setState('error');
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(preset, ctrl.signal);
    return () => ctrl.abort();
  }, [preset, reloadKey, load]);

  const businesses = useMemo(() => [...new Set((data?.campaigns ?? []).map((c) => c.business))], [data]);
  const platforms = useMemo(() => [...new Set((data?.campaigns ?? []).map((c) => c.platform))], [data]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data?.campaigns ?? [])
      .filter((c) =>
        (business === 'all' || c.business === business) &&
        (platform === 'all' || c.platform === platform) &&
        (status === 'all' || c.status === status) &&
        (!q || `${c.campaignName} ${c.metaName} ${c.code}`.toLowerCase().includes(q)))
      .sort((a, b) => b.spend - a.spend);
  }, [data, business, platform, status, search]);

  // KPIs for the filtered set, so the cards always match the table
  const totals: Totals = useMemo(() => {
    const t = rows.reduce((n, c) => ({
      spend: n.spend + c.spend, leadsReceived: n.leadsReceived + c.leadsReceived, validLeads: n.validLeads + c.validLeads,
      converted: n.converted + c.converted, revenue: n.revenue + c.revenue, cpl: 0, roas: 0,
    }), { spend: 0, leadsReceived: 0, validLeads: 0, converted: 0, revenue: 0, cpl: 0, roas: 0 });
    t.cpl = t.leadsReceived ? t.spend / t.leadsReceived : 0;
    t.roas = t.spend ? t.revenue / t.spend : 0;
    return t;
  }, [rows]);

  const allSelected = business === 'all' && platform === 'all' && status === 'all' && !search;
  const running = rows.filter((c) => c.status === 'live').length;

  const exportCsv = () => {
    const head = ['Campaign', 'Code', 'Business', 'Platform', 'CSE', 'Status', 'Spend', 'Leads', 'Conversions', 'Revenue', 'ROAS', 'Cost/Lead'];
    const body = rows.map((c) => [c.campaignName, c.code, c.business, c.platform, (c.defaultCseId && data?.cses[c.defaultCseId]) || '', c.status,
      Math.round(c.spend), c.leadsReceived, c.converted, Math.round(c.revenue), c.roas.toFixed(2), Math.round(c.cpl)]);
    const csv = [head, ...body].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'jdac-campaigns.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const prev = data?.previous;
  const cards: [string, string, string | null][] = [
    ['Campaigns running', String(running), null],
    ['Spend', inr(totals.spend), allSelected && prev ? delta(totals.spend, prev.spend) : null],
    ['Leads', num(totals.leadsReceived), allSelected && prev ? delta(totals.leadsReceived, prev.leadsReceived) : null],
    ['Conversions', num(totals.converted), allSelected && prev ? delta(totals.converted, prev.converted) : null],
    ['Revenue', inr(totals.revenue), allSelected && prev ? delta(totals.revenue, prev.revenue) : null],
    ['ROAS', `${totals.roas.toFixed(2)}×`, null],
    ['Cost / lead', totals.cpl ? inr(totals.cpl) : '—', null],
  ];

  return (
    <AdminLayout currentPage="campaigns">
      <div className={styles.container}>
        <div className={styles.tabs} role="tablist">
          <button role="tab" aria-selected={tab === 'campaigns'} className={tab === 'campaigns' ? styles.tabOn : ''} onClick={() => setTab('campaigns')}>Campaigns</button>
          <button role="tab" aria-selected={tab === 'tracker'} className={tab === 'tracker' ? styles.tabOn : ''} onClick={() => setTab('tracker')}>Work Tracker</button>
        </div>

        {tab === 'tracker' && (
          <section className={styles.tracker}>
            <div className={styles.trackerBar}>
              <div><strong>JDAC Sales — Work Tracker</strong><small>{TRACKER_URL}</small></div>
              <div className={styles.trackerBtns}>
                <button onClick={() => setFrameKey((k) => k + 1)}>Reload</button>
                <a href={TRACKER_URL} target="_blank" rel="noreferrer">Open in new tab ↗</a>
              </div>
            </div>
            <iframe key={frameKey} src={TRACKER_URL} title="JDAC Sales Work Tracker" className={styles.frame} />
            <p className={styles.trackerNote}>If the tracker appears blank or refuses to load here, it does not allow embedding — use “Open in new tab”.</p>
          </section>
        )}

        {tab === 'campaigns' && (
          <div className={r.page}>
            <div className={r.stats} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
              {cards.map(([label, value, d]) => (
                <div key={label} className={r.stat}>
                  <small>{label}</small>
                  <strong>{state === 'loading' && !data ? '…' : value}</strong>
                  {d && <em className={styles.delta}>{d} vs prev.</em>}
                </div>
              ))}
            </div>

            <section className={r.card}>
              <div className={r.toolbar}>
                <h3><Icon name="bell" size={22} /> Campaigns <span className={styles.live}>live from Work Tracker</span></h3>
                <div className={r.actions}>
                  <button className={r.ghost} onClick={() => setReloadKey((k) => k + 1)} disabled={state === 'loading'}>
                    {state === 'loading' ? 'Refreshing…' : 'Refresh'}
                  </button>
                  <button className={r.ghost} onClick={exportCsv} disabled={!rows.length}>Export CSV</button>
                </div>
              </div>

              <div className={r.filters}>
                <select value={preset} onChange={(e) => setPreset(e.target.value as Preset)} aria-label="Date range">
                  {PRESETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <select value={business} onChange={(e) => setBusiness(e.target.value)} aria-label="Business">
                  <option value="all">All businesses</option>
                  {businesses.map((b) => <option key={b}>{b}</option>)}
                </select>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} aria-label="Platform">
                  <option value="all">All platforms</option>
                  {platforms.map((p) => <option key={p}>{p}</option>)}
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
                  <option value="all">All status</option>
                  <option value="live">Live</option>
                  <option value="ended">Ended</option>
                </select>
                <label className={r.search}>
                  <Icon name="search" size={16} />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search campaign or code..." />
                </label>
              </div>

              {state === 'error' && (
                <p className={styles.error} role="alert">Could not load campaigns: {error}. <button onClick={() => setReloadKey((k) => k + 1)}>Try again</button></p>
              )}

              <div className={r.tableWrap}>
                <table className={r.table}>
                  <thead>
                    <tr>
                      <th>Campaign</th><th>Platform</th><th>CSE</th><th>Status</th>
                      <th>Spend</th><th>Leads</th><th>Conv.</th><th>Revenue</th><th>ROAS</th><th>Cost/lead</th><th>Insight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((c) => (
                      <tr key={c.campaignId}>
                        <td><strong>{c.campaignName}</strong><br /><small className={styles.sub}>{c.code} · {c.business}</small></td>
                        <td>{c.platform}</td>
                        <td>{(c.defaultCseId && data?.cses[c.defaultCseId]) || '—'}</td>
                        <td><span className={`${r.pill} ${c.status === 'live' ? r.on : r.off}`}>{c.status === 'live' ? 'Live' : c.status[0].toUpperCase() + c.status.slice(1)}</span></td>
                        <td>{inr(c.spend)}</td>
                        <td>{num(c.leadsReceived)}</td>
                        <td>{num(c.converted)}</td>
                        <td>{inr(c.revenue)}</td>
                        <td className={c.roas >= 2 ? styles.good : c.roas > 0 ? styles.warn : ''}>{c.roas.toFixed(2)}×</td>
                        <td>{c.cpl ? inr(c.cpl) : '—'}</td>
                        <td>{c.suggestion?.text ?? '—'}</td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr><td colSpan={11} className={r.empty}>
                        {state === 'loading' ? 'Loading campaigns…' : 'No campaigns match your filters for this period.'}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className={r.note}>
                Data is read from the JDAC Sales Work Tracker
                {data && ` (updated ${new Date(data.fetchedAt).toLocaleTimeString()})`}. Campaigns are created and edited there.
              </p>
            </section>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
