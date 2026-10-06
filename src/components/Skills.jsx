import React from 'react';
import { motion } from 'framer-motion';
import { Server, Layout, Database } from 'lucide-react';
import {
  SiNestjs, SiSpringboot, SiNodedotjs, SiReact, SiNextdotjs, SiTypescript,
  SiTailwindcss, SiMysql, SiRedis, SiDocker, SiGit,
} from 'react-icons/si';
import { useLanguage } from '../contexts/LanguageContext';
import SectionHeading from './SectionHeading';
import Panel from './Panel';

const skillGroups = [
  {
    icon: Server,
    skills: [
      { name: 'NestJS', icon: SiNestjs },
      { name: 'Spring Boot', icon: SiSpringboot },
      { name: 'Node.js', icon: SiNodedotjs },
    ],
  },
  {
    icon: Layout,
    skills: [
      { name: 'React.js', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
    ],
  },
  {
    icon: Database,
    skills: [
      { name: 'MySQL', icon: SiMysql },
      { name: 'Redis', icon: SiRedis },
      { name: 'Docker', icon: SiDocker },
      { name: 'Git', icon: SiGit },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Skills = () => {
  const { t } = useLanguage();
  const titles = t('skills.categories');

  return (
    <section id="skills" className="relative z-10 py-32 px-4 md:px-8 w-full max-w-7xl mx-auto">
      <SectionHeading title={t('skills.title')} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {skillGroups.map((group, idx) => {
          const GroupIcon = group.icon;
          return (
            <Panel
              as={motion.div}
              key={titles[idx].title}
              variants={itemVariants}
              className="p-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl md:text-2xl font-mono font-bold uppercase">{titles[idx].title}</h3>
                <GroupIcon size={24} className="opacity-60 group-hover:text-accent group-hover:opacity-100 transition-colors" />
              </div>

              <span aria-hidden className="block w-8 h-px bg-accent/70 my-6" />

              <ul className="space-y-4">
                {group.skills.map(({ name, icon: Icon }) => (
                  <li key={name} className="flex items-center gap-4 text-lg group/item">
                    <Icon size={20} className="opacity-70 group-hover/item:text-accent group-hover/item:opacity-100 transition-colors" />
                    <span className="group-hover/item:translate-x-1 transition-transform">{name}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Skills;
