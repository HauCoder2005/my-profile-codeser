import React from "react";
import { Copyright } from "@mui/icons-material";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 border-t border-slate-900/10 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600 dark:text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="font-extrabold uppercase tracking-[0.18em] text-slate-900 dark:text-slate-100">
            Huynh Hau / codeser
          </div>
          <div className="inline-flex items-center gap-1">
            <Copyright fontSize="inherit" className="opacity-70" />
            {year}
          </div>
        </div>
      </div>
    </footer>
  );
}
