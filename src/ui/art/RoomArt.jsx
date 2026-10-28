import { ART_COLORS as C } from '../../game/config/art.js';

const W = 800;
const H = 450;

export function GarageArt() {
  return (
    <svg className="code-art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width={W} height={H} fill={C.wall} />
      <rect x="200" y="40" width="400" height="230" rx="6" fill={C.shutter} />
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x="200" y={50 + i * 20} width="400" height="3" fill={C.tower} />
      ))}
      <rect x="200" y="34" width="400" height="6" fill={C.neonTeal} />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={40 + (i % 2) * 60} y={70 + Math.floor(i / 2) * 60} width="40" height="10" rx="3" fill={C.towerEdge} />
      ))}
      <rect x="650" y="70" width="110" height="160" rx="4" fill={C.tower} stroke={C.towerEdge} />
      <rect y="300" width={W} height="150" fill={C.floor} />
      <rect x="230" y="330" width="340" height="10" fill={C.neonGold} opacity="0.8" />
      <rect x="250" y="340" width="12" height="80" fill={C.towerEdge} />
      <rect x="538" y="340" width="12" height="80" fill={C.towerEdge} />
      <ellipse cx="400" cy="300" rx="320" ry="16" fill={C.neonGold} opacity="0.08" />
    </svg>
  );
}

export function BankArt() {
  return (
    <svg className="code-art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width={W} height={H} fill={C.wall} />
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <rect x={60 + i * 160} y="60" width="34" height="300" fill={C.tower} stroke={C.towerEdge} />
          <rect x={52 + i * 160} y="52" width="50" height="10" fill={C.neonTeal} opacity="0.7" />
        </g>
      ))}
      <circle cx="400" cy="210" r="110" fill={C.vault} stroke={C.neonGold} strokeWidth="8" />
      <circle cx="400" cy="210" r="70" fill="none" stroke={C.neonGold} strokeWidth="3" opacity="0.6" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x="396" y="140" width="8" height="70" fill={C.neonGold} transform={`rotate(${i * 60} 400 210)`} />
      ))}
      <rect y="360" width={W} height="90" fill={C.floor} />
      <rect y="358" width={W} height="4" fill={C.neonTeal} opacity="0.6" />
    </svg>
  );
}

export function ScamAdArt() {
  return (
    <svg className="code-art" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="scamSun" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor={C.sun} />
          <stop offset="1" stopColor={C.vault} />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#scamSun)" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x="196" y="20" width="8" height="160" fill={C.sun} opacity="0.35" transform={`rotate(${i * 30} 200 180)`} />
      ))}
      <circle cx="200" cy="180" r="60" fill={C.sun} />
      <path d="M0 300 Q100 230 200 290 T400 270 V400 H0 Z" fill={C.dune} />
      <path d="M0 340 Q120 290 260 340 T400 330 V400 H0 Z" fill={C.duneDark} />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={150 + i * 25} cy={330 - (i % 2) * 14} rx="26" ry="9" fill={C.coin} stroke={C.duneDark} strokeWidth="3" />
      ))}
      <rect x="10" y="10" width="380" height="380" fill="none" stroke={C.danger} strokeWidth="6" strokeDasharray="18 10" />
    </svg>
  );
}
