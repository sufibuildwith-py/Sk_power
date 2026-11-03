import React from 'react';
import { useTranslation } from 'react-i18next';

export const HeroMeta: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  return (
    <div className="hero-meta absolute bottom-6 md:bottom-8 left-0 right-0 px-6 sm:px-10 md:px-14 flex items-end justify-between pointer-events-none z-10">
      {/* Bottom-left micro-label */}
      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-solar-ink/40 backdrop-blur-md border border-white/10 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-solar-amber shadow-[0_0_6px_#E9AD59]" />
        <span className={`text-[10px] sm:text-[11px] font-semibold uppercase text-solar-ivory/90 ${
          isHindi ? 'tracking-normal font-sans' : 'tracking-wider-editorial'
        }`}>
          {t('hero.bottomStatement')}
        </span>
      </div>

      {/* Center scroll indicator */}
      <div
        className="hidden md:flex flex-col items-center gap-1.5 group cursor-pointer pointer-events-auto px-3 py-1.5 rounded-full bg-solar-ink/30 backdrop-blur-md border border-white/10 transition-colors hover:bg-solar-ink/50"
        onClick={() => {
          const el = document.getElementById('solutions');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        aria-label={t('hero.scrollIndicator')}
      >
        <span className={`text-[9px] uppercase text-solar-ivory/75 font-medium ${
          isHindi ? 'tracking-normal font-sans' : 'tracking-widest'
        }`}>
          {t('hero.scrollIndicator')}
        </span>
        <div className="w-3.5 h-5 rounded-full border border-white/40 flex items-start justify-center p-0.5">
          <div className="w-1 h-1 rounded-full bg-solar-amber animate-bounce" />
        </div>
      </div>

      {/* Bottom-right section indicator */}
      <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-solar-ink/40 backdrop-blur-md border border-white/10 shadow-sm">
        <span className={`text-[10px] sm:text-[11px] font-medium uppercase text-solar-ivory/90 ${
          isHindi ? 'tracking-normal font-sans' : 'tracking-wide-editorial'
        }`}>
          {t('hero.sectionIndicator')}
        </span>
        <div className="w-8 sm:w-12 h-[1px] bg-white/30" />
      </div>
    </div>
  );
};
