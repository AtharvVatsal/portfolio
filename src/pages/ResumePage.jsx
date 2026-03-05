import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Award,
  MapPin,
  Mail,
  Phone,
  Github,
  Linkedin,
  ExternalLink,
  ChevronDown,
  Camera
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CustomCursor, SEO } from '../components/common';
import { SOCIAL_LINKS, CONTACT_INFO, RESUME_LINK } from '../config/links';

const ResumePage = () => {
  const { currentTheme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [activeTab, setActiveTab] = useState('experience');

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
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

  const skills = {
    'Languages': [
      { name: 'Python', level: 90 },
      { name: 'JavaScript', level: 80 },
      { name: 'Java', level: 70 },
      { name: 'SQL', level: 75 },
      { name: 'R', level: 55 },
    ],
    'ML / AI': [
      { name: 'PyTorch', level: 85 },
      { name: 'Scikit-learn', level: 85 },
      { name: 'YOLOv8', level: 80 },
      { name: 'TensorFlow', level: 65 },
      { name: 'HuggingFace', level: 70 },
    ],
    'Web & Data': [
      { name: 'React', level: 85 },
      { name: 'Tailwind CSS', level: 85 },
      { name: 'Pandas / NumPy', level: 90 },
      { name: 'Flask / FastAPI', level: 70 },
      { name: 'OpenCV', level: 80 },
    ],
  };

  const experience = [
    {
      title: 'Technology Consultant',
      org: 'Himachal Pradesh Police',
      period: '2024 — Present',
      color: 'from-cyan-400 to-blue-500',
      points: [
        'Built PHQReportStream — an AI-powered parser for inter-battalion police reports using DistilBERT and NLTK',
        'Designed and analyzed employee engagement surveys with ML-driven insights',
        'Developed district-level analysis software for operational decision-making',
        'Delivered tools for real institutional use in time-sensitive environments',
      ],
    },
    {
      title: 'Event Photographer',
      org: 'VIT Vellore — Riviera & GraVITas',
      period: '2024 — 2025',
      color: 'from-purple-400 to-pink-500',
      points: [
        'Official photography for VIT\'s flagship cultural and technical festivals',
        'Covered concerts, events, and campus life for institutional media',
        'Shot with Nikon gear across portraits, landscapes, and concert settings',
      ],
    },
  ];

  const education = [
    {
      degree: 'B.Tech, Computer Science & Engineering',
      school: 'VIT — Vellore Institute of Technology',
      period: '2023 — 2027 (Expected)',
      color: 'from-amber-400 to-orange-500',
      details: 'Coursework: Machine Vision, Software Engineering, DBMS, Reinforcement Learning, Data Structures',
    },
  ];

  const projects = [
    {
      name: 'DriveSense',
      desc: 'YOLOv8 + U-Net dual-pipeline for autonomous driving perception',
      tech: 'PyTorch, OpenCV, CUDA, BDD100K',
      color: 'from-teal-400 to-indigo-500',
    },
    {
      name: 'RiskGrid',
      desc: 'Spatio-temporal crime prediction with ensemble ML',
      tech: 'XGBoost, LightGBM, GeoPandas, Flask',
      color: 'from-cyan-400 to-blue-500',
      link: 'https://github.com/AtharvVatsal/RiskGrid',
    },
    {
      name: 'The Canspiracy',
      desc: 'Real-time YOLOv8 object detection across multiple input sources',
      tech: 'PyTorch, OpenCV, YOLOv8, Tkinter',
      color: 'from-purple-400 to-pink-500',
      link: 'https://github.com/AtharvVatsal/TheCanspiracy',
    },
    {
      name: 'PHQReportStream',
      desc: 'AI parser for police reports with DistilBERT extraction',
      tech: 'Transformers, Streamlit, LangChain',
      color: 'from-green-400 to-emerald-500',
      link: 'https://github.com/AtharvVatsal/PHQReportStream',
    },
  ];

  const tabs = [
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'education', label: 'Education', icon: GraduationCap },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white ${!isTouchDevice ? 'cursor-none' : ''}`}>
      <SEO
        title="Resume"
        description="Interactive resume of Atharv Vatsal — CS student at VIT specializing in ML, Computer Vision, and Web Development."
        url="/resume"
        keywords={['resume', 'CV', 'Atharv Vatsal', 'machine learning engineer', 'VIT']}
      />
      <CustomCursor isTouchDevice={isTouchDevice} />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm sm:text-base">Portfolio</span>
          </Link>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 text-sm font-medium hover:scale-105 active:scale-[0.98]"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </header>

      {/* Hero / Identity */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500/8 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div
            className={`transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl flex-shrink-0">
                <img
                  src="/avPhoto.JPG"
                  alt="Atharv Vatsal"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              {/* Info */}
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Atharv Vatsal
                </h1>
                <p className="text-gray-300 text-base sm:text-lg mb-4">
                  CS Student · ML & Computer Vision · Photographer
                </p>

                {/* Contact pills */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                    <MapPin size={12} className="text-cyan-400" />
                    {CONTACT_INFO.location}
                  </span>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-cyan-400/30 transition-all"
                  >
                    <Mail size={12} className="text-cyan-400" />
                    {CONTACT_INFO.email}
                  </a>
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-cyan-400/30 transition-all"
                  >
                    <Github size={12} className="text-cyan-400" />
                    GitHub
                  </a>
                  <a
                    href={SOCIAL_LINKS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-blue-400/30 transition-all"
                  >
                    <Linkedin size={12} className="text-blue-400" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-12 sm:top-14 z-40 backdrop-blur-xl bg-black/40 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4">

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Experience</h2>
              {experience.map((item, i) => (
                <div
                  key={i}
                  className={`p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className={`text-lg font-semibold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{item.org}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full self-start">
                      {item.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {item.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color} mt-1.5 flex-shrink-0`} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Key Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project, i) => (
                  <div
                    key={i}
                    className={`group p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all duration-500 ${
                      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <h3 className={`text-base font-semibold bg-gradient-to-r ${project.color} bg-clip-text text-transparent mb-2`}>
                      {project.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-3 leading-relaxed">{project.desc}</p>
                    <p className="text-gray-500 text-[11px] mb-3 font-mono">{project.tech}</p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        <Github size={12} />
                        View Source
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center pt-4">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  View all projects with full details
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">Technical Skills</h2>
              {Object.entries(skills).map(([category, items], catIndex) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">{category}</h3>
                  <div className="space-y-3">
                    {items.map((skill, i) => (
                      <div
                        key={skill.name}
                        className={`transition-all duration-500 ${
                          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        }`}
                        style={{ transitionDelay: `${(catIndex * items.length + i) * 50}ms` }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-gray-300">{skill.name}</span>
                          <span className="text-xs text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-1000 ease-out"
                            style={{
                              width: isLoaded ? `${skill.level}%` : '0%',
                              transitionDelay: `${(catIndex * items.length + i) * 50 + 300}ms`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Education</h2>
              {education.map((item, i) => (
                <div
                  key={i}
                  className={`p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className={`text-lg font-semibold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        {item.degree}
                      </h3>
                      <p className="text-gray-400 text-sm">{item.school}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full self-start">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Download CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Want the full resume?
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Download the complete PDF with all details, formatted for print and ATS.
            </p>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 active:scale-[0.98] font-semibold"
            >
              <Download size={20} />
              Download Resume (PDF)
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors text-sm"
        >
          <Home size={14} />
          Back to Portfolio
        </Link>
      </footer>
    </div>
  );
};

export default ResumePage;