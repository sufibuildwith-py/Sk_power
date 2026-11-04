import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import { SiteHeader } from './components/SiteHeader';
import { HeroSection } from './components/HeroSection';
import { MobileNavigation } from './components/MobileNavigation';
import { QuoteModal, QuotePrefillData } from './components/QuoteModal';
import { PreviewSections } from './components/PreviewSections';
import { generateSolarAssessmentPdf } from './lib/generateSolarAssessmentPdf';
import { calculateSolarSystem } from './lib/solarCalculator';

gsap.registerPlugin(ScrollTrigger, useGSAP);

if (typeof window !== 'undefined') {
  (window as any).__generateSolarAssessmentPdf = generateSolarAssessmentPdf;
  (window as any).__calculateSolarSystem = calculateSolarSystem;
}

export const App: React.FC = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefillData | undefined>();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleOpenQuote = React.useCallback((prefill?: QuotePrefillData) => {
    setQuotePrefill(prefill);
    setIsQuoteOpen(true);
  }, []);

  const handleCloseQuote = React.useCallback(() => {
    setIsQuoteOpen(false);
  }, []);

  const handleOpenMobileNav = React.useCallback(() => {
    setIsMobileNavOpen(true);
  }, []);

  const handleCloseMobileNav = React.useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  // Initialize Lenis smooth scroll for desktop performance (bypass entirely on touch devices to ensure native 120Hz kinetic scroll)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      (typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0));

    if (prefersReducedMotion || isTouch) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  const handleExplore = React.useCallback(() => {
    const el = document.getElementById('solutions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleBrowse = React.useCallback(() => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#8ba3b3] selection:bg-solar-amber/25 selection:text-solar-ink">
      {/* Floating Header */}
      <SiteHeader
        onOpenQuote={() => handleOpenQuote()}
        onOpenMobileMenu={handleOpenMobileNav}
      />

      {/* Hero Section */}
      <main>
        <HeroSection
          onExplore={handleExplore}
          onBrowse={handleBrowse}
        />

        {/* Supporting sections for solutions, catalogue & contact */}
        <PreviewSections
          onOpenQuote={handleOpenQuote}
        />
      </main>

      {/* Mobile Navigation Drawer */}
      <MobileNavigation
        isOpen={isMobileNavOpen}
        onClose={handleCloseMobileNav}
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* Request Quote Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={handleCloseQuote}
        prefill={quotePrefill}
      />
    </div>
  );
};

export default App;
