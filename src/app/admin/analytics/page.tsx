'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/landing/Icon';
import type { AnalyticsData } from '@/lib/campaignTracker';
import r from '../rates/rates.module.scss';
import styles from './analytics.module.scss';

type Preset = '7' | '30' | 'month' | 'lastMonth';
const PRESETS: [Preset, string][] = [['7', 'Last 7 days'], ['30', 'Last 30 days'], ['month', 'This month'], ['lastMonth', 'Last month']];
const SHADES = ['#1f3d99', '#f15a25', '#2f6fe4', '#8fb3f2', '#c3d6f8'];

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function rangeFor(p: Preset) {
  const now = new Date();
  const back = (n: number) => { const d = new Date(now); d.setDate(d.getDate() - n); return d; };
  if (p === '7') return { from: ymd(back(6)), to: ymd(now) };
  if (p === '30') return { from: ymd(back(29)), to: ymd(now) };
  if (p === 'month') return { from: ymd(new Date(now.getFullYear(), now.getMonth(), 1)), to: ymd(now) };
  return { from: ymd(new Date(now.getFullYear(), now.getMonth() - 1, 1)), to: ymd(new Date(now.getFullYear(), now.getMonth(), 0)) };
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const num = (n: number) => Math.round(n).toLocaleString('en-IN');
const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : '0.0%');

function Bars({ rows, total, colorFrom = 0 }: { rows: { label: string; value: number }[]; total: number; colorFrom?: number }) {
  const max = Math.max(1, ...rows.map((x) => x.value));
  if (!rows.length) return <p className={styles.empty}>No data for this period.</p>;
  return (
    <ul className={styles.bars}>
      {rows.map((x, i) => (
        <li key={x.label}>
          <span title={x.label}>{x.label}</span>
          <div className={styles.track}><i style={{ width: `${(x.value / max) * 100}%`, background: SHADES[(i + colorFrom) % SHADES.length] }} /></div>
          <b>{num(x.value)}</b>
          <small>{pct(x.value, total)}</small>
        </li>
      ))}
    </ul>
  );
}

function Panel({ icon, title, note, children }: { icon: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className={r.card}>
      <div className={r.toolbar}>
        <h3><Icon name={icon} size={22} /> {title}</h3>
        {note && <small className={styles.note}>{note}</small>}
      </div>
      {children}
    </section>
  );
}

export default function AnalyticsPage() {
  const [preset, setPreset] = useState<Preset>('30');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async (p: Preset, signal: AbortSignal) => {
    const { from, to } = rangeFor(p);
    setState('loading');
    try {
      const res = await fetch(`/api/analytics?from=${from}&to=${to}`, { signal });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not load analytics');
      setData(json);
      setState('ready');
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setError(e instanceof Error ? e.message : 'Could not load analytics');
      setState('error');
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(preset, ctrl.signal);
    return () => ctrl.abort();
  }, [preset, reloadKey, load]);

  const p = data?.pipeline;

  // Breakdown of campaign results by platform and by business
  const group = useMemo(() => {
    const by = (key: 'platform' | 'business') => {
      const map = new Map<string, { spend: number; leads: number; converted: number; revenue: number; campaigns: number }>();
      (data?.campaigns ?? []).forEach((c) => {
        const e = map.get(c[key]) ?? { spend: 0, leads: 0, converted: 0, revenue: 0, campaigns: 0 };
        e.spend += c.spend; e.leads += c.leadsReceived; e.converted += c.converted; e.revenue += c.revenue; e.campaigns += 1;
        map.set(c[key], e);
      });
      return [...map.entries()].sort((a, b) => b[1].spend - a[1].spend);
    };
    return { platform: by('platform'), business: by('business') };
  }, [data]);

  const ranked = useMemo(
    () => [...(data?.campaigns ?? [])].filter((c) => c.spend > 0).sort((a, b) => b.roas - a.roas),
    [data],
  );

  const cards: [string, string][] = p ? [
    ['Total leads', num(p.total)],
    [`Relevant leads (${pct(p.relevant, p.total)})`, num(p.relevant)],
    [`Bookings (${pct(p.bookings, p.relevant)} of relevant)`, num(p.bookings)],
    ['Revenue', inr(p.revenue)],
    ['Ad spend', inr(p.spend)],
    ['Cost / relevant lead', inr(p.costPerRelevant)],
  ] : [];

  const exportCsv = () => {
    if (!data) return;
    const head = ['Executive', 'Leads', 'Contacted', 'Relevant', 'Conversions', 'Conv. of relevant', 'Revenue', 'ROAS', 'Cost/booking'];
    const body = data.cses.map((c) => [c.cseName, c.crmLeads, c.contacted, c.relevant, c.conversions, `${(c.convRate * 100).toFixed(1)}%`, Math.round(c.revenue), c.roas.toFixed(2), Math.round(c.costPerBooking)]);
    const csv = [head, ...body].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'jdac-analytics-executives.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const funnelPre = p?.funnel.filter((f) => f.phase === 'pre') ?? [];
  const funnelPost = p?.funnel.filter((f) => f.phase !== 'pre') ?? [];

  return (
    <AdminLayout currentPage="analytics">
      <div className={r.page}>
        <div className={styles.bar}>
          <span className={styles.source}>
            {state === 'ready' && data ? `Live from Work Tracker · updated ${new Date(data.fetchedAt).toLocaleTimeString()}` : state === 'loading' ? 'Loading live data…' : ''}
          </span>
          <select value={preset} onChange={(e) => setPreset(e.target.value as Preset)} aria-label="Date range">
            {PRESETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button className={r.ghost} onClick={() => setReloadKey((k) => k + 1)} disabled={state === 'loading'}>Refresh</button>
          <button className={r.ghost} onClick={exportCsv} disabled={!data}>Export CSV</button>
        </div>

        {state === 'error' && (
          <p className={styles.error} role="alert">Could not load analytics: {error}. <button onClick={() => setReloadKey((k) => k + 1)}>Try again</button></p>
        )}

        <div className={r.stats} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
          {(cards.length ? cards : Array.from({ length: 6 }, (): [string, string] => ['…', '…'])).map(([l, v], i) => (
            <div key={i} className={r.stat}><small>{l}</small><strong className={styles.kpi}>{v}</strong></div>
          ))}
        </div>

        {p && (
          <>
            <div className={styles.two}>
              <Panel icon="compare" title="Lead pipeline" note="Before booking">
                <Bars rows={[{ label: 'All leads', value: p.total }, ...funnelPre.map((f) => ({ label: f.label, value: f.count }))]} total={p.total} />
              </Panel>
              <Panel icon="truck" title="After booking" note="Shipment journey">
                <Bars rows={funnelPost.map((f) => ({ label: f.label, value: f.count }))} total={p.bookings || 1} colorFrom={1} />
              </Panel>
            </div>

            <div className={styles.two}>
              <Panel icon="shield" title="Why leads were lost" note={`${num(p.lost)} lost`}>
                <Bars rows={p.lostByReason.map((x) => ({ label: x.label.replace(/^Lost — /, ''), value: x.count }))} total={p.lost} />
              </Panel>
              <Panel icon="bell" title="Why leads were irrelevant" note={`${num(p.irrelevant)} irrelevant`}>
                <Bars rows={p.irrByReason.map((x) => ({ label: x.label, value: x.count }))} total={p.irrelevant} colorFrom={2} />
              </Panel>
            </div>

            <Panel icon="users" title="Sales executive performance">
              <div className={r.tableWrap}>
                <table className={r.table}>
                  <thead>
                    <tr><th>Executive</th><th>Leads</th><th>Contacted</th><th>Relevant</th><th>Conversions</th><th>Conv. of relevant</th><th>Revenue</th><th>ROAS</th><th>Cost / booking</th></tr>
                  </thead>
                  <tbody>
                    {[...data.cses].sort((a, b) => b.revenue - a.revenue).map((c) => (
                      <tr key={c.cseId}>
                        <td><strong>{c.cseName}</strong></td>
                        <td>{num(c.crmLeads)}</td>
                        <td>{num(c.contacted)}</td>
                        <td>{num(c.relevant)}</td>
                        <td>{num(c.conversions)}</td>
                        <td>{(c.convRate * 100).toFixed(1)}%</td>
                        <td>{inr(c.revenue)}</td>
                        <td className={c.roas >= 2 ? styles.good : styles.warn}>{c.roas.toFixed(2)}×</td>
                        <td>{inr(c.costPerBooking)}</td>
                      </tr>
                    ))}
                    {data.cses.length === 0 && <tr><td colSpan={9} className={r.empty}>No executive data for this period.</td></tr>}
                  </tbody>
                </table>
              </div>
            </Panel>

            <div className={styles.two}>
              {([['platform', 'Results by platform', 'chart'], ['business', 'Results by business', 'box']] as const).map(([k, title, icon]) => (
                <Panel key={k} icon={icon} title={title}>
                  <div className={r.tableWrap}>
                    <table className={r.table}>
                      <thead><tr><th>{k === 'platform' ? 'Platform' : 'Business'}</th><th>Campaigns</th><th>Spend</th><th>Leads</th><th>Revenue</th><th>ROAS</th></tr></thead>
                      <tbody>
                        {group[k].map(([name, g]) => (
                          <tr key={name}>
                            <td><strong>{name}</strong></td><td>{g.campaigns}</td><td>{inr(g.spend)}</td><td>{num(g.leads)}</td><td>{inr(g.revenue)}</td>
                            <td className={g.spend && g.revenue / g.spend >= 2 ? styles.good : styles.warn}>{g.spend ? (g.revenue / g.spend).toFixed(2) : '0.00'}×</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              ))}
            </div>

            <div className={styles.two}>
              <Panel icon="star" title="Best campaigns by ROAS">
                <Bars rows={ranked.slice(0, 5).map((c) => ({ label: c.campaignName, value: Number(c.roas.toFixed(2)) }))} total={Math.max(1, ...ranked.slice(0, 5).map((c) => c.roas))} />
              </Panel>
              <Panel icon="bell" title="Campaigns needing attention" note="Lowest ROAS">
                <Bars rows={[...ranked].reverse().slice(0, 5).map((c) => ({ label: c.campaignName, value: Number(c.roas.toFixed(2)) }))} total={Math.max(1, ...ranked.map((c) => c.roas))} colorFrom={1} />
              </Panel>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
