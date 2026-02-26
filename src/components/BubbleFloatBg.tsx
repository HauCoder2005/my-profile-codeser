import React from "react";

type Bubble = {
  id: string;
  size: number;
  left: number;
  top: number;
  driftX: number;
  driftY: number;
  durX: number;
  durY: number;
  delayX: number;
  delayY: number;
  op: number;
};

export function BubbleFloatBg({
  className = "",
  count = 42,
  paused = false,
}: {
  className?: string;
  count?: number;
  paused?: boolean;
}) {
  const bubbles = React.useMemo(() => {
    const arr: Bubble[] = [];
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      const size =
        r < 0.7 ? 10 + Math.random() * 16 : r < 0.95 ? 18 + Math.random() * 26 : 36 + Math.random() * 34;

      const left = Math.random() * 100;
      const top = Math.random() * 100;

      const driftX = (Math.random() * 2 - 1) * (size < 18 ? 14 : size < 32 ? 18 : 22);
      const driftY = (Math.random() * 2 - 1) * (size < 18 ? 12 : size < 32 ? 16 : 20);

      // dài hơn => chill, ít frame-change hơn
      const durX = 26 + Math.random() * 30;
      const durY = 30 + Math.random() * 34;

      const delayX = -Math.random() * durX;
      const delayY = -Math.random() * durY;

      const op = size < 18 ? 0.26 : size < 32 ? 0.22 : 0.18;

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
          className={[
            "absolute rounded-full pointer-events-none",
            // 1 layer only (nhẹ)
            "bg-slate-900/[0.08] border border-slate-900/[0.10]",
            "dark:bg-white/[0.10] dark:border-white/[0.12]",
            // GPU hint
            "will-change-transform",
          ].join(" ")}
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            top: `${b.top}%`,
            opacity: b.op,
            transform: "translate3d(0,0,0)",
            // 2 animations (x/y) -> tự nhiên
            animationName: "bubble-float-x, bubble-float-y",
            animationDuration: `${b.durX}s, ${b.durY}s`,
            animationTimingFunction: "ease-in-out, ease-in-out",
            animationIterationCount: "infinite, infinite",
            animationDirection: "alternate, alternate",
            animationDelay: `${b.delayX}s, ${b.delayY}s`,
            animationPlayState: paused ? ("paused" as const) : ("running" as const),
            ["--bx" as any]: `${b.driftX}px`,
            ["--by" as any]: `${b.driftY}px`,
          }}
        />
      ))}
    </div>
  );
}