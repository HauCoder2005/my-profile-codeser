import React from "react";
import { motion } from "framer-motion";
import { container, itemUp } from "../utils/motion";
import { SectionHeading } from "../components/SectionHeading";
import { GlassCard } from "../components/GlassCard";
import { socials, profile } from "../data/profile";
import { OpenInNew } from "@mui/icons-material";

export default function Social() {
  return (
    <motion.div
      variants={container(0.04)}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <SectionHeading
        eyebrow="CONNECT"
        title="Social Media"
        subtitle="Các kênh để kết nối với mình."
      />

      <GlassCard delayIndex={0}>
        <motion.div variants={itemUp(0)} className="max-w-3xl">
          <div className="text-2xl md:text-3xl font-black tracking-tight">
            {profile.fullName} •{" "}
            <span className="text-indigo-600 dark:text-indigo-300">
              {profile.alias}
            </span>
          </div>

          <p className="mt-3 text-base md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
            Mình thích kết nối với những người cùng vibe “build — learn — ship”.
            Nếu bạn muốn trao đổi về dự án, backend/frontend, hoặc đơn giản là
            chia sẻ kinh nghiệm học tập, cứ nhắn cho mình qua các kênh dưới đây.
          </p>
        </motion.div>
      </GlassCard>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {socials.map((s, idx) => {
          const Icon = s.icon;
          const isPlaceholder = s.url === "#";

          return (
            <motion.a
              key={s.label}
              variants={itemUp(0.02 * idx)}
              href={s.url}
              target={
                s.url.startsWith("mailto:") || isPlaceholder ? "_self" : "_blank"
              }
              rel="noreferrer"
              className="group rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-sm hover:shadow-md transition-all p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900/5 dark:bg-white/10 border border-slate-200/60 dark:border-white/10 flex items-center justify-center">
                  <Icon />
                </div>
                <OpenInNew
                  fontSize="small"
                  className="opacity-50 group-hover:opacity-80 transition-opacity"
                />
              </div>

              <div className="mt-3 text-lg font-black">{s.label}</div>

              <div className="mt-1 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {s.hint ?? "Mở liên kết"}
              </div>

              {isPlaceholder ? (
                <div className="mt-3 text-xs font-bold text-amber-700 dark:text-amber-300">
                  (Đang là link placeholder “#”)
                </div>
              ) : null}
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
}