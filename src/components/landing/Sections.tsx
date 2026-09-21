import Icon from './Icon';
import s from './Landing.module.scss';
import { WHATSAPP } from './Header';
import ServiceArt from './ServiceArt';
import { getContent } from '@/lib/siteContent';

export async function Stats() {
  const { stats } = await getContent();
  return (
    <div className={`${s.wrap} ${s.statsWrap}`}>
      <div className={s.stats} style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)` }}>
        {stats.map((st) => (
          <div key={st.label} className={s.stat}>
            <span className={s.statIcon}><Icon name={st.icon} size={30} /></span>
            <div><strong>{st.value}</strong><small>{st.label}</small></div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SERVICES = [
  ['Parcel & Small Cargo', 'Cost-effective shipping for small parcels and documents.', 'parcel'],
  ['Surface Cargo (Part Load)', 'Share space, save cost. Ideal for growing businesses.', 'part'],
  ['Special Cargo', 'ODC, heavy equipment, project cargo and more.', 'special'],
] as const;

export function Services() {
  return (
    <section id="services" className={s.section}>
      <div className={s.wrap}>
        <div className={s.sectionHead}>
          <div>
            <span className={s.eyebrow}>OUR SERVICES</span>
            <h2>Parcel. Part load. Heavy cargo.<br />Unstoppable.</h2>
            <p>From small parcels to part loads, JDAC connects you with the right transporter at the best rate &mdash; all in one place.</p>
          </div>
          <a href="#services" className={`${s.btn} ${s.btnOutline} ${s.btnSm}`}>Explore All Services <Icon name="arrow" size={14} /></a>
        </div>
        <div className={s.cards4}>
          {SERVICES.map(([t, d, kind]) => (
            <article key={t} className={s.svcCard}>
              <div className={s.svcImg}>
                <ServiceArt kind={kind} />
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
  ['search', 'Enter your shipment', 'Add pickup, delivery, weight and goods type'],
  ['compare', 'We pick the best carrier', 'We compare 12 carriers in 3 seconds and show the best rate'],
  ['box', 'Book. Pickup the same day.', 'Confirm once and our pickup team is on the way'],
];

export function Steps() {
  return (
    <section id="how-it-works" className={`${s.section} ${s.tint}`}>
      <div className={s.wrap}>
        <div className={s.sectionHead}>
          <div>
            <span className={s.eyebrow}>HOW JDAC WORKS</span>
            <h2>Three taps. Pickup the same day.</h2>
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
  ['compare', '12 carriers, 3 seconds', 'We compare and pick the best for you'],
  ['rupee', 'Save 30–40% on freight', 'Transparent pricing, no hidden charges'],
  ['headset', 'Expert pickup team', 'Trained. Polite. On time.'],
  ['pin', 'Track 5 or 50 shipments', 'Every shipment on one screen'],
  ['box', 'Connect your online store', 'Shopify, WooCommerce and more in 3 minutes'],
  ['shield', 'JDAC in your pocket', 'Book and track from the app, anywhere in India'],
];

export function Why() {
  return (
    <section id="why" className={s.section}>
      <div className={s.wrap}>
        <div className={s.whyGrid}>
          <div>
            <span className={s.eyebrow}>WHY JDAC</span>
            <h2>Six reasons we&apos;re unbelievably good at this.</h2>
            <p>Built for India&apos;s heavy cargo reality — one booking, one screen, one team that shows up on time.</p>
            <a href="#why" className={`${s.btn} ${s.btnOutline} ${s.btnSm}`}>Talk to our team <Icon name="arrow" size={14} /></a>
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
          <h2>Calculate. Click. Ship. Today.</h2>
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
