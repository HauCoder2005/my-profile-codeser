import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, CheckCircle2, ChevronRight, Compass, Cpu, FileText, Layers, X } from 'lucide-react';
import { FaGithub as Github } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { projectMeta } from '../config/site';
import SectionHeading from './SectionHeading';
import Panel from './Panel';

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const linkClass = 'inline-flex items-center gap-2 px-4 py-2 border border-black dark:border-white font-mono text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300';

const LiveServerMockup = ({ image, title, url, isLive = false, className = '' }) => {
  if (!image) return null;
  return (
    <div className={`overflow-hidden border border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.03] shadow-lg group/mockup ${className}`}>
      {/* Browser Header */}
      <div className="px-3.5 py-2 border-b border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] flex items-center justify-between gap-3 text-xs font-mono select-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-accent/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-black/20 dark:bg-white/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-black/20 dark:bg-white/20" />
        </div>
        <div className="flex-1 min-w-0 max-w-xs px-2.5 py-0.5 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/70 text-[11px] truncate text-center opacity-75 font-mono">
          {url ? url.replace(/^https?:\/\//, '') : 'localhost:3000'}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-accent shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>{isLive ? 'LIVE' : 'DEMO'}</span>
        </div>
      </div>
      {/* Preview Viewport */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-top group-hover/mockup:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
      </div>
    </div>
  );
};

const Projects = () => {
  const { t } = useLanguage();
  const projects = t('projects.items');
  const [selectedIdx, setSelectedIdx] = useState(null);

  const selectedProject = selectedIdx !== null ? projects[selectedIdx] : null;
  const selectedMeta = selectedIdx !== null ? projectMeta[selectedIdx] : null;

  // Lock body scroll and handle Escape key while modal is open
  useEffect(() => {
    if (selectedIdx === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedIdx(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIdx]);

  return (
    <section id="projects" className="relative z-10 py-32 px-4 md:px-8 w-full max-w-7xl mx-auto">
      <SectionHeading title={t('projects.title')} />

      <div className="grid grid-cols-1 gap-10">
        {projects.map((project, idx) => {
          const meta = projectMeta[idx];
          return (
            <Panel
              as={motion.article}
              key={`project-card-${idx}`}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              onClick={() => setSelectedIdx(idx)}
              className="p-6 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center cursor-pointer transition-all duration-300 hover:border-accent/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(255,106,43,0.12)] group"
            >
              {/* Text Info */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-2xl md:text-3xl font-mono font-bold uppercase group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-accent border border-accent/40 bg-accent/10 px-3 py-1 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    {t('projects.view_details') || 'Xem chi tiết'}
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>

                <p className="text-base md:text-lg leading-relaxed opacity-80 max-w-2xl">
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
                      <a
                        href={meta.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={linkClass}
                      >
                        <Github size={16} />
                        {t('projects.source')}
                      </a>
                    )}
                    {meta.demo && (
                      <a
                        href={meta.demo}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={linkClass}
                      >
                        {t('projects.demo')}
                        <ArrowUpRight size={16} />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Live Server Preview Mockup */}
              {meta.image && (
                <div className="w-full">
                  <LiveServerMockup
                    image={meta.image}
                    title={project.title}
                    url={meta.demo || meta.github}
                    isLive={Boolean(meta.demo)}
                  />
                </div>
              )}
            </Panel>
          );
        })}
      </div>

      {/* Center Detail Modal */}
      <AnimatePresence>
        {selectedProject && selectedMeta && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedIdx(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto bg-[#faf8f4] dark:bg-[#0e0e0e] text-black dark:text-white border border-black/15 dark:border-white/15 shadow-2xl p-6 sm:p-10 flex flex-col gap-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedIdx(null)}
                aria-label={t('projects.close') || 'Close'}
                className="absolute top-5 right-5 p-2.5 border border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="space-y-2 pr-12">
                <h2 className="text-3xl sm:text-4xl font-mono font-bold uppercase tracking-tight">
                  {selectedProject.title}
                </h2>
                {selectedProject.details?.tagline && (
                  <p className="font-mono text-sm sm:text-base text-accent font-semibold">
                    {selectedProject.details.tagline}
                  </p>
                )}
                {selectedProject.details?.subtags && (
                  <p className="font-mono text-xs opacity-60 tracking-wider uppercase">
                    {selectedProject.details.subtags}
                  </p>
                )}
              </div>

              {/* Live Server Mockup in Modal */}
              {selectedMeta.image && (
                <LiveServerMockup
                  image={selectedMeta.image}
                  title={selectedProject.title}
                  url={selectedMeta.demo || selectedMeta.github}
                  isLive={Boolean(selectedMeta.demo)}
                />
              )}

              {/* Divider */}
              <div className="w-full h-px bg-black/15 dark:bg-white/15" />

              {/* Overview */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-widest text-accent font-bold flex items-center gap-2">
                  <Layers size={16} />
                  {t('projects.modal_overview') || 'TỔNG QUAN'}
                </h4>
                <p className="text-base sm:text-lg leading-relaxed opacity-90 whitespace-pre-line text-justify">
                  {selectedProject.details?.overview || selectedProject.description}
                </p>
              </div>

              {/* Business Problem & Vision */}
              {selectedProject.details?.vision && (
                <div className="space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-accent font-bold flex items-center gap-2">
                    <Compass size={16} />
                    {t('projects.modal_vision') || 'BÀI TOÁN & TẦM NHÌN'}
                  </h4>
                  <p className="text-sm sm:text-base leading-relaxed opacity-85 whitespace-pre-line text-justify">
                    {selectedProject.details.vision}
                  </p>
                </div>
              )}

              {/* Key Highlights */}
              {selectedProject.details?.highlights?.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-accent font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    {t('projects.modal_highlights') || 'ĐIỂM NỔI BẬT'}
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedProject.details.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed opacity-85">
                        <span className="text-accent font-mono font-bold mt-0.5 select-none">&gt;</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical Architecture */}
              {selectedProject.details?.architecture && (
                <div className="space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-accent font-bold flex items-center gap-2">
                    <Cpu size={16} />
                    {t('projects.modal_architecture') || 'KIẾN TRÚC KỸ THUẬT'}
                  </h4>
                  <div className="p-4 sm:p-5 border border-black/15 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.03] text-sm sm:text-base leading-relaxed opacity-90 font-mono whitespace-pre-line">
                    {selectedProject.details.architecture}
                  </div>
                </div>
              )}

              {/* Tech Stack Chips */}
              <div className="space-y-3">
                <span className="font-mono text-xs uppercase tracking-widest opacity-60 block">
                  TECH STACK
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedMeta.techs.map((tech) => (
                    <span key={tech} className="chip !border-black/30 dark:!border-white/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-black/15 dark:border-white/15 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  {selectedMeta.github && (
                    <a
                      href={selectedMeta.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white dark:bg-white dark:text-black font-mono text-sm font-bold uppercase tracking-wider hover:bg-accent hover:border-accent hover:text-white dark:hover:bg-accent dark:hover:text-white transition-colors duration-300"
                    >
                      <Github size={18} />
                      {t('projects.source')}
                    </a>
                  )}
                  {selectedMeta.demo && (
                    <a
                      href={selectedMeta.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 border border-black/30 dark:border-white/30 font-mono text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
                    >
                      {t('projects.demo')}
                      <ArrowUpRight size={18} />
                    </a>
                  )}
                  {selectedProject.details?.architectureUrl && (
                    <a
                      href={selectedProject.details.architectureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 border border-accent/40 bg-accent/5 text-accent font-mono text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-accent hover:text-white transition-colors duration-300"
                    >
                      <FileText size={16} />
                      {t('projects.view_architecture') || 'Bản vẽ kiến trúc (PDF)'}
                    </a>
                  )}
                  {selectedProject.details?.docsUrl && (
                    <a
                      href={selectedProject.details.docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 border border-black/30 dark:border-white/30 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
                    >
                      <BookOpen size={16} />
                      {t('projects.view_docs') || 'Tài liệu (Docs)'}
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedIdx(null)}
                  className="font-mono text-sm uppercase tracking-wider opacity-70 hover:opacity-100 hover:text-accent transition-colors"
                >
                  [ {t('projects.close') || 'Đóng'} ]
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
