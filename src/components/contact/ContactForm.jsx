import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, RotateCcw, Send } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import Panel from '../Panel';

// Messages are delivered by Web3Forms (https://web3forms.com), so the site needs no backend.
// The access key is public by design: it can only send to the inbox it was created for.
const ACCESS_KEY = process.env.REACT_APP_WEB3FORMS_KEY;
const ENDPOINT = 'https://api.web3forms.com/submit';

const fieldClass = 'w-full p-4 border border-black/20 dark:border-white/20 bg-black/[0.02] dark:bg-white/[0.03] outline-none focus:border-accent transition-colors duration-300 placeholder:opacity-50';
const labelClass = 'font-mono font-bold uppercase tracking-widest text-xs';

const sendMessage = async ({ name, email, message, botcheck }) => {
  if (!ACCESS_KEY) throw new Error('REACT_APP_WEB3FORMS_KEY is not set (see .env)');
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `Portfolio — ${name}`,
      from_name: 'Portfolio contact form',
      name,
      email, // Web3Forms uses this as the reply-to address
      message,
      botcheck, // honeypot: only bots tick the hidden checkbox
    }),
  });
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
};

const BUTTON_ICONS = { idle: Send, sending: Send, sent: Check, error: RotateCcw };

const ContactForm = () => {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus('sending');
    try {
      await sendMessage(data);
      form.reset();
      setStatus('sent');
    } catch (error) {
      console.error('Contact form:', error.message);
      setStatus('error');
    }
  };

  // Typing again after a result starts a fresh message
  const handleChange = () => {
    if (status === 'sent' || status === 'error') setStatus('idle');
  };

  const ButtonIcon = BUTTON_ICONS[status];

  return (
    <Panel
      as={motion.form}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col gap-6 p-6 sm:p-8"
      onSubmit={handleSubmit}
      onChange={handleChange}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>{t('contact.name')}</span>
          <input name="name" type="text" autoComplete="name" required maxLength={100} className={fieldClass} placeholder={t('contact.placeholder_name')} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>{t('contact.email')}</span>
          <input name="email" type="email" autoComplete="email" required maxLength={150} className={fieldClass} placeholder={t('contact.placeholder_email')} />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>{t('contact.message')}</span>
        <textarea name="message" rows="5" required maxLength={5000} className={`${fieldClass} resize-y`} placeholder={t('contact.placeholder_message')} />
      </label>

      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={status === 'sending'}
        className="group relative overflow-hidden w-full py-5 inline-flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-lg uppercase tracking-widest border-2 border-black dark:border-white hover:bg-accent hover:border-accent hover:text-white dark:hover:bg-accent dark:hover:border-accent dark:hover:text-white disabled:cursor-wait transition-colors duration-300"
      >
        {t(`contact.button.${status}`)}
        <motion.span
          key={status}
          // The paper plane takes off when the message is delivered
          initial={status === 'sent' ? { x: -60, y: 30, opacity: 0 } : false}
          animate={status === 'sending' ? { x: [0, 3, 0], y: [0, -3, 0] } : { x: 0, y: 0, opacity: 1 }}
          transition={status === 'sending' ? { duration: 0.6, repeat: Infinity } : { duration: 0.5, ease: 'easeOut' }}
        >
          <ButtonIcon size={20} />
        </motion.span>
      </motion.button>

      <p role="status" aria-live="polite" className={`min-h-[1.25rem] font-mono text-sm text-center ${status === 'error' ? 'text-red-500' : 'text-accent'}`}>
        {(status === 'sent' || status === 'error') && <>&gt; {t(`contact.status.${status}`)}</>}
      </p>
    </Panel>
  );
};

export default ContactForm;
