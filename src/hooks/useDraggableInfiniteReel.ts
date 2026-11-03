import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

export interface ReelOptions {
  direction?: 'left' | 'right' | 'left-to-right' | 'right-to-left';
  speedDesktop?: number;
  speedMobile?: number;
  gapFallback?: number;
  pauseOnHover?: boolean;
}

export function useDraggableInfiniteReel({
  direction = 'right',
  speedDesktop = 26,
  speedMobile = 20,
  gapFallback = 24,
  pauseOnHover = false,
}: ReelOptions = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);

  // Direction: 'right' or 'left-to-right' -> positive speed (moves left-to-right)
  // 'left' or 'right-to-left' -> negative speed (moves right-to-left)
  const isLtoR = direction === 'right' || direction === 'left-to-right';
  const initialBaseSpeed = isLtoR ? speedDesktop : -speedDesktop;

  const xRef = useRef<number>(0);
  const baseSpeedRef = useRef<number>(initialBaseSpeed);
  const velocityRef = useRef<number>(initialBaseSpeed);
  const isDraggingRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const singleSetWidthRef = useRef<number>(0);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);
  const pointerHistoryRef = useRef<{ dx: number; dt: number }[]>([]);
  const hasDraggedRef = useRef<boolean>(false);
  const justDraggedRef = useRef<boolean>(false);
  const prefersReducedMotionRef = useRef<boolean>(false);

  // Measure Stride: Set 1 width + gap between sets
  const measureStride = useCallback(() => {
    if (!singleSetRef.current || !trackRef.current) return;
    const style = window.getComputedStyle(trackRef.current);
    const gap = parseFloat(style.columnGap || style.gap) || gapFallback;
    const stride = singleSetRef.current.offsetWidth + gap;
    singleSetWidthRef.current = stride;

    // Initial position: set to -stride so Set 1 sits flush with viewport,
    // with Set 0 acting as left buffer and Set 2 as right buffer
    if (xRef.current === 0 && stride > 0) {
      xRef.current = -stride;
      trackRef.current.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
    }
  }, [gapFallback]);

  useEffect(() => {
    // 1. Accessibility: Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
      const isMobile = window.innerWidth < 768;
      const targetSpeed = isMobile ? speedMobile : speedDesktop;
      baseSpeedRef.current = e.matches ? 0 : (isLtoR ? targetSpeed : -targetSpeed);
      velocityRef.current = baseSpeedRef.current;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    // 2. Set responsive cruising speed
    const isMobile = window.innerWidth < 768;
    const targetSpeed = isMobile ? speedMobile : speedDesktop;
    baseSpeedRef.current = prefersReducedMotionRef.current
      ? 0
      : (isLtoR ? targetSpeed : -targetSpeed);
    velocityRef.current = baseSpeedRef.current;

    // 3. Initial measurement and ResizeObserver on Set 1
    measureStride();
    const resizeObserver = new ResizeObserver(() => measureStride());
    if (singleSetRef.current) resizeObserver.observe(singleSetRef.current);

    const handleWindowResize = () => {
      const mobile = window.innerWidth < 768;
      const spd = mobile ? speedMobile : speedDesktop;
      baseSpeedRef.current = prefersReducedMotionRef.current
        ? 0
        : (isLtoR ? spd : -spd);
      measureStride();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver.disconnect();
    };
  }, [isLtoR, measureStride, speedDesktop, speedMobile]);

  // GSAP Ticker animation loop with Viewport IntersectionObserver
  useEffect(() => {
    let isActive = false;

    const updateTicker = (_: number, deltaTime: number) => {
      const stride = singleSetWidthRef.current;
      if (stride <= 0) return;

      const dt = Math.min(deltaTime / 1000, 0.1);

      if (!isDraggingRef.current) {
        if (prefersReducedMotionRef.current) {
          velocityRef.current = 0;
        } else if (pauseOnHover && isHoveredRef.current) {
          // Gently brake if pauseOnHover is requested
          velocityRef.current += (0 - velocityRef.current) * (1 - Math.exp(-4.0 * dt));
        } else {
          // Exponential relaxation back to target cruising speed
          velocityRef.current += (baseSpeedRef.current - velocityRef.current) * (1 - Math.exp(-3.5 * dt));
        }
        xRef.current += velocityRef.current * dt;
      }

      // Seamless Modulo Wrapping across 3 sets
      while (xRef.current <= -2 * stride) xRef.current += stride;
      while (xRef.current >= 0) xRef.current -= stride;

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${xRef.current.toFixed(2)}px, 0, 0)`;
      }
    };

    // IntersectionObserver detaches ticker when >250px away from viewport
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isActive) {
          isActive = true;
          gsap.ticker.add(updateTicker);
        } else if (!entry.isIntersecting && isActive) {
          isActive = false;
          gsap.ticker.remove(updateTicker);
        }
      },
      { rootMargin: '250px 0px' }
    );

    if (viewportRef.current) {
      intersectionObserver.observe(viewportRef.current);
    }

    return () => {
      gsap.ticker.remove(updateTicker);
      intersectionObserver.disconnect();
    };
  }, [pauseOnHover]);

  // Pointer Drag Interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    hasDraggedRef.current = false;
    isDraggingRef.current = false;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    pointerHistoryRef.current = [];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!lastPointerTimeRef.current) return;
    const now = performance.now();
    const dx = e.clientX - lastPointerXRef.current;

    // 5px discrimination threshold to distinguish clicks from drags
    if (!hasDraggedRef.current && Math.abs(dx) > 5) {
      hasDraggedRef.current = true;
      isDraggingRef.current = true;
      setIsDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }

    if (hasDraggedRef.current) {
      xRef.current += dx;
      const dt = (now - lastPointerTimeRef.current) / 1000;
      if (dt > 0.001) {
        pointerHistoryRef.current.push({ dx, dt });
        if (pointerHistoryRef.current.length > 5) pointerHistoryRef.current.shift();
        velocityRef.current = dx / dt;
      }
      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = now;

      const stride = singleSetWidthRef.current;
      if (stride > 0) {
        while (xRef.current <= -2 * stride) xRef.current += stride;
        while (xRef.current >= 0) xRef.current -= stride;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${xRef.current.toFixed(2)}px, 0, 0)`;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    lastPointerTimeRef.current = 0;
    if (hasDraggedRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}

      // Calculate inertia release velocity from recent history, clamped to [-1200, 1200]
      if (pointerHistoryRef.current.length > 0) {
        const totalDx = pointerHistoryRef.current.reduce((sum, i) => sum + i.dx, 0);
        const totalDt = pointerHistoryRef.current.reduce((sum, i) => sum + i.dt, 0);
        if (totalDt > 0.005) {
          velocityRef.current = Math.max(-1200, Math.min(1200, totalDx / totalDt));
        }
      }

      justDraggedRef.current = true;
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 90);
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDraggedRef.current || justDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  return {
    viewportRef,
    trackRef,
    singleSetRef,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleClickCapture,
    handleMouseEnter,
    handleMouseLeave,
    justDraggedRef,
  };
}
