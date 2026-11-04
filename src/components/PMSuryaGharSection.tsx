import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DraggableCardTrack } from './DraggableCardTrack';
import {
  SunMedium,
  ChevronDown,
  FileText,
  ShieldCheck,
  Building2,
  Users,
  Coins,
  Compass,
  ArrowRight,
  Info,
  Layers,
  Wrench,
  Smartphone,
  CreditCard,
  Camera,
  Award,
} from 'lucide-react';

interface FaqItemProps {
  item: { q: string; a: string };
  idx: number;
  isOpen: boolean;
  onToggle: (idx: number) => void;
  isHindi: boolean;
}

const FaqItem: React.FC<FaqItemProps> = React.memo(({ item, idx, isOpen, onToggle, isHindi }) => (
  <div
    className={`rounded-2xl overflow-hidden border transition-colors duration-150 ${
      isOpen
        ? 'bg-[#b6e2fa]/60 border-solar-amber/50 shadow-sm'
        : 'bg-[#bfe2f8]/25 border-sky-200/40 hover:bg-[#bfe2f8]/40'
    }`}
  >
    <button
      type="button"
      onClick={() => onToggle(idx)}
      aria-expanded={isOpen}
      aria-controls={`faq-answer-${idx}`}
      id={`faq-question-${idx}`}
      className="w-full flex items-center justify-between text-left gap-4 p-5 sm:p-6 focus:outline-none group"
    >
      <span className="font-display font-medium text-sm sm:text-base text-solar-ink group-hover:text-solar-charcoal transition-colors">
        {idx + 1}. {item.q}
      </span>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center bg-solar-amber/10 text-solar-charcoal shrink-0 transition-transform duration-200 ${
          isOpen ? 'rotate-180 bg-solar-amber/25 text-solar-ink' : ''
        }`}
      >
        <ChevronDown className="w-4 h-4 text-solar-amber" />
      </div>
    </button>

    {isOpen && (
      <div
        id={`faq-answer-${idx}`}
        role="region"
        aria-labelledby={`faq-question-${idx}`}
        className="px-5 sm:px-6 pb-6 pt-1 border-t border-solar-charcoal/5 animate-[faqFadeIn_150ms_ease-out]"
      >
        <p
          className={`text-xs sm:text-sm text-solar-charcoal/85 leading-relaxed pr-8 ${
            isHindi ? 'leading-[1.7]' : ''
          }`}
        >
          {item.a}
        </p>
      </div>
    )}
  </div>
));

interface FaqAccordionProps {
  items: Array<{ q: string; a: string }>;
  isHindi: boolean;
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ items, isHindi }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback((idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  }, []);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <FaqItem
          key={idx}
          item={item}
          idx={idx}
          isOpen={openIndex === idx}
          onToggle={handleToggle}
          isHindi={isHindi}
        />
      ))}
    </div>
  );
};

interface PMSuryaGharSectionProps {
  onOpenQuote: () => void;
}

export const PMSuryaGharSection: React.FC<PMSuryaGharSectionProps> = ({ onOpenQuote }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const faqItems = (t('pmSuryaGhar.faqs.list', { returnObjects: true }) as Array<{ q: string; a: string }>) || [];
  const documentItems = (t('pmSuryaGhar.documents.items', { returnObjects: true }) as Array<{ name: string; detail: string }>) || [];
  const benefitItems = (t('pmSuryaGhar.benefits.items', { returnObjects: true }) as Array<{ title: string; desc: string }>) || [];

  return (
    <section
      id="pm-surya-ghar"
      aria-label="PM Surya Ghar: Muft Bijli Yojana Guide"
      className="w-full scroll-mt-24 py-24 sm:py-32 px-6 sm:px-10 md:px-14 max-w-[1920px] mx-auto border-t border-solar-charcoal/10"
    >
      {/* =========================================================================
          CHAPTER 01 — THE INITIATIVE (Editorial Split-Screen Introduction)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-20 sm:mb-28">
        {/* Left Column (60% on desktop) */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59] shrink-0" />
            <span
              className={`text-[10px] sm:text-[11px] font-semibold uppercase text-solar-charcoal/80 ${
                isHindi ? 'tracking-normal font-sans' : 'tracking-wide-editorial'
              }`}
            >
              {t('pmSuryaGhar.badge')}
            </span>
          </div>

          <h2
            className={`font-display text-3xl sm:text-4xl md:text-5xl font-normal text-solar-ink mb-6 ${
              isHindi ? 'leading-[1.24] font-sans' : 'tracking-tight leading-tight'
            }`}
          >
            {t('pmSuryaGhar.title')}
          </h2>

          <div className="border-l-2 border-solar-amber/70 pl-4 sm:pl-6 my-6">
            <p
              className={`text-base sm:text-lg font-medium text-solar-ink/90 italic ${
                isHindi ? 'font-sans not-italic leading-[1.65]' : 'font-display leading-snug'
              }`}
            >
              "{t('pmSuryaGhar.supportingQuote')}"
            </p>
          </div>

          <p
            className={`text-sm sm:text-base text-solar-charcoal/85 max-w-2xl leading-relaxed mb-6 ${
              isHindi ? 'leading-[1.75]' : ''
            }`}
          >
            {t('pmSuryaGhar.introParagraph')}
          </p>

          {/* Badges & Official CTA */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-solar-charcoal/70 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-ink/5 border border-solar-charcoal/10 font-medium">
              <Building2 className="w-3.5 h-3.5 text-solar-amber" />
              <span>{t('pmSuryaGhar.govAttribution')}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-solar-charcoal/10">
              <Info className="w-3.5 h-3.5 text-solar-charcoal/50" />
              <span>{t('pmSuryaGhar.infoDisclosure')}</span>
            </div>
          </div>

          <button
            onClick={onOpenQuote}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-solar-ink text-solar-ivory text-xs font-semibold hover:bg-solar-charcoal transition-all group shadow-sm"
          >
            <span>{t('pmSuryaGhar.subsidy.assistanceCta')}</span>
            <ArrowRight className="w-3.5 h-3.5 text-solar-amber group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Right Column (40% on desktop): Authentic PM Modi Photograph Frame */}
        <div className="lg:col-span-5 relative">
          {/* Subtle Ambient Sky-Blue & Amber Backlight */}
          <div className="absolute -inset-6 bg-gradient-to-tr from-[#7fc2f0]/35 via-[#b0ddfa]/25 to-solar-amber/15 rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative glass-frame rounded-3xl p-4 sm:p-5 overflow-hidden group">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-white/50 shadow-inner">
              <picture>
                <source srcSet="/pm-surya-ghar/pm-modi-initiative.webp" type="image/webp" />
                <img
                  src="/pm-surya-ghar/pm-modi-initiative.jpg"
                  alt="Prime Minister Narendra Modi — PM Surya Ghar: Muft Bijli Yojana"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-solar-ink/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-solar-ivory">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-solar-amber text-solar-ink text-[10px] font-bold tracking-wider uppercase mb-1 shadow-sm">
                  National Mission
                </span>
                <p className="text-[11px] sm:text-xs font-medium leading-snug drop-shadow-sm text-solar-ivory/95">
                  {t('pmSuryaGhar.modiCaption')}
                </p>
              </div>
            </div>

            <div className="mt-3.5 px-1 flex items-center justify-between text-[10px] sm:text-[11px] text-solar-charcoal/70">
              <span className="flex items-center gap-1.5 font-medium">
                <Award className="w-3.5 h-3.5 text-solar-amber" />
                {t('pmSuryaGhar.modiSource')}
              </span>
              <span className="font-mono text-solar-charcoal/50">13 Feb 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CHAPTER 02 — THE NUMBERS THAT MATTER
          ROW 02: RIGHT TO LEFT Draggable Glass Track
         ========================================================================= */}
      <div className="mb-20 sm:mb-28 overflow-hidden relative">
        {/* Ambient Sky-Blue & Solar Amber Glows behind Stats Track */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[650px] h-[340px] bg-gradient-to-r from-[#80c3f2]/26 via-[#b6defa]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[520px] h-[300px] bg-gradient-to-l from-solar-amber/15 via-[#bce3fa]/18 to-transparent rounded-full blur-3xl pointer-events-none" />

        <DraggableCardTrack
          direction="right-to-left"
          trackClassName="gap-4 sm:gap-6"
          ariaLabel="PM Surya Ghar Key Statistics Track"
        >
          {[
            {
              icon: Users,
              val: t('pmSuryaGhar.stats.households.value'),
              lbl: t('pmSuryaGhar.stats.households.label'),
              desc: t('pmSuryaGhar.stats.households.desc'),
            },
            {
              icon: SunMedium,
              val: t('pmSuryaGhar.stats.benefit.value'),
              lbl: t('pmSuryaGhar.stats.benefit.label'),
              desc: t('pmSuryaGhar.stats.benefit.desc'),
            },
            {
              icon: Coins,
              val: t('pmSuryaGhar.stats.subsidy.value'),
              lbl: t('pmSuryaGhar.stats.subsidy.label'),
              desc: t('pmSuryaGhar.stats.subsidy.desc'),
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-7 sm:p-8 rounded-3xl w-[78vw] min-w-[260px] max-w-[340px] sm:w-[350px] md:w-[380px] flex flex-col justify-between group select-none relative overflow-hidden shrink-0"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/20 rounded-full blur-2xl pointer-events-none group-hover:bg-solar-amber/15 transition-colors" />
              <div>
                <div className="w-11 h-11 rounded-2xl bg-solar-amber/10 border border-solar-amber/20 flex items-center justify-center text-solar-amber mb-6">
                  <stat.icon className="w-5 h-5 text-solar-amber" />
                </div>
                <div className="font-display text-4xl sm:text-5xl font-semibold text-solar-ink mb-2.5 tracking-tight">
                  {stat.val}
                </div>
                <div className="text-sm font-semibold text-solar-charcoal/90 mb-2">
                  {stat.lbl}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-solar-charcoal/75 leading-relaxed pt-3 border-t border-solar-charcoal/10">
                {stat.desc}
              </p>
            </div>
          ))}
        </DraggableCardTrack>
      </div>

      {/* =========================================================================
          CHAPTER 03 — SOLAR AT HOME (Photographic Storytelling)
         ========================================================================= */}
      <div className="mb-20 sm:mb-28">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-solar-charcoal/10 aspect-[16/10] sm:aspect-[16/8] lg:aspect-[21/9] group">
          <picture>
            <source srcSet="/pm-surya-ghar/indian-rooftop-solar-1.webp" type="image/webp" />
            <img
              src="/pm-surya-ghar/indian-rooftop-solar-1.jpg"
              alt="Residential rooftop solar panels installed in Varanasi, Uttar Pradesh"
              className="w-full h-full object-cover object-[50%_35%] transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
          </picture>

          {/* Editorial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-solar-ink/95 via-solar-ink/75 to-transparent sm:to-solar-ink/20 flex items-center p-6 sm:p-12 lg:p-16">
            <div className="max-w-xl text-solar-ivory">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-solar-amber" />
                <span className="text-[10px] font-semibold tracking-wider-editorial uppercase text-solar-amber">
                  {t('pmSuryaGhar.storyEyebrow')}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-solar-ivory mb-4 tracking-tight leading-tight">
                {t('pmSuryaGhar.storyHeadline')}
              </h3>
              <p className="text-xs sm:text-sm text-solar-silver/85 leading-relaxed mb-6">
                {t('pmSuryaGhar.storySub')}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-solar-silver/80">
                <Compass className="w-3.5 h-3.5 text-solar-amber" />
                <span>{t('pmSuryaGhar.storyCaption')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* =========================================================================
          CHAPTER 07 — DOCUMENTS & PREPARATION (Compact Two-Column Glass Checklist)
         ========================================================================= */}
      <div className="relative mb-20 sm:mb-28 overflow-hidden">
        {/* Ambient Sky-Blue Glow behind Documents Glass Panel */}
        <div className="absolute -top-10 right-10 w-[550px] h-[350px] bg-gradient-to-bl from-[#9ed2f8]/24 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative glass-panel rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Heading & Disclaimer */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-solar-charcoal/70">
                  {t('pmSuryaGhar.documents.eyebrow')}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-normal text-solar-ink mb-3">
                {t('pmSuryaGhar.documents.title')}
              </h3>
              <p className="text-xs sm:text-sm text-solar-charcoal/75 leading-relaxed mb-6">
                {t('pmSuryaGhar.documents.desc')}
              </p>
              <div className="glass-card-subtle p-4 rounded-2xl flex items-start gap-2.5 text-xs text-solar-charcoal/80">
                <Info className="w-4 h-4 text-solar-amber shrink-0 mt-0.5" />
                <span>{t('pmSuryaGhar.documents.note')}</span>
              </div>
            </div>

            {/* Right Column: Interactive Checklist */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documentItems.map((doc, idx) => {
                const icons = [FileText, Smartphone, ShieldCheck, CreditCard, Camera];
                const IconComp = icons[idx % icons.length];
                return (
                  <div
                    key={idx}
                    className="glass-card-subtle p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 hover:bg-white/40 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-solar-amber/10 border border-solar-amber/20 flex items-center justify-center text-solar-amber shrink-0 mt-0.5">
                      <IconComp className="w-4 h-4 text-solar-amber" />
                    </div>
                    <div>
                      <h5 className="font-display font-semibold text-xs sm:text-sm text-solar-ink mb-1">
                        {doc.name}
                      </h5>
                      <p className="text-xs text-solar-charcoal/75 leading-relaxed">
                        {doc.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SUSTAINABLE ADVANTAGES / ROOFTOP SOLAR BENEFITS
          ROW 03: LEFT TO RIGHT Draggable Glass Track
         ========================================================================= */}
      <div className="mb-20 sm:mb-28 overflow-hidden relative">
        {/* Ambient Sky-Blue & Soft Amber Glows behind Benefits Track */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#8ec9f5]/24 via-[#bbe0fa]/18 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[520px] h-[300px] bg-gradient-to-tl from-solar-amber/14 via-[#c4e6fc]/16 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl mb-10 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-solar-charcoal/70">
              {t('pmSuryaGhar.benefits.eyebrow')}
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-normal text-solar-ink mb-3">
            {t('pmSuryaGhar.benefits.title')}
          </h3>
          <p className="text-xs sm:text-sm text-solar-charcoal/80 leading-relaxed">
            {t('pmSuryaGhar.benefits.desc')}
          </p>
        </div>

        <DraggableCardTrack
          direction="left-to-right"
          trackClassName="gap-4 sm:gap-5 md:gap-6"
          ariaLabel="Residential Rooftop Solar Advantages Track"
        >
          {benefitItems.map((benefit, idx) => (
            <div
              key={idx}
              className="glass-card p-6 sm:p-7 rounded-3xl w-[76vw] min-w-[250px] max-w-[320px] sm:w-[300px] md:w-[330px] flex flex-col justify-between group select-none shrink-0"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-solar-amber/10 border border-solar-amber/20 flex items-center justify-center text-solar-amber mb-5">
                  <SunMedium className="w-5 h-5 text-solar-amber" />
                </div>
                <h4 className="font-display font-semibold text-sm sm:text-base text-solar-ink mb-2.5">
                  {benefit.title}
                </h4>
                <p className="text-xs sm:text-sm text-solar-charcoal/80 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </DraggableCardTrack>

        <p className="mt-4 text-[11px] text-solar-charcoal/60 relative z-10">
          {t('pmSuryaGhar.benefits.disclaimer')}
        </p>
      </div>

      {/* =========================================================================
          CHAPTER 08 — FREQUENTLY ASKED QUESTIONS (Frosted Glass Panel System)
         ========================================================================= */}
      <div className="relative mb-20 sm:mb-28 overflow-hidden">
        <div className="relative rounded-3xl p-6 sm:p-10 md:p-12 bg-[#8cc8f5]/24 border border-sky-200/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.50),0_12px_36px_rgba(55,125,175,0.08)]">
          <div className="max-w-xl mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-solar-charcoal/70">
                {t('pmSuryaGhar.faqs.eyebrow')}
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-normal text-solar-ink mb-2">
              {t('pmSuryaGhar.faqs.title')}
            </h3>
            <p className="text-xs sm:text-sm text-solar-charcoal/75 leading-relaxed">
              {t('pmSuryaGhar.faqs.desc')}
            </p>
          </div>

          <FaqAccordion items={faqItems} isHindi={isHindi} />
        </div>
      </div>

      {/* =========================================================================
          CHAPTER 09 — HOW SK SOLAR WALA CAN HELP & FINAL CTA
          ROW 04: RIGHT TO LEFT Draggable Glass Track
         ========================================================================= */}
      <div className="mb-20 sm:mb-28 overflow-hidden relative">
        {/* Ambient Sky-Blue & Amber Glows behind Services Track */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-[#8cc8f5]/25 via-[#bee2fa]/18 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[520px] h-[300px] bg-gradient-to-tl from-solar-amber/14 via-[#c4e6fc]/16 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mb-8 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-solar-amber shadow-[0_0_8px_#E9AD59]" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-solar-charcoal/70">
              {t('pmSuryaGhar.services.eyebrow')}
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-solar-ink mb-3">
            {t('pmSuryaGhar.services.title')}
          </h3>
          <p className="text-xs sm:text-sm text-solar-charcoal/80 leading-relaxed">
            {t('pmSuryaGhar.services.desc')}
          </p>
        </div>

        {/* Wide Modern Rooftop Installation Showcase Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-solar-charcoal/10 aspect-[16/9] sm:aspect-[21/9] mb-10 group">
          <picture>
            <source srcSet="/pm-surya-ghar/solar-rooftop-modern.webp" type="image/webp" />
            <img
              src="/pm-surya-ghar/solar-rooftop-modern.jpg"
              alt="Modern residential rooftop solar array"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-solar-ink/85 via-solar-ink/25 to-transparent flex items-end p-6 sm:p-8">
            <div className="text-solar-ivory max-w-lg">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-solar-amber text-solar-ink text-[10px] font-bold tracking-wider uppercase mb-2">
                Engineering Integrity
              </span>
              <p className="text-xs sm:text-sm font-medium leading-relaxed drop-shadow-sm text-solar-ivory/95">
                {isHindi
                  ? 'उच्च दक्षता वाले सौर उपकरण, सुरक्षित संरचनात्मक स्थापना एवं 25+ वर्षों का विश्वसनीय प्रदर्शन।'
                  : 'Certified MNRE-compliant solar modules, precision mounting, and 25+ years of clean energy output.'}
              </p>
            </div>
          </div>
        </div>

        {/* ROW 04: RIGHT TO LEFT Draggable Glass Track */}
        <DraggableCardTrack
          direction="right-to-left"
          trackClassName="gap-4 sm:gap-6 md:gap-8"
          ariaLabel="SK SOLAR WALA Services Track"
          className="mb-8"
        >
          {[
            /* Service 1: Consultation */
            <div
              key="srv-consult"
              className="glass-card p-7 sm:p-8 rounded-3xl w-[82vw] min-w-[280px] max-w-[360px] sm:w-[380px] md:w-[420px] flex flex-col justify-between group select-none shrink-0"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-solar-amber/10 border border-solar-amber/20 flex items-center justify-center text-solar-amber mb-6">
                  <Compass className="w-5 h-5 text-solar-amber" />
                </div>
                <h4 className="font-display text-xl font-medium text-solar-ink mb-2.5">
                  {t('pmSuryaGhar.services.consultation.title')}
                </h4>
                <p className="text-sm text-solar-charcoal/80 leading-relaxed mb-6">
                  {t('pmSuryaGhar.services.consultation.desc')}
                </p>
              </div>
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-ink group-hover:text-solar-amber transition-colors text-left pt-2 border-t border-solar-charcoal/10"
              >
                <span>{t('solutions.residentialCTA')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>,

            /* Service 2: Selection */
            <div
              key="srv-select"
              className="glass-card p-7 sm:p-8 rounded-3xl w-[82vw] min-w-[280px] max-w-[360px] sm:w-[380px] md:w-[420px] flex flex-col justify-between group select-none shrink-0"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-solar-amber/10 border border-solar-amber/20 flex items-center justify-center text-solar-amber mb-6">
                  <Layers className="w-5 h-5 text-solar-amber" />
                </div>
                <h4 className="font-display text-xl font-medium text-solar-ink mb-2.5">
                  {t('pmSuryaGhar.services.selection.title')}
                </h4>
                <p className="text-sm text-solar-charcoal/80 leading-relaxed mb-6">
                  {t('pmSuryaGhar.services.selection.desc')}
                </p>
              </div>
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-ink group-hover:text-solar-amber transition-colors text-left pt-2 border-t border-solar-charcoal/10"
              >
                <span>{t('products.inquireSpec')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>,

            /* Service 3: Installation Assistance */
            <div
              key="srv-assist"
              className="glass-card p-7 sm:p-8 rounded-3xl w-[82vw] min-w-[280px] max-w-[360px] sm:w-[380px] md:w-[420px] flex flex-col justify-between group select-none shrink-0"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-solar-amber/10 border border-solar-amber/20 flex items-center justify-center text-solar-amber mb-6">
                  <Wrench className="w-5 h-5 text-solar-amber" />
                </div>
                <h4 className="font-display text-xl font-medium text-solar-ink mb-2.5">
                  {t('pmSuryaGhar.services.assistance.title')}
                </h4>
                <p className="text-sm text-solar-charcoal/80 leading-relaxed mb-6">
                  {t('pmSuryaGhar.services.assistance.desc')}
                </p>
              </div>
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-ink group-hover:text-solar-amber transition-colors text-left pt-2 border-t border-solar-charcoal/10"
              >
                <span>{t('footer.requestQuote')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>,
          ]}
        </DraggableCardTrack>

        {/* Ethical Transparency Box */}
        <div className="glass-card-subtle p-5 rounded-2xl flex items-start gap-3.5 text-xs text-solar-charcoal/80">
          <ShieldCheck className="w-5 h-5 text-solar-amber shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t('pmSuryaGhar.services.ethicalDisclaimer')}
          </p>
        </div>
      </div>

      {/* Final Call to Action Panel */}
      <div className="rounded-3xl p-8 sm:p-12 md:p-16 bg-[#172A36] text-solar-ivory shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-solar-amber/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-solar-ivory mb-4 tracking-tight">
            {t('pmSuryaGhar.ctaPanel.title')}
          </h3>
          <p className="text-sm sm:text-base text-solar-silver/80 mb-8 leading-relaxed">
            {t('pmSuryaGhar.ctaPanel.subtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-full bg-solar-amber text-solar-ink text-xs sm:text-sm font-semibold hover:bg-[#dba14c] transition-all shadow-md inline-flex items-center gap-2 group"
            >
              <span>{t('pmSuryaGhar.ctaPanel.primaryBtn')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenQuote}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-solar-ivory text-xs sm:text-sm font-semibold transition-all border border-white/20 inline-flex items-center gap-2"
            >
              <span>{t('pmSuryaGhar.ctaPanel.secondaryBtn')}</span>
              <ArrowRight className="w-4 h-4 text-solar-amber" />
            </button>
          </div>

          <p className="text-[11px] text-solar-silver/60 leading-relaxed">
            {t('pmSuryaGhar.ctaPanel.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
};
