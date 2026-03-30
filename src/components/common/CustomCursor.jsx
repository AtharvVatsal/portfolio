import React, { useRef, useEffect, useState } from 'react';

/**
 * Global custom cursor — mount ONCE at the App/Router level.
 * Self-contained touch detection, DPR-aware canvas,
 * and idle-pause so it stops burning CPU when the mouse is still.
 */
const CustomCursor = () => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const trailPoints = useRef([]);
  const animationRef = useRef(null);
  const isMoving = useRef(false);
  const idleTimer = useRef(null);
  const startLoopRef = useRef(null);

  // Self-contained touch detection
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(
      'ontouchstart' in window || navigator.maxTouchPoints > 0
    );
  }, []);

  // Canvas setup + animation loop
  useEffect(() => {
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setCanvasSize();

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      cursorPos.current.x = lerp(cursorPos.current.x, mousePos.current.x, 0.4);
      cursorPos.current.y = lerp(cursorPos.current.y, mousePos.current.y, 0.4);

      // Trail
      trailPoints.current.push({ x: cursorPos.current.x, y: cursorPos.current.y });
      if (trailPoints.current.length > 12) trailPoints.current.shift();

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const x = cursorPos.current.x;
      const y = cursorPos.current.y;

      // Skip if cursor hasn't entered window yet
      if (x < -50 && y < -50) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Trail line
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

        // Trail dots
        trailPoints.current.forEach((pt, i) => {
          const alpha = (i / trailPoints.current.length) * 0.5;
          const radius = (i / trailPoints.current.length) * 4 + 1;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
          ctx.fill();
        });
      }

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

      // Keep running while lerp hasn't settled
      const dist =
        Math.abs(cursorPos.current.x - mousePos.current.x) +
        Math.abs(cursorPos.current.y - mousePos.current.y);

      if (isMoving.current || dist > 0.5) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Clear trail so no ghost marks remain when paused
        trailPoints.current = [];
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Draw only the static cursor dot (no trail/glow) for final frame
        const fx = cursorPos.current.x;
        const fy = cursorPos.current.y;
        if (fx > -50 && fy > -50) {
          // Subtle ring
          ctx.beginPath();
          ctx.arc(fx, fy, 10, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
          ctx.lineWidth = 2;
          ctx.stroke();
          // Center dot
          ctx.beginPath();
          ctx.arc(fx, fy, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(34, 211, 238, 0.9)';
          ctx.fill();
        }

        animationRef.current = null; // pause — CPU rest
      }
    };

    const startLoop = () => {
      if (animationRef.current) return;
      animationRef.current = requestAnimationFrame(animate);
    };
    startLoopRef.current = startLoop;
    startLoop();

    window.addEventListener('resize', setCanvasSize, { passive: true });

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      startLoopRef.current = null;
    };
  }, [isTouchDevice]);

  // Mouse tracking (separate effect so it survives canvas re-init)
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      isMoving.current = true;

      // Wake the loop if it paused
      if (!animationRef.current && startLoopRef.current) {
        startLoopRef.current();
      }

      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        isMoving.current = false;
      }, 150);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(idleTimer.current);
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