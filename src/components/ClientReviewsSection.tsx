import React from 'react';
import { useTranslation } from 'react-i18next';
import { DraggableCardTrack } from './DraggableCardTrack';

interface ReviewItem {
  id: string;
  src: string;
  alt: string;
  isLandscape?: boolean;
}

// Train 1: 5 authentic client review & installation proofs (Left to Right)
const TRAIN_1_ITEMS: ReviewItem[] = [
  {
    id: 'rev-01',
    src: '/reviews/20260814_91455AMByGPSMapCamera.jpg',
    alt: 'SK SOLAR WALA verified rooftop solar installation in Pandit Deen Dayal Upadhyaya Nagar, UP',
    isLandscape: false,
  },
  {
    id: 'rev-02',
    src: '/reviews/download%20(2).jpg',
    alt: 'SK SOLAR WALA elevated rooftop solar module installation',
    isLandscape: true,
  },
  {
    id: 'rev-03',
    src: '/reviews/20260824_100608AMByGPSMapCamera.jpg',
    alt: 'SK SOLAR WALA verified installation with customer in Uttar Pradesh',
    isLandscape: false,
  },
  {
    id: 'rev-04',
    src: '/reviews/download.jpg',
    alt: 'SK SOLAR WALA verified customer on rooftop with solar installation in UP',
    isLandscape: false,
  },
  {
    id: 'rev-05',
    src: '/reviews/20260904_30604PMByGPSMapCamera.jpg',
    alt: 'SK SOLAR WALA verified customer rooftop solar plant in Kailashpuri, UP',
    isLandscape: false,
  },
];

// Train 2: 5 authentic client review & installation proofs (Right to Left)
const TRAIN_2_ITEMS: ReviewItem[] = [
  {
    id: 'rev-06',
    src: '/reviews/20260906_121539PMByGPSMapCamera.jpg',
    alt: 'SK SOLAR WALA verified customer rooftop installation in Chandauli, UP',
    isLandscape: false,
  },
  {
    id: 'rev-07',
    src: '/reviews/download%20(3).jpg',
    alt: 'SK SOLAR WALA dusk view of premium rooftop solar array',
    isLandscape: true,
  },
  {
    id: 'rev-08',
    src: '/reviews/20260908_125813PMByGPSMapCamera.jpg',
    alt: 'SK SOLAR WALA verified customer with rooftop solar system in New Mahal, UP',
    isLandscape: false,
  },
  {
    id: 'rev-09',
    src: '/reviews/download%20(1).jpg',
    alt: 'SK SOLAR WALA happy customer at completed solar rooftop project',
    isLandscape: false,
  },
  {
    id: 'rev-10',
    src: '/reviews/20260930_45700PMByGPSMapCamera.jpg',
    alt: 'SK SOLAR WALA verified customer with on-grid solar plant in Ledhupur, UP',
    isLandscape: false,
  },
];

export const ClientReviewsSection: React.FC = React.memo(() => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  return (
    <section
      id="reviews"
      aria-label={t('reviews.title')}
      className="relative w-full py-16 sm:py-20 md:py-24 max-w-[1920px] mx-auto border-t border-solar-charcoal/10 overflow-hidden"
    >
      {/* Subtle Sky-Blue & Solar Amber Ambient Glow behind the motion trains */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[650px] h-[340px] bg-gradient-to-tr from-[#94ccf6]/18 via-[#bde2fa]/12 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[300px] bg-gradient-to-tl from-solar-amber/10 via-[#c8e6fc]/12 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-xl mx-auto text-center mb-8 sm:mb-10 px-6 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59]" />
          <span
            className={`text-[10px] font-semibold uppercase text-solar-charcoal/70 ${
              isHindi ? 'tracking-normal font-sans' : 'tracking-wider-editorial'
            }`}
          >
            {t('reviews.eyebrow')}
          </span>
        </div>
        <h2
          className={`font-display text-2xl sm:text-3xl md:text-4xl font-normal text-solar-ink mb-2 tracking-tight ${
            isHindi ? 'font-sans' : ''
          }`}
        >
          {t('reviews.title')}
        </h2>
        <p
          className={`text-xs sm:text-sm text-solar-charcoal/75 max-w-md mx-auto ${
            isHindi ? 'leading-[1.7]' : 'leading-relaxed'
          }`}
        >
          {t('reviews.subtitle')}
        </p>
      </div>

      {/* TRAIN 1: Left to Right Motion Train */}
      <div className="relative z-10 w-full mb-3 sm:mb-4">
        <DraggableCardTrack
          direction="left-to-right"
          speedDesktop={20}
          speedMobile={16}
          trackClassName="gap-3 sm:gap-4 md:gap-5"
          ariaLabel="Client Installation Proofs (Train 1)"
        >
          {TRAIN_1_ITEMS.map((item) => {
            const cardWidth = item.isLandscape
              ? 'w-[280px] sm:w-[340px] md:w-[380px]'
              : 'w-[160px] sm:w-[185px] md:w-[205px]';

            return (
              <div
                key={item.id}
                className={`glass-card rounded-2xl p-1.5 sm:p-2 ${cardWidth} h-[195px] sm:h-[225px] md:h-[245px] shrink-0 flex items-center justify-center select-none overflow-hidden transition-none`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-contain rounded-xl select-none pointer-events-none"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>
            );
          })}
        </DraggableCardTrack>
      </div>

      {/* Slim Customer Satisfaction Quote Between The Two Motion Trains */}
      <div className="relative z-10 max-w-2xl mx-auto my-7 sm:my-9 px-6 text-center select-none">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <span className="w-6 h-[1px] bg-solar-amber/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59]" />
          <span className="w-6 h-[1px] bg-solar-amber/40" />
        </div>
        <blockquote
          className={`font-display text-base sm:text-lg md:text-xl font-normal text-solar-ink tracking-tight ${
            isHindi ? 'font-sans' : 'italic'
          }`}
        >
          "{t('reviews.quote')}"
        </blockquote>
        <p
          className={`text-[11px] sm:text-xs text-solar-charcoal/70 mt-1.5 ${
            isHindi ? 'font-sans' : ''
          }`}
        >
          {t('reviews.quoteSub')}
        </p>
      </div>

      {/* TRAIN 2: Right to Left Motion Train */}
      <div className="relative z-10 w-full mt-3 sm:mt-4">
        <DraggableCardTrack
          direction="right-to-left"
          speedDesktop={20}
          speedMobile={16}
          trackClassName="gap-3 sm:gap-4 md:gap-5"
          ariaLabel="Client Installation Proofs (Train 2)"
        >
          {TRAIN_2_ITEMS.map((item) => {
            const cardWidth = item.isLandscape
              ? 'w-[280px] sm:w-[340px] md:w-[380px]'
              : 'w-[160px] sm:w-[185px] md:w-[205px]';

            return (
              <div
                key={item.id}
                className={`glass-card rounded-2xl p-1.5 sm:p-2 ${cardWidth} h-[195px] sm:h-[225px] md:h-[245px] shrink-0 flex items-center justify-center select-none overflow-hidden transition-none`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-contain rounded-xl select-none pointer-events-none"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>
            );
          })}
        </DraggableCardTrack>
      </div>
    </section>
  );
});
