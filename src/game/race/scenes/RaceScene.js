import Phaser from 'phaser';
import { CAMERA } from '../../config/camera.js';
import { ASSISTS } from '../../config/settings.js';
import { RACE } from '../../config/race.js';
import { CAR_COLORS, CAR_SPRITES, DEPTH, PALETTE } from '../../config/style.js';
import { TRACKS } from '../../config/tracks/index.js';
import { buildTrack, pointAt } from '../track/buildTrack.js';
import { createRace, playerTelemetry, raceResults, stepRace } from '../sim/raceSim.js';
import { CAR_TEXTURE_SCALE, createCarTexture } from '../render/carTexture.js';
import { collectRaceArt, preloadRaceArt } from '../render/raceArt.js';
import { createAmbientTraffic } from './ambientTraffic.js';
import { createGhostRun } from './ghostRun.js';
import { createRaceEffects } from './raceEffects.js';
import { cameraSpeedRatio, createRaceCamera } from './raceCamera.js';
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
    this.assists = this.setup.assists || { steering: 0, autoGas: false };
    this.aim = {};
  }

  preload() {
    preloadRaceArt(this.load);
  }

  create() {
    const art = collectRaceArt(this.textures);
    const track = buildTrack(TRACKS[this.setup.trackId]);
    this.track = track;
    this.cameras.main.setBackgroundColor(PALETTE.night);
    const zoom = this.cameras.main.height / CAMERA.worldViewHeight;
    buildTrackVisuals(this, track, bakeScaleFor(zoom), art);
    this.race = createRace({ track, ...this.setup.race });
    this.sprites = this.race.entries.map((entry, i) => {
      const rival = (i - 1) % CAR_COLORS.rivals.length;
      const colors = entry.car.isPlayer ? CAR_COLORS.player : CAR_COLORS.rivals[rival];
      const sprite = art[entry.car.isPlayer ? CAR_SPRITES.player : CAR_SPRITES.rivals[rival]];
      const levels = entry.car.isPlayer ? this.setup.looks : undefined;
      const key = createCarTexture(this, entry.car.isPlayer ? 'player' : `rival-${i}`, colors, levels, sprite);
      return this.add.image(entry.car.x, entry.car.y, key).setScale(CAR_TEXTURE_SCALE).setDepth(DEPTH.cars + (entry.car.isPlayer ? 1 : 0));
    });
    this.ghostRun = createGhostRun(this, this.setup);
    this.traffic = createAmbientTraffic(this, track, art);
    this.effects = createRaceEffects(this, this.race.entries, { reduceMotion: Boolean(this.setup.reduceMotion) });
    this.raceCamera = createRaceCamera(this.cameras.main, this.race.entries[0].car);
    this.scale.on('resize', this.fitCamera, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.fitCamera, this));
    this.bridge.onReady?.();
  }

  fitCamera(gameSize) {
    this.cameras.main.setSize(gameSize.width, gameSize.height);
  }

  applyAssists() {
    const input = this.playerInput;
    if (this.assists.autoGas && !input.brake) input.gas = 1;
    if (!this.assists.steering) return;
    const { car, loc } = this.race.entries[0];
    pointAt(this.track, loc.s + ASSISTS.steeringLookAhead, 0, this.aim);
    input.assist = this.assists.steering;
    input.assistHeading = Math.atan2(this.aim.y - car.y, this.aim.x - car.x);
  }

  stepSimulation(dt) {
    this.accumulator += dt;
    this.bridge.input.read(this.playerInput);
    this.applyAssists();
    while (this.accumulator >= RACE.fixedStep) {
      stepRace(this.race, this.playerInput, RACE.fixedStep);
      this.ghostRun.record(this.race);
      this.accumulator -= RACE.fixedStep;
    }
  }

  syncSprites() {
    this.race.entries.forEach((entry, i) => {
      this.sprites[i].setPosition(entry.car.x, entry.car.y).setRotation(entry.car.heading);
    });
    this.ghostRun.sync(this.race);
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
      this.effects.update(dt);
    }
    this.syncSprites();
    const car = this.race.entries[0].car;
    this.raceCamera.update(car, cameraSpeedRatio(car), paused ? 0 : dt);
    this.publish(dt);
    if (this.race.phase === 'done' && !this.reported) {
      this.reported = true;
      this.bridge.onFinish(this.ghostRun.attach(raceResults(this.race)));
    }
  }
}
