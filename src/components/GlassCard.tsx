import React from "react";
import { motion } from "framer-motion";
import { itemUp } from "../utils/motion";

type Props = React.PropsWithChildren<{
  className?: string;
  delayIndex?: number;
}>;

export function GlassCard({ children, className = "", delayIndex = 0 }: Props) {
  return (
    <motion.div
      variants={itemUp(0.02 * delayIndex)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className={[
        "relative overflow-hidden rounded-3xl",
        // border + glass background
        "border border-slate-200/70 dark:border-white/10",
        "bg-white/75 dark:bg-white/5",
        "backdrop-blur-2xl",
        // depth
        "shadow-[0_8px_30px_rgba(2,6,23,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        "hover:shadow-[0_14px_50px_rgba(2,6,23,0.10)] dark:hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)]",
        "transition-shadow",
        // padding responsive
        "p-4 sm:p-5 md:p-6",
        className,
      ].join(" ")}
    >
      {/* Liquid highlight layer */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_60%)] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.14),transparent_60%)]" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.14),transparent_60%)] dark:bg-[radial-gradient(circle,rgba(236,72,153,0.10),transparent_60%)]" />
      </div>

      {/* Top sheen (glass reflection) */}
      <div className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-50">
        <div className="absolute -top-1/2 left-0 right-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent dark:from-white/10" />
      </div>

      {/* Inner border for crispness */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/5 dark:ring-white/10" />

      <div className="relative">{children}</div>
    </motion.div>
  );
}