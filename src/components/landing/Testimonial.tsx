'use client';

import { useState } from 'react';
import Icon from './Icon';
import s from './Landing.module.scss';

const QUOTES = [
  ['JDAC has made our shipping process so much easier. We get the best rates, reliable partners and great support — all in one platform.', 'Amit Sharma', 'Operations Manager', 'E-commerce Brand'],
  ['Comparing transporters used to take hours. Now it takes minutes, and our freight costs are noticeably lower.', 'Neha Verma', 'Logistics Head', 'Manufacturing Company'],
];

const initials = (n: string) => n.split(' ').map((p) => p[0]).join('').slice(0, 2);

export default function Testimonial() {
  const [i, setI] = useState(0);
  const [q, name, role, co] = QUOTES[i];
  const go = (d: number) => setI((i + d + QUOTES.length) % QUOTES.length);

  return (
    <section className={`${s.section} ${s.tint}`} aria-label="Customer testimonials">
      <div className={s.wrap}>
        <div className={s.testiHead}>
          <span className={s.eyebrow}>WHAT CUSTOMERS SAY</span>
          <h2>Trusted by growing businesses</h2>
        </div>

        <figure className={s.testiCard}>
          <span className={s.quoteMark} aria-hidden="true">&ldquo;</span>
          <div className={s.stars} aria-label="5 out of 5 stars">
            {[0, 1, 2, 3, 4].map((n) => <Icon key={n} name="star" size={18} />)}
          </div>
          <blockquote>{q}</blockquote>
          <figcaption>
            <span className={s.testiAvatar}>{initials(name)}</span>
            <div><strong>{name}</strong><small>{role}, {co}</small></div>
          </figcaption>

          <div className={s.testiNav}>
            <button aria-label="Previous testimonial" onClick={() => go(-1)}><Icon name="chevron" size={16} /></button>
            <div className={s.dots}>
              {QUOTES.map((_, n) => (
                <button key={n} aria-label={`Show testimonial ${n + 1}`} aria-current={n === i}
                  className={n === i ? s.dotOn : ''} onClick={() => setI(n)} />
              ))}
            </div>
            <button aria-label="Next testimonial" onClick={() => go(1)}><Icon name="chevron" size={16} /></button>
          </div>
        </figure>
      </div>
    </section>
  );
}
