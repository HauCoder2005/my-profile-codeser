import React from "react";
import { motion } from "framer-motion";
import { OpenInNew } from "@mui/icons-material";
import { container, itemUp } from "../utils/motion";
import { SectionHeading } from "../components/SectionHeading";
import { GlassCard } from "../components/GlassCard";
import { socials, profile } from "../data/profile";

function SocialCard({
  href,
  target,
  label,
  hint,
  icon: Icon,
  delay,
}: {
  href: string;
  target: "_self" | "_blank";
  label: string;
  hint?: string;
  icon: React.ElementType;
  delay: number;
}) {
  return (
    <motion.a
      variants={itemUp(delay)}
      href={href}
      target={target}
      rel="noreferrer"
      whileHover={{ y: -5 }}
      className="tech-tile relative overflow-hidden border border-slate-900/10 bg-[var(--panel)] p-5 dark:border-white/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center border border-slate-900/10 bg-[var(--panel-strong)] dark:border-white/10">
          <Icon />
        </div>
        <OpenInNew fontSize="small" className="opacity-70" />
      </div>

      <div className="mt-4 text-base font-black uppercase tracking-[0.16em]">{label}</div>
      <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {hint}
      </div>
    </motion.a>
  );
}

export default function Social() {
  return (
    <motion.div
      variants={container(0.04)}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <SectionHeading eyebrow="Connect" title="Social"/>

      <GlassCard delayIndex={0}>
        <motion.div variants={itemUp(0)} className="max-w-3xl">
          <div className="text-2xl font-black uppercase tracking-[0.14em] md:text-3xl">
            {profile.fullName}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200 md:text-base">
            Kết nối nhanh qua các kênh bên dưới để trao đổi về project, backend, frontend hoặc cơ hội làm việc.
          </p>
        </motion.div>
      </GlassCard>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {socials.map((item, idx) => (
          <SocialCard
            key={item.label}
            href={item.url}
            target={item.url.startsWith("mailto:") ? "_self" : "_blank"}
            label={item.label}
            hint={item.hint}
            icon={item.icon}
            delay={0.02 * idx}
          />
        ))}
      </div>
    </motion.div>
  );
}
