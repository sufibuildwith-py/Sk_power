import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  onOpenQuote,
}) => {
  const { t } = useTranslation();

  const navItems = [
    { label: t('nav.home'), href: '#hero' },
    { label: t('nav.solutions'), href: '#solutions' },
    { label: t('pmSuryaGhar.nav'), href: '#pm-surya-ghar' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-solar-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Frosted Glass Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-10 w-[84%] max-w-[340px] h-full bg-[#f4f7f9]/90 backdrop-blur-xl border-l border-white/50 p-6 flex flex-col justify-between shadow-2xl"
          >
            {/* Top Bar with Brand & Close Button */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-solar-charcoal/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/95 border border-solar-charcoal/10 shadow-sm flex items-center justify-center shrink-0">
                    <img
                      src="/logo.jpeg"
                      alt="SK SOLAR WALA Logo"
                      className="w-full h-full object-contain p-0.5"
                    />
                  </div>
                  <span className="font-display font-semibold text-base tracking-tight text-solar-ink">
                    SK SOLAR WALA
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-solar-ink/5 hover:bg-solar-ink/10 text-solar-charcoal transition-colors"
                  aria-label={t('nav.closeMenu')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Language Switcher pill in mobile drawer */}
              <div className="pt-4 pb-2">
                <LanguageSwitcher idPrefix="mobile" className="w-full justify-center bg-white/70" />
              </div>

              {/* Navigation Items */}
              <nav className="mt-4">
                <ul className="flex flex-col gap-3">
                  {navItems.map((item, idx) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * idx, duration: 0.2 }}
                    >
                      <a
                        href={item.href}
                        onClick={onClose}
                        className="block text-base sm:text-lg font-medium text-solar-charcoal hover:text-solar-ink transition-colors py-1.5"
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Bottom Quote Action */}
            <div className="pt-6 border-t border-solar-charcoal/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenQuote();
                }}
                className="w-full py-3.5 px-5 rounded-full text-sm font-semibold tracking-wide text-solar-ivory glass-dark-pill flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
              >
                <span>{t('nav.getQuote')}</span>
                <ArrowUpRight className="w-4 h-4 text-solar-amber" />
              </button>
              <p className="text-[11px] text-center text-solar-charcoal/60">
                {t('hero.bottomStatement')}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
