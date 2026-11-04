import React, { useEffect, useCallback } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

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

  // Robust lifecycle for body scroll lock & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const lockToken = lockScroll('mobile-nav');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unlockScroll(lockToken);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Smooth navigation handler: closes drawer then scrolls smoothly to target
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      onClose();

      const target = document.querySelector(href);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      }
    },
    [onClose]
  );

  const handleQuoteClick = useCallback(() => {
    onClose();
    setTimeout(() => {
      onOpenQuote();
    }, 60);
  }, [onClose, onOpenQuote]);

  return (
    <div
      {...(!isOpen ? { inert: '' } : {})}
      className={`fixed inset-0 z-[60] flex items-start justify-end lg:hidden overflow-hidden ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={t('nav.mobileMenu', 'Mobile Navigation')}
    >
      {/* Backdrop: GPU-accelerated opacity fade */}
      <div
        className={`fixed inset-0 bg-solar-ink/50 transition-opacity duration-200 ease-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Close menu overlay"
        onClick={onClose}
      />

      {/* Frosted Glass Drawer: 100% Pre-composited GPU translation */}
      <div
        className={`relative z-10 w-[84%] max-w-[340px] h-full bg-[#f4f7f9]/96 backdrop-blur-md border-l border-white/60 p-6 flex flex-col justify-between shadow-2xl will-change-transform transition-transform duration-[280ms] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
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
                  loading="eager"
                  decoding="sync"
                />
              </div>
              <span className="font-display font-semibold text-base tracking-tight text-solar-ink">
                SK SOLAR WALA
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-solar-ink/5 hover:bg-solar-ink/10 text-solar-charcoal transition-colors active:scale-90"
              aria-label={t('nav.closeMenu')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Language Switcher pill in mobile drawer */}
          <div className="pt-4 pb-2">
            <LanguageSwitcher idPrefix="mobile" className="w-full justify-center bg-white/70" />
          </div>

          {/* Navigation Items: Transform smoothly with parent GPU layer */}
          <nav className="mt-4" aria-label={t('nav.mobileMenu', 'Mobile Navigation')}>
            <ul className="flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="block text-base sm:text-lg font-medium text-solar-charcoal hover:text-solar-ink transition-colors py-1.5 active:text-solar-amber"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Quote Action */}
        <div className="pt-6 border-t border-solar-charcoal/10 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleQuoteClick}
            className="w-full py-3.5 px-5 rounded-full text-sm font-semibold tracking-wide text-solar-ivory glass-dark-pill flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            <span>{t('nav.getQuote')}</span>
            <ArrowUpRight className="w-4 h-4 text-solar-amber" />
          </button>
          <p className="text-[11px] text-center text-solar-charcoal/60">
            {t('hero.bottomStatement')}
          </p>
        </div>
      </div>
    </div>
  );
};
