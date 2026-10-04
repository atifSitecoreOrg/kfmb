'use client';

import { useEffect, useState } from 'react';

export const Default = (): null => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reduce || !finePointer) return;
    setEnabled(true);
    const cursor = document.createElement('div');
    cursor.setAttribute('aria-hidden', 'true');
    cursor.style.position = 'fixed';
    cursor.style.left = '0';
    cursor.style.top = '0';
    cursor.style.width = '48px';
    cursor.style.height = '48px';
    cursor.style.marginLeft = '-24px';
    cursor.style.marginTop = '-24px';
    cursor.style.borderRadius = '999px';
    cursor.style.border = '1px solid rgba(255,255,255,0.7)';
    cursor.style.background = 'rgba(255,255,255,0.18)';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '70';
    cursor.style.transition = 'transform 180ms ease-out';
    document.body.appendChild(cursor);
    const previous = document.body.style.cursor;
    document.body.style.cursor = 'none';
    const move = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    window.addEventListener('pointermove', move);
    return () => {
      window.removeEventListener('pointermove', move);
      cursor.remove();
      document.body.style.cursor = previous;
    };
  }, []);

  return enabled ? null : null;
};
