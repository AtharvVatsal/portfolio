import React, { useEffect, useState, useRef, useCallback } from 'react';

// ─── KONAMI CODE HOOK ───────────────────────────────────

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export const useKonamiCode = (onActivate) => {
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const expected = KONAMI_SEQUENCE[indexRef.current];

      if (e.key === expected || e.key.toLowerCase() === expected) {
        indexRef.current++;

        // Reset if no key pressed within 2 seconds
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          indexRef.current = 0;
        }, 2000);

        if (indexRef.current === KONAMI_SEQUENCE.length) {
          indexRef.current = 0;
          clearTimeout(timerRef.current);
          onActivate();
        }
      } else {
        indexRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timerRef.current);
    };
  }, [onActivate]);
};

// ─── MATRIX RAIN COMPONENT ──────────────────────────────

const ML_CHARS = [
  'import', 'torch', 'numpy', 'def', 'class', 'model', 'train',
  'loss', 'epoch', 'batch', 'YOLO', 'U-Net', 'CNN', 'ReLU', 'Adam',
  'predict', 'fit()', 'grad', 'tensor', 'cuda', 'GPU', 'mAP',
  'F1', '0.874', '0.98', 'λ', 'θ', 'Σ', '∂', '∇', 'α', 'β',
  'pip', 'git', 'ssh', 'sudo', 'npm', 'react', 'async', 'await',
  'Python', 'PyTorch', 'OpenCV', 'Flask', 'API', 'JSON', 'POST',
  '>>>', '===', '!=', '=>', '{}', '[]', '//', '##', '**',
  'print()', 'return', 'yield', 'lambda', 'self', '__init__',
  'sklearn', 'pandas', 'plt.show()', 'fit_transform', 'accuracy',
  'recall', 'precision', 'IoU', 'mIoU', 'BDD100K', 'ResNet',
  '01001', '10110', '11010', '00111', '10101',
];

const MatrixColumn = ({ x, speed, chars, opacity, fontSize }) => {
  const [offset, setOffset] = useState(Math.random() * -100);

  useEffect(() => {
    let raf;
    let lastTime = 0;

    const animate = (time) => {
      if (time - lastTime > 50) {
        setOffset((prev) => (prev + speed > 110 ? -20 : prev + speed));
        lastTime = time;
      }
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  return (
    <div
      className="absolute top-0 flex flex-col items-center pointer-events-none select-none"
      style={{
        left: `${x}%`,
        transform: `translateY(${offset}vh)`,
        opacity,
        fontSize: `${fontSize}px`,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        lineHeight: '1.6',
      }}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className={i === chars.length - 1 ? 'text-white font-bold' : 'text-cyan-400/70'}
          style={{
            textShadow: i === chars.length - 1
              ? '0 0 12px rgba(34, 211, 238, 0.8)'
              : '0 0 4px rgba(34, 211, 238, 0.3)',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

export const MatrixRain = ({ isActive, onComplete }) => {
  const [columns, setColumns] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setColumns([]);
      setShowMessage(false);
      setFadeOut(false);
      return;
    }

    // Generate columns
    const cols = [];
    const count = Math.floor(window.innerWidth / 60);
    for (let i = 0; i < count; i++) {
      const charCount = 4 + Math.floor(Math.random() * 6);
      const shuffled = [...ML_CHARS].sort(() => Math.random() - 0.5);
      cols.push({
        id: i,
        x: (i / count) * 100 + Math.random() * 3,
        speed: 0.8 + Math.random() * 1.5,
        chars: shuffled.slice(0, charCount),
        opacity: 0.3 + Math.random() * 0.5,
        fontSize: 10 + Math.floor(Math.random() * 4),
      });
    }
    setColumns(cols);

    // Show hidden message after 1.5s
    const msgTimer = setTimeout(() => setShowMessage(true), 1500);

    // Start fade out
    const fadeTimer = setTimeout(() => setFadeOut(true), 5000);

    // Complete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5800);

    return () => {
      clearTimeout(msgTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] transition-opacity duration-700 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'rgba(0, 2, 8, 0.92)' }}
    >
      {/* Rain columns */}
      <div className="absolute inset-0 overflow-hidden">
        {columns.map((col) => (
          <MatrixColumn key={col.id} {...col} />
        ))}
      </div>

      {/* Hidden message */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${
          showMessage ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <div className="text-center px-6 relative">
          {/* Glow behind text */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl scale-150"></div>
          
          <div className="relative">
            <p className="text-cyan-400 text-xs sm:text-sm tracking-[0.3em] uppercase mb-3 font-mono">
              // easter egg unlocked
            </p>
            <h2
              className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              style={{ textShadow: '0 0 40px rgba(34, 211, 238, 0.3)' }}
            >
              You found it!
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto mb-2">
              You're clearly the curious type — that's exactly who I want to work with.
            </p>
            <p className="text-gray-600 text-xs font-mono">
              ↑↑↓↓←→←→BA • Thanks for exploring!
            </p>
          </div>
        </div>
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)',
        }}
      />
    </div>
  );
};

export default MatrixRain;