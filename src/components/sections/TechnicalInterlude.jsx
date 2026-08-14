import React, { useState, useEffect } from 'react';
import { useInView } from '../../hooks/useInView';

const lines = [
  { text: '$ python train.py --pipeline object-detection --model yolov8m', delay: 0 },
  { text: '', delay: 400 },
  { text: '  Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â', delay: 800 },
  { text: '  Ã¢â€â€š  COMPUTER VISION PIPELINE                          Ã¢â€â€š', delay: 1000 },
  { text: '  Ã¢â€â€š  Input: 12,847 training images                     Ã¢â€â€š', delay: 1200 },
  { text: '  Ã¢â€â€š  Backbone: YOLOv8m (CSPDarknet)                    Ã¢â€â€š', delay: 1400 },
  { text: '  Ã¢â€â€š  Head: PAN-FPN + Decoupled Detection               Ã¢â€â€š', delay: 1600 },
  { text: '  Ã¢â€â€š  Loss: CIoU + DFL + Classification                 Ã¢â€â€š', delay: 1800 },
  { text: '  Ã¢â€â€š  Optimizer: SGD (lr=0.01, momentum=0.937)         Ã¢â€â€š', delay: 2000 },
  { text: '  Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ', delay: 2200 },
  { text: '', delay: 2400 },
  { text: '  Epoch     Loss      mAP@50    Speed                   ', delay: 2600 },
  { text: '  Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬', delay: 2800 },
  { text: '     1/50    3.214     0.112    2.4s                   ', delay: 3000 },
  { text: '    10/50    1.847     0.387    2.3s                   ', delay: 3200 },
  { text: '    25/50    0.921     0.501    2.3s                   ', delay: 3400 },
  { text: '    50/50    0.443     0.556    2.2s                   ', delay: 3600 },
  { text: '', delay: 3800 },
  { text: '  Ã¢Å“â€œ Model converged. Checkpoint saved to ./runs/detect/', delay: 4000 },
  { text: '', delay: 4200 },
  { text: '  $ Ã¢â€“Ë†', delay: 4400 },
];

const TechnicalInterlude = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (!inView) return;
    const timers = [];
    lines.forEach((line, i) => {
      if (line.text === '') {
        timers.push(setTimeout(() => setVisibleLines(v => Math.max(v, i + 1)), line.delay));
      } else {
        timers.push(setTimeout(() => setVisibleLines(v => Math.max(v, i + 1)), line.delay));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-neutral-950 py-24 sm:py-32">
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div
        className={`max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 transition-all duration-1000 ${
          inView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-2xl">
          <p className="font-mono text-[0.9rem] text-white/60 uppercase tracking-[0.25em] mb-6">
            Training Pipeline &mdash; Object Detection
          </p>

          <div className="font-mono text-[0.85rem] sm:text-[0.9rem] leading-[1.7]">
            {lines.map((line, i) => (
              <p
                key={i}
                className={`transition-all duration-500 ${
                  i < visibleLines
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2'
                } ${line.text.includes('Ã¢Å“â€œ') ? 'text-green-500/80' : 'text-white/60'}`}
                style={{ transitionDelay: '50ms' }}
              >
                {line.text || '\u00A0'}
              </p>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechnicalInterlude;
