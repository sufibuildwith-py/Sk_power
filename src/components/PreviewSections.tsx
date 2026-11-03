import React from 'react';
import { ArrowUpRight, SunMedium, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PMSuryaGharSection } from './PMSuryaGharSection';
import { DraggableCardTrack } from './DraggableCardTrack';

interface PreviewSectionsProps {
  onOpenQuote: () => void;
}

export const PreviewSections: React.FC<PreviewSectionsProps> = ({ onOpenQuote }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  return (
    <div className="relative z-20 bg-[#F7F5EF] text-solar-charcoal w-full">
      {/* 1. Solutions Section — ROW 01 (LEFT TO RIGHT Draggable Glass Track) */}
      <section id="solutions" className="relative w-full py-24 sm:py-32 px-6 sm:px-10 md:px-14 max-w-[1920px] mx-auto border-t border-solar-charcoal/10 overflow-hidden">
        {/* Soft Sky-Blue & Solar Amber Ambient Light Glows behind the glass track */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-[#8cc8f5]/26 via-[#bce2fa]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[320px] bg-gradient-to-tl from-solar-amber/14 via-[#c8e6fc]/18 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl mb-12 sm:mb-16 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59]" />
            <span className={`text-[10px] font-semibold uppercase text-solar-charcoal/70 ${
              isHindi ? 'tracking-normal font-sans' : 'tracking-wider-editorial'
            }`}>
              {t('solutions.eyebrow')}
            </span>
          </div>
          <h2 className={`font-display text-3xl sm:text-4xl font-normal text-solar-ink mb-4 ${
            isHindi ? 'leading-[1.28] tracking-normal font-sans' : 'tracking-tight leading-tight'
          }`}>
            {t('solutions.title')}
          </h2>
          <p className={`text-sm sm:text-base text-solar-charcoal/80 ${
            isHindi ? 'leading-[1.7]' : 'leading-relaxed'
          }`}>
            {t('solutions.description')}
          </p>
        </div>

        {/* ROW 01: LEFT TO RIGHT Draggable Glass Track */}
        <DraggableCardTrack
          direction="left-to-right"
          speed={22}
          trackClassName="gap-4 sm:gap-6 md:gap-8 pr-6 sm:pr-8"
          ariaLabel="Solar Solutions Track"
        >
          {[
            /* Solution 1: Residential */
            <div
              key="sol-residential"
              className="glass-card p-7 sm:p-8 rounded-3xl w-[82vw] min-w-[280px] max-w-[360px] sm:w-[380px] md:w-[420px] flex flex-col justify-between group select-none shrink-0"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-solar-amber/10 border border-solar-amber/20 flex items-center justify-center text-solar-amber mb-6 group-hover:scale-105 transition-transform">
                  <SunMedium className="w-5 h-5 text-solar-amber" />
                </div>
                <h3 className={`font-display text-xl font-medium text-solar-ink mb-2.5 ${isHindi ? 'font-sans' : ''}`}>
                  {t('solutions.residentialTitle')}
                </h3>
                <p className={`text-sm text-solar-charcoal/80 mb-6 ${isHindi ? 'leading-[1.65]' : 'leading-relaxed'}`}>
                  {t('solutions.residentialDesc')}
                </p>
              </div>
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-ink group-hover:text-solar-amber transition-colors text-left pt-2 border-t border-solar-charcoal/10"
              >
                <span>{t('solutions.residentialCTA')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>,

            /* Solution 2: Commercial */
            <div
              key="sol-commercial"
              className="glass-card p-7 sm:p-8 rounded-3xl w-[82vw] min-w-[280px] max-w-[360px] sm:w-[380px] md:w-[420px] flex flex-col justify-between group select-none shrink-0"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-solar-amber/10 border border-solar-amber/20 flex items-center justify-center text-solar-amber mb-6 group-hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5 text-solar-amber" />
                </div>
                <h3 className={`font-display text-xl font-medium text-solar-ink mb-2.5 ${isHindi ? 'font-sans' : ''}`}>
                  {t('solutions.commercialTitle')}
                </h3>
                <p className={`text-sm text-solar-charcoal/80 mb-6 ${isHindi ? 'leading-[1.65]' : 'leading-relaxed'}`}>
                  {t('solutions.commercialDesc')}
                </p>
              </div>
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-ink group-hover:text-solar-amber transition-colors text-left pt-2 border-t border-solar-charcoal/10"
              >
                <span>{t('solutions.commercialCTA')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>,

            /* Solution 3: Distribution */
            <div
              key="sol-distribution"
              className="glass-card p-7 sm:p-8 rounded-3xl w-[82vw] min-w-[280px] max-w-[360px] sm:w-[380px] md:w-[420px] flex flex-col justify-between group select-none shrink-0"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-solar-amber/10 border border-solar-amber/20 flex items-center justify-center text-solar-amber mb-6 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-solar-amber" />
                </div>
                <h3 className={`font-display text-xl font-medium text-solar-ink mb-2.5 ${isHindi ? 'font-sans' : ''}`}>
                  {t('solutions.distributionTitle')}
                </h3>
                <p className={`text-sm text-solar-charcoal/80 mb-6 ${isHindi ? 'leading-[1.65]' : 'leading-relaxed'}`}>
                  {t('solutions.distributionDesc')}
                </p>
              </div>
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-ink group-hover:text-solar-amber transition-colors text-left pt-2 border-t border-solar-charcoal/10"
              >
                <span>{t('solutions.distributionCTA')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>,
          ]}
        </DraggableCardTrack>
      </section>

      {/* 2. About Section */}
      <section id="about" className="w-full py-24 sm:py-32 px-6 sm:px-10 md:px-14 max-w-[1920px] mx-auto border-t border-solar-charcoal/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-solar-amber" />
              <span className={`text-[10px] font-semibold uppercase text-solar-charcoal/70 ${
                isHindi ? 'tracking-normal font-sans' : 'tracking-wider-editorial'
              }`}>
                {t('about.eyebrow')}
              </span>
            </div>
            <h2 className={`font-display text-3xl sm:text-4xl font-normal text-solar-ink mb-6 ${
              isHindi ? 'leading-[1.28] tracking-normal font-sans' : 'tracking-tight leading-tight'
            }`}>
              {t('about.title')}
            </h2>
            <p className={`text-sm sm:text-base text-solar-charcoal/80 mb-4 ${isHindi ? 'leading-[1.7]' : 'leading-relaxed'}`}>
              {t('about.paragraph1')}
            </p>
            <p className={`text-sm sm:text-base text-solar-charcoal/80 mb-8 ${isHindi ? 'leading-[1.7]' : 'leading-relaxed'}`}>
              {t('about.paragraph2')}
            </p>
            <div className="flex items-center gap-6">
              <div>
                <div className="font-display text-2xl font-semibold text-solar-ink">{t('about.stat1Value')}</div>
                <div className="text-xs text-solar-charcoal/60">{t('about.stat1Label')}</div>
              </div>
              <div className="w-[1px] h-8 bg-solar-charcoal/15" />
              <div>
                <div className="font-display text-2xl font-semibold text-solar-ink">{t('about.stat2Value')}</div>
                <div className="text-xs text-solar-charcoal/60">{t('about.stat2Label')}</div>
              </div>
              <div className="w-[1px] h-8 bg-solar-charcoal/15" />
              <div>
                <div className="font-display text-2xl font-semibold text-solar-ink">{t('about.stat3Value')}</div>
                <div className="text-xs text-solar-charcoal/60">{t('about.stat3Label')}</div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-solar-charcoal/10 aspect-video">
            <img
              src="/hero-poster.jpg"
              alt="SK SOLAR WALA Architectural Integration"
              className="w-full h-full object-cover object-[60%_40%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-solar-ink/60 via-transparent to-transparent flex items-end p-8">
              <p className={`text-xs sm:text-sm text-solar-ivory font-light max-w-sm ${isHindi ? 'leading-[1.6]' : ''}`}>
                {t('about.imageCaption')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PM Surya Ghar: Muft Bijli Yojana Section */}
      <PMSuryaGharSection onOpenQuote={onOpenQuote} />

      {/* 5. Footer & Contact */}
      <footer id="contact" className="w-full py-16 px-6 sm:px-10 md:px-14 border-t border-solar-charcoal/10 bg-[#f0ede4]">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden bg-white/95 border border-solar-charcoal/10 shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/logo.jpeg"
                alt="SK SOLAR WALA Logo"
                className="w-full h-full object-contain p-0.5"
                loading="lazy"
              />
            </div>
            <div>
              <span className="font-display font-semibold text-base text-solar-ink">SK SOLAR WALA</span>
              <p className={`text-xs text-solar-charcoal/60 ${isHindi ? 'font-sans' : ''}`}>{t('footer.tagline')}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-medium text-solar-charcoal/80">
            <a href="#hero" className="hover:text-solar-ink transition-colors">{t('footer.topOfPage')}</a>
            <a href="#solutions" className="hover:text-solar-ink transition-colors">{t('footer.solutions')}</a>
            <a href="#about" className="hover:text-solar-ink transition-colors">{t('nav.about')}</a>
            <a href="#pm-surya-ghar" className="hover:text-solar-ink transition-colors">{t('footer.pmSuryaGhar')}</a>
            <button onClick={onOpenQuote} className="hover:text-solar-amber font-semibold transition-colors">
              {t('footer.requestQuote')}
            </button>
          </div>

          <div className="text-[11px] text-solar-charcoal/60">
            © {new Date().getFullYear()} SK SOLAR WALA Inc. {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
};
