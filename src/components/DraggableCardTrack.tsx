import React from 'react';
import { useDraggableInfiniteReel, ReelOptions } from '../hooks/useDraggableInfiniteReel';

export interface DraggableCardTrackProps {
  children: React.ReactNode[];
  direction?: 'left-to-right' | 'right-to-left' | 'right' | 'left';
  speedDesktop?: number;
  speedMobile?: number;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
  trackClassName?: string;
  ariaLabel?: string;
}

export const DraggableCardTrack: React.FC<DraggableCardTrackProps> = ({
  children,
  direction = 'left-to-right',
  speedDesktop,
  speedMobile,
  speed,
  pauseOnHover = false,
  className = '',
  trackClassName = 'gap-4 sm:gap-6 md:gap-8',
  ariaLabel = 'Interactive Card Reel',
}) => {
  // Respect speedDesktop / speedMobile or single speed override; default to 26 / 20 px/s
  const effectiveDesktop = speedDesktop ?? speed ?? 26;
  const effectiveMobile = speedMobile ?? (speed ? Math.min(speed, 20) : 20);

  const reelOptions: ReelOptions = {
    direction,
    speedDesktop: effectiveDesktop,
    speedMobile: effectiveMobile,
    pauseOnHover,
  };

  const reel = useDraggableInfiniteReel(reelOptions);

  return (
    <div
      ref={reel.viewportRef}
      onPointerDown={reel.handlePointerDown}
      onPointerMove={reel.handlePointerMove}
      onPointerUp={reel.handlePointerUp}
      onPointerCancel={reel.handlePointerCancel}
      onLostPointerCapture={reel.handlePointerCancel}
      onClickCapture={reel.handleClickCapture}
      onMouseEnter={reel.handleMouseEnter}
      onMouseLeave={reel.handleMouseLeave}
      style={{ touchAction: 'pan-y' }}
      className={`relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
      role="region"
      aria-label={ariaLabel}
    >
      {/* Direct-DOM transform track driven by GSAP ticker */}
      <div
        ref={reel.trackRef}
        className={`flex items-stretch will-change-transform w-max ${trackClassName}`}
      >
        {/* SET 0: Left buffer (aria-hidden for screen-reader / a11y integrity) */}
        <div aria-hidden="true" className={`flex items-stretch shrink-0 ${trackClassName}`}>
          {React.Children.map(children, (child, idx) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                key: `set0-${idx}`,
                tabIndex: -1,
              });
            }
            return child;
          })}
        </div>

        {/* SET 1: Measured master set (observed by ResizeObserver) */}
        <div ref={reel.singleSetRef} className={`flex items-stretch shrink-0 ${trackClassName}`}>
          {children}
        </div>

        {/* SET 2: Right buffer (aria-hidden for screen-reader / a11y integrity) */}
        <div aria-hidden="true" className={`flex items-stretch shrink-0 ${trackClassName}`}>
          {React.Children.map(children, (child, idx) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                key: `set2-${idx}`,
                tabIndex: -1,
              });
            }
            return child;
          })}
        </div>
      </div>
    </div>
  );
};
