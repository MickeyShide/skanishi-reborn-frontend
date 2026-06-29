import { useEffect } from 'react';

export function usePointerCapture(ref) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let dragging = false;

    const isInteractiveTarget = (target) => {
      if (!(target instanceof Element)) return false;
      return Boolean(target.closest('button, a, input, textarea, select, [role="button"], [data-map-interactive="true"]'));
    };

    const handleDown = (event) => {
      if (isInteractiveTarget(event.target)) return;
      dragging = true;
      element.setPointerCapture?.(event.pointerId);
    };

    const handleUp = (event) => {
      if (!dragging) return;
      dragging = false;
      element.releasePointerCapture?.(event.pointerId);
    };

    const handleMove = (event) => {
      if (dragging) event.preventDefault();
    };

    element.addEventListener('pointerdown', handleDown);
    element.addEventListener('pointerup', handleUp);
    element.addEventListener('pointercancel', handleUp);
    element.addEventListener('pointermove', handleMove, { passive: false });

    return () => {
      element.removeEventListener('pointerdown', handleDown);
      element.removeEventListener('pointerup', handleUp);
      element.removeEventListener('pointercancel', handleUp);
      element.removeEventListener('pointermove', handleMove);
    };
  }, [ref]);
}

export default usePointerCapture;
