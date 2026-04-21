import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ErrorOutline } from "@mui/icons-material";
import { container, itemUp } from "../utils/motion";

export default function NotFound() {
  return (
    <motion.div variants={container(0.03)} initial="hidden" animate="show" className="py-20">
      <motion.div variants={itemUp(0)} className="panel-3d mx-auto max-w-2xl p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center border border-slate-900/10 bg-[var(--panel-strong)] dark:border-white/10">
          <ErrorOutline />
        </div>
        <div className="mt-4 text-2xl font-black uppercase">404 / Page not found</div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Quay lại trang chủ để tiếp tục duyệt profile.
        </div>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-[var(--primary)] bg-[var(--primary)] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.16em] text-white"
          >
            Ve Home
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
