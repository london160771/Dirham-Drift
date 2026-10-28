import Phaser from 'phaser';
import { CAMERA } from '../../config/camera.js';
import { RACE } from '../../config/race.js';
import { CAR_COLORS, DEPTH, PALETTE } from '../../config/style.js';
import { TRACKS } from '../../config/tracks/index.js';
import { buildTrack } from '../track/buildTrack.js';
import { createRace, playerTelemetry, raceResults, stepRace } from '../sim/raceSim.js';
import { topSpeedOf } from '../sim/carPhysics.js';
import { CAR_TEXTURE_SCALE, createCarTexture } from '../render/carTexture.js';
import { createAmbientTraffic } from './ambientTraffic.js';
import { createRaceCamera } from './raceCamera.js';
import { bakeScaleFor, buildTrackVisuals } from './trackVisuals.js';

export const RACE_SCENE_KEY = 'race';

export class RaceScene extends Phaser.Scene {
  constructor() {
    super(RACE_SCENE_KEY);
  }

  init(data) {
    this.bridge = data.bridge;
    this.setup = data.setup;
    this.accumulator = 0;
    this.telemetryTimer = 0;
    this.reported = false;
    this.playerInput = { steer: 0, gas: 0, brake: 0, nitro: false };
  }

  create() {
    const track = buildTrack(TRACKS[this.setup.trackId]);
    this.cameras.main.setBackgroundColor(PALETTE.night);
    const zoom = this.cameras.main.height / CAMERA.worldViewHeight;
    buildTrackVisuals(this, track, bakeScaleFor(zoom));
    this.race = createRace({ track, ...this.setup.race });
    this.sprites = this.race.entries.map((entry, i) => {
      const colors = entry.car.isPlayer ? CAR_COLORS.player : CAR_COLORS.rivals[(i - 1) % CAR_COLORS.rivals.length];
      const key = createCarTexture(this, entry.car.isPlayer ? 'player' : `rival-${i}`, colors);
      return this.add.image(entry.car.x, entry.car.y, key).setScale(CAR_TEXTURE_SCALE).setDepth(DEPTH.cars + (entry.car.isPlayer ? 1 : 0));
    });
    this.traffic = createAmbientTraffic(this, track);
    this.raceCamera = createRaceCamera(this.cameras.main, this.race.entries[0].car);
    this.bridge.onReady?.();
  }

  stepSimulation(dt) {
    this.accumulator += dt;
    this.bridge.input.read(this.playerInput);
    while (this.accumulator >= RACE.fixedStep) {
      stepRace(this.race, this.playerInput, RACE.fixedStep);
      this.accumulator -= RACE.fixedStep;
    }
  }

  syncSprites() {
    this.race.entries.forEach((entry, i) => {
      this.sprites[i].setPosition(entry.car.x, entry.car.y).setRotation(entry.car.heading);
    });
  }

  publish(dt) {
    this.telemetryTimer -= dt;
    if (this.telemetryTimer > 0) return;
    this.telemetryTimer = 1 / RACE.telemetryHz;
    this.bridge.onTelemetry({ ...playerTelemetry(this.race), fps: Math.round(this.game.loop.actualFps) });
  }

  update(_time, delta) {
    const dt = Math.min(delta / 1000, RACE.maxFrameDelta);
    const paused = this.bridge.isPaused();
    if (!paused) {
      this.stepSimulation(dt);
      this.traffic.update(dt);
    }
    this.syncSprites();
    const car = this.race.entries[0].car;
    this.raceCamera.update(car, Math.min(1, Math.abs(car.speed) / topSpeedOf(car)), paused ? 0 : dt);
    this.publish(dt);
    if (this.race.phase === 'done' && !this.reported) {
      this.reported = true;
      this.bridge.onFinish(raceResults(this.race));
    }
  }
}
