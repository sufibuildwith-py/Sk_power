import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HeroActionProps } from '../types';

export const HeroActions: React.FC<HeroActionProps> = ({ onExplore, onBrowse }) => {
  const { t } = useTranslation();

  return (
    <div className="hero-cta-group flex items-center gap-4 sm:gap-6 pt-1">
      {/* Primary CTA */}
      <button
        onClick={onExplore}
        className="group relative inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-wide text-solar-ivory glass-dark-pill transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-solar-amber shrink-0"
      >
        <span>{t('hero.primaryCTA')}</span>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-solar-amber group-hover:translate-x-1 transition-transform duration-200" />
      </button>

      {/* Secondary CTA */}
      <button
        onClick={onBrowse}
        className="group inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium tracking-normal text-solar-charcoal hover:text-solar-ink transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-solar-charcoal rounded shrink-0"
      >
        <span className="relative">
          {t('hero.secondaryCTA')}
          <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-solar-charcoal/40 group-hover:w-full transition-all duration-300" />
        </span>
      </button>
    </div>
  );
};
