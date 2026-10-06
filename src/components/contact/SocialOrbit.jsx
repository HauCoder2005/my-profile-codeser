import React, { useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import { Check, Mail } from 'lucide-react';
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePrefersReducedMotion } from '../three/theme';
import { socials } from '../../config/site';

// Brand colours only show on hover/focus. `shadow` is a solid colour for the offset shadow
// (gradients can't be used there, and black would vanish on the dark theme).
const NETWORKS = [
  { id: 'facebook', label: 'Facebook', icon: FaFacebookF, brand: '#1877f2' },
  { id: 'instagram', label: 'Instagram', icon: FaInstagram, brand: 'linear-gradient(45deg, #f9ce34, #ee2a7b 50%, #6228d7)', shadow: '#ee2a7b' },
  { id: 'x', label: 'X', icon: FaXTwitter, brand: '#000000', shadow: 'rgb(var(--c-accent))' },
  { id: 'github', label: 'GitHub', icon: FaGithub, brand: '#181717', shadow: 'rgb(var(--c-accent))' },
  { id: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn, brand: '#0a66c2' },
];
const TILTS = [-6, 4, -3, 6, -4, 3]; // resting angle of each sticker, in degrees

const SPIN_SPEED = 0.18; // rad/s
const FLATTEN = 0.6; // vertical / horizontal radius: how tilted the orbit looks
const RADIUS = 0.4; // horizontal radius, as a share of the stage width
// Scroll-driven entrance (0 → 1 as the stage scrolls fully into view; it sits near the page end,
// so it may never reach the middle of the screen)
const ENTER_START = 0.15;
const ENTER_STAGGER = 0.07;
const ENTER_DURATION = 0.4;

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const easeOutCubic = (t) => 1 - (1 - t) ** 3;

// Last path segment of a profile URL, e.g. https://github.com/HauCoder2005 → @HauCoder2005.
// A bare domain (no profile yet) shows the domain instead.
const handleOf = (url) => {
  const { hostname, pathname } = new URL(url);
  const name = pathname.split('/').filter(Boolean).pop();
  return name ? `@${name}` : hostname;
};

const links = NETWORKS.filter(({ id }) => socials[id]).map((network, i) => ({
  ...network,
  href: socials[network.id],
  handle: handleOf(socials[network.id]),
  tilt: TILTS[i % TILTS.length],
}));

// Social stickers circling a "copy email" hub on a tilted orbit. Stickers at the back are smaller
// and dimmer and pass behind the hub. Hovering or focusing the orbit slows it to a stop.
const SocialOrbit = () => {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const stageRef = useRef(null);
  const itemRefs = useRef([]);
  const orbit = useRef({ angle: 0, speed: SPIN_SPEED, paused: false, focused: -1, width: 0, visible: false });
  const [copied, setCopied] = useState(false);

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'end end'] });

  useEffect(() => {
    const stage = stageRef.current;
    const o = orbit.current;
    const resize = new ResizeObserver(() => { o.width = stage.clientWidth; });
    const visibility = new IntersectionObserver(([entry]) => { o.visible = entry.isIntersecting; }, { rootMargin: '100px' });
    resize.observe(stage);
    visibility.observe(stage);
    return () => {
      resize.disconnect();
      visibility.disconnect();
    };
  }, []);

  // Animation loop: writes each sticker's transform directly, no React re-renders
  useEffect(() => {
    const o = orbit.current;
    const step = (Math.PI * 2) / links.length;
    let frame;
    let last = performance.now();

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!o.visible) return;

      const targetSpeed = reducedMotion || o.paused ? 0 : SPIN_SPEED;
      o.speed += (targetSpeed - o.speed) * Math.min(1, dt * 4);
      o.angle += o.speed * dt;
      const reveal = reducedMotion ? 1 : scrollYProgress.get();
      const rx = o.width * RADIUS;
      const ry = rx * FLATTEN;

      itemRefs.current.forEach((el, i) => {
        const e = easeOutCubic(clamp01((reveal - ENTER_START - i * ENTER_STAGGER) / ENTER_DURATION));
        // Each sticker spirals in from outside the orbit
        const angle = o.angle + i * step + (1 - e) * 2.4;
        const spread = 1 + (1 - e) * 1.6;
        const depth = Math.sin(angle); // -1 at the back, 1 at the front
        const near = (depth + 1) / 2;
        const focused = o.focused === i;
        const scale = (focused ? 1 : 0.78 + 0.22 * near) * (0.6 + 0.4 * e);
        el.style.transform = `translate3d(${(Math.cos(angle) * rx * spread).toFixed(1)}px, ${(depth * ry * spread).toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        el.style.opacity = (e * (focused ? 1 : 0.55 + 0.45 * near)).toFixed(2);
        el.style.zIndex = focused ? 30 : depth > 0 ? 20 : 5; // the hub sits at 10
        el.style.pointerEvents = e > 0.9 ? 'auto' : 'none';
      });
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, scrollYProgress]);

  const setPaused = (paused) => { orbit.current.paused = paused; };
  const setFocused = (index) => { orbit.current.focused = index; };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(socials.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${socials.email}`; // clipboard blocked: open the mail app instead
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={stageRef}
        className="relative w-full max-w-[440px] aspect-[4/3]"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Orbit path */}
        <svg aria-hidden viewBox="0 0 400 300" className="absolute inset-0 w-full h-full overflow-visible text-black/25 dark:text-white/25">
          <ellipse
            cx="200" cy="150" rx={400 * RADIUS} ry={400 * RADIUS * FLATTEN}
            fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8"
            className="motion-safe:animate-orbit-dash"
          />
        </svg>

        {/* Hub: copy the email address */}
        <button
          type="button"
          onClick={copyEmail}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 -rotate-3 hover:rotate-0 hover:scale-105 transition-transform duration-300 w-24 h-24 md:w-28 md:h-28 flex flex-col items-center justify-center gap-2 bg-accent text-white border-2 border-black dark:border-white shadow-[5px_5px_0_0_rgb(var(--c-black))] dark:shadow-[5px_5px_0_0_rgb(255_255_255)] font-mono text-[11px] font-bold uppercase tracking-wider"
        >
          <span aria-hidden className="absolute inset-0 border-2 border-accent motion-safe:animate-ping opacity-40" />
          {copied ? <Check size={26} /> : <Mail size={26} />}
          {t(copied ? 'contact.copied' : 'contact.copy_email')}
        </button>

        {/* Stickers */}
        <ul>
          {links.map(({ id, label, icon: Icon, href, handle, brand, shadow, tilt }, i) => (
            <li
              key={id}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="absolute left-1/2 top-1/2 opacity-0"
              onPointerEnter={() => setFocused(i)}
              onPointerLeave={() => setFocused(-1)}
              onFocus={() => setFocused(i)}
              onBlur={() => setFocused(-1)}
            >
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${label} ${handle}`}
                className="sticker group"
                style={{ '--brand': brand, '--brand-shadow': shadow || brand, '--tilt': `${tilt}deg` }}
              >
                <Icon className="sticker-icon w-6 h-6 md:w-7 md:h-7" />
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-2 py-1 whitespace-nowrap bg-black text-white dark:bg-white dark:text-black font-mono text-[10px] font-bold tracking-wider opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none">
                  {label} · {handle}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 font-mono text-sm opacity-70">{socials.email}</p>
    </div>
  );
};

export default SocialOrbit;
