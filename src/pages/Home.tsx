import React from "react";
import { motion } from "framer-motion";
import { ArrowForward, NorthEast, RocketLaunch } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { container, itemUp } from "../utils/motion";
import { GlassCard } from "../components/GlassCard";
import { profile, techVisuals } from "../data/profile";

function TechWall() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {techVisuals.map((tech, idx) => (
        <motion.div
          key={tech.name}
          variants={itemUp(0.02 * idx)}
          className={[
            "tech-tile tech-grid relative overflow-hidden border border-slate-900/10 p-4",
            "bg-gradient-to-br dark:border-white/10",
            tech.tone,
          ].join(" ")}
        >
          <div className="flex items-center justify-between gap-3">
            <img
              src={tech.image}
              alt={tech.name}
              className="h-10 w-10 object-contain"
              loading="lazy"
            />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
              {String(idx + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-4 text-sm font-bold uppercase tracking-[0.16em]">
            {tech.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  const metrics = [
    { label: "Core", value: "Backend Architecture" },
    { label: "UI", value: "React / Next Interface" },
    { label: "Data", value: "MySQL / SQL Server" },
  ];

  return (
    <motion.div
      variants={container(0.04)}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <div className="grid gap-6 md:grid-cols-12">
        <motion.div variants={itemUp(0)} className="md:col-span-7">
          <GlassCard className="min-h-full">
            <div className="hero-orb hero-orb-a" />
            <div className="hero-orb hero-orb-b" />

            <div className="relative">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
                System / Profile
              </div>

              <h1 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-4xl md:text-5xl">
                {profile.fullName}
              </h1>

              <div className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-slate-200 md:text-base">
                {profile.goal}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="border border-slate-900/10 bg-[var(--panel-strong)] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] dark:border-white/10">
                  {profile.headline}
                </span>
                <span className="border border-slate-900/10 bg-[var(--panel-strong)] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] dark:border-white/10">
                  {profile.location}
                </span>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {metrics.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    variants={itemUp(0.08 + idx * 0.03)}
                    className="border border-slate-900/10 bg-[var(--panel-strong)] p-4 dark:border-white/10"
                  >
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-2 text-sm font-bold uppercase leading-relaxed">
                      {item.value}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center gap-2 border border-[var(--primary)] bg-[var(--primary)] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.16em] text-white transition-colors hover:opacity-90"
                >
                  <RocketLaunch fontSize="small" />
                  Projects
                </Link>

                <Link
                  to="/skills"
                  className="inline-flex items-center justify-center gap-2 border border-slate-900/10 bg-[var(--panel-strong)] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.16em] transition-colors dark:border-white/10"
                >
                  Skill Matrix
                  <ArrowForward fontSize="small" />
                </Link>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemUp(0.1)} className="md:col-span-5">
          <GlassCard className="h-full p-0">
            <div className="relative min-h-[320px] overflow-hidden sm:min-h-[380px]">
              <img
                src="/images/codeser.jpg"
                alt="Huynh Hau"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_15%,rgba(9,13,18,0.28)_100%)]" />
              <div className="absolute left-0 top-0 w-full border-b border-white/20 bg-[rgba(38,38,38,0.34)] px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.26em] text-white backdrop-blur-sm dark:bg-[rgba(165,180,252,0.12)]">
                codeser / portrait
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="border border-white/15 bg-[rgba(15,23,42,0.34)] p-4 text-white backdrop-blur-md dark:bg-[rgba(15,23,42,0.52)]">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-white/70">
                    Alias
                  </div>
                  <div className="mt-2 text-lg font-black uppercase">{profile.alias}</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <GlassCard delayIndex={3} className="overflow-hidden">
        <div className="scanline" aria-hidden="true" />
        <div className="relative grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              Focus
            </div>
            <div className="mt-4 grid gap-3">
              {profile.shortBio.map((line, idx) => (
                <motion.div
                  key={line}
                  variants={itemUp(0.03 * idx)}
                  className="border border-slate-900/10 bg-[var(--panel-strong)] px-4 py-4 text-sm leading-relaxed dark:border-white/10"
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="border border-slate-900/10 bg-[var(--panel-strong)] p-4 dark:border-white/10">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Direction
              </div>
              <div className="mt-2 text-sm font-bold uppercase leading-relaxed">
                Clean architecture, strong data flow, animation with control.
              </div>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center justify-between border border-slate-900/10 bg-[var(--panel-strong)] px-4 py-4 text-sm font-extrabold uppercase tracking-[0.16em] dark:border-white/10"
            >
              Profile details
              <NorthEast fontSize="small" />
            </Link>
          </div>
        </div>
      </GlassCard>

      <GlassCard delayIndex={5}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              Tech Assets
            </div>
            <div className="mt-2 text-xl font-black uppercase sm:text-2xl">
              Stack visuals in source
            </div>
          </div>
        </div>
        <TechWall />
      </GlassCard>
    </motion.div>
  );
}
