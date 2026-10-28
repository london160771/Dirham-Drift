import { ART_COLORS as C, ART_SEED, SKYLINE as S } from '../../game/config/art.js';
import { createRng } from '../../game/engine/rng.js';

function buildTowers() {
  const rng = createRng(ART_SEED);
  const towers = [];
  let x = -20;
  while (x < S.width && towers.length < S.towers * 2) {
    const width = rng.int(S.towerMinWidth, S.towerMaxWidth);
    const height = rng.int(S.towerMinHeight, S.towerMaxHeight);
    const windows = [];
    for (let wy = S.horizon - height + S.windowGap; wy < S.horizon - S.windowGap; wy += S.windowGap) {
      for (let wx = x + 8; wx < x + width - 8; wx += S.windowGap) {
        if (rng.next() < S.windowLitChance) windows.push({ x: wx, y: wy, teal: rng.next() < 0.25 });
      }
    }
    towers.push({ x, width, height, windows });
    x += width + rng.int(2, 18);
  }
  const stars = Array.from({ length: S.stars }, () => ({ x: rng.int(0, S.width), y: rng.int(0, S.horizon - S.towerMaxHeight), r: rng.range(0.6, 1.8) }));
  const streaks = Array.from({ length: S.streaks }, (_, i) => ({ x: rng.int(0, S.width), y: S.horizon + 150 + (i % 3) * 22, length: rng.int(80, 220) }));
  return { towers, stars, streaks };
}

const SCENE = buildTowers();

export function Skyline() {
  const { spire, moon } = S;
  return (
    <svg className="code-art" viewBox={`0 0 ${S.width} ${S.height}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.skyTop} />
          <stop offset="1" stopColor={C.skyBottom} />
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.sea} />
          <stop offset="1" stopColor={C.skyTop} />
        </linearGradient>
      </defs>
      <rect width={S.width} height={S.horizon} fill="url(#sky)" />
      {SCENE.stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={C.star} opacity="0.7" />
      ))}
      <circle cx={moon.x} cy={moon.y} r={moon.r} fill={C.moon} />
      <circle cx={moon.x + moon.r * 0.45} cy={moon.y - moon.r * 0.2} r={moon.r * 0.92} fill={C.skyTop} />
      <path d={`M${spire.x} ${S.horizon} L${spire.x + spire.width / 2} ${S.horizon - spire.height} L${spire.x + spire.width} ${S.horizon} Z`} fill={C.tower} stroke={C.towerEdge} />
      {SCENE.towers.map((tw, i) => (
        <g key={i}>
          <rect x={tw.x} y={S.horizon - tw.height} width={tw.width} height={tw.height} fill={C.tower} stroke={C.towerEdge} />
          {tw.windows.map((w, k) => (
            <rect key={k} x={w.x} y={w.y} width={S.windowSize} height={S.windowSize} fill={w.teal ? C.windowTeal : C.windowGold} opacity="0.75" />
          ))}
        </g>
      ))}
      <rect y={S.horizon} width={S.width} height={S.height - S.horizon} fill="url(#sea)" />
      {SCENE.towers.map((tw, i) => (
        <rect key={i} x={tw.x + tw.width * 0.3} y={S.horizon + 10 + (i % 5) * 9} width={tw.width * 0.4} height="3" fill={C.shimmer} opacity="0.25" />
      ))}
      <rect y={S.horizon + 130} width={S.width} height="90" fill={C.road} />
      {SCENE.streaks.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width={s.length} height="4" fill={C.streakTail} opacity="0.7" />
          <rect x={s.x + s.length} y={s.y - 1} width="10" height="6" fill={C.streakHead} />
        </g>
      ))}
    </svg>
  );
}
