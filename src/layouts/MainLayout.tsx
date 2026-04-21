import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useTheme } from "../hooks/useTheme";
import { RouteLoading } from "../components/RouteLoading";

export function MainLayout() {
  const { theme, toggle } = useTheme();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1) Loading overlay
    setLoading(true);
    const t = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  useEffect(() => {
    // 2) Scroll to top when route changes (mobile-friendly)
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="bg-ambient flex min-h-dvh flex-1 flex-col">
        <Navbar theme={theme} onToggleTheme={toggle} />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8 md:py-10">
          <Outlet />
        </main>

        <Footer />
      </div>

      <RouteLoading show={loading} />
    </div>
  );
}
