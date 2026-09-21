'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Icon from '@/components/landing/Icon';
import styles from './settings.module.scss';

type Role = 'Admin' | 'Manager' | 'Sales' | 'Viewer';

interface Member { id: number; name: string; email: string; role: Role }

interface Settings {
  company: { name: string; tagline: string; email: string; phone: string; whatsapp: string; address: string };
  freight: { fuelPct: number; gstPct: number; minWeight: number; volumetricDivisor: number; validityDays: number; currency: string };
  notifications: { newLead: boolean; quoteRequested: boolean; booking: boolean; dailySummary: boolean; email: string };
  integrations: { whatsapp: boolean; analytics: boolean; analyticsId: string; pixel: boolean; pixelId: string };
  team: Member[];
  security: { sessionMinutes: number; twoFactor: boolean };
}

const DEFAULTS: Settings = {
  company: {
    name: 'JDAC', tagline: 'The Logistics Aggregator', email: 'info@jdac.in',
    phone: '+91 94296 94436', whatsapp: '919429494436', address: 'Pune, Maharashtra, India',
  },
  freight: { fuelPct: 10, gstPct: 18, minWeight: 20, volumetricDivisor: 5000, validityDays: 30, currency: 'INR' },
  notifications: { newLead: true, quoteRequested: true, booking: true, dailySummary: false, email: 'jdaclogistics@gmail.com' },
  integrations: { whatsapp: true, analytics: false, analyticsId: '', pixel: false, pixelId: '' },
  team: [
    { id: 1, name: 'Darshan Soni', email: 'darshan@jdac.in', role: 'Admin' },
    { id: 2, name: 'Sales Team', email: 'sales@jdac.in', role: 'Sales' },
  ],
  security: { sessionMinutes: 60, twoFactor: false },
};

const SECTIONS = [
  { id: 'company', label: 'Company Profile', icon: 'shield', desc: 'Business details shown on the website and quotes.' },
  { id: 'freight', label: 'Freight Defaults', icon: 'rupee', desc: 'Defaults used when calculating and creating rates.' },
  { id: 'notifications', label: 'Notifications', icon: 'bell', desc: 'Choose which events send you an email.' },
  { id: 'integrations', label: 'Integrations', icon: 'compare', desc: 'Connect messaging and tracking tools.' },
  { id: 'team', label: 'Team & Roles', icon: 'users', desc: 'Manage who can access the admin panel.' },
  { id: 'security', label: 'Security', icon: 'lock', desc: 'Session and sign-in protection.' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];
const STORAGE_KEY = 'jdac-settings';
const ROLES: Role[] = ['Admin', 'Manager', 'Sales', 'Viewer'];

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className={styles.toggleRow}>
      <span><strong>{label}</strong>{hint && <small>{hint}</small>}</span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <i aria-hidden="true" />
    </label>
  );
}

export default function SettingsPage() {
  const [data, setData] = useState<Settings>(DEFAULTS);
  const [section, setSection] = useState<SectionId>('company');
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [invite, setInvite] = useState({ name: '', email: '', role: 'Sales' as Role });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setData({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch { /* ignore corrupt storage */ }
  }, []);

  const update = <K extends keyof Settings>(key: K, patch: Partial<Settings[K]>) => {
    setData((d) => ({ ...d, [key]: { ...(d[key] as object), ...patch } }));
    setDirty(true);
    setSaved(false);
  };

  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
    setDirty(false);
    setSaved(true);
  };

  const reset = () => { setData(DEFAULTS); setDirty(true); setSaved(false); };

  const setTeam = (team: Member[]) => { setData({ ...data, team }); setDirty(true); setSaved(false); };

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.max(0, ...data.team.map((m) => m.id)) + 1;
    setTeam([...data.team, { id, ...invite }]);
    setInvite({ name: '', email: '', role: 'Sales' });
  };

  const { company, freight, notifications, integrations, security, team } = data;
  const current = SECTIONS.find((s) => s.id === section)!;
  const num = (v: string) => (v === '' ? 0 : Number(v));

  return (
    <AdminLayout currentPage="settings">
      <div className={styles.layout}>
        <nav className={styles.nav} aria-label="Settings sections">
          {SECTIONS.map((s) => (
            <button key={s.id} className={section === s.id ? styles.navOn : ''} onClick={() => setSection(s.id)}>
              <Icon name={s.icon} size={18} /> {s.label}
            </button>
          ))}
        </nav>

        <section className={styles.panel}>
          <header className={styles.panelHead}>
            <div><h2>{current.label}</h2><p>{current.desc}</p></div>
          </header>

          {section === 'company' && (
            <div className={styles.grid}>
              <label>Company name<input value={company.name} onChange={(e) => update('company', { name: e.target.value })} /></label>
              <label>Tagline<input value={company.tagline} onChange={(e) => update('company', { tagline: e.target.value })} /></label>
              <label>Contact email<input type="email" value={company.email} onChange={(e) => update('company', { email: e.target.value })} /></label>
              <label>Phone<input value={company.phone} onChange={(e) => update('company', { phone: e.target.value })} /></label>
              <label>WhatsApp number (with country code)<input value={company.whatsapp} onChange={(e) => update('company', { whatsapp: e.target.value.replace(/\D/g, '') })} /></label>
              <label className={styles.wide}>Address<textarea rows={3} value={company.address} onChange={(e) => update('company', { address: e.target.value })} /></label>
            </div>
          )}

          {section === 'freight' && (
            <div className={styles.grid}>
              <label>Default fuel surcharge (%)<input type="number" min={0} max={100} value={freight.fuelPct} onChange={(e) => update('freight', { fuelPct: num(e.target.value) })} /></label>
              <label>GST (%)<input type="number" min={0} max={100} value={freight.gstPct} onChange={(e) => update('freight', { gstPct: num(e.target.value) })} /></label>
              <label>Minimum chargeable weight (kg)<input type="number" min={0} value={freight.minWeight} onChange={(e) => update('freight', { minWeight: num(e.target.value) })} /></label>
              <label>Volumetric divisor (cm³/kg)<input type="number" min={1} value={freight.volumetricDivisor} onChange={(e) => update('freight', { volumetricDivisor: num(e.target.value) })} /></label>
              <label>Rate validity (days)<input type="number" min={1} value={freight.validityDays} onChange={(e) => update('freight', { validityDays: num(e.target.value) })} /></label>
              <label>Currency
                <select value={freight.currency} onChange={(e) => update('freight', { currency: e.target.value })}>
                  <option value="INR">INR (₹)</option>
                </select>
              </label>
            </div>
          )}

          {section === 'notifications' && (
            <div className={styles.stack}>
              <label className={styles.wide}>Send notifications to
                <input type="email" value={notifications.email} onChange={(e) => update('notifications', { email: e.target.value })} />
              </label>
              <Toggle label="New lead" hint="When someone submits the freight calculator" checked={notifications.newLead} onChange={(v) => update('notifications', { newLead: v })} />
              <Toggle label="Quote requested" hint="When a customer requests a quote from a vendor" checked={notifications.quoteRequested} onChange={(v) => update('notifications', { quoteRequested: v })} />
              <Toggle label="Booking confirmed" hint="When a quote converts to a booking" checked={notifications.booking} onChange={(v) => update('notifications', { booking: v })} />
              <Toggle label="Daily summary" hint="A digest of leads and bookings every morning" checked={notifications.dailySummary} onChange={(v) => update('notifications', { dailySummary: v })} />
            </div>
          )}

          {section === 'integrations' && (
            <div className={styles.stack}>
              <Toggle label="WhatsApp chat button" hint={`Chat links open wa.me/${company.whatsapp}`} checked={integrations.whatsapp} onChange={(v) => update('integrations', { whatsapp: v })} />
              <Toggle label="Google Analytics" hint="Track website visits" checked={integrations.analytics} onChange={(v) => update('integrations', { analytics: v })} />
              {integrations.analytics && (
                <label className={styles.wide}>Measurement ID<input placeholder="G-XXXXXXXXXX" value={integrations.analyticsId} onChange={(e) => update('integrations', { analyticsId: e.target.value })} /></label>
              )}
              <Toggle label="Meta Pixel" hint="Track campaign conversions" checked={integrations.pixel} onChange={(v) => update('integrations', { pixel: v })} />
              {integrations.pixel && (
                <label className={styles.wide}>Pixel ID<input placeholder="123456789012345" value={integrations.pixelId} onChange={(e) => update('integrations', { pixelId: e.target.value })} /></label>
              )}
            </div>
          )}

          {section === 'team' && (
            <div className={styles.stack}>
              <ul className={styles.members}>
                {team.map((m) => (
                  <li key={m.id}>
                    <span className={styles.avatar}>{m.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}</span>
                    <div><strong>{m.name}</strong><small>{m.email}</small></div>
                    <select value={m.role} aria-label={`Role for ${m.name}`}
                      onChange={(e) => setTeam(team.map((x) => (x.id === m.id ? { ...x, role: e.target.value as Role } : x)))}>
                      {ROLES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                    <button className={styles.danger} disabled={team.length === 1}
                      onClick={() => setTeam(team.filter((x) => x.id !== m.id))}>Remove</button>
                  </li>
                ))}
              </ul>
              <form className={styles.invite} onSubmit={addMember}>
                <input required placeholder="Name" value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} />
                <input required type="email" placeholder="Email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} />
                <select value={invite.role} aria-label="Role" onChange={(e) => setInvite({ ...invite, role: e.target.value as Role })}>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
                <button type="submit" className={styles.ghost}>+ Add member</button>
              </form>
            </div>
          )}

          {section === 'security' && (
            <div className={styles.stack}>
              <label className={styles.narrow}>Auto sign-out after (minutes)
                <input type="number" min={5} value={security.sessionMinutes} onChange={(e) => update('security', { sessionMinutes: num(e.target.value) })} />
              </label>
              <Toggle label="Two-factor authentication" hint="Require a code when signing in" checked={security.twoFactor} onChange={(v) => update('security', { twoFactor: v })} />
            </div>
          )}

          <footer className={styles.footer}>
            {saved && <span className={styles.ok} role="status">Settings saved</span>}
            <button className={styles.ghost} onClick={reset}>Reset to defaults</button>
            <button className={styles.primary} disabled={!dirty} onClick={save}>Save changes</button>
          </footer>
          <p className={styles.note}>Settings are stored in this browser until a backend is connected.</p>
        </section>
      </div>
    </AdminLayout>
  );
}
