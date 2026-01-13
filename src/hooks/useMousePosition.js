import { useState, useEffect, useRef } from 'react';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const velocity = {
        x: e.clientX - lastMousePos.current.x,
        y: e.clientY - lastMousePos.current.y
      };
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      setMousePosition({ x: e.clientX, y: e.clientY });
      setMouseVelocity(velocity);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return { mousePosition, mouseVelocity };
};

export default useMousePosition;
