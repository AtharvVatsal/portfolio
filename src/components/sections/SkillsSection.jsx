import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useInView } from '../../hooks/useInView';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const building = ['PyTorch', 'YOLOv8', 'ONNX Runtime', 'FastAPI', 'React', 'Rust', 'Tauri', 'OpenCV', 'Python', 'TypeScript'];
const exploring = ['RLHF', 'Model Distillation', 'LoRA Fine-tuning', 'Vision Transformers', '3D Gaussian Splatting', 'WebGPU', 'Multi-Agent Systems', 'RAG Pipelines'];
const experienced = ['TensorFlow', 'Scikit-learn', 'Docker', 'AWS', 'PostgreSQL', 'Java', 'C++', 'MATLAB', 'Three.js', 'Figma', 'Adobe Lightroom', 'Adobe Premiere Pro', 'After Effects', 'Git & GitHub', 'Linux'];

const skillDetails = {
  PyTorch: { description: 'Open-source deep learning framework with dynamic computation graphs and extensive ecosystem.', usage: 'Research prototyping, model training, computer vision, NLP, reinforcement learning pipelines.', wiki: 'https://en.wikipedia.org/wiki/PyTorch' },
  YOLOv8: { description: 'State-of-the-art real-time object detection model from Ultralytics.', usage: 'Real-time detection, instance segmentation, pose estimation, tracking, surveillance systems.', wiki: 'https://en.wikipedia.org/wiki/You_Only_Look_Once' },
  'ONNX Runtime': { description: 'Cross-platform inference engine for machine learning models in the ONNX format.', usage: 'Model deployment across CPU/GPU/edge devices, production serving, hardware acceleration.', wiki: 'https://en.wikipedia.org/wiki/ONNX' },
  FastAPI: { description: 'Modern, high-performance Python web framework with automatic OpenAPI documentation.', usage: 'REST APIs, microservices, real-time data pipelines, async backend services.', wiki: 'https://en.wikipedia.org/wiki/FastAPI' },
  React: { description: 'Declarative JavaScript library for building component-based user interfaces.', usage: 'SPAs, interactive dashboards, portfolio sites, cross-platform web applications.', wiki: 'https://en.wikipedia.org/wiki/React_(JavaScript_library)' },
  Rust: { description: 'Systems programming language guaranteeing memory safety without a garbage collector.', usage: 'Performance-critical apps, CLI tools, WebAssembly, embedded systems, Tauri backends.', wiki: 'https://en.wikipedia.org/wiki/Rust_(programming_language)' },
  Tauri: { description: 'Framework for building secure, lightweight desktop apps with web frontends and Rust backends.', usage: 'Cross-platform desktop apps, system utilities, offline-first tools, media applications.', wiki: 'https://en.wikipedia.org/wiki/Tauri_(software)' },
  OpenCV: { description: 'Open-source computer vision library with 2500+ optimized algorithms.', usage: 'Image processing, object detection, camera calibration, face recognition, AR applications.', wiki: 'https://en.wikipedia.org/wiki/OpenCV' },
  Python: { description: 'High-level, general-purpose programming language emphasizing readability and rapid development.', usage: 'ML/AI pipelines, data analysis, automation, backend services, scripting, scientific computing.', wiki: 'https://en.wikipedia.org/wiki/Python_(programming_language)' },
  TypeScript: { description: 'Typed superset of JavaScript that compiles to plain JavaScript.', usage: 'Scalable web apps, type-safe React components, API definitions, large codebase management.', wiki: 'https://en.wikipedia.org/wiki/TypeScript' },
  RLHF: { description: 'Reinforcement Learning from Human Feedback aligns models with human preferences via reward modeling.', usage: 'LLM alignment, content moderation, preference-based optimization, chatbot behavior tuning.', wiki: 'https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback' },
  'Model Distillation': { description: 'Technique that compresses a large teacher model into a smaller student model while preserving performance.', usage: 'Edge deployment, reducing inference cost, model compression, on-device AI.', wiki: 'https://en.wikipedia.org/wiki/Knowledge_distillation' },
  'LoRA Fine-tuning': { description: 'Low-Rank Adaptation Ã¢â‚¬â€ efficient fine-tuning method that injects trainable low-rank matrices into model layers.', usage: 'LLM adaptation, domain-specific tuning, parameter-efficient fine-tuning, style transfer.', wiki: 'https://en.wikipedia.org/wiki/Low-rank_adaptation' },
  'Vision Transformers': { description: 'Transformer architecture adapted for image data, treating images as sequences of patches.', usage: 'Image classification, segmentation, detection, video understanding, self-supervised vision.', wiki: 'https://en.wikipedia.org/wiki/Vision_transformer' },
  '3D Gaussian Splatting': { description: 'Novel view synthesis technique representing scenes as collections of 3D Gaussians.', usage: '3D reconstruction, radiance field rendering, VR/AR content creation, volumetric capture.', wiki: 'https://en.wikipedia.org/wiki/3D_Gaussian_splatting' },
  WebGPU: { description: 'Next-generation graphics and compute API for the web, successor to WebGL.', usage: 'High-performance browser graphics, GPU compute, ML inference in-browser, game engines.', wiki: 'https://en.wikipedia.org/wiki/WebGPU' },
  'Multi-Agent Systems': { description: 'Systems of multiple autonomous AI agents that interact, coordinate, and solve problems collectively.', usage: 'Complex problem-solving, simulations, robotics coordination, distributed AI, game theory.', wiki: 'https://en.wikipedia.org/wiki/Multi-agent_system' },
  'RAG Pipelines': { description: 'Retrieval-Augmented Generation grounds LLM outputs in external knowledge bases for factual responses.', usage: 'Q&A systems, knowledge-grounded chatbots, document analysis, research assistants.', wiki: 'https://en.wikipedia.org/wiki/Retrieval-augmented_generation' },
  TensorFlow: { description: 'End-to-end open-source machine learning platform by Google.', usage: 'Model building, deployment across platforms, production ML pipelines, research experiments.', wiki: 'https://en.wikipedia.org/wiki/TensorFlow' },
  'Scikit-learn': { description: 'Machine learning library for Python with consistent API for classical algorithms.', usage: 'Classification, regression, clustering, dimensionality reduction, feature engineering, preprocessing.', wiki: 'https://en.wikipedia.org/wiki/Scikit-learn' },
  Docker: { description: 'Containerization platform that packages applications with their dependencies into isolated containers.', usage: 'Consistent deployment, CI/CD pipelines, microservices, dev environment reproducibility.', wiki: 'https://en.wikipedia.org/wiki/Docker_(software)' },
  AWS: { description: 'Comprehensive cloud platform offering compute, storage, ML, and infrastructure services.', usage: 'Cloud hosting, serverless applications, model deployment, data warehousing, scalable infrastructure.', wiki: 'https://en.wikipedia.org/wiki/Amazon_Web_Services' },
  PostgreSQL: { description: 'Powerful open-source relational database with advanced querying and extensibility.', usage: 'Data storage, complex queries, geospatial data (PostGIS), analytics, production databases.', wiki: 'https://en.wikipedia.org/wiki/PostgreSQL' },
  Java: { description: 'Mature, object-oriented programming language designed for portability across platforms.', usage: 'Enterprise applications, Android development, large-scale systems, backend services.', wiki: 'https://en.wikipedia.org/wiki/Java_(programming_language)' },
  'C++': { description: 'High-performance systems programming language with low-level memory control.', usage: 'Game engines, embedded systems, performance-critical algorithms, OS components, robotics.', wiki: 'https://en.wikipedia.org/wiki/C%2B%2B' },
  MATLAB: { description: 'Numerical computing environment and programming language for technical computing.', usage: 'Signal processing, control systems, prototyping, numerical analysis, simulation and modeling.', wiki: 'https://en.wikipedia.org/wiki/MATLAB' },
  'Three.js': { description: 'JavaScript library for creating 3D graphics in the browser using WebGL.', usage: '3D visualizations, interactive experiences, product configurators, data viz, games.', wiki: 'https://en.wikipedia.org/wiki/Three.js' },
  Figma: { description: 'Collaborative web-based interface design tool with real-time multiplayer editing.', usage: 'UI/UX design, prototyping, design systems, wireframing, team collaboration.', wiki: 'https://en.wikipedia.org/wiki/Figma' },
  'Adobe Lightroom': { description: 'Professional photo editing and management software with non-destructive RAW processing.', usage: 'RAW photo workflow, color grading, batch editing, photo cataloging, digital asset management.', wiki: 'https://en.wikipedia.org/wiki/Adobe_Lightroom' },
  'Adobe Premiere Pro': { description: 'Industry-standard video editing software for professional post-production.', usage: 'Video editing, color correction, audio mixing, multi-cam editing, documentary production.', wiki: 'https://en.wikipedia.org/wiki/Adobe_Premiere_Pro' },
  'After Effects': { description: 'Digital motion graphics and compositing software for visual effects and animation.', usage: 'Motion graphics, VFX compositing, title sequences, keying, tracking, data-driven animation.', wiki: 'https://en.wikipedia.org/wiki/Adobe_After_Effects' },
  'Git & GitHub': { description: 'Distributed version control system (Git) with cloud hosting platform for collaboration (GitHub).', usage: 'Source control, collaborative development, CI/CD, code review, open-source contribution.', wiki: 'https://en.wikipedia.org/wiki/Git' },
  Linux: { description: 'Open-source Unix-like operating system kernel powering servers, desktops, and embedded systems.', usage: 'Server deployment, development environments, embedded systems, cloud infrastructure, DevOps.', wiki: 'https://en.wikipedia.org/wiki/Linux' },
};

const catColors = {
  blueprint: { border: 'rgba(99,102,241,0.2)', borderHover: 'rgba(99,102,241,0.5)', text: 'rgba(99,102,241,0.6)', textHover: 'rgba(99,102,241,1)', bg: 'rgba(99,102,241,0.04)', dot: 'rgba(99,102,241,0.2)', line: 'linear-gradient(90deg, rgba(99,102,241,0.15), transparent)', rgb: '99,102,241' },
  amber: { border: 'rgba(245,186,85,0.2)', borderHover: 'rgba(245,186,85,0.4)', text: 'rgba(245,186,85,0.6)', textHover: 'rgba(245,186,85,1)', bg: 'rgba(245,186,85,0.04)', dot: 'rgba(245,186,85,0.15)', line: 'linear-gradient(90deg, rgba(245,186,85,0.15), transparent)', rgb: '245,186,85' },
  'ink-faint': { border: 'rgba(140,134,125,0.15)', borderHover: 'rgba(140,134,125,0.3)', text: 'rgba(140,134,125,0.6)', textHover: 'rgba(140,134,125,1)', bg: 'rgba(140,134,125,0.04)', dot: 'rgba(140,134,125,0.1)', line: 'linear-gradient(90deg, rgba(140,134,125,0.15), transparent)', rgb: '140,134,125' },
};

const categories = [
  { label: 'Building With', key: 'building', skills: building, accent: 'blueprint', icon: 'Ã¢Å¡â„¢' },
  { label: 'Exploring', key: 'exploring', skills: exploring, accent: 'amber', icon: 'Ã¢Å¸Â¡' },
  { label: 'Experienced With', key: 'experienced', skills: experienced, accent: 'ink-faint', icon: 'Ã¢â€“Â´' },
];

const SkillTag = ({ name, index, colors, onClick, containerProgress, staggerTotal }) => {
  const staggerStep = staggerTotal > 0 ? 0.2 / staggerTotal : 0;
  const tagProgress = staggerTotal > 0
    ? Math.max(0, Math.min(1, (containerProgress - index * staggerStep) / (1 - staggerTotal * staggerStep)))
    : containerProgress;
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 6, y: y * -6 });
  };

  return (
    <span
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      className="font-mono text-[0.85rem] sm:text-[0.9rem] px-3 py-1.5 inline-block cursor-pointer select-none"
      style={{
        border: `1px solid ${hovered ? colors.borderHover : colors.border}`,
        color: hovered ? colors.textHover : 'rgba(245,242,237,0.7)',
        background: hovered ? colors.bg : 'transparent',
        transform: hovered ? `perspective(400px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1.04)` : 'perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)',
        willChange: 'transform, opacity',
        transition: `transform ${hovered ? '0.1s ease-out' : '0.6s cubic-bezier(0.25, 0.1, 0.25, 1)'}, translate 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s, color 0.2s, background 0.2s`,
        opacity: tagProgress,
        translate: `0 ${8 * (1 - tagProgress)}px`,
      }}
    >
      {name}
    </span>
  );
};

const SkillModal = ({ skill, name, onClose, accent }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!skill) return null;

  const colors = catColors[accent] || catColors.blueprint;
  const glow = `${colors.rgb}`;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ background: 'rgba(10,9,8,0.88)', backdropFilter: 'blur(8px)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg"
        style={{
          border: `1px solid ${colors.border}`,
          background: '#100F0D',
          boxShadow: `0 0 0 1px rgba(${glow},0.12), 0 0 12px rgba(${glow},0.08), 0 0 24px rgba(${glow},0.04)`,
        }}
      >
        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center transition-colors duration-200"
          style={{ color: 'rgba(140,134,125,0.5)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(245,242,237,0.9)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(140,134,125,0.5)'}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3L13 13M13 3L3 13" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(40,37,31,0.6)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[0.8rem] uppercase tracking-[0.25em]"
              style={{ color: colors.text }}>Tool</span>
          </div>
          <h3 className="font-editorial text-xl sm:text-2xl text-ink-primary">{name}</h3>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <p className="font-mono text-[0.9rem] leading-relaxed text-ink-secondary">
            {skill.description}
          </p>
          <div>
            <span className="font-mono text-[0.8rem] uppercase tracking-[0.2em] block mb-1.5"
              style={{ color: colors.text }}>Common Use</span>
            <p className="font-mono text-[0.85rem] leading-relaxed text-ink-muted">
              {skill.usage}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <div className="h-px mb-4" style={{ background: colors.line }} />
          <a href={skill.wiki} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[0.9rem] tracking-wider transition-colors duration-200"
            style={{ color: colors.text }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.textHover}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.text}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V10" />
              <path d="M10 2H14V6" />
              <path d="M14 2L8 8" />
            </svg>
            Wikipedia
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};

const SkillsSection = () => {
  const [inViewRef, inView] = useInView({ threshold: 0.05 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [selectedAccent, setSelectedAccent] = useState('blueprint');
  const sectionRef = useRef(null);
  const [contentAnimRef, contentAnim] = useScrollAnimation({ rootMargin: '0px 0px -80px 0px' });

  const handleSectionMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const openSkill = useCallback((name, accent) => {
    setSelectedSkill(skillDetails[name]);
    setSelectedName(name);
    setSelectedAccent(accent);
  }, []);

  const closeSkill = useCallback(() => {
    setSelectedSkill(null);
    setSelectedName('');
  }, []);

  return (
    <section
      ref={(node) => { inViewRef.current = node; sectionRef.current = node; }}
      onMouseMove={handleSectionMouse}
      id="skills"
      className="relative pt-12 sm:pt-16 lg:pt-20 overflow-hidden"
    >
      <SkillModal skill={selectedSkill} name={selectedName} onClose={closeSkill} accent={selectedAccent} />
      {/* Deep ambient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-blueprint/[0.015] to-transparent" />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: [
          'linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '48px 48px, 48px 48px',
      }} />

      {/* Floating geometric elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Concentric rings Ã¢â‚¬â€ top right */}
        <div className="absolute -top-16 -right-16 w-64 h-64 border border-blueprint/[0.03] rounded-full transition-all duration-1000"
          style={{ transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * -0.01}px)` }} />
        <div className="absolute -top-8 -right-8 w-48 h-48 border border-blueprint/[0.02] rounded-full transition-all duration-1000"
          style={{ transform: `translate(${mousePos.x * -0.015}px, ${mousePos.y * 0.015}px)` }} />

        {/* Bottom-left bracket */}
        <div className="absolute bottom-12 left-8 opacity-[0.02]">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.75">
            <path d="M28 4H4V28" />
            <path d="M12 4H4V12" strokeDasharray="2 2" />
          </svg>
        </div>

        {/* Scattered dots */}
        <div className="absolute top-[20%] left-[10%] w-1 h-1 rounded-full bg-blueprint/[0.04]" />
        <div className="absolute top-[60%] right-[12%] w-1.5 h-1.5 rounded-full bg-amber/[0.03]" />
        <div className="absolute top-[35%] right-[25%] w-0.5 h-0.5 rounded-full bg-blueprint/[0.03]" />
        <div className="absolute bottom-[30%] left-[20%] w-1 h-1 rounded-full bg-blueprint/[0.02]" />
        <div className="absolute top-[40%] left-[5%] w-0.5 h-0.5 rounded-full bg-amber/[0.025]" />
        <div className="absolute top-[10%] right-[35%] w-1 h-1 rounded-full bg-blueprint/[0.025]" />

        {/* Crosshair decoration */}
        <svg className="absolute top-[15%] right-[8%] opacity-[0.015]" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="20" cy="20" r="8" />
          <path d="M20 0V12M20 28V40M8 20H0M32 20H40" />
        </svg>

        {/* Diagonal line decoration */}
        <svg className="absolute bottom-20 right-12 opacity-[0.012]" width="50" height="50" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="0.5">
          <path d="M0 50L50 0" />
          <path d="M12 50L50 12" strokeDasharray="2 3" />
          <path d="M0 38L38 0" strokeDasharray="2 3" />
        </svg>
      </div>

      {/* Spotlight */}
      <div className="absolute pointer-events-none transition-all duration-[500ms] ease-out"
        style={{
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
          left: mousePos.x - 250, top: mousePos.y - 250,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div ref={contentAnimRef} className="max-w-5xl">
            <span className="font-mono text-[0.85rem] text-ink-faint/70 uppercase tracking-[0.2em] mb-10 block">02 / Toolbox</span>

          {/* Category panels */}
          <div className="space-y-14">
            {categories.map((cat, ci) => (
              <div key={cat.key} className={`transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
                style={{ transitionDelay: `${ci * 150}ms` }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5 group">
                  <div className="w-7 h-7 flex items-center justify-center transition-all duration-300"
                    style={{ border: `1px solid ${catColors[cat.accent].border}` }}>
                    <span className="text-[0.9rem] transition-all duration-300"
                      style={{ color: catColors[cat.accent].text }}>{cat.icon}</span>
                  </div>
                  <span className="font-mono text-[0.85rem] uppercase tracking-[0.25em] transition-colors duration-300"
                    style={{ color: catColors[cat.accent].text }}>
                    {cat.label}
                  </span>
                  <div className="h-px flex-1" style={{ background: catColors[cat.accent].line }} />
                  <span className="font-mono text-[0.8rem] tracking-wider" style={{ color: 'rgba(140,134,125,0.2)' }}>{cat.skills.length}</span>
                </div>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((t, i) => (
                    <SkillTag
                      key={t}
                      name={t}
                      index={i}
                      colors={catColors[cat.accent]}
                      onClick={() => openSkill(t, cat.accent)}
                      containerProgress={contentAnim.progress}
                      staggerTotal={cat.skills.length}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer reference */}
          <div className={`mt-16 pt-6 border-t border-ink-faint/5 transition-all duration-700 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="flex items-center gap-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-blueprint/20" />
                <div className="w-2 h-2 rounded-full bg-amber/15" />
                <div className="w-2 h-2 rounded-full bg-ink-faint/10" />
              </div>
              <span className="font-mono text-[0.8rem] text-ink-faint/60 tracking-widest uppercase">Tool inventory  Ã‚Â·  continuously updated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient bridge to next section */}
      <div className={`relative py-5 sm:py-6 transition-all duration-1000 ${
        inView ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.012))'
        }} />
      </div>
    </section>
  );
};

export default SkillsSection;
