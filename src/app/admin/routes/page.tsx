'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { readSheet } from 'read-excel-file/browser';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/landing/Icon';
// Shares the table / modal look of the Rates page
import styles from '../rates/rates.module.scss';
import {
  MAX_FILE_BYTES, MAX_ROWS, TEMPLATE_HEADERS, TEMPLATE_ROWS, mergeRoutes, parseRouteSheet,
  type Category, type ParseResult, type Route,
} from './routeImport';

const CATEGORIES: Category[] = ['Metro to Metro', 'Inter-state', 'Intra-state', 'Remote / ODA'];
const STORAGE_KEY = 'jdac-routes';
const RATES_KEY = 'jdac-freight-rates';

const SEED: Route[] = [
  { id: 'RT001', from: 'Pune', fromState: 'Maharashtra', to: 'Delhi', toState: 'Delhi', distanceKm: 1450, transitDays: 3, category: 'Metro to Metro', active: true },
  { id: 'RT002', from: 'Mumbai', fromState: 'Maharashtra', to: 'Delhi', toState: 'Delhi', distanceKm: 1420, transitDays: 3, category: 'Metro to Metro', active: true },
  { id: 'RT003', from: 'Pune', fromState: 'Maharashtra', to: 'Goa', toState: 'Goa', distanceKm: 450, transitDays: 2, category: 'Inter-state', active: true },
  { id: 'RT004', from: 'Mumbai', fromState: 'Maharashtra', to: 'Bangalore', toState: 'Karnataka', distanceKm: 985, transitDays: 3, category: 'Metro to Metro', active: true },
  { id: 'RT005', from: 'Delhi', fromState: 'Delhi', to: 'Ahmedabad', toState: 'Gujarat', distanceKm: 940, transitDays: 3, category: 'Inter-state', active: true },
  { id: 'RT006', from: 'Pune', fromState: 'Maharashtra', to: 'Nagpur', toState: 'Maharashtra', distanceKm: 710, transitDays: 2, category: 'Intra-state', active: false },
];

const EMPTY: Omit<Route, 'id'> = {
  from: '', fromState: '', to: '', toState: '', distanceKm: 0, transitDays: 2, category: 'Inter-state', active: true,
};

interface StoredRate { from: string; to: string; active: boolean; vendor: string; ratePerKg: number }

const norm = (s: string) => s.trim().toLowerCase();

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>(SEED);
  const [rates, setRates] = useState<StoredRate[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [tab, setTab] = useState<'routes' | 'coverage'>('routes');
  const [editing, setEditing] = useState<Route | null>(null);
  const [isNew, setIsNew] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState<{ fileName: string; result: ParseResult } | null>(null);
  const [replaceAll, setReplaceAll] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setRoutes(JSON.parse(raw));
      const r = localStorage.getItem(RATES_KEY);
      if (r) setRates(JSON.parse(r));
    } catch { /* ignore corrupt storage */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(routes)); } catch { /* storage unavailable */ }
  }, [routes, loaded]);

  // Vendors that currently have an active rate on each route
  const vendorsFor = (r: Route) => new Set(
    rates.filter((x) => x.active && norm(x.from) === norm(r.from) && norm(x.to) === norm(r.to)).map((x) => x.vendor),
  ).size;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return routes.filter((r) =>
      (category === 'all' || r.category === category) &&
      (status === 'all' || (status === 'active') === r.active) &&
      (!q || `${r.from} ${r.to} ${r.fromState} ${r.toState}`.toLowerCase().includes(q)),
    );
  }, [routes, search, category, status]);

  const vendorNames = useMemo(() => [...new Set(rates.map((x) => x.vendor))].sort(), [rates]);
  const bestRate = (rt: Route, vendor: string) => {
    const list = rates.filter((x) => x.active && x.vendor === vendor && norm(x.from) === norm(rt.from) && norm(x.to) === norm(rt.to));
    return list.length ? Math.min(...list.map((x) => x.ratePerKg)) : null;
  };

  const activeCount = routes.filter((r) => r.active).length;
  const cities = new Set(routes.flatMap((r) => [norm(r.from), norm(r.to)])).size;
  const uncovered = routes.filter((r) => r.active && vendorsFor(r) === 0).length;

  const openNew = () => { setEditing({ ...EMPTY, id: '' }); setIsNew(true); };
  const openEdit = (r: Route) => { setEditing({ ...r }); setIsNew(false); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (isNew) {
      const next = Math.max(0, ...routes.map((r) => parseInt(r.id.slice(2), 10) || 0)) + 1;
      setRoutes([{ ...editing, id: `RT${String(next).padStart(3, '0')}` }, ...routes]);
    } else {
      setRoutes(routes.map((r) => (r.id === editing.id ? editing : r)));
    }
    setEditing(null);
  };

  const remove = (r: Route) => {
    if (window.confirm(`Delete route ${r.from} → ${r.to}?`)) setRoutes(routes.filter((x) => x.id !== r.id));
  };

  const toggle = (r: Route) => setRoutes(routes.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x)));

  const exportCsv = () => {
    const head = ['ID', 'From', 'From state', 'To', 'To state', 'Distance (km)', 'Transit (days)', 'Category', 'Active'];
    const rows = filtered.map((r) => [r.id, r.from, r.fromState, r.to, r.toState, r.distanceKm, r.transitDays, r.category, r.active]);
    const csv = [head, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'jdac-routes.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    setNotice('');
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setNotice('Please choose an .xlsx Excel file (save older .xls or .csv files as .xlsx first).');
      return;
    }
    if (file.size > MAX_FILE_BYTES) { setNotice('That file is larger than 2 MB. Split it into smaller files.'); return; }
    try {
      const data = await readSheet(file);
      if (data.length - 1 > MAX_ROWS) { setNotice(`That sheet has more than ${MAX_ROWS} rows. Split it into smaller files.`); return; }
      setReplaceAll(false);
      setImporting({ fileName: file.name, result: parseRouteSheet(data as unknown[][]) });
    } catch {
      setNotice('Could not read that file. Make sure it is a valid .xlsx workbook and not password-protected.');
    }
  };

  const downloadTemplate = async () => {
    const { default: writeExcelFile } = await import('write-excel-file/browser');
    await writeExcelFile([TEMPLATE_HEADERS, ...TEMPLATE_ROWS]).toFile('jdac-routes-template.xlsx');
  };

  const confirmImport = () => {
    if (!importing) return;
    const { routes: next, added, updated } = mergeRoutes(routes, importing.result.routes, replaceAll);
    setRoutes(next);
    setNotice(`Import complete: ${added} added, ${updated} updated${replaceAll ? ' (previous routes replaced)' : ''}.`);
    setImporting(null);
  };

  const set = <K extends keyof Route>(k: K, v: Route[K]) => editing && setEditing({ ...editing, [k]: v });

  return (
    <AdminLayout currentPage="routes">
      <div className={styles.page}>
        <div className={styles.tabs} role="tablist">
          <button role="tab" aria-selected={tab === 'routes'} className={tab === 'routes' ? styles.tabOn : ''} onClick={() => setTab('routes')}>Routes</button>
          <button role="tab" aria-selected={tab === 'coverage'} className={tab === 'coverage' ? styles.tabOn : ''} onClick={() => setTab('coverage')}>Vendor coverage</button>
        </div>

        <div className={styles.stats}>
          {[
            ['Total routes', String(routes.length)],
            ['Active routes', String(activeCount)],
            ['Cities connected', String(cities)],
            ['Active routes without rates', String(uncovered)],
          ].map(([l, v]) => (
            <div key={l} className={styles.stat}><small>{l}</small><strong>{v}</strong></div>
          ))}
        </div>

        {tab === 'coverage' ? (
        <section className={styles.card}>
          <div className={styles.toolbar}>
            <h3><Icon name="truck" size={22} /> Vendor coverage</h3>
          </div>
          <div className={styles.tableWrap}>
            <table className={`${styles.table} ${styles.matrix}`}>
              <thead>
                <tr><th>Route</th>{vendorNames.map((v) => <th key={v}>{v}</th>)}</tr>
              </thead>
              <tbody>
                {routes.filter((x) => x.active).map((rt) => (
                  <tr key={rt.id}>
                    <td><strong>{rt.from} → {rt.to}</strong></td>
                    {vendorNames.map((v) => {
                      const p = bestRate(rt, v);
                      return <td key={v} className={p === null ? styles.cellOff : styles.cellOn}>{p === null ? '—' : `₹${p.toFixed(2)}/kg`}</td>;
                    })}
                  </tr>
                ))}
                {(vendorNames.length === 0 || routes.every((x) => !x.active)) && (
                  <tr><td colSpan={vendorNames.length + 1} className={styles.empty}>Add active routes and freight rates to see vendor coverage.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>Shows the lowest active rate per kg each vendor offers on a route, from the Freight rates page.</p>
        </section>
        ) : (
        <section className={styles.card}>
          <div className={styles.toolbar}>
            <h3><Icon name="pin" size={22} /> Routes Management</h3>
            <div className={styles.actions}>
              <button className={styles.ghost} onClick={downloadTemplate}>Download template</button>
              <button className={styles.ghost} onClick={() => fileRef.current?.click()}>Import Excel</button>
              <input ref={fileRef} type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={onFile} hidden />
              <button className={styles.ghost} onClick={exportCsv}>Export CSV</button>
              <button className={styles.primary} onClick={openNew}>+ Add Route</button>
            </div>
          </div>

          {notice && <p className={styles.notice} role="status">{notice} <button onClick={() => setNotice('')} aria-label="Dismiss">✕</button></p>}

          <div className={styles.filters}>
            <label className={styles.search}>
              <Icon name="search" size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search city or state..." />
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Route</th><th>States</th><th>Category</th><th>Distance</th><th>Transit</th>
                  <th>Vendors with rates</th><th>Status</th><th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const n = vendorsFor(r);
                  return (
                    <tr key={r.id}>
                      <td><strong>{r.from} → {r.to}</strong></td>
                      <td>{r.fromState || '—'} → {r.toState || '—'}</td>
                      <td>{r.category}</td>
                      <td>{r.distanceKm.toLocaleString('en-IN')} km</td>
                      <td>{r.transitDays} {r.transitDays === 1 ? 'day' : 'days'}</td>
                      <td>
                        {n > 0
                          ? <span className={styles.best}>{n} {n === 1 ? 'vendor' : 'vendors'}</span>
                          : <span className={`${styles.pill} ${styles.off}`}>No rates</span>}
                      </td>
                      <td>
                        <button className={`${styles.pill} ${r.active ? styles.on : styles.off}`} onClick={() => toggle(r)} title="Toggle active">
                          {r.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className={styles.rowActions}>
                        <button onClick={() => openEdit(r)}>Edit</button>
                        <button className={styles.danger} onClick={() => remove(r)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className={styles.empty}>No routes match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>“Vendors with rates” counts active entries on the Freight rates page for the same cities. Routes are saved in this browser until a backend is connected.</p>
        </section>
        )}
      </div>

      {importing && (() => {
        const { result, fileName } = importing;
        const blocked = result.missingColumns.length > 0;
        return (
          <div className={styles.overlay} onClick={() => setImporting(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Import preview">
              <h3>Import preview</h3>
              <p className={styles.fileName}>{fileName}</p>
              {blocked ? (
                <p className={styles.errBox}>Missing required column{result.missingColumns.length > 1 ? 's' : ''}: <strong>{result.missingColumns.join(', ')}</strong>. Use “Download template” for the expected layout.</p>
              ) : (
                <>
                  <div className={styles.importStats}>
                    <div><strong>{result.routes.length}</strong><small>valid rows</small></div>
                    <div className={result.errors.length ? styles.bad : ''}><strong>{result.errors.length}</strong><small>rows with errors</small></div>
                    <div><strong>{result.totalRows}</strong><small>total rows</small></div>
                  </div>

                  {result.errors.length > 0 && (
                    <div className={styles.errBox}>
                      <strong>These rows will be skipped:</strong>
                      <ul>
                        {result.errors.slice(0, 8).map((er) => <li key={er.row}>Row {er.row}: {er.message}</li>)}
                        {result.errors.length > 8 && <li>…and {result.errors.length - 8} more</li>}
                      </ul>
                    </div>
                  )}

                  {result.routes.length > 0 && (
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead><tr><th>Route</th><th>Category</th><th>Distance</th><th>Transit</th></tr></thead>
                        <tbody>
                          {result.routes.slice(0, 5).map((r, i) => (
                            <tr key={i}><td>{r.from} → {r.to}</td><td>{r.category}</td><td>{r.distanceKm.toLocaleString('en-IN')} km</td><td>{r.transitDays} days</td></tr>
                          ))}
                        </tbody>
                      </table>
                      {result.routes.length > 5 && <p className={styles.note}>Showing 5 of {result.routes.length} valid rows.</p>}
                    </div>
                  )}

                  <label className={styles.replace}>
                    <input type="checkbox" checked={replaceAll} onChange={(e) => setReplaceAll(e.target.checked)} />
                    Replace all existing routes ({routes.length}) instead of merging
                  </label>
                  <p className={styles.note}>Merging updates a route when the From and To cities already exist, and adds the rest.</p>
                </>
              )}
              <div className={styles.modalActions}>
                <button type="button" className={styles.ghost} onClick={() => setImporting(null)}>Cancel</button>
                {!blocked && (
                  <button type="button" className={styles.primary} disabled={result.routes.length === 0} onClick={confirmImport}>
                    Import {result.routes.length} route{result.routes.length === 1 ? '' : 's'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {editing && (
        <div className={styles.overlay} onClick={() => setEditing(null)}>
          <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{isNew ? 'Add route' : `Edit route ${editing.id}`}</h3>
            <div className={styles.grid}>
              <label>From city<input required value={editing.from} onChange={(e) => set('from', e.target.value)} /></label>
              <label>From state<input value={editing.fromState} onChange={(e) => set('fromState', e.target.value)} /></label>
              <label>To city<input required value={editing.to} onChange={(e) => set('to', e.target.value)} /></label>
              <label>To state<input value={editing.toState} onChange={(e) => set('toState', e.target.value)} /></label>
              <label>Distance (km)<input required type="number" min={1} value={editing.distanceKm || ''} onChange={(e) => set('distanceKm', Number(e.target.value))} /></label>
              <label>Transit (days)<input required type="number" min={1} value={editing.transitDays} onChange={(e) => set('transitDays', Number(e.target.value))} /></label>
              <label>Category
                <select value={editing.category} onChange={(e) => set('category', e.target.value as Category)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className={styles.check}>
                <input type="checkbox" checked={editing.active} onChange={(e) => set('active', e.target.checked)} /> Active
              </label>
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.ghost} onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className={styles.primary}>{isNew ? 'Add route' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
