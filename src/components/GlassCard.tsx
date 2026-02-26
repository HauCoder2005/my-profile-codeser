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
        "border border-slate-200/70 dark:border-white/10",
        "bg-white/75 dark:bg-white/5",
        "backdrop-blur-2xl",
        "shadow-[0_8px_30px_rgba(2,6,23,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        "hover:shadow-[0_14px_50px_rgba(2,6,23,0.10)] dark:hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)]",
        "transition-shadow",
        "p-4 sm:p-5 md:p-6",
        className,
      ].join(" ")}
    >
      {/* aurora moving glow */}
      <div className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-18 aurora-card" />

      {/* Top sheen */}
      <div className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-45">
        <div className="absolute -top-1/2 left-0 right-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent dark:from-white/10" />
      </div>

      {/* Inner ring */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/5 dark:ring-white/10" />

      <div className="relative">{children}</div>
    </motion.div>
  );
}