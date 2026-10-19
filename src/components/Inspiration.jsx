import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import SectionHeading from './SectionHeading';
import Panel from './Panel';

const Inspiration = () => {
  const { t } = useLanguage();
  const rules = t('inspiration.rules');

  return (
    <section id="inspiration" className="relative z-10 py-32 px-4 md:px-8 w-full max-w-7xl mx-auto">
      <SectionHeading title={t('inspiration.title')} />

      <div className="flex flex-col items-center w-full">
        {/* ROOT NODE: Terry A. Davis */}
        <Panel
          as={motion.figure}
          initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-6 max-w-xl w-full"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 border border-black/20 dark:border-white/20 p-1 bg-white dark:bg-[#121212] shadow-sm">
            <img
              src="/images/terry-2.JPG"
              alt={t('inspiration.quote_by')}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
            />
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <h4 className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-tight">
              {t('inspiration.quote_by')}
            </h4>
            <p className="font-mono text-xs uppercase tracking-wider opacity-60 mt-1">
              TempleOS Creator · 64-bit Kernel &amp; Compiler
            </p>
          </div>
        </Panel>

        {/* TRUNK DOWN FROM ROOT */}
        <div className="hidden md:block w-px h-8 bg-black/20 dark:bg-white/20" />

        {/* PURE CSS 1PX TREE CONNECTOR */}
        <div className="hidden md:grid w-full max-w-5xl grid-cols-3 gap-6 h-8">
          <div className="relative h-full">
            <div className="absolute top-0 left-1/2 -right-6 h-px bg-black/20 dark:bg-white/20" />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-black/20 dark:bg-white/20" />
          </div>

          <div className="relative h-full">
            <div className="absolute top-0 left-0 -right-6 h-px bg-black/20 dark:bg-white/20" />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-black/20 dark:bg-white/20" />
          </div>

          <div className="relative h-full">
            <div className="absolute top-0 left-0 right-1/2 h-px bg-black/20 dark:bg-white/20" />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-black/20 dark:bg-white/20" />
          </div>
        </div>

        {/* Mobile Pipeline Connector */}
        <div className="block md:hidden w-px h-6 bg-black/20 dark:bg-white/20 my-2" />

        {/* 3 PHILOSOPHY LEAF CARDS */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {rules.map((rule, i) => (
            <Panel
              as={motion.blockquote}
              key={`philosophy-card-${i}`}
              initial={{ opacity: 0, y: 22, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.8, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-7 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <svg
                  className="w-5 h-5 text-accent/60 group-hover:text-accent transition-colors"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="font-mono font-bold text-sm sm:text-base leading-relaxed whitespace-pre-line opacity-90 group-hover:opacity-100 transition-opacity">
                  "{rule.text}"
                </p>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Inspiration;
