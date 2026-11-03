import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SunMedium,
  ExternalLink,
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

interface PMSuryaGharSectionProps {
  onOpenQuote: () => void;
}

export const PMSuryaGharSection: React.FC<PMSuryaGharSectionProps> = ({ onOpenQuote }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const faqItems = (t('pmSuryaGhar.faqs.list', { returnObjects: true }) as Array<{ q: string; a: string }>) || [];
  const documentItems = (t('pmSuryaGhar.documents.items', { returnObjects: true }) as Array<{ name: string; detail: string }>) || [];
  const benefitItems = (t('pmSuryaGhar.benefits.items', { returnObjects: true }) as Array<{ title: string; desc: string }>) || [];

  return (
    <section
      id="pm-surya-ghar"
      aria-label="PM Surya Ghar: Muft Bijli Yojana Guide"
      className="scroll-mt-24 py-24 sm:py-32 px-6 sm:px-10 md:px-14 max-w-[1920px] mx-auto border-t border-solar-charcoal/10"
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

          <a
            href="https://pmsuryaghar.gov.in/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-solar-ink text-solar-ivory text-xs font-semibold hover:bg-solar-charcoal transition-all group shadow-sm"
          >
            <span>{t('pmSuryaGhar.subsidy.officialCta')}</span>
            <ExternalLink className="w-3.5 h-3.5 text-solar-amber group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Right Column (40% on desktop): Authentic PM Modi Photograph Frame */}
        <div className="lg:col-span-5 relative">
          {/* Subtle Ambient Backlight */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-solar-amber/20 to-transparent rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative bg-white/90 rounded-3xl p-4 sm:p-5 border border-solar-charcoal/10 shadow-xl overflow-hidden group">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#edf2f5]">
              <picture>
                <source srcSet="/pm-surya-ghar/pm-modi-initiative.webp" type="image/webp" />
                <img
                  src="/pm-surya-ghar/pm-modi-initiative.jpg"
                  alt="Prime Minister Narendra Modi — PM Surya Ghar: Muft Bijli Yojana"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-solar-ink/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-solar-ivory">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-solar-amber text-solar-ink text-[10px] font-bold tracking-wider uppercase mb-1">
                  National Mission
                </span>
                <p className="text-[11px] sm:text-xs font-medium leading-snug drop-shadow-sm">
                  {t('pmSuryaGhar.modiCaption')}
                </p>
              </div>
            </div>

            <div className="mt-3.5 px-1 flex items-center justify-between text-[10px] sm:text-[11px] text-solar-charcoal/60">
              <span className="flex items-center gap-1.5 font-medium">
                <Award className="w-3.5 h-3.5 text-solar-amber" />
                {t('pmSuryaGhar.modiSource')}
              </span>
              <span>13 Feb 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CHAPTER 02 — THE NUMBERS THAT MATTER (Left-to-Right Staggered Statistics)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 sm:mb-28">
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
            className="bg-white/80 p-8 rounded-3xl border border-solar-charcoal/10 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-solar-amber/5 rounded-full blur-2xl pointer-events-none group-hover:bg-solar-amber/10 transition-colors" />
            <div className="w-10 h-10 rounded-2xl bg-solar-ink/5 flex items-center justify-center text-solar-ink mb-6 group-hover:scale-105 transition-transform">
              <stat.icon className="w-5 h-5 text-solar-amber" />
            </div>
            <div className="font-display text-4xl sm:text-5xl font-semibold text-solar-ink mb-2 tracking-tight">
              {stat.val}
            </div>
            <div className="text-sm font-semibold text-solar-charcoal/90 mb-2">
              {stat.lbl}
            </div>
            <p className="text-xs text-solar-charcoal/70 leading-relaxed">
              {stat.desc}
            </p>
          </div>
        ))}
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
              alt="Real residential rooftop solar panels installed in Gujarat, India"
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
          CHAPTER 07 — DOCUMENTS & PREPARATION (Compact Two-Column Checklist)
         ========================================================================= */}
      <div className="bg-white/80 rounded-3xl p-6 sm:p-10 border border-solar-charcoal/10 shadow-sm mb-20 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Heading & Disclaimer */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-solar-amber" />
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
            <div className="p-3.5 rounded-xl bg-solar-ink/5 border border-solar-charcoal/10 flex items-start gap-2.5 text-xs text-solar-charcoal/70">
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
                  className="p-4 rounded-2xl bg-[#F7F5EF] border border-solar-charcoal/10 flex items-start gap-3 hover:bg-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-solar-ink/5 flex items-center justify-center text-solar-ink shrink-0 mt-0.5">
                    <IconComp className="w-3.5 h-3.5 text-solar-amber" />
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

      {/* =========================================================================
          SUSTAINABLE ADVANTAGES / ROOFTOP SOLAR BENEFITS
         ========================================================================= */}
      <div className="mb-20 sm:mb-28">
        <div className="max-w-xl mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-solar-amber" />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {benefitItems.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white/80 p-5 rounded-2xl border border-solar-charcoal/10 flex flex-col justify-between hover:shadow-sm transition-shadow"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-solar-ink/5 flex items-center justify-center text-solar-ink mb-4">
                  <SunMedium className="w-4 h-4 text-solar-amber" />
                </div>
                <h4 className="font-display font-semibold text-sm text-solar-ink mb-2">
                  {benefit.title}
                </h4>
                <p className="text-xs text-solar-charcoal/75 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[11px] text-solar-charcoal/60">
          {t('pmSuryaGhar.benefits.disclaimer')}
        </p>
      </div>

      {/* =========================================================================
          CHAPTER 08 — FREQUENTLY ASKED QUESTIONS
          (PRESERVED 100% UNCHANGED PER EXPLICIT MANDATE)
         ========================================================================= */}
      <div className="bg-white/80 rounded-3xl p-6 sm:p-10 border border-solar-charcoal/10 shadow-sm mb-20 sm:mb-28">
        <div className="max-w-xl mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-solar-amber" />
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

        <div className="divide-y divide-solar-charcoal/10">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-4 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full flex items-center justify-between text-left gap-4 focus:outline-none group"
                >
                  <span className="font-display font-medium text-sm sm:text-base text-solar-ink group-hover:text-solar-charcoal transition-colors">
                    {idx + 1}. {item.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center bg-solar-ink/5 text-solar-charcoal shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-solar-amber/20 text-solar-ink' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p
                        className={`pt-3 text-xs sm:text-sm text-solar-charcoal/80 leading-relaxed pr-8 ${
                          isHindi ? 'leading-[1.7]' : ''
                        }`}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          CHAPTER 09 — HOW SK SOLAR WALA CAN HELP & FINAL CTA
         ========================================================================= */}
      <div className="mb-20 sm:mb-28">
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-solar-amber" />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Service 1: Consultation */}
          <div className="bg-white/80 p-8 rounded-3xl border border-solar-charcoal/10 hover:border-solar-amber/40 transition-all hover:shadow-lg flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-solar-ink/5 flex items-center justify-center text-solar-ink mb-6 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-solar-amber" />
              </div>
              <h4 className="font-display text-lg font-medium text-solar-ink mb-2">
                {t('pmSuryaGhar.services.consultation.title')}
              </h4>
              <p className="text-xs sm:text-sm text-solar-charcoal/75 leading-relaxed mb-6">
                {t('pmSuryaGhar.services.consultation.desc')}
              </p>
            </div>
            <button
              onClick={onOpenQuote}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-ink group-hover:text-solar-amber transition-colors text-left"
            >
              <span>{t('solutions.residentialCTA')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Service 2: Selection */}
          <div className="bg-white/80 p-8 rounded-3xl border border-solar-charcoal/10 hover:border-solar-amber/40 transition-all hover:shadow-lg flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-solar-ink/5 flex items-center justify-center text-solar-ink mb-6 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-solar-amber" />
              </div>
              <h4 className="font-display text-lg font-medium text-solar-ink mb-2">
                {t('pmSuryaGhar.services.selection.title')}
              </h4>
              <p className="text-xs sm:text-sm text-solar-charcoal/75 leading-relaxed mb-6">
                {t('pmSuryaGhar.services.selection.desc')}
              </p>
            </div>
            <button
              onClick={onOpenQuote}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-ink group-hover:text-solar-amber transition-colors text-left"
            >
              <span>{t('products.inquireSpec')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Service 3: Installation Assistance */}
          <div className="bg-white/80 p-8 rounded-3xl border border-solar-charcoal/10 hover:border-solar-amber/40 transition-all hover:shadow-lg flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-solar-ink/5 flex items-center justify-center text-solar-ink mb-6 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5 text-solar-amber" />
              </div>
              <h4 className="font-display text-lg font-medium text-solar-ink mb-2">
                {t('pmSuryaGhar.services.assistance.title')}
              </h4>
              <p className="text-xs sm:text-sm text-solar-charcoal/75 leading-relaxed mb-6">
                {t('pmSuryaGhar.services.assistance.desc')}
              </p>
            </div>
            <button
              onClick={onOpenQuote}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-solar-ink group-hover:text-solar-amber transition-colors text-left"
            >
              <span>{t('footer.requestQuote')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ethical Transparency Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-solar-ink/5 border border-solar-charcoal/10 flex items-start gap-3 text-xs text-solar-charcoal/75">
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
            <a
              href="https://pmsuryaghar.gov.in/#/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-solar-amber text-solar-ink text-xs sm:text-sm font-semibold hover:bg-[#dba14c] transition-all shadow-md inline-flex items-center gap-2 group"
            >
              <span>{t('pmSuryaGhar.ctaPanel.primaryBtn')}</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

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
