import React, { useRef, useEffect } from 'react';

const CustomCursor = ({ isTouchDevice }) => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const trailPoints = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      // Smooth cursor movement
      cursorPos.current.x = lerp(cursorPos.current.x, mousePos.current.x, 0.15);
      cursorPos.current.y = lerp(cursorPos.current.y, mousePos.current.y, 0.15);

      // Add point to trail
      trailPoints.current.push({
        x: cursorPos.current.x,
        y: cursorPos.current.y,
      });

      if (trailPoints.current.length > 12) {
        trailPoints.current.shift();
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail line
      if (trailPoints.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trailPoints.current[0].x, trailPoints.current[0].y);

        for (let i = 1; i < trailPoints.current.length; i++) {
          ctx.lineTo(trailPoints.current[i].x, trailPoints.current[i].y);
        }

        ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw trail dots
        trailPoints.current.forEach((point, index) => {
          const alpha = (index / trailPoints.current.length) * 0.5;
          const radius = (index / trailPoints.current.length) * 4 + 1;

          ctx.beginPath();
          ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
          ctx.fill();
        });
      }

      // Draw cursor glow (drawn on canvas = no lag)
      const x = cursorPos.current.x;
      const y = cursorPos.current.y;

      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
      gradient.addColorStop(0.5, 'rgba(34, 211, 238, 0.1)');
      gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Middle ring
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.9)';
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', setCanvasSize, { passive: true });

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
};

export default CustomCursor;
