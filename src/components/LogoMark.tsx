import React from "react";
import { motion } from "framer-motion";
import { Code } from "@mui/icons-material";

export function LogoMark() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7 }}
      className="flex items-center gap-2"
    >
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl
                   bg-gradient-to-br from-indigo-500/90 to-fuchsia-500/90
                   shadow-md animate-floaty"
      >
        <Code className="text-white" />
      </span>
      <div className="leading-tight">
        <div className="text-sm font-extrabold tracking-wide">codeser</div>
        <div className="text-[11px] text-slate-600 dark:text-slate-300">profile</div>
      </div>
    </motion.div>
  );
}
