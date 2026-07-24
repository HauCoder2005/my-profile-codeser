import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const logos = [
  "/images/uth.png",
  "/images/aptech.png"
];

const Education = () => {
  const { t } = useLanguage();
  const educationData = t('education.items');

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="education" className="relative z-10 py-32 px-4 md:px-8 w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-20 text-center flex flex-col items-center"
      >
        <h2 className="text-4xl md:text-5xl font-mono font-bold uppercase tracking-widest text-black dark:text-white">
          {t('education.title')}
        </h2>
        <div className="w-24 h-1 bg-black dark:bg-white mt-6"></div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
      >
        {educationData.map((item, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            className="flex flex-col items-center text-center border-2 border-black dark:border-white bg-white dark:bg-black p-8 group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 h-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px]"
          >
            {/* Centered Circular Logo */}
            <div className="w-32 h-32 rounded-full border-2 border-black dark:border-white bg-white dark:bg-black p-4 mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden">
              <img 
                src={logos[index]} 
                alt={`${item.school} Logo`} 
                className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%23333' stroke-width='2'/%3E%3Ctext x='50' y='55' text-anchor='middle' font-family='monospace' font-size='20' fill='%23333'%3E...%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            
            {/* Card Content (Flex-1 ensures equal height pushes description to bottom) */}
            <div className="flex flex-col flex-1 items-center w-full">
              <h3 className="text-xl md:text-2xl font-mono font-bold uppercase mb-2 min-h-[64px] flex items-center justify-center">
                {item.school}
              </h3>
              
              <p className="text-lg font-sans font-bold opacity-80 mb-6 uppercase tracking-wider">
                {item.degree}
              </p>
              
              {/* Timeline & Status Pill */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm font-mono font-bold border-2 border-black dark:border-white px-4 py-2 group-hover:border-white dark:group-hover:border-black transition-colors duration-300">
                <span className="text-black dark:text-white group-hover:text-white dark:group-hover:text-black">
                  {item.timeline}
                </span>
                <span className="opacity-30">|</span>
                <span className="uppercase text-xs tracking-widest text-green-600 dark:text-green-400 group-hover:text-green-400">
                  {item.status}
                </span>
              </div>
              
              {/* Description pinned to bottom via mt-auto */}
              <p className="text-base font-sans opacity-90 mt-auto leading-relaxed max-w-sm">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Education;
