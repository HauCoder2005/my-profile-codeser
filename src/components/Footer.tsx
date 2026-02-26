import React from "react";
import { Favorite, Bolt, Copyright } from "@mui/icons-material";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 border-t border-slate-200/60 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600 dark:text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="font-extrabold text-slate-900 dark:text-slate-100">
            Huỳnh Hậu •{" "}
            <span className="text-indigo-600 dark:text-indigo-300">codeser</span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1">
              <Copyright fontSize="inherit" className="opacity-70" />
              {year}
            </span>

            <span className="opacity-40">•</span>

            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
              Designed & Developed by{" "}
              <span className="text-indigo-700 dark:text-indigo-300">codeser</span>
            </span>

            <span className="opacity-40">•</span>

            <span className="inline-flex items-center gap-1">
              <Bolt fontSize="inherit" className="opacity-70" />
              Portfolio UI
            </span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2">
          <Favorite fontSize="small" className="opacity-70" />
          <span className="font-semibold">Make it smooth, make it clean.</span>
        </div>
      </div>
    </footer>
  );
}