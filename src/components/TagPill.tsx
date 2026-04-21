import React from "react";

export function TagPill({ children }: React.PropsWithChildren) {
  return (
    <span
      className="
        relative inline-flex items-center
        px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]
        border border-slate-900/10 dark:border-white/10
        bg-[var(--panel-strong)]
        backdrop-blur-xl
        text-slate-800 dark:text-slate-100
        transition-all
        overflow-hidden
      "
    >
      <span
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-r from-white/40 via-transparent to-transparent
          dark:from-white/5 dark:via-transparent dark:to-transparent
        "
      />
      <span className="relative">{children}</span>
    </span>
  );
}
