import React from 'react';
import { motion } from 'framer-motion';
import { Server, Layout, Database } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Skills = () => {
  const { t } = useLanguage();
  const skillTitles = t('skills.categories');
  const skillCategories = [
    {
      title: skillTitles[0].title,
      icon: <Server size={24} className="mb-4" />,
      skills: ["NestJS", "Spring Boot (Java)", "Node.js"]
    },
    {
      title: skillTitles[1].title,
      icon: <Layout size={24} className="mb-4" />,
      skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS"]
    },
    {
      title: skillTitles[2].title,
      icon: <Database size={24} className="mb-4" />,
      skills: ["MySQL", "Redis", "Docker", "Git"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="skills" className="relative z-10 py-32 px-8 w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-mono font-bold uppercase border-b-4 border-black dark:border-white inline-block pb-2">
          {t('skills.title')}
        </h2>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {skillCategories.map((category, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="border-2 border-black dark:border-white bg-white dark:bg-black p-8 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 group"
          >
            <div className="border-b-2 border-black dark:border-white pb-4 mb-6 group-hover:border-white dark:group-hover:border-black transition-colors duration-300">
              {category.icon}
              <h3 className="text-2xl font-mono font-bold uppercase">{category.title}</h3>
            </div>
            <ul className="space-y-4">
              {category.skills.map((skill, sIdx) => (
                <li key={sIdx} className="font-sans text-lg flex items-center before:content-['>'] before:mr-3 before:font-mono before:font-bold">
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Skills;
