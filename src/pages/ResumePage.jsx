import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  GraduationCap, 
  Briefcase, 
  Code, 
  MapPin,
  Mail,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  Camera,
  Globe,
  Users,
  Wrench,
} from 'lucide-react';
import { SEO } from '../components/common';
import { SOCIAL_LINKS, CONTACT_INFO, RESUME_LINK } from '../config/links';

const ResumePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('experience');

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = RESUME_LINK;
    link.download = 'Atharv_Vatsal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── DATA ─────────────────────────────────────────────

  const highlights = [
    { value: '6+', label: 'Projects Built' },
    { value: '98%', label: 'NLP Accuracy' },
    { value: '7.8M+', label: 'Records Processed' },
    { value: '87.4%', label: 'Prediction Accuracy' },
  ];

  const skills = {
    'Languages': [
      { name: 'Python', level: 95 },
      { name: 'C / C++', level: 80 },
      { name: 'Java', level: 75 },
      { name: 'JavaScript / TypeScript', level: 85 },
      { name: 'Rust', level: 65 },
      { name: 'SQL', level: 75 },
      { name: 'Go', level: 55 },
      { name: 'Bash / Linux', level: 70 },
      { name: 'R', level: 50 },
      { name: 'MATLAB', level: 50 },
    ],
    'AI/ML & Deep Learning': [
      { name: 'PyTorch', level: 90 },
      { name: 'Scikit-learn', level: 88 },
      { name: 'Computer Vision', level: 88 },
      { name: 'YOLOv8 / ONNX', level: 85 },
      { name: 'NLP / LLMs', level: 82 },
      { name: 'Reinforcement Learning', level: 78 },
      { name: 'XGBoost / LightGBM', level: 80 },
      { name: 'TensorFlow', level: 65 },
      { name: 'MediaPipe', level: 75 },
      { name: 'Pandas / NumPy', level: 92 },
    ],
    'Backend & Systems': [
      { name: 'FastAPI', level: 80 },
      { name: 'Tauri 2.x', level: 70 },
      { name: 'Node.js', level: 75 },
      { name: 'WebSockets', level: 78 },
      { name: 'Real-time Pipelines', level: 80 },
      { name: 'System Design', level: 75 },
      { name: 'Docker', level: 50 },
    ],
    'Data & Visualization': [
      { name: 'Pandas / NumPy', level: 92 },
      { name: 'Plotly', level: 85 },
      { name: 'OpenCV', level: 82 },
      { name: 'Power BI', level: 65 },
      { name: 'Dask', level: 70 },
      { name: 'GeoPandas', level: 65 },
      { name: 'Matplotlib', level: 80 },
    ],
    'Tools & DevOps': [
      { name: 'Git / GitHub', level: 90 },
      { name: 'Linux', level: 75 },
      { name: 'React', level: 85 },
      { name: 'Vite', level: 80 },
      { name: 'Streamlit', level: 80 },
      { name: 'Firebase', level: 55 },
    ],
    'Core CS Fundamentals': [
      { name: 'Data Structures & Algorithms', level: 78 },
      { name: 'OOP', level: 85 },
      { name: 'DBMS', level: 75 },
      { name: 'Computer Networks', level: 70 },
      { name: 'Operating Systems', level: 68 },
    ],
  };

  const experience = [
    {
      title: 'Intern — AI/ML & Data Science',
      org: 'Department of Digital Technologies & Governance, Government of Himachal Pradesh',
      location: 'Dharamshala, Himachal Pradesh',
      period: 'May 2025 — July 2025',
      points: [
        'Designed and implemented AI/ML models to optimize government workflows and enhance decision-making across departments',
        'Conducted data cleaning, preprocessing, and EDA on large-scale administrative datasets for key operational insights',
        'Built predictive models using Python, Scikit-learn, and Pandas for trend forecasting and resource allocation',
        'Developed interactive dashboards using Power BI and Plotly for non-technical stakeholders',
        'Applied computer vision techniques for automating document processing and image-based data validation',
        'Collaborated with cross-functional teams to translate governance challenges into data-driven solutions',
        'Delivered data-driven reports and presentations to senior officials for digital transformation strategies',
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
        'ML, Deep Learning, Computer Vision, DSA, System Design, Computational Mathematics',
        'Digital system design, embedded C/C++, real-time computational problem-solving',
        'Multiple ML-driven projects: YOLO detection, predictive modeling, statistical analysis',
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
      degree: '10th — CICSE',
      specialization: 'First Division · 90.7%',
      school: 'Sacred Heart Sr. Sec. School',
      location: 'Dharamshala, HP',
      period: '2021',
      points: [],
    },
  ];

  const projects = [
    {
      name: 'keeper-raw',
      subtitle: 'AI-Powered Offline Photo Culling Engine',
      desc: 'Cross-platform edge AI application to automate photo selection from large RAW datasets (3,000+ images → minutes). Multi-stage CV pipeline (YOLOv8 ONNX + MediaPipe + Laplacian) for sharpness and blink detection. XMP sidecar export for Lightroom integration.',
      tech: ['Rust', 'Tauri 2.x', 'React 19', 'TypeScript', 'ONNX Runtime', 'YOLOv8-face', 'FaceMesh', 'ExifTool', 'Rayon'],
      link: 'https://github.com/AtharvVatsal/keeper-raw',
      ongoing: true,
    },
    {
      name: 'DriveSense',
      subtitle: 'Autonomous Driving Perception — 55.6% mAP',
      desc: 'Real-time perception pipeline combining YOLOv8 (object detection) and U-Net (semantic segmentation). Trained on 70K+ images. ~14 FPS on RTX 3050. Batch and video processing for large-scale evaluation.',
      tech: ['PyTorch', 'YOLOv8', 'U-Net', 'OpenCV', 'CUDA', 'Albumentations'],
      demo: 'https://www.linkedin.com/feed/update/urn:li:activity:7434483913151983616/',
      link: 'https://github.com/AtharvVatsal/DriveSense',
    },
    {
      name: 'LZ-Quant',
      subtitle: 'Real-Time AI Trading Engine · ~5ms GPU / ~55ms CPU',
      desc: 'Low-latency trading system with DistilBERT (LoRA) sentiment analysis. ONNX optimization for fast inference. Real-time data pipelines (Reddit, RSS, Binance WebSocket). Z-score divergence strategy with risk controls.',
      tech: ['DistilBERT', 'LoRA', 'ONNX', 'FastAPI', 'Binance WebSocket', 'React', 'Python'],
      demo: 'https://lz-quant.vercel.app/',
      link: 'https://github.com/AtharvVatsal/lz-quant',
    },
    {
      name: 'HP Police ReportStream',
      subtitle: 'AI Document Processing · ~95% Accuracy',
      desc: 'Production-grade desktop app for structured data extraction from unstructured police reports. Hybrid NLP (Regex + spaCy NER + BERT). Reduced processing from 15-20 min to seconds. Cross-field validation and 10K+ rule-based typo correction.',
      tech: ['Python', 'DistilBERT', 'spaCy', 'NLTK', 'Streamlit', 'Scikit-learn', 'LangChain'],
      link: 'https://github.com/AtharvVatsal/PHQReportStream',
    },
    {
      name: 'PhysicsRL',
      subtitle: 'Domain-Randomized RL Framework',
      desc: 'PPO and SAC agents for continuous control (locomotion, landing, balancing). Domain randomization for robust generalization. Zero-shot transfer to unseen conditions (Mars gravity, low-friction). ONNX export for browser deployment.',
      tech: ['PyTorch', 'PPO', 'SAC', 'Gymnasium', 'ONNX', 'React', 'Three.js'],
    },
    {
      name: 'RiskGrid',
      subtitle: 'Spatio-Temporal Crime Prediction · 87.4% Accuracy',
      desc: 'Predicts crime 24hrs ahead from 7.8M+ records. 100m×100m spatial grid, ensemble ML (XGBoost, RF, LightGBM), 60+ engineered features, Dask distributed processing.',
      tech: ['XGBoost', 'LightGBM', 'GeoPandas', 'Dask', 'Folium', 'FastAPI'],
      link: 'https://github.com/AtharvVatsal/RiskGrid',
    },
    {
      name: 'Portfolio Website',
      subtitle: 'Full-Stack React + AI Chatbot',
      desc: 'This site — glassmorphism dark theme, custom cursor, markdown blog, photography gallery with EXIF, Gemini AI assistant, SEO with OG/Twitter Cards/JSON-LD.',
      tech: ['React', 'Tailwind', 'Gemini API', 'EmailJS'],
      link: 'https://github.com/AtharvVatsal',
    },
  ];

  const extracurriculars = [
    {
      role: 'Director of Photography',
      org: 'VITrendz — VIT\'s Largest Digital Media Platform',
      period: 'Mar 2025 — Present',
      icon: Camera,
      desc: 'Leading visual storytelling, capturing the culture of VIT through photography and videography. Curating content, covering events, shaping the platform\'s visual identity.',
    },
    {
      role: 'ProShow Photographer & Fest Lead',
      org: 'Riviera\'25 — Design and Media',
      period: 'Jan — Mar 2025',
      icon: Camera,
      desc: 'Official concert photographer capturing Shreya Ghoshal, Jonita Gandhi, Neeti Mohan, Sonu Sood. Live event photography under dynamic lighting, media production, post-event content.',
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
    { id: 'experience', label: '01 Experience', icon: Briefcase },
    { id: 'projects', label: '02 Projects', icon: Code },
    { id: 'skills', label: '03 Skills', icon: Wrench },
    { id: 'education', label: '04 Education', icon: GraduationCap },
    { id: 'activities', label: '05 Activities', icon: Users },
  ];

  // ─── RENDER ───────────────────────────────────────────

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary binder-margin">
      <SEO
        title="Resume"
        description="Interactive resume of Atharv Vatsal — CS student at VIT specializing in AI/ML, with experience at the Government of Himachal Pradesh."
        url="/resume"
        keywords={['resume', 'CV', 'Atharv Vatsal', 'machine learning', 'VIT']}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-notebook-bg/95 backdrop-blur-sm border-b border-notebook-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-ink-muted hover:text-ink-primary transition-colors duration-300 group text-meta font-mono"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>← Portfolio</span>
          </Link>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blueprint text-white hover:bg-blueprint/90 transition-all duration-300 text-meta font-mono"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative py-10 sm:py-14 lg:py-16 border-b border-notebook-border">
        <div className="max-w-5xl mx-auto px-4">
          <div
            className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {/* Document metadata */}
            <div className="flex items-center gap-4 mb-6 text-meta font-mono text-ink-muted">
              <span>Growth Record</span>
              <span className="text-notebook-border/60">|</span>
              <span>AV-ARCH-RESUME</span>
              <span className="text-notebook-border/60">|</span>
              <span>PUBLIC</span>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
              
              {/* Photo */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 overflow-hidden border border-notebook-border grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 rounded-xl">
                  <img src="/avPhoto.webp" alt="Atharv Vatsal" width="128" height="128" className="w-full h-full object-cover rounded-xl" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <span className="block text-meta font-mono text-ink-muted mt-2 text-center">Figure 001</span>
              </div>

              {/* Identity */}
              <div className="text-center lg:text-left flex-1">
                <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl mb-2 text-ink-primary">
                  Atharv Vatsal
                </h1>
                <p className="text-ink-secondary text-sm sm:text-base lg:text-lg mb-5">
                  CS Engineering (AI/ML) · VIT Vellore '27 · Photographer & Visual Storyteller
                </p>

                {/* Contact info */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
                  {[
                    { icon: MapPin, text: 'Dharamshala, HP', href: null },
                    { icon: Mail, text: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}`, hideTextMobile: true, mobileText: 'Email' },
                    { icon: Phone, text: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone}` },
                    { icon: Github, text: 'GitHub', href: SOCIAL_LINKS.github },
                    { icon: Linkedin, text: 'LinkedIn', href: SOCIAL_LINKS.linkedin },
                    { icon: Globe, text: 'Portfolio', href: 'https://atharvvatsal.com' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    const inner = (
                      <>
                        <Icon size={12} className="text-ink-faint" />
                        {item.hideTextMobile ? (
                          <>
                            <span className="hidden sm:inline">{item.text}</span>
                            <span className="sm:hidden">{item.mobileText}</span>
                          </>
                        ) : (
                          <span>{item.text}</span>
                        )}
                      </>
                    );
                    const cls = "flex items-center gap-1.5 px-2.5 py-1 text-meta font-mono text-ink-muted border border-notebook-border hover:text-ink-primary hover:border-blueprint/30 transition-all duration-300";

                    return item.href ? (
                      <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={cls}>{inner}</a>
                    ) : (
                      <span key={i} className={cls}>{inner}</span>
                    );
                  })}
                </div>

                {/* Highlight Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {highlights.map((stat, i) => (
                    <div
                      key={i}
                      className={`group p-3 border border-notebook-border text-center transition-all duration-500 ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                      style={{ transitionDelay: `${300 + i * 100}ms` }}
                    >
                      <div className="text-xl sm:text-2xl font-mono text-ink-primary">
                        {stat.value}
                      </div>
                      <div className="text-meta font-mono text-ink-muted mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TABS ═══ */}
      <div className="sticky top-[52px] z-40 bg-notebook-bg/95 backdrop-blur-sm border-b border-notebook-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide py-0 -mx-4 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 sm:px-5 py-3 text-meta font-mono whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    isActive
                      ? 'text-ink-primary border-b-2 border-blueprint'
                      : 'text-ink-faint hover:text-ink-muted border-b-2 border-transparent'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <section className="relative py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 margin-line">

          {/* ─── Experience ─── */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-meta text-ink-muted uppercase tracking-wider">Section 01</span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-ink-primary">Experience</h2>
                <div className="h-px flex-1 bg-notebook-border/60" />
              </div>
              {experience.map((item, i) => (
                <div
                  key={i}
                  className={`p-6 sm:p-8 border border-notebook-border hover:border-blueprint/20 transition-all duration-500 doc-frame ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-ink-primary">
                        {item.title}
                      </h3>
                      <p className="text-ink-secondary text-sm mt-0.5">{item.org}</p>
                    </div>
                    <span className="text-meta text-ink-muted font-mono border border-notebook-border px-3 py-1 self-start whitespace-nowrap">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-ink-muted text-meta mb-5 flex items-center gap-1.5 font-mono">
                    <MapPin size={12} />
                    {item.location}
                  </p>
                  <ul className="space-y-2">
                    {item.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-3 text-ink-secondary text-sm leading-relaxed">
                        <span className="text-blueprint mt-1.5 flex-shrink-0">›</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* ─── Projects ─── */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-meta text-ink-muted uppercase tracking-wider">Section 02</span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-ink-primary">Key Projects</h2>
                <div className="h-px flex-1 bg-notebook-border/60" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {projects.map((project, i) => (
                  <div
                    key={i}
className={`group p-5 sm:p-6 border border-notebook-border hover:border-blueprint/20 transition-all duration-500 doc-frame ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-ink-primary">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {project.demo && (
                          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="p-1.5 text-ink-muted hover:text-blueprint transition-all">
                            <ExternalLink size={13} />
                          </a>
                        )}
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-1.5 text-ink-muted hover:text-blueprint transition-all">
                            <Github size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-ink-faint text-meta font-mono mb-3">{project.subtitle}</p>
                    <p className="text-ink-secondary text-xs sm:text-sm leading-relaxed mb-4">{project.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span key={t} className="px-2 py-0.5 text-meta font-mono text-ink-muted border border-notebook-border">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center pt-6">
                <Link to="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 border border-notebook-border text-meta text-ink-muted hover:text-ink-primary hover:border-blueprint transition-all duration-300 font-mono">
                  View all experiments
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* ─── Skills ─── */}
          {activeTab === 'skills' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-meta text-ink-muted uppercase tracking-wider">Section 03</span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-ink-primary">Technical Skills</h2>
                <div className="h-px flex-1 bg-notebook-border/60" />
              </div>
              {Object.entries(skills).map(([category, items], catIndex) => (
                <div key={category}>
                  <h3 className="text-meta font-mono text-ink-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-6 h-px bg-blueprint/60"></span>
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {items.map((skill, i) => (
                      <div
                        key={skill.name}
                        className={`group transition-all duration-500 ${
                          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        }`}
                        style={{ transitionDelay: `${(catIndex * 2 + i) * 30}ms` }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-ink-secondary group-hover:text-ink-primary transition-colors">{skill.name}</span>
                          <span className="text-meta text-ink-muted font-mono tabular-nums">{skill.level}%</span>
                        </div>
                        <div className="h-1 bg-notebook-border overflow-hidden">
                          <div
                            className="h-full bg-blueprint transition-all duration-1000 ease-out"
                            style={{
                              width: isLoaded ? `${skill.level}%` : '0%',
                              transitionDelay: `${(catIndex * 2 + i) * 30 + 300}ms`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Soft Skills */}
              <div>
                <h3 className="text-meta font-mono text-ink-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 h-px bg-blueprint/60"></span>
                  Soft Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Problem-Solving & Analytical Thinking', 'Leadership & Teamwork', 'Communication & Public Speaking', 'Time Management', 'Creativity & Innovation', 'Attention to Detail'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 text-meta font-mono text-ink-muted border border-notebook-border hover:border-blueprint/30 hover:text-ink-primary transition-all duration-300 cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Education ─── */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-meta text-ink-muted uppercase tracking-wider">Section 04</span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-ink-primary">Education</h2>
                <div className="h-px flex-1 bg-notebook-border/60" />
              </div>
              {education.map((item, i) => (
                <div
                  key={i}
                  className={`p-6 sm:p-8 border border-notebook-border hover:border-blueprint/20 transition-all duration-500 doc-frame ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold text-ink-primary">
                      {item.degree}
                    </h3>
                    <span className="text-meta text-ink-muted font-mono border border-notebook-border px-3 py-1 self-start whitespace-nowrap">
                      {item.period}
                    </span>
                  </div>
                  {item.specialization && (
                    <p className="text-ink-secondary text-sm font-medium mb-1">{item.specialization}</p>
                  )}
                  <p className="text-ink-muted text-sm">{item.school}</p>
                  <p className="text-ink-muted text-meta mb-3 flex items-center gap-1.5 mt-1 font-mono">
                    <MapPin size={11} />
                    {item.location}
                  </p>
                  {item.points.length > 0 && (
                    <ul className="space-y-2">
                      {item.points.map((point, j) => (
                        <li key={j} className="flex items-start gap-3 text-ink-secondary text-sm leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-blueprint mt-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ─── Activities ─── */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-meta text-ink-muted uppercase tracking-wider">Section 05</span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-ink-primary">Activities & Volunteering</h2>
                <div className="h-px flex-1 bg-notebook-border/60" />
              </div>
              {extracurriculars.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className={`p-5 sm:p-6 border border-notebook-border hover:border-blueprint/20 transition-all duration-500 ${
                      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 border border-notebook-border flex items-center justify-center flex-shrink-0 text-blueprint">
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                          <h3 className="text-sm sm:text-base font-bold text-ink-primary">
                            {item.role}
                          </h3>
                          <span className="text-meta text-ink-muted font-mono border border-notebook-border px-2.5 py-0.5 self-start whitespace-nowrap">
                            {item.period}
                          </span>
                        </div>
                        <p className="text-ink-muted text-xs sm:text-sm mb-2">{item.org}</p>
                        <p className="text-ink-secondary text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══ DOWNLOAD CTA ═══ */}
      <section className="relative py-12 sm:py-16 border-t border-notebook-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="p-8 sm:p-12 border border-notebook-border doc-frame">
            <div className="font-mono text-meta text-ink-muted mb-4">// end of dossier</div>
            <h2 className="font-editorial text-xl sm:text-2xl mb-3 text-ink-primary">
              Want the full resume?
            </h2>
            <p className="text-ink-muted text-sm mb-8 max-w-md mx-auto">
              Download the complete PDF — formatted for print and ATS-friendly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-8 py-3 bg-blueprint text-white hover:bg-blueprint/90 transition-all duration-300 font-mono text-meta"
              >
                <Download size={18} />
                Download Resume (PDF)
              </button>
              <Link
                to="/"
                onClick={() => {
                  sessionStorage.setItem('scrollToSection', 'contact');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-notebook-border text-ink-secondary hover:text-ink-primary hover:border-blueprint transition-all duration-300 font-mono text-meta"
              >
                <Mail size={16} />
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-6 text-center border-t border-notebook-border">
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-3">
          <Link to="/" className="text-meta font-mono text-ink-faint hover:text-blueprint transition-colors">Portfolio</Link>
          <span className="text-notebook-border">·</span>
          <Link to="/projects" className="text-meta font-mono text-ink-faint hover:text-blueprint transition-colors">Projects</Link>
          <span className="text-notebook-border">·</span>
          <Link to="/blog" className="text-meta font-mono text-ink-faint hover:text-blueprint transition-colors">Blog</Link>
        </div>
        <p className="text-ink-faint text-meta font-mono">© {new Date().getFullYear()} Atharv Vatsal</p>
      </footer>
    </div>
  );
};

export default ResumePage;
