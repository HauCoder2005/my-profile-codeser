import "./SectionTitle.css";

function SectionTitle({ eyebrow, title, children, className = "" }) {
  return (
    <div className={`section-title ${className}`.trim()}>
      {eyebrow ? <span className="section-title__eyebrow">{eyebrow}</span> : null}
      <h2 className="section-title__heading">{title || children}</h2>
    </div>
  );
}

export default SectionTitle;
