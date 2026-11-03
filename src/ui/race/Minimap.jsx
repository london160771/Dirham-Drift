import { MINIMAP } from '../../game/config/minimap.js';
import { CAR_COLORS } from '../../game/config/style.js';
import { mapPoint, mapViewBox } from '../../game/race/track/mapOutline.js';
import { t } from '../../i18n/strings.js';

function rivalColor(index) {
  return CAR_COLORS.rivals[(index - 1) % CAR_COLORS.rivals.length].body;
}

export function Minimap({ outline, cars, ghost }) {
  if (!outline || !cars) return null;
  const box = mapViewBox(outline.bounds);
  const dot = box.span * MINIMAP.dotRatio;
  const finish = box.span * MINIMAP.finishRatio;
  const path = outline.points.map(([x, y]) => `${x},${y}`).join(' ');
  const Line = outline.closed ? 'polygon' : 'polyline';
  const [player, ...rivals] = cars.map(([x, y]) => mapPoint(outline, x, y));
  const ghostAt = ghost && mapPoint(outline, ghost[0], ghost[1]);
  return (
    <svg
      className="minimap"
      data-testid="minimap"
      viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
      style={{ aspectRatio: `${box.width} / ${box.height}` }}
      role="img"
      aria-label={t('hud.map')}
    >
      <Line points={path} className="minimap-edge" strokeWidth={MINIMAP.edgeStrokePx} vectorEffect="non-scaling-stroke" />
      <Line points={path} className="minimap-road" strokeWidth={MINIMAP.roadStrokePx} vectorEffect="non-scaling-stroke" />
      <rect className="minimap-finish" x={outline.finish[0] - finish / 2} y={outline.finish[1] - finish / 2} width={finish} height={finish} />
      {ghostAt && <circle className="minimap-ghost" data-testid="minimap-ghost" cx={ghostAt[0]} cy={ghostAt[1]} r={dot} fill={CAR_COLORS.ghost.body} />}
      {rivals.map(([x, y], i) => (
        <circle key={i} className="minimap-rival" cx={x} cy={y} r={dot} fill={rivalColor(i + 1)} />
      ))}
      <circle
        className="minimap-player"
        data-testid="minimap-player"
        cx={player[0]}
        cy={player[1]}
        r={dot * MINIMAP.playerDotScale}
        fill={CAR_COLORS.player.body}
      />
    </svg>
  );
}
