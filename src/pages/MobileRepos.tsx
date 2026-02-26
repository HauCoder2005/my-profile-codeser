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
        subtitle="Khu vực dành cho repo chạy/hiển thị tốt trên điện thoại: Mobile app, PWA, mini tools."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {mobileRepos.map((m, idx) => {
          const Icon = m.icon;
          return (
            <GlassCard key={m.name} delayIndex={idx}>
              <motion.div variants={itemUp(0.02 * idx)}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/5 dark:bg-white/10 border border-slate-200/60 dark:border-white/10 flex items-center justify-center">
                    <Icon />
                  </div>
                  <div>
                    <div className="text-lg font-black">{m.name}</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Repo dành cho điện thoại (bạn thay nội dung thật).
                    </div>
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
                    className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold
                               border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md
                               hover:shadow transition-all"
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
          <b>Gợi ý:</b> Nếu bạn muốn “đẹp trên điện thoại” hơn nữa, hãy ưu tiên:
          spacing lớn hơn, button to, và test responsive (Chrome DevTools). UI ở project này đã tối ưu
          sẵn cho mobile: navbar có menu trên màn nhỏ, card bo tròn, hiệu ứng nhẹ nhàng.
        </div>
      </GlassCard>
    </motion.div>
  );
}
