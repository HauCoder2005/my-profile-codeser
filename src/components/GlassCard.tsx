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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.28 }}
      className={[
        "panel-3d lift-card relative overflow-hidden",
        "backdrop-blur-xl transition-transform",
        "p-4 sm:p-5 md:p-6",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/20" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-black/10 to-transparent dark:via-white/10" />
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  );
}
