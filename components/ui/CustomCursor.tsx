'use client';
import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    // Only initialize cursor on devices with fine pointer (mouse/trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const cursor = document.createElement('div');
    cursor.className = `fixed w-8 h-8 border-2 border-purple-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform duration-150 hidden md:block`;
    
    document.body.appendChild(cursor);
    document.body.classList.add('hide-default-cursor');

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const onMouseDown = () => {
      cursor.style.transform = 'scale(0.7)';
    };
    
    const onMouseUp = () => {
      cursor.style.transform = 'scale(1)';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.classList.remove('hide-default-cursor');
      cursor.remove();
    };
  }, []);

  return null;
}
