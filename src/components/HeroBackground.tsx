import React, { useState, useRef, useEffect } from 'react';

export const HeroBackground: React.FC = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const handleCanPlay = () => {
    setVideoLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none bg-[#8ba3b3]"
      aria-hidden="true"
    >
      {/* Visual background fill for ultra-wide displays matching video atmospheric tones */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at 52% 52%, #9cb1c0 0%, #8ba3b3 60%, #829aa9 100%)'
        }}
      />

      {/* Video layer: on landscape full height; on portrait screens positioned in lower canvas with seamless sky blend */}
      <div className="absolute inset-x-0 bottom-0 portrait:top-[36%] sm:portrait:top-[30%] landscape:top-0 w-full portrait:h-[64%] sm:portrait:h-[70%] landscape:h-full">
        {/* Poster image fallback */}
        <img
          src="/hero-poster.jpg"
          alt=""
          className={`absolute inset-0 w-full h-full object-cover portrait:object-[52%_45%] landscape:object-[50%_50%] transition-opacity duration-1000 ease-out ${
            videoLoaded && !hasError ? 'opacity-0' : 'opacity-100'
          }`}
          loading="eager"
        />

        {/* Primary Video Element */}
        {!hasError && (
          <video
            ref={videoRef}
            src="/hero.mp4"
            poster="/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={handleCanPlay}
            onError={handleError}
            className={`absolute inset-0 w-full h-full object-cover portrait:object-[52%_45%] landscape:object-[50%_50%] transition-opacity duration-700 ease-out ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Seamless background-matched watermark concealer tracking video coordinates */}
        <div className="hero-video-frame pointer-events-none">
          <div className="hero-watermark-concealer" />
        </div>

        {/* Seamless sky blend on portrait top edge */}
        <div
          className="absolute inset-x-0 top-0 h-24 sm:h-32 pointer-events-none portrait:block landscape:hidden"
          style={{
            background: 'linear-gradient(to bottom, #8ba3b3 0%, rgba(139, 163, 179, 0.7) 40%, transparent 100%)'
          }}
        />
      </div>

      {/* Desktop subtle atmospheric radial wash in upper-left sky for typography clarity */}
      <div
        className="hidden landscape:block absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 18% 22%, rgba(247, 245, 239, 0.35) 0%, rgba(132, 158, 173, 0.15) 50%, transparent 80%)'
        }}
      />
    </div>
  );
};
