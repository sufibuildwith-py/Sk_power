import React from 'react';
import { ArrowUpRight, SunMedium, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PMSuryaGharSection } from './PMSuryaGharSection';

interface PreviewSectionsProps {
  onOpenQuote: () => void;
}

export const PreviewSections: React.FC<PreviewSectionsProps> = ({ onOpenQuote }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const productsList = [
    {
      category: t('products.panels.category'),
      title: 'SK Alpha 450W Monocrystalline',
      efficiency: t('products.panels.metric'),
      desc: t('products.panels.desc'),
    },
    {
      category: t('products.inverters.category'),
      title: 'SK Matrix 10kW Smart Inverter',
      efficiency: t('products.inverters.metric'),
      desc: t('products.inverters.desc'),
    },
    {
      category: t('products.storage.category'),
      title: 'SK Cell Vault 15kWh LFP',
      efficiency: t('products.storage.metric'),
      desc: t('products.storage.desc'),
    },
    {
      category: t('products.management.category'),
      title: 'SK Energy Gateway Hub',
      efficiency: t('products.management.metric'),
      desc: t('products.management.desc'),
    },
  ];

  return (
    <div className="relative z-20 bg-[#F7F5EF] text-solar-charcoal">
      {/* 1. Solutions Section */}
      <section id="solutions" className="py-24 sm:py-32 px-6 sm:px-10 md:px-14 max-w-[1920px] mx-auto border-t border-solar-charcoal/10">
        <div className="max-w-xl mb-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-solar-amber" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Solution 1 */}
          <div className="bg-white/80 p-8 rounded-3xl border border-solar-charcoal/10 hover:border-solar-amber/40 transition-all hover:shadow-lg group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-solar-ink/5 flex items-center justify-center text-solar-ink mb-6 group-hover:scale-105 transition-transform">
                <SunMedium className="w-5 h-5 text-solar-amber" />
              </div>
              <h3 className={`font-display text-xl font-medium text-solar-ink mb-2 ${isHindi ? 'font-sans' : ''}`}>
                {t('solutions.residentialTitle')}
              </h3>
              <p className={`text-sm text-solar-charcoal/75 mb-6 ${isHindi ? 'leading-[1.65]' : 'leading-relaxed'}`}>
                {t('solutions.residentialDesc')}
              </p>
            </div>
            <button
              onClick={onOpenQuote}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-ink group-hover:text-solar-amber transition-colors"
            >
              <span>{t('solutions.residentialCTA')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Solution 2 */}
          <div className="bg-white/80 p-8 rounded-3xl border border-solar-charcoal/10 hover:border-solar-amber/40 transition-all hover:shadow-lg group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-solar-ink/5 flex items-center justify-center text-solar-ink mb-6 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-solar-amber" />
              </div>
              <h3 className={`font-display text-xl font-medium text-solar-ink mb-2 ${isHindi ? 'font-sans' : ''}`}>
                {t('solutions.commercialTitle')}
              </h3>
              <p className={`text-sm text-solar-charcoal/75 mb-6 ${isHindi ? 'leading-[1.65]' : 'leading-relaxed'}`}>
                {t('solutions.commercialDesc')}
              </p>
            </div>
            <button
              onClick={onOpenQuote}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-ink group-hover:text-solar-amber transition-colors"
            >
              <span>{t('solutions.commercialCTA')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Solution 3 */}
          <div className="bg-white/80 p-8 rounded-3xl border border-solar-charcoal/10 hover:border-solar-amber/40 transition-all hover:shadow-lg group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-solar-ink/5 flex items-center justify-center text-solar-ink mb-6 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-solar-amber" />
              </div>
              <h3 className={`font-display text-xl font-medium text-solar-ink mb-2 ${isHindi ? 'font-sans' : ''}`}>
                {t('solutions.distributionTitle')}
              </h3>
              <p className={`text-sm text-solar-charcoal/75 mb-6 ${isHindi ? 'leading-[1.65]' : 'leading-relaxed'}`}>
                {t('solutions.distributionDesc')}
              </p>
            </div>
            <button
              onClick={onOpenQuote}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-ink group-hover:text-solar-amber transition-colors"
            >
              <span>{t('solutions.distributionCTA')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Products Section */}
      <section id="products" className="py-24 sm:py-32 px-6 sm:px-10 md:px-14 max-w-[1920px] mx-auto border-t border-solar-charcoal/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-solar-amber" />
              <span className={`text-[10px] font-semibold uppercase text-solar-charcoal/70 ${
                isHindi ? 'tracking-normal font-sans' : 'tracking-wider-editorial'
              }`}>
                {t('products.eyebrow')}
              </span>
            </div>
            <h2 className={`font-display text-3xl sm:text-4xl font-normal text-solar-ink ${
              isHindi ? 'leading-[1.28] tracking-normal font-sans' : 'tracking-tight leading-tight'
            }`}>
              {t('products.title')}
            </h2>
          </div>
          <button
            onClick={onOpenQuote}
            className="self-start md:self-end px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide text-solar-ivory glass-dark-pill inline-flex items-center gap-2"
          >
            <span>{t('products.requestFullCatalogue')}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-solar-amber" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsList.map((prod) => (
            <div
              key={prod.title}
              className="bg-white/60 p-6 rounded-2xl border border-solar-charcoal/10 flex flex-col justify-between hover:bg-white transition-all"
            >
              <div>
                <span className={`text-[10px] font-semibold uppercase text-solar-charcoal/60 ${
                  isHindi ? 'tracking-normal font-sans' : 'tracking-widest'
                }`}>
                  {prod.category}
                </span>
                <h4 className="font-display text-base font-semibold text-solar-ink mt-2 mb-1">
                  {prod.title}
                </h4>
                <div className="inline-block px-2 py-0.5 rounded bg-solar-amber/15 text-[11px] font-medium text-solar-ink mb-3">
                  {prod.efficiency}
                </div>
                <p className={`text-xs text-solar-charcoal/70 mb-4 ${isHindi ? 'leading-[1.65]' : 'leading-relaxed'}`}>
                  {prod.desc}
                </p>
              </div>
              <button
                onClick={onOpenQuote}
                className="text-xs font-semibold text-solar-ink/80 hover:text-solar-amber transition-colors text-left"
              >
                {t('products.inquireSpec')}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. About Section */}
      <section id="about" className="py-24 sm:py-32 px-6 sm:px-10 md:px-14 max-w-[1920px] mx-auto border-t border-solar-charcoal/10">
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
      <footer id="contact" className="py-16 px-6 sm:px-10 md:px-14 border-t border-solar-charcoal/10 bg-[#f0ede4]">
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
            <a href="#products" className="hover:text-solar-ink transition-colors">{t('footer.catalogue')}</a>
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
