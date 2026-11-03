import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { HeroMeta } from './HeroMeta';
import { HeroActionProps } from '../types';

export const HeroSection: React.FC<HeroActionProps> = ({ onExplore, onBrowse }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set(
          ['#site-header', '.hero-eyebrow', '.hero-line-1', '.hero-line-2', '.hero-paragraph', '.hero-cta-group', '.hero-meta'],
          { opacity: 1, y: 0 }
        );
        return;
      }

      const tl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
          duration: 0.9,
        },
      });

      // 1. Header enters from above
      tl.from('#site-header', {
        y: -30,
        opacity: 0,
        duration: 0.8,
      });

      // 2. Eyebrow fades in with subtle upward translation
      tl.from(
        '.hero-eyebrow',
        {
          y: 16,
          opacity: 0,
          duration: 0.7,
        },
        '-=0.4'
      );

      // 3. First headline line rises inside overflow-hidden text mask
      tl.from(
        '.hero-line-1',
        {
          y: '100%',
          opacity: 0,
          duration: 0.9,
        },
        '-=0.4'
      );

      // 4. Second headline line follows with a slight delay
      tl.from(
        '.hero-line-2',
        {
          y: '100%',
          opacity: 0,
          duration: 0.9,
        },
        '-=0.7'
      );

      // 5. Paragraph fades and settles into place
      tl.from(
        '.hero-paragraph',
        {
          y: 18,
          opacity: 0,
          duration: 0.8,
        },
        '-=0.5'
      );

      // 6. Primary and secondary CTAs appear
      tl.from(
        '.hero-cta-group',
        {
          y: 14,
          opacity: 0,
          duration: 0.7,
        },
        '-=0.5'
      );

      // 7. Secondary labels appear last
      tl.from(
        '.hero-meta',
        {
          opacity: 0,
          y: 10,
          duration: 0.8,
        },
        '-=0.4'
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[600px] flex flex-col justify-between overflow-hidden select-none"
      aria-label="SK SOLAR WALA Hero Section"
    >
      {/* Background Video & Atmospheric Fill */}
      <HeroBackground />

      {/* Main Content Safe Zone (Top-Left Sky Area) */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 pt-16 sm:pt-22 md:pt-28 lg:pt-32 flex-1 flex flex-col justify-start">
        <HeroContent onExplore={onExplore} onBrowse={onBrowse} />
      </div>

      {/* Hero Meta & Footnotes */}
      <HeroMeta />
    </section>
  );
};
