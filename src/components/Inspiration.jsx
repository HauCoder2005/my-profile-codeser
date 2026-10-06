import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import SectionHeading from './SectionHeading';
import Panel from './Panel';

const Inspiration = () => {
  const { t } = useLanguage();
  const rules = t('inspiration.rules');

  return (
    <section id="inspiration" className="relative z-10 py-32 px-4 md:px-8 w-full max-w-6xl mx-auto">
      <SectionHeading title={t('inspiration.title')} align="center" />

      <div className="flex flex-col items-center">
        {/* Portrait */}
        <motion.figure
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Panel className="p-2">
            <img
              src="/images/terry-2.JPG"
              alt={t('inspiration.quote_by')}
              className="w-40 h-40 md:w-48 md:h-48 object-cover grayscale"
            />
          </Panel>
          <figcaption className="mt-4 font-mono text-xs tracking-[0.3em] uppercase opacity-70">
            {t('inspiration.quote_by')}
          </figcaption>
        </motion.figure>

        {/* Connector: stem + branch (desktop) */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-[2px] h-12 bg-black dark:bg-white origin-top mt-6"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="hidden md:block w-[calc(66.666%+1.333rem)] h-[2px] bg-black dark:bg-white"
        />

        {/* Rules */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {rules.map((rule, i) => (
            <div key={rule.label} className="flex flex-col items-center">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="hidden md:block w-[2px] h-10 bg-black dark:bg-white origin-top"
              />
              <Panel
                as={motion.blockquote}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.9 + i * 0.15 }}
                className="w-full h-full p-8 text-center"
              >
                <span className="block font-mono text-xs tracking-[0.3em] uppercase text-accent">
                  {rule.label}
                </span>
                <span aria-hidden className="block w-8 h-px bg-accent/70 mx-auto my-4" />
                <p className="font-mono font-bold text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {rule.text}
                </p>
              </Panel>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Inspiration;
