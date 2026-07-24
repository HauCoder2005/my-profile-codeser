import SectionTitle from "../ui/SectionTitle";
import SquareCard from "../ui/SquareCard";
import "./Education.css";

const educationData = [
  {
    school: "UNIVERSITY OF TRANSPORT HO CHI MINH CITY (UTH)",
    degree: "Data Science",
    timeline: "2023 - Late 2026",
    status: "Expected Graduation",
    description: "Focusing on data structures, algorithms, machine learning, and deep software engineering principles.",
    logoSlot: "uth",
  },
  {
    school: "APTECH COMPUTER EDUCATION",
    degree: "Advanced Diploma in Software Engineering",
    timeline: "2023 - 2026",
    status: "Graduated",
    description: "Completed rigorous practical coursework in full-stack development, database architecture, and enterprise solutions.",
    logoSlot: "aptech",
  },
];

function Education() {
  return (
    <section className="education" id="education">
      <SectionTitle eyebrow="ACADEMIC BACKGROUND" title="EDUCATION" />

      <div className="education__grid">
        {educationData.map((item) => (
          <SquareCard className="education__card" key={item.school}>
            <div className="education__logo-wrap">
              {item.logoSlot === "uth" ? (
                <>
                  {/* TODO: INSERT_UTH_LOGO_HERE */}
                  <img
                    className="education__logo"
                    src="/images/uth.png"
                    alt="University of Transport and Communications logo"
                  />
                </>
              ) : (
                <>
                  {/* TODO: INSERT_APTECH_LOGO_HERE */}
                  <img
                    className="education__logo"
                    src="/images/aptech.png"
                    alt="Aptech Education logo"
                  />
                </>
              )}
            </div>

            <div className="education__content">
              <h3 className="education__institution">{item.school}</h3>
              <p className="education__degree">{item.degree}</p>
              
              <div className="education__meta">
                <span className="education__timeline">{item.timeline}</span>
                <span className="education__dot">•</span>
                <span className="education__status">{item.status}</span>
              </div>

              <p className="education__description">{item.description}</p>
            </div>
          </SquareCard>
        ))}
      </div>
    </section>
  );
}

export default Education;
