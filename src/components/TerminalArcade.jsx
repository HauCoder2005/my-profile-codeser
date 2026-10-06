import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useIsDark, usePrefersReducedMotion } from './three/theme';
import { LIVES, createGame, resizeGame, steerGame, stepGame } from './arcade/engine';
import { drawGame } from './arcade/draw';
import SectionHeading from './SectionHeading';
import Panel from './Panel';

const HIGH_SCORE_KEY = 'arcade_high_score';
const LOG_LINES = 3;
const MAX_DPR = 2;

// Storage can throw (private mode, blocked site data); the high score is only a nicety
const readHighScore = () => {
  try {
    return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
};
const saveHighScore = (score) => {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // ignore
  }
};

const pad = (n) => String(n).padStart(4, '0');

// Read the theme colours from CSS so the canvas always matches the page
const readPalette = (el) => {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--c-accent').trim();
  return { fg: getComputedStyle(el).color, accent: `rgb(${accent})` };
};

// Mini game in a terminal window: a ship that auto-fires at falling asteroids.
// Plays itself as a demo until the visitor moves the mouse or a finger over it.
const TerminalArcade = () => {
  const { t } = useLanguage();
  const isDark = useIsDark();
  const reducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const paletteRef = useRef(null);
  const visibleRef = useRef(false);
  const highScoreRef = useRef(readHighScore());
  const logId = useRef(0);
  const [hud, setHud] = useState({ phase: 'demo', score: 0, lives: LIVES, best: highScoreRef.current });
  const [log, setLog] = useState([]);

  if (!gameRef.current) gameRef.current = createGame();

  useEffect(() => {
    paletteRef.current = readPalette(canvasRef.current);
  }, [isDark]);

  // Skip all per-frame work while the game is off screen
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; });
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  // Keep the canvas bitmap in sync with its CSS size, so it stays crisp on high-DPI screens
  useEffect(() => {
    const canvas = canvasRef.current;
    const observer = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const { clientWidth: width, clientHeight: height } = canvas;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
      resizeGame(gameRef.current, width, height);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Game loop. React state only changes when the engine reports an event (hit, escape, phase change).
  useEffect(() => {
    const game = gameRef.current;
    const ctx = canvasRef.current.getContext('2d');

    const applyEvents = (events) => {
      if (game.score > highScoreRef.current) {
        highScoreRef.current = game.score;
        saveHighScore(game.score);
      }
      setHud({ phase: game.phase, score: game.score, lives: game.lives, best: highScoreRef.current });
      const entries = events.map((event) => ({ ...event, id: logId.current++ }));
      setLog((prev) => (game.phase === 'demo' ? [] : [...prev, ...entries].slice(-LOG_LINES)));
    };

    let frame;
    let last = performance.now();
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visibleRef.current) return;
      // With reduced motion there is no self-playing demo: the game only runs once the visitor joins in
      const paused = reducedMotion && game.phase === 'demo' && game.targetX === null;
      if (!paused) {
        const events = stepGame(game, dt);
        if (events.length) applyEvents(events);
      }
      drawGame(ctx, game, paletteRef.current);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  const handlePointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    steerGame(gameRef.current, event.clientX - rect.left);
  };

  const { phase, score, lives, best } = hud;

  return (
    <section id="arcade" className="relative z-10 py-32 px-4 md:px-8 w-full max-w-6xl mx-auto">
      <SectionHeading title={t('arcade.title')} />

      <Panel className="font-mono text-xs md:text-sm">
        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10">
          <span aria-hidden className="flex gap-1.5">
            {[0, 1, 2].map((i) => <span key={i} className="w-2.5 h-2.5 bg-black/20 dark:bg-white/20" />)}
          </span>
          <span className="truncate opacity-70">
            <span className="text-accent">~/codeser $</span> ./space-defender
          </span>
          <span className="ml-auto shrink-0 opacity-70">{t('arcade.best')} {pad(best)}</span>
        </div>

        {/* Screen */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={t('arcade.aria')}
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            className="block w-full h-[320px] md:h-[420px] text-black dark:text-white cursor-crosshair touch-pan-y"
          />
          <div aria-hidden className="scanlines absolute inset-0 pointer-events-none text-black dark:text-white" />
          {phase !== 'playing' && (
            <p className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1 bg-white/80 dark:bg-black/70 font-bold uppercase tracking-widest">
                {phase === 'over' ? (
                  `${t('arcade.game_over')} · ${pad(score)}`
                ) : (
                  <>
                    <span className="text-accent">&gt;</span> {t('arcade.start')}
                    <span className="animate-pulse">_</span>
                  </>
                )}
              </span>
            </p>
          )}
        </div>

        {/* Status bar: event log + score */}
        <div className="flex items-start gap-4 px-4 py-3 min-h-[4.75rem] border-t border-black/10 dark:border-white/10">
          <ul className="flex-1 min-w-0 space-y-1 opacity-70">
            {phase === 'demo' ? (
              <li>{t('arcade.hint')}</li>
            ) : (
              log.map(({ id, type, points }) => (
                <li key={id} className="truncate">
                  <span className="text-accent">&gt;</span> {t(`arcade.log.${type}`).replace('{points}', points)}
                </li>
              ))
            )}
          </ul>
          <div className="shrink-0 space-y-2 text-right font-bold">
            <p>{t('arcade.score')} {pad(score)}</p>
            <p className="flex justify-end gap-1" aria-label={`${lives} ${t('arcade.lives')}`}>
              {Array.from({ length: LIVES }, (_, i) => (
                <span key={i} className={`w-2.5 h-2.5 ${i < lives ? 'bg-accent' : 'bg-black/15 dark:bg-white/15'}`} />
              ))}
            </p>
          </div>
        </div>
      </Panel>
    </section>
  );
};

export default TerminalArcade;
