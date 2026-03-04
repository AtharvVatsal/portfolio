import { useState, useEffect, useRef, useCallback } from 'react';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const currentVel = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Store raw values in refs (no re-render)
      currentVel.current = {
        x: e.clientX - lastMousePos.current.x,
        y: e.clientY - lastMousePos.current.y,
      };
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      currentPos.current = { x: e.clientX, y: e.clientY };

      // Batch state update to next animation frame
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          setMousePosition({ ...currentPos.current });
          setMouseVelocity({ ...currentVel.current });
          rafId.current = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return { mousePosition, mouseVelocity };
};

export default useMousePosition;