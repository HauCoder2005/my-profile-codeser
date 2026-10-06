// Brick Breaker: steer the paddle to keep the ball in play and clear the wall of bricks.
// Each cleared wall comes back with a faster ball; dropping the ball costs a life.
import { burst, clamp, createBase, drawParticles, endRound, join, random, stepParticles, updatePhase } from '../core';

const LIVES = 3;
const PADDLE_W = 84;
const PADDLE_H = 8;
const PADDLE_BOTTOM = 26; // px between the paddle top and the bottom edge
const PADDLE_EASE = 18; // player
const DEMO_EASE = 7; // autopilot: a little lazy, so it misses now and then
const BALL_R = 5;
const BALL_SPEED = 320; // px/s on the first wall
const WAVE_SPEED_UP = 45; // extra px/s per cleared wall
const BALL_SPEED_MAX = 620;
const MAX_BOUNCE = 1.05; // rad from vertical when the ball hits the paddle's edge
const LAUNCH_DELAY = 0.8; // s the ball rests on the paddle before it launches itself
const ROWS = 5;
const BRICK_H = 14;
const BRICK_GAP = 4;
const BRICK_MIN_W = 52;
const WALL_TOP = 28;
const WALL_MARGIN = 14;
const POINTS = 10;

const paddleTop = (game) => game.height - PADDLE_BOTTOM;
const ballSpeed = (game) => Math.min(BALL_SPEED + game.wave * WAVE_SPEED_UP, BALL_SPEED_MAX);

const create = () => ({
  ...createBase(LIVES),
  paddleX: 0,
  targetX: null, // where the player is pointing
  ball: { x: 0, y: 0, vx: 0, vy: 0, stuck: true, launchTimer: LAUNCH_DELAY },
  bricks: [], // { x, y, w, h, row, alive }
  wave: 0,
});

const buildWall = (game) => {
  const inner = game.width - WALL_MARGIN * 2;
  const cols = Math.max(4, Math.floor((inner + BRICK_GAP) / (BRICK_MIN_W + BRICK_GAP)));
  const w = (inner - (cols - 1) * BRICK_GAP) / cols;
  game.bricks = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < cols; col++) {
      game.bricks.push({ x: WALL_MARGIN + col * (w + BRICK_GAP), y: WALL_TOP + row * (BRICK_H + BRICK_GAP), w, h: BRICK_H, row, alive: true });
    }
  }
};

// Put the ball back on the paddle; it launches itself after a short pause
const serve = (game) => Object.assign(game.ball, { stuck: true, launchTimer: LAUNCH_DELAY, vx: 0, vy: 0 });

const resetMatch = (game) => {
  game.wave = 0;
  buildWall(game);
  serve(game);
};

const resize = (game, width, height) => {
  game.paddleX = game.width ? (game.paddleX / game.width) * width : width / 2;
  game.width = width;
  game.height = height;
  resetMatch(game);
};

const input = (game, { type, x }) => {
  if (x !== undefined) game.targetX = x;
  if (type === 'press' && game.phase === 'playing' && game.ball.stuck) game.ball.launchTimer = 0;
  join(game);
};

const launch = (game) => {
  const angle = random(-0.5, 0.5);
  const speed = ballSpeed(game);
  Object.assign(game.ball, { stuck: false, vx: Math.sin(angle) * speed, vy: -Math.cos(angle) * speed });
};

const movePaddle = (game, dt) => {
  const steering = game.phase === 'playing' && game.targetX !== null;
  // Autopilot: follow the ball, wobbling a little across the paddle
  const target = steering ? game.targetX : game.ball.x + Math.sin(game.time * 1.3) * PADDLE_W * 0.3;
  game.paddleX += (target - game.paddleX) * Math.min(1, (steering ? PADDLE_EASE : DEMO_EASE) * dt);
  game.paddleX = clamp(game.paddleX, PADDLE_W / 2, game.width - PADDLE_W / 2);
};

const bounceOffWalls = ({ ball, width }) => {
  if (ball.x < BALL_R) {
    ball.x = BALL_R;
    ball.vx = Math.abs(ball.vx);
  } else if (ball.x > width - BALL_R) {
    ball.x = width - BALL_R;
    ball.vx = -Math.abs(ball.vx);
  }
  if (ball.y < BALL_R) {
    ball.y = BALL_R;
    ball.vy = Math.abs(ball.vy);
  }
};

// Where the ball lands on the paddle sets the bounce angle: the edges send it out wide
const bounceOffPaddle = (game) => {
  const { ball } = game;
  const top = paddleTop(game);
  if (ball.vy <= 0 || ball.y + BALL_R < top || ball.y - BALL_R > top + PADDLE_H) return;
  const offset = (ball.x - game.paddleX) / (PADDLE_W / 2 + BALL_R);
  if (Math.abs(offset) > 1) return;
  const angle = offset * MAX_BOUNCE;
  const speed = ballSpeed(game);
  ball.vx = Math.sin(angle) * speed;
  ball.vy = -Math.cos(angle) * speed;
  ball.y = top - BALL_R;
};

const touches = (ball, b) => {
  const nx = clamp(ball.x, b.x, b.x + b.w);
  const ny = clamp(ball.y, b.y, b.y + b.h);
  return (ball.x - nx) ** 2 + (ball.y - ny) ** 2 < BALL_R ** 2;
};

const hitBrick = (game, events) => {
  const { ball } = game;
  const brick = game.bricks.find((b) => b.alive && touches(ball, b));
  if (!brick) return;
  brick.alive = false;
  burst(game, brick.x + brick.w / 2, brick.y + brick.h / 2, 8, 120);
  // Bounce off the side the ball came in through
  const dx = (ball.x - (brick.x + brick.w / 2)) / (brick.w / 2);
  const dy = (ball.y - (brick.y + brick.h / 2)) / (brick.h / 2);
  if (Math.abs(dx) > Math.abs(dy)) ball.vx = Math.sign(dx) * Math.abs(ball.vx);
  else ball.vy = Math.sign(dy) * Math.abs(ball.vy);

  const playing = game.phase === 'playing';
  if (playing) {
    game.score += POINTS;
    events.push({ type: 'score', quiet: true });
  }
  if (game.bricks.every((b) => !b.alive)) {
    game.wave += 1;
    buildWall(game);
    serve(game);
    if (playing) events.push({ type: 'clear' });
  }
};

const loseBall = (game, events) => {
  if (game.phase === 'playing') {
    game.lives -= 1;
    events.push({ type: 'miss' });
    if (game.lives === 0) {
      endRound(game, events);
      return;
    }
  }
  serve(game);
};

const moveBall = (game, dt, events) => {
  const { ball } = game;
  if (ball.stuck) {
    ball.x = game.paddleX;
    ball.y = paddleTop(game) - BALL_R - 1;
    ball.launchTimer -= dt;
    if (ball.launchTimer <= 0) launch(game);
    return;
  }
  // Small sub-steps so a fast ball can't tunnel through a brick
  const steps = Math.ceil((Math.hypot(ball.vx, ball.vy) * dt) / BALL_R);
  const h = dt / steps;
  for (let i = 0; i < steps && !ball.stuck; i++) {
    ball.x += ball.vx * h;
    ball.y += ball.vy * h;
    bounceOffWalls(game);
    bounceOffPaddle(game);
    hitBrick(game, events);
    if (ball.y - BALL_R > game.height) {
      loseBall(game, events);
      return;
    }
  }
};

const step = (game, dt) => {
  const events = [];
  updatePhase(game, dt, events, resetMatch);
  if (game.phase !== 'over') {
    movePaddle(game, dt);
    moveBall(game, dt, events);
  }
  stepParticles(game, dt);
  return events;
};

const draw = (ctx, game, { fg, accent }) => {
  ctx.clearRect(0, 0, game.width, game.height);
  ctx.lineWidth = 1.5;
  game.bricks.forEach((b) => {
    if (!b.alive) return;
    const color = b.row === 0 ? accent : fg;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.12;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.globalAlpha = 1;
    ctx.strokeRect(b.x + 0.75, b.y + 0.75, b.w - 1.5, b.h - 1.5);
  });

  ctx.fillStyle = fg;
  ctx.fillRect(game.paddleX - PADDLE_W / 2, paddleTop(game), PADDLE_W, PADDLE_H);

  if (game.phase !== 'over') {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(game.ball.x, game.ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
  }
  drawParticles(ctx, game, accent);
};

const breakout = { id: 'breakout', command: './brick-breaker', create, resize, input, step, draw };
export default breakout;
