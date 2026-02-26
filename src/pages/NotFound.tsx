import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { container, itemUp } from "../utils/motion";
import { ErrorOutline } from "@mui/icons-material";

export default function NotFound() {
  return (
    <motion.div variants={container(0.03)} initial="hidden" animate="show" className="py-20">
      <motion.div variants={itemUp(0)} className="mx-auto max-w-2xl rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8 shadow-sm text-center">
        <div className="mx-auto w-14 h-14 rounded-3xl bg-slate-900/5 dark:bg-white/10 border border-slate-200/60 dark:border-white/10 flex items-center justify-center">
          <ErrorOutline />
        </div>
        <div className="mt-4 text-2xl font-black">404 — Page not found</div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Bạn đi lạc rồi. Quay lại Home nhé.
        </div>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-extrabold bg-slate-900 text-white hover:bg-slate-950 transition-colors shadow-sm hover:shadow"
          >
            Về Home
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
