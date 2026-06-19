import { Download } from "lucide-react";
import SquareButton from "../ui/SquareButton";
import "./HeroAbout.css";

function HeroAbout() {
  return (
    <section className="hero-about" id="about">
      <div className="hero-about__inner">
        <div className="hero-about__content">
          <p className="hero-about__eyebrow">Software Engineer Fresher</p>
          <h1 className="hero-about__title">
            Hi, I'm Huynh Hau. Software Engineer Fresher.
          </h1>
          <p className="hero-about__intro">
            My passion for technology is driven by a deep respect for foundational
            software engineering. I am deeply inspired by Terry A. Davis&mdash;specifically
            his unparalleled dedication to building systems from the ground up and
            his uncompromising approach to programming. I apply this same rigorous
            technical discipline to modern web development, striving for clean
            architecture and performant solutions.
          </p>
          <SquareButton
            as="a"
            download="HuynhHau_CV.pdf"
            href="/images/cv.pdf"
            icon={Download}
            text="Download CV"
          />
        </div>

        <div className="hero-about__media" aria-label="Huynh Hau photo placeholder">
          {/* TODO: INSERT_USER_PHOTO_HERE - Must be a 1:1 ratio image */}
          <div className="hero-about__photo-placeholder">
            <span>
              <img src="/images/codeser.jpg" alt="Huynh Hau" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroAbout;
