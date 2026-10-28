import { CAR_COLORS, DECOR, DEPTH, PALETTE } from '../../config/style.js';
import { createRng } from '../../engine/rng.js';
import { pointAt } from '../track/buildTrack.js';
import { sheikhZayedLayout } from '../render/sheikhZayedScene.js';
import { CAR_TEXTURE_SCALE, createCarTexture } from '../render/carTexture.js';

const TRAFFIC_SEED = 515;
const ONCOMING_LANE_SPREAD = 50;

function createTrainTexture(scene) {
  const key = 'metro-car';
  if (scene.textures.exists(key)) return key;
  const canvas = document.createElement('canvas');
  canvas.width = DECOR.trainCarLength;
  canvas.height = DECOR.trainWidth;
  const c = canvas.getContext('2d');
  c.fillStyle = PALETTE.metroTrain;
  c.beginPath();
  c.roundRect(0, 0, canvas.width, canvas.height, 8);
  c.fill();
  c.fillStyle = PALETTE.metroWindow;
  for (let x = 10; x < canvas.width - 14; x += 18) c.fillRect(x, 6, 10, canvas.height - 12);
  scene.textures.addCanvas(key, canvas);
  return key;
}

export function createAmbientTraffic(scene, track) {
  if (track.closed) return { update: () => {} };
  const rng = createRng(TRAFFIC_SEED);
  const layout = sheikhZayedLayout(track);
  const point = {};
  const cars = [];
  for (let i = 0; i < DECOR.trafficCount; i += 1) {
    const colors = CAR_COLORS.rivals[i % CAR_COLORS.rivals.length];
    const key = createCarTexture(scene, `traffic-${i % CAR_COLORS.rivals.length}`, colors);
    const lane = layout.oncomingCenter + (i % 2 === 0 ? -1 : 1) * (ONCOMING_LANE_SPREAD / 2);
    const sprite = scene.add.image(0, 0, key).setScale(CAR_TEXTURE_SCALE).setDepth(DEPTH.cars - 1);
    cars.push({ sprite, lane, s: rng.range(0, track.length), speed: DECOR.trafficSpeed * rng.range(0.8, 1.2) });
  }
  const trainKey = createTrainTexture(scene);
  const train = [];
  for (let k = 0; k < DECOR.trainCars; k += 1) train.push(scene.add.image(0, 0, trainKey).setDepth(DEPTH.cars + 1));
  let trainS = 0;
  return {
    update(dt) {
      for (const car of cars) {
        car.s -= car.speed * dt;
        if (car.s < 0) car.s += track.length;
        pointAt(track, car.s, car.lane, point);
        car.sprite.setPosition(point.x, point.y).setRotation(point.heading + Math.PI);
      }
      trainS = (trainS + DECOR.trainSpeed * dt) % track.length;
      train.forEach((sprite, k) => {
        pointAt(track, trainS - k * (DECOR.trainCarLength + 6), layout.metroCenter, point);
        sprite.setPosition(point.x, point.y).setRotation(point.heading);
      });
    },
  };
}
