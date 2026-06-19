import SectionTitle from "../ui/SectionTitle";
import SquareCard from "../ui/SquareCard";
import "./Skills.css";

const TechIcons = {
  NestJS: () => (
    <svg viewBox="0 0 64 64" role="img" aria-label="NestJS logo">
      <path fill="#E0234E" d="M32 4 8 18v28l24 14 24-14V18L32 4Z" />
      <path
        fill="#FBF9F1"
        d="M22 43V21h7.2l8.9 13.3V21H45v22h-7.1L29 29.8V43h-7Z"
      />
    </svg>
  ),
  "Java (Spring Tools Suite)": () => (
    <svg viewBox="0 0 64 64" role="img" aria-label="Java Spring Tools Suite logo">
      <path
        fill="#6DB33F"
        d="M50.7 16.2c-8.9-3.4-20.8-1.9-28.5 5.8-8.8 8.8-8.9 22.8-.3 31.2 8.2-1.7 17.3-6 23.7-12.5 6.8-6.8 9.8-16.1 5.1-24.5Z"
      />
      <path
        fill="#FBF9F1"
        d="M19.7 45.5c12.6-1.6 23.6-10.2 29.7-23.4-4.4 15.4-15.5 26.8-29.7 30.6v-7.2Z"
      />
      <path
        fill="#2D2D2D"
        d="M17.5 14.4c4.3 2.9 7.9 6.2 7.2 10.4-.5 3.2-4 5.5-5.4 8.6-1.3 2.8.1 5.4 3.7 7.9-6.9-1.8-10.5-5.9-9-10.6 1.1-3.6 5.1-5.7 5.8-8.8.6-2.6-1.1-5-2.3-7.5Z"
      />
    </svg>
  ),
  NodeJS: () => (
    <svg viewBox="0 0 64 64" role="img" aria-label="NodeJS logo">
      <path fill="#83CD29" d="M32 4 8.4 17.6v28.8L32 60l23.6-13.6V17.6L32 4Z" />
      <path
        fill="#2D2D2D"
        d="M27.1 43.4c0 2.5-1.7 4.4-4.7 4.4-2.3 0-4-1-5.3-2.8l3-2.3c.6.9 1.2 1.4 2.1 1.4.8 0 1.3-.5 1.3-1.5V25.2h3.6v18.2Zm10.8 4.4c-3.2 0-5.7-1.4-7.3-3.5l3-2.3c1.1 1.4 2.4 2.1 4.2 2.1 1.6 0 2.6-.7 2.6-1.8 0-1.3-1.1-1.7-3.8-2.5-3.2-1-5.3-2.3-5.3-5.8 0-3.2 2.6-5.4 6.3-5.4 2.7 0 4.8 1 6.2 2.8l-2.8 2.4c-.9-1.1-2-1.6-3.4-1.6-1.5 0-2.4.7-2.4 1.7 0 1.2.9 1.6 3.5 2.4 3.5 1 5.6 2.4 5.6 5.8 0 3.4-2.6 5.7-6.4 5.7Z"
      />
    </svg>
  ),
  ReactJS: () => (
    <svg viewBox="0 0 64 64" role="img" aria-label="ReactJS logo">
      <circle cx="32" cy="32" r="5.5" fill="#61DAFB" />
      <g fill="none" stroke="#61DAFB" strokeWidth="3">
        <ellipse cx="32" cy="32" rx="25" ry="9" />
        <ellipse cx="32" cy="32" rx="25" ry="9" transform="rotate(60 32 32)" />
        <ellipse cx="32" cy="32" rx="25" ry="9" transform="rotate(120 32 32)" />
      </g>
    </svg>
  ),
  NextJS: () => (
    <svg viewBox="0 0 64 64" role="img" aria-label="NextJS logo">
      <circle cx="32" cy="32" r="28" fill="#2D2D2D" />
      <path fill="#FBF9F1" d="M20 45V19h6.1l17.8 26h-6.2L25.9 27.9V45H20Z" />
      <path stroke="#FBF9F1" strokeLinecap="square" strokeWidth="4" d="M44 19v26" />
    </svg>
  ),
  Docker: () => (
    <svg viewBox="0 0 64 64" role="img" aria-label="Docker logo">
      <path
        fill="#2496ED"
        d="M58 32.2c-1.8-1.2-4.2-1.5-6.5-.9-.5-3.8-3.1-7-6.9-8.7l-1.5 2.8c2.2 1.2 3.8 2.8 4.6 5.1-1.4.8-2.7 1.9-3.7 3.2H6.5c.6 10.8 8.3 17.4 18.9 17.4h8.7c10.1 0 17.7-4.6 21.5-14.1 2.5-.2 4.6-1.4 6-3.3-1-.4-2.1-.8-3.6-1.5Z"
      />
      <path fill="#FBF9F1" d="M15 21h6v6h-6v-6Zm7.5 0h6v6h-6v-6Zm7.5 0h6v6h-6v-6Zm-15 7.5h6v6h-6v-6Zm7.5 0h6v6h-6v-6Zm7.5 0h6v6h-6v-6Zm7.5 0h6v6h-6v-6Z" />
    </svg>
  ),
  Git: () => (
    <svg viewBox="0 0 64 64" role="img" aria-label="Git logo">
      <path
        fill="#F05032"
        d="M59.2 29.2 34.8 4.8a4 4 0 0 0-5.6 0L24.1 10l6.4 6.4a4.7 4.7 0 0 1 5.8 5.9l6.1 6.1a4.7 4.7 0 1 1-2.8 2.9l-5.7-5.8v15a4.7 4.7 0 1 1-3.8-.1V25.2a4.7 4.7 0 0 1-2.5-6.1l-6.3-6.3L4.8 29.2a4 4 0 0 0 0 5.6l24.4 24.4a4 4 0 0 0 5.6 0l24.4-24.4a4 4 0 0 0 0-5.6Z"
      />
    </svg>
  ),
};

const skillGroups = [
  {
    title: "Main Backend",
    items: ["NestJS", "Java (Spring Tools Suite)", "NodeJS"],
  },
  {
    title: "Main Frontend",
    items: ["ReactJS", "NextJS"],
  },
  {
    title: "Tools",
    items: ["Docker", "Git"],
  },
];

function Skills() {
  return (
    <section className="skills" id="skill">
      <SectionTitle eyebrow="Technologies" title="Core Skills" />

      <div className="skills__grid">
        {skillGroups.map((group) => (
          <SquareCard className="skills__card" key={group.title}>
            <h3 className="skills__card-title">{group.title}</h3>
            <div className="skills__list">
              {group.items.map((item) => {
                const Icon = TechIcons[item];

                return (
                  <div className="skills__item" key={item}>
                    <span className="skills__logo">
                      <Icon />
                    </span>
                    <span className="skills__name">{item}</span>
                  </div>
                );
              })}
            </div>
          </SquareCard>
        ))}
      </div>
    </section>
  );
}

export default Skills;
