import React from "react";

type FireworksBgProps = {
  className?: string;
  intensity?: number; // 0.6 ~ 1.5
};

export function FireworksBg({ className = "", intensity = 1 }: FireworksBgProps) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    let w = 0;
    let h = 0;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // Respect reduced motion
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      // draw a very subtle static noise
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < 120; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = 0.6 + Math.random() * 1.4;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ro.disconnect();
      return () => ro.disconnect();
    }

    type Spark = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number; // 0..1
      r: number;
      a: number;
      // small hue drift without hard-coding theme colors
      light: number; // 0..1
    };

    const sparks: Spark[] = [];
    const maxSparks = Math.floor(110 * intensity);

    const spawnBurst = () => {
      const cx = w * (0.15 + Math.random() * 0.7);
      const cy = h * (0.15 + Math.random() * 0.55);
      const count = Math.floor((16 + Math.random() * 26) * intensity);

      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp = 0.35 + Math.random() * 1.55;
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          life: 1,
          r: 0.9 + Math.random() * 2.2,
          a: 0.55 + Math.random() * 0.35,
          light: Math.random(),
        });
      }
    };

    // seed
    for (let i = 0; i < 2; i++) spawnBurst();

    let raf = 0;
    let last = performance.now();
    let acc = 0;

    const tick = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;
      acc += dt;

      // softly clear with trail (creates "bokeh/fade" vibe)
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // update & draw
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt / (1400 / intensity);
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        // physics
        s.vx *= 0.992;
        s.vy = s.vy * 0.992 + 0.012; // tiny gravity
        s.x += s.vx * (dt / 16.6);
        s.y += s.vy * (dt / 16.6);

        const fade = Math.max(0, Math.min(1, s.life));
        const alpha = s.a * fade * 0.28; // keep subtle
        const radius = s.r * (0.6 + (1 - fade) * 0.8);

        // color: use white with slight bluish/purple tint via rgba; no hard-coded brand colors
        const tint = s.light > 0.66 ? "255,255,255" : s.light > 0.33 ? "220,235,255" : "240,220,255";

        // glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tint}, ${alpha * 0.35})`;
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tint}, ${alpha})`;
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

      // spawn bursts occasionally (not too frequent)
      if (acc > 1100 / intensity) {
        acc = 0;
        if (sparks.length < maxSparks) spawnBurst();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [intensity]);

  return (
    <canvas
      ref={ref}
      className={[
        "absolute inset-0 pointer-events-none",
        "opacity-35 dark:opacity-45",
        className,
      ].join(" ")}
    />
  );
}