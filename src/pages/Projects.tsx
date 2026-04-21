import React from "react";
import { motion } from "framer-motion";
import { Launch, GitHub } from "@mui/icons-material";
import { container, itemUp } from "../utils/motion";
import { SectionHeading } from "../components/SectionHeading";
import { GlassCard } from "../components/GlassCard";
import { projects } from "../data/profile";
import { TagPill } from "../components/TagPill";

function LinkBtn({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  if (!href) return null;

  const isPlaceholder = href === "#";

  return (
    <a
      href={href}
      target={isPlaceholder ? "_self" : "_blank"}
      rel="noreferrer"
      className="inline-flex items-center gap-2 border border-slate-900/10 bg-[var(--panel-strong)] px-4 py-3 text-xs font-extrabold uppercase tracking-[0.16em] dark:border-white/10"
    >
      {children}
    </a>
  );
}

export default function Projects() {
  return (
    <motion.div
      variants={container(0.04)}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <SectionHeading eyebrow="Work" title="Projects" />

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, idx) => (
          <GlassCard key={project.name} delayIndex={idx}>
            <motion.div variants={itemUp(0.02 * idx)} className="grid gap-4">
              <div>
                <div className="text-lg font-black uppercase tracking-[0.16em]">{project.name}</div>
                <div className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
                  {project.role}
                </div>
              </div>

              <div className="grid gap-3">
                {project.description.map((line) => (
                  <div
                    key={line}
                    className="border border-slate-900/10 bg-[var(--panel-strong)] px-4 py-3 text-sm leading-relaxed dark:border-white/10"
                  >
                    {line}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <TagPill key={tag}>{tag}</TagPill>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <LinkBtn href={project.repoUrl}>
                  <GitHub fontSize="small" />
                  Repo
                </LinkBtn>
                <LinkBtn href={project.liveUrl}>
                  <Launch fontSize="small" />
                  Live
                </LinkBtn>
              </div>
            </motion.div>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}
