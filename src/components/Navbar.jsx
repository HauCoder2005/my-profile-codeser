import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const SECTION_IDS = ['about', 'languages', 'inspiration', 'education', 'skills', 'projects', 'contact'];

// Track which section is currently in the middle of the viewport
const useActiveSection = () => {
  const [active, setActive] = useState('about');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return active;
};

const Navbar = () => {
  const [isDark, setIsDark] = useState(() => !document.documentElement.classList.contains('light'));
  const [isOpen, setIsOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();
  const active = useActiveSection();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
    try {
      localStorage.setItem('app_theme', isDark ? 'dark' : 'light');
    } catch (e) {
      // Storage may be unavailable (private mode); theme still works for this visit
    }
  }, [isDark]);

  const navLinks = SECTION_IDS.map((id) => ({ id, label: t(`nav.${id}`) }));
  const iconButton = 'p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 h-[72px] backdrop-blur-md bg-white/60 dark:bg-black/50 border-b border-black/20 dark:border-white/20 transition-colors duration-300">

        {/* Logo */}
        <a
          href="#about"
          className="group font-mono text-sm font-bold tracking-widest uppercase border-2 border-black dark:border-white px-3 py-1.5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
        >
          codeser<span className="text-accent group-hover:animate-pulse">_</span>
        </a>

        {/* Desktop links */}
        <div className="hidden xl:flex items-center gap-1 2xl:gap-2">
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`relative px-3 py-2 font-mono text-xs 2xl:text-sm tracking-widest uppercase font-bold transition-opacity duration-300 ${
                active === item.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              {item.label}
              {active === item.id && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute left-3 right-3 -bottom-0.5 h-[2px] bg-accent"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Right side: language, theme, menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            aria-label={t('nav.switch_lang')}
            className={`${iconButton} font-mono font-bold text-sm tracking-widest min-w-[44px]`}
          >
            {lang === 'en' ? 'EN' : 'VI'}
          </button>

          <button onClick={() => setIsDark(!isDark)} aria-label={t('nav.toggle_theme')} className={iconButton}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button onClick={() => setIsOpen(!isOpen)} aria-label={t('nav.toggle_menu')} aria-expanded={isOpen} className={`xl:hidden ${iconButton}`}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Scroll progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="absolute left-0 right-0 -bottom-px h-[2px] bg-accent origin-left"
        />
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-black dark:border-white overflow-hidden xl:hidden"
          >
            <div className="flex flex-col py-2">
              {navLinks.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`px-8 py-4 font-mono text-sm font-bold tracking-widest uppercase flex items-center justify-between border-b border-black/10 dark:border-white/10 last:border-b-0 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors ${
                    active === item.id ? 'text-accent' : ''
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="opacity-40">{String(i + 1).padStart(2, '0')}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
