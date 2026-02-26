import React from "react";
import { motion } from "framer-motion";
import { itemUp } from "../utils/motion";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  index?: number;
};

export function SectionHeading({ eyebrow, title, subtitle, index = 0 }: Props) {
  return (
    <motion.div variants={itemUp(index * 0.02)} className="mb-5 md:mb-6">
      {eyebrow ? (
        <div className="text-[11px] md:text-xs font-extrabold tracking-[0.25em] uppercase text-slate-500 dark:text-slate-400">
          {eyebrow}
        </div>
      ) : null}

      <h2 className="mt-2 text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}