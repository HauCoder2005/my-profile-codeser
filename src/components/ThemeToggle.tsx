import React from "react";
import { DarkMode, LightMode } from "@mui/icons-material";
import { motion } from "framer-motion";

type Props = {
  theme: "light" | "dark";
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: Props) {
  const isDark = theme === "dark";
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/70 dark:border-white/10 px-3 py-2
                 bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-sm hover:shadow transition-all"
      aria-label="Toggle theme"
      title="Đổi nền sáng/tối"
      type="button"
    >
      <span className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300">
        {isDark ? "Dark" : "Light"}
      </span>
      <span className="text-slate-900 dark:text-slate-100">
        {isDark ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
      </span>
    </motion.button>
  );
}
