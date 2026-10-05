import React, { useEffect, useRef } from 'react';

// Decorative change of "temperature" between two sections.
// requires an `isolate` ancestor. tone: 'warm' | 'quiet' | 'crossing'
// 'warm' and 'quiet' are zero-height glows painted behind content
// (see .archive-transition in index.css).
//
// 'crossing' marks the one boundary where the archive turns from engineering
// to photography: a band of warm, layered waves (ribbons of light over two
// darker grounds) that dissolves into the photographs below. Every layer
// drifts sideways and breathes on its own rhythm - CSS transforms only, so it
// runs on the compositor; paused off screen and still under reduced motion.

// Each shape is drawn over two identical periods so its layer can slide by
// exactly one period (translate -50%) and loop without a seam.
const VIEW_W = 2400;
const VIEW_H = 600;
const PERIOD = VIEW_W / 2;
const STEP = 15;

// harmonics: [multiple of the base period, amplitude, phase]
const wave = (base, harmonics, x) => {
  const t = (x / PERIOD) * Math.PI * 2;
  return base + harmonics.reduce((sum, [k, a, p]) => sum + a * Math.sin(k * t + p), 0);
};

const xs = Array.from({ length: VIEW_W / STEP + 1 }, (_, i) => i * STEP);
const pt = (x, y) => `${x} ${y.toFixed(1)}`;

// A ribbon of varying thickness: along the top edge, back along the bottom.
const ribbon = (base, shape, thick, thickness) => {
  const top = xs.map((x) => pt(x, wave(base, shape, x)));
  const bottom = xs.map((x) => pt(x, wave(base, shape, x) + wave(thick, thickness, x))).reverse();
  return `M${top.join('L')}L${bottom.join('L')}Z`;
};

// A ground: everything below a curve.
const ground = (base, shape) => `M${xs.map((x) => pt(x, wave(base, shape, x))).join('L')}L${VIEW_W} ${VIEW_H}L0 ${VIEW_H}Z`;

// The top edge of a ribbon, drawn on its own as a highlight.
const edge = (base, shape) => `M${xs.map((x) => pt(x, wave(base, shape, x))).join('L')}`;

const MAIN = [[1, 95, 2.6], [2, 30, 1.0], [3, 12, 0.4]];

// Back to front. Upper layers are lighter and softer, the middle carries the
// strongest forms, the grounds in front are darkest and fade toward the photos.
const LAYERS = [
  { id: 'veil', d: ribbon(160, [[1, 42, 0.3], [2, 18, 2.0]], 95, [[1, 32, 1.1]]) },
  { id: 'amber', d: ribbon(220, [[1, 72, 1.2], [2, 22, 0.2], [3, 10, 2.5]], 48, [[2, 16, 0.7]]) },
  { id: 'ochre', d: ribbon(275, MAIN, 72, [[1, 26, 2.2], [3, 10, 0.5]]), highlight: edge(275, MAIN) },
  { id: 'sienna', d: ribbon(315, [[1, 82, 4.4], [2, 36, 3.3]], 60, [[2, 20, 1.6]]) },
  { id: 'copper', d: ground(390, [[1, 62, 0.9], [2, 26, 4.0], [4, 8, 1.0]]) },
  { id: 'deep', d: ground(455, [[1, 46, 3.5], [3, 14, 2.2]]) },
];

const WaveCrossing = () => {
  const ref = useRef(null);

  // Move only while the band is on screen.
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      node.dataset.active = '';
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) node.dataset.active = '';
      else delete node.dataset.active;
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div aria-hidden="true" className="archive-transition" data-tone="crossing">
      <div ref={ref} className="archive-wave">
        {LAYERS.map((layer) => (
          <div key={layer.id} className="archive-wave__layer" data-layer={layer.id}>
            <div className="archive-wave__drift">
              <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" focusable="false">
                <path d={layer.d} />
                {layer.highlight && <path className="archive-wave__edge" d={layer.highlight} vectorEffect="non-scaling-stroke" />}
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArchiveTransition = ({ tone = 'quiet' }) =>
  tone === 'crossing' ? (
    <WaveCrossing />
  ) : (
    <div aria-hidden="true" className="archive-transition" data-tone={tone} />
  );

export default ArchiveTransition;
