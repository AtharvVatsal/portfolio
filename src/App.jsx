import React, { useState, useEffect, useRef } from 'react';
import { Camera, Code, Film, Github, Linkedin, Instagram, MessageCircleWarning, Menu, X, Moon, Sun, ChevronDown, Sparkles, ScanEye, MessageCircle, Music, Rocket, Zap, Database, Brain, Palette, Award, ArrowRight, ExternalLink, Mail, MapPin, Phone, Download, Play, Pause, Siren, FileChartColumn} from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentRole, setCurrentRole] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [scrollY, setScrollY] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [ripples, setRipples] = useState([]);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [typedText, setTypedText] = useState('');
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [projectHover, setProjectHover] = useState(null);
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  const heroRef = useRef(null);
  const cursorRef = useRef(null);
  const trailCanvasRef = useRef(null);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const lastScrollDirection = useRef(0);

  const roles = ['Computer Science Engineer', 'Photographer', 'Video Editor', 'Creative Designer', 'Tech Enthusiast', 'AI Explorer', 'Compter Vision Developer'];
  const taglines = [
    'Building the future with code',
    'Capturing moments that matter',
    'Creating visual stories',
    'Designing digital experiences',
    'Exploring technology and innovation',
    'Pushing the boundaries of AI',
    'Advancing the field of Computer Vision'
  ];
  
  const skills = [
    { name: 'Python', level: 95, color: 'from-blue-400 to-blue-600' },           // Python blue
  { name: 'Java', level: 85, color: 'from-orange-400 to-amber-600' },          // Coffee/Java theme
  { name: 'C/C++', level: 75, color: 'from-slate-400 to-slate-600' },          // Metal/low-level
  { name: 'MATLAB', level: 95, color: 'from-orange-500 to-red-600' },          // MATLAB orange
  { name: 'SQL and Database Management', level: 80, color: 'from-teal-400 to-cyan-600' },  // Data/water
  { name: 'Full Stack Development', level: 70, color: 'from-violet-400 to-purple-600' },   // Versatile
  { name: 'Machine Learning', level: 80, color: 'from-purple-500 to-fuchsia-600' },        // AI/futuristic
  { name: 'Computer Vision', level: 92, color: 'from-sky-400 to-blue-600' },   // Vision/eyes
  { name: 'Data Analytics', level: 97, color: 'from-emerald-400 to-green-600' }, // Growth/insights
  { name: 'Figma', level: 65, color: 'from-fuchsia-400 to-pink-600' },         // Figma brand
  { name: 'Adobe CC Suite', level: 80, color: 'from-red-400 to-rose-600' },    // Adobe red
  { name: 'OOPs', level: 98, color: 'from-indigo-400 to-indigo-600' },         // Structured
  { name: 'AWS', level: 65, color: 'from-amber-400 to-orange-600' },           // AWS orange
  { name: 'Computational Mathematics', level: 90, color: 'from-rose-400 to-pink-600' }
  ];

  const projects = [
    {
      id: 1,
      title: 'RiskGrid: ML Based Predictive Policing',
      description: 'AI-Powered Machine learning system for real-time crime risk prediction and intelligent patrol optimization',
      tech: ['Python', 'XGBoost', 'Random Forest', 'LightGBM', 'Scikit-learn', 'GeoPandas', 'Folium', 'Flask', 'FastAPI'],
      color: 'from-cyan-400 to-blue-500',
      icon: Siren,
      gradient: 'from-cyan-500/20 to-blue-500/20'
    },
    {
      id: 2,
      title: 'The Canspiracy: Real-time can detection using Computer Vision and ML.',
      description: 'YOLOv8-based object detection across multiple formats - from single images to real-time video feeds including webcam and mobile phone cameras via DroidCam.',
      tech: ['Pytorch', 'openCV', 'YOLOv8', 'Searborn', 'Matplotlib', 'Pandas', 'NumPy', 'Tkinter', 'Squarify', 'Droidcam'],
      color: 'from-purple-400 to-pink-500',
      icon: ScanEye,
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 3,
      title: 'PHQReportStream: AI-powered parser for HP Police reports with DistilBERT-based structured data extraction.',
      description: 'Intelligent parser for HP Police IRBn/Bn daily reports. Take inputs as text, file uploads, or batch inputs into structured Excel/CSV/JSON formats. It includes AI-powered enhancements using DistilBERT and NLTK for better accuracy and semantic understanding.',
      tech: ['Python', 'NLTK', 'Transformers', 'DistilBERT', 'Streamlit', 'Pandas', 'NumPy', 'Regex', 'Spacy', 'Scikit-learn', 'Torch', 'Langchain', 'TQDM', 'Openpyxl','xlswriter'],
      color: 'from-green-400 to-emerald-500',
      icon: MessageCircleWarning,
      gradient: 'from-green-500/20 to-emerald-500/20'
    },
    {
      id: 4,
      title: 'Himachal Pradesh Police Employee Engagement Survey Analysis.',
      description: 'In-depth analysis of employee engagement within the Himachal Pradesh Police department, utilizing advanced data analytics and visualization techniques.',
      tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Plotly', 'Scikit-learn', 'JupyterNotebook', 'R (Statistical Modeling)', 'MySQL', 'SPSS'],
      color: 'from-blue-400 to-fuchsia-600',
      icon: FileChartColumn,
      gradient: 'from-blue-400/20 to-fuchsia-600/20',
    }
  ];

  const photoCategories = [
    { name: 'Portrait', count: 150, image: '🎭', color: 'from-purple-400 to-pink-500' },
    { name: 'Landscape', count: 200, image: '🏔️', color: 'from-cyan-400 to-blue-500' },
    { name: 'Street', count: 180, image: '🌆', color: 'from-orange-400 to-red-500' },
    { name: 'Macro', count: 120, image: '🔬', color: 'from-green-400 to-emerald-500' }
  ];
  
  const stats = [
    { label: 'Projects Completed', value: '10+', icon: Rocket, suffix: '' },
    { label: 'Photos Captured', value: '10K+', icon: Camera, suffix: '' },
    { label: 'Lines of Code', value: '22K+', icon: Code, suffix: '' },
    { label: 'Creative Hours', value: '2.5K+', icon: Palette, suffix: '' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, Tech Innovations',
      content: 'Outstanding work! The attention to detail and technical expertise is remarkable.',
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      content: 'Delivered beyond expectations. A true professional in every aspect.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Creative Director',
      content: 'The photography work is stunning. Captures emotion perfectly.',
      avatar: '👩‍🎨'
    }
  ];

  // Greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Preloader with progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced typing effect
  useEffect(() => {
    const currentText = roles[currentRole];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    if (!isDeleting && typedText === currentText) {
      setTimeout(() => setIsDeleting(true), pauseTime);
      return;
    }

    if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setCurrentRole((prev) => (prev + 1) % roles.length);
      return;
    }

    const timeout = setTimeout(() => {
      setTypedText(
        isDeleting
          ? currentText.substring(0, typedText.length - 1)
          : currentText.substring(0, typedText.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentRole, roles]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Enhanced scroll handling with velocity
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastScrollTime.current;
      const scrollDelta = Math.abs(window.scrollY - lastScrollY.current);
      const velocity = timeDelta > 0 ? Math.min(scrollDelta / timeDelta * 10, 1) : 0;
      
      const scrollingUp = window.scrollY < lastScrollY.current;
      const scrolledPastHero = window.scrollY > 100;
      
      setScrollProgress(progress);
      setScrollY(window.scrollY);
      setScrollVelocity(velocity);
      setIsScrollingUp(scrollingUp);
      
      if (!scrolledPastHero) {
        setShowNavbar(true);
      } else if (scrollingUp) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
      
      // Determine active section
      const sections = ['home', 'about', 'tech', 'photography', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
      
      lastScrollY.current = window.scrollY;
      lastScrollTime.current = currentTime;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced mouse tracking with velocity
  useEffect(() => {
    let animationFrameId;
    let lastTime = Date.now();

    const handleMouseMove = (e) => {
      animationFrameId = requestAnimationFrame(() => {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime > 0) {
          const velocityX = (e.clientX - lastMousePos.x) / deltaTime * 10;
          const velocityY = (e.clientY - lastMousePos.y) / deltaTime * 10;
          setMouseVelocity({ x: velocityX, y: velocityY });
        }
        
        setMousePosition({ x: e.clientX, y: e.clientY });
        setLastMousePos({ x: e.clientX, y: e.clientY });
        
        if (cursorRef.current) {
          cursorRef.current.style.left = e.clientX + 'px';
          cursorRef.current.style.top = e.clientY + 'px';
        }
        
        lastTime = currentTime;
      });
    };

    const handleClick = (e) => {
      const ripple = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      };
      setRipples(prev => [...prev, ripple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id));
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [lastMousePos]);

  // Intersection Observer with stagger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setShowAIAssistant(false);
      }
      
      if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Enhanced canvas trail
  useEffect(() => {
    const canvas = trailCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    let animationId;

    const handleMouseMove = (e) => {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          life: 1,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 2,
          color: Math.random() > 0.5 ? '#22d3ee' : '#a855f7',
        });
      }

      if (particles.length > 50) {
        particles.splice(0, particles.length - 50);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.life -= 0.015;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const size = p.size * p.life;
        const opacity = p.life * 0.8;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        const color = p.color === '#22d3ee' 
          ? `rgba(34, 211, 238, ${opacity})` 
          : `rgba(168, 85, 247, ${opacity})`;
        ctx.fillStyle = color;
        ctx.fill();
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const parallaxOffset = {
    x: (mousePosition.x - window.innerWidth / 2) / 80,
    y: (mousePosition.y - window.innerHeight / 2) / 80,
  };

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br from-indigo-950 via-black to-violet-950 text-white overflow-x-hidden relative ${!isTouchDevice ? 'cursor-none' : ''}`}
      style={{
        animation: isLoading ? 'none' : 'page-fade-in 0.8s ease-out',
      }}
    >
      {/* Skip to content */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[110] focus:px-6 focus:py-3 focus:rounded-full focus:bg-cyan-500 focus:text-white focus:font-medium focus:shadow-2xl focus:shadow-cyan-500/50 transition-all duration-300"
        tabIndex={0}
      >
        Skip to content
      </a>

      {/* Enhanced Preloader */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-black to-violet-950 transition-opacity duration-500"
             style={{ opacity: isLoading ? 1 : 0 }}>
          <div className="relative">
            {/* Multiple animated rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-cyan-400/30 animate-ping" style={{ animationDuration: '2s' }}></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-2 border-purple-400/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-2 border-pink-400/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
            </div>
            
            {/* Logo */}
            <div className="relative w-28 h-28 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl animate-pulse-slow">
              <span className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                AV
              </span>
            </div>
            
            {/* Orbiting particles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                style={{
                  animation: `orbit ${3 + i * 0.5}s linear infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
          
          <div className="absolute bottom-20 flex flex-col items-center gap-4">
            <p className="text-gray-400 text-sm animate-pulse-slow">Loading experience...</p>
            <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-loading-bar"></div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Canvas Trail */}
      {!isTouchDevice && (
        <canvas
          ref={trailCanvasRef}
          className="fixed inset-0 pointer-events-none z-45"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Enhanced Custom Cursor */}
      {!isTouchDevice && (
        <div
          ref={cursorRef}
          className="fixed w-6 h-6 rounded-full border-2 border-cyan-400 pointer-events-none z-50 transition-transform duration-200"
          style={{
            transform: `translate(-50%, -50%) scale(${1 + Math.abs(mouseVelocity.x + mouseVelocity.y) * 0.05})`,
            boxShadow: '0 0 30px rgba(34, 211, 238, 0.8), 0 0 60px rgba(34, 211, 238, 0.4)',
          }}
        >
          <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-30 animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-[-4px] rounded-full border border-purple-400 opacity-40"></div>
          <div className="absolute inset-[-8px] rounded-full border border-pink-400 opacity-20"></div>
        </div>
      )}

      {/* Click Ripples */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-40"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/60 animate-ripple"></div>
          <div className="absolute inset-0 rounded-full border-2 border-purple-400/40 animate-ripple" style={{ animationDelay: '0.15s' }}></div>
          <div className="absolute inset-0 rounded-full border-2 border-pink-400/20 animate-ripple" style={{ animationDelay: '0.3s' }}></div>
        </div>
      ))}

      {/* Enhanced Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 z-50 transition-all duration-150" 
        style={{ 
          width: `${scrollProgress}%`,
          background: `linear-gradient(to right, 
            rgba(34, 211, 238, ${0.7 + scrollVelocity * 0.3}), 
            rgba(168, 85, 247, ${0.7 + scrollVelocity * 0.3}), 
            rgba(236, 72, 153, ${0.7 + scrollVelocity * 0.3}))`,
          boxShadow: scrollVelocity > 0.3 ? `0 0 ${25 * scrollVelocity}px rgba(34, 211, 238, ${scrollVelocity})` : 'none',
          height: `${2 + scrollVelocity * 4}px`,
        }}
      ></div>

      {/* Enhanced Navigation */}
      <nav 
        className="fixed top-0 w-full z-40 transition-all duration-500 ease-in-out"
        style={{
          transform: showNavbar ? 'translateY(0)' : 'translateY(-100%)',
          opacity: showNavbar ? 1 : 0,
        }}
      >
        <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <button 
                onClick={() => scrollToSection('home')}
                className="flex items-center space-x-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-xl"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center font-bold text-lg sm:text-xl shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
                  AV
                </div>
                <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent transition-all duration-500 hidden sm:inline">
                  Atharv Vatsal
                </span>
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {['Home', 'About', 'Tech', 'Photography', 'Contact'].map((item) => {
                  const isActive = activeSection === item.toLowerCase();
                  return (
                    <button
                      key={item}
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className={`relative text-gray-300 hover:text-white transition-all duration-500 group ${
                        isActive ? 'text-white' : ''
                      }`}
                    >
                      {item}
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                      <span className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 blur-xl"></span>
                    </button>
                  );
                })}
              </div>

              {/* Right Actions */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-500 hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 font-medium hover:scale-105 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400">
                  <span className="relative z-10 flex items-center gap-2">
                    <Download size={16} />
                    Resume
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg backdrop-blur-md bg-white/5 hover:scale-110 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Enhanced Mobile Menu */}
            <div 
              className={`md:hidden mt-4 space-y-2 pb-4 transition-all duration-500 overflow-hidden ${
                isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {['Home', 'About', 'Tech', 'Photography', 'Contact'].map((item, index) => {
                const isActive = activeSection === item.toLowerCase();
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className={`block w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-500 ${
                      isActive ? 'bg-white/10 text-cyan-400' : ''
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <span className="flex items-center justify-between">
                      {item}
                      {isActive && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>}
                    </span>
                  </button>
                );
              })}
              <div className="pt-4 flex flex-col gap-3">
                <button className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-lg transition-all duration-500 font-medium flex items-center justify-center gap-2">
                  <Download size={16} />
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section
        id="home"
        ref={heroRef}
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 px-4"
        style={{
          transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Enhanced Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Mouse spotlight */}
          <div 
            className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full pointer-events-none transition-all duration-700 ease-out"
            style={{
              background: `radial-gradient(circle, rgba(34, 211, 238, ${0.4 - scrollY * 0.0003}) 0%, rgba(168, 85, 247, ${0.3 - scrollY * 0.0002}) 40%, transparent 70%)`,
              left: `${mousePosition.x - 300}px`,
              top: `${mousePosition.y - 300}px`,
              filter: 'blur(80px)',
              transform: `scale(${1 + scrollY * 0.0005})`,
            }}
          ></div>

          {/* Animated grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.15) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}></div>
          </div>

          {/* Enhanced gradient orbs */}
          <div 
            className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slow transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, rgba(34, 211, 238, ${0.25 + Math.sin(scrollY * 0.01) * 0.1}) 0%, transparent 70%)`,
              transform: `translate(${(mousePosition.x - window.innerWidth / 2) * 0.03}px, ${(mousePosition.y - window.innerHeight / 2) * 0.03}px) scale(${1 + scrollY * 0.0003})`,
            }}
          ></div>
          <div 
            className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slow transition-all duration-1000" 
            style={{ 
              animationDelay: '1s',
              background: `radial-gradient(circle, rgba(168, 85, 247, ${0.25 + Math.cos(scrollY * 0.01) * 0.1}) 0%, transparent 70%)`,
              transform: `translate(${-(mousePosition.x - window.innerWidth / 2) * 0.03}px, ${-(mousePosition.y - window.innerHeight / 2) * 0.03}px) scale(${1 + scrollY * 0.0003})`,
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 w-48 h-48 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slow transition-all duration-1000" 
            style={{ 
              animationDelay: '2s',
              background: `radial-gradient(circle, rgba(236, 72, 153, ${0.15 + Math.sin(scrollY * 0.015) * 0.08}) 0%, transparent 70%)`,
            }}
          ></div>

          {/* Enhanced particles */}
          {[...Array(60)].map((_, i) => {
            const baseLeft = Math.random() * 100;
            const baseTop = Math.random() * 100;
            const distanceX = (mousePosition.x / window.innerWidth * 100) - baseLeft;
            const distanceY = (mousePosition.y / window.innerHeight * 100) - baseTop;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            const pushStrength = Math.max(0, 48 - distance) / 30;
            
            return (
              <div
                key={i}
                className="absolute rounded-full animate-float-slow transition-all duration-300"
                style={{
                  left: `${baseLeft - distanceX * pushStrength * 3}%`,
                  top: `${baseTop - distanceY * pushStrength * 3}%`,
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  background: i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#a855f7' : '#ec4899',
                  boxShadow: `0 0 ${Math.random() * 15 + 5}px currentColor`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${15 + Math.random() * 25}s`,
                  opacity: 0.4 + (scrollY * 0.0005),
                }}
              ></div>
            );
          })}
        </div>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto px-8 sm:px-6 text-center relative z-10">
          <div className="mb-4 sm:mb-6 inline-block animate-fade-in-up">
            <span className="px-4 py-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-xs sm:text-sm text-cyan-400 shadow-2xl hover:scale-105 transition-all duration-500 flex items-center gap-1">
              <Sparkles size={16} className="animate-pulse-slow" />
              {greeting}! 👋
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient block sm:inline mt-2 sm:mt-0">
              Atharv Vatsal
            </span>
          </h1>

          {/* Enhanced typing effect */}
          <div className="h-16 sm:h-20 mb-6 sm:mb-8 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-300">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {typedText}
              </span>
              <span className={`inline-block w-1 h-8 sm:h-10 md:h-12 bg-cyan-400 ml-1 ${cursorBlink ? 'opacity-100' : 'opacity-0'}`}></span>
            </h2>
          </div>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto animate-fade-in-up px-4" style={{ animationDelay: '0.6s' }}>
            {taglines[currentRole]}
          </p>

          {/* Skill Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 animate-fade-in-up px-4" style={{ animationDelay: '0.8s' }}>
            {skills.map((skill, index) => (
              <span
                key={skill.name}
                className="px-3 sm:px-4 py-2 rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-300 hover:bg-white/10 hover:border-cyan-400/50 hover:scale-105 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-500/30 animate-fade-in-up"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                {skill.name}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up px-4" style={{ animationDelay: '1s' }}>
            <button
              onClick={() => scrollToSection('tech')}
              className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                View My Work
                <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-500" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-700 font-medium hover:scale-105 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get in Touch
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-500" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-12 sm:mt-20 animate-bounce-slow">
            <ChevronDown size={32} className="mx-auto text-gray-400" />
            <p className="text-xs text-gray-500 mt-2">Scroll to explore</p>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-12 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group relative p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 hover:border-cyan-400/50 text-center cursor-pointer animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    transform: 'perspective(1000px)',
                  }}
                  onMouseMove={(e) => {
                    if (window.innerWidth >= 768) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;
                      const rotateX = (y - centerY) / 10;
                      const rotateY = (centerX - x) / 10;
                      e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.innerWidth >= 768) {
                      e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                    }
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative z-10">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-cyan-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" />
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transition Divider */}
      <div className="relative h-20 sm:h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#22d3ee" strokeWidth="1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </line>
        </svg>
      </div>

      {/* Enhanced About Section with Skills */}
      <section className="py-12 sm:py-20 relative" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Title */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              What I Do
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">Three passions, infinite possibilities</p>
          </div>

          {/* Identity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
            {/* Engineer Card */}
            <div className="group relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 hover:border-cyan-400/50 cursor-pointer animate-fade-in-up">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 rounded-3xl shadow-2xl shadow-cyan-500/0 group-hover:shadow-cyan-500/30 transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-lg shadow-cyan-500/50">
                  <Code size={28} className="sm:w-8 sm:h-8" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Computer Science Undergraduate
                  </h3>
                  <Zap size={20} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Building intelligent, data-driven systems that solve real-world problems with cutting-edge technology.
                </p>
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">AI/ML</span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">Cloud</span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">Full-Stack</span>
                </div>
                <button className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 group-hover:gap-4 transition-all duration-700 text-sm sm:text-base">
                  View Projects →
                </button>
              </div>
            </div>

            {/* Photographer Card */}
            <div className="group relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 hover:border-purple-400/50 cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 rounded-3xl shadow-2xl shadow-purple-500/0 group-hover:shadow-purple-500/30 transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-lg shadow-purple-500/50">
                  <Camera size={28} className="sm:w-8 sm:h-8" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Photographer
                  </h3>
                  <Sparkles size={20} className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Capturing stories through lenses, freezing moments that tell a thousand words.
                </p>
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">Portrait</span>
                  <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs border border-pink-500/20">Landscape</span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">Street</span>
                </div>
                <button className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-2 group-hover:gap-4 transition-all duration-700 text-sm sm:text-base">
                  Open Gallery →
                </button>
              </div>
            </div>

            {/* Editor Card */}
            <div className="group relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 hover:border-pink-400/50 cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 rounded-3xl shadow-2xl shadow-pink-500/0 group-hover:shadow-pink-500/30 transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-lg shadow-pink-500/50">
                  <Film size={28} className="sm:w-8 sm:h-8" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                    Editor
                  </h3>
                  <Film size={20} className="text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Transforming visuals into emotions through the art of storytelling and motion.
                </p>
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs border border-pink-500/20">Video</span>
                  <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">Motion</span>
                  <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs border border-pink-500/20">Color</span>
                </div>
                <button className="text-pink-400 hover:text-pink-300 font-medium flex items-center gap-2 group-hover:gap-4 transition-all duration-700 text-sm sm:text-base">
                  Watch Edits →
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Skills Progress Bars */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Technical Skills
            </h3>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div 
                  key={skill.name} 
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-300 font-medium text-sm sm:text-base">{skill.name}</span>
                    <span className="text-cyan-400 text-sm sm:text-base">{skill.level}%</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-gray-800 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg relative overflow-hidden`}
                      style={{ 
                        width: visibleSections.has('about') ? `${skill.level}%` : '0%',
                        boxShadow: `0 0 20px ${skill.color}`
                      }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 sm:py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="absolute left-1/4 top-1/2 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute right-1/4 top-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 hover:bg-white/10 transition-all duration-700">
            <Sparkles className="absolute -top-6 left-1/4 text-cyan-400 opacity-50 hidden sm:block" size={24} />
            <Sparkles className="absolute -bottom-6 right-1/4 text-purple-400 opacity-50 hidden sm:block" size={24} />
            
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-light text-gray-300 italic leading-relaxed relative">
              <span className="text-5xl sm:text-6xl text-cyan-400/30 absolute -top-4 sm:-top-8 -left-2 sm:-left-4">"</span>
              Merging logic with light — engineering solutions and capturing stories.
              <span className="text-5xl sm:text-6xl text-purple-400/30 absolute -bottom-8 sm:-bottom-12 -right-2 sm:-right-4">"</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative h-20 sm:h-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
      </div>

      {/* Enhanced Tech Projects Section */}
      <section 
        id="tech" 
        className={`min-h-screen flex items-center justify-center relative overflow-hidden py-12 sm:py-20 transition-all duration-1000 ${
          visibleSections.has('tech') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Tech Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full pointer-events-none transition-all duration-700 ease-out"
            style={{
              background: `radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)`,
              left: `${mousePosition.x - 400}px`,
              top: `${mousePosition.y - 400}px`,
              filter: 'blur(100px)',
            }}
          ></div>
          
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.4) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              animation: 'gridMove 15s linear infinite'
            }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-xl animate-pulse-slow">
                <Code size={40} className="sm:w-12 sm:h-12 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">Building the future, one line of code at a time</p>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <div
                  key={project.id}
                  className="group relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 hover:border-cyan-400/50 cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                  onMouseEnter={() => setProjectHover(project.id)}
                  onMouseLeave={() => setProjectHover(null)}
                >
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700`}>
                      <Icon size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    
                    <h3 className={`text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r ${project.color} bg-clip-text text-transparent`}>
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                      {project.tech.map(tech => (
                        <span key={tech} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium group-hover:gap-4 transition-all duration-700 text-sm sm:text-base">
                      <span>View Project</span>
                      <ExternalLink size={16} className="sm:w-5 sm:h-5 group-hover:rotate-45 transition-transform duration-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-700 hover:scale-105 font-medium group">
              <span className="flex items-center gap-2">
                View All Projects
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative h-20 sm:h-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
      </div>

      {/* Enhanced Photography Section */}
      <section 
        id="photography" 
        className={`min-h-screen flex items-center justify-center relative overflow-hidden py-12 sm:py-20 transition-all duration-1000 ${
          visibleSections.has('photography') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Photography Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute w-[600px] h-[600px] md:w-[700px] md:h-[700px] rounded-full pointer-events-none transition-all duration-700 ease-out"
            style={{
              background: `radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, rgba(236, 72, 153, 0.25) 40%, transparent 70%)`,
              left: `${mousePosition.x - 350}px`,
              top: `${mousePosition.y - 350}px`,
              filter: 'blur(100px)',
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-400/20 to-pink-500/20 backdrop-blur-xl animate-pulse-slow">
                <Camera size={40} className="sm:w-12 sm:h-12 text-purple-400" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Photography Gallery
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">Capturing moments, creating memories</p>
          </div>

          {/* Photo Categories */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {photoCategories.map((category, index) => (
              <div
                key={category.name}
                className="group relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 hover:border-purple-400/50 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative z-10 text-center">
                  <div className="text-5xl sm:text-6xl mb-4 group-hover:scale-110 transition-transform duration-700">
                    {category.image}
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{category.count} photos</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-700 hover:scale-105 font-medium group">
              <span className="flex items-center gap-2">
                View Full Gallery
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              What People Say
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">Testimonials from amazing clients</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="group p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-500">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic leading-relaxed text-sm sm:text-base">
                  "{testimonial.content}"
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative h-20 sm:h-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
      </div>

      {/* Enhanced Contact Section */}
      <section 
        id="contact" 
        className={`min-h-screen flex items-center justify-center relative overflow-hidden py-12 sm:py-20 transition-all duration-1000 ${
          visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute w-[600px] h-[600px] md:w-[750px] md:h-[750px] rounded-full pointer-events-none transition-all duration-700 ease-out"
            style={{
              background: `radial-gradient(circle, rgba(34, 211, 238, 0.35) 0%, rgba(168, 85, 247, 0.25) 40%, transparent 70%)`,
              left: `${mousePosition.x - 375}px`,
              top: `${mousePosition.y - 375}px`,
              filter: 'blur(100px)',
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 backdrop-blur-xl animate-pulse-slow">
                <MessageCircle size={40} className="sm:w-12 sm:h-12 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Let's Connect
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">Ready to bring your ideas to life</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="group p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Email</h4>
                    <p className="text-gray-400 text-sm">contact@atharvvatsal.com</p>
                    <p className="text-gray-400 text-sm">atharv.vatsal2023@vitstudent.ac.in</p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Phone</h4>
                    <p className="text-gray-400 text-sm">(+91) 973634 0828</p>
                    <p className="text-gray-400 text-sm">(+91) 862689 6190</p>
                  </div>
                </div>
              </div>

              <div className="group p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Location</h4>
                    <p className="text-gray-400 text-sm">Dharamshala, Himachal Pradesh - 176215</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Github, label: 'GitHub', color: 'from-gray-400 to-gray-600' },
                  { icon: Linkedin, label: 'LinkedIn', color: 'from-blue-400 to-blue-600' },
                  { icon: Instagram, label: 'Instagram', color: 'from-pink-400 to-purple-600' },
                ].map((social) => (
                  <button
                    key={social.label}
                    className="group flex-1 min-w-[120px] px-6 py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <social.icon size={20} className="group-hover:rotate-12 transition-transform duration-500" />
                    <span className="text-sm">{social.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all duration-300 resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-700 font-medium hover:scale-105 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    Send Message
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 sm:bottom-8 right-4 sm:right-8 z-40 flex flex-col gap-3 sm:gap-4">
        {/* AI Assistant */}
        <button
          onClick={() => setShowAIAssistant(!showAIAssistant)}
          className="relative p-3 sm:p-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-700 hover:scale-110 group"
          aria-label="AI Assistant"
        >
          <MessageCircle size={20} className="sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-500" />
          {showAIAssistant && (
            <div className="absolute bottom-full right-0 mb-4 w-56 sm:w-64 p-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl animate-fade-in">
              <p className="text-xs sm:text-sm text-gray-300">Ask me about my projects!</p>
            </div>
          )}
        </button>

        {/* Scroll to Top */}
        {scrollY > 500 && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 sm:p-4 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-700 hover:scale-110 group animate-fade-in"
            aria-label="Scroll to top"
          >
            <ChevronDown size={20} className="sm:w-6 sm:h-6 rotate-180 group-hover:-translate-y-1 transition-transform duration-500" />
          </button>
        )}
      </div>

      {/* Enhanced Footer */}
      <footer className="py-8 sm:py-12 backdrop-blur-xl bg-white/5 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -top-20 right-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex gap-4 sm:gap-6">
              {[
                { icon: Github, link: '#', color: 'hover:text-cyan-400' },
                { icon: Linkedin, link: '#', color: 'hover:text-blue-400' },
                { icon: Instagram, link: '#', color: 'hover:text-pink-400' },
                { icon: Camera, link: '#', color: 'hover:text-purple-400' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 hover:rotate-12 transition-all duration-700 group hover:shadow-lg ${social.color}`}
                >
                  <social.icon size={18} className="sm:w-5 sm:h-5 transition-all duration-700" />
                </a>
              ))}
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-700 flex items-center gap-2 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              <Rocket size={18} className="sm:w-5 sm:h-5 group-hover:rotate-12 group-hover:-translate-y-1 transition-all duration-700" />
              <span className="text-sm sm:text-base">Back to Top</span>
            </button>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6 sm:mt-8 text-gray-500 space-y-2">
            <p className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base">
              © 2025 Atharv Vatsal — Crafted with 
              <Code size={14} className="sm:w-4 sm:h-4 text-cyan-400" />
              + 
              <Camera size={14} className="sm:w-4 sm:h-4 text-purple-400" />
            </p>
            <p className="text-xs text-gray-600">
              Designed with glassmorphism • Built with React
            </p>
          </div>
        </div>
      </footer>

      {/* Enhanced Styles */}
      <style>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-120vh) translateX(100px);
            opacity: 0;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(300px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(300px) rotate(-360deg);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes ripple {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-float-slow {
          animation: float-slow linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-orbit {
          animation: orbit linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }

        .animate-ripple {
          animation: ripple 2s ease-out forwards;
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .backdrop-blur-xl {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }

        .backdrop-blur-md {
          backdrop-filter: blur(12px) saturate(150%);
          -webkit-backdrop-filter: blur(12px) saturate(150%);
        }

        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          padding: inherit;
          margin: inherit;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #22d3ee, #a855f7, #ec4899);
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #06b6d4, #9333ea, #db2777);
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .group:hover {
            transform: none;
          }
        }

        /* Enhanced responsive breakpoints */
        @media (max-width: 640px) {
          section {
            scroll-margin-top: 70px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;