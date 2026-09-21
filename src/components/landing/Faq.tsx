import Icon from './Icon';
import s from './Landing.module.scss';

const FAQS = [
  ['How does JDAC work?', 'Enter your shipment details, and JDAC compares rates from multiple verified transporters so you can pick the best price, transit time and rating, then book.'],
  ['Is it free to compare rates?', 'Yes. Comparing rates on JDAC is completely free with no obligation to book.'],
  ['Which cities do you cover?', 'We serve 28,000+ PIN codes across India through our network of 500+ transport partners.'],
  ['What types of goods can I ship?', 'General cargo, furniture, spare parts, garments, electronics, parcels, and special cargo such as ODC and heavy equipment.'],
  ['Do you provide tracking?', 'Yes. You get real-time updates on your shipment from pickup to delivery.'],
];

export default function Faq() {
  return (
    <section className={s.section}>
      <div className={`${s.wrap} ${s.faqGrid}`}>
        <div>
          <span className={s.eyebrow}>FAQ</span>
          <h2>Common questions.<br />Straight answers.</h2>
          <p>Still have questions? We&apos;re here to help.</p>
        </div>
        <div className={s.faqList}>
          {FAQS.map(([q, a]) => (
            <details key={q}>
              <summary>{q}<Icon name="chevron" size={16} /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
