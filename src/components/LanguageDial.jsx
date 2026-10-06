import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { FaJava } from 'react-icons/fa';
import { SiTypescript, SiJavascript, SiPython, SiCplusplus } from 'react-icons/si';
import { TbBrandCSharp } from 'react-icons/tb';
import * as THREE from 'three';
import { useLanguage } from '../contexts/LanguageContext';
import { languages } from '../config/site';
import SectionHeading from './SectionHeading';
import RetroTV from './RetroTV';
import Rocket from './three/Rocket';
import { PALETTE, useIsDark, usePrefersReducedMotion } from './three/theme';

const ICONS = {
  javascript: SiJavascript,
  typescript: SiTypescript,
  java: FaJava,
  python: SiPython,
  csharp: TbBrandCSharp,
  cpp: SiCplusplus,
};

const COUNT = languages.length;
const STEP = (Math.PI * 2) / COUNT;
const TOP = Math.PI / 2;
const AUTO_ADVANCE_SECONDS = 3.2;
const RADIUS_FACTOR = 0.34; // dial radius as a share of the smaller canvas side
const ACCENT = { dark: '#ff6a2b', light: '#ea580c' };
// Ship i flies in over reveal ∈ [ENTER_START + i * ENTER_STAGGER, … + ENTER_DURATION]; auto-spin starts once all have landed
const ENTER_START = 0.08;
const ENTER_STAGGER = 0.08;
const ENTER_DURATION = 0.25;
const REVEAL_DONE = ENTER_START + (COUNT - 1) * ENTER_STAGGER + ENTER_DURATION;

const damp = THREE.MathUtils.damp;
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const easeOutCubic = (t) => 1 - (1 - t) ** 3;
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const mod = (n, m) => ((n % m) + m) % m;

// Rotation that puts item `index` at the top, choosing the turn closest to `from`
const rotationFor = (index, from) => {
  const base = -index * STEP;
  return base + Math.round((from - base) / (Math.PI * 2)) * Math.PI * 2;
};

/* ---------------------------------------------------------------- 3D scene */

const DialPlate = ({ radius, dial, reveal, palette, accent }) => {
  const ticksRef = useRef();
  const groupRef = useRef();

  // 72 ticks around the rim; every 6th one is long and accent-coloured, like a dial's numerals
  const { minor, major } = useMemo(() => {
    const build = (filter, inner, outer) => {
      const points = [];
      for (let i = 0; i < 72; i++) {
        if (!filter(i)) continue;
        const a = (i / 72) * Math.PI * 2;
        points.push(Math.cos(a) * inner, Math.sin(a) * inner, 0, Math.cos(a) * outer, Math.sin(a) * outer, 0);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      return geometry;
    };
    return {
      minor: build((i) => i % 6 !== 0, radius * 1.24, radius * 1.29),
      major: build((i) => i % 6 === 0, radius * 1.22, radius * 1.33),
    };
  }, [radius]);

  useFrame(() => {
    const e = easeOutCubic(clamp01(reveal.current / 0.35));
    if (groupRef.current) groupRef.current.scale.setScalar(0.6 + 0.4 * e);
    // Ticks turn with the dial (and spin in on reveal)
    if (ticksRef.current) ticksRef.current.rotation.z = dial.current.rotation - (1 - e) * Math.PI;
  });

  return (
    <group ref={groupRef}>
      {/* Orbit the rockets travel on */}
      <mesh>
        <ringGeometry args={[radius * 0.995, radius * 1.005, 128]} />
        <meshBasicMaterial color={palette.fg} transparent opacity={0.18} />
      </mesh>
      {/* Outer rim and inner hub ring */}
      <mesh>
        <ringGeometry args={[radius * 1.36, radius * 1.37, 128]} />
        <meshBasicMaterial color={palette.fg} transparent opacity={0.4} />
      </mesh>
      <mesh>
        <ringGeometry args={[radius * 0.44, radius * 0.45, 96]} />
        <meshBasicMaterial color={palette.fg} transparent opacity={0.25} />
      </mesh>
      <group ref={ticksRef}>
        <lineSegments geometry={minor}>
          <lineBasicMaterial color={palette.fg} transparent opacity={0.35} />
        </lineSegments>
        <lineSegments geometry={major}>
          <lineBasicMaterial color={accent} />
        </lineSegments>
      </group>
      {/* Finger stop: fixed accent marker + arc showing the "selected" window at the top */}
      <mesh position={[0, radius * 1.47, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <circleGeometry args={[radius * 0.07, 3]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh>
        <ringGeometry args={[radius * 1.15, radius * 1.18, 48, 1, TOP - STEP * 0.3, STEP * 0.6]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
};

const LanguageShip = ({ index, radius, dial, reveal, palette, cards }) => {
  const groupRef = useRef();
  const shipRef = useRef();
  const fireRef = useRef();
  const projected = useMemo(() => new THREE.Vector3(), []);
  const lastCard = useRef({ opacity: -1, interactive: null });

  useFrame(({ clock, camera, size }) => {
    const d = dial.current;
    // Each ship enters on its own slice of the scroll progress, spiralling in from outside
    const t = clamp01((reveal.current - ENTER_START - index * ENTER_STAGGER) / ENTER_DURATION);
    const e = easeOutCubic(t);
    const slot = TOP + index * STEP + d.rotation;
    const angle = slot + (1 - e) * 2.4;
    const r = radius * (1 + (1 - e) * 1.6);

    const group = groupRef.current;
    if (group) {
      group.position.set(Math.cos(angle) * r, Math.sin(angle) * r, (1 - e) * 4);
      group.visible = t > 0;
    }
    if (shipRef.current) {
      // Nose along the direction of travel: clockwise by default, flips when spun the other way
      shipRef.current.rotation.z = angle + d.heading;
    }
    if (fireRef.current) {
      const thrust = 1 + Math.min(Math.abs(d.velocity), 6) * 0.35 + (1 - e) * 1.5;
      fireRef.current.scale.y = thrust + Math.sin(clock.elapsedTime * 14 + index) * 0.2;
    }
    const card = cards.current[index];
    if (card && group) {
      // Seat the card just above the ship, in screen space
      projected.copy(group.position).project(camera);
      const x = (projected.x * 0.5 + 0.5) * size.width;
      const y = (-projected.y * 0.5 + 0.5) * size.height;
      // Lean the card against fast spins for a bit of inertia
      const lean = THREE.MathUtils.clamp(-d.velocity * 4, -14, 14);
      const prev = lastCard.current;
      const opacity = Math.round(e * 100) / 100;
      if (opacity !== prev.opacity) {
        card.style.opacity = String(opacity);
        prev.opacity = opacity;
      }
      const interactive = e > 0.9;
      if (interactive !== prev.interactive) {
        card.style.pointerEvents = interactive ? 'auto' : 'none';
        prev.interactive = interactive;
      }
      card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, calc(-100% - 10px)) scale(${(0.6 + 0.4 * e).toFixed(3)}) rotate(${lean.toFixed(2)}deg)`;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <group ref={shipRef} scale={radius * 0.085}>
        <Rocket palette={palette} fireRef={fireRef} />
      </group>
    </group>
  );
};

// Spring / inertia / auto-advance physics for the dial. Pointer handlers write into `dial`; this reads it every frame.
const DialPhysics = ({ dial, reveal, onActive, autoplay }) => {
  const lastActive = useRef(-1);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const d = dial.current;
    const before = d.rotation;

    if (d.dragging) {
      d.idle = 0;
    } else if (d.mode === 'inertia') {
      d.rotation += d.velocity * delta;
      d.velocity *= Math.exp(-2.2 * delta);
      if (Math.abs(d.velocity) < 0.8) {
        d.mode = 'snap';
        d.target = Math.round(d.rotation / STEP) * STEP;
      }
    } else {
      d.rotation = damp(d.rotation, d.target, 7, delta);
      d.idle += delta;
      const settled = Math.abs(d.rotation - d.target) < 0.002;
      if (autoplay && !d.hovered && settled && reveal.current >= REVEAL_DONE && d.idle > AUTO_ADVANCE_SECONDS) {
        // Clockwise, one language at a time
        d.target -= STEP;
        d.idle = 0;
      }
    }

    if (!d.dragging && d.mode !== 'inertia') d.velocity = (d.rotation - before) / Math.max(delta, 1e-4);
    if (Math.abs(d.velocity) > 0.05) d.headingTarget = d.velocity < 0 ? Math.PI : 0;
    d.heading = damp(d.heading, d.headingTarget, 6, delta);

    const active = mod(Math.round(-d.rotation / STEP), COUNT);
    if (active !== lastActive.current) {
      lastActive.current = active;
      onActive(active);
    }
  });

  return null;
};

// Memoised: its props are refs and flags, so changing the active language never re-renders the 3D tree
const DialScene = memo(({ dial, reveal, cards, onActive, autoplay, isDark }) => {
  const { viewport } = useThree();
  const radius = Math.min(viewport.width, viewport.height) * RADIUS_FACTOR;
  const palette = isDark ? PALETTE.dark : PALETTE.light;
  const accent = isDark ? ACCENT.dark : ACCENT.light;

  return (
    <>
      <DialPhysics dial={dial} reveal={reveal} onActive={onActive} autoplay={autoplay} />
      <DialPlate radius={radius} dial={dial} reveal={reveal} palette={palette} accent={accent} />
      {languages.map((lang, i) => (
        <LanguageShip
          key={lang.id}
          index={i}
          radius={radius}
          dial={dial}
          reveal={reveal}
          palette={palette}
          cards={cards}
        />
      ))}
    </>
  );
});

/* ---------------------------------------------------------------- Section */

const LanguageDial = () => {
  const { t } = useLanguage();
  const isDark = useIsDark();
  const reducedMotion = usePrefersReducedMotion();
  const stageRef = useRef(null);
  const cards = useRef([]);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  const dial = useRef({
    rotation: 0, target: 0, velocity: 0, mode: 'snap',
    dragging: false, hovered: false, idle: 0, heading: Math.PI, headingTarget: Math.PI,
  });

  // Scroll-driven entrance: 0 when the dial enters the viewport, 1 once it's centred
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'center center'] });
  const reveal = useRef(0);
  useEffect(() => {
    const update = (v) => { reveal.current = reducedMotion ? 1 : v; };
    update(scrollYProgress.get());
    return scrollYProgress.on('change', update);
  }, [scrollYProgress, reducedMotion]);

  // Only render the canvas while it's on screen
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((index) => {
    const d = dial.current;
    d.mode = 'snap';
    d.target = rotationFor(index, d.rotation);
    d.idle = 0;
  }, []);
  const activeRef = useRef(active);
  activeRef.current = active;
  const prev = useCallback(() => goTo(mod(activeRef.current - 1, COUNT)), [goTo]);
  const next = useCallback(() => goTo(mod(activeRef.current + 1, COUNT)), [goTo]);

  // Circular drag: the dial follows the pointer's angle around its centre, like a rotary phone
  useEffect(() => {
    const stage = stageRef.current;
    const d = dial.current;
    let lastAngle = 0;
    let lastTime = 0;
    let travelled = 0;
    let rect = null;

    const angleOf = (e) => {
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = -(e.clientY - (rect.top + rect.height / 2));
      return { angle: Math.atan2(y, x), dist: Math.hypot(x, y), size: Math.min(rect.width, rect.height) };
    };

    const onDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      rect = stage.getBoundingClientRect();
      const { angle, dist, size } = angleOf(e);
      // On touch, only grab when the finger lands on the ring, so the page can still scroll elsewhere
      if (e.pointerType === 'touch') {
        const r = size * RADIUS_FACTOR;
        if (dist < r * 0.45 || dist > r * 1.5) return;
      }
      d.dragging = true;
      d.mode = 'drag';
      d.velocity = 0;
      lastAngle = angle;
      lastTime = performance.now();
      travelled = 0;
      stage.setPointerCapture(e.pointerId);
      stage.style.cursor = 'grabbing';
    };

    const onMove = (e) => {
      if (!d.dragging) return;
      const { angle } = angleOf(e);
      const delta = wrapAngle(angle - lastAngle);
      const now = performance.now();
      const dt = Math.max((now - lastTime) / 1000, 1e-3);
      d.rotation += delta;
      d.velocity = THREE.MathUtils.lerp(d.velocity, delta / dt, 0.5);
      travelled += Math.abs(delta);
      lastAngle = angle;
      lastTime = now;
    };

    const onUp = (e) => {
      if (!d.dragging) return;
      d.dragging = false;
      d.idle = 0;
      stage.style.cursor = '';
      if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
      if (travelled < 0.05) {
        // A tap, not a spin: select the card under the pointer (pointer capture swallows its click)
        d.mode = 'snap';
        d.target = Math.round(d.rotation / STEP) * STEP;
        const card = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-lang-index]');
        if (card) goTo(Number(card.dataset.langIndex));
      } else {
        d.mode = 'inertia';
      }
    };

    // Stop the page from scrolling while a touch is spinning the dial
    const onTouchMove = (e) => {
      if (d.dragging) e.preventDefault();
    };
    const onEnter = (e) => { if (e.pointerType === 'mouse') d.hovered = true; };
    const onLeave = () => { d.hovered = false; };

    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerup', onUp);
    stage.addEventListener('pointercancel', onUp);
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerup', onUp);
      stage.removeEventListener('pointercancel', onUp);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('touchmove', onTouchMove);
    };
  }, [goTo]);

  const lang = languages[active];
  const ActiveIcon = ICONS[lang.id];
  const copy = t('languages.items')[lang.id];

  return (
    <section id="languages" className="relative z-10 py-32 px-4 md:px-8 w-full max-w-7xl mx-auto">
      <SectionHeading title={t('languages.title')} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-6 lg:gap-16 items-center">
        {/* Old TV: static while the dial spins, then tunes in to the selected language */}
        <div>
          <RetroTV
            lang={lang}
            Icon={ActiveIcon}
            index={active}
            count={COUNT}
            copy={copy}
            dial={dial}
            t={t}
            onPrev={prev}
            onNext={next}
          />
        </div>
        {/* Dial */}
        <div
          ref={stageRef}
          className="relative w-full aspect-square select-none cursor-grab"
          aria-label={t('languages.hint')}
        >
          <Canvas
            frameloop={inView ? 'always' : 'never'}
            camera={{ position: [0, 0, 12], fov: 35 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <DialScene
              dial={dial}
              reveal={reveal}
              cards={cards}
              onActive={setActive}
              autoplay={!reducedMotion}
              isDark={isDark}
            />
          </Canvas>

          {/* Language cards: positioned every frame by their ship (see LanguageShip) */}
          {languages.map((item, i) => {
            const Icon = ICONS[item.id];
            const isActive = active === i;
            return (
              <button
                key={item.id}
                ref={(el) => { cards.current[i] = el; }}
                type="button"
                data-lang-index={i}
                onClick={() => goTo(i)}
                style={{ opacity: 0, clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                className={`absolute left-0 top-0 z-10 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap px-2 py-1 sm:px-3 sm:py-1.5 font-mono text-[11px] sm:text-sm font-bold uppercase tracking-wider border will-change-transform transition-colors duration-300 ${
                  isActive
                    ? 'border-accent bg-accent text-white'
                    : 'border-black/25 dark:border-white/25 bg-white/95 dark:bg-black/85 text-black dark:text-white hover:border-accent'
                }`}
              >
                <Icon className="shrink-0" style={{ color: isActive ? '#fff' : item.color }} />
                {item.name}
              </button>
            );
          })}

          {/* Hub: the active language, like the label in the middle of a rotary dial */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 30 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-1 sm:gap-2"
              >
                <ActiveIcon className="text-4xl sm:text-6xl" style={{ color: lang.color, filter: `drop-shadow(0 0 18px ${lang.color}66)` }} />
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] opacity-60">
                  {String(active + 1).padStart(2, '0')} / {String(COUNT).padStart(2, '0')}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      <p className="mt-6 text-center font-mono text-[11px] sm:text-xs opacity-60">
        <RotateCw size={14} className="inline -mt-0.5 mr-2 animate-[spin_6s_linear_infinite]" />
        {t('languages.hint')}
      </p>
    </section>
  );
};

export default LanguageDial;
