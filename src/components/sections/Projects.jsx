import { useState } from "react";
import SectionTitle from "../ui/SectionTitle";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "./ProjectDetailModal";
import "./Projects.css";

const aiTechStack = [
  "NextJS",
  "ReactJS",
  "NestJS",
  "MySQL",
  "Prisma",
  "Redis",
  "MinIO",
  "Docker",
  "Ollama (Llama 3)",
];

const aiMockInterviewMarkdown = `
# AI Mock Interview Platform - System Design Document

> AI Interview Assistant is a platform for IT students and software developers who need realistic interview practice before applying for real jobs. The system focuses on mock interviews, AI evaluation, strength and weakness detection, and an improvement roadmap that helps candidates understand what to study next.

---

## 1. Project Overview

### Core Goal

The main goal of the system is to help users evaluate their readiness for Information Technology roles. The product is designed to answer practical career questions:

- What level am I currently at?
- Am I ready to apply for the position I want?
- Which skills am I missing?
- What should I improve to pass a real interview?

### Core Product Value

The system is not only an interview practice tool. It is a readiness assessment platform that connects interview simulation, AI feedback, learning recommendations, CV improvement, job discovery, and personal progress tracking.

Users can:

- Evaluate their current technical capability.
- Understand their strongest skill areas.
- Identify weak areas that require focused study.
- Receive a suitable improvement roadmap.
- Discover jobs that match their current capability.
- Optimize their CV before applying.
- Increase the chance of passing real interview rounds.

---

## 2. Core Feature: AI Mock Interview

> This is the central feature of the entire system.

The user creates an interview session by selecting information that matches their target role and learning goal.

### Position

\`\`\`text
Backend Developer
Frontend Developer
Fullstack Developer
DevOps Engineer
QA Engineer
Data Analyst
Mobile Developer
\`\`\`

### Experience Level

\`\`\`text
Intern
Fresher
Junior
\`\`\`

### Programming Language

\`\`\`text
Java
TypeScript
JavaScript
Python
Go
C#
PHP
\`\`\`

### Framework / Technology

\`\`\`text
Spring Boot
NestJS
ExpressJS
ASP.NET
ReactJS
NextJS
VueJS
Angular
\`\`\`

### Focus Topics

\`\`\`text
Redis
Docker
JWT
Database
Microservice
System Design
\`\`\`

---

## 3. System Actors

> Actors are the objects that directly interact with the system to achieve their goals. In the MVP scope, the platform has two primary actors: Candidate and Platform Manager.

### Candidate

Candidate is the main customer of the system and the actor that creates the core product value.

#### Description

Candidate represents people preparing to enter the IT labor market and people who want to improve their application readiness before attending real interviews.

This audience often lacks interview experience, does not clearly understand personal strengths and weaknesses, and needs a tool that can assess capability before applying.

#### Target Audience

\`\`\`text
- IT students
- Final-year students
- Intern candidates
- Fresher developers
- Junior developers
- Self-taught programmers
- Career changers moving into IT
\`\`\`

#### Candidate Goals

\`\`\`text
- Evaluate job application readiness
- Practice interviews
- Improve technical skills
- Optimize CV
- Search for job opportunities
- Track personal development progress
\`\`\`

#### Candidate Main Functions

##### Account Management

\`\`\`text
- Register account
- Login
- Logout
- Manage personal profile
- Update personal information
\`\`\`

##### AI Mock Interview

\`\`\`text
- Create interview session
- Select target position
- Select experience level
- Select technology
- Select focus topics
- Perform interview
- Answer questions
- Receive AI evaluation
\`\`\`

##### Interview Report

\`\`\`text
- View overall score
- View strengths
- View weaknesses
- View improvement suggestions
- View job readiness level
\`\`\`

##### Interview History

\`\`\`text
- View interview session list
- View each interview detail
- Review asked questions
- Review submitted answers
- Review evaluation results
- Compare results between interview attempts
\`\`\`

##### Progress Tracking

\`\`\`text
- Track score over time
- Track improved skills
- Track weak skills
- View topics that require more study
- Receive learning roadmap suggestions
\`\`\`

##### CV Review

\`\`\`text
- Upload CV
- Receive AI evaluation
- View CV score
- View CV strengths
- View CV weaknesses
- Receive improvement suggestions
- View CV review history
\`\`\`

##### CV Builder

\`\`\`text
- Select CV template
- Create new CV
- Edit CV
- Save CV
- Manage CV
- Export PDF
\`\`\`

##### Job Discovery

\`\`\`text
- View newest jobs
- Search jobs
- Filter jobs
- View job detail
- Save interesting jobs
\`\`\`

### Platform Manager

Platform Manager is responsible for operating and managing the whole platform.

#### Description

Platform Manager manages the system, data, and service quality. In the MVP stage, the Platform Manager is also the founder/operator of the product.

#### Platform Manager Goals

\`\`\`text
- Ensure stable system operation
- Manage platform data
- Manage system content
- Track product usage
- Improve user experience
\`\`\`

#### Platform Manager Main Functions

##### Candidate Management

\`\`\`text
- View candidate list
- View candidate information
- Activate account
- Disable account
- Track user activity
\`\`\`

##### CV Template Management

\`\`\`text
- Create CV template
- Edit CV template
- Delete CV template
- Manage template library
\`\`\`

##### Job Source Management

\`\`\`text
- Manage job data sources
- Track recruitment data
- Check job data quality
\`\`\`

##### Analytics & Monitoring

\`\`\`text
- View user statistics
- View interview statistics
- View CV Review statistics
- View job statistics
- Track system performance
- Monitor platform activity
\`\`\`

---

## 4. Core Business Flow

\`\`\`text
User
  ↓
Select Position
  ↓
Select Experience
  ↓
Select Technology
  ↓
Start Interview
  ↓
AI Generate Questions
  ↓
User Answers
  ↓
AI Evaluation
  ↓
Generate Report
  ↓
Show Strengths
  ↓
Show Weaknesses
  ↓
Show Improvement Plan
\`\`\`

### Flow Interpretation

1. The user starts from a career target.
2. The system narrows the interview context through position, experience, and technology choices.
3. AI generates questions that match the configured context.
4. The candidate submits answers.
5. AI evaluates each answer and generates a report.
6. The report exposes strengths, weaknesses, and a practical improvement plan.

---

## 5. Functional Requirements

> Functional requirements describe the functions the system must provide to support Candidates in job preparation and career development.

### FR-01 Authentication & Account Management

The system must allow Candidate users to manage personal accounts.

#### Functions

\`\`\`text
- Register account
- Login
- Logout
- Manage personal profile
- Update personal information
\`\`\`

### FR-02 AI Mock Interview

> This is the core function of the whole system.

The system must allow Candidate users to create and perform mock interview sessions.

#### Interview Session Setup

\`\`\`text
- Select target position
- Select experience level
- Select programming language
- Select framework or technology
- Select focus topics (Redis, Docker, Database...)
\`\`\`

#### Question Generation

\`\`\`text
- AI automatically generates interview questions
- Questions match the target position
- Questions match the candidate's experience level
- Questions match the selected technology
\`\`\`

#### Answer Format

\`\`\`text
1. Text Answer

- Candidate enters text answers

2. Voice Answer

- Candidate answers by voice
- System converts speech to text
- AI evaluates the answer content
\`\`\`

#### Coding Question

\`\`\`text
- Support programming questions
- Provide source-code input area
- Allow multi-line code input
- Support code formatting display
\`\`\`

#### AI Evaluation

\`\`\`text
- Score answers
- Evaluate technical knowledge
- Evaluate problem-solving thinking
- Evaluate communication ability
- Analyze strengths
- Analyze weaknesses
- Suggest content to improve
\`\`\`

### FR-03 Interview Report

After the interview ends, the system must create a detailed evaluation report.

#### Report Content

\`\`\`text
- Overall score
- Score by topic
- Strengths
- Weaknesses
- Content to improve
- Learning roadmap suggestions
- Job application readiness evaluation
\`\`\`

### FR-04 Interview History & Progress Tracking

The system must store learning history so Candidate users can track progress.

#### Functions

\`\`\`text
- Save interview history
- Review asked questions
- Review submitted answers
- Review evaluation reports
- Compare results between interview attempts
- Track score changes over time
- Track improved skills
- Track weak skills
\`\`\`

### FR-05 Job Discovery

The system must help Candidate users access the newest job opportunities.

#### Job Collection and Classification

\`\`\`text
- Collect jobs from recruitment sources
- Update jobs from the latest 7 days
- Classify jobs by position
- Classify jobs by technology
- Classify jobs by experience
- Classify jobs by location
\`\`\`

#### Search

\`\`\`text
- Search jobs
- Filter jobs by position
- Filter jobs by technology
- Filter jobs by level
- Filter jobs by area
\`\`\`

#### Job Management

\`\`\`text
- View job detail
- Save interesting jobs
- View saved jobs
\`\`\`

### FR-06 AI CV Review

The system must use AI to evaluate CV quality.

#### Functions

\`\`\`text
- Upload CV
- Read CV content
- Analyze CV content
- Score CV
- Analyze strengths
- Analyze weaknesses
- Suggest content to improve
- Suggest ATS Keywords
\`\`\`

#### Result

\`\`\`text
- CV Score
- Strengths
- Weaknesses
- Improvement Suggestions
\`\`\`

---

## 6. Business Rules and Quality Constraints

### Interview Rules

\`\`\`text
- Each Interview must belong to exactly one Position.
- Each Interview must belong to exactly one Experience Level.
- Each Interview must have at least one selected Technology.
- Candidate can choose multiple Focus Topics.
- Interview can only start after configuration is completed.
- Each Interview must be attached to exactly one Candidate.
\`\`\`

### Question Generation Rules

\`\`\`text
- AI must generate questions based on selected Position.
- AI must generate questions based on Experience Level.
- AI must prioritize technologies selected by Candidate.
- AI must prioritize selected Focus Topics.
- Question difficulty must match Experience Level.
- Question sets must be diverse and avoid excessive duplication.
\`\`\`

### Answer Evaluation Rules

\`\`\`text
- Each answer must be evaluated independently.
- AI must provide a score for each question.
- AI must explain the reason for each score.
- AI must identify knowledge mistakes when present.
- AI must suggest content to improve.
- AI must not return only a score without feedback.
\`\`\`

### Non-Functional Requirements

\`\`\`text
- Interface must be intuitive and easy to use.
- Candidate can create Interview without needing guidance.
- Questions must match position, level, and selected technology.
- AI feedback must provide score, reason, strengths, weaknesses, and specific improvement guidance.
- Interview history and CV Review history must be saved.
- Candidate data, CV data, and interview history must be protected.
- Reports and generated CVs must be available for long-term access.
\`\`\`
`;

const projects = [
  {
    id: "ai-mock-interview",
    name: "AI Mock Interview",
    description:
      "An AI-powered readiness platform for practicing role-based interviews, analyzing answers, and generating improvement plans.",
    architecture:
      "Built as a modular interview pipeline covering setup, AI question generation, answer capture, evaluation, reports, history, CV support, and job discovery.",
    stack: aiTechStack,
    githubUrl: "https://github.com/huynhhau/ai-mock-interview",
    hasDetail: true,
  },
  {
    id: "cinema-booking",
    name: "Cinema Booking",
    description:
      "A comprehensive and scalable movie ticket management system designed for large enterprise businesses with multiple locations.",
    architecture:
      "Designed with modular service boundaries for branches, screens, showtimes, seat inventory, reservations, payments, and administrative workflows so the system can scale across locations without coupling operational domains.",
    stack: ["Java", "Next.js", "MySQL", "Docker"],
    githubUrl: "https://github.com/HauCoder2005/cinema-booking-projects",
  },
];

function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  const isAiModalOpen = activeProject === "ai-mock-interview";

  return (
    <section className="projects" id="projects">
      <SectionTitle eyebrow="Selected Work" title="Projects" />

      <div className="projects__grid">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            index={index}
            project={project}
            onViewDetails={() => setActiveProject(project.id)}
          />
        ))}
      </div>

      <ProjectDetailModal
        open={isAiModalOpen}
        title="AI Mock Interview - Technical Deep Dive"
        techStack={aiTechStack}
        markdown={aiMockInterviewMarkdown}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}

export default Projects;
