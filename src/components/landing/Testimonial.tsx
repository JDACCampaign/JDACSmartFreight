'use client';

import { useState } from 'react';
import Icon from './Icon';
import s from './Landing.module.scss';

const QUOTES = [
  ['JDAC has made our shipping process so much easier. We get the best rates, reliable partners and great support — all in one platform.', 'Amit Sharma', 'Operations Manager', 'E-commerce Brand'],
  ['Comparing transporters used to take hours. Now it takes minutes, and our freight costs are noticeably lower.', 'Neha Verma', 'Logistics Head', 'Manufacturing Company'],
];

export default function Testimonial() {
  const [i, setI] = useState(0);
  const [q, name, role, co] = QUOTES[i];
  const go = (d: number) => setI((i + d + QUOTES.length) % QUOTES.length);
  return (
    <div className={s.wrap}>
      <div className={s.testi}>
        <span className={s.quoteMark}>&ldquo;</span>
        <p>{q}</p>
        <div className={s.who}><strong>{name}</strong><small>{role}<br />{co}</small></div>
        <div className={s.arrows}>
          <button aria-label="Previous testimonial" onClick={() => go(-1)}><Icon name="chevron" size={14} /></button>
          <button aria-label="Next testimonial" onClick={() => go(1)}><Icon name="chevron" size={14} /></button>
        </div>
      </div>
    </div>
  );
}
