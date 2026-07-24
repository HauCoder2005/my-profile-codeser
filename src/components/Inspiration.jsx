import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const InspirationNode = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    className="p-6 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 h-full flex items-center justify-center text-center font-mono font-bold text-sm md:text-base leading-relaxed cursor-default"
  >
    {children}
  </motion.div>
);

const Inspiration = () => {
  const { t } = useLanguage();
  return (
    <section id="inspiration" className="relative z-10 py-32 px-8 w-full">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Center Node Container with Image */}
        <div className="flex flex-col items-center">
          {/* Terry A. Davis Portrait */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 p-2 border-4 border-black dark:border-white bg-white dark:bg-black"
          >
            <img 
              src="/images/terry-2.JPG" 
              alt="Terry A. Davis" 
              className="w-48 h-48 object-cover grayscale border-2 border-black dark:border-white"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='100%25' height='100%25' fill='%23ccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='20' fill='%23333'%3E[Terry Portrait]%3C/text%3E%3C/svg%3E";
              }}
            />
          </motion.div>

          {/* Center Node Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border-4 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black px-8 py-4 font-mono font-bold text-xl md:text-3xl uppercase tracking-widest text-center"
          >
            {t('inspiration.title')}
          </motion.div>
        </div>

        {/* Desktop Connection Lines */}
        <div className="hidden md:flex flex-col items-center w-full mt-0 relative">
          {/* Main vertical stem */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-1 bg-black dark:bg-white" 
          />
          
          {/* Horizontal branching line */}
          <div className="w-full relative flex justify-center">
            {/* The horizontal line itself spans from center of col 1 to center of col 3 */}
            {/* In a 3 col grid with gap-8, center to center is roughly 66.66% of the grid */}
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="w-[calc(66.666%+1rem)] h-1 bg-black dark:bg-white origin-center" 
            />
            
            {/* The 3 vertical drops */}
            <div className="absolute top-0 w-[calc(66.666%+1rem)] flex justify-between h-12">
              <motion.div 
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 1.0 }}
                className="w-1 h-12 bg-black dark:bg-white origin-top" 
              />
              <motion.div 
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 1.0 }}
                className="w-1 h-12 bg-black dark:bg-white origin-top" 
              />
              <motion.div 
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 1.0 }}
                className="w-1 h-12 bg-black dark:bg-white origin-top" 
              />
            </div>
          </div>
          {/* Spacer to account for the drops */}
          <div className="h-12 w-full"></div>
        </div>

        {/* Mobile Connection Line (Single line down) */}
        <div className="flex md:hidden w-1 h-16 bg-black dark:bg-white my-4"></div>

        {/* Branch Nodes Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
          
          <div className="flex flex-col items-center">
            <InspirationNode delay={1.2}>
              <span className="whitespace-pre-wrap">{t('inspiration.rule1')}</span>
            </InspirationNode>
            {/* Mobile connecting line to next node */}
            <div className="flex md:hidden w-1 h-16 bg-black dark:bg-white mt-8"></div>
          </div>

          <div className="flex flex-col items-center h-full">
            <InspirationNode delay={1.4}>
              <span className="whitespace-pre-wrap">{t('inspiration.rule2')}</span>
            </InspirationNode>
            {/* Mobile connecting line to next node */}
            <div className="flex md:hidden w-1 h-16 bg-black dark:bg-white mt-8"></div>
          </div>

          <div className="flex flex-col items-center h-full">
            <InspirationNode delay={1.6}>
              <span className="whitespace-pre-wrap">{t('inspiration.rule3')}</span>
            </InspirationNode>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Inspiration;
