'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { readSheet } from 'read-excel-file/browser';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/landing/Icon';
import styles from './rates.module.scss';
import {
  MAX_FILE_BYTES, MAX_ROWS, TEMPLATE_HEADERS, TEMPLATE_ROWS, mergeRates, parseRateSheet,
  type ParseResult, type Rate,
} from './rateImport';

const VENDORS = ['Vendor A', 'Vendor B', 'Vendor C', 'ABC Logistics'];
const STORAGE_KEY = 'jdac-freight-rates';

const SEED: Rate[] = [
  { id: 'R001', vendor: 'Vendor A', from: 'Pune', to: 'Delhi', ratePerKg: 4.2, minCharge: 420, fuelPct: 10, transitDays: 3, validTill: '2026-12-31', active: true },
  { id: 'R002', vendor: 'Vendor B', from: 'Pune', to: 'Delhi', ratePerKg: 3.9, minCharge: 390, fuelPct: 12, transitDays: 4, validTill: '2026-12-31', active: true },
  { id: 'R003', vendor: 'Vendor C', from: 'Pune', to: 'Delhi', ratePerKg: 5.5, minCharge: 550, fuelPct: 8, transitDays: 2, validTill: '2026-11-30', active: true },
  { id: 'R004', vendor: 'Vendor A', from: 'Mumbai', to: 'Bangalore', ratePerKg: 3.6, minCharge: 360, fuelPct: 10, transitDays: 3, validTill: '2026-12-31', active: true },
  { id: 'R005', vendor: 'ABC Logistics', from: 'Mumbai', to: 'Delhi', ratePerKg: 4.8, minCharge: 480, fuelPct: 9, transitDays: 3, validTill: '2026-10-15', active: false },
  { id: 'R006', vendor: 'Vendor B', from: 'Pune', to: 'Goa', ratePerKg: 2.9, minCharge: 290, fuelPct: 10, transitDays: 2, validTill: '2026-12-31', active: true },
];

const EMPTY: Omit<Rate, 'id'> = {
  vendor: VENDORS[0], from: '', to: '', ratePerKg: 0, minCharge: 0,
  fuelPct: 10, transitDays: 3, validTill: '', active: true,
};

const inr = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

function quote(r: Rate, kg: number) {
  const freight = Math.max(r.minCharge, kg * r.ratePerKg);
  return freight * (1 + r.fuelPct / 100);
}

export default function RatesPage() {
  const [rates, setRates] = useState<Rate[]>(SEED);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [vendor, setVendor] = useState('all');
  const [status, setStatus] = useState('all');
  const [editing, setEditing] = useState<Rate | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [weight, setWeight] = useState(100);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState<{ fileName: string; result: ParseResult } | null>(null);
  const [replaceAll, setReplaceAll] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setRates(JSON.parse(raw));
    } catch { /* ignore corrupt storage */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rates)); } catch { /* storage unavailable */ }
  }, [rates, loaded]);

  const vendorOptions = useMemo(() => [...new Set([...VENDORS, ...rates.map((r) => r.vendor)])].sort(), [rates]);

  const today = new Date().toISOString().slice(0, 10);
  const expired = (r: Rate) => r.validTill !== '' && r.validTill < today;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rates.filter((r) =>
      (vendor === 'all' || r.vendor === vendor) &&
      (status === 'all' || (status === 'active' ? r.active && !expired(r) : !r.active || expired(r))) &&
      (!q || `${r.from} ${r.to} ${r.vendor}`.toLowerCase().includes(q)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rates, search, vendor, status]);

  // Cheapest active quote per route for the calculator preview
  const best = useMemo(() => {
    const map = new Map<string, string>();
    const routes = new Set(rates.map((r) => `${r.from}|${r.to}`));
    routes.forEach((key) => {
      const live = rates.filter((r) => `${r.from}|${r.to}` === key && r.active && !expired(r));
      if (live.length) map.set(key, live.reduce((a, b) => (quote(a, weight) <= quote(b, weight) ? a : b)).id);
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rates, weight]);

  const activeCount = rates.filter((r) => r.active && !expired(r)).length;
  const routeCount = new Set(rates.map((r) => `${r.from}|${r.to}`)).size;
  const avg = rates.length ? rates.reduce((n, r) => n + r.ratePerKg, 0) / rates.length : 0;

  const openNew = () => { setEditing({ ...EMPTY, id: '' }); setIsNew(true); };
  const openEdit = (r: Rate) => { setEditing({ ...r }); setIsNew(false); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (isNew) {
      const next = Math.max(0, ...rates.map((r) => parseInt(r.id.slice(1), 10) || 0)) + 1;
      setRates([{ ...editing, id: `R${String(next).padStart(3, '0')}` }, ...rates]);
    } else {
      setRates(rates.map((r) => (r.id === editing.id ? editing : r)));
    }
    setEditing(null);
  };

  const remove = (r: Rate) => {
    if (window.confirm(`Delete ${r.vendor} rate for ${r.from} → ${r.to}?`)) setRates(rates.filter((x) => x.id !== r.id));
  };

  const toggle = (r: Rate) => setRates(rates.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x)));

  const exportCsv = () => {
    const head = ['ID', 'Vendor', 'From', 'To', 'Rate/kg', 'Min charge', 'Fuel %', 'Transit days', 'Valid till', 'Active'];
    const rows = filtered.map((r) => [r.id, r.vendor, r.from, r.to, r.ratePerKg, r.minCharge, r.fuelPct, r.transitDays, r.validTill, r.active]);
    const csv = [head, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'jdac-freight-rates.csv';
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
      setImporting({ fileName: file.name, result: parseRateSheet(data as unknown[][]) });
    } catch {
      setNotice('Could not read that file. Make sure it is a valid .xlsx workbook and not password-protected.');
    }
  };

  const downloadTemplate = async () => {
    const { default: writeExcelFile } = await import('write-excel-file/browser');
    await writeExcelFile([TEMPLATE_HEADERS, ...TEMPLATE_ROWS]).toFile('jdac-freight-rates-template.xlsx');
  };

  const confirmImport = () => {
    if (!importing) return;
    const { rates: next, added, updated } = mergeRates(rates, importing.result.rates, replaceAll);
    setRates(next);
    setNotice(`Import complete: ${added} added, ${updated} updated${replaceAll ? ' (previous rates replaced)' : ''}.`);
    setImporting(null);
  };

  const set = <K extends keyof Rate>(k: K, v: Rate[K]) => editing && setEditing({ ...editing, [k]: v });

  return (
    <AdminLayout currentPage="rates">
      <div className={styles.page}>
        <div className={styles.stats}>
          {[
            ['Total rates', String(rates.length)],
            ['Active rates', String(activeCount)],
            ['Routes covered', String(routeCount)],
            ['Avg. rate / kg', `₹${avg.toFixed(2)}`],
          ].map(([l, v]) => (
            <div key={l} className={styles.stat}><small>{l}</small><strong>{v}</strong></div>
          ))}
        </div>

        <section className={styles.card}>
          <div className={styles.toolbar}>
            <h3><Icon name="rupee" size={22} /> Freight Rate Management</h3>
            <div className={styles.actions}>
              <button className={styles.ghost} onClick={downloadTemplate}>Download template</button>
              <button className={styles.ghost} onClick={() => fileRef.current?.click()}>Import Excel</button>
              <input ref={fileRef} type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={onFile} hidden />
              <button className={styles.ghost} onClick={exportCsv}>Export CSV</button>
              <button className={styles.primary} onClick={openNew}>+ Add Rate</button>
            </div>
          </div>

          {notice && <p className={styles.notice} role="status">{notice} <button onClick={() => setNotice('')} aria-label="Dismiss">✕</button></p>}

          <div className={styles.filters}>
            <label className={styles.search}>
              <Icon name="search" size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search city or vendor..." />
            </label>
            <select value={vendor} onChange={(e) => setVendor(e.target.value)} aria-label="Vendor">
              <option value="all">All vendors</option>
              {vendorOptions.map((v) => <option key={v}>{v}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive / expired</option>
            </select>
            <label className={styles.calc}>
              Preview weight (kg)
              <input type="number" min={1} value={weight} onChange={(e) => setWeight(Math.max(1, Number(e.target.value) || 1))} />
            </label>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Vendor</th><th>Route</th><th>Rate/kg</th><th>Min charge</th>
                  <th>Fuel</th><th>Transit</th><th>Quote @ {weight} kg</th><th>Valid till</th><th>Status</th><th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const isBest = best.get(`${r.from}|${r.to}`) === r.id;
                  return (
                    <tr key={r.id}>
                      <td><strong>{r.vendor}</strong></td>
                      <td>{r.from} → {r.to}</td>
                      <td>₹{r.ratePerKg.toFixed(2)}</td>
                      <td>{inr(r.minCharge)}</td>
                      <td>{r.fuelPct}%</td>
                      <td>{r.transitDays} {r.transitDays === 1 ? 'day' : 'days'}</td>
                      <td>{inr(quote(r, weight))} {isBest && <span className={styles.best}>Lowest</span>}</td>
                      <td>{r.validTill || '—'}</td>
                      <td>
                        <button
                          className={`${styles.pill} ${expired(r) ? styles.expired : r.active ? styles.on : styles.off}`}
                          onClick={() => toggle(r)} title="Toggle active"
                        >
                          {expired(r) ? 'Expired' : r.active ? 'Active' : 'Inactive'}
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
                  <tr><td colSpan={11} className={styles.empty}>No rates match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>Quote = max(minimum charge, weight × rate/kg) + fuel surcharge. Rates are saved in this browser until a backend is connected.</p>
        </section>
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
                    <div><strong>{result.rates.length}</strong><small>valid rows</small></div>
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

                  {result.rates.length > 0 && (
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead><tr><th>Vendor</th><th>Route</th><th>Rate/kg</th><th>Valid till</th></tr></thead>
                        <tbody>
                          {result.rates.slice(0, 5).map((r, i) => (
                            <tr key={i}><td>{r.vendor}</td><td>{r.from} → {r.to}</td><td>₹{r.ratePerKg.toFixed(2)}</td><td>{r.validTill || '—'}</td></tr>
                          ))}
                        </tbody>
                      </table>
                      {result.rates.length > 5 && <p className={styles.note}>Showing 5 of {result.rates.length} valid rows.</p>}
                    </div>
                  )}

                  <label className={styles.replace}>
                    <input type="checkbox" checked={replaceAll} onChange={(e) => setReplaceAll(e.target.checked)} />
                    Replace all existing rates ({rates.length}) instead of merging
                  </label>
                  <p className={styles.note}>Merging updates a rate when the vendor and route already exist, and adds the rest.</p>
                </>
              )}
              <div className={styles.modalActions}>
                <button type="button" className={styles.ghost} onClick={() => setImporting(null)}>Cancel</button>
                {!blocked && (
                  <button type="button" className={styles.primary} disabled={result.rates.length === 0} onClick={confirmImport}>
                    Import {result.rates.length} rate{result.rates.length === 1 ? '' : 's'}
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
            <h3>{isNew ? 'Add freight rate' : `Edit rate ${editing.id}`}</h3>
            <div className={styles.grid}>
              <label>Vendor
                <select value={editing.vendor} onChange={(e) => set('vendor', e.target.value)}>
                  {vendorOptions.map((v) => <option key={v}>{v}</option>)}
                </select>
              </label>
              <label>From city<input required value={editing.from} onChange={(e) => set('from', e.target.value)} /></label>
              <label>To city<input required value={editing.to} onChange={(e) => set('to', e.target.value)} /></label>
              <label>Rate per kg (₹)<input required type="number" min={0} step="0.01" value={editing.ratePerKg} onChange={(e) => set('ratePerKg', Number(e.target.value))} /></label>
              <label>Minimum charge (₹)<input required type="number" min={0} value={editing.minCharge} onChange={(e) => set('minCharge', Number(e.target.value))} /></label>
              <label>Fuel surcharge (%)<input required type="number" min={0} max={100} value={editing.fuelPct} onChange={(e) => set('fuelPct', Number(e.target.value))} /></label>
              <label>Transit (days)<input required type="number" min={1} value={editing.transitDays} onChange={(e) => set('transitDays', Number(e.target.value))} /></label>
              <label>Valid till<input type="date" value={editing.validTill} onChange={(e) => set('validTill', e.target.value)} /></label>
              <label className={styles.check}>
                <input type="checkbox" checked={editing.active} onChange={(e) => set('active', e.target.checked)} /> Active
              </label>
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.ghost} onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className={styles.primary}>{isNew ? 'Add rate' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
