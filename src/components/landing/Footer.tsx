import Icon from './Icon';
import s from './Landing.module.scss';
import { Logo, WHATSAPP } from './Header';

const QUICK = ['Home', 'Services', 'How It Works', 'Why JDAC', 'Coverage', 'Contact'];
const SERVICES = ['Parcel Cargo', 'Surface Cargo', 'Special Cargo', 'Rate Calculator', 'Transporter Network'];

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`${s.wrap} ${s.footGrid}`}>
        <div>
          <Logo light />
          <p>Connecting Businesses. Moving India Forward.</p>
          <div className={s.social}>
            {['in', 'ig', 'yt', 'f'].map((n) => <a key={n} href="#" aria-label={n}>{n}</a>)}
          </div>
        </div>
        <div><h6>Quick Links</h6><ul>{QUICK.map((l) => <li key={l}><a href={`#${l.toLowerCase().replace(/ /g, '-')}`}>{l}</a></li>)}</ul></div>
        <div><h6>Our Services</h6><ul>{SERVICES.map((l) => <li key={l}><a href="#services">{l}</a></li>)}</ul></div>
        <div>
          <h6>Contact Us</h6>
          <ul className={s.contact}>
            <li><Icon name="phone" size={15} /> +91 94296 94436</li>
            <li><Icon name="mail" size={15} /> info@jdac.in</li>
            <li><Icon name="pin" size={15} /> Pune, Maharashtra, India</li>
          </ul>
          <a href={WHATSAPP} className={`${s.btn} ${s.btnOrange} ${s.btnSm}`}><Icon name="whatsapp" size={16} /> Chat on WhatsApp</a>
        </div>
      </div>
      <div className={`${s.wrap} ${s.legal}`}>
        <span>&copy; 2025 JDAC &ndash; The Logistics Aggregator. All rights reserved.</span>
        <span><a href="#">Privacy Policy</a> &nbsp;|&nbsp; <a href="#">Terms of Service</a></span>
      </div>
    </footer>
  );
}
