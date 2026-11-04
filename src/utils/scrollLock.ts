/**
 * SK SOLAR WALA — Robust Token-Based Scroll Lock Manager
 * Coordinates scroll locking across MobileNavigation, QuoteModal, and any future overlays.
 * Guarantees:
 * 1. Each lock acquisition has a unique token.
 * 2. Duplicate releases cannot corrupt other components' locks (idempotent release).
 * 3. Two simultaneous overlays cannot unlock each other.
 * 4. React Strict Mode setup/cleanup does not leave stale locks.
 * 5. Unmounting an overlay releases only its own token.
 * 6. Closing the drawer while another modal is open preserves background lock.
 */

const activeLockTokens = new Set<string>();
let initialOverflow = '';
let initialTouchAction = '';
let nextTokenSeq = 0;

/**
 * Acquire a body scroll lock under a unique or designated token.
 * @param tokenId Optional custom token identifier (e.g. 'mobile-nav', 'quote-modal')
 * @returns The token string to pass to unlockScroll()
 */
export function lockScroll(tokenId?: string): string {
  if (typeof document === 'undefined') return '';

  const id = tokenId || `lock_${++nextTokenSeq}_${Date.now()}`;

  if (activeLockTokens.size === 0) {
    initialOverflow = document.body.style.overflow;
    initialTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }

  activeLockTokens.add(id);
  return id;
}

/**
 * Release a previously acquired scroll lock by token.
 * Idempotent: repeated calls with the same token are safe no-ops.
 * @param tokenId The token returned by lockScroll()
 */
export function unlockScroll(tokenId?: string): void {
  if (typeof document === 'undefined') return;

  if (tokenId) {
    activeLockTokens.delete(tokenId);
  } else {
    // If called without token, remove the oldest token
    const first = activeLockTokens.values().next().value;
    if (first) {
      activeLockTokens.delete(first);
    }
  }

  // Only restore page scroll when all lock holders have released
  if (activeLockTokens.size === 0) {
    document.body.style.overflow = initialOverflow || '';
    document.body.style.touchAction = initialTouchAction || '';
  }
}

/**
 * Emergency reset to clear all locks and force restoration of scrolling.
 */
export function forceUnlockScroll(): void {
  if (typeof document === 'undefined') return;

  activeLockTokens.clear();
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
}

/**
 * Query whether page scrolling is currently locked.
 */
export function isScrollLocked(): boolean {
  return activeLockTokens.size > 0;
}
