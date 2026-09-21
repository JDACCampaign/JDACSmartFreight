import Icon from './Icon';
import s from './Landing.module.scss';

export default function Hero() {
  return (
    <section id="home" className={s.hero}>
      <div className={s.heroScene} aria-hidden="true" />
      <div className={`${s.wrap} ${s.heroInner}`}>
        <div className={s.heroText}>
          <h1>BHARAT KA HEAVY CARGO,<br /><span>AB APP PE.</span></h1>
          <p className={s.lead}>Compare surface cargo rates. Choose the best vendor. Ship with confidence.</p>

          <ul className={s.heroPoints}>
            <li><span className={s.ring}><Icon name="truck" size={26} /></span>Multiple<br />Transporters</li>
            <li><span className={s.ring}><Icon name="pin" size={26} /></span>Best Rates</li>
            <li><span className={s.ring}><Icon name="box" size={26} /></span>Pan India<br />Coverage</li>
          </ul>

          <div className={s.heroCtas}>
            <a href="#quote" className={`${s.btn} ${s.btnOrange} ${s.btnLg}`}>Get a Quote Now <Icon name="arrow" size={18} /></a>
            <a href="#how-it-works" className={s.textLink}>How it works <span className={s.dot}><Icon name="arrow" size={12} /></span></a>
          </div>

          <ul className={s.trust}>
            {['100% Secure', 'No Spam', 'Instant Results'].map((t) => (
              <li key={t}><span className={s.tick}><Icon name="check" size={16} /></span>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
