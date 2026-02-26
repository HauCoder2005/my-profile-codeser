import React from "react";
import { motion } from "framer-motion";
import { container, itemUp } from "../utils/motion";
import { SectionHeading } from "../components/SectionHeading";
import { GlassCard } from "../components/GlassCard";
import { socials, profile } from "../data/profile";
import { OpenInNew } from "@mui/icons-material";

function AnimatedSocialCard({
  href,
  target,
  label,
  hint,
  icon: Icon,
  delay,
  disabled,
}: {
  href: string;
  target: "_self" | "_blank";
  label: string;
  hint?: string;
  icon: React.ElementType;
  delay: number;
  disabled?: boolean;
}) {
  return (
    <motion.a
      variants={itemUp(delay)}
      href={href}
      target={target}
      rel="noreferrer"
      whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative overflow-hidden rounded-3xl
                 border border-slate-200/60 dark:border-white/10
                 bg-white/70 dark:bg-white/5 backdrop-blur-xl
                 shadow-sm hover:shadow-xl transition-shadow p-5"
    >
      {/* Auto moving glow (runs always) */}
      <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-25">
        <motion.div
          className="absolute -inset-24 rounded-[999px]"
          animate={{
            x: [0, 120, -60, 0],
            y: [0, -80, 60, 0],
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.22), transparent 55%)",
          }}
        />
        <motion.div
          className="absolute -inset-24 rounded-[999px]"
          animate={{
            x: [0, -90, 70, 0],
            y: [0, 60, -70, 0],
          }}
          transition={{
            duration: 12,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.18), transparent 55%)",
          }}
        />
      </div>

      {/* Top glass sheen */}
      <div className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-35">
        <div className="absolute -top-1/2 left-0 right-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent dark:from-white/10" />
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <motion.div
            className="w-12 h-12 rounded-2xl bg-slate-900/5 dark:bg-white/10 border border-slate-200/60 dark:border-white/10 flex items-center justify-center"
            whileHover={{ rotate: 6 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <Icon />
          </motion.div>

          <motion.div
            initial={{ opacity: 0.55 }}
            whileHover={{ opacity: 1, x: 2, rotate: 8 }}
            transition={{ duration: 0.2 }}
          >
            <OpenInNew fontSize="small" className="opacity-70" />
          </motion.div>
        </div>

        <div className="mt-3 text-lg font-black">{label}</div>

        <div className="mt-1 text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {hint ?? "Mở liên kết"}
        </div>

        {disabled ? (
          <div className="mt-3 text-xs font-bold text-amber-700 dark:text-amber-300">
            (Đang là link placeholder “#”)
          </div>
        ) : null}
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
          const isPlaceholder = s.url === "#";
          return (
            <AnimatedSocialCard
              key={s.label}
              href={s.url}
              target={s.url.startsWith("mailto:") || isPlaceholder ? "_self" : "_blank"}
              label={s.label}
              hint={s.hint}
              icon={s.icon}
              delay={0.02 * idx}
              disabled={isPlaceholder}
            />
          );
        })}
      </div>
    </motion.div>
  );
}