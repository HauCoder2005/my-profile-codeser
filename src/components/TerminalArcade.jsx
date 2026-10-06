import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useIsDark, usePrefersReducedMotion } from './three/theme';
import { GAMES } from './arcade/games';
import GamePicker from './arcade/GamePicker';
import SectionHeading from './SectionHeading';
import Panel from './Panel';

const LOG_LINES = 3;
const MAX_DPR = 2;
const PRESS_KEYS = [' ', 'ArrowUp', 'Enter'];

// Storage can throw (private mode, blocked site data); high scores are only a nicety
const highScoreKey = (id) => `arcade_high_score:${id}`;
const readHighScore = (id) => {
  try {
    return Number(localStorage.getItem(highScoreKey(id))) || 0;
  } catch {
    return 0;
  }
};
const saveHighScore = (id, score) => {
  try {
    localStorage.setItem(highScoreKey(id), String(score));
  } catch {
    // ignore
  }
};

const pad = (n) => String(n).padStart(4, '0');

// Fill {placeholders} in a log line from the event's data
const formatLog = (template, event) => template.replace(/\{(\w+)\}/g, (_, key) => event[key] ?? '');

// Read the theme colours from CSS so the canvas always matches the page
const readPalette = (el) => {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--c-accent').trim();
  return { fg: getComputedStyle(el).color, accent: `rgb(${accent})` };
};

// Mini games in a terminal window (rules live in arcade/games/*). The selected game plays itself
// as a demo until the visitor moves the mouse, taps, or presses Space over it.
const TerminalArcade = () => {
  const { t } = useLanguage();
  const isDark = useIsDark();
  const reducedMotion = usePrefersReducedMotion();
  const [gameIndex, setGameIndex] = useState(0);
  const [hud, setHud] = useState({ phase: 'demo', score: 0, lives: 0, maxLives: 0, best: 0 });
  const [log, setLog] = useState([]);
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const paletteRef = useRef(null);
  const visibleRef = useRef(false);
  const logId = useRef(0);

  const game = GAMES[gameIndex];
  const gameRef = useRef(game);
  gameRef.current = game;
  const copy = (key) => t(`arcade.games.${game.id}.${key}`);

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
      if (stateRef.current) gameRef.current.resize(stateRef.current, width, height);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // Game loop: a fresh state whenever the game changes. React state only changes when the game
  // reports an event (score, life lost, phase change...), never on every frame.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const state = game.create();
    game.resize(state, canvas.clientWidth, canvas.clientHeight);
    stateRef.current = state;
    let best = readHighScore(game.id);

    const syncHud = () => setHud({ phase: state.phase, score: state.score, lives: state.lives, maxLives: state.maxLives, best });
    syncHud();
    setLog([]);

    const applyEvents = (events) => {
      if (state.score > best) {
        best = state.score;
        saveHighScore(game.id, best);
      }
      syncHud();
      const entries = events.filter((event) => !event.quiet).map((event) => ({ ...event, id: logId.current++ }));
      setLog((prev) => (state.phase === 'demo' ? [] : [...prev, ...entries].slice(-LOG_LINES)));
    };

    let frame;
    let last = performance.now();
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visibleRef.current) return;
      // With reduced motion there is no self-playing demo: a game only runs once the visitor joins in
      const paused = reducedMotion && state.phase === 'demo' && !state.joined;
      if (!paused) {
        const events = game.step(state, dt);
        if (events.length) applyEvents(events);
      }
      game.draw(ctx, state, paletteRef.current);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [game, reducedMotion]);

  const handlePointer = (type) => (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    game.input(stateRef.current, { type, x: event.clientX - rect.left });
  };

  const handleKey = (event) => {
    if (!PRESS_KEYS.includes(event.key)) return;
    event.preventDefault(); // Space would scroll the page
    game.input(stateRef.current, { type: 'press' });
  };

  const { phase, score, lives, maxLives, best } = hud;

  return (
    <section id="arcade" className="relative z-10 py-32 px-4 md:px-8 w-full max-w-6xl mx-auto">
      <SectionHeading title={t('arcade.title')} />

      <Panel className="font-mono text-xs md:text-sm">
        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10 dark:border-white/10">
          <span aria-hidden className="hidden sm:flex gap-1.5">
            {[0, 1, 2].map((i) => <span key={i} className="w-2.5 h-2.5 bg-black/20 dark:bg-white/20" />)}
          </span>
          <span className="hidden sm:inline shrink-0 text-accent">~/codeser $</span>
          <GamePicker games={GAMES} active={gameIndex} onSelect={setGameIndex} />
          <span className="ml-auto shrink-0 opacity-70">{t('arcade.best')} {pad(best)}</span>
        </div>

        {/* Screen */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            role="application"
            tabIndex={0}
            aria-label={copy('aria')}
            onPointerMove={handlePointer('move')}
            onPointerDown={handlePointer('press')}
            onKeyDown={handleKey}
            className="block w-full h-[320px] md:h-[420px] text-black dark:text-white cursor-crosshair touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
          />
          <div aria-hidden className="scanlines absolute inset-0 pointer-events-none text-black dark:text-white" />
          {phase !== 'playing' && (
            <p className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1 bg-white/80 dark:bg-black/70 font-bold uppercase tracking-widest">
                {phase === 'over' ? (
                  `${t('arcade.game_over')} · ${pad(score)}`
                ) : (
                  <>
                    <span className="text-accent">&gt;</span> {copy('start')}
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
              <li>{copy('hint')}</li>
            ) : (
              log.map((event) => (
                <li key={event.id} className="truncate">
                  <span className="text-accent">&gt;</span> {formatLog(copy(`log.${event.type}`), event)}
                </li>
              ))
            )}
          </ul>
          <div className="shrink-0 space-y-2 text-right font-bold">
            <p>{t('arcade.score')} {pad(score)}</p>
            {maxLives > 1 && (
              <p className="flex justify-end gap-1" aria-label={`${lives} ${t('arcade.lives')}`}>
                {Array.from({ length: maxLives }, (_, i) => (
                  <span key={i} className={`w-2.5 h-2.5 ${i < lives ? 'bg-accent' : 'bg-black/15 dark:bg-white/15'}`} />
                ))}
              </p>
            )}
          </div>
        </div>
      </Panel>
    </section>
  );
};

export default TerminalArcade;
