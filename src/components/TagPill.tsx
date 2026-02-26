import React from "react";

export function TagPill({ children }: React.PropsWithChildren) {
  return (
    <span
      className="
        relative inline-flex items-center
        rounded-full px-3 py-1 text-xs font-semibold
        border border-slate-200/70 dark:border-white/10
        bg-white/70 dark:bg-white/5
        backdrop-blur-xl
        text-slate-800 dark:text-slate-100
        shadow-[0_1px_0_rgba(0,0,0,0.03)]
        hover:shadow-[0_10px_30px_rgba(2,6,23,0.08)]
        transition-all
        overflow-hidden
      "
    >
      {/* liquid highlight */}
      <span
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-r
          from-white/70 via-white/30 to-white/70
          dark:from-white/10 dark:via-white/5 dark:to-white/10
          opacity-70
        "
      />
      {/* soft glow */}
      <span
        className="
          pointer-events-none absolute -inset-10
          bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.18),transparent_45%)]
          dark:bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.16),transparent_45%)]
          opacity-70
        "
      />

      <span className="relative">{children}</span>
    </span>
  );
}