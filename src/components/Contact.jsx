import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SectionHeading from './SectionHeading';
import SocialOrbit from './contact/SocialOrbit';
import ContactForm from './contact/ContactForm';

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="relative z-10 pt-32 pb-12 px-4 md:px-8 w-full max-w-6xl mx-auto flex flex-col">
      <SectionHeading title={t('contact.title')} align="center" />

      <p className="-mt-8 mb-16 text-center text-lg opacity-80 max-w-xl mx-auto">
        {t('contact.subtitle')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
        <SocialOrbit />
        <ContactForm />
      </div>

      <footer className="mt-24 w-full border-t-2 border-black/20 dark:border-white/20 pt-8">
        <p className="font-mono text-xs md:text-sm uppercase tracking-wider opacity-70 text-center">
          {t('contact.footer').replace('{year}', new Date().getFullYear())}
        </p>
      </footer>
    </section>
  );
};

export default Contact;
