import React from "react";
import Navbar from "./components/Navbar";
import SpaceBackground from "./components/SpaceBackground";
import Hero from "./components/Hero";
import LanguageDial from "./components/LanguageDial";
import Inspiration from "./components/Inspiration";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen overflow-x-clip w-full bg-transparent font-sans">
        <SpaceBackground />
        
        <div className="relative z-10 bg-transparent">
          <Navbar />
          
          <main className="w-full flex flex-col bg-transparent">
            <Hero />
            <LanguageDial />
            <Inspiration />
            <Education />
            <Skills />
            <Projects />
            <Contact />
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
