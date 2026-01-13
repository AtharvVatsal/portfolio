import { Code, Brain, ScanEye, Database, Zap, Rocket, Palette, Award } from 'lucide-react';

// Simple skills list
export const skills = [
  { name: 'Python', level: 95, color: 'from-blue-400 to-blue-600' },
  { name: 'Java', level: 85, color: 'from-orange-400 to-amber-600' },
  { name: 'C/C++', level: 75, color: 'from-slate-400 to-slate-600' },
  { name: 'MATLAB', level: 99, color: 'from-orange-500 to-red-600' },
  { name: 'SQL and Database Management', level: 70, color: 'from-teal-400 to-cyan-600' },
  { name: 'Full Stack Development', level: 60, color: 'from-violet-400 to-purple-600' },
  { name: 'Machine Learning', level: 80, color: 'from-purple-500 to-fuchsia-600' },
  { name: 'Computer Vision', level: 92, color: 'from-sky-400 to-blue-600' },
  { name: 'Data Analytics', level: 97, color: 'from-emerald-400 to-green-600' },
  { name: 'Figma', level: 65, color: 'from-fuchsia-400 to-pink-600' },
  { name: 'Adobe CC Suite', level: 80, color: 'from-red-400 to-rose-600' },
  { name: 'OOPs', level: 95, color: 'from-indigo-400 to-indigo-600' },
  { name: 'AWS', level: 65, color: 'from-amber-400 to-orange-600' },
  { name: 'Computational Mathematics', level: 90, color: 'from-rose-400 to-pink-600' }
];

// Skill category cards for the skills section
export const skillCategoryCards = [
  {
    title: 'Programming Languages',
    icon: Code,
    color: 'from-blue-400 to-cyan-500',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    shadow: 'shadow-blue-500/30',
    description: 'Proficient in multiple programming paradigms with strong foundations in OOP and functional programming.',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'Java', level: 85 },
      { name: 'C/C++', level: 75 },
      { name: 'MATLAB', level: 99 },
      { name: 'R', level: 90 },
      { name: 'SQL', level: 80 }
    ],
    stats: '5+ Languages'
  },
  {
    title: 'AI & Machine Learning',
    icon: Brain,
    color: 'from-purple-400 to-fuchsia-500',
    gradient: 'from-purple-500/10 to-fuchsia-500/10',
    shadow: 'shadow-purple-500/30',
    description: 'Building intelligent systems with advanced ML algorithms, predictive modeling, and neural networks.',
    skills: [
      { name: 'Machine Learning', level: 80 },
      { name: 'XGBoost', level: 85 },
      { name: 'Random Forest', level: 88 },
      { name: 'Scikit-learn', level: 90 },
      { name: 'TensorFlow', level: 75 },
      { name: 'PyTorch', level: 78 }
    ],
    stats: '8+ Models'
  },
  {
    title: 'Computer Vision',
    icon: ScanEye,
    color: 'from-cyan-400 to-blue-500',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    shadow: 'shadow-cyan-500/30',
    description: 'Expertise in image processing, object detection, and real-time video analysis using state-of-the-art models.',
    skills: [
      { name: 'YOLOv8', level: 92 },
      { name: 'OpenCV', level: 90 },
      { name: 'Image Processing', level: 88 },
      { name: 'Object Detection', level: 93 },
      { name: 'Real-time Analysis', level: 85 }
    ],
    stats: '92% Accuracy'
  },
  {
    title: 'Data Science & Analytics',
    icon: Database,
    color: 'from-emerald-400 to-green-500',
    gradient: 'from-emerald-500/10 to-green-500/10',
    shadow: 'shadow-emerald-500/30',
    description: 'Transforming raw data into actionable insights through advanced statistical analysis and visualization.',
    skills: [
      { name: 'Pandas', level: 95 },
      { name: 'NumPy', level: 93 },
      { name: 'Matplotlib', level: 90 },
      { name: 'Plotly', level: 85 },
      { name: 'Seaborn', level: 88 },
      { name: 'Power BI', level: 80 },
      { name: 'Statistical Analysis', level: 97 }
    ],
    stats: '90% Expert'
  },
  {
    title: 'Full Stack Development',
    icon: Zap,
    color: 'from-violet-400 to-purple-500',
    gradient: 'from-violet-500/10 to-purple-500/10',
    shadow: 'shadow-violet-500/30',
    description: 'Creating scalable web applications with modern frameworks and robust backend architectures.',
    skills: [
      { name: 'React', level: 75 },
      { name: 'Flask', level: 80 },
      { name: 'FastAPI', level: 75 },
      { name: 'Node.js', level: 65 },
      { name: 'REST APIs', level: 85 },
      { name: 'Database Design', level: 80 }
    ],
    stats: 'Full Stack'
  },
  {
    title: 'Cloud & DevOps',
    icon: Rocket,
    color: 'from-amber-400 to-orange-500',
    gradient: 'from-amber-500/10 to-orange-500/10',
    shadow: 'shadow-amber-500/30',
    description: 'Deploying and managing scalable applications on cloud platforms with modern DevOps practices.',
    skills: [
      { name: 'AWS', level: 65 },
      { name: 'Cloud Architecture', level: 70 },
      { name: 'Git & GitHub', level: 90 },
      { name: 'CI/CD', level: 60 },
      { name: 'Docker', level: 55 }
    ],
    stats: 'Cloud Ready'
  },
  {
    title: 'Design & Creative Tools',
    icon: Palette,
    color: 'from-pink-400 to-rose-500',
    gradient: 'from-pink-500/10 to-rose-500/10',
    shadow: 'shadow-pink-500/30',
    description: 'Crafting beautiful user experiences with modern design tools and creative software suites.',
    skills: [
      { name: 'Figma', level: 65 },
      { name: 'Adobe Photoshop', level: 85 },
      { name: 'Adobe Lightroom CC', level: 95 },
      { name: 'Premiere Pro', level: 80 },
      { name: 'After Effects', level: 75 },
      { name: 'UI/UX Design', level: 70 }
    ],
    stats: '100+ Edits'
  },
  {
    title: 'Mathematics & Algorithms',
    icon: Award,
    color: 'from-rose-400 to-pink-500',
    gradient: 'from-rose-500/10 to-pink-500/10',
    shadow: 'shadow-rose-500/30',
    description: 'Strong mathematical foundation for computational problem-solving and algorithm optimization.',
    skills: [
      { name: 'Linear Algebra', level: 90 },
      { name: 'Statistics', level: 92 },
      { name: 'Probability', level: 90 },
      { name: 'Multivariable Calculus', level: 95 },
      { name: 'Differential equations', level: 75 },
      { name: 'Optimization', level: 85 },
      { name: 'Numerical Methods', level: 88 },
      { name: 'DSA', level: 80 }
    ],
    stats: '85% Mastery'
  }
];
