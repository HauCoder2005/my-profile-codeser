import React from "react";
import { motion } from "framer-motion";
import { itemFade } from "../utils/motion";
import { Image } from "@mui/icons-material";

type Props = {
  label?: string;
  className?: string;
  delayIndex?: number;
};

export function ImagePlaceholder({ label = "Ảnh (bạn tự thêm)", className = "", delayIndex = 0 }: Props) {
  return (
    <motion.div
      variants={itemFade(0.02 * delayIndex)}
      className={[
        "relative overflow-hidden rounded-3xl",
        "border border-slate-200/60 dark:border-white/10",
        "bg-gradient-to-br from-slate-100 to-slate-50 dark:from-white/10 dark:to-white/5",
        "shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-ambient animate-shimmer opacity-70" />
      <div className="relative p-6 flex items-center justify-center min-h-[220px]">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-white/70 dark:bg-white/10 border border-slate-200/60 dark:border-white/10 flex items-center justify-center shadow-sm">
            <Image />
          </div>
          <div className="mt-3 text-sm font-bold">{label}</div>
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            (Bạn có thể thay bằng &lt;img /&gt; hoặc background-image)
          </div>
        </div>
      </div>
    </motion.div>
  );
}
