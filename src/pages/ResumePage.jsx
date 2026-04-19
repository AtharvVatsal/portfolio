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
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SEO, MouseGlow } from '../components/common';
import { useMousePosition } from '../hooks';
import { SOCIAL_LINKS, CONTACT_INFO, RESUME_LINK } from '../config/links';

const ResumePage = () => {
  const { currentTheme } = useTheme();
  const { mousePosition } = useMousePosition();
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
    { value: '6+', label: 'Projects Built', color: 'from-cyan-400 to-blue-500' },
    { value: '98%', label: 'NLP Accuracy', color: 'from-green-400 to-emerald-500' },
    { value: '7.8M+', label: 'Records Processed', color: 'from-purple-400 to-pink-500' },
    { value: '87.4%', label: 'Prediction Accuracy', color: 'from-amber-400 to-orange-500' },
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
      color: 'from-cyan-400 to-blue-500',
      gradient: 'from-cyan-500/10 to-blue-500/10',
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
      color: 'from-amber-400 to-orange-500',
      gradient: 'from-amber-500/10 to-orange-500/10',
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
      color: 'from-green-400 to-emerald-500',
      gradient: 'from-green-500/10 to-emerald-500/10',
      points: [],
    },
    {
      degree: '10th — CICSE',
      specialization: 'First Division · 90.7%',
      school: 'Sacred Heart Sr. Sec. School',
      location: 'Dharamshala, HP',
      period: '2021',
      color: 'from-blue-400 to-indigo-500',
      gradient: 'from-blue-500/10 to-indigo-500/10',
      points: [],
    },
  ];

  const projects = [
    {
      name: 'keeper-raw',
      subtitle: 'AI-Powered Offline Photo Culling Engine',
      desc: 'Cross-platform edge AI application to automate photo selection from large RAW datasets (3,000+ images → minutes). Multi-stage CV pipeline (YOLOv8 ONNX + MediaPipe + Laplacian) for sharpness and blink detection. XMP sidecar export for Lightroom integration.',
      tech: ['Rust', 'Tauri 2.x', 'React 19', 'TypeScript', 'ONNX Runtime', 'YOLOv8-face', 'FaceMesh', 'ExifTool', 'Rayon'],
      color: 'from-violet-400 to-purple-500',
      gradient: 'from-violet-500/10 to-purple-500/10',
      link: 'https://github.com/AtharvVatsal/keeper-raw',
      ongoing: true,
    },
    {
      name: 'DriveSense',
      subtitle: 'Autonomous Driving Perception — 55.6% mAP',
      desc: 'Real-time perception pipeline combining YOLOv8 (object detection) and U-Net (semantic segmentation). Trained on 70K+ images. ~14 FPS on RTX 3050. Batch and video processing for large-scale evaluation.',
      tech: ['PyTorch', 'YOLOv8', 'U-Net', 'OpenCV', 'CUDA', 'Albumentations'],
      color: 'from-teal-400 to-indigo-500',
      gradient: 'from-teal-500/10 to-indigo-500/10',
      demo: 'https://www.linkedin.com/feed/update/urn:li:activity:7434483913151983616/',
      link: 'https://github.com/AtharvVatsal/DriveSense',
    },
    {
      name: 'LZ-Quant',
      subtitle: 'Real-Time AI Trading Engine · ~5ms GPU / ~55ms CPU',
      desc: 'Low-latency trading system with DistilBERT (LoRA) sentiment analysis. ONNX optimization for fast inference. Real-time data pipelines (Reddit, RSS, Binance WebSocket). Z-score divergence strategy with risk controls.',
      tech: ['DistilBERT', 'LoRA', 'ONNX', 'FastAPI', 'Binance WebSocket', 'React', 'Python'],
      color: 'from-amber-400 to-yellow-500',
      gradient: 'from-amber-500/10 to-yellow-500/10',
      demo: 'https://lz-quant.vercel.app/',
      link: 'https://github.com/AtharvVatsal/lz-quant',
    },
    {
      name: 'HP Police ReportStream',
      subtitle: 'AI Document Processing · ~95% Accuracy',
      desc: 'Production-grade desktop app for structured data extraction from unstructured police reports. Hybrid NLP (Regex + spaCy NER + BERT). Reduced processing from 15-20 min to seconds. Cross-field validation and 10K+ rule-based typo correction.',
      tech: ['Python', 'DistilBERT', 'spaCy', 'NLTK', 'Streamlit', 'Scikit-learn', 'LangChain'],
      color: 'from-green-400 to-emerald-500',
      gradient: 'from-green-500/10 to-emerald-500/10',
      link: 'https://github.com/AtharvVatsal/PHQReportStream',
    },
    {
      name: 'PhysicsRL',
      subtitle: 'Domain-Randomized RL Framework',
      desc: 'PPO and SAC agents for continuous control (locomotion, landing, balancing). Domain randomization for robust generalization. Zero-shot transfer to unseen conditions (Mars gravity, low-friction). ONNX export for browser deployment.',
      tech: ['PyTorch', 'PPO', 'SAC', 'Gymnasium', 'ONNX', 'React', 'Three.js'],
      color: 'from-orange-400 to-red-500',
      gradient: 'from-orange-500/10 to-red-500/10',
    },
    {
      name: 'RiskGrid',
      subtitle: 'Spatio-Temporal Crime Prediction · 87.4% Accuracy',
      desc: 'Predicts crime 24hrs ahead from 7.8M+ records. 100m×100m spatial grid, ensemble ML (XGBoost, RF, LightGBM), 60+ engineered features, Dask distributed processing.',
      tech: ['XGBoost', 'LightGBM', 'GeoPandas', 'Dask', 'Folium', 'FastAPI'],
      color: 'from-cyan-400 to-blue-500',
      gradient: 'from-cyan-500/10 to-blue-500/10',
      link: 'https://github.com/AtharvVatsal/RiskGrid',
    },
    {
      name: 'Portfolio Website',
      subtitle: 'Full-Stack React + AI Chatbot',
      desc: 'This site — glassmorphism dark theme, custom cursor, markdown blog, photography gallery with EXIF, Gemini AI assistant, SEO with OG/Twitter Cards/JSON-LD.',
      tech: ['React', 'Tailwind', 'Gemini API', 'EmailJS'],
      color: 'from-amber-400 to-orange-500',
      gradient: 'from-amber-500/10 to-orange-500/10',
      link: 'https://github.com/AtharvVatsal',
    },
  ];

  const extracurriculars = [
    {
      role: 'Director of Photography',
      org: 'VITrendz — VIT\'s Largest Digital Media Platform',
      period: 'Mar 2025 — Present',
      color: 'from-purple-400 to-pink-500',
      icon: Camera,
      desc: 'Leading visual storytelling, capturing the culture of VIT through photography and videography. Curating content, covering events, shaping the platform\'s visual identity.',
    },
    {
      role: 'ProShow Photographer & Fest Lead',
      org: 'Riviera\'25 — Design and Media',
      period: 'Jan — Mar 2025',
      color: 'from-amber-400 to-orange-500',
      icon: Camera,
      desc: 'Official concert photographer capturing Shreya Ghoshal, Jonita Gandhi, Neeti Mohan, Sonu Sood. Live event photography under dynamic lighting, media production, post-event content.',
    },
    {
      role: 'Photographer',
      org: 'The Photography Club, VIT',
      period: 'Jan 2024 — Feb 2025',
      color: 'from-cyan-400 to-blue-500',
      icon: Camera,
      desc: 'SAE Stunt Show, Design Odyssey, GDSC Hexathon, and high-profile technical/cultural events. Action photography and dynamic event coverage.',
    },
    {
      role: 'Technical Blog Writer',
      org: 'atharvvatsal.com/blog',
      period: '2025 — Present',
      color: 'from-emerald-400 to-teal-500',
      icon: Code,
      desc: 'Publishing technical articles blending ML concepts with storytelling — model evaluation metrics, photography journey, coding origins, and real-world tech impact.',
    },
  ];

  const tabs = [
    { id: 'experience', label: 'Experience', icon: Briefcase, color: 'from-cyan-400 to-blue-500' },
    { id: 'projects', label: 'Projects', icon: Code, color: 'from-purple-400 to-pink-500' },
    { id: 'skills', label: 'Skills', icon: Wrench, color: 'from-amber-400 to-orange-500' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: 'from-green-400 to-emerald-500' },
    { id: 'activities', label: 'Activities', icon: Users, color: 'from-pink-400 to-purple-500' },
  ];

  // ─── RENDER ───────────────────────────────────────────

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white`}>
      <SEO
        title="Resume"
        description="Interactive resume of Atharv Vatsal — CS student at VIT specializing in AI/ML, with experience at the Government of Himachal Pradesh."
        url="/resume"
        keywords={['resume', 'CV', 'Atharv Vatsal', 'machine learning', 'VIT']}
      />

      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <MouseGlow
          mousePosition={mousePosition}
          size={600}
          blur={100}
          smoothing={0.06}
          className="opacity-40"
          gradient="radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, rgba(168, 85, 247, 0.15) 40%, transparent 70%)"
        />
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/3 right-1/6 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1.5s' }}></div>
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '3s' }}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm sm:text-base">Portfolio</span>
          </Link>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-sm font-medium hover:scale-105 active:scale-[0.98]"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div
            className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
              
              {/* Avatar with glow */}
              <div className="relative group">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/30 to-purple-500/30 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700 scale-110"></div>
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl group-hover:border-cyan-400/30 transition-all duration-500">
                  <img src="/avPhoto.webp" alt="Atharv Vatsal" width="128" height="128" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </div>

              {/* Identity */}
              <div className="text-center lg:text-left flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Atharv Vatsal
                </h1>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-5">
                  CS Engineering (AI/ML) · VIT Vellore '27 · Photographer & Visual Storyteller
                </p>

                {/* Contact pills */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
                  {[
                    { icon: MapPin, text: 'Dharamshala, HP', href: null, color: 'text-cyan-400' },
                    { icon: Mail, text: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}`, color: 'text-cyan-400', hideTextMobile: true, mobileText: 'Email' },
                    { icon: Phone, text: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone}`, color: 'text-cyan-400' },
                    { icon: Github, text: 'GitHub', href: SOCIAL_LINKS.github, color: 'text-cyan-400' },
                    { icon: Linkedin, text: 'LinkedIn', href: SOCIAL_LINKS.linkedin, color: 'text-blue-400' },
                    { icon: Globe, text: 'Portfolio', href: 'https://atharvvatsal.com', color: 'text-purple-400' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    const inner = (
                      <>
                        <Icon size={12} className={item.color} />
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
                    const cls = "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all duration-300";

                    return item.href ? (
                      <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className={cls}>{inner}</a>
                    ) : (
                      <span key={i} className={cls}>{inner}</span>
                    );
                  })}
                </div>

                {/* Highlight Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {highlights.map((stat, i) => (
                    <div
                      key={i}
                      className={`group p-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 text-center ${
                        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                      style={{ transitionDelay: `${300 + i * 100}ms` }}
                    >
                      <div className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                        {stat.value}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TABS ═══ */}
      <div className="sticky top-12 sm:top-14 z-40 backdrop-blur-xl bg-black/50 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2.5 -mx-4 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-lg'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-white' : ''} />
                  {tab.label}
                  {isActive && (
                    <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r ${tab.color}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <section className="relative py-10 sm:py-14 lg:py-18">
        <div className="max-w-6xl mx-auto px-4">

          {/* ─── Experience ─── */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Briefcase size={24} className="text-cyan-400" />
                Experience
              </h2>
              {experience.map((item, i) => (
                <div
                  key={i}
                  className={`group relative p-6 sm:p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-700 overflow-hidden ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`}></div>
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <div>
                        <h3 className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                          {item.title}
                        </h3>
                        <p className="text-gray-300 text-sm mt-0.5">{item.org}</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full self-start whitespace-nowrap backdrop-blur-sm">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mb-5 flex items-center gap-1.5">
                      <MapPin size={12} />
                      {item.location}
                    </p>
                    <ul className="space-y-2.5">
                      {item.points.map((point, j) => (
                        <li key={j} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                          <ChevronRight size={14} className={`mt-0.5 flex-shrink-0 text-transparent bg-gradient-to-r ${item.color} bg-clip-text`} style={{ color: 'rgb(34, 211, 238)' }} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Projects ─── */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Code size={24} className="text-purple-400" />
                Key Projects
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {projects.map((project, i) => (
                  <div
                    key={i}
                    className={`group relative p-5 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-700 hover:scale-[1.02] overflow-hidden ${
                      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`}></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className={`text-base sm:text-lg font-bold bg-gradient-to-r ${project.color} bg-clip-text text-transparent`}>
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {project.demo && (
                            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 transition-all text-gray-400 hover:text-white">
                              <ExternalLink size={13} />
                            </a>
                          )}
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 transition-all text-gray-400 hover:text-white">
                              <Github size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-500 text-[11px] sm:text-xs font-medium mb-3">{project.subtitle}</p>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">{project.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] bg-white/5 border border-white/10 text-gray-400 group-hover:border-white/20 transition-colors">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center pt-6">
                <Link to="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  View all projects with full details
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* ─── Skills ─── */}
          {activeTab === 'skills' && (
            <div className="space-y-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Wrench size={24} className="text-amber-400" />
                Technical Skills
              </h2>
              {Object.entries(skills).map(([category, items], catIndex) => (
                <div key={category}>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                    <span className="w-8 h-px bg-gradient-to-r from-cyan-400 to-transparent"></span>
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
                    {items.map((skill, i) => (
                      <div
                        key={skill.name}
                        className={`group transition-all duration-500 ${
                          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        }`}
                        style={{ transitionDelay: `${(catIndex * 2 + i) * 30}ms` }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{skill.name}</span>
                          <span className="text-[11px] text-gray-600 tabular-nums">{skill.level}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-1000 ease-out group-hover:shadow-lg group-hover:shadow-cyan-400/20 relative"
                            style={{
                              width: isLoaded ? `${skill.level}%` : '0%',
                              transitionDelay: `${(catIndex * 2 + i) * 30 + 300}ms`,
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Soft Skills */}
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <span className="w-8 h-px bg-gradient-to-r from-pink-400 to-transparent"></span>
                  Soft Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Problem-Solving & Analytical Thinking', 'Leadership & Teamwork', 'Communication & Public Speaking', 'Time Management', 'Creativity & Innovation', 'Attention to Detail'].map((skill) => (
                    <span key={skill} className="px-3.5 py-1.5 rounded-full text-xs bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 cursor-default">
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <GraduationCap size={24} className="text-green-400" />
                Education
              </h2>
              {education.map((item, i) => (
                <div
                  key={i}
                  className={`group relative p-6 sm:p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-700 overflow-hidden ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`}></div>
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                      <h3 className={`text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {item.degree}
                      </h3>
                      <span className="text-xs text-gray-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full self-start whitespace-nowrap backdrop-blur-sm">
                        {item.period}
                      </span>
                    </div>
                    {item.specialization && (
                      <p className="text-gray-200 text-sm font-medium mb-1">{item.specialization}</p>
                    )}
                    <p className="text-gray-400 text-sm">{item.school}</p>
                    <p className="text-gray-500 text-xs mb-3 flex items-center gap-1.5 mt-1">
                      <MapPin size={11} />
                      {item.location}
                    </p>
                    {item.points.length > 0 && (
                      <ul className="space-y-2">
                        {item.points.map((point, j) => (
                          <li key={j} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                            <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color} mt-2 flex-shrink-0`} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Activities ─── */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Users size={24} className="text-pink-400" />
                Activities & Volunteering
              </h2>
              {extracurriculars.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className={`group relative p-5 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-700 overflow-hidden ${
                      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br from-${item.color.split(' ')[0].replace('from-', '')}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`}></div>
                    <div className="relative z-10 flex items-start gap-4">
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                          <h3 className={`text-sm sm:text-base font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                            {item.role}
                          </h3>
                          <span className="text-[11px] text-gray-500 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full self-start whitespace-nowrap">
                            {item.period}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs sm:text-sm mb-2">{item.org}</p>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
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
      <section className="relative py-14 sm:py-18">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="group relative p-8 sm:p-12 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all duration-700 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
            <div className="relative z-10">
              <Sparkles size={28} className="mx-auto mb-4 text-cyan-400 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Want the full resume?
              </h2>
              <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
                Download the complete PDF — formatted for print and ATS-friendly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 active:scale-[0.98] font-semibold"
                >
                  <Download size={20} />
                  Download Resume (PDF)
                </button>
                <Link
                  to="/"
                  onClick={() => {
                    // Set flag so home page scrolls to contact after mounting
                    sessionStorage.setItem('scrollToSection', 'contact');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-gray-300 hover:text-white font-medium text-sm"
                >
                  <Mail size={18} />
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4">
          <Link to="/" className="text-xs sm:text-sm text-gray-500 hover:text-cyan-400 transition-colors">Portfolio</Link>
          <span className="text-gray-700">·</span>
          <Link to="/projects" className="text-xs sm:text-sm text-gray-500 hover:text-cyan-400 transition-colors">Projects</Link>
          <span className="text-gray-700">·</span>
          <Link to="/blog" className="text-xs sm:text-sm text-gray-500 hover:text-cyan-400 transition-colors">Blog</Link>
        </div>
        <p className="text-gray-600 text-xs">© 2025 Atharv Vatsal</p>
      </footer>
    </div>
  );
};

export default ResumePage;