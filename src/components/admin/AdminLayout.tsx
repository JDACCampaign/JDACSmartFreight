import Link from 'next/link';
import Icon from '@/components/landing/Icon';
import styles from './AdminLayout.module.scss';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const menuItems = [
  { label: 'Dashboard', page: 'dashboard', icon: 'chart' },
  { label: 'Vendors', page: 'vendors', icon: 'truck' },
  { label: 'Freight rates', page: 'rates', icon: 'rupee' },
  { label: 'Routes', page: 'routes', icon: 'pin' },
  { label: 'Leads', page: 'leads', icon: 'users' },
  { label: 'Campaigns', page: 'campaigns', icon: 'bell' },
  { label: 'Customers', page: 'customers', icon: 'headset' },
  { label: 'Analytics', page: 'analytics', icon: 'compare' },
  { label: 'Settings', page: 'settings', icon: 'shield' },
];

const SUBTITLES: Record<string, string> = {
  dashboard: 'Snapshot of freight comparisons, leads and campaign performance.',
};

export default function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const current = menuItems.find((m) => m.page === currentPage);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logo}>
          <span className={styles.brand}>JD<em>A</em>C</span>
          <span className={styles.tag}>THE LOGISTICS AGGREGATOR</span>
        </Link>

        <nav className={styles.menu}>
          {menuItems.map((item) => (
            <Link
              key={item.page}
              href={`/admin/${item.page}`}
              className={`${styles.menuItem} ${currentPage === item.page ? styles.active : ''}`}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.promo}>
          <strong>Moving Businesses Forward.</strong>
          <span>India&apos;s Trusted Logistics Aggregator</span>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.titleBox}>
            <span className={styles.titleIcon}><Icon name={current?.icon ?? 'chart'} size={24} /></span>
            <div>
              <h1>{current?.label ?? 'Admin'}</h1>
              <p>{SUBTITLES[currentPage] ?? 'Manage your JDAC platform.'}</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <label className={styles.search}>
              <Icon name="search" size={16} />
              <input type="text" placeholder="Search anything..." />
            </label>
            <button className={styles.bell} aria-label="Notifications">
              <Icon name="bell" size={22} /><span>3</span>
            </button>
            <div className={styles.user}>
              <span className={styles.avatar}>DS</span>
              <div><strong>Darshan Soni</strong><small>Managing Director</small></div>
              <Icon name="chevron" size={16} />
            </div>
          </div>
        </header>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
