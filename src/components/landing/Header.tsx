import Link from 'next/link';
import Icon from './Icon';
import s from './Landing.module.scss';

export const WHATSAPP = 'https://wa.me/919429494436';

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`${s.logo} ${light ? s.logoLight : ''}`}>
      <span className={s.logoMark}>JD<em>A</em>C</span>
      <span className={s.logoTag}>THE LOGISTICS AGGREGATOR</span>
    </Link>
  );
}

const LINKS = [
  ['Home', '#home'], ['Services', '#services'], ['How It Works', '#how-it-works'],
  ['Why JDAC', '#why'], ['Coverage', '#coverage'], ['Contact', '#contact'],
];

export default function Header() {
  return (
    <header className={s.header}>
      <div className={`${s.wrap} ${s.headerInner}`}>
        <Logo />
        <nav className={s.nav}>
          {LINKS.map(([l, h]) => <a key={l} href={h}>{l}</a>)}
        </nav>
        <a href={WHATSAPP} className={`${s.btn} ${s.btnOrange} ${s.btnSm}`}>
          <Icon name="whatsapp" size={16} /> Chat on WhatsApp
        </a>
      </div>
    </header>
  );
}
