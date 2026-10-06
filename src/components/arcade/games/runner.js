// Gap Runner: an endless side-scroller. The runner moves on its own; jump across gaps, up onto
// higher ledges and over spikes. The run keeps speeding up, and one mistake ends it.
import { burst, clamp, createBase, drawParticles, endRound, join, lerp, random, stepParticles, updatePhase } from '../core';

const GRAVITY = 2400; // px/s²
const JUMP_SPEED = 760; // px/s: peaks ~120 px high
const AIR_TIME = (2 * JUMP_SPEED) / GRAVITY; // ~0.63 s
const SPEED_START = 230; // px/s
const SPEED_MAX = 560;
const SPEED_RAMP = 90; // s of play to reach full speed
const LEVEL_EVERY = 15; // s between speed levels (only shown in the log)
const SIZE = 18; // runner square, px
const RUNNER_X = 0.22; // runner position, as a share of the width
const COYOTE_TIME = 0.08; // s after running off a ledge when a jump still counts
const JUMP_BUFFER = 0.12; // s a press is remembered while still in the air
const SPIKE_H = 16;
const PX_PER_METRE = 40;

const speedOf = (game) => lerp(SPEED_START, SPEED_MAX, Math.min(game.time / SPEED_RAMP, 1));
const runnerX = (game) => game.width * RUNNER_X;
const lowestTop = (game) => game.height - 28;
const highestTop = (game) => game.height * 0.42;

const create = () => ({
  ...createBase(1),
  platforms: [], // { x, w, top }
  spikes: [], // { x, w, top }
  runner: null,
  distance: 0,
  level: 1,
});

// Each platform is placed so a full jump can always make it: up-steps come with shorter gaps.
// Spikes sit far enough in that you land before them, not on them, and leave a full jump's
// worth of ledge after them, so clearing a spike never drops you into the next gap.
const addPlatform = (game) => {
  const last = game.platforms[game.platforms.length - 1];
  const reach = speedOf(game) * AIR_TIME; // horizontal length of a full jump
  const climb = Math.random() < 0.4;
  const top = clamp(last.top + (climb ? -random(25, 55) : random(-10, 60)), highestTop(game), lowestTop(game));
  const gap = random(0.22, climb ? 0.4 : 0.6) * reach;
  const platform = { x: last.x + last.w + gap, w: random(1.3, 3.4) * reach, top };
  game.platforms.push(platform);

  if (platform.w > 2.6 * reach && Math.random() < 0.7) {
    const w = Math.random() < 0.5 ? 14 : 28;
    game.spikes.push({ x: platform.x + random(1.25 * reach, platform.w - 1.2 * reach - w), w, top });
  }
};

const fillWorld = (game) => {
  const end = (p) => p.x + p.w;
  while (end(game.platforms[game.platforms.length - 1]) < game.width + 300) addPlatform(game);
};

const resetRun = (game) => {
  game.time = 0;
  game.distance = 0;
  game.level = 1;
  game.platforms = [{ x: -20, w: game.width * 0.9, top: lowestTop(game) }];
  game.spikes = [];
  fillWorld(game);
  game.runner = { y: lowestTop(game), vy: 0, angle: 0, grounded: true, coyote: 0, buffer: 0, alive: true };
};

const resize = (game, width, height) => {
  game.width = width;
  game.height = height;
  resetRun(game);
};

const input = (game, { type }) => {
  if (type !== 'press') return;
  if (game.phase === 'playing') game.runner.buffer = JUMP_BUFFER;
  join(game);
};

const scrollWorld = (game, dt) => {
  const shift = speedOf(game) * dt;
  game.distance += shift;
  game.platforms.forEach((p) => { p.x -= shift; });
  game.spikes.forEach((s) => { s.x -= shift; });
  game.platforms = game.platforms.filter((p) => p.x + p.w > -50);
  game.spikes = game.spikes.filter((s) => s.x + s.w > -50);
  fillWorld(game);
};

// Demo: jump at the end of each ledge and just before each spike
const autopilot = (game) => {
  const r = game.runner;
  if (!r.grounded) return;
  const front = runnerX(game) + SIZE / 2;
  const speed = speedOf(game);
  const ground = game.platforms.find((p) => p.x <= front && p.x + p.w >= front - SIZE);
  const atEdge = ground && ground.x + ground.w - front < speed * 0.07;
  const spikeAhead = game.spikes.some((s) => s.x > front && s.x - front < speed * 0.12);
  if (atEdge || spikeAhead) r.buffer = JUMP_BUFFER;
};

const die = (game, events) => {
  const r = game.runner;
  r.alive = false;
  burst(game, runnerX(game), r.y - SIZE / 2, 20);
  if (game.phase === 'playing') endRound(game, events);
  else resetRun(game); // the demo just starts over
};

const moveRunner = (game, dt, events) => {
  const r = game.runner;
  const left = runnerX(game) - SIZE / 2;
  const right = left + SIZE;

  r.coyote -= dt;
  r.buffer -= dt;
  if (r.buffer > 0 && r.coyote > 0) {
    r.vy = -JUMP_SPEED;
    r.buffer = 0;
    r.coyote = 0;
  }
  const prevY = r.y;
  r.vy += GRAVITY * dt;
  r.y += r.vy * dt;
  r.grounded = false;

  for (const p of game.platforms) {
    if (p.x > right || p.x + p.w < left) continue;
    if (r.vy >= 0 && prevY <= p.top + 1 && r.y >= p.top) {
      r.y = p.top;
      r.vy = 0;
      r.grounded = true;
      r.coyote = COYOTE_TIME;
    } else if (r.y > p.top + 1 && prevY > p.top + 1) {
      die(game, events); // ran into the side of a ledge
      return;
    }
  }
  const onSpike = game.spikes.some((s) => s.x < right - 3 && s.x + s.w > left + 3 && r.y > s.top - SPIKE_H + 3);
  if (onSpike || r.y - SIZE > game.height) {
    die(game, events);
    return;
  }
  // Tumble in the air, land flat
  r.angle = r.grounded ? Math.round(r.angle / (Math.PI / 2)) * (Math.PI / 2) : r.angle + dt * 8;
};

const trackProgress = (game, events) => {
  const metres = Math.floor(game.distance / PX_PER_METRE);
  if (metres !== game.score) {
    game.score = metres;
    events.push({ type: 'score', quiet: true });
  }
  const level = 1 + Math.floor(Math.min(game.time, SPEED_RAMP) / LEVEL_EVERY);
  if (level !== game.level) {
    game.level = level;
    events.push({ type: 'speed', level });
  }
};

const step = (game, dt) => {
  const events = [];
  updatePhase(game, dt, events, resetRun);
  if (game.phase !== 'over') {
    scrollWorld(game, dt);
    if (game.phase === 'demo') autopilot(game);
    moveRunner(game, dt, events);
    if (game.phase === 'playing') trackProgress(game, events);
  }
  stepParticles(game, dt);
  return events;
};

const drawSpikes = (ctx, { x, w, top }) => {
  const teeth = Math.max(1, Math.round(w / 14));
  const tooth = w / teeth;
  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    ctx.moveTo(x + i * tooth, top);
    ctx.lineTo(x + (i + 0.5) * tooth, top - SPIKE_H);
    ctx.lineTo(x + (i + 1) * tooth, top);
  }
  ctx.fill();
};

const draw = (ctx, game, { fg, accent }) => {
  ctx.clearRect(0, 0, game.width, game.height);

  ctx.fillStyle = fg;
  game.platforms.forEach((p) => {
    ctx.globalAlpha = 0.08;
    ctx.fillRect(p.x, p.top, p.w, game.height - p.top);
    ctx.globalAlpha = 1;
    ctx.fillRect(p.x, p.top, p.w, 2);
  });

  ctx.fillStyle = accent;
  game.spikes.forEach((s) => drawSpikes(ctx, s));

  const r = game.runner;
  if (r.alive) {
    ctx.save();
    ctx.translate(runnerX(game), r.y - SIZE / 2);
    ctx.rotate(r.angle);
    ctx.fillStyle = fg;
    ctx.fillRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE);
    ctx.fillStyle = accent;
    ctx.fillRect(2, -5, 5, 4); // visor
    ctx.restore();
  }

  drawParticles(ctx, game, accent);
};

const runner = { id: 'runner', command: './gap-runner', create, resize, input, step, draw };
export default runner;
