import React from "react";
import { motion } from "framer-motion";
import { container, itemUp } from "../utils/motion";
import { SectionHeading } from "../components/SectionHeading";
import { GlassCard } from "../components/GlassCard";
import { education } from "../data/profile";

type EducationWithImage = (typeof education)[number] & {
  imageUrl?: string;
};

export default function Education() {
  return (
    <motion.div
      variants={container(0.04)}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <SectionHeading eyebrow="Learning" title="Education" />

      <div className="grid gap-6">
        {(education as EducationWithImage[]).map((item, idx) => {
          const Icon = item.icon;

          return (
            <GlassCard key={item.title} delayIndex={idx}>
              <motion.div variants={itemUp(0.02 * idx)} className="grid gap-5 md:grid-cols-[80px_1fr]">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden border border-slate-900/10 bg-[var(--panel-strong)] dark:border-white/10">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <Icon />
                  )}
                </div>

                <div>
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-lg font-black uppercase tracking-[0.16em]">{item.title}</div>
                      <div className="mt-1 text-sm font-bold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">
                        {item.subtitle}
                      </div>
                    </div>
                    <div className="border border-slate-900/10 bg-[var(--panel-strong)] px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] dark:border-white/10">
                      {item.period}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {item.description.map((line) => (
                      <div
                        key={line}
                        className="border border-slate-900/10 bg-[var(--panel-strong)] px-4 py-3 text-sm leading-relaxed dark:border-white/10"
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </GlassCard>
          );
        })}
      </div>
    </motion.div>
  );
}
