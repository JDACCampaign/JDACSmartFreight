'use client';

import { useState } from 'react';
import Icon from './Icon';
import s from './Landing.module.scss';

const GOODS = ['General Cargo', 'Furniture', 'Spare Parts', 'Garments', 'Electronics', 'Other'];

export default function Quote() {
  const [sent, setSent] = useState(false);

  return (
    <section id="quote" className={s.section}>
      <div className={`${s.wrap} ${s.quoteGrid}`}>
        <div>
          <span className={s.eyebrow}>FREIGHT CALCULATOR</span>
          <h2>We compare 12 carriers in 3 seconds. We pick the best for you.</h2>
          <p>Enter your shipment details once and see rates from every carrier side by side, so you never overpay for heavy cargo again.</p>
          <ul className={s.quoteBullets}>
            {['Compare 12 carriers in 3 seconds', 'Save 30–40% on freight', 'Pan India coverage to 28,000+ PIN codes'].map((t) => (
              <li key={t}><span className={s.tick}><Icon name="check" size={16} /></span>{t}</li>
            ))}
          </ul>
        </div>

        <form className={s.calc} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <div className={s.calcHead}>
            <span className={s.calcIcon}><Icon name="chart" size={22} /></span>
            <div>
              <h3>Freight Calculator</h3>
              <p>Get instant rate comparison from multiple transporters</p>
            </div>
          </div>
          <div className={s.row2}>
            <label>From<input required placeholder="Enter pickup city" /></label>
            <label>To<input required placeholder="Enter delivery city" /></label>
          </div>
          <div className={s.row2}>
            <label>Weight (kg)<input required type="number" min="1" placeholder="Enter weight" /></label>
            <div>
              <span className={s.lbl}>Dimensions (Optional)</span>
              <div className={s.row3}>
                <input aria-label="Length" placeholder="L (cm)" />
                <input aria-label="Width" placeholder="W (cm)" />
                <input aria-label="Height" placeholder="H (cm)" />
              </div>
            </div>
          </div>
          <label>Goods Type
            <select defaultValue="">
              <option value="" disabled>Select goods type</option>
              {GOODS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </label>
          <button type="submit" className={`${s.btn} ${s.btnOrange} ${s.block}`}>
            Compare Rates <Icon name="arrow" size={16} />
          </button>
          {sent && <p className={s.ok} role="status">Thanks! We&apos;ll share rate options shortly.</p>}
          <p className={s.secure}><Icon name="lock" size={12} /> 100% Secure &bull; No Spam &bull; Instant Results</p>
        </form>
      </div>
    </section>
  );
}
