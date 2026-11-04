import React from 'react';
import { useTranslation } from 'react-i18next';
import { DraggableCardTrack } from './DraggableCardTrack';

interface BrandItem {
  id: string;
  name: string;
  logo: string;
  className?: string;
}

const BRAND_ITEMS: BrandItem[] = [
  { id: 'livfast', name: 'Livfast', logo: '/brands/livfast.svg' },
  { id: 'livguard', name: 'Livguard', logo: '/brands/livguard.svg' },
  { id: 'waaree', name: 'WAAREE', logo: '/brands/waaree.png' },
  { id: 'adani', name: 'Adani', logo: '/brands/adani.svg' },
  { id: 'tata', name: 'TATA', logo: '/brands/tata.svg', className: 'scale-[0.88]' },
  { id: 'luminous', name: 'Luminous', logo: '/brands/luminous.svg' },
];

export const TrustedBrandsSection: React.FC = React.memo(() => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  return (
    <section
      id="trusted-brands"
      aria-label={t('trustedBrands.title')}
      className="w-full py-12 sm:py-16 px-6 sm:px-10 md:px-14 max-w-[1920px] mx-auto border-t border-solar-charcoal/10"
    >
      <div className="max-w-xl mx-auto text-center mb-8 sm:mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59]" />
          <span
            className={`text-[10px] font-semibold uppercase text-solar-charcoal/70 ${
              isHindi ? 'tracking-normal font-sans' : 'tracking-wider-editorial'
            }`}
          >
            {t('trustedBrands.eyebrow')}
          </span>
        </div>
        <h2
          className={`font-display text-2xl sm:text-3xl font-normal text-solar-ink mb-2 ${
            isHindi ? 'font-sans' : ''
          }`}
        >
          {t('trustedBrands.title')}
        </h2>
        <p
          className={`text-xs sm:text-sm text-solar-charcoal/75 ${
            isHindi ? 'leading-[1.7]' : 'leading-relaxed'
          }`}
        >
          {t('trustedBrands.subtitle')}
        </p>
      </div>

      <DraggableCardTrack
        direction="left-to-right"
        speedDesktop={22}
        speedMobile={18}
        trackClassName="gap-3 sm:gap-4 md:gap-5"
        ariaLabel={t('trustedBrands.title')}
      >
        {BRAND_ITEMS.map((brand) => (
          <div
            key={brand.id}
            className="glass-card rounded-2xl h-[72px] sm:h-[84px] w-[160px] sm:w-[190px] md:w-[210px] px-5 sm:px-6 py-3 flex items-center justify-center shrink-0 select-none"
          >
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              className={`max-h-8 sm:max-h-9 max-w-[120px] sm:max-w-[145px] w-auto h-auto object-contain pointer-events-none select-none ${brand.className || ''}`}
              loading="eager"
              draggable={false}
            />
          </div>
        ))}
      </DraggableCardTrack>
    </section>
  );
});
