import Icon from './Icon';
import s from './Landing.module.scss';
import { WHATSAPP } from './Header';

const GREETING = 'Hi JDAC, I would like to get a freight quote.';

export default function WhatsAppFloat() {
  return (
    <a
      href={`${WHATSAPP}?text=${encodeURIComponent(GREETING)}`}
      target="_blank"
      rel="noreferrer"
      className={s.waFloat}
      aria-label="Chat with JDAC on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <Icon name="whatsapp" size={32} />
    </a>
  );
}
