import React from "react";
import { motion } from "framer-motion";
import { container, itemUp } from "../utils/motion";
import { SectionHeading } from "../components/SectionHeading";
import { GlassCard } from "../components/GlassCard";
import { mobileRepos } from "../data/profile";
import { TagPill } from "../components/TagPill";
import { GitHub } from "@mui/icons-material";

export default function MobileRepos() {
  return (
    <motion.div variants={container(0.04)} initial="hidden" animate="show" className="grid gap-6">
      <SectionHeading
        eyebrow="MOBILE"
        title="Mobile Repositories"
        subtitle="Các repo ưu tiên hiển thị và trải nghiệm tốt trên điện thoại."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {mobileRepos.map((m, idx) => {
          const Icon = m.icon;
          return (
            <GlassCard key={m.name} delayIndex={idx}>
              <motion.div variants={itemUp(0.02 * idx)}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-[var(--panel-strong)] border border-slate-900/10 dark:border-white/10 flex items-center justify-center">
                    <Icon />
                  </div>
                  <div>
                    <div className="text-lg font-black uppercase tracking-[0.16em]">{m.name}</div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                  {m.description.map((d) => (
                    <p key={d}>{d}</p>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {m.tech.map((t) => (
                    <TagPill key={t}>{t}</TagPill>
                  ))}
                </div>

                <div className="mt-5">
                  <a
                    href={m.repoUrl ?? "#"}
                    className="inline-flex items-center gap-2 px-4 py-3 text-xs font-extrabold uppercase tracking-[0.16em]
                               border border-slate-900/10 dark:border-white/10 bg-[var(--panel-strong)]"
                  >
                    <GitHub fontSize="small" /> Repo
                  </a>
                </div>
              </motion.div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard delayIndex={10}>
        <div className="text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
          Mobile-first ưu tiên spacing rõ, block lớn, trạng thái dễ đọc và thao tác chạm không bị dính.
        </div>
      </GlassCard>
    </motion.div>
  );
}
