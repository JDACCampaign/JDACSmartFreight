// Illustrated scenes for the service cards (400 x 170 viewBox)

const CARD = '#c99a5b';
const CARD_DARK = '#a87b42';
const CARD_LIGHT = '#e0b985';
const TAPE = '#f1e3c4';

function Box({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={CARD} />
      <rect x={x} y={y} width={w} height={h * 0.22} rx="3" fill={CARD_LIGHT} />
      <rect x={x + w / 2 - 7} y={y} width="14" height={h} fill={TAPE} opacity="0.9" />
      <rect x={x} y={y + h - 5} width={w} height="5" fill={CARD_DARK} opacity="0.5" />
    </g>
  );
}

function Parcel() {
  return (
    <>
      <defs>
        <linearGradient id="skyP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dbe8fb" /><stop offset="1" stopColor="#f5f9ff" />
        </linearGradient>
      </defs>
      <rect width="400" height="170" fill="url(#skyP)" />
      <rect y="138" width="400" height="32" fill="#c8d4ea" />
      <ellipse cx="200" cy="140" rx="130" ry="7" fill="#0b1f4d" opacity="0.12" />
      <Box x={110} y={92} w={84} h={48} />
      <Box x={200} y={100} w={70} h={40} />
      <Box x={128} y={54} w={64} h={38} />
      <Box x={222} y={68} w={44} h={32} />
      <rect x="292" y="112" width="56" height="28" rx="2" fill="#fff" stroke="#9db4dc" strokeWidth="2" />
      <path d="M292 114l28 15 28-15" fill="none" stroke="#9db4dc" strokeWidth="2" />
      <rect x="52" y="112" width="40" height="28" rx="3" fill="#f15a25" />
      <rect x="60" y="120" width="24" height="4" fill="#fff" opacity="0.85" />
    </>
  );
}

function PartLoad() {
  return (
    <>
      <defs>
        <linearGradient id="skyL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e5edf9" /><stop offset="1" stopColor="#f7f9fd" />
        </linearGradient>
      </defs>
      <rect width="400" height="170" fill="url(#skyL)" />
      {/* warehouse shelving */}
      {[40, 130, 220, 310].map((x) => <rect key={x} x={x} y="20" width="4" height="120" fill="#9db4dc" />)}
      <rect x="40" y="62" width="274" height="4" fill="#9db4dc" />
      <rect x="40" y="102" width="274" height="4" fill="#9db4dc" />
      <rect y="138" width="400" height="32" fill="#c8d4ea" />
      {/* pallets with stacked cartons */}
      {[70, 190, 290].map((x, i) => (
        <g key={x}>
          <rect x={x - 6} y="130" width="98" height="8" fill="#8a6a3f" />
          <rect x={x} y="138" width="12" height="6" fill="#6f542f" />
          <rect x={x + 74} y="138" width="12" height="6" fill="#6f542f" />
          <Box x={x} y={98} w={44} h={32} />
          <Box x={x + 46} y={98} w={44} h={32} />
          <Box x={x + 6} y={64 - i * 6} w={78} h={34 + i * 6} />
          <rect x={x - 2} y={64 - i * 6} width="94" height="66" fill="#fff" opacity="0.18" />
        </g>
      ))}
      <rect x="0" y="0" width="400" height="10" fill="#1f3d99" opacity="0.9" />
    </>
  );
}

function Special() {
  return (
    <>
      <defs>
        <linearGradient id="skyS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe0f8" /><stop offset="1" stopColor="#f4f8ff" />
        </linearGradient>
      </defs>
      <rect width="400" height="170" fill="url(#skyS)" />
      <circle cx="330" cy="40" r="20" fill="#fff" opacity="0.8" />
      <rect y="140" width="400" height="30" fill="#b7c4de" />
      <ellipse cx="190" cy="142" rx="120" ry="6" fill="#0b1f4d" opacity="0.15" />
      {/* crawler tracks */}
      <rect x="90" y="118" width="170" height="26" rx="13" fill="#2b2f3a" />
      {[112, 145, 178, 211, 240].map((x) => <circle key={x} cx={x} cy="131" r="6" fill="#5b6270" />)}
      {/* body */}
      <rect x="110" y="86" width="130" height="34" rx="4" fill="#f5b800" />
      <rect x="110" y="110" width="130" height="10" fill="#c98f00" />
      <rect x="112" y="60" width="52" height="30" rx="3" fill="#f5b800" />
      <rect x="120" y="66" width="34" height="18" rx="2" fill="#bcd6f5" />
      {/* boom, stick and bucket */}
      <path d="M232 92L300 40L326 52" fill="none" stroke="#f5b800" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M326 52L344 108" fill="none" stroke="#c98f00" strokeWidth="9" strokeLinecap="round" />
      <path d="M334 100h26l-6 20h-22z" fill="#2b2f3a" />
      <circle cx="300" cy="40" r="5" fill="#2b2f3a" />
      <rect x="112" y="118" width="128" height="3" fill="#f15a25" />
    </>
  );
}

const ART = { parcel: Parcel, part: PartLoad, special: Special };

export default function ServiceArt({ kind }: { kind: keyof typeof ART }) {
  const Scene = ART[kind];
  return (
    <svg viewBox="0 0 400 170" preserveAspectRatio="xMidYMid slice" role="img"
      aria-label={`${kind} cargo illustration`} width="100%" height="100%">
      <Scene />
    </svg>
  );
}
