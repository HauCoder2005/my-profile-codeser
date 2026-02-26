import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Person,
  AutoAwesome,
  School,
  Work,
  Share,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { LogoMark } from "./LogoMark";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

const linkBase =
  "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition-all";
const linkInactive =
  "text-slate-700 hover:text-slate-900 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/5";
const linkActive =
  "text-slate-950 bg-slate-900/5 dark:text-white dark:bg-white/10 shadow-sm";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About", icon: Person },
  { to: "/skills", label: "Skills", icon: AutoAwesome },
  { to: "/education", label: "Education", icon: School },
  { to: "/projects", label: "Projects", icon: Work },
  { to: "/social", label: "Social", icon: Share },
] as const;

export function Navbar({ theme, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // auto close when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-white/60 dark:bg-[#0b0f19]/50 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <LogoMark />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.06 * idx }}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [linkBase, isActive ? linkActive : linkInactive].join(" ")
                    }
                    end={item.to === "/"}
                  >
                    <Icon fontSize="small" />
                    {item.label}
                  </NavLink>
                </motion.div>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-2xl
                         border border-slate-200/70 dark:border-white/10
                         bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-sm hover:shadow transition-all"
              aria-label="Open menu"
              title="Menu"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile overlay menu */}
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[9999]"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />

              {/* Panel */}
              <motion.div
                initial={{ y: -10, opacity: 0, scale: 0.98, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ y: -10, opacity: 0, scale: 0.98, filter: "blur(6px)" }}
                transition={{ duration: 0.25 }}
                className="relative mx-auto mt-3 w-[94%] max-w-md rounded-3xl
                           border border-slate-200/60 dark:border-white/10
                           bg-white/80 dark:bg-[#0b0f19]/85 backdrop-blur-xl shadow-xl p-3"
              >
                <div className="flex items-center justify-between px-2 py-2">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    Navigation
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-2xl
                               border border-slate-200/70 dark:border-white/10
                               bg-white/70 dark:bg-white/5 hover:shadow transition-all"
                    aria-label="Close menu"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </div>

                <div className="grid gap-2 p-2">
                  {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.35, delay: 0.03 * idx }}
                      >
                        <NavLink
                          to={item.to}
                          end={item.to === "/"}
                          className={({ isActive }) =>
                            [
                              "w-full",
                              "flex items-center gap-3",
                              "rounded-2xl px-4 py-3 font-extrabold",
                              "border border-slate-200/60 dark:border-white/10",
                              "bg-white/60 dark:bg-white/5",
                              "hover:shadow-sm transition-all",
                              isActive
                                ? "text-slate-950 dark:text-white ring-1 ring-slate-900/10 dark:ring-white/10"
                                : "text-slate-800 dark:text-slate-200",
                            ].join(" ")
                          }
                        >
                          <Icon fontSize="small" />
                          {item.label}
                        </NavLink>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}