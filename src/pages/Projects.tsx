import React from "react";
import { motion } from "framer-motion";
import { container, itemUp } from "../utils/motion";
import { SectionHeading } from "../components/SectionHeading";
import { GlassCard } from "../components/GlassCard";
import { projects } from "../data/profile";
import { TagPill } from "../components/TagPill";
import { Launch, GitHub, Close } from "@mui/icons-material";

function LinkBtn({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  if (!href) return null;
  const isPlaceholder = href === "#";
  return (
    <a
      href={href}
      target={isPlaceholder ? "_self" : "_blank"}
      rel="noreferrer"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold
                 border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md
                 hover:shadow transition-all"
    >
      {children}
    </a>
  );
}

function CenterModal({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200/70 dark:border-white/10 bg-white/85 dark:bg-[#0b0f19]/85 backdrop-blur-2xl shadow-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-extrabold tracking-[0.25em] uppercase text-slate-600 dark:text-slate-300">
              Coming soon
            </div>
            <div className="mt-2 text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
              Cinema Booking System
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-10 h-10 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:shadow transition-all"
            aria-label="Close"
          >
            <Close fontSize="small" />
          </button>
        </div>

        <div className="mt-4 text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
          {message}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-extrabold
                       bg-slate-900 text-white hover:bg-slate-950 transition-colors shadow-sm hover:shadow"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMsg, setModalMsg] = React.useState(
    "🎬 Đang triển khai — đón chờ vào tháng 6 nhé!"
  );

  return (
    <motion.div
      variants={container(0.04)}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <SectionHeading
        eyebrow="WORK"
        title="Projects"
        subtitle="Các dự án tiêu biểu (bạn có thể thay tên, mô tả, link repo/live)."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, idx) => (
          <GlassCard key={p.name} delayIndex={idx}>
            <motion.div variants={itemUp(0.02 * idx)}>
              <div className="text-lg font-black">{p.name}</div>
              <div className="mt-1 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                {p.role}
              </div>

              <div className="mt-4 space-y-2 text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                {p.description.map((d) => (
                  <p key={d}>{d}</p>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <TagPill key={t}>{t}</TagPill>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <LinkBtn
                  href={p.repoUrl}
                  onClick={(e) => {
                    const isCinema =
                      p.name.toLowerCase().includes("cinema") ||
                      p.role.toLowerCase().includes("coming soon") ||
                      p.tags.some((x) =>
                        x.toLowerCase().includes("coming soon")
                      );

                    if (isCinema) {
                      e.preventDefault();
                      setModalMsg("🎬 Đang triển khai — đón chờ vào tháng 6 nhé!");
                      setModalOpen(true);
                    }
                  }}
                >
                  <GitHub fontSize="small" /> Repo
                </LinkBtn>

                <LinkBtn href={p.liveUrl}>
                  <Launch fontSize="small" /> Live
                </LinkBtn>
              </div>
            </motion.div>
          </GlassCard>
        ))}
      </div>

      <CenterModal
        open={modalOpen}
        message={modalMsg}
        onClose={() => setModalOpen(false)}
      />
    </motion.div>
  );
}