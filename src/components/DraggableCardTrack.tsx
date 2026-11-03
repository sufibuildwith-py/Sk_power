import React, { useRef, useState, useEffect, useCallback } from 'react';

interface DraggableCardTrackProps {
  children: React.ReactNode[];
  direction?: 'left-to-right' | 'right-to-left';
  speed?: number; // pixels per second (calm Apple-style glide: ~24)
  pauseOnHover?: boolean;
  className?: string;
  trackClassName?: string;
  ariaLabel?: string;
}

export const DraggableCardTrack: React.FC<DraggableCardTrackProps> = ({
  children,
  direction = 'left-to-right',
  speed = 26,
  pauseOnHover = true,
  className = '',
  trackClassName = '',
  ariaLabel = 'Interactive Card Carousel',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Animation & Position refs (avoiding re-renders for 60/120fps fluid movement)
  const offsetRef = useRef<number>(0);
  const singleWidthRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const animationFrameId = useRef<number | null>(null);

  // Drag tracking refs
  const dragStartPointerX = useRef<number>(0);
  const dragStartOffset = useRef<number>(0);
  const lastPointerX = useRef<number>(0);
  const lastPointerTime = useRef<number>(performance.now());
  const velocityRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const hasMovedRef = useRef<boolean>(false);
  const idleResumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reduced motion preference
  const prefersReducedMotion = useRef<boolean>(false);

  // Measure single content set width
  const measureWidth = useCallback(() => {
    if (singleSetRef.current) {
      const width = singleSetRef.current.getBoundingClientRect().width;
      if (width > 0) {
        singleWidthRef.current = width;
        // Keep offset bounded within [-width, 0]
        if (offsetRef.current < -width || offsetRef.current > 0) {
          offsetRef.current = offsetRef.current % width;
          if (offsetRef.current > 0) offsetRef.current -= width;
        }
      }
    }
  }, []);

  useEffect(() => {
    // Check reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    measureWidth();
    window.addEventListener('resize', measureWidth);

    // Initial positioning: L-to-R starts at -singleWidth so it seamlessly glides rightwards
    if (direction === 'left-to-right' && singleWidthRef.current > 0) {
      offsetRef.current = -singleWidthRef.current;
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', measureWidth);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (idleResumeTimerRef.current) clearTimeout(idleResumeTimerRef.current);
    };
  }, [measureWidth, direction]);

  // Main animation ticker loop
  useEffect(() => {
    const isMovingLeftToRight = direction === 'left-to-right';
    const sign = isMovingLeftToRight ? 1 : -1;

    const animate = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;

      const singleWidth = singleWidthRef.current;

      if (singleWidth > 0 && !prefersReducedMotion.current) {
        if (isPointerDownRef.current) {
          // While dragging: offset is directly controlled by pointer movement
        } else if (Math.abs(velocityRef.current) > 1.5) {
          // Inertia momentum phase
          offsetRef.current += velocityRef.current * dt;
          velocityRef.current *= 0.94; // smooth friction decay
        } else if (!isHovered || !pauseOnHover) {
          // Normal leisurely automatic movement
          offsetRef.current += sign * speed * dt;
        }

        // Seamless wrap calculation within [-singleWidth, 0]
        if (offsetRef.current > 0) {
          offsetRef.current -= singleWidth;
        } else if (offsetRef.current < -singleWidth) {
          offsetRef.current += singleWidth;
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [direction, speed, isHovered, pauseOnHover]);

  // Pointer event handlers (Universal: Mouse, Touch, Stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only handle primary pointer (left mouse or main touch)
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isPointerDownRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartPointerX.current = e.clientX;
    dragStartOffset.current = offsetRef.current;
    lastPointerX.current = e.clientX;
    lastPointerTime.current = performance.now();
    velocityRef.current = 0;

    if (idleResumeTimerRef.current) {
      clearTimeout(idleResumeTimerRef.current);
      idleResumeTimerRef.current = null;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const deltaX = e.clientX - lastPointerX.current;
    const totalDeltaX = e.clientX - dragStartPointerX.current;
    const now = performance.now();
    const dt = Math.max((now - lastPointerTime.current) / 1000, 0.008);

    if (Math.abs(totalDeltaX) > 6) {
      hasMovedRef.current = true;
    }

    // Direct 1:1 tactile dragging
    offsetRef.current += deltaX;

    // Calculate instantaneous velocity for inertia
    velocityRef.current = deltaX / dt;

    lastPointerX.current = e.clientX;
    lastPointerTime.current = now;

    // Apply immediate transform
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    // Clamp velocity to comfortable bounds
    velocityRef.current = Math.max(-1200, Math.min(1200, velocityRef.current));

    // Idle timer before resuming auto-scroll
    idleResumeTimerRef.current = setTimeout(() => {
      velocityRef.current = 0;
    }, 1200);
  };

  // Prevent accidental clicks on child buttons/links if the user was dragging
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      hasMovedRef.current = false;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none ${className}`}
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle left & right glass gradient edge masks on wide displays */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-[#F7F5EF] via-[#F7F5EF]/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-[#F7F5EF] via-[#F7F5EF]/80 to-transparent z-10" />

      {/* Draggable Track Container */}
      <div
        className={`w-full py-4 cursor-grab active:cursor-grabbing ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{ touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
      >
        <div
          ref={trackRef}
          className="flex items-stretch will-change-transform"
          style={{ transform: `translate3d(${offsetRef.current}px, 0, 0)` }}
        >
          {/* Set 1: Primary set (accessible) */}
          <div ref={singleSetRef} className={`flex items-stretch shrink-0 ${trackClassName}`}>
            {children.map((child, idx) => (
              <div key={`primary-${idx}`} className="shrink-0 flex items-stretch">
                {child}
              </div>
            ))}
          </div>

          {/* Set 2: Seamless loop duplicate (hidden from screen reader / tab index) */}
          <div
            aria-hidden="true"
            className={`flex items-stretch shrink-0 ${trackClassName}`}
            tabIndex={-1}
          >
            {children.map((child, idx) => (
              <div key={`loop1-${idx}`} className="shrink-0 flex items-stretch" tabIndex={-1}>
                {child}
              </div>
            ))}
          </div>

          {/* Set 3: Wide display insurance duplicate */}
          <div
            aria-hidden="true"
            className={`flex items-stretch shrink-0 ${trackClassName}`}
            tabIndex={-1}
          >
            {children.map((child, idx) => (
              <div key={`loop2-${idx}`} className="shrink-0 flex items-stretch" tabIndex={-1}>
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};