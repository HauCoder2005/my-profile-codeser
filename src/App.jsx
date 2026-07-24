import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import SpaceBackground from "./components/SpaceBackground";
import Hero from "./components/Hero";
import Inspiration from "./components/Inspiration";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import "./App.css";

function App() {
  // Ensure default dark mode on mount
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('light')) {
      root.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden w-full bg-transparent text-black dark:text-white transition-colors duration-300 font-sans">
      <SpaceBackground />
      
      <div className="relative z-10 bg-transparent">
        <Navbar />
        
        <main className="w-full flex flex-col bg-transparent">
          <Hero />
          <Inspiration />
          <Education />
          <Skills />
          <Projects />
          <Contact />
        </main>
      </div>
    </div>
  );
}

export default App;
