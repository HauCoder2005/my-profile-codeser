import { Code, ExternalLink } from "lucide-react";
import SquareCard from "../ui/SquareCard";
import "./ProjectCard.css";

function ProjectCard({ project, index, onViewDetails }) {
  return (
    <SquareCard as="article" className="project-card">
      <div className="project-card__header">
        <span className="project-card__index">0{index + 1}</span>
        <h3 className="project-card__name">{project.name}</h3>
      </div>

      <p className="project-card__description">{project.description}</p>
      <p className="project-card__architecture">{project.architecture}</p>

      <ul className="project-card__stack" aria-label={`${project.name} technology stack`}>
        {project.stack.map((item) => (
          <li className="project-card__stack-item" key={item}>
            {item}
          </li>
        ))}
      </ul>

      <div className="project-card__actions">
        {project.hasDetail ? (
          <button className="project-card__action" type="button" onClick={onViewDetails}>
            <span>View Details</span>
          </button>
        ) : null}

        {project.githubUrl ? (
          <a
            aria-label={`Open ${project.name} source code on GitHub`}
            className="project-card__action project-card__action--icon"
            href="https://github.com/HauCoder2005/ai-mocks-interview-projects"
            rel="noreferrer"
            target="_blank"
          >
            <Code size={17} strokeWidth={2} />
            <span>GitHub</span>
            <ExternalLink size={14} strokeWidth={2} />
          </a>
        ) : null}
      </div>
    </SquareCard>
  );
}

export default ProjectCard;
