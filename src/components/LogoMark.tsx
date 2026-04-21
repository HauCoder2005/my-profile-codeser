import React from "react";
import { motion } from "framer-motion";

export function LogoMark() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7 }}
      className="flex items-center"
    >
      <div className="text-sm font-extrabold tracking-[0.2em] uppercase">codeser</div>
    </motion.div>
  );
}
