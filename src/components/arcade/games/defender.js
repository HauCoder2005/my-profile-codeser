// Space Defender: steer a ship that fires on its own and shoot down the falling asteroids.
// Every asteroid that gets past the ship costs a life.
import { burst, createBase, drawParticles, endRound, join, lerp, random, stepParticles, updatePhase } from '../core';

const LIVES = 3;
const SHIP_BOTTOM = 36; // ship centre, px above the bottom edge
const SHIP_EASE = 10; // how fast the ship catches up with its target (per second)
const FIRE_INTERVAL = 0.16; // s between shots
const BULLET_SPEED = 560; // px/s
const RAMP_UP = 60; // s of play to reach full difficulty
const POINTS = 10;
const ENGINES = [-6, 6]; // engine nozzles, relative to the ship centre

const shipY = (game) => game.height - SHIP_BOTTOM;

const create = () => ({
  ...createBase(LIVES),
  shipX: 0,
  targetX: null, // where the player is pointing
  fireTimer: 0,
  spawnTimer: 0,
  bullets: [],
  asteroids: [],
});

// Rounds keep whatever is already on screen, so the demo flows straight into play
const reset = () => {};

const resize = (game, width, height) => {
  game.shipX = game.width ? (game.shipX / game.width) * width : width / 2;
  game.width = width;
  game.height = height;
};

const input = (game, { x }) => {
  if (x === undefined) return; // keys can't steer
  game.targetX = x;
  join(game);
};

// Autopilot: chase the asteroid closest to the bottom, or drift around when the screen is clear
const autopilotX = (game) => {
  const lowest = game.asteroids.reduce((best, a) => (!best || a.y > best.y ? a : best), null);
  return lowest ? lowest.x : game.width / 2 + Math.sin(game.time) * game.width * 0.25;
};

const moveShip = (game, dt) => {
  const target = game.phase === 'playing' && game.targetX !== null ? game.targetX : autopilotX(game);
  game.shipX += (target - game.shipX) * Math.min(1, SHIP_EASE * dt);
};

const fire = (game, dt) => {
  game.fireTimer -= dt;
  if (game.fireTimer > 0) return;
  game.fireTimer = FIRE_INTERVAL;
  game.bullets.push({ x: game.shipX, y: shipY(game) - 24, spent: false });
};

const spawnAsteroids = (game, dt) => {
  game.spawnTimer -= dt;
  if (game.spawnTimer > 0) return;
  const level = Math.min(game.time / RAMP_UP, 1);
  game.spawnTimer = lerp(1.1, 0.4, level);
  const r = random(11, 18);
  const hp = r > 15 ? 2 : 1; // big asteroids take two hits
  game.asteroids.push({
    x: random(r, game.width - r),
    y: -r,
    r,
    vy: lerp(45, 110, level) * random(0.8, 1.2),
    hp,
    maxHp: hp,
  });
};

const moveBodies = (game, dt) => {
  game.bullets.forEach((bullet) => { bullet.y -= BULLET_SPEED * dt; });
  game.asteroids.forEach((asteroid) => { asteroid.y += asteroid.vy * dt; });
};

const resolveHits = (game, events) => {
  game.bullets.forEach((bullet) => {
    const asteroid = game.asteroids.find((a) => a.hp > 0 && Math.hypot(a.x - bullet.x, a.y - bullet.y) < a.r);
    if (!asteroid) return;
    bullet.spent = true;
    asteroid.hp -= 1;
    if (asteroid.hp > 0) return;
    burst(game, asteroid.x, asteroid.y, 12);
    if (game.phase === 'playing') {
      const points = POINTS * asteroid.maxHp;
      game.score += points;
      events.push({ type: 'hit', points });
    }
  });
};

// An asteroid that gets past the ship costs a life while playing
const resolveEscapes = (game, events) => {
  game.asteroids.forEach((asteroid) => {
    if (asteroid.hp <= 0 || asteroid.y - asteroid.r < game.height) return;
    asteroid.hp = 0;
    if (game.phase !== 'playing') return;
    game.lives -= 1;
    events.push({ type: 'escape' });
    if (game.lives === 0) {
      burst(game, game.shipX, shipY(game), 24);
      endRound(game, events);
    }
  });
};

const removeDead = (game) => {
  game.bullets = game.bullets.filter((b) => !b.spent && b.y > -10);
  game.asteroids = game.asteroids.filter((a) => a.hp > 0);
};

const step = (game, dt) => {
  const events = [];
  updatePhase(game, dt, events, reset);
  if (game.phase !== 'over') {
    moveShip(game, dt);
    fire(game, dt);
    spawnAsteroids(game, dt);
  }
  moveBodies(game, dt);
  stepParticles(game, dt);
  resolveHits(game, events);
  resolveEscapes(game, events);
  removeDead(game);
  return events;
};

// Fighter seen from above: pointed fuselage, swept wings, cockpit and twin engine flames.
// (x, y) is the ship centre; the nose points up.
const drawShip = (ctx, x, y, { fg, accent }) => {
  // Flames first, so the hull covers their top edge
  ctx.fillStyle = accent;
  ENGINES.forEach((dx) => {
    const length = 6 + Math.random() * 8;
    ctx.beginPath();
    ctx.moveTo(x + dx - 3, y + 10);
    ctx.lineTo(x + dx + 3, y + 10);
    ctx.lineTo(x + dx, y + 10 + length);
    ctx.closePath();
    ctx.fill();
  });

  ctx.fillStyle = fg;
  // Wings
  ctx.beginPath();
  ctx.moveTo(x - 4, y - 6);
  ctx.lineTo(x - 20, y + 8);
  ctx.lineTo(x - 20, y + 13);
  ctx.lineTo(x + 20, y + 13);
  ctx.lineTo(x + 20, y + 8);
  ctx.lineTo(x + 4, y - 6);
  ctx.closePath();
  ctx.fill();
  // Fuselage
  ctx.beginPath();
  ctx.moveTo(x, y - 22);
  ctx.quadraticCurveTo(x + 6, y - 10, x + 6, y + 12);
  ctx.lineTo(x - 6, y + 12);
  ctx.quadraticCurveTo(x - 6, y - 10, x, y - 22);
  ctx.fill();
  // Engine pods
  ENGINES.forEach((dx) => ctx.fillRect(x + dx - 3, y + 4, 6, 7));

  // Cockpit
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.ellipse(x, y - 8, 2.5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
};

// Round asteroid with a soft shine on its upper-left side; damaged ones switch to the accent colour
const drawAsteroid = (ctx, { x, y, r, hp, maxHp }, { fg, accent }) => {
  const color = hp < maxHp ? accent : fg;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.globalAlpha = 0.12;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, r * 0.65, Math.PI * 1.1, Math.PI * 1.45);
  ctx.globalAlpha = 0.6;
  ctx.stroke();
  ctx.globalAlpha = 1;
};

const draw = (ctx, game, palette) => {
  ctx.clearRect(0, 0, game.width, game.height);
  game.asteroids.forEach((asteroid) => drawAsteroid(ctx, asteroid, palette));
  ctx.fillStyle = palette.accent;
  game.bullets.forEach((b) => ctx.fillRect(b.x - 1, b.y - 5, 2, 10));
  drawParticles(ctx, game, palette.accent);
  if (game.phase !== 'over') drawShip(ctx, game.shipX, shipY(game), palette);
};

const defender = { id: 'defender', command: './space-defender', create, resize, input, step, draw };
export default defender;
