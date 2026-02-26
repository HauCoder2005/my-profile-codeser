import React from "react";

type Bubble = {
  id: string;
  size: number;      // px
  left: number;      // %
  top: number;       // %
  driftX: number;    // px
  driftY: number;    // px
  durX: number;      // s
  durY: number;      // s
  delayX: number;    // s (negative)
  delayY: number;    // s (negative)
  blur: number;      // px
  op: number;        // base opacity
};

export function BubbleFloatBg({
  className = "",
  count = 46,
}: {
  className?: string;
  count?: number;
}) {
  const bubbles = React.useMemo(() => {
    const arr: Bubble[] = [];
    for (let i = 0; i < count; i++) {
      const r = Math.random();

      // size distribution: nhiều nhỏ, ít to
      const size =
        r < 0.65 ? 10 + Math.random() * 18 :
        r < 0.93 ? 18 + Math.random() * 34 :
                   42 + Math.random() * 54;

      const left = Math.random() * 100;
      const top = Math.random() * 100;

      // drift nhỏ => chill (không lộn xộn)
      const driftX =
        size < 18 ? (Math.random() * 2 - 1) * 16 :
        size < 40 ? (Math.random() * 2 - 1) * 24 :
                    (Math.random() * 2 - 1) * 32;

      const driftY =
        size < 18 ? (Math.random() * 2 - 1) * 14 :
        size < 40 ? (Math.random() * 2 - 1) * 20 :
                    (Math.random() * 2 - 1) * 26;

      // duration dài => trôi từ từ
      const durX = 22 + Math.random() * 26; // 22..48s
      const durY = 26 + Math.random() * 30; // 26..56s

      // delay âm để mỗi bubble ở phase khác nhau ngay từ đầu (không cần spawn)
      const delayX = -Math.random() * durX;
      const delayY = -Math.random() * durY;

      const blur = size < 18 ? 0.4 : size < 40 ? 0.9 : 1.3;

      // opacity: light mode dễ thấy hơn, dark mode vẫn ok bằng class tailwind
      const op = size < 18 ? 0.38 : size < 40 ? 0.30 : 0.22;

      arr.push({
        id: `${i}-${Math.random().toString(16).slice(2)}`,
        size,
        left,
        top,
        driftX,
        driftY,
        durX,
        durY,
        delayX,
        delayY,
        blur,
        op,
      });
    }
    return arr;
  }, [count]);

  return (
    <div className={["absolute inset-0 overflow-hidden pointer-events-none", className].join(" ")}>
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            top: `${b.top}%`,
            filter: `blur(${b.blur}px)`,
            opacity: b.op,
            // 2 animation layer: X và Y độc lập -> trôi tự nhiên hơn
            animationName: "bubble-float-x, bubble-float-y",
            animationDuration: `${b.durX}s, ${b.durY}s`,
            animationTimingFunction: "ease-in-out, ease-in-out",
            animationIterationCount: "infinite, infinite",
            animationDirection: "alternate, alternate",
            animationDelay: `${b.delayX}s, ${b.delayY}s`,
            // custom vars
            ["--bx" as any]: `${b.driftX}px`,
            ["--by" as any]: `${b.driftY}px`,
            transform: "translate3d(0,0,0)",
          }}
        >
          {/* lớp nền bubble: light rõ hơn + dark dịu */}
          <span
            className="
              absolute inset-0 rounded-full
              bg-slate-900/[0.10] border border-slate-900/[0.12]
              dark:bg-white/[0.14] dark:border-white/[0.16]
            "
          />
          {/* glow rất nhẹ để “modern” */}
          <span
            className="
              absolute inset-0 rounded-full
              bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/8 to-cyan-500/10
              opacity-70 dark:opacity-55
              blur-[1.2px]
            "
          />
        </span>
      ))}
    </div>
  );
}