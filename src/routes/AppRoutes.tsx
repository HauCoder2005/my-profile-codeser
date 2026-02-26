import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { PageLoader } from "../components/PageLoader";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Skills = lazy(() => import("../pages/Skills"));
const Education = lazy(() => import("../pages/Education"));
const Projects = lazy(() => import("../pages/Projects"));
const MobileRepos = lazy(() => import("../pages/MobileRepos"));
const Social = lazy(() => import("../pages/Social"));
const NotFound = lazy(() => import("../pages/NotFound"));

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/education" element={<Education />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/social" element={<Social />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
