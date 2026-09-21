import Icon from './Icon';
import s from './Landing.module.scss';
import { WHATSAPP } from './Header';

const STATS = [
  ['users', '10,000+', 'Shipments Managed'], ['pin', '28,000+', 'PIN Codes Covered'],
  ['truck', '500+', 'Transport Partners'], ['star', '99%', 'Customer Satisfaction'],
];

export function Stats() {
  return (
    <div className={`${s.wrap} ${s.statsWrap}`}>
      <div className={s.stats}>
        {STATS.map(([i, n, l]) => (
          <div key={l} className={s.stat}>
            <span className={s.statIcon}><Icon name={i} size={30} /></span>
            <div><strong>{n}</strong><small>{l}</small></div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SERVICES = [
  ['Parcel & Small Cargo', 'Cost-effective shipping for small parcels and documents.', '#c9a26b'],
  ['Part Load (LTL)', 'Share space, save cost. Ideal for growing businesses.', '#b98c55'],
  ['Full Truck Load (FTL)', 'Dedicated trucks for large shipments.', '#5f7fa8'],
  ['Special Cargo', 'ODC, heavy equipment, project cargo and more.', '#e0b526'],
];

export function Services() {
  return (
    <section id="services" className={s.section}>
      <div className={s.wrap}>
        <div className={s.sectionHead}>
          <div>
            <span className={s.eyebrow}>OUR SERVICES</span>
            <h2>Complete Surface<br />Logistics Solutions</h2>
            <p>From small parcels to full truck loads, JDAC connects you with the right transporter at the best rate &mdash; all in one place.</p>
          </div>
          <a href="#services" className={`${s.btn} ${s.btnOutline} ${s.btnSm}`}>Explore All Services <Icon name="arrow" size={14} /></a>
        </div>
        <div className={s.cards4}>
          {SERVICES.map(([t, d, c]) => (
            <article key={t} className={s.svcCard}>
              <div className={s.svcImg} style={{ background: `linear-gradient(135deg, ${c}, #2b2b2b)` }}>
                <Icon name="box" size={56} />
              </div>
              <div className={s.svcBody}>
                <h4>{t}</h4>
                <p>{d}</p>
                <a href="#quote">Know More <Icon name="arrow" size={13} /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  ['search', 'Enter Shipment Details', 'Add pickup, delivery, weight and goods type'],
  ['compare', 'Compare Rates', 'Get rates from multiple verified transporters'],
  ['check', 'Choose the Best Option', 'Select based on price, transit time and ratings'],
  ['box', 'Book & Ship', 'Confirm and ship with confidence'],
];

export function Steps() {
  return (
    <section id="how-it-works" className={`${s.section} ${s.tint}`}>
      <div className={s.wrap}>
        <div className={s.sectionHead}>
          <div>
            <span className={s.eyebrow}>HOW JDAC WORKS</span>
            <h2>Ship in 4 Simple Steps</h2>
          </div>
          <p className={s.aside}>Fast. Transparent. Hassle-free.</p>
        </div>
        <ol className={s.steps}>
          {STEPS.map(([i, t, d], n) => (
            <li key={t} className={s.step}>
              <span className={s.num}>{n + 1}</span>
              <span className={s.stepIcon}><Icon name={i} size={22} /></span>
              <h5>{t}</h5>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const WHY = [
  ['users', 'Wide Transporter Network', 'Multiple verified vendors'],
  ['rupee', 'Transparent Pricing', 'No hidden charges'],
  ['pin', 'Pan India Coverage', 'Service to 28,000+ PIN codes'],
  ['bell', 'Real-time Updates', 'Track your shipment'],
  ['headset', 'Dedicated Support', 'Assistance at every step'],
  ['shield', 'Safe & Reliable', 'Your cargo, our priority'],
];

const CLIENTS = [
  ['amazon', '#111'], ['blinkit', '#111'], ['zepto', '#c2185b'], ['Flipkart', '#2874f0'],
  ['meesho', '#c2185b'], ['Reliance', '#d32f2f'], ['DMart', '#1b5e20'],
];

export function Why() {
  return (
    <section id="why" className={s.section}>
      <div className={s.wrap}>
        <div className={s.whyGrid}>
          <div>
            <span className={s.eyebrow}>WHY JDAC</span>
            <h2>More Than a Transporter.<br />Your Logistics Partner.</h2>
            <p>We simplify logistics with technology, transparency and a strong network of trusted partners across India.</p>
            <a href="#why" className={`${s.btn} ${s.btnOutline} ${s.btnSm}`}>Know Why Businesses Trust Us <Icon name="arrow" size={14} /></a>
          </div>
          <ul id="coverage" className={s.whyList}>
            {WHY.map(([i, t, d]) => (
              <li key={t}>
                <span className={s.ring}><Icon name={i} size={22} /></span>
                <div><h6>{t}</h6><small>{d}</small></div>
              </li>
            ))}
          </ul>
        </div>

        <div className={s.clients}>
          <span className={s.eyebrow}>TRUSTED BY BUSINESSES ACROSS INDIA</span>
          <h2>Our Clients</h2>
          <p>From manufacturers to e-commerce brands, thousands trust JDAC for their logistics needs.</p>
          <div className={s.logos}>
            {CLIENTS.map(([n, c]) => <span key={n} style={{ color: c }}>{n}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <div className={s.wrap}>
      <section className={s.cta}>
        <div>
          <span className={s.ctaEyebrow}>READY TO SHIP!</span>
          <h2>Get the Best Freight Rates Today!</h2>
          <p>Join thousands of businesses shipping smarter with JDAC.</p>
          <div className={s.heroCtas}>
            <a href="#quote" className={`${s.btn} ${s.btnOrange}`}>Get a Quote Now <Icon name="arrow" size={16} /></a>
            <a href={WHATSAPP} className={`${s.btn} ${s.btnGhost}`}><Icon name="whatsapp" size={16} /> Chat on WhatsApp</a>
          </div>
        </div>
        <ul className={s.ctaPoints}>
          {[['truck', 'Fast'], ['shield', 'Reliable'], ['rupee', 'Cost-Effective'], ['headset', 'Support']].map(([i, l]) => (
            <li key={l}><span className={s.ringLight}><Icon name={i} size={22} /></span>{l}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
