import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export function RouteLoading({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            initial={{ y: 10, scale: 0.98, filter: "blur(6px)" }}
            animate={{ y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ y: 10, scale: 0.98, filter: "blur(6px)" }}
            transition={{ duration: 0.25 }}
            className="relative w-[92%] max-w-sm rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-white/10 backdrop-blur-xl shadow-xl p-6"
          >
            <div className="text-xs font-extrabold tracking-[0.25em] uppercase text-slate-600 dark:text-slate-300">
              Loading
            </div>
            <div className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">
              Đang chuyển trang…
            </div>

            {/* Bar */}
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/10">
              <motion.div
                className="h-full w-1/2 rounded-full bg-slate-900/60 dark:bg-white/60"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
              />
            </div>

            <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              codeser mode ✨
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}