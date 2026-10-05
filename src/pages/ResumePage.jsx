import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Code,
  MapPin,
  Mail,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  Camera,
  Globe,
} from 'lucide-react';
import { SEO, DocumentHeader, EditorialHeading } from '../components/common';
import { pageHeaders } from '../data/archiveMeta';
import PageHeader from '../components/layout/PageHeader';
import { SOCIAL_LINKS, CONTACT_INFO, RESUME_LINK, PROJECT_LINKS, SITE_SOURCE } from '../config/links';
import { isPublicLink, caseFiles, getCaseFile } from '../data/caseFiles';
import { GlowBorder } from '../components/ui/spotlight-card';
import { TextAnimate } from '../components/ui/text-animate';

// Project names come from the case records (data/projects.js), so the résumé
// cannot drift from the case files.
const caseTitle = (key) => getCaseFile(key)?.record.title || key;

// The résumé, inside the archive shell. Content is unchanged; the page now
// uses the shared trail, reference line, headings and link treatment, and the
// section tabs are a keyboard-operable tablist sticky under the archive bar.
// Nothing animates on load (the staggered fade-ins and growing skill bars
// were removed); headings use the shared editorial reveal.

const ResumePage = () => {
  const [activeTab, setActiveTab] = useState('experience');

  // ─── DATA ─────────────────────────────────────────────

  const highlights = [
    { value: String(caseFiles.length), label: 'Projects Built' },
    { value: '7.8M+', label: 'Records Processed' },
    { value: '87.4%', label: 'Prediction Accuracy' },
  ];

  // Skills as listed in the current résumé PDF (no proficiency levels are given
  // there, so none are shown). The portfolio's own skill list is the Toolbox
  // (data/toolbox.js).
  const skills = {
    'Programming': ['Python', 'C++', 'Java', 'Rust', 'TypeScript', 'JavaScript', 'SQL'],
    'AI / ML': ['PyTorch', 'Scikit-learn', 'XGBoost', 'LightGBM', 'LLMs (Ollama, Mistral, LLaMA)', 'LoRA', 'spaCy', 'IndicBERT', 'Legal-BERT'],
    'CV & Deployment': ['OpenCV', 'YOLOv8', 'U-Net', 'MediaPipe', 'CUDA', 'Tesseract OCR', 'ONNX Runtime', 'Model Quantization', 'Edge Inference'],
    'Backend & Apps': ['FastAPI', 'Flask', 'Node.js', 'REST APIs', 'WebSockets', 'React', 'Next.js', 'Tailwind CSS', 'Tauri', 'PyQt', 'SQLite', 'Docker', 'Git', 'Linux'],
    'Data': ['Pandas', 'NumPy', 'Dask', 'GeoPandas', 'Plotly', 'Power BI'],
  };
  const spokenLanguages = ['English', 'Hindi', 'Punjabi', 'Pahadi', 'Haryanvi', 'Russian'];

  const experience = [
    {
      title: 'AI/ML Engineer Intern',
      org: 'Department of Digital Technologies & Governance, Government of Himachal Pradesh',
      location: 'Shimla, Himachal Pradesh',
      period: 'May 2025 — July 2025',
      points: [
        'Delivered three end-to-end NLP, ML, and computer vision systems for public safety with HP Police, containerised with Docker.',
        'Contributed to AISS, an on-premises investigation-support system with a Deputy SP (local LLMs, Legal-BERT, OCR), now in active use.',
        `${caseTitle('phqreport')} (NLP report processing, in active use): automated extraction of 12 fields from free-text battalion daily reports sent over WhatsApp, cutting processing from 15–20 min to seconds.`,
        'Smart CCTV Initiative (state-wide, with HP Police): contributed YOLO vehicle detection on live RTSP CCTV streams, fine-tuned on UA-DETRAC for varied lighting, angles, and low visibility.',
        'Smart CCTV Initiative: improved ALPR OCR on blurred and occluded plates; built unsafe-driving anomaly rules; explored edge deployment and thermal/IR fusion.',
      ],
    },
  ];

  const education = [
    {
      degree: 'B.Tech — Computer Science & Engineering',
      specialization: 'Specialization in AI & Machine Learning',
      school: 'Vellore Institute of Technology (VIT)',
      location: 'Vellore, Tamil Nadu',
      period: '2023 — 2027',
      points: [
        'Relevant coursework: Machine Learning, Deep Learning, Reinforcement Learning, OOPS, Computer Vision, Data Structures & Algorithms, Operating Systems, DBMS',
      ],
    },
    {
      degree: '10+2 — HPBOSE',
      specialization: 'State Merit #51 · 93.3%',
      school: 'Dhauladhar Public School',
      location: 'Dharamshala, HP',
      period: '2023',
      points: [],
    },
    {
      degree: '10th — ICSE',
      specialization: 'First Division · 90.7%',
      school: 'Sacred Heart Sr. Sec. School',
      location: 'Dharamshala, HP',
      period: '2021',
      points: [],
    },
  ];

  const projects = [
    {
      name: caseTitle('keeperraw'),
      subtitle: 'AI-Powered Offline Photo Culling Engine',
      desc: 'Cross-platform edge AI application to automate photo selection from large RAW datasets (3,000+ images → minutes). Multi-stage CV pipeline (YOLOv8 ONNX + MediaPipe + Laplacian) for sharpness and blink detection. XMP sidecar export for Lightroom integration.',
      tech: ['Rust', 'Tauri 2.x', 'React 19', 'TypeScript', 'ONNX Runtime', 'YOLOv8-face', 'FaceMesh', 'ExifTool', 'Rayon'],
      link: PROJECT_LINKS.keeperraw.github,
      ongoing: true,
    },
    {
      name: caseTitle('drivesense'),
      subtitle: 'Autonomous Driving Perception — 55.6% mAP',
      desc: 'Real-time perception pipeline combining YOLOv8 (object detection) and U-Net (semantic segmentation). Trained on 70K+ images. ~14 FPS on RTX 3050. Batch and video processing for large-scale evaluation.',
      tech: ['PyTorch', 'YOLOv8', 'U-Net', 'OpenCV', 'CUDA', 'Albumentations'],
      demo: PROJECT_LINKS.drivesense.demo,
      link: PROJECT_LINKS.drivesense.github,
    },
    {
      name: caseTitle('lzquant'),
      subtitle: 'Real-Time Sentiment Engine with Paper Trading · ~5ms GPU / ~55ms CPU',
      desc: 'Low-latency sentiment engine: DistilBERT (LoRA) sentiment analysis feeding a paper-trading engine (paper trading only, no live orders). ONNX optimization for fast inference. Real-time data pipelines (Reddit, RSS, Binance WebSocket). Z-score divergence strategy with risk controls.',
      tech: ['DistilBERT', 'LoRA', 'ONNX', 'FastAPI', 'Binance WebSocket', 'React', 'Python'],
      demo: PROJECT_LINKS.lzquant.demo,
      link: PROJECT_LINKS.lzquant.github,
    },
    {
      name: caseTitle('phqreport'),
      subtitle: 'AI Document Processing · v1 Streamlit → v4 desktop app',
      desc: 'v4: desktop app for structured data extraction from unstructured police reports, with three modes (Regex, spaCy NER + BERT, local LLM) at about 70%, 85% and 95% accuracy; 15–20 min per report reduced to seconds; cross-field validation and 10K+ rule-based typo correction. v1 (internship, Streamlit): 89% extraction accuracy, 2 hours → 15 minutes per batch.',
      tech: ['Python', 'DistilBERT', 'spaCy', 'NLTK', 'Streamlit', 'Scikit-learn', 'LangChain'],
      link: PROJECT_LINKS.phqreport.github,
    },
    {
      name: caseTitle('newtonsnightmare'),
      subtitle: 'Domain-Randomized RL Framework',
      desc: 'PPO and SAC agents for continuous control (locomotion, landing, balancing). Domain randomization for robust generalization. ONNX model export.',
      tech: ['PyTorch', 'PPO', 'SAC', 'Gymnasium', 'ONNX'],
    },
    {
      name: caseTitle('riskgrid'),
      subtitle: 'Spatio-Temporal Crime Prediction · 87.4% Accuracy',
      desc: 'Predicts crime 24hrs ahead from 7.8M+ records. 100m×100m spatial grid, ensemble ML (XGBoost, RF, LightGBM), 60+ engineered features, Dask distributed processing.',
      tech: ['XGBoost', 'LightGBM', 'GeoPandas', 'Dask', 'Folium', 'FastAPI'],
      link: PROJECT_LINKS.riskgrid.github,
    },
    {
      name: 'A.D.A.P.T.',
      subtitle: 'AI-Powered UAV for Flood Relief · Course Project',
      desc: 'Turned satellite flood maps into drone missions: HSV segmentation, safe drop zones, TSP routing, MAVLink waypoints; tested on 3 floods.',
      tech: ['Python', 'OpenCV', 'MAVLink'],
    },
    {
      name: 'Web Development',
      subtitle: 'Next.js · Sanity CMS · React',
      desc: 'Built Sacred Heart School’s 23-page Next.js + Sanity CMS site, editable by staff; the Matrix club site; a React portfolio.',
      tech: ['Next.js', 'TypeScript', 'Node.js', 'React', 'Tailwind CSS', 'Sanity CMS'],
    },
    {
      name: 'Portfolio Website',
      subtitle: 'Full-Stack React + AI Chatbot',
      desc: 'This site — case files, markdown blog, photography gallery with camera settings, Gemini AI assistant, SEO with OG/Twitter Cards/JSON-LD.',
      tech: ['React', 'Tailwind', 'Gemini API', 'EmailJS'],
      link: SITE_SOURCE,
    },
  ];

  const extracurriculars = [
    {
      role: 'Student Organizer (Head), Press & Media Committee',
      org: 'graVITas’26, VIT Vellore',
      period: '2026',
      icon: Camera,
      desc: 'Headed press, photo, video, social, podcast, and broadcasting for VIT’s flagship fest (10 managers, 22 coordinators, and 38 volunteers). The committee’s 300+ posts reached 4.1M+ accounts in a month (6.7M+ in 90 days), +36% followers; helped revive the graVITas YouTube channel, launched a podcast series, and coordinated print, digital, and TV media outreach.',
    },
    {
      role: 'Lead Photographer, Proshows (Lenscape Photography team)',
      org: 'Riviera’25 & Riviera’26',
      period: '2025 — 2026',
      icon: Camera,
      desc: 'Riviera’25: official concert photographer capturing Shreya Ghoshal, Jonita Gandhi, Neeti Mohan, Sonu Sood. Live event photography under dynamic lighting, media production, post-event content.',
    },
    {
      role: 'Student Coordinator, Press & Media Committee',
      org: 'graVITas’25, VIT Vellore',
      period: '2025',
      icon: Camera,
    },
    {
      role: 'Director of Photography',
      org: 'VITrendz — VIT\'s Largest Digital Media Platform',
      period: 'Mar 2025 — Present',
      icon: Camera,
      desc: 'Leading visual storytelling, capturing the culture of VIT through photography and videography. Curating content, covering events, shaping the platform\'s visual identity.',
    },
    {
      role: 'Photographer',
      org: 'The Photography Club, VIT',
      period: 'Jan 2024 — Feb 2025',
      icon: Camera,
      desc: 'SAE Stunt Show, Design Odyssey, GDSC Hexathon, and high-profile technical/cultural events. Action photography and dynamic event coverage.',
    },
    {
      role: 'Technical Blog Writer',
      org: 'atharvvatsal.com/blog',
      period: '2025 — Present',
      icon: Code,
      desc: 'Publishing technical articles blending ML concepts with storytelling — model evaluation metrics, photography journey, coding origins, and real-world tech impact.',
    },
  ];

  const tabs = [
    { id: 'experience', number: '01', label: 'Experience' },
    { id: 'projects', number: '02', label: 'Projects' },
    { id: 'skills', number: '03', label: 'Skills' },
    { id: 'education', number: '04', label: 'Education' },
    { id: 'activities', number: '05', label: 'Activities' },
  ];

  // ─── RENDER ───────────────────────────────────────────

  const onTabKey = (e, index) => {
    const last = tabs.length - 1;
    const next = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActiveTab(tabs[next].id);
    document.getElementById(`resume-tab-${tabs[next].id}`)?.focus();
  };

  const panelHeading = (title) => (
    <div className="mb-8 flex items-center gap-4">
      <EditorialHeading as="h2" variant="section" reveal="fade">{title}</EditorialHeading>
      <div aria-hidden="true" className="h-px flex-1 bg-notebook-border" />
    </div>
  );

  const card = 'border border-notebook-border p-5 sm:p-7';
  const period = 'self-start whitespace-nowrap font-mono text-meta text-ink-muted';
  const place = 'mt-1 flex items-center gap-1.5 text-small text-ink-muted';
  const header = pageHeaders.resume;

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary">
      <SEO
        title="Résumé"
        description="Interactive resume of Atharv Vatsal — CS student at VIT specializing in AI/ML, with experience at the Government of Himachal Pradesh."
        url="/resume"
        keywords={['resume', 'CV', 'Atharv Vatsal', 'machine learning', 'VIT']}
      />

      <PageHeader title="Résumé" />

      {/* ═══ HERO ═══ */}
      <section aria-labelledby="resume-title" className="archive-container pt-12 sm:pt-16 pb-12 sm:pb-14">
        <DocumentHeader type={header.type} docRef={header.ref} classification={header.classification} note={header.note} />

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <figure className="shrink-0">
            <div className="relative isolate h-28 w-28 overflow-hidden border border-notebook-border bg-notebook-surface sm:h-32 sm:w-32">
              <GlowBorder inset />
              <img src="/avPhoto.webp" alt="Atharv Vatsal" width="128" height="128" className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <figcaption className="mt-2 font-mono text-meta text-ink-faint">Figure 001</figcaption>
          </figure>

          <div className="min-w-0 flex-1">
            <EditorialHeading as="h1" variant="page" id="resume-title" reveal="mask" delay={80}>
              Atharv Vatsal
            </EditorialHeading>
            <TextAnimate by="word" animation="blurIn" delay={0.3} className="mt-3 text-body-sm text-ink-secondary">
              CS Engineering (AI/ML) · VIT Vellore '27 · Photographer & Visual Storyteller
            </TextAnimate>

            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1">
              {[
                { icon: MapPin, text: 'Dharamshala, HP', href: null },
                { icon: Mail, text: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
                { icon: Phone, text: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone}` },
                { icon: Github, text: 'GitHub', href: SOCIAL_LINKS.github },
                { icon: Linkedin, text: 'LinkedIn', href: SOCIAL_LINKS.linkedin },
                { icon: Globe, text: 'Portfolio', href: 'https://atharvvatsal.com' },
              ].map((item) => {
                const Icon = item.icon;
                const external = item.href?.startsWith('http');
                return (
                  <li key={item.text} className="min-w-0">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="inline-flex min-h-11 max-w-full items-center gap-2 break-all text-small text-ink-secondary underline decoration-notebook-border-light underline-offset-4 transition-colors duration-200 hover:text-ink-primary hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                      >
                        <Icon size={13} aria-hidden="true" className="shrink-0 text-ink-faint" />
                        {item.text}
                        {external && <span className="sr-only"> (opens in a new tab)</span>}
                      </a>
                    ) : (
                      <span className="inline-flex min-h-11 items-center gap-2 text-small text-ink-muted">
                        <Icon size={13} aria-hidden="true" className="shrink-0 text-ink-faint" />
                        {item.text}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            <dl className="mt-8 grid grid-cols-3 border-l border-t border-notebook-border">
              {highlights.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse border-b border-r border-notebook-border p-4">
                  <dt className="mt-1 text-small text-ink-muted">{stat.label}</dt>
                  <dd className="font-editorial text-title text-ink-primary">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <a
              href={RESUME_LINK}
              download="Atharv_Vatsal_Resume.pdf"
              className="mt-8 inline-flex min-h-11 items-center gap-2 border border-notebook-border px-5 text-small text-ink-primary transition-colors duration-200 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <Download size={14} aria-hidden="true" />
              Download PDF
            </a>
          </div>
        </div>
      </section>

      {/* ═══ TABS ═══ Sticky under the archive bar (3.5rem). */}
      <div className="sticky top-14 z-40 border-y border-notebook-border bg-notebook-bg">
        <div className="archive-container">
          <div role="tablist" aria-label="Résumé sections" className="-mx-5 flex overflow-x-auto px-5 sm:mx-0 sm:px-0">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`resume-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`resume-panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => onTabKey(e, index)}
                  className={`relative flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 text-small transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus sm:px-5 ${
                    isActive ? 'border-accent text-ink-primary' : 'border-transparent text-ink-muted hover:text-ink-primary'
                  }`}
                >
                  <span aria-hidden="true" className="font-mono text-meta text-ink-faint">{tab.number}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <section
        id={`resume-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`resume-tab-${activeTab}`}
        className="archive-container py-10 sm:py-14"
      >
        <div className="max-w-5xl">

          {/* ─── Experience ─── */}
          {activeTab === 'experience' && (
            <div>
              {panelHeading('Experience')}
              <div className="space-y-6">
                {experience.map((item) => (
                  <article key={item.title} className={card}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-editorial text-lead leading-snug text-ink-primary">{item.title}</h3>
                        <p className="mt-1 text-small text-ink-secondary">{item.org}</p>
                      </div>
                      <span className={period}>{item.period}</span>
                    </div>
                    <p className={place}><MapPin size={12} aria-hidden="true" />{item.location}</p>
                    <ul className="mt-5 space-y-2">
                      {item.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-small text-ink-secondary">
                          <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ─── Projects ─── */}
          {activeTab === 'projects' && (
            <div>
              {panelHeading('Key Projects')}
              <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
                {projects.map((project) => (
                  <article key={project.name} className={card}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-editorial text-lead leading-snug text-ink-primary">{project.name}</h3>
                      <div className="-mr-2 -mt-2 flex shrink-0 items-center">
                        {project.demo && (
                          <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`${project.name}: demo (opens in a new tab)`} className="flex h-11 w-11 items-center justify-center text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus">
                            <ExternalLink size={14} aria-hidden="true" />
                          </a>
                        )}
                        {isPublicLink(project.link) && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`${project.name}: ${project.link === SOCIAL_LINKS.github ? 'GitHub profile' : 'source on GitHub'} (opens in a new tab)`} className="flex h-11 w-11 items-center justify-center text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus">
                            <Github size={14} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-small text-ink-muted">{project.subtitle}</p>
                    <TextAnimate by="text" animation="fadeIn" className="mt-3 text-small text-ink-secondary">{project.desc}</TextAnimate>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
                      {project.tech.map((t) => (
                        <li key={t} className="border border-notebook-border px-2 py-0.5 font-mono text-meta text-ink-muted">{t}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <Link
                to="/projects"
                className="mt-8 inline-flex min-h-11 items-center gap-2 text-small text-ink-primary underline decoration-notebook-border-light underline-offset-4 transition-colors duration-200 hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
              >
                View all experiments <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          )}

          {/* ─── Skills ─── */}
          {activeTab === 'skills' && (
            <div>
              {panelHeading('Technical Skills')}
              <div className="space-y-10">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="meta-label flex items-center gap-2">
                      <span aria-hidden="true" className="h-px w-6 bg-accent" />
                      {category}
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <li key={skill} className="border border-notebook-border px-3 py-1.5 text-small text-ink-secondary">{skill}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div>
                  <h3 className="meta-label flex items-center gap-2">
                    <span aria-hidden="true" className="h-px w-6 bg-accent" />
                    Languages
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {spokenLanguages.map((skill) => (
                      <li key={skill} className="border border-notebook-border px-3 py-1.5 text-small text-ink-secondary">{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ─── Education ─── */}
          {activeTab === 'education' && (
            <div>
              {panelHeading('Education')}
              <div className="space-y-6">
                {education.map((item) => (
                  <article key={item.degree} className={card}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="font-editorial text-lead leading-snug text-ink-primary">{item.degree}</h3>
                      <span className={period}>{item.period}</span>
                    </div>
                    {item.specialization && <p className="mt-1 text-small text-ink-secondary">{item.specialization}</p>}
                    <p className="mt-1 text-small text-ink-muted">{item.school}</p>
                    <p className={place}><MapPin size={12} aria-hidden="true" />{item.location}</p>
                    {item.points.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {item.points.map((point) => (
                          <li key={point} className="flex items-start gap-3 text-small text-ink-secondary">
                            <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ─── Activities ─── */}
          {activeTab === 'activities' && (
            <div>
              {panelHeading('Activities & Volunteering')}
              <div className="space-y-6">
                {extracurriculars.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.role} className={card}>
                      <div className="flex items-start gap-4">
                        <div aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center border border-notebook-border text-accent sm:h-11 sm:w-11">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="font-editorial text-lead leading-snug text-ink-primary">{item.role}</h3>
                            <span className={period}>{item.period}</span>
                          </div>
                          <p className="mt-1 text-small text-ink-muted">{item.org}</p>
                          {item.desc && <TextAnimate by="text" animation="fadeIn" className="mt-2 text-small text-ink-secondary">{item.desc}</TextAnimate>}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ DOWNLOAD ═══ */}
      <section aria-labelledby="resume-download" className="archive-container border-t border-notebook-border py-14 sm:py-16">
        <div className="max-w-2xl">
          <p className="meta-label">End of dossier</p>
          <EditorialHeading as="h2" variant="section" id="resume-download" className="mt-4">
            Want the full resume?
          </EditorialHeading>
          <TextAnimate by="line" animation="slideUp" className="mt-3 text-small text-ink-muted">
            Download the complete PDF — formatted for print and ATS-friendly.
          </TextAnimate>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={RESUME_LINK}
              download="Atharv_Vatsal_Resume.pdf"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-accent px-6 text-small text-ink-primary transition-colors duration-200 hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <Download size={14} aria-hidden="true" />
              Download Resume (PDF)
            </a>
            <Link
              to="/#contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 px-2 text-small text-ink-secondary underline decoration-notebook-border-light underline-offset-4 transition-colors duration-200 hover:text-ink-primary hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Get in Touch <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumePage;
