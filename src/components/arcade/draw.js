// Canvas renderer for the terminal arcade: draws one frame of the game state
import { shipY } from './engine';

// Engine nozzles, relative to the ship centre
const ENGINES = [-6, 6];

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

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.globalAlpha = 0.12;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y, r * 0.65, Math.PI * 1.1, Math.PI * 1.45);
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.globalAlpha = 1;
};

export const drawGame = (ctx, game, palette) => {
  ctx.clearRect(0, 0, game.width, game.height);

  game.asteroids.forEach((asteroid) => drawAsteroid(ctx, asteroid, palette));

  ctx.fillStyle = palette.accent;
  game.bullets.forEach((b) => ctx.fillRect(b.x - 1, b.y - 5, 2, 10));
  game.particles.forEach((p) => {
    ctx.globalAlpha = p.life;
    ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
  });
  ctx.globalAlpha = 1;

  if (game.phase !== 'over') drawShip(ctx, game.shipX, shipY(game), palette);
};
