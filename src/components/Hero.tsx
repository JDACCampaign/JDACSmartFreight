import { useState } from 'react';
import styles from './Hero.module.scss';

export default function Hero({ onCalculateClick }: { onCalculateClick: () => void }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [weight, setWeight] = useState('');

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.content}>
          <h1>COMPARE SURFACE CARGO RATES. <span>CHOOSE THE RIGHT VENDOR.</span></h1>
          <p>Compare freight rates from multiple surface cargo vendors and find the right combination of price, delivery time and serviceability.</p>

          <div className={styles.quickCalculator}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="FROM"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.arrow}>↓</div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="TO"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.arrow}>↓</div>

            <div className={styles.inputGroup}>
              <input
                type="number"
                placeholder="WEIGHT (KG)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={styles.input}
              />
            </div>

            <button className="btn btn-primary" onClick={onCalculateClick}>
              CALCULATE FREIGHT
            </button>
          </div>

          <div className={styles.cta}>
            <button className="btn btn-secondary" onClick={onCalculateClick}>
              Explore How It Works
            </button>
          </div>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>Available Vendors</div>
            <div className={styles.vendorPreview}>
              <div className={styles.vendorItem}>
                <div className={styles.vendorName}>Vendor A</div>
                <div className={styles.vendorPrice}>₹420</div>
                <div className={styles.vendorTime}>1-2 Days</div>
              </div>
              <div className={styles.vendorItem}>
                <div className={styles.vendorName}>Vendor B</div>
                <div className={styles.vendorPrice}>₹390</div>
                <div className={styles.vendorTime}>2 Days</div>
              </div>
              <div className={styles.vendorItem}>
                <div className={styles.vendorName}>Vendor C</div>
                <div className={styles.vendorPrice}>₹550</div>
                <div className={styles.vendorTime}>1 Day</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
