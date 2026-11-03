import React, { useRef, useEffect, useCallback } from 'react';

interface DraggableCardTrackProps {
  children: React.ReactNode[];
  direction?: 'left-to-right' | 'right-to-left';
  speed?: number; // base speed in px/s (default 22 desktop, 14 mobile)
  pauseOnHover?: boolean;
  className?: string;
  trackClassName?: string;
  ariaLabel?: string;
}

export const DraggableCardTrack: React.FC<DraggableCardTrackProps> = ({
  children,
  direction = 'left-to-right',
  speed = 22,
  pauseOnHover = true,
  className = '',
  trackClassName = '',
  ariaLabel = 'Interactive Card Carousel',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const set1Ref = useRef<HTMLDivElement>(null);

  // Position and dimension refs (updated without triggering React re-renders)
  const offsetRef = useRef<number>(0);
  const singleWidthRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const rafIdRef = useRef<number | null>(null);

  // State flags
  const isInViewportRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const hasMovedRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startOffsetRef = useRef<number>(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotionRef = useRef<boolean>(false);

  // Check viewport device width for mobile speed tuning
  const isMobileRef = useRef<boolean>(false);

  // Measure single set width (reads layout only on resize, never in ticker)
  const measure = useCallback(() => {
    if (set1Ref.current) {
      const width = set1Ref.current.scrollWidth;
      if (width > 0) {
        singleWidthRef.current = width;
        // Normalize offset within [-width, 0]
        if (offsetRef.current > 0 || offsetRef.current < -width) {
          offsetRef.current = offsetRef.current % width;
          if (offsetRef.current > 0) offsetRef.current -= width;
        }
      }
    }
    isMobileRef.current = window.innerWidth < 768;
  }, []);

  // Main animation ticker loop
  const tick = useCallback((time: number) => {
    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = time;

    const width = singleWidthRef.current;

    if (
      width > 0 &&
      isInViewportRef.current &&
      !isDraggingRef.current &&
      !prefersReducedMotionRef.current &&
      !(isHoveredRef.current && pauseOnHover)
    ) {
      // Responsive speed: calm ~13px/s on mobile, ~22px/s on desktop
      const currentSpeed = isMobileRef.current ? Math.min(speed, 14) : speed;
      const isLtoR = direction === 'left-to-right';

      if (isLtoR) {
        // Moves rightwards
        offsetRef.current += currentSpeed * dt;
        if (offsetRef.current >= 0) {
          offsetRef.current -= width;
        }
      } else {
        // Moves leftwards
        offsetRef.current -= currentSpeed * dt;
        if (offsetRef.current <= -width) {
          offsetRef.current += width;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;
      }
    }

    if (isInViewportRef.current && !prefersReducedMotionRef.current) {
      rafIdRef.current = requestAnimationFrame(tick);
    }
  }, [direction, speed, pauseOnHover]);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleMediaChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    // Initial width measurement
    measure();
    window.addEventListener('resize', measure);

    // Initialize initial offset:
    // Left-to-Right starts at -singleWidth so it smoothly advances rightward from 0
    if (direction === 'left-to-right' && singleWidthRef.current > 0) {
      offsetRef.current = -singleWidthRef.current;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current.toFixed(2)}px, 0, 0)`;
      }
    }

    // Viewport intersection observer to completely idle off-screen tracks
    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;
        isInViewportRef.current = isIntersecting;

        if (isIntersecting && !prefersReducedMotionRef.current) {
          lastTimeRef.current = performance.now();
          if (!rafIdRef.current) {
            rafIdRef.current = requestAnimationFrame(tick);
          }
        } else if (!isIntersecting && rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('resize', measure);
      observer.disconnect();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [measure, tick, direction]);

  // Pointer drag interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary button
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    startOffsetRef.current = offsetRef.current;

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 4) {
      hasMovedRef.current = true;
    }

    const width = singleWidthRef.current;
    let newOffset = startOffsetRef.current + deltaX;

    if (width > 0) {
      while (newOffset > 0) newOffset -= width;
      while (newOffset < -width) newOffset += width;
    }

    offsetRef.current = newOffset;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${newOffset.toFixed(2)}px, 0, 0)`;
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Resume smooth leisurely auto-glide after 1.2s idle
    idleTimerRef.current = setTimeout(() => {
      lastTimeRef.current = performance.now();
    }, 1200);

    setTimeout(() => {
      hasMovedRef.current = false;
    }, 80);
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        handlePointerUp();
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClickCapture={handleClickCapture}
      style={{ touchAction: 'pan-y' }}
    >
      <div
        ref={trackRef}
        className="flex items-stretch w-max will-change-transform"
        style={{
          transform: `translate3d(${offsetRef.current}px, 0, 0)`,
        }}
      >
        {/* Set 1: Primary Content */}
        <div ref={set1Ref} className={`flex items-stretch ${trackClassName}`}>
          {children}
        </div>

        {/* Set 2: Seamless Duplication for loop continuity (hidden from screen reader) */}
        <div
          aria-hidden="true"
          className={`flex items-stretch ${trackClassName}`}
        >
          {React.Children.map(children, (child) => (
            <div tabIndex={-1} className="pointer-events-auto">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
