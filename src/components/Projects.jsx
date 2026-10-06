import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { FaGithub as Github } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { projectMeta } from '../config/site';
import SectionHeading from './SectionHeading';
import Panel from './Panel';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const linkClass = 'inline-flex items-center gap-2 px-4 py-2 border border-black dark:border-white font-mono text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300';

const Projects = () => {
  const { t } = useLanguage();
  const projects = t('projects.items');

  return (
    <section id="projects" className="relative z-10 py-32 px-4 md:px-8 w-full max-w-7xl mx-auto">
      <SectionHeading title={t('projects.title')} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-10"
      >
        {projects.map((project, idx) => {
          const meta = projectMeta[idx];
          return (
            <Panel
              as={motion.article}
              key={project.title}
              variants={itemVariants}
              className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-12"
            >
              {/* Index */}
              <span className="font-mono text-5xl md:text-7xl font-bold leading-none opacity-20 group-hover:opacity-100 group-hover:text-accent transition-all duration-300">
                {String(idx + 1).padStart(2, '0')}
              </span>

              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-mono font-bold uppercase">
                  {project.title}
                </h3>

                <p className="text-base md:text-lg leading-relaxed opacity-80 max-w-3xl">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {meta.techs.map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                    </span>
                  ))}
                </div>

                {(meta.github || meta.demo) && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {meta.github && (
                      <a href={meta.github} target="_blank" rel="noreferrer" className={linkClass}>
                        <Github size={16} />
                        {t('projects.source')}
                      </a>
                    )}
                    {meta.demo && (
                      <a href={meta.demo} target="_blank" rel="noreferrer" className={linkClass}>
                        {t('projects.demo')}
                        <ArrowUpRight size={16} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Panel>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Projects;
