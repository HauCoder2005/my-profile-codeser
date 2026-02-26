import React from "react";
import { motion } from "framer-motion";

export function PageLoader() {
  return (
    <div className="py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-2xl rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8 text-center shadow-sm"
      >
        <div className="text-sm font-extrabold tracking-[0.25em] uppercase text-slate-500 dark:text-slate-400">
          Loading
        </div>
        <div className="mt-3 text-2xl font-black">Đang tải trang…</div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Animation sẽ vào sau 1 nhịp ✨
        </div>
      </motion.div>
    </div>
  );
}
