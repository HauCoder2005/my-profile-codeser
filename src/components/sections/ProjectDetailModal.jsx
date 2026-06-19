import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SquareModal from "../ui/SquareModal";
import "./ProjectDetailModal.css";

const markdownComponents = {
  h1({ children }) {
    return <h1 className="project-markdown__h1">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="project-markdown__h2">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="project-markdown__h3">{children}</h3>;
  },
  h4({ children }) {
    return <h4 className="project-markdown__h4">{children}</h4>;
  },
  p({ children }) {
    return <p className="project-markdown__p">{children}</p>;
  },
  ul({ children }) {
    return <ul className="project-markdown__ul">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="project-markdown__ol">{children}</ol>;
  },
  li({ children }) {
    return <li className="project-markdown__li">{children}</li>;
  },
  blockquote({ children }) {
    return <blockquote className="project-markdown__blockquote">{children}</blockquote>;
  },
  pre({ children }) {
    return <pre className="project-markdown__pre">{children}</pre>;
  },
  code({ children, className }) {
    return (
      <code className={`project-markdown__code ${className || ""}`.trim()}>
        {children}
      </code>
    );
  },
  table({ children }) {
    return (
      <div className="project-markdown__table-wrap">
        <table className="project-markdown__table">{children}</table>
      </div>
    );
  },
  th({ children }) {
    return <th className="project-markdown__th">{children}</th>;
  },
  td({ children }) {
    return <td className="project-markdown__td">{children}</td>;
  },
  a({ children, href }) {
    return (
      <a className="project-markdown__link" href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    );
  },
  hr() {
    return <hr className="project-markdown__hr" />;
  },
};

function ProjectDetailModal({ open, title, techStack, markdown, onClose }) {
  return (
    <SquareModal open={open} title={title} onClose={onClose}>
      <div className="project-detail-modal">
        <section className="project-detail-modal__stack" aria-label="Project technology stack">
          {techStack.map((item) => (
            <span className="project-detail-modal__badge" key={item}>
              {item}
            </span>
          ))}
        </section>

        <div className="project-markdown">
          <ReactMarkdown
            components={markdownComponents}
            remarkPlugins={[remarkGfm]}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </SquareModal>
  );
}

export default ProjectDetailModal;
