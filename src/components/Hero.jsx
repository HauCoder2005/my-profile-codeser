import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section 
      id="about" 
      className="relative z-10 min-h-screen flex items-center pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center w-full mt-8 md:mt-0">
        
        {/* Left Column: Text */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center md:items-start space-y-6 md:space-y-8 text-center md:text-left"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-mono font-bold leading-tight uppercase">
            Hi, I'm Huynh Hau.<br />
            <span className="bg-black text-white dark:bg-white dark:text-black px-2 inline-block mt-2">
              SOFTWARE ENGINEER
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl font-sans leading-relaxed opacity-90 max-w-lg border-l-0 md:border-l-4 border-black dark:border-white pl-0 md:pl-6 text-justify">
            Committed to a software engineering career since high school, I am a proactive and collaborative developer passionate about mastering new technologies. I strive for clean architecture and performant solutions, seeking a professional environment to refine my technical expertise and contribute meaningfully.
          </p>
          
          <motion.a 
            href="/images/cv.pdf"
            download="Huynh_Hau_CV.pdf"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 md:px-8 md:py-4 border-2 border-black dark:border-white bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-mono font-bold uppercase transition-colors duration-300 inline-block text-center w-full sm:w-auto"
          >
            Download CV
          </motion.a>
        </motion.div>

        {/* Right Column: Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center md:justify-end mt-8 md:mt-0"
        >
          <img 
            src="/images/codeser.jpg" 
            alt="Huynh Hau Portrait" 
            className="w-full max-w-[280px] sm:max-w-sm aspect-[3/4] object-cover border-2 border-black dark:border-white bg-white dark:bg-black rounded-none"
            onError={(e) => {
              // Fallback if image doesn't exist yet
              e.target.onerror = null; 
              e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'%3E%3Crect width='100%25' height='100%25' fill='%23ccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='20' fill='%23333'%3E[Portrait Placeholder]%3C/text%3E%3C/svg%3E";
            }}
          />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
