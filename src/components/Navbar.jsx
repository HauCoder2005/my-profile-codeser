import React, { useState, useEffect } from 'react';
import { Settings, User, Search, Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  // Theme state: dark by default per requirements
  const [isDark, setIsDark] = useState(true);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = ['ABOUT', 'SKILL', 'codeser', 'PROJECTS', 'CONTACT'];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 backdrop-blur-md bg-transparent border-b border-black dark:border-white transition-colors duration-300">
        
        {/* Left side: Icons (Hidden on very small screens, or keep a few) */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button className="hover:opacity-70 transition-opacity">
            <Settings size={20} />
          </button>
          <button className="hover:opacity-70 transition-opacity">
            <User size={20} />
          </button>
          <button className="hover:opacity-70 transition-opacity hidden sm:block">
            <Search size={20} />
          </button>
        </div>

        {/* Center: Navigation Links with Plasma Glow (Desktop Only) */}
        <div className="hidden md:flex items-center space-x-10 relative">
          {/* Plasma Background Element */}
          <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
            <motion.div
              className={`w-full h-full absolute ${isDark ? 'glow-plasma-dark' : 'glow-plasma-light'}`}
              animate={{
                scale: hoveredLink ? 1.05 : 1,
                opacity: hoveredLink ? 0.8 : 0.3,
              }}
              transition={{ duration: 0.3 }}
              style={{
                filter: 'blur(20px)',
                background: isDark ? 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 70%)',
              }}
            />
          </div>

          {navLinks.map((link) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase()}`}
              onHoverStart={() => setHoveredLink(link)}
              onHoverEnd={() => setHoveredLink(null)}
              className={`relative z-10 font-mono text-sm tracking-widest font-bold transition-all duration-300 ${
                link === 'codeser' 
                  ? 'border-2 border-black dark:border-white px-4 py-2 uppercase' 
                  : 'hover:opacity-100 opacity-80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Link Text - use cosmic glow effect for non-codeser links */}
              <span className={link !== 'codeser' ? 'cosmic-glow' : ''}>
                {link}
              </span>
              
              {/* Link underline or bottom highlight for the hover */}
              {link !== 'codeser' && hoveredLink === link && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 left-0 right-0 h-[2px] bg-black dark:bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.a>
          ))}
        </div>

        {/* Right side: Theme Toggle & Hamburger */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-[69px] left-0 right-0 z-40 bg-white dark:bg-black border-b border-black dark:border-white overflow-hidden md:hidden shadow-2xl"
          >
            <div className="flex flex-col py-4">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className={`px-8 py-4 font-mono text-center font-bold tracking-widest border-b border-black/10 dark:border-white/10 last:border-b-0 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors ${
                    link === 'codeser' ? 'text-lg uppercase underline decoration-2 underline-offset-4' : 'text-sm'
                  }`}
                >
                  {link}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
