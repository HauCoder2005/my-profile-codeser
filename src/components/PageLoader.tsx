import React from "react";
import { motion } from "framer-motion";

export function PageLoader() {
  return (
    <div className="py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="panel-3d mx-auto max-w-2xl p-8 text-center"
      >
        <div className="text-sm font-extrabold tracking-[0.25em] uppercase text-slate-500 dark:text-slate-400">
          Loading
        </div>
        <div className="mt-3 text-2xl font-black uppercase">Dang tai trang</div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Preparing interface...
        </div>
      </motion.div>
    </div>
  );
}
