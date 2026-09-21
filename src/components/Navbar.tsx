import Link from 'next/link';
import styles from './Navbar.module.scss';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className="container flex-between">
        <Link href="/" className={styles.logo}>
          <span className={styles.brand}>JDAC</span>
          <span className={styles.tagline}>THE LOGISTICS AGGREGATOR</span>
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
