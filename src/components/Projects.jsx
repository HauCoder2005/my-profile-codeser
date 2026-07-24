import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: "AI MOCK INTERVIEW",
      description: "AI-powered platform for technical interviews, CV reviews, and feedback. Used Whisper (Voice-to-Text), Qwen 2.5, and Ollama to support role-based mock interviews.",
      tech: ["Next.js", "NestJS", "Docker", "Redis", "MinIO"]
    },
    {
      title: "CINEMA BOOKING",
      description: "Scalable movie ticket booking system with multi-branch management and online payment. Designed a 25+ table relational database and core business logic.",
      tech: ["Java 21", "Spring Boot", "Next.js", "MySQL"]
    },
    {
      title: "SHOPPING NOW (GIAO)",
      description: "E-commerce marketplace system designed for regional same-day delivery operations with specialized media processing pipelines.",
      tech: ["React.js", "Node.js", "Media Pipeline", "Logistics"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="projects" className="relative z-10 py-32 px-8 w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-mono font-bold uppercase border-b-4 border-black dark:border-white inline-block pb-2">
          Projects
        </h2>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-12"
      >
        {projects.map((project, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="border-2 border-black dark:border-white bg-white dark:bg-black p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transition-all duration-300"
          >
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl font-mono font-bold uppercase">
                {project.title}
              </h3>
              
              <p className="text-lg font-sans leading-relaxed opacity-90 max-w-3xl">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {project.tech.map((tech, tIdx) => (
                  <span 
                    key={tIdx} 
                    className="px-3 py-1 text-sm font-mono font-bold uppercase border-2 border-black dark:border-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-4 mt-6 md:mt-0">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
                aria-label="GitHub Repository"
              >
                <Github size={24} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
                aria-label="External Link"
              >
                <ExternalLink size={24} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Projects;
