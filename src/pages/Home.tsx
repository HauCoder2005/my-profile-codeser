import React from "react";
import { motion } from "framer-motion";
import { container, itemUp } from "../utils/motion";
import { profile } from "../data/profile";
import { ArrowForward, RocketLaunch } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { GlassCard } from "../components/GlassCard";

function Typewriter({
  words,
  className = "",
  typingSpeed = 55,
  deletingSpeed = 35,
  holdMs = 900,
}: {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  holdMs?: number;
}) {
  const [w, setW] = React.useState(0);
  const [txt, setTxt] = React.useState("");
  const [mode, setMode] = React.useState<"type" | "hold" | "delete">("type");

  const maxLen = React.useMemo(
    () => Math.max(...words.map((x) => x.length)),
    [words]
  );

  React.useEffect(() => {
    const current = words[w] ?? "";
    let t: number;

    if (mode === "type") {
      if (txt.length < current.length) {
        t = window.setTimeout(
          () => setTxt(current.slice(0, txt.length + 1)),
          typingSpeed
        );
      } else {
        t = window.setTimeout(() => setMode("hold"), holdMs);
      }
    } else if (mode === "hold") {
      t = window.setTimeout(() => setMode("delete"), holdMs);
    } else {
      if (txt.length > 0) {
        t = window.setTimeout(() => setTxt(txt.slice(0, -1)), deletingSpeed);
      } else {
        setMode("type");
        setW((x) => (x + 1) % words.length);
      }
    }

    return () => window.clearTimeout(t);
  }, [txt, mode, w, words, typingSpeed, deletingSpeed, holdMs]);

  return (
    <div
      className={["inline-flex items-center gap-2", className].join(" ")}
      style={{ minWidth: `${maxLen + 1}ch` }}
    >
      <span className="text-slate-700 dark:text-slate-200 font-extrabold whitespace-nowrap tabular-nums">
        {txt}
      </span>
      <span className="inline-block w-[10px] h-[18px] rounded-sm bg-slate-900/60 dark:bg-white/60 animate-pulse" />
    </div>
  );
}

export default function Home() {
  const machineWords = [
    "SOFTWARE ENGINEER",
    "BACKEND-ORIENTED",
    "FULL-STACK READY",
    "BUILD • LEARN • SHIP",
  ];

  const aboutLines = [
    {
      label: "Backend",
      text: "Java (Spring Boot), mở rộng C# (ASP.NET Core) và Node.js để linh hoạt theo dự án.",
    },
    {
      label: "Frontend",
      text: "ReactJS và level-up NextJS để scale sản phẩm tốt hơn.",
    },
    {
      label: "Database",
      text: "MySQL/SQL Server + tư duy tối ưu query, indexing, schema chuẩn.",
    },
  ];

  // unified pill style (match ROLE box vibe)
  const pillBase =
    "rounded-2xl px-4 py-2 text-xs font-extrabold border border-slate-200/60 dark:border-white/10 " +
    "bg-white/60 dark:bg-white/5 backdrop-blur-xl";

  return (
    <motion.div
      variants={container(0.05)}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <div className="grid md:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={itemUp(0)} className="md:col-span-7">
          <div className="rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-sm p-5 sm:p-6 md:p-8 h-full">
            <div className="text-[11px] md:text-xs font-extrabold tracking-[0.25em] uppercase text-slate-500 dark:text-slate-400">
              Profile
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl md:text-5xl font-black tracking-tight">
              {profile.fullName}
            </h1>

            <div className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-300">
              Bí danh:{" "}
              <span className="font-extrabold text-indigo-600 dark:text-indigo-300">
                {profile.alias}
              </span>
            </div>

            <motion.div variants={itemUp(0.02)} className="mt-4">
              <div className="inline-flex items-center rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/65 dark:bg-white/5 backdrop-blur-xl px-4 py-2 shadow-sm">
                <span className="text-[11px] md:text-xs font-extrabold tracking-[0.25em] uppercase text-slate-500 dark:text-slate-400 mr-3">
                  ROLE
                </span>

                <Typewriter
                  words={machineWords}
                  className="text-sm md:text-base font-mono"
                  typingSpeed={55}
                  deletingSpeed={35}
                  holdMs={750}
                />
              </div>
            </motion.div>

            {/* pills: make uniform + full width on mobile */}
            <div className="mt-4 grid grid-cols-1 sm:flex sm:flex-wrap items-start gap-2">
              <span
                className={[
                  pillBase,
                  "w-full sm:w-auto",
                  "text-slate-800 dark:text-slate-100",
                  "break-words",
                ].join(" ")}
              >
                {profile.headline}
              </span>

              <span
                className={[
                  pillBase,
                  "w-full sm:w-auto",
                  "text-slate-800 dark:text-slate-100",
                  "break-words",
                ].join(" ")}
              >
                {profile.location}
              </span>
            </div>

            <p className="mt-5 md:mt-6 text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              {profile.goal}
            </p>

            <div className="mt-6 md:mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/projects"
                className="group w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-extrabold
                           bg-slate-900 text-white hover:bg-slate-950 transition-colors shadow-sm hover:shadow"
              >
                <RocketLaunch fontSize="small" />
                Xem Projects
                <ArrowForward
                  fontSize="small"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                to="/social"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-extrabold
                           border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md
                           hover:shadow transition-all"
              >
                Kết nối Social
                <ArrowForward fontSize="small" />
              </Link>
            </div>

            <div className="mt-7 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { k: "Backend", v: "Java Spring Boot • C# • Node.js" },
                { k: "Frontend", v: "ReactJS • NextJS • Tailwind" },
                { k: "Focus", v: "Architecture • Performance • UX" },
              ].map((it, idx) => (
                <motion.div
                  key={it.k}
                  variants={itemUp(0.06 + idx * 0.04)}
                  className="rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4"
                >
                  <div className="text-xs font-extrabold tracking-wide text-slate-500 dark:text-slate-400">
                    {it.k}
                  </div>
                  <div className="mt-1 text-sm font-bold">{it.v}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemUp(0.08)} className="md:col-span-5">
          <div className="h-full min-h-[260px] md:min-h-0 overflow-hidden rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-sm">
            <img
              src="/images/codeser.jpg"
              alt="Huỳnh Hậu • codeser"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>

      <GlassCard delayIndex={2} className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="scanline" aria-hidden="true" />
        </div>

        <div className="relative max-w-3xl">
          <div className="text-[11px] md:text-xs font-extrabold tracking-[0.25em] uppercase text-slate-500 dark:text-slate-400">
            About me
          </div>

          <h2 className="mt-3 text-2xl md:text-3xl font-black tracking-tight leading-[1.15]">
            <span className="moving-text">
              “Build real things — ship clean code — keep it smooth.”
            </span>
          </h2>

          <motion.ul
            variants={container(0.06)}
            initial="hidden"
            animate="show"
            className="mt-5 space-y-3 text-base md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed"
          >
            {aboutLines.map((it, i) => (
              <motion.li
                key={it.label}
                variants={itemUp(0.02 * i)}
                whileHover={{ x: 6 }}
                transition={{ duration: 0.2 }}
                className="group flex gap-3 rounded-2xl border border-transparent hover:border-slate-200/50 dark:hover:border-white/10 hover:bg-white/5 px-2 py-2"
              >
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-slate-900/35 dark:bg-white/35 shrink-0 group-hover:bg-indigo-500 dark:group-hover:bg-indigo-300 transition-colors" />
                <span>
                  <b className="group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                    {it.label}:
                  </b>{" "}
                  {it.text}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={itemUp(0.08)} className="mt-6">
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 font-extrabold text-indigo-700 dark:text-indigo-300"
            >
              <span className="relative">
                Đọc thêm về mình
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </span>
              <ArrowForward
                fontSize="small"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </GlassCard>
    </motion.div>
  );
}