import React from 'react';
import { motion } from 'framer-motion';

const educationData = [
  {
    school: "UNIVERSITY OF TRANSPORT HO CHI MINH CITY (UTH)",
    degree: "Data Science",
    timeline: "2023 - Late 2026", 
    status: "Expected Graduation",
    description: "Focusing on data structures, algorithms, machine learning, and deep software engineering principles.",
    logo: "/images/uth.png"
  },
  {
    school: "APTECH COMPUTER EDUCATION",
    degree: "Advanced Diploma in Software Engineering",
    timeline: "2023 - 2025",
    status: "Graduated",
    description: "Completed rigorous practical coursework in full-stack development, database architecture, and enterprise solutions.",
    logo: "/images/aptech.png"
  }
];

const Education = () => {
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
    <section id="education" className="relative z-10 py-32 px-8 w-full max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-mono font-bold uppercase border-b-4 border-black dark:border-white inline-block pb-2">
          Academic Background
        </h2>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {educationData.map((item, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            className="flex flex-col md:flex-row items-start border-2 border-black dark:border-white bg-white dark:bg-black p-8 group hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
          >
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 border-2 border-black dark:border-white p-2 bg-white dark:bg-black">
              <img 
                src={item.logo} 
                alt={`${item.school} Logo`} 
                className="w-24 h-24 object-contain grayscale"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%23ccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='20' fill='%23333'%3E...%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl font-mono font-bold uppercase mb-2">
                {item.school}
              </h3>
              <p className="text-lg font-sans font-semibold mb-2">{item.degree}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3 text-sm font-mono font-bold">
                <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-300 transition-colors">
                  {item.timeline}
                </span>
                <span className="opacity-50">•</span>
                <span className="border border-black dark:border-white group-hover:border-white dark:group-hover:border-black px-2 py-1 uppercase text-xs">
                  {item.status}
                </span>
              </div>
              
              <p className="text-sm font-sans opacity-90 text-justify">
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
