'use client';

import { useState } from 'react';
import Icon from './Icon';
import s from './Landing.module.scss';
import { WHATSAPP } from './Header';

type Status = 'idle' | 'sending' | 'done' | 'error';

const INFO = [
  ['phone', 'Call us', '+91 94296 94436', 'tel:+919429494436'],
  ['mail', 'Email', 'info@jdac.in', 'mailto:info@jdac.in'],
  ['pin', 'Office', 'Pune, Maharashtra, India', ''],
] as const;

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSummary(`Hi JDAC, I'm ${payload.name}. ${payload.route ? `Route: ${payload.route}. ` : ''}${payload.message}`);
      setStatus('done');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  return (
    <section id="contact" className={`${s.section} ${s.tint}`}>
      <div className={`${s.wrap} ${s.contactGrid}`}>
        <div>
          <span className={s.eyebrow}>CONTACT US</span>
          <h2>Let&apos;s move your cargo</h2>
          <p>Tell us what you need to ship and our team will get back to you with the best rates.</p>
          <ul className={s.contactInfo}>
            {INFO.map(([icon, label, value, href]) => (
              <li key={label}>
                <span className={s.ring}><Icon name={icon} size={22} /></span>
                <div>
                  <small>{label}</small>
                  {href ? <a href={href}>{value}</a> : <strong>{value}</strong>}
                </div>
              </li>
            ))}
          </ul>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className={`${s.btn} ${s.btnOrange}`}>
            <Icon name="whatsapp" size={18} /> Chat on WhatsApp
          </a>
        </div>

        <form className={s.contactForm} onSubmit={submit} noValidate={false}>
          {status === 'done' ? (
            <div className={s.formDone} role="status">
              <span className={s.doneIcon}><Icon name="check" size={32} /></span>
              <h3>Thank you!</h3>
              <p>We&apos;ve received your enquiry and will contact you shortly.</p>
              <a href={`${WHATSAPP}?text=${encodeURIComponent(summary)}`} target="_blank" rel="noreferrer" className={`${s.btn} ${s.btnOrange}`}>
                <Icon name="whatsapp" size={16} /> Continue on WhatsApp
              </a>
              <button type="button" className={s.linkBtn} onClick={() => setStatus('idle')}>Send another enquiry</button>
            </div>
          ) : (
            <>
              <h3>Send us an enquiry</h3>
              <div className={s.row2}>
                <label>Name *<input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Your name" /></label>
                <label>Phone *<input name="phone" type="tel" required pattern="\+?[0-9\s\-]{10,15}" title="10–15 digits" autoComplete="tel" placeholder="+91 98765 43210" /></label>
              </div>
              <div className={s.row2}>
                <label>Email<input name="email" type="email" maxLength={120} autoComplete="email" placeholder="you@company.com" /></label>
                <label>Route<input name="route" maxLength={120} placeholder="e.g. Pune → Delhi" /></label>
              </div>
              <label>Message *<textarea name="message" required minLength={5} maxLength={1000} rows={4} placeholder="What are you shipping? Approx. weight, pickup and delivery city…" /></label>
              {/* honeypot — hidden from people, bots tend to fill it */}
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className={s.hp} />
              {status === 'error' && <p className={s.formError} role="alert">{error}</p>}
              <button type="submit" className={`${s.btn} ${s.btnOrange} ${s.block}`} disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : <>Send enquiry <Icon name="arrow" size={16} /></>}
              </button>
              <p className={s.secure}><Icon name="lock" size={12} /> Your details are only used to respond to your enquiry.</p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
