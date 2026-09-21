'use client';

import { useState } from 'react';
import Icon from './Icon';
import s from './Landing.module.scss';

const MODES = ['Surface Cargo', 'Part Load (LTL)', 'Full Truck (FTL)'];
const GOODS = ['General Cargo', 'Furniture', 'Spare Parts', 'Garments', 'Electronics', 'Other'];

function Truck() {
  return (
    <svg viewBox="0 0 520 240" className={s.truckSvg} role="img" aria-label="JDAC truck">
      <rect x="10" y="30" width="330" height="150" rx="6" fill="#eef1f6" />
      <rect x="10" y="30" width="330" height="14" fill="#d5dbe6" />
      <text x="175" y="118" textAnchor="middle" fontSize="64" fontWeight="800" fill="#24418D" fontFamily="Impact, sans-serif">JD<tspan fill="#F15A25">A</tspan>C</text>
      <text x="175" y="142" textAnchor="middle" fontSize="11" fontWeight="700" fill="#24418D" letterSpacing="2">THE LOGISTICS AGGREGATOR</text>
      <path d="M346 70h90l50 55v55H346z" fill="#dfe4ee" />
      <path d="M362 82h68l34 38H362z" fill="#2b3a55" />
      <rect x="346" y="172" width="150" height="16" rx="4" fill="#24418D" />
      <rect x="10" y="180" width="486" height="10" fill="#1d2b4a" />
      {[70, 130, 400, 460].map((x) => (
        <g key={x}><circle cx={x} cy="200" r="24" fill="#1a1a1a" /><circle cx={x} cy="200" r="10" fill="#9aa4b8" /></g>
      ))}
    </svg>
  );
}

export default function Hero() {
  const [mode, setMode] = useState(0);
  const [sent, setSent] = useState(false);

  return (
    <section id="home" className={s.hero}>
      <div className={`${s.wrap} ${s.heroGrid}`}>
        <div className={s.heroText}>
          <h1>ONE PLATFORM.<br /><span>EVERYWHERE IN INDIA.</span></h1>
          <p className={s.lead}>Compare surface cargo rates. Choose the best vendor. Ship with confidence.</p>
          <ul className={s.heroPoints}>
            <li><span className={s.ring}><Icon name="truck" size={26} /></span>Multiple<br />Transporters</li>
            <li><span className={s.ring}><Icon name="pin" size={26} /></span>Best Rates</li>
            <li><span className={s.ring}><Icon name="box" size={26} /></span>Pan India<br />Coverage</li>
          </ul>
          <div className={s.heroCtas}>
            <a href="#quote" className={`${s.btn} ${s.btnOrange}`}>Get a Quote Now <Icon name="arrow" size={16} /></a>
            <a href="#how-it-works" className={s.textLink}>How it works <span className={s.dot}><Icon name="arrow" size={12} /></span></a>
          </div>
        </div>

        <form id="quote" className={s.calc} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <div className={s.calcHead}>
            <span className={s.calcIcon}><Icon name="chart" size={22} /></span>
            <div>
              <h3>Freight Calculator</h3>
              <p>Get instant rate comparison from multiple transporters</p>
            </div>
          </div>
          <div className={s.tabs} role="tablist">
            {MODES.map((m, i) => (
              <button key={m} type="button" role="tab" aria-selected={mode === i}
                className={mode === i ? s.tabOn : ''} onClick={() => setMode(i)}>{m}</button>
            ))}
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

      <div className={s.scene}>
        <div className={s.skyline} />
        <div className={s.road} />
        <Truck />
        <div className={s.script}>Moving<br />A Stronger<br />India</div>
      </div>
    </section>
  );
}
