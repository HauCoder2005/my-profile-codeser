// Stack Deploy: a block slides back and forth above the tower; drop it onto the block below.
// Whatever overhangs is sliced off, so the tower keeps narrowing. Miss completely and it's over.
import { burst, createBase, drawParticles, endRound, join, random, stepParticles, updatePhase } from '../core';

const BLOCK_H = 18;
const BASE_BOTTOM = 16; // px between the tower base and the bottom edge
const START_WIDTH = 0.42; // share of the screen width
const MAX_START_WIDTH = 240; // px
const SPEED_START = 150; // px/s
const SPEED_STEP = 9; // extra px/s per block
const SPEED_MAX = 460;
const PERFECT = 4; // px of slack that still counts as a perfect drop
const CAMERA_EASE = 6;
const FALL_GRAVITY = 1400;

const create = () => ({
  ...createBase(1),
  tower: [], // { x, w }, from the base up
  mover: null, // { x, w, dir }: the sliding block
  fallers: [], // sliced-off pieces: { x, y, w, vy }
  camera: 0, // px the view has scrolled up as the tower grows
  dropQueued: false,
  aimX: 0, // demo only: where the autopilot drops the current block
});

const blockY = (game, level) => game.height - BASE_BOTTOM - (level + 1) * BLOCK_H + game.camera;
const speedOf = (game) => Math.min(SPEED_START + game.tower.length * SPEED_STEP, SPEED_MAX);
const topBlock = (game) => game.tower[game.tower.length - 1];

const nextMover = (game) => {
  const top = topBlock(game);
  const fromLeft = game.tower.length % 2 === 0;
  game.mover = { x: fromLeft ? 0 : game.width - top.w, w: top.w, dir: fromLeft ? 1 : -1 };
  // The autopilot is usually close, sometimes way off, so the demo tower eventually falls
  const error = Math.random() < 0.9 ? random(0, 5) : random(10, 40);
  game.aimX = top.x + (Math.random() < 0.5 ? -error : error);
};

const resetTower = (game) => {
  const w = Math.min(game.width * START_WIDTH, MAX_START_WIDTH);
  game.tower = [{ x: (game.width - w) / 2, w }];
  game.camera = 0;
  game.dropQueued = false;
  nextMover(game);
};

const resize = (game, width, height) => {
  game.width = width;
  game.height = height;
  resetTower(game);
};

const input = (game, { type }) => {
  if (type !== 'press') return;
  if (game.phase === 'playing') game.dropQueued = true;
  join(game);
};

const drop = (game, events) => {
  const m = game.mover;
  const top = topBlock(game);
  const y = blockY(game, game.tower.length);
  const playing = game.phase === 'playing';

  if (Math.abs(m.x - top.x) <= PERFECT) {
    game.tower.push({ x: top.x, w: top.w });
    burst(game, top.x, y + BLOCK_H / 2, 6, 90);
    burst(game, top.x + top.w, y + BLOCK_H / 2, 6, 90);
    if (playing) events.push({ type: 'perfect' });
  } else {
    const left = Math.max(m.x, top.x);
    const right = Math.min(m.x + m.w, top.x + top.w);
    if (right <= left) {
      // Missed the tower completely
      game.fallers.push({ x: m.x, y, w: m.w, vy: 0 });
      game.mover = null;
      if (playing) endRound(game, events);
      else resetTower(game);
      return;
    }
    game.tower.push({ x: left, w: right - left });
    game.fallers.push({ x: m.x < top.x ? m.x : right, y, w: m.w - (right - left), vy: 0 });
  }

  if (playing) {
    game.score = game.tower.length - 1;
    events.push({ type: 'score', quiet: true });
  }
  nextMover(game);
};

const moveMover = (game, dt, events) => {
  const m = game.mover;
  const before = m.x;
  m.x += m.dir * speedOf(game) * dt;
  if (m.x < 0) {
    m.x = 0;
    m.dir = 1;
  } else if (m.x + m.w > game.width) {
    m.x = game.width - m.w;
    m.dir = -1;
  }
  const passedAim = (before - game.aimX) * (m.x - game.aimX) <= 0;
  if (game.dropQueued || (game.phase === 'demo' && passedAim)) drop(game, events);
};

const step = (game, dt) => {
  const events = [];
  updatePhase(game, dt, events, resetTower);
  if (game.mover && game.phase !== 'over') moveMover(game, dt, events);
  game.dropQueued = false;

  // Keep the top of the tower around the middle of the screen
  const target = Math.max(0, game.tower.length * BLOCK_H - game.height * 0.5);
  game.camera += (target - game.camera) * Math.min(1, CAMERA_EASE * dt);

  game.fallers.forEach((f) => {
    f.vy += FALL_GRAVITY * dt;
    f.y += f.vy * dt;
  });
  game.fallers = game.fallers.filter((f) => f.y < game.height + BLOCK_H);
  stepParticles(game, dt);
  return events;
};

const drawBlock = (ctx, x, y, w, color, fill) => {
  ctx.fillStyle = color;
  ctx.globalAlpha = fill;
  ctx.fillRect(x, y, w, BLOCK_H - 2);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 0.75, y + 0.75, w - 1.5, BLOCK_H - 3.5);
};

const draw = (ctx, game, { fg, accent }) => {
  ctx.clearRect(0, 0, game.width, game.height);
  game.tower.forEach((block, level) => {
    const y = blockY(game, level);
    if (y > game.height || y < -BLOCK_H) return;
    drawBlock(ctx, block.x, y, block.w, fg, level === game.tower.length - 1 ? 0.22 : 0.08);
  });
  game.fallers.forEach((f) => drawBlock(ctx, f.x, f.y, f.w, fg, 0.08));
  if (game.mover) drawBlock(ctx, game.mover.x, blockY(game, game.tower.length), game.mover.w, accent, 0.3);
  drawParticles(ctx, game, accent);
};

const stack = { id: 'stack', command: './stack-deploy', create, resize, input, step, draw };
export default stack;
