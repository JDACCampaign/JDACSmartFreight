import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.brandName}>JDAC</span>
              <span className={styles.tagline}>THE LOGISTICS AGGREGATOR</span>
            </div>
            <p>Compare freight rates from multiple surface cargo vendors and find the right combination of price, delivery time and serviceability.</p>
          </div>

          <div className={styles.links}>
            <div>
              <h4>Product</h4>
              <a href="#how-it-works">How It Works</a>
              <a href="#benefits">Benefits</a>
              <a href="#calculator">Freight Calculator</a>
            </div>

            <div>
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#blog">Blog</a>
            </div>

            <div>
              <h4>Legal</h4>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms & Conditions</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; 2025 JDAC. All rights reserved.</p>
          <div className={styles.cta}>
            <button className="btn btn-secondary">Calculate Freight</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
