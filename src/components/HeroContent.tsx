import React from 'react';
import { useTranslation } from 'react-i18next';
import { HeroActions } from './HeroActions';
import { HeroActionProps } from '../types';

export const HeroContent: React.FC<HeroActionProps> = ({ onExplore, onBrowse }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  return (
    <div className="relative z-10 w-full max-w-[360px] sm:max-w-[480px] lg:max-w-[520px] xl:max-w-[560px] pointer-events-auto">
      {/* Eyebrow: Delicate uppercase badge with glowing amber indicator */}
      <div className="hero-eyebrow flex items-center gap-2.5 mb-3.5 sm:mb-4 lg:mb-5">
        <span
          className="w-1.5 h-1.5 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59] shrink-0"
          aria-hidden="true"
        />
        <span className={`text-[10px] sm:text-[11px] font-semibold uppercase text-solar-charcoal/80 ${
          isHindi ? 'tracking-normal font-sans' : 'tracking-wide-editorial'
        }`}>
          {t('hero.eyebrow')}
        </span>
      </div>

      {/* Two-line Primary Headline: Architectural, spacious, neo-grotesk / Devanagari */}
      <h1 className={`font-display text-[29px] sm:text-[38px] md:text-[44px] lg:text-[49px] xl:text-[54px] font-normal text-solar-ink mb-4 sm:mb-5 lg:mb-6 ${
        isHindi ? 'leading-[1.22] tracking-normal font-sans' : 'leading-[1.12] tracking-tighter'
      }`}>
        <span className="headline-mask">
          <span className="hero-line-1 inline-block will-change-transform pb-1">
            {t('hero.line1')}
          </span>
        </span>
        <span className="headline-mask">
          <span className={`hero-line-2 inline-block will-change-transform pt-0.5 pb-1 ${
            isHindi
              ? 'font-sans font-medium text-solar-ink'
              : 'font-display italic text-solar-ink/90'
          }`}>
            {t('hero.line2')}
          </span>
        </span>
      </h1>

      {/* Supporting Paragraph: Generous breathing room, natural wrapping */}
      <p className={`hero-paragraph text-[12.5px] sm:text-[14px] lg:text-[15.5px] text-solar-charcoal/85 font-normal max-w-[340px] sm:max-w-[420px] lg:max-w-[440px] mb-5 sm:mb-6 lg:mb-7 ${
        isHindi ? 'leading-[1.75]' : 'leading-relaxed'
      }`}>
        {t('hero.description')}
      </p>

      {/* CTAs */}
      <HeroActions onExplore={onExplore} onBrowse={onBrowse} />
    </div>
  );
};
