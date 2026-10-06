// Shared plumbing for the terminal arcade games (games/*.js): the demo → playing → over cycle,
// small maths helpers and particle bursts.
//
// Every game module exposes the same interface, used by TerminalArcade.jsx:
//   id, command               identity shown in the game picker
//   create()                  fresh game state (built on createBase)
//   resize(game, w, h)        the canvas changed size (CSS pixels)
//   input(game, { type, x })  'move' (pointer moved) or 'press' (pointer down / Space); x is absent for keys
//   step(game, dt)            advances one frame and returns events: { type, quiet?, ...data }
//   draw(ctx, game, palette)  renders one frame; palette is { fg, accent }

export const IDLE_TIMEOUT = 8; // s without input before the demo takes over again
export const GAME_OVER_PAUSE = 2.5; // s the game-over screen stays up

export const random = (min, max) => min + Math.random() * (max - min);
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// Fields every game shares; spread into each game's own state
export const createBase = (lives) => ({
  width: 0,
  height: 0,
  phase: 'demo', // 'demo' (plays itself) | 'playing' | 'over'
  phaseTime: 0,
  idleTime: 0,
  joined: false, // the visitor asked to play; the round starts on the next step
  time: 0, // s since the round started: drives the difficulty
  score: 0,
  lives,
  maxLives: lives,
  particles: [],
});

// Call on every player input: the first one during the demo starts a round
export const join = (game) => {
  game.idleTime = 0;
  if (game.phase === 'demo') game.joined = true;
};

const setPhase = (game, phase, events) => {
  game.phase = phase;
  game.phaseTime = 0;
  events.push({ type: phase });
};

export const endRound = (game, events) => setPhase(game, 'over', events);

// Advances the shared timers and the phase cycle. `reset` puts the game-specific state
// back to the start of a round.
export const updatePhase = (game, dt, events, reset) => {
  game.time += dt;
  game.phaseTime += dt;
  game.idleTime += dt;
  if (game.phase === 'demo' && game.joined) {
    Object.assign(game, { joined: false, score: 0, lives: game.maxLives, time: 0 });
    reset(game);
    setPhase(game, 'playing', events);
  } else if (game.phase === 'playing' && game.idleTime > IDLE_TIMEOUT) {
    setPhase(game, 'demo', events);
  } else if (game.phase === 'over' && game.phaseTime > GAME_OVER_PAUSE) {
    game.time = 0;
    reset(game);
    setPhase(game, 'demo', events);
  }
};

export const burst = (game, x, y, count, speed = 160) => {
  for (let i = 0; i < count; i++) {
    const angle = random(0, Math.PI * 2);
    const v = random(speed * 0.25, speed);
    game.particles.push({ x, y, vx: Math.cos(angle) * v, vy: Math.sin(angle) * v, life: 1 });
  }
};

export const stepParticles = (game, dt) => {
  game.particles.forEach((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt * 2;
  });
  game.particles = game.particles.filter((p) => p.life > 0);
};

export const drawParticles = (ctx, game, color) => {
  ctx.fillStyle = color;
  game.particles.forEach((p) => {
    ctx.globalAlpha = p.life;
    ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
  });
  ctx.globalAlpha = 1;
};
