// Game rules for the terminal arcade (TerminalArcade.jsx): a ship shooting down falling asteroids.
// Plain JS: no DOM, no React.
// The game object is mutated in place every frame; stepGame returns the events the UI cares about.

export const LIVES = 3;

const SHIP_BOTTOM = 36; // ship centre, px above the bottom edge
const SHIP_EASE = 10; // how fast the ship catches up with its target (per second)
const FIRE_INTERVAL = 0.16; // s between shots
const BULLET_SPEED = 560; // px/s
const IDLE_TIMEOUT = 6; // s without input before the autopilot takes over again
const GAME_OVER_PAUSE = 2.5; // s the game-over screen stays up
const RAMP_UP = 60; // s of play to reach full difficulty
const POINTS = 10;

const random = (min, max) => min + Math.random() * (max - min);
const lerp = (a, b, t) => a + (b - a) * t;

export const shipY = (game) => game.height - SHIP_BOTTOM;

export const createGame = () => ({
  width: 0,
  height: 0,
  phase: 'demo', // 'demo' (autopilot) | 'playing' | 'over'
  shipX: 0,
  targetX: null, // where the player is pointing; null until they touch the game
  bullets: [],
  asteroids: [],
  particles: [],
  score: 0,
  lives: LIVES,
  time: 0,
  phaseTime: 0,
  idleTime: 0,
  fireTimer: 0,
  spawnTimer: 0,
});

export const resizeGame = (game, width, height) => {
  game.shipX = game.width ? (game.shipX / game.width) * width : width / 2;
  game.width = width;
  game.height = height;
};

// Pointer position from the UI; in demo mode the first one starts a round
export const steerGame = (game, x) => {
  game.targetX = x;
  game.idleTime = 0;
};

const setPhase = (game, phase, events) => {
  game.phase = phase;
  game.phaseTime = 0;
  events.push({ type: phase });
};

const enterDemo = (game, events) => {
  game.targetX = null;
  setPhase(game, 'demo', events);
};

const updatePhase = (game, dt, events) => {
  game.phaseTime += dt;
  game.idleTime += dt;
  if (game.phase === 'demo' && game.targetX !== null) {
    Object.assign(game, { score: 0, lives: LIVES, time: 0 });
    setPhase(game, 'playing', events);
  } else if (game.phase === 'playing' && game.idleTime > IDLE_TIMEOUT) {
    enterDemo(game, events);
  } else if (game.phase === 'over' && game.phaseTime > GAME_OVER_PAUSE) {
    enterDemo(game, events);
  }
};

// Autopilot: chase the asteroid closest to the bottom, or drift around when the screen is clear
const autopilotX = (game) => {
  const lowest = game.asteroids.reduce((best, asteroid) => (!best || asteroid.y > best.y ? asteroid : best), null);
  return lowest ? lowest.x : game.width / 2 + Math.sin(game.time) * game.width * 0.25;
};

const moveShip = (game, dt) => {
  const target = game.phase === 'playing' ? game.targetX : autopilotX(game);
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

const burst = (game, x, y, count) => {
  for (let i = 0; i < count; i++) {
    const angle = random(0, Math.PI * 2);
    const speed = random(40, 160);
    game.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1 });
  }
};

const moveBodies = (game, dt) => {
  game.bullets.forEach((bullet) => { bullet.y -= BULLET_SPEED * dt; });
  game.asteroids.forEach((asteroid) => { asteroid.y += asteroid.vy * dt; });
  game.particles.forEach((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt * 2;
  });
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
      setPhase(game, 'over', events);
    }
  });
};

const removeDead = (game) => {
  game.bullets = game.bullets.filter((b) => !b.spent && b.y > -10);
  game.asteroids = game.asteroids.filter((a) => a.hp > 0);
  game.particles = game.particles.filter((p) => p.life > 0);
};

export const stepGame = (game, dt) => {
  const events = [];
  game.time += dt;
  updatePhase(game, dt, events);
  if (game.phase !== 'over') {
    moveShip(game, dt);
    fire(game, dt);
    spawnAsteroids(game, dt);
  }
  moveBodies(game, dt);
  resolveHits(game, events);
  resolveEscapes(game, events);
  removeDead(game);
  return events;
};
