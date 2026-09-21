import Link from 'next/link';
import styles from './Navbar.module.scss';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className="container flex-between">
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/jdac-logo.png" alt="JDAC - The Logistics Aggregator" height={44} />
        </Link>

        <div className={styles.navLinks}>
          <a href="#how-it-works">How It Works</a>
          <a href="#benefits">Benefits</a>
          <Link href="/admin" className={styles.adminLink}>Admin Panel</Link>
          <button className="btn btn-primary">Calculate Freight</button>
        </div>
      </div>
    </nav>
  );
}
