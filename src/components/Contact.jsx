import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  return (
    <section id="contact" className="relative z-10 py-32 px-8 w-full max-w-4xl mx-auto flex flex-col items-center">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-mono font-bold uppercase border-b-4 border-black dark:border-white inline-block pb-2">
          {t('contact.title')}
        </h2>
      </motion.div>

      {/* Form Section */}
      <motion.form 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-full flex flex-col space-y-8 bg-white dark:bg-black p-8 md:p-12 border-2 border-black dark:border-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="font-mono font-bold uppercase tracking-widest text-sm">{t('contact.name')}</label>
          <input 
            type="text" 
            id="name" 
            className="w-full p-4 border-2 border-black dark:border-white bg-transparent outline-none focus:ring-4 focus:ring-black dark:focus:ring-white transition-all duration-300 font-sans"
            placeholder={t('contact.placeholder_name')}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="font-mono font-bold uppercase tracking-widest text-sm">{t('contact.email')}</label>
          <input 
            type="email" 
            id="email" 
            className="w-full p-4 border-2 border-black dark:border-white bg-transparent outline-none focus:ring-4 focus:ring-black dark:focus:ring-white transition-all duration-300 font-sans"
            placeholder={t('contact.placeholder_email')}
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="message" className="font-mono font-bold uppercase tracking-widest text-sm">{t('contact.message')}</label>
          <textarea 
            id="message" 
            rows="5"
            className="w-full p-4 border-2 border-black dark:border-white bg-transparent outline-none focus:ring-4 focus:ring-black dark:focus:ring-white transition-all duration-300 font-sans resize-y"
            placeholder={t('contact.placeholder_message')}
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-6 mt-4 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xl md:text-2xl uppercase tracking-widest hover:invert transition-colors duration-300 border-2 border-black dark:border-white"
        >
          {t('contact.send')}
        </motion.button>
      </motion.form>

      {/* Footer / Socials */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-32 w-full flex flex-col md:flex-row items-center justify-between border-t-2 border-black dark:border-white pt-8 gap-8"
      >
        <p className="font-mono font-bold uppercase text-sm opacity-80">
          {t('contact.footer').replace('{year}', new Date().getFullYear())}
        </p>
        
        <div className="flex space-x-6">
          <a href="mailto:contact@example.com" className="p-3 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300" aria-label="Email">
            <Mail size={24} />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="p-3 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300" aria-label="GitHub">
            <Github size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-3 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300" aria-label="LinkedIn">
            <Linkedin size={24} />
          </a>
        </div>
      </motion.footer>

    </section>
  );
};

export default Contact;
