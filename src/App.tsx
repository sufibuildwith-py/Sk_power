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

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const App: React.FC = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefillData | undefined>();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleOpenQuote = (prefill?: QuotePrefillData) => {
    setQuotePrefill(prefill);
    setIsQuoteOpen(true);
  };

  // Initialize Lenis smooth scroll for desktop performance
  useEffect(() => {
    // Only initialize smooth scroll on non-touch devices or when user prefers motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

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
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  const handleExplore = () => {
    const el = document.getElementById('solutions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBrowse = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#8ba3b3] selection:bg-solar-amber/25 selection:text-solar-ink">
      {/* Floating Header */}
      <SiteHeader
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenMobileMenu={() => setIsMobileNavOpen(true)}
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
        onClose={() => setIsMobileNavOpen(false)}
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* Request Quote Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        prefill={quotePrefill}
      />
    </div>
  );
};

export default App;
