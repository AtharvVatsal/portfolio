import React, { useEffect, useState, useRef } from 'react';

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
          className={i === chars.length - 1 ? 'text-white font-bold' : 'text-blueprint/70'}
          style={{
            textShadow: i === chars.length - 1
              ? '0 0 12px rgba(99, 102, 241, 0.8)'
              : '0 0 4px rgba(99, 102, 241, 0.3)',
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

    const msgTimer = setTimeout(() => setShowMessage(true), 1500);
    const fadeTimer = setTimeout(() => setFadeOut(true), 5000);
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
      style={{ background: 'rgba(0, 0, 0, 0.95)' }}
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
          <div className="font-mono text-xs text-blueprint/60 tracking-[0.3em] uppercase mb-4">
            // easter egg unlocked
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl mb-4 text-ink-primary">
            You found it!
          </h2>
          <p className="text-ink-muted text-sm sm:text-base max-w-md mx-auto mb-3">
            You're clearly the curious type — that's exactly who I want to work with.
          </p>
          <p className="text-ink-faint text-xs font-mono">
            ↑↑↓↓←→←→BA · Thanks for exploring!
          </p>
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
