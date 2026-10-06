import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Panel from './Panel';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01';

// Decode-style text reveal: random glyphs resolve into the target text from left to right
const useScramble = (text, duration = 900) => {
  const reduceMotion = useReducedMotion();
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (reduceMotion) {
      setOutput(text);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const revealed = Math.floor(progress * text.length);
      let next = text.slice(0, revealed);
      for (let i = revealed; i < text.length; i++) {
        next += text[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOutput(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, duration, reduceMotion]);

  return output;
};

// Portrait in natural colour, framed like the other photos on the page (no filters or effects)
const Portrait = () => (
  <Panel className="p-2">
    <img
      src="/images/codeser.jpg"
      alt="Huynh Hau"
      className="block w-full max-w-[280px] sm:max-w-sm aspect-[3/4] object-cover object-top"
    />
  </Panel>
);

const Hero = () => {
  const { t } = useLanguage();
  const role = useScramble(t('hero.role'));

  return (
    <section
      id="about"
      className="relative z-10 min-h-screen flex flex-col justify-center pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 items-start w-full">

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start space-y-6 md:space-y-8"
        >
          <p className="font-mono text-sm md:text-base tracking-[0.3em] uppercase">
            <span className="text-accent">&gt;</span> {t('hero.hello')}
          </p>

          <h1 className="font-mono font-bold uppercase leading-[0.95]">
            <span className="block text-5xl sm:text-6xl md:text-7xl xl:text-8xl">{t('hero.name')}</span>
            <span className="mt-4 inline-flex items-center bg-black text-white dark:bg-white dark:text-black px-3 py-1 text-2xl sm:text-3xl md:text-4xl tracking-wide">
              {role}
              <span className="ml-1 inline-block w-[0.5em] h-[1em] bg-accent animate-pulse" />
            </span>
          </h1>

          <div className="max-w-xl border-l-4 border-accent pl-5 space-y-4 text-[15px] sm:text-base leading-relaxed opacity-80 text-left sm:text-justify">
            {t('hero.description').map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <motion.a
              href="/images/cv.pdf"
              download="Huynh_Hau_CV.pdf"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white font-mono font-bold uppercase tracking-wider hover:shadow-brutal-accent transition-shadow duration-300"
            >
              <Download size={18} />
              {t('hero.download_cv')}
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center px-7 py-4 border-2 border-black dark:border-white font-mono font-bold uppercase tracking-wider hover:border-accent hover:text-accent transition-colors duration-300"
            >
              {t('hero.contact_cta')}
            </motion.a>
          </div>
        </motion.div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center md:justify-end md:sticky md:top-32"
        >
          <Portrait />
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
