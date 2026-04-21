import React from "react";
import { motion } from "framer-motion";
import { container, itemUp } from "../utils/motion";
import { SectionHeading } from "../components/SectionHeading";
import { GlassCard } from "../components/GlassCard";
import { skillCategories, techVisuals } from "../data/profile";

export default function Skills() {
  return (
    <motion.div
      variants={container(0.04)}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <SectionHeading
        eyebrow="STACK"
        title="Skill Matrix"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {techVisuals.slice(0, 8).map((tech, idx) => (
          <motion.div
            key={tech.name}
            variants={itemUp(0.02 * idx)}
            className={[
              "tech-tile border border-slate-900/10 p-4 dark:border-white/10",
              "bg-gradient-to-br",
              tech.tone,
            ].join(" ")}
          >
            <img
              src={tech.image}
              alt={tech.name}
              className="h-12 w-12 object-contain"
              loading="lazy"
            />
            <div className="mt-4 text-sm font-black uppercase tracking-[0.16em]">
              {tech.name}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {skillCategories.map((cat, idx) => {
          const Icon = cat.icon;

          return (
            <GlassCard key={cat.title} delayIndex={idx}>
              <motion.div variants={itemUp(0.02 * idx)} className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center border border-slate-900/10 bg-[var(--panel-strong)] dark:border-white/10">
                    <Icon />
                  </div>
                  <div className="text-lg font-black uppercase tracking-[0.16em]">
                    {cat.title}
                  </div>
                </div>

                <div className="divider-line" />

                <div className="grid gap-3">
                  {cat.items.map((item, itemIdx) => (
                    <motion.div
                      key={item}
                      variants={itemUp(0.02 * itemIdx)}
                      className="border border-slate-900/10 bg-[var(--panel-strong)] px-4 py-3 text-sm font-medium leading-relaxed dark:border-white/10"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </GlassCard>
          );
        })}
      </div>
    </motion.div>
  );
}
