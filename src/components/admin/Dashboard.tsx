'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '@/components/landing/Icon';
import type { TrackerCampaign, TrackerData } from '@/lib/campaignTracker';
import styles from './Dashboard.module.scss';

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

function change(cur: number, prev: number) {
  if (!prev) return null;
  const v = ((cur - prev) / prev) * 100;
  return `${v >= 0 ? '+' : ''}${v.toFixed(0)}%`;
}

type Bar = [label: string, value: number];

function BarList({ data, format = num }: { data: Bar[]; format?: (n: number) => string }) {
  const max = Math.max(1, ...data.map((d) => d[1]));
  if (!data.length) return <p className={styles.empty}>No data for this period.</p>;
  return (
    <ul className={styles.bars}>
      {data.map(([label, v], i) => (
        <li key={label}>
          <span title={label}>{label}</span>
          <div className={styles.track}><i style={{ width: `${(v / max) * 100}%`, background: SHADES[i % SHADES.length] }} /></div>
          <b className={v === 0 ? styles.zero : ''}>{format(v)}</b>
        </li>
      ))}
    </ul>
  );
}

function Card({ icon, title, href, children }: { icon: string; title: string; href?: string; children: React.ReactNode }) {
  return (
    <section className={styles.card}>
      <header>
        <h3><Icon name={icon} size={22} />{title}</h3>
        {href && <a href={href}>View all</a>}
      </header>
      {children}
    </section>
  );
}

function Donut({ slices, centerLabel, centerValue }: { slices: Bar[]; centerLabel: string; centerValue: string }) {
  const total = slices.reduce((n, s) => n + s[1], 0);
  const r = 62;
  const c = 2 * Math.PI * r;
  if (!total) return <p className={styles.empty}>No data for this period.</p>;
  const lens = slices.map((s) => (s[1] / total) * c);
  return (
    <svg viewBox="0 0 180 180" className={styles.donut} role="img" aria-label={centerLabel}>
      {slices.map((s, i) => {
        const offset = lens.slice(0, i).reduce((n, l) => n + l, 0);
        return (
          <circle key={s[0]} cx="90" cy="90" r={r} fill="none" stroke={SHADES[i % SHADES.length]} strokeWidth="28"
            strokeDasharray={`${lens[i]} ${c - lens[i]}`} strokeDashoffset={-offset} transform="rotate(-90 90 90)" />
        );
      })}
      <text x="90" y="88" textAnchor="middle" fontSize="20" fontWeight="700" fill="#0b1f4d">{centerValue}</text>
      <text x="90" y="108" textAnchor="middle" fontSize="12" fill="#4a4a4a">{centerLabel}</text>
    </svg>
  );
}

function sum(rows: TrackerCampaign[], key: 'spend' | 'leadsReceived' | 'validLeads' | 'converted' | 'revenue') {
  return rows.reduce((n, c) => n + c[key], 0);
}

function groupBy(rows: TrackerCampaign[], keyOf: (c: TrackerCampaign) => string, value: (c: TrackerCampaign) => number): Bar[] {
  const map = new Map<string, number>();
  rows.forEach((c) => map.set(keyOf(c), (map.get(keyOf(c)) ?? 0) + value(c)));
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export default function Dashboard() {
  const [preset, setPreset] = useState<Preset>('30');
  const [business, setBusiness] = useState('Logistics');
  const [data, setData] = useState<TrackerData | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  // Freight platform data saved by the Rates and Routes pages
  const [platform, setPlatform] = useState({ rates: 0, activeRates: 0, routes: 0, uncovered: 0 });

  const load = useCallback(async (p: Preset, signal: AbortSignal) => {
    const { from, to } = rangeFor(p);
    setState('loading');
    try {
      const res = await fetch(`/api/campaigns?from=${from}&to=${to}`, { signal });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not load data');
      setData(json);
      setState('ready');
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setError(e instanceof Error ? e.message : 'Could not load data');
      setState('error');
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(preset, ctrl.signal);
    return () => ctrl.abort();
  }, [preset, reloadKey, load]);

  useEffect(() => {
    try {
      const rates: { from: string; to: string; active: boolean }[] = JSON.parse(localStorage.getItem('jdac-freight-rates') || '[]');
      const routes: { from: string; to: string; active: boolean }[] = JSON.parse(localStorage.getItem('jdac-routes') || '[]');
      const key = (x: { from: string; to: string }) => `${x.from.trim().toLowerCase()}|${x.to.trim().toLowerCase()}`;
      const covered = new Set(rates.filter((r) => r.active).map(key));
      const active = routes.filter((r) => r.active);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlatform({
        rates: rates.length, activeRates: rates.filter((r) => r.active).length,
        routes: active.length, uncovered: active.filter((r) => !covered.has(key(r))).length,
      });
    } catch { /* storage unavailable or corrupt: leave zeros */ }
  }, []);

  const businesses = useMemo(() => [...new Set((data?.campaigns ?? []).map((c) => c.business))], [data]);
  const rows = useMemo(
    () => (data?.campaigns ?? []).filter((c) => business === 'all' || c.business === business),
    [data, business],
  );

  const leads = sum(rows, 'leadsReceived');
  const valid = sum(rows, 'validLeads');
  const converted = sum(rows, 'converted');
  const spend = sum(rows, 'spend');
  const revenue = sum(rows, 'revenue');
  const roas = spend ? revenue / spend : 0;
  const prev = business === 'all' ? data?.previous : undefined;

  const kpis = [
    { icon: 'users', label: 'Total Leads', value: num(leads), d: prev ? change(leads, prev.leadsReceived) : null, tone: 'blue' },
    { icon: 'star', label: 'Qualified Leads', value: num(valid), d: prev ? change(valid, prev.validLeads) : null, tone: 'orange' },
    { icon: 'box', label: 'Conversions', value: num(converted), d: prev ? change(converted, prev.converted) : null, tone: 'purple' },
    { icon: 'chart', label: 'Conversion Rate', value: pct(converted, leads), d: null, tone: 'purple' },
    { icon: 'rupee', label: 'Ad Spend', value: inr(spend), d: prev ? change(spend, prev.spend) : null, tone: 'teal' },
    { icon: 'compare', label: 'ROAS', value: `${roas.toFixed(2)}×`, d: null, tone: 'orange' },
  ];

  const byCampaign = groupBy(rows, (c) => c.campaignName, (c) => c.leadsReceived).slice(0, 5);
  const spendByPlatform = groupBy(rows, (c) => c.platform, (c) => c.spend);
  const leadsByCse = groupBy(rows, (c) => (c.defaultCseId && data?.cses[c.defaultCseId]) || 'Unassigned', (c) => c.leadsReceived).slice(0, 5);
  const revenueSlices = (() => {
    const all = groupBy(rows, (c) => c.campaignName, (c) => c.revenue);
    const top = all.slice(0, 4);
    const rest = all.slice(4).reduce((n, x) => n + x[1], 0);
    return rest > 0 ? [...top, ['Others', rest] as Bar] : top;
  })();

  const exportCsv = () => {
    const head = ['Campaign', 'Business', 'Platform', 'Spend', 'Leads', 'Qualified', 'Conversions', 'Revenue'];
    const body = rows.map((c) => [c.campaignName, c.business, c.platform, Math.round(c.spend), c.leadsReceived, c.validLeads, c.converted, Math.round(c.revenue)]);
    const csv = [head, ...body].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'jdac-dashboard.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className={styles.dash}>
      <div className={styles.toolbar}>
        <span className={styles.source}>
          {state === 'ready' && data ? `Live from Work Tracker · updated ${new Date(data.fetchedAt).toLocaleTimeString()}` : state === 'loading' ? 'Loading live data…' : ''}
        </span>
        <select className={styles.date} value={business} onChange={(e) => setBusiness(e.target.value)} aria-label="Business">
          <option value="all">All businesses</option>
          {businesses.map((b) => <option key={b}>{b}</option>)}
        </select>
        <select className={styles.date} value={preset} onChange={(e) => setPreset(e.target.value as Preset)} aria-label="Date range">
          {PRESETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button className={styles.date} onClick={() => setReloadKey((k) => k + 1)} disabled={state === 'loading'}>Refresh</button>
        <button className={styles.export} onClick={exportCsv} disabled={!rows.length}><Icon name="arrow" size={16} /> Export</button>
      </div>

      {state === 'error' && (
        <p className={styles.error} role="alert">Could not load live data: {error}. <button onClick={() => setReloadKey((k) => k + 1)}>Try again</button></p>
      )}

      <div className={styles.kpis}>
        {kpis.map((k) => (
          <div key={k.label} className={styles.kpi}>
            <span className={`${styles.kpiIcon} ${styles[k.tone]}`}><Icon name={k.icon} size={28} /></span>
            <div>
              <small>{k.label}</small>
              <strong>{state === 'loading' && !data ? '…' : k.value}</strong>
              {k.d && <em>&#8599; {k.d}</em>}
              {k.d && <span>vs previous period</span>}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.grid2}>
        <Card icon="bell" title="Leads by campaign" href="/admin/campaigns"><BarList data={byCampaign} /></Card>
        <Card icon="chart" title="Ad spend by platform" href="/admin/campaigns"><BarList data={spendByPlatform} format={inr} /></Card>
        <Card icon="users" title="Leads by sales executive" href="/admin/campaigns"><BarList data={leadsByCse} /></Card>
        <Card icon="rupee" title="Revenue share by campaign" href="/admin/campaigns">
          <div className={styles.vendorShare}>
            <Donut slices={revenueSlices} centerLabel="Revenue" centerValue={inr(revenue)} />
            <table>
              <tbody>
                {revenueSlices.map((s, i) => (
                  <tr key={s[0]}>
                    <td><i style={{ background: SHADES[i % SHADES.length] }} />{s[0]}</td><td>{inr(s[1])}</td><td>{pct(s[1], revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <section className={`${styles.card} ${styles.conv}`}>
        <div>
          <h3><Icon name="chart" size={22} />Lead → conversion funnel</h3>
          <ul className={styles.bars}>
            {([['Leads received', leads], ['Qualified leads', valid], ['Conversions', converted]] as Bar[]).map(([label, v], i) => (
              <li key={label}>
                <span>{label}</span><b className={styles.big}>{num(v)}</b>
                <div className={styles.track}><i style={{ width: `${leads ? (v / leads) * 100 : 0}%`, background: SHADES[i] }} /></div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.rate}>
          <span className={styles.rateIcon}><Icon name="chart" size={24} /></span>
          <div><small>Cost per lead</small><strong>{leads ? inr(spend / leads) : '—'}</strong></div>
          <em>{converted ? `${inr(spend / converted)} / conversion` : ''}</em>
        </div>
      </section>

      <section className={styles.card}>
        <header>
          <h3><Icon name="truck" size={22} />Freight platform</h3>
          <a href="/admin/rates">Manage rates</a>
        </header>
        <div className={styles.platform}>
          <div><strong>{platform.activeRates}</strong><small>active freight rates ({platform.rates} total)</small></div>
          <div><strong>{platform.routes}</strong><small>active routes</small></div>
          <div className={platform.uncovered ? styles.warnBox : ''}><strong>{platform.uncovered}</strong><small>active routes without a rate</small></div>
        </div>
      </section>
    </div>
  );
}
