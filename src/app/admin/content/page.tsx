'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/landing/Icon';
import type { StatItem } from '@/lib/siteContent';
import styles from './content.module.scss';

const ICONS: [string, string][] = [
  ['users', 'People'], ['pin', 'Location'], ['truck', 'Truck'], ['star', 'Star'],
  ['chart', 'Chart'], ['box', 'Box'], ['shield', 'Shield'], ['headset', 'Support'],
];
const MAX = 6;

export default function ContentPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving' | 'saved' | 'error'>('loading');
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((c) => { setStats(c.stats); setStatus('ready'); })
      .catch(() => { setError('Could not load content.'); setStatus('error'); });
  }, []);

  const change = (next: StatItem[]) => { setStats(next); setDirty(true); setStatus('ready'); };
  const edit = (i: number, patch: Partial<StatItem>) => change(stats.map((s, n) => (n === i ? { ...s, ...patch } : s)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= stats.length) return;
    const next = [...stats];
    [next[i], next[j]] = [next[j], next[i]];
    change(next);
  };

  const save = async () => {
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setStats(data.stats);
      setDirty(false);
      setStatus('saved');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
      setStatus('error');
    }
  };

  const invalid = stats.some((s) => !s.value.trim() || !s.label.trim());

  return (
    <AdminLayout currentPage="content">
      <div className={styles.page}>
        <section className={styles.card}>
          <header className={styles.head}>
            <div>
              <h3>Homepage stats bar</h3>
              <p>The numbers shown under the hero on the public website.</p>
            </div>
            <a href="/" target="_blank" rel="noreferrer" className={styles.ghost}>View website</a>
          </header>

          <h4 className={styles.sub}>Preview</h4>
          <div className={styles.preview}>
            {stats.map((s, i) => (
              <div key={i}>
                <span><Icon name={s.icon} size={26} /></span>
                <div><strong>{s.value || '—'}</strong><small>{s.label || '—'}</small></div>
              </div>
            ))}
          </div>

          <h4 className={styles.sub}>Edit</h4>
          <ul className={styles.rows}>
            {stats.map((s, i) => (
              <li key={i}>
                <select value={s.icon} aria-label="Icon" onChange={(e) => edit(i, { icon: e.target.value })}>
                  {ICONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <input aria-label="Value" placeholder="10,000+" maxLength={20} value={s.value} onChange={(e) => edit(i, { value: e.target.value })} />
                <input aria-label="Label" placeholder="Shipments Managed" maxLength={40} value={s.label} onChange={(e) => edit(i, { label: e.target.value })} />
                <div className={styles.rowBtns}>
                  <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                  <button aria-label="Move down" disabled={i === stats.length - 1} onClick={() => move(i, 1)}>↓</button>
                  <button aria-label="Remove" className={styles.danger} disabled={stats.length === 1}
                    onClick={() => change(stats.filter((_, n) => n !== i))}>✕</button>
                </div>
              </li>
            ))}
          </ul>

          <footer className={styles.foot}>
            <button className={styles.ghost} disabled={stats.length >= MAX}
              onClick={() => change([...stats, { icon: 'star', value: '', label: '' }])}>+ Add stat</button>
            <span className={styles.msg} role="status">
              {status === 'saved' && 'Saved — the website is updated.'}
              {status === 'error' && <b>{error}</b>}
              {invalid && dirty && 'Every stat needs a value and a label.'}
            </span>
            <button className={styles.primary} onClick={save}
              disabled={!dirty || invalid || status === 'saving' || status === 'loading'}>
              {status === 'saving' ? 'Saving…' : 'Save changes'}
            </button>
          </footer>
        </section>
      </div>
    </AdminLayout>
  );
}
