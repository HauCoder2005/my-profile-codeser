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
    id: 'backend',
    icon: Server,
    skills: [
      { name: 'NestJS', icon: SiNestjs },
      { name: 'Spring Boot', icon: SiSpringboot },
      { name: 'Node.js', icon: SiNodedotjs },
    ],
  },
  {
    id: 'frontend',
    icon: Layout,
    skills: [
      { name: 'React.js', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
    ],
  },
  {
    id: 'database',
    icon: Database,
    skills: [
      { name: 'MySQL', icon: SiMysql },
      { name: 'Redis', icon: SiRedis },
      { name: 'Docker', icon: SiDocker },
      { name: 'Git', icon: SiGit },
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(5px)' },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }
  })
};

const Skills = () => {
  const { t } = useLanguage();
  const titles = t('skills.categories');

  return (
    <section id="skills" className="relative z-10 py-32 px-4 md:px-8 w-full max-w-7xl mx-auto">
      <SectionHeading title={t('skills.title')} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {skillGroups.map((group, idx) => {
          const GroupIcon = group.icon;
          const categoryTitle = titles[idx]?.title || group.id;

          return (
            <Panel
              as={motion.div}
              key={`skill-card-${group.id}`}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
              className="p-7 sm:p-8 flex flex-col justify-between"
            >
              <div>
                {/* Header: Category Title & Icon */}
                <div className="flex items-center justify-between pb-5 border-b border-black/10 dark:border-white/10">
                  <h3 className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-tight">
                    {categoryTitle}
                  </h3>
                  <div className="w-10 h-10 shrink-0 border border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.04] flex items-center justify-center group-hover:border-accent/60 group-hover:text-accent transition-colors">
                    <GroupIcon size={20} className="opacity-75 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Skills list */}
                <ul className="mt-6 space-y-3.5">
                  {group.skills.map(({ name, icon: Icon }) => (
                    <li
                      key={name}
                      className="group/item flex items-center gap-3.5 p-2 -mx-2 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="w-8 h-8 shrink-0 border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] flex items-center justify-center group-hover/item:border-accent/60 group-hover/item:text-accent transition-colors">
                        <Icon size={17} className="opacity-75 group-hover/item:opacity-100" />
                      </div>
                      <span className="font-mono font-bold text-base sm:text-lg group-hover/item:text-accent group-hover/item:translate-x-1 transition-all">
                        {name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Panel>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
