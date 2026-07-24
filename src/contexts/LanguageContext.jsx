import React, { createContext, useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import en from '../locales/en';
import vi from '../locales/vi';

const LanguageContext = createContext();

export const translations = { en, vi };

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const [isChangingLang, setIsChangingLang] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'vi')) {
      setLang(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    if (isChangingLang) return; // Prevent spam clicking

    const newLang = lang === 'en' ? 'vi' : 'en';
    const text = newLang === 'en' ? 'SWITCHING TO ENGLISH...' : 'ĐANG CHUYỂN NGÔN NGỮ...';
    
    setLoadingText(text);
    setIsChangingLang(true);

    // Wait for the blur overlay to fade in completely
    setTimeout(() => {
      setLang(newLang);
      localStorage.setItem('app_lang', newLang);
      
      // Wait a moment for React to render the new text, then fade out overlay
      setTimeout(() => {
        setIsChangingLang(false);
      }, 500);
    }, 400);
  };

  const t = (key) => {
    const keys = key.split('.');
    let current = translations[lang];
    for (let k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      current = current[k];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
      
      <AnimatePresence>
        {isChangingLang && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] backdrop-blur-md bg-white/20 dark:bg-black/40 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* 3 Running Dots (Windows Phone Style) */}
            <div className="flex space-x-3 overflow-hidden px-12 py-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-black dark:bg-white rounded-full"
                  animate={{
                    x: [-80, 0, 0, 80],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    times: [0, 0.4, 0.6, 1],
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
