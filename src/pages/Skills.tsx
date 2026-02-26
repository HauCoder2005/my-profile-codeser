import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { container, itemUp } from "../utils/motion";
import { SectionHeading } from "../components/SectionHeading";
import { GlassCard } from "../components/GlassCard";
import { skillCategories } from "../data/profile";
import { ExpandMore } from "@mui/icons-material";
import { BubbleFloatBg } from "../components/BubbleFloatBg";

function useBubbleCount() {
  const [count, setCount] = React.useState(38);

  React.useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 480) return 26;
      if (w < 768) return 38;
      return 52;
    };
    const apply = () => setCount(calc());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return count;
}

export default function Skills() {
  const [openIndex, setOpenIndex] = React.useState<number>(0);
  const [paused, setPaused] = React.useState(false);
  const bubbleCount = useBubbleCount();

  const onToggle = (idx: number) => {
    // pause bubbles briefly to keep accordion animation smooth
    setPaused(true);
    window.setTimeout(() => setPaused(false), 380);

    setOpenIndex((cur) => (cur === idx ? -1 : idx));
  };

  return (
    <div className="relative">
      <BubbleFloatBg
        className="z-0 opacity-100 dark:opacity-95"
        count={bubbleCount}
        paused={paused}
      />

      <motion.div
        variants={container(0.04)}
        initial="hidden"
        animate="show"
        className="relative z-10 grid gap-6"
      >
        <SectionHeading
          eyebrow="STACK"
          title="Kỹ năng & Công nghệ"
          subtitle="Nhấn vào từng nhóm để mở/thu gọn. Cách này nhìn gọn, hiện đại và dễ đọc."
        />

        <div className="grid gap-6">
          {skillCategories.map((cat, idx) => {
            const Icon = cat.icon;
            const isOpen = openIndex === idx;

            return (
              <GlassCard key={cat.title} delayIndex={idx} className="p-0">
                <button
                  type="button"
                  onClick={() => onToggle(idx)}
                  className="w-full text-left p-5 sm:p-6 md:p-7"
                >
                  <motion.div
                    variants={itemUp(0.02 * idx)}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200/70 dark:border-white/10 shadow-sm flex items-center justify-center shrink-0">
                      <Icon />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                        {cat.title}
                      </div>
                      <div className="mt-1 text-sm md:text-base text-slate-600 dark:text-slate-300">
                        {cat.items.length} mục • Nhấn để{" "}
                        {isOpen ? "thu gọn" : "mở rộng"}
                      </div>
                    </div>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-11 h-11 rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl flex items-center justify-center"
                    >
                      <ExpandMore />
                    </motion.div>
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 md:px-7 pb-6">
                        <div className="h-px bg-slate-200/60 dark:bg-white/10 mb-5" />

                        <div className="grid gap-2">
                          {cat.items.map((s, j) => (
                            <motion.div
                              key={s}
                              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                              transition={{ duration: 0.35, delay: 0.02 * j }}
                              className="flex items-start gap-3 rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/55 dark:bg-white/5 backdrop-blur-xl px-4 py-3"
                            >
                              <div className="mt-2 h-2.5 w-2.5 rounded-full bg-slate-900/35 dark:bg-white/35 shrink-0" />
                              <div className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                                {s}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>

        <GlassCard delayIndex={10}>
          <div>
            <div className="text-xs font-extrabold tracking-[0.25em] uppercase text-slate-500 dark:text-slate-400">
              Growth
            </div>
            <h3 className="mt-3 text-xl md:text-2xl font-black">
              Mình thích học theo dự án — vì nó “đụng” đủ thứ.
            </h3>
            <p className="mt-3 text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              Khi build một hệ thống thật (ví dụ cinema booking), mình sẽ chạm tới:
              design DB, API design, auth/roles, upload media, pagination/filter,
              UI state management, caching, và tối ưu trải nghiệm. Mỗi feature là
              một lesson — và mình “gom lại” thành kỹ năng.
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}