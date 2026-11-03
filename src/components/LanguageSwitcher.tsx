import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface LanguageSwitcherProps {
  className?: string;
  idPrefix?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '', idPrefix = 'desktop' }) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language === 'hi' ? 'hi' : 'en';

  const handleLanguageChange = (lang: 'en' | 'hi') => {
    if (currentLang !== lang) {
      i18n.changeLanguage(lang);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={t('language.switch')}
      className={`relative inline-flex items-center p-1 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-sm ${className}`}
    >
      {/* English Option */}
      <button
        type="button"
        role="radio"
        aria-checked={currentLang === 'en'}
        onClick={() => handleLanguageChange('en')}
        className={`relative z-10 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider transition-colors duration-200 select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-solar-amber ${
          currentLang === 'en'
            ? 'text-solar-ink'
            : 'text-solar-charcoal/60 hover:text-solar-ink'
        }`}
      >
        {currentLang === 'en' && (
          <motion.div
            layoutId={`${idPrefix}-lang-indicator`}
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className="absolute inset-0 bg-white/90 rounded-full shadow-[0_1px_4px_rgba(23,42,54,0.12)] border border-white/80 -z-10"
          />
        )}
        <span>EN</span>
      </button>

      {/* Hindi Option */}
      <button
        type="button"
        role="radio"
        aria-checked={currentLang === 'hi'}
        onClick={() => handleLanguageChange('hi')}
        className={`relative z-10 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-normal transition-colors duration-200 select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-solar-amber ${
          currentLang === 'hi'
            ? 'text-solar-ink'
            : 'text-solar-charcoal/60 hover:text-solar-ink'
        }`}
      >
        {currentLang === 'hi' && (
          <motion.div
            layoutId={`${idPrefix}-lang-indicator`}
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className="absolute inset-0 bg-white/90 rounded-full shadow-[0_1px_4px_rgba(23,42,54,0.12)] border border-white/80 -z-10"
          />
        )}
        <span className="font-sans">हिंदी</span>
      </button>
    </div>
  );
};
