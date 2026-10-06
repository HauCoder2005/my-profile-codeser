import React, { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';

// How long the screen stays on static before tuning in to the newly selected channel
const TUNE_DELAY_MS = 320;
const NOISE_W = 160;
const NOISE_H = 120;
const NOISE_FRAMES = 6;
const NOISE_INTERVAL_MS = 40; // ~25 fps of static is plenty and halves the canvas uploads

// White noise through a band-pass filter: the "rè rè" of an untuned set. Created on demand (needs a user gesture).
const createStaticSound = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  const ctx = new AudioContext();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2400;
  filter.Q.value = 0.6;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
  return { ctx, gain };
};

const Knob = memo(({ knobRef, label, onClick }) => (
  <button type="button" onClick={onClick} aria-label={label} className="group/knob relative w-12 h-12 sm:w-14 sm:h-14 shrink-0">
    <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
      <defs>
        <radialGradient id="knob-face" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#5a5148" />
          <stop offset="70%" stopColor="#2a241f" />
          <stop offset="100%" stopColor="#14110e" />
        </radialGradient>
      </defs>
      {/* Grip ridges */}
      {Array.from({ length: 24 }, (_, i) => (
        <line key={i} x1="28" y1="2" x2="28" y2="7" stroke="#14110e" strokeWidth="2" transform={`rotate(${i * 15} 28 28)`} />
      ))}
      <circle cx="28" cy="28" r="24" fill="url(#knob-face)" stroke="#0b0907" strokeWidth="1.5" />
    </svg>
    <div ref={knobRef} className="absolute inset-0 will-change-transform">
      <svg viewBox="0 0 56 56" className="w-full h-full">
        <line x1="28" y1="9" x2="28" y2="20" stroke="rgb(var(--c-accent))" strokeWidth="3" strokeLinecap="round" />
        <circle cx="28" cy="28" r="6" fill="#1a1612" stroke="#3a332c" />
      </svg>
    </div>
  </button>
));

const RetroTV = ({ lang, Icon, index, count, copy, dial, t, onPrev, onNext }) => {
  const [shown, setShown] = useState({ lang, Icon, index, copy });
  const [soundOn, setSoundOn] = useState(false);
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const staticRef = useRef(null);
  const knobRef = useRef(null);
  const rootRef = useRef(null);
  const visible = useRef(true);
  const burst = useRef(0);
  const sound = useRef(null);
  const soundOnRef = useRef(false);
  soundOnRef.current = soundOn;

  // Channel change: burst of static, then tune in to the new channel once the dial settles
  useEffect(() => {
    burst.current = 1;
    const timer = setTimeout(() => setShown({ lang, Icon, index, copy }), TUNE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [lang, Icon, index, copy]);

  // Skip all per-frame work while the TV is off screen
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // Animation loop: static noise, picture jitter, knob rotation, static sound level.
  // Only touches the DOM when a value actually changes.
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    // Pre-render a few frames of noise once, then just cycle through them
    const noise = Array.from({ length: NOISE_FRAMES }, () => {
      const image = ctx.createImageData(NOISE_W, NOISE_H);
      const pixels = new Uint32Array(image.data.buffer);
      for (let i = 0; i < pixels.length; i++) {
        const v = (Math.random() * 255) | 0;
        pixels[i] = 0xff000000 | (v << 16) | (v << 8) | v;
      }
      return image;
    });
    let frame;
    let last = performance.now();
    let lastNoise = 0;
    let noiseIndex = 0;
    let shownIntensity = -1;
    let shownKnob = null;

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible.current) return;

      const d = dial.current;
      // Static while the dial is moving, plus a short burst on every channel change
      const spin = Math.min(Math.abs(d.velocity) / 2.5, 1);
      burst.current = Math.max(0, burst.current - dt * 2.2);
      const raw = Math.max(burst.current, d.dragging ? Math.max(spin, 0.35) : spin * 0.9);
      const intensity = Math.round(Math.min(1, raw) * 50) / 50;

      if (intensity > 0 && now - lastNoise > NOISE_INTERVAL_MS) {
        ctx.putImageData(noise[noiseIndex], 0, 0);
        noiseIndex = (noiseIndex + 1) % NOISE_FRAMES;
        lastNoise = now;
      }
      if (intensity !== shownIntensity || intensity > 0) {
        staticRef.current.style.opacity = String(intensity);
        const jitter = intensity > 0.05 ? (Math.random() - 0.5) * 14 * intensity : 0;
        contentRef.current.style.transform = `translate3d(${jitter.toFixed(1)}px, 0, 0)`;
        contentRef.current.style.opacity = String(1 - intensity * 0.85);
        shownIntensity = intensity;
      }

      const knob = Math.round((-d.rotation * 180) / Math.PI * 10) / 10;
      if (knob !== shownKnob) {
        knobRef.current.style.transform = `rotate(${knob}deg)`;
        shownKnob = knob;
      }
      if (sound.current && soundOnRef.current) {
        sound.current.gain.gain.setTargetAtTime(intensity * 0.12, sound.current.ctx.currentTime, 0.03);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [dial]);

  useEffect(() => () => sound.current?.ctx.close(), []);

  const toggleSound = () => {
    if (!sound.current) sound.current = createStaticSound();
    sound.current?.ctx.resume();
    setSoundOn((on) => {
      if (on && sound.current) sound.current.gain.gain.setTargetAtTime(0, sound.current.ctx.currentTime, 0.03);
      return !on;
    });
  };

  const ShownIcon = shown.Icon;

  return (
    <div ref={rootRef} className="relative pt-12 sm:pt-16 select-none">
      {/* Rabbit-ear antenna */}
      <svg viewBox="0 0 200 70" className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 overflow-visible" aria-hidden>
        <line x1="100" y1="62" x2="38" y2="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="opacity-70" />
        <line x1="100" y1="62" x2="168" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="opacity-70" />
        <circle cx="38" cy="4" r="4" fill="rgb(var(--c-accent))" />
        <circle cx="168" cy="10" r="4" fill="rgb(var(--c-accent))" />
        <path d="M70 70 Q100 44 130 70 Z" fill="#2a1a10" stroke="#120a05" strokeWidth="1.5" />
      </svg>

      {/* Wooden cabinet */}
      <div
        className="relative flex gap-3 sm:gap-4 p-3 sm:p-4 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)]"
        style={{
          clipPath: 'inset(0 round 26px)',
          background: `
            repeating-linear-gradient(92deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 7px, rgba(255,255,255,0.03) 7px 8px, transparent 8px 15px),
            linear-gradient(180deg, #6b4428 0%, #4a2c18 55%, #34200f 100%)`,
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.15), inset 0 -3px 0 rgba(0,0,0,0.4)',
        }}
      >
        {/* Screen bezel */}
        <div className="flex-1 min-w-0 p-2 sm:p-3 bg-[#14100c]" style={{ clipPath: 'inset(0 round 20px)', boxShadow: 'inset 0 0 0 2px #2a2018' }}>
          <div
            className="relative h-full min-h-[210px] sm:min-h-[280px] overflow-hidden text-white"
            style={{
              clipPath: 'inset(0 round 14% / 18%)',
              background: 'radial-gradient(ellipse at 50% 45%, #1f2422 0%, #0b0d0c 70%, #030303 100%)',
            }}
          >
            {/* Channel picture */}
            <div ref={contentRef} className="absolute inset-0 flex flex-col px-5 py-4 sm:px-8 sm:py-6">
              <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#9effc1]/80">
                <span>{t('languages.channel')} {String(shown.index + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-500 animate-pulse" />
                  {t('languages.on_air')}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={shown.lang.id}
                  // CRT "power on": a bright horizontal line that opens up into the picture
                  initial={{ scaleY: 0.02, scaleX: 0.7, opacity: 0, filter: 'brightness(3)' }}
                  animate={{ scaleY: 1, scaleX: 1, opacity: 1, filter: 'brightness(1)' }}
                  exit={{ scaleY: 0.02, opacity: 0, filter: 'brightness(3)' }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 flex flex-col justify-center gap-3 crt-text"
                >
                  <div className="flex items-center gap-4">
                    <ShownIcon className="text-4xl sm:text-5xl shrink-0" style={{ color: shown.lang.color, filter: `drop-shadow(0 0 12px ${shown.lang.color})` }} />
                    <div className="min-w-0">
                      <h3 className="text-2xl sm:text-3xl font-mono font-bold uppercase leading-none">{shown.lang.name}</h3>
                      <span className="block mt-1.5 font-mono text-[10px] sm:text-xs tracking-widest uppercase text-accent">{shown.copy.focus}</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-white/80">{shown.copy.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Static noise: low-res canvas scaled up */}
            <div ref={staticRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0 }}>
              <canvas ref={canvasRef} width={NOISE_W} height={NOISE_H} className="w-full h-full" style={{ imageRendering: 'pixelated' }} />
              <div className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-white/25 to-transparent animate-[tv-roll_0.9s_linear_infinite]" />
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase bg-black/70 px-2 py-0.5">
                {t('languages.no_signal')}
              </span>
            </div>

            {/* Glass: scanlines, vignette, glare */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 1px, transparent 1px 3px)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 35%)' }} />
          </div>
        </div>

        {/* Control panel: channel knob (turns with the dial), channel buttons, sound, speaker */}
        <div
          className="w-16 sm:w-20 shrink-0 flex flex-col items-center gap-3 py-3 text-[#2a1f16]"
          style={{ clipPath: 'inset(0 round 14px)', background: 'linear-gradient(180deg, #e6dcc6, #c9bc9f)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }}
        >
          <span className="font-mono text-[8px] sm:text-[9px] font-bold tracking-[0.2em]">CODESER</span>
          <Knob knobRef={knobRef} label={t('languages.next')} onClick={onNext} />
          <div className="flex flex-col gap-1">
            <button type="button" onClick={onPrev} aria-label={t('languages.prev')} className="p-1 bg-[#2a1f16] text-[#e6dcc6] hover:bg-accent transition-colors">
              <ChevronUp size={14} />
            </button>
            <button type="button" onClick={onNext} aria-label={t('languages.next')} className="p-1 bg-[#2a1f16] text-[#e6dcc6] hover:bg-accent transition-colors">
              <ChevronDown size={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundOn ? t('languages.sound_off') : t('languages.sound_on')}
            aria-pressed={soundOn}
            className={`p-1.5 transition-colors ${soundOn ? 'bg-accent text-white' : 'bg-[#2a1f16] text-[#e6dcc6] hover:bg-accent'}`}
          >
            {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          {/* Speaker grille */}
          <div className="flex-1 w-10 sm:w-12 min-h-[40px]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #2a1f16 0 2px, transparent 2px 5px)' }} />
        </div>
      </div>

      {/* Feet */}
      <svg viewBox="0 0 200 16" className="block w-full h-4 -mt-px" preserveAspectRatio="none" aria-hidden>
        <path d="M30 0 L44 0 L40 16 L26 16 Z M156 0 L170 0 L174 16 L160 16 Z" fill="#2a1a10" />
      </svg>
    </div>
  );
};

export default memo(RetroTV);
