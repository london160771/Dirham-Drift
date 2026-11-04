import { cleanup, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CAR_COLORS } from '../../src/game/config/style.js';
import { TRACKS } from '../../src/game/config/tracks/index.js';
import { buildTrack } from '../../src/game/race/track/buildTrack.js';
import { mapPoint, trackOutline } from '../../src/game/race/track/mapOutline.js';
import { Hud } from '../../src/ui/race/Hud.jsx';
import { Minimap } from '../../src/ui/race/Minimap.jsx';

const outline = trackOutline(buildTrack(TRACKS.marina));
const cars = [
  [10, 20],
  [30, 40],
  [50, 60],
];
const telemetry = { phase: 'racing', position: 1, carCount: 3, lap: 1, laps: 3, progress: 0, speed: 0, nitro: 1, nitroActive: false, damage: 0, timeMs: 0 };

beforeEach(cleanup);

describe('race minimap', () => {
  it('draws the track and one dot per car, rivals over the bigger player dot', () => {
    const { container } = render(<Minimap outline={outline} cars={cars} />);
    expect(container.querySelector('polygon')).toBeTruthy();
    expect(container.querySelectorAll('.minimap-rival')).toHaveLength(2);
    const player = screen.getByTestId('minimap-player');
    expect([Number(player.getAttribute('cx')), Number(player.getAttribute('cy'))]).toEqual(mapPoint(outline, 10, 20));
    expect(player.getAttribute('fill')).toBe(CAR_COLORS.player.body);
    expect(container.querySelector('svg').lastElementChild.getAttribute('class')).toBe('minimap-rival');
    expect(Number(player.getAttribute('r'))).toBeGreaterThan(Number(container.querySelector('.minimap-rival').getAttribute('r')));
    expect(screen.queryByTestId('minimap-ghost')).toBeNull();
  });

  it('shows the ghost when there is one and an open line for a sprint', () => {
    const sprint = trackOutline(buildTrack(TRACKS.sheikhZayed));
    const { container } = render(<Minimap outline={sprint} cars={[cars[0]]} ghost={[5, 5]} />);
    expect(container.querySelector('polyline')).toBeTruthy();
    expect(screen.getByTestId('minimap-ghost')).toBeTruthy();
  });

  it('waits for the track and the first car positions', () => {
    render(<Minimap outline={null} cars={cars} />);
    render(<Minimap outline={outline} cars={undefined} />);
    expect(screen.queryByTestId('minimap')).toBeNull();
  });

  it('sits under the HUD on the side picked', () => {
    const map = <Minimap outline={outline} cars={cars} />;
    const { rerender } = render(<Hud telemetry={telemetry} onPause={() => {}} map={map} />);
    expect(screen.getByTestId('minimap').parentElement.className).toBe('hud-col');
    rerender(<Hud telemetry={telemetry} onPause={() => {}} map={map} mapSide="right" />);
    expect(screen.getByTestId('minimap').parentElement.className).toBe('hud-col right');
  });
});
