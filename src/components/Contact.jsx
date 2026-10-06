import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { socials } from '../config/site';
import SectionHeading from './SectionHeading';
import Panel from './Panel';

const fieldClass = 'w-full p-4 border border-black/20 dark:border-white/20 bg-black/[0.02] dark:bg-white/[0.03] outline-none focus:border-accent transition-colors duration-300 placeholder:opacity-50';

const Contact = () => {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  const socialLinks = [
    { href: socials.email && `mailto:${socials.email}`, label: 'Email', icon: Mail },
    { href: socials.github, label: 'GitHub', icon: Github },
    { href: socials.linkedin, label: 'LinkedIn', icon: Linkedin },
  ].filter((link) => link.href);

  // No backend: open the visitor's mail app with the message pre-filled
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const subject = `Portfolio — ${form.get('name')}`;
    const body = `${form.get('message')}\n\n— ${form.get('name')} (${form.get('email')})`;
    window.location.href = `mailto:${socials.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section id="contact" className="relative z-10 pt-32 pb-12 px-4 md:px-8 w-full max-w-4xl mx-auto flex flex-col">
      <SectionHeading title={t('contact.title')} align="center" />

      <p className="-mt-8 mb-12 text-center text-lg opacity-80 max-w-xl mx-auto">
        {t('contact.subtitle')}
      </p>

      {socials.email && (
        <Panel
          as={motion.form}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col gap-6 p-6 sm:p-8 md:p-12"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-2">
              <span className="font-mono font-bold uppercase tracking-widest text-xs">{t('contact.name')}</span>
              <input name="name" type="text" autoComplete="name" required className={fieldClass} placeholder={t('contact.placeholder_name')} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono font-bold uppercase tracking-widest text-xs">{t('contact.email')}</span>
              <input name="email" type="email" autoComplete="email" required className={fieldClass} placeholder={t('contact.placeholder_email')} />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="font-mono font-bold uppercase tracking-widest text-xs">{t('contact.message')}</span>
            <textarea name="message" rows="5" required className={`${fieldClass} resize-y`} placeholder={t('contact.placeholder_message')} />
          </label>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="group w-full py-5 mt-2 inline-flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-lg md:text-xl uppercase tracking-widest border-2 border-black dark:border-white hover:bg-accent hover:border-accent hover:text-white dark:hover:bg-accent dark:hover:border-accent dark:hover:text-white transition-colors duration-300"
          >
            {t('contact.send')}
            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.button>

          {sent && (
            <p role="status" className="font-mono text-sm text-accent text-center">
              {t('contact.sent')}
            </p>
          )}
        </Panel>
      )}

      <footer className="mt-24 w-full flex flex-col md:flex-row items-center justify-between border-t-2 border-black/20 dark:border-white/20 pt-8 gap-6">
        <p className="font-mono text-xs md:text-sm uppercase tracking-wider opacity-70 text-center md:text-left">
          {t('contact.footer').replace('{year}', new Date().getFullYear())}
        </p>

        <div className="flex gap-4">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              aria-label={label}
              whileHover={{ y: -4 }}
              className="p-3 border border-black/30 dark:border-white/30 hover:border-accent hover:text-accent transition-colors duration-300"
            >
              <Icon size={22} />
            </motion.a>
          ))}
        </div>
      </footer>
    </section>
  );
};

export default Contact;
