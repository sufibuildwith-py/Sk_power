import React, { useRef, useState, useEffect } from 'react';

interface DraggableCardTrackProps {
  children: React.ReactNode[];
  direction?: 'left-to-right' | 'right-to-left';
  speed?: number; // retained for interface compatibility
  pauseOnHover?: boolean; // retained for interface compatibility
  className?: string;
  trackClassName?: string;
  ariaLabel?: string;
}

export const DraggableCardTrack: React.FC<DraggableCardTrackProps> = ({
  children,
  direction = 'left-to-right',
  className = '',
  trackClassName = '',
  ariaLabel = 'Interactive Card Collection',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Desktop mouse drag tracking
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // One-time entrance reveal using IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // reveal once and stay stationary
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Desktop mouse drag handlers (pure mouse events; zero interference with mobile touch)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isMouseDown.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isMouseDown.current = false;
  };

  // Directional translation offset for staggered one-time entrance reveal:
  // Row 01 & Row 03 (left-to-right): cards reveal sliding gently from left (-20px)
  // Row 02 & Row 04 (right-to-left): cards reveal sliding gently from right (+20px)
  const isLtoR = direction === 'left-to-right';
  const initialOffset = isLtoR ? -20 : 20;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      role="region"
      aria-label={ariaLabel}
    >
      {/* Scrollable track with native touch scrolling on mobile, CSS snap, and no-scrollbar */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="overflow-x-auto no-scrollbar snap-x snap-mandatory py-4 px-1 cursor-grab active:cursor-grabbing select-none"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x pan-y',
        }}
      >
        <div className={`flex items-stretch ${trackClassName}`}>
          {React.Children.map(children, (child, idx) => {
            const delay = `${Math.min(idx * 0.08, 0.40)}s`;
            return (
              <div
                key={idx}
                className="snap-start shrink-0 transition-all duration-500 ease-out"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? 'translate3d(0, 0, 0)'
                    : `translate3d(${initialOffset}px, 0, 0)`,
                  transitionDelay: isVisible ? delay : '0s',
                }}
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
