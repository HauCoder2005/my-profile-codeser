import SectionTitle from "../ui/SectionTitle";
import "./Inspiration.css";

const quotes = [
  {
    id: "simplicity",
    label: "RULE 01",
    text: "An idiot admires complexity, a genius admires simplicity.",
  },
  {
    id: "control",
    label: "RULE 02",
    text: "You can see the code. It is not a black box. You have absolute control.",
  },
  {
    id: "scratch",
    label: "RULE 03",
    text: "I built a compiler, an assembler, and a kernel from scratch.",
  },
];

function Inspiration() {
  return (
    <section className="inspiration" id="inspiration">
      <SectionTitle eyebrow="Technical Philosophy" title="INSPIRATION" />

      <div className="inspiration__diagram" aria-label="Terry A. Davis inspiration mind map">
        <svg
          aria-hidden="true"
          className="inspiration__connections"
          preserveAspectRatio="none"
          viewBox="0 0 960 600"
        >
          <path d="M 405 300 L 270 300 L 270 145 L 190 145" />
          <path d="M 555 300 L 690 300 L 690 145 L 770 145" />
          <path d="M 480 375 L 480 470 L 480 470" />
        </svg>

        <article className="inspiration__quote inspiration__quote--top-left">
          <span>{quotes[0].label}</span>
          <p>"{quotes[0].text}"</p>
        </article>

        <article className="inspiration__quote inspiration__quote--top-right">
          <span>{quotes[1].label}</span>
          <p>"{quotes[1].text}"</p>
        </article>

        <div className="inspiration__portrait-wrap" aria-label="Terry A. Davis photo">
          {/* TODO: INSERT_TERRY_DAVIS_PHOTO_HERE */}
          <img
            className="inspiration__portrait"
            src="/images/terry-2.JPG"
            alt="Terry A. Davis"
          />
        </div>

        <article className="inspiration__quote inspiration__quote--bottom">
          <span>{quotes[2].label}</span>
          <p>"{quotes[2].text}"</p>
        </article>
      </div>
    </section>
  );
}

export default Inspiration;
