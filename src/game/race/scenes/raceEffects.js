import { CAR_PHYSICS } from '../../config/car.js';
import { FLAME, FX_SEED, SKID, SPARKS } from '../../config/effects.js';
import { DEPTH } from '../../config/style.js';
import { createRng } from '../../engine/rng.js';

function canvasTexture(scene, key, width, height, draw) {
  if (scene.textures.exists(key)) return key;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  scene.textures.addCanvas(key, canvas);
  return key;
}

function makeTextures(scene) {
  canvasTexture(scene, 'fx-skid', SKID.length, SKID.width, (c, w, h) => {
    c.fillStyle = SKID.color;
    c.fillRect(0, 0, w, h);
  });
  SPARKS.colors.forEach((color, i) =>
    canvasTexture(scene, `fx-spark-${i}`, SPARKS.size, SPARKS.size, (c, w) => {
      c.fillStyle = color;
      c.beginPath();
      c.arc(w / 2, w / 2, w / 2, 0, Math.PI * 2);
      c.fill();
    }),
  );
  canvasTexture(scene, 'fx-flame', FLAME.length, FLAME.width, (c, w, h) => {
    const g = c.createLinearGradient(w, 0, 0, 0);
    g.addColorStop(0, FLAME.inner);
    g.addColorStop(0.35, FLAME.mid);
    g.addColorStop(1, FLAME.outer);
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(w, h * 0.2);
    c.quadraticCurveTo(0, h / 2, w, h * 0.8);
    c.closePath();
    c.fill();
  });
}

function rearWheels(car) {
  const back = -CAR_PHYSICS.length * 0.32;
  const side = CAR_PHYSICS.width * 0.42;
  const cos = Math.cos(car.heading);
  const sin = Math.sin(car.heading);
  return [-side, side].map((s) => ({ x: car.x + cos * back - sin * s, y: car.y + sin * back + cos * s }));
}

export function createRaceEffects(scene, entries, { reduceMotion }) {
  makeTextures(scene);
  const rng = createRng(FX_SEED);
  const skids = Array.from({ length: SKID.maxMarks }, () => scene.add.image(0, 0, 'fx-skid').setDepth(DEPTH.track + 1).setVisible(false));
  const sparks = Array.from({ length: SPARKS.pool }, (_, i) => ({
    image: scene.add.image(0, 0, `fx-spark-${i % SPARKS.colors.length}`).setDepth(DEPTH.overlay).setVisible(false),
    vx: 0,
    vy: 0,
    age: SPARKS.life,
  }));
  const flames = entries.map(() => scene.add.image(0, 0, 'fx-flame').setDepth(DEPTH.cars - 1).setVisible(false));
  const trail = entries.map((e) => ({ x: e.car.x, y: e.car.y, hits: e.car.hits }));
  let skidIndex = 0;

  const addSkid = (point, heading) => {
    const mark = skids[skidIndex];
    skidIndex = (skidIndex + 1) % skids.length;
    mark.setPosition(point.x, point.y).setRotation(heading).setAlpha(SKID.startAlpha).setVisible(true);
    mark.age = 0;
  };

  const burst = (car) => {
    const count = reduceMotion ? SPARKS.perHitReduced : SPARKS.perHit;
    let made = 0;
    for (const spark of sparks) {
      if (made >= count) break;
      if (spark.age < SPARKS.life) continue;
      const angle = rng.range(0, Math.PI * 2);
      const speed = rng.range(SPARKS.speedMin, SPARKS.speedMax);
      spark.vx = Math.cos(angle) * speed + car.vx * 0.3;
      spark.vy = Math.sin(angle) * speed + car.vy * 0.3;
      spark.age = 0;
      spark.image.setPosition(car.x, car.y).setAlpha(1).setVisible(true);
      made += 1;
    }
  };

  const updateCar = (entry, i) => {
    const { car } = entry;
    const last = trail[i];
    if (car.hits > last.hits) burst(car);
    last.hits = car.hits;
    const moved = Math.hypot(car.x - last.x, car.y - last.y);
    if (car.drifting && Math.abs(car.speed) > SKID.minSpeed && moved >= SKID.spacing) {
      rearWheels(car).forEach((p) => addSkid(p, car.heading));
      last.x = car.x;
      last.y = car.y;
    } else if (!car.drifting) {
      last.x = car.x;
      last.y = car.y;
    }
    const flame = flames[i];
    flame.setVisible(car.nitroActive);
    if (!car.nitroActive) return;
    const back = CAR_PHYSICS.length / 2 + FLAME.length / 2 - FLAME.offset;
    const stretch = reduceMotion ? 1 : 1 + rng.range(-FLAME.flicker, FLAME.flicker);
    flame
      .setPosition(car.x - Math.cos(car.heading) * back, car.y - Math.sin(car.heading) * back)
      .setRotation(car.heading)
      .setScale(stretch, 1);
  };

  return {
    update(dt) {
      entries.forEach(updateCar);
      for (const mark of skids) {
        if (!mark.visible) continue;
        mark.age += dt;
        if (mark.age >= SKID.life) mark.setVisible(false);
        else mark.setAlpha(SKID.startAlpha * (1 - mark.age / SKID.life));
      }
      for (const spark of sparks) {
        if (spark.age >= SPARKS.life) continue;
        spark.age += dt;
        const { image } = spark;
        image.setPosition(image.x + spark.vx * dt, image.y + spark.vy * dt).setAlpha(Math.max(0, 1 - spark.age / SPARKS.life));
        if (spark.age >= SPARKS.life) image.setVisible(false);
      }
    },
  };
}
