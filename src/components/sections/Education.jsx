import SectionTitle from "../ui/SectionTitle";
import SquareCard from "../ui/SquareCard";
import "./Education.css";

const educationItems = [
  {
    institution:
      "University of Transport and Communications (UTH) - Ho Chi Minh City",
    degree: "Data Science",
    year: "2023 - Present",
    logoSlot: "uth",
  },
  {
    institution: "Aptech Computer Education - Ho Chi Minh City",
    degree: "Advanced Diploma in Software Engineering (ADSE)",
    year: "",
    logoSlot: "aptech",
  },
];

function Education() {
  return (
    <section className="education" id="education">
      <SectionTitle eyebrow="ACADEMIC BACKGROUND" title="EDUCATION" />

      <div className="education__grid">
        {educationItems.map((item) => (
          <SquareCard className="education__card" key={item.institution}>
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
              <h3 className="education__institution">{item.institution}</h3>
              <p className="education__degree">{item.degree}</p>
              {item.year ? <p className="education__year">{item.year}</p> : null}
            </div>
          </SquareCard>
        ))}
      </div>
    </section>
  );
}

export default Education;
