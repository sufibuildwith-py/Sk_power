import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

interface SiteHeaderProps {
  onOpenQuote: () => void;
  onOpenMobileMenu: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ onOpenQuote, onOpenMobileMenu }) => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { label: t('nav.home'), href: '#hero' },
    { label: t('nav.solutions'), href: '#solutions' },
    { label: t('pmSuryaGhar.nav'), href: '#pm-surya-ghar' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="site-header"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 md:px-14 py-4 md:py-6 transition-all duration-300 pointer-events-none"
    >
      <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand Wordmark & Official Brand Logo */}
        <a
          href="#hero"
          className="group flex items-center gap-2.5 sm:gap-3 text-solar-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-solar-amber rounded-lg px-1.5 py-1 transition-transform duration-200 active:scale-95"
          aria-label="SK SOLAR WALA Home"
        >
          {/* Official SK SOLAR WALA Brand Logo */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden bg-white/95 border border-solar-ink/10 shadow-sm flex items-center justify-center group-hover:border-solar-amber/50 group-hover:shadow-md transition-all shrink-0">
            <img
              src="/logo.jpeg"
              alt="SK SOLAR WALA Logo"
              className="w-full h-full object-contain p-0.5"
              loading="eager"
            />
          </div>

          <span className="font-display font-semibold text-[15px] sm:text-base md:text-[17px] tracking-tight text-solar-ink leading-tight whitespace-nowrap">
            SK SOLAR WALA
          </span>
        </a>

        {/* Desktop Navigation pill */}
        <nav
          aria-label="Main Navigation"
          className={`hidden lg:flex items-center px-6 py-2 rounded-full transition-all duration-300 ${
            scrolled ? 'glass-header-scrolled shadow-md' : 'glass-header'
          }`}
        >
          <ul className="flex items-center gap-7 text-[13px] tracking-normal font-medium text-solar-charcoal">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative text-solar-charcoal/80 hover:text-solar-ink transition-colors duration-200 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-solar-amber after:transition-all hover:after:w-full"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Actions: Segmented Language Switcher, Get a Quote & Mobile Burger */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:block">
            <LanguageSwitcher idPrefix="desktop" />
          </div>

          <button
            onClick={onOpenQuote}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide text-solar-ivory glass-dark-pill transition-all duration-200 group active:scale-95"
          >
            <span>{t('nav.getQuote')}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-solar-amber group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>

          {/* Mobile / Tablet Menu Button */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full glass-header text-solar-charcoal hover:text-solar-ink transition-colors pointer-events-auto active:scale-90"
            aria-label={t('nav.menu')}
          >
            <Menu className="w-4 h-4 text-solar-charcoal" />
          </button>
        </div>
      </div>
    </header>
  );
};
