import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import EditorialReveal from '../common/EditorialReveal';
import SectionHeading from '../common/SectionHeading';
import { toolbox, TOOLBOX_LABELS } from '../../data/toolbox';
import { TextAnimate } from '../ui/text-animate';

const skillDetails = {
  PyTorch: { description: 'Open-source deep learning framework with dynamic computation graphs and extensive ecosystem.', usage: 'Research prototyping, model training, computer vision, NLP, reinforcement learning pipelines.', wiki: 'https://en.wikipedia.org/wiki/PyTorch' },
  YOLOv8: { description: 'Real-time object detection model family from Ultralytics.', usage: 'Real-time detection, instance segmentation, pose estimation, tracking, surveillance systems.', wiki: 'https://en.wikipedia.org/wiki/You_Only_Look_Once' },
  'ONNX Runtime': { description: 'Cross-platform inference engine for machine learning models in the ONNX format.', usage: 'Model deployment across CPU/GPU/edge devices, production serving, hardware acceleration.', wiki: 'https://en.wikipedia.org/wiki/ONNX' },
  FastAPI: { description: 'Python web framework for building APIs, with automatic OpenAPI documentation.', usage: 'REST APIs, microservices, real-time data pipelines, async backend services.', wiki: 'https://en.wikipedia.org/wiki/FastAPI' },
  React: { description: 'Declarative JavaScript library for building component-based user interfaces.', usage: 'SPAs, interactive dashboards, portfolio sites, cross-platform web applications.', wiki: 'https://en.wikipedia.org/wiki/React_(JavaScript_library)' },
  Rust: { description: 'Systems programming language guaranteeing memory safety without a garbage collector.', usage: 'Performance-critical apps, CLI tools, WebAssembly, embedded systems, Tauri backends.', wiki: 'https://en.wikipedia.org/wiki/Rust_(programming_language)' },
  Tauri: { description: 'Framework for building desktop apps with web frontends and Rust backends.', usage: 'Cross-platform desktop apps, system utilities, offline-first tools, media applications.', wiki: 'https://en.wikipedia.org/wiki/Tauri_(software)' },
  OpenCV: { description: 'Open-source computer vision library with 2500+ optimized algorithms.', usage: 'Image processing, object detection, camera calibration, face recognition, AR applications.', wiki: 'https://en.wikipedia.org/wiki/OpenCV' },
  Python: { description: 'High-level, general-purpose programming language emphasizing readability and rapid development.', usage: 'ML/AI pipelines, data analysis, automation, backend services, scripting, scientific computing.', wiki: 'https://en.wikipedia.org/wiki/Python_(programming_language)' },
  TypeScript: { description: 'Typed superset of JavaScript that compiles to plain JavaScript.', usage: 'Type-safe React components, API definitions, large codebase management.', wiki: 'https://en.wikipedia.org/wiki/TypeScript' },
  RLHF: { description: 'Reinforcement Learning from Human Feedback aligns models with human preferences via reward modeling.', usage: 'LLM alignment, content moderation, preference-based optimization, chatbot behavior tuning.', wiki: 'https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback' },
  'Model Distillation': { description: 'Technique that compresses a large teacher model into a smaller student model while preserving performance.', usage: 'Edge deployment, reducing inference cost, model compression, on-device AI.', wiki: 'https://en.wikipedia.org/wiki/Knowledge_distillation' },
  'LoRA Fine-tuning': { description: 'Low-Rank Adaptation — efficient fine-tuning method that injects trainable low-rank matrices into model layers.', usage: 'LLM adaptation, domain-specific tuning, parameter-efficient fine-tuning, style transfer.', wiki: 'https://en.wikipedia.org/wiki/Low-rank_adaptation' },
  'Vision Transformers': { description: 'Transformer architecture adapted for image data, treating images as sequences of patches.', usage: 'Image classification, segmentation, detection, video understanding, self-supervised vision.', wiki: 'https://en.wikipedia.org/wiki/Vision_transformer' },
  '3D Gaussian Splatting': { description: 'Novel view synthesis technique representing scenes as collections of 3D Gaussians.', usage: '3D reconstruction, radiance field rendering, VR/AR content creation, volumetric capture.', wiki: 'https://en.wikipedia.org/wiki/3D_Gaussian_splatting' },
  WebGPU: { description: 'Graphics and compute API for the web, designed as the successor to WebGL.', usage: 'Browser graphics, GPU compute, ML inference in-browser, game engines.', wiki: 'https://en.wikipedia.org/wiki/WebGPU' },
  'Multi-Agent Systems': { description: 'Systems of multiple autonomous AI agents that interact, coordinate, and solve problems collectively.', usage: 'Complex problem-solving, simulations, robotics coordination, distributed AI, game theory.', wiki: 'https://en.wikipedia.org/wiki/Multi-agent_system' },
  'RAG Pipelines': { description: 'Retrieval-Augmented Generation grounds LLM outputs in external knowledge bases for factual responses.', usage: 'Q&A systems, knowledge-grounded chatbots, document analysis, research assistants.', wiki: 'https://en.wikipedia.org/wiki/Retrieval-augmented_generation' },
  TensorFlow: { description: 'End-to-end open-source machine learning platform by Google.', usage: 'Model building, deployment across platforms, production ML pipelines, research experiments.', wiki: 'https://en.wikipedia.org/wiki/TensorFlow' },
  'Scikit-learn': { description: 'Machine learning library for Python with consistent API for classical algorithms.', usage: 'Classification, regression, clustering, dimensionality reduction, feature engineering, preprocessing.', wiki: 'https://en.wikipedia.org/wiki/Scikit-learn' },
  Docker: { description: 'Containerization platform that packages applications with their dependencies into isolated containers.', usage: 'Consistent deployment, CI/CD pipelines, microservices, dev environment reproducibility.', wiki: 'https://en.wikipedia.org/wiki/Docker_(software)' },
  AWS: { description: 'Amazon\'s cloud platform offering compute, storage, ML, and infrastructure services.', usage: 'Cloud hosting, serverless applications, model deployment, data warehousing, infrastructure.', wiki: 'https://en.wikipedia.org/wiki/Amazon_Web_Services' },
  PostgreSQL: { description: 'Open-source relational database with advanced querying and extensibility.', usage: 'Data storage, complex queries, geospatial data (PostGIS), analytics, production databases.', wiki: 'https://en.wikipedia.org/wiki/PostgreSQL' },
  Java: { description: 'Mature, object-oriented programming language designed for portability across platforms.', usage: 'Enterprise applications, Android development, large-scale systems, backend services.', wiki: 'https://en.wikipedia.org/wiki/Java_(programming_language)' },
  'C++': { description: 'Systems programming language with low-level memory control.', usage: 'Game engines, embedded systems, performance-critical algorithms, OS components, robotics.', wiki: 'https://en.wikipedia.org/wiki/C%2B%2B' },
  MATLAB: { description: 'Numerical computing environment and programming language for technical computing.', usage: 'Signal processing, control systems, prototyping, numerical analysis, simulation and modeling.', wiki: 'https://en.wikipedia.org/wiki/MATLAB' },
  'Three.js': { description: 'JavaScript library for creating 3D graphics in the browser using WebGL.', usage: '3D visualizations, interactive experiences, product configurators, data viz, games.', wiki: 'https://en.wikipedia.org/wiki/Three.js' },
  Figma: { description: 'Collaborative web-based interface design tool with real-time multiplayer editing.', usage: 'UI/UX design, prototyping, design systems, wireframing, team collaboration.', wiki: 'https://en.wikipedia.org/wiki/Figma' },
  'Adobe Lightroom': { description: 'Photo editing and cataloguing software with non-destructive RAW processing.', usage: 'RAW photo workflow, color grading, batch editing, photo cataloging, digital asset management.', wiki: 'https://en.wikipedia.org/wiki/Adobe_Lightroom' },
  'Adobe Premiere Pro': { description: 'Adobe\'s video editing software for post-production.', usage: 'Video editing, color correction, audio mixing, multi-cam editing, documentary production.', wiki: 'https://en.wikipedia.org/wiki/Adobe_Premiere_Pro' },
  'After Effects': { description: 'Digital motion graphics and compositing software for visual effects and animation.', usage: 'Motion graphics, VFX compositing, title sequences, keying, tracking, data-driven animation.', wiki: 'https://en.wikipedia.org/wiki/Adobe_After_Effects' },
  'Git & GitHub': { description: 'Distributed version control system (Git) with cloud hosting platform for collaboration (GitHub).', usage: 'Source control, collaborative development, CI/CD, code review, open-source contribution.', wiki: 'https://en.wikipedia.org/wiki/Git' },
  Linux: { description: 'Open-source Unix-like operating system kernel powering servers, desktops, and embedded systems.', usage: 'Server deployment, development environments, embedded systems, cloud infrastructure, DevOps.', wiki: 'https://en.wikipedia.org/wiki/Linux' },
};

// Each group differs only in the colour of its label and tag borders.
const tones = {
  building: { label: 'text-accent', tag: 'border-accent/50 hover:border-accent' },
  exploring: { label: 'text-accent-strong', tag: 'border-accent-strong/40 hover:border-accent-strong' },
  experienced: { label: 'text-ink-muted', tag: 'border-notebook-border-light hover:border-ink-muted' },
};

// The lists themselves live in data/toolbox.js (the portfolio's canonical skill list).
const categories = ['building', 'exploring', 'experienced'].map((key) => ({ key, label: TOOLBOX_LABELS[key], skills: toolbox[key] }));

// A tool name that opens its note. A real button: focusable, Enter/Space work.
// On hover it lifts a pixel; pressed, it settles back.
const SkillTag = ({ name, tone, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-haspopup="dialog"
    className={`inline-flex min-h-11 select-none items-center border px-3 text-small text-ink-secondary transition-[color,border-color,transform] duration-200 ease-out hover:-translate-y-px hover:text-ink-primary active:translate-y-0 motion-reduce:transform-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${tone.tag}`}
  >
    {name}
  </button>
);

// A group's arrival, once, when it comes into view: its rule draws in from
// the left, its count fades in, and its tags rise into place one after
// another (see TOOLBOX in index.css). Same rules as EditorialReveal: the
// group is visible unless, just before first paint, it can be shown again
// (IntersectionObserver, no reduced-motion preference, not scrolled past);
// a group that stays in view without crossing the line still arrives after a
// moment; keyboard focus arriving inside shows it at once; afterwards the
// attribute is removed and nothing is left animating.
const ARRIVE_MS = 1400;

const useArrival = (ref) => {
  useLayoutEffect(() => {
    const node = ref.current;
    if (
      !node ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      node.getBoundingClientRect().bottom <= 0
    ) {
      return undefined;
    }
    let done = null;
    let late = null;
    const settle = () => { delete node.dataset.arrive; };
    const stopWatching = () => {
      enter.disconnect();
      visible.disconnect();
      clearTimeout(late);
    };
    const arrive = () => {
      if (node.dataset.arrive !== 'armed') return;
      stopWatching();
      node.dataset.arrive = 'arriving';
      done = setTimeout(settle, ARRIVE_MS);
    };
    const show = () => {
      if (node.dataset.arrive !== 'armed') return;
      stopWatching();
      settle();
    };
    const enter = new IntersectionObserver(([e]) => { if (e.isIntersecting) arrive(); }, { rootMargin: '0px 0px -10% 0px' });
    const visible = new IntersectionObserver(([e]) => {
      clearTimeout(late);
      if (e.isIntersecting) late = setTimeout(arrive, 600);
    });
    node.dataset.arrive = 'armed';
    enter.observe(node);
    visible.observe(node);
    node.addEventListener('focusin', show);
    return () => {
      stopWatching();
      clearTimeout(done);
      node.removeEventListener('focusin', show);
      settle();
    };
  }, [ref]);
};

// One group: label, rule and count, then its tags.
const ToolGroup = ({ cat, index, onOpen }) => {
  const ref = useRef(null);
  useArrival(ref);
  const n = cat.skills.length;
  return (
    <div
      ref={ref}
      className="toolbox-group"
      style={{ '--group-delay': `${index * 90}ms`, '--tag-step': `${Math.min(40, Math.round(480 / Math.max(n - 1, 1)))}ms` }}
    >
      <div className="mb-4 flex items-center gap-3">
        <EditorialReveal as="h3" mode="fade" level="micro" delay={index * 90} className={`meta-label ${tones[cat.key].label}`}>{cat.label}</EditorialReveal>
        <div aria-hidden="true" className="toolbox-rule h-px flex-1 bg-notebook-border" />
        <span className="toolbox-count font-mono text-meta text-ink-faint">{n}</span>
      </div>

      <ul className="flex flex-wrap gap-2">
        {cat.skills.map((t, i) => (
          <li key={t} className="toolbox-tag" style={{ '--i': i }}>
            <SkillTag name={t} tone={tones[cat.key]} onClick={() => onOpen(t, cat.key)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

// Modal dialog: focus moves to the close button on open, Tab stays inside,
// Esc closes, and focus returns to the tag that opened it.
const SkillModal = ({ skill, name, onClose, group }) => {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!skill) return undefined;
    const opener = document.activeElement;
    closeRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = [...dialogRef.current.querySelectorAll('a[href], button:not([disabled])')];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, [skill, onClose]);

  if (!skill) return null;

  const tone = tones[group] || tones.building;

  return createPortal(
    <div className="tool-note-backdrop fixed inset-0 z-50 flex items-center justify-center bg-notebook-bg/90 p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="tool-note relative w-full max-w-lg border border-notebook-border-light bg-notebook-surface-alt"
      >
        <button
          onClick={onClose}
          ref={closeRef}
          type="button"
          aria-label="Close tool note"
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className="border-b border-notebook-border px-6 pb-4 pt-6">
          <p className={`meta-label ${tone.label}`}>Tool</p>
          <h3 id="skill-modal-title" className="mt-1 pr-10 font-editorial text-title text-ink-primary">{name}</h3>
        </div>

        <div className="space-y-5 px-6 py-5">
          <p className="text-small text-ink-secondary">{skill.description}</p>
          <div>
            <p className={`meta-label mb-1.5 ${tone.label}`}>Common use</p>
            <p className="text-small text-ink-muted">{skill.usage}</p>
          </div>
        </div>

        <div className="border-t border-notebook-border px-6 py-3">
          <a
            href={skill.wiki}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 text-small text-ink-secondary underline decoration-notebook-border-light underline-offset-4 transition-colors duration-200 hover:text-ink-primary hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Wikipedia <span aria-hidden="true">↗</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};

const SkillsSection = () => {
  const [selected, setSelected] = useState(null);

  const openSkill = useCallback((name, group) => setSelected({ name, group }), []);
  const closeSkill = useCallback(() => setSelected(null), []);

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="relative pt-12 sm:pt-16 lg:pt-20 overflow-hidden"
    >
      <SkillModal
        skill={selected ? skillDetails[selected.name] : null}
        name={selected?.name}
        group={selected?.group}
        onClose={closeSkill}
      />
      <div className="archive-container relative z-10">
        <div className="max-w-5xl">
          <SectionHeading number="02" id="skills-title" className="mb-10" reveal="words">Toolbox</SectionHeading>

          <div className="space-y-12">
            {categories.map((cat, ci) => (
              <ToolGroup key={cat.key} cat={cat} index={ci} onOpen={openSkill} />
            ))}
          </div>

          <TextAnimate by="text" animation="slideRight" className="mt-14 border-t border-notebook-border pt-5 font-mono text-meta uppercase text-ink-faint">
            Tool inventory · continuously updated
          </TextAnimate>
        </div>
      </div>

      <div aria-hidden="true" className="py-5 sm:py-6" />
    </section>
  );
};

export default SkillsSection;
