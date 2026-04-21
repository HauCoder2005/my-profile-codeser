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
      className="inline-flex h-10 w-10 items-center justify-center border border-slate-900/10 px-0 py-0
                 bg-[var(--panel-strong)] backdrop-blur-md transition-all dark:border-white/10"
      aria-label="Toggle theme"
      title="Đổi nền sáng/tối"
      type="button"
    >
      <span className="text-slate-900 dark:text-slate-100">
        {isDark ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
      </span>
    </motion.button>
  );
}
