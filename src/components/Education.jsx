import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import SectionHeading from './SectionHeading';
import Panel from './Panel';

const logos = [
  "/images/uth.png",
  "/images/aptech.png"
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Education = () => {
  const { t } = useLanguage();
  const educationData = t('education.items');

  return (
    <section id="education" className="relative z-10 py-32 px-4 md:px-8 w-full max-w-6xl mx-auto">
      <SectionHeading title={t('education.title')} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch"
      >
        {educationData.map((item, index) => (
          <Panel
            as={motion.article}
            key={item.school}
            variants={itemVariants}
            className="flex flex-col p-8"
          >
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 shrink-0 border border-black/15 dark:border-white/15 bg-[#fff] p-2 flex items-center justify-center">
                <img
                  src={logos[index]}
                  alt={item.school}
                  className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-mono font-bold uppercase leading-snug">
                  {item.school}
                </h3>
                <p className="mt-1 text-sm md:text-base font-semibold opacity-70">
                  {item.degree}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6 font-mono text-xs md:text-sm font-bold">
              <span className="chip">{item.timeline}</span>
              <span className="chip inline-flex items-center gap-2 !border-accent/50 !bg-accent/10 text-accent">
                <span className="w-2 h-2 bg-accent animate-pulse" />
                {item.status}
              </span>
            </div>

            <span aria-hidden className="block w-8 h-px bg-accent/70 mb-5 mt-auto" />
            <p className="leading-relaxed opacity-80">
              {item.description}
            </p>
          </Panel>
        ))}
      </motion.div>
    </section>
  );
};

export default Education;
