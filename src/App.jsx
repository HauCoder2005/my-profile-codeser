import Header from "./components/layouts/header/Header";
import Contact from "./components/sections/Contact";
import Education from "./components/sections/Education";
import FooterSocials from "./components/sections/FooterSocials";
import HeroAbout from "./components/sections/HeroAbout";
import Inspiration from "./components/sections/Inspiration";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main" id="top">
        <HeroAbout />
        <Skills />
        <Education />
        <Inspiration />
        <Projects />
        <Contact />
        <FooterSocials />
      </main>
    </div>
  );
}

export default App;
