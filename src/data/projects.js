import { Siren, ScanEye, MessageCircleWarning, FileChartColumn, Brain, TrendingUp, Camera, FolderOpen, Layers, Sparkles } from 'lucide-react';

export const projects = [
  {
    id: 8,
    title: 'keeper-raw: AI-Powered Photo Culling Desktop App',
    description: 'A Tauri-based desktop application for professional photographers that automates the photo culling process using AI (YOLOv8-face, FaceMesh, Laplacian). Groups RAW files into scenes, detects faces/blinks/sharpness, and exports XMP sidecars for Lightroom. Reduces 8+ hours of manual culling to ~30 minutes.',
    tech: ['Rust', 'Tauri 2.x', 'React 19', 'TypeScript', 'ONNX Runtime', 'YOLOv8-face', 'FaceMesh', 'ExifTool', 'Rayon', 'Vite', 'Python'],
    color: 'from-violet-400 to-purple-500',
    icon: Camera,
    gradient: 'from-violet-500/20 to-purple-500/20',
    projectKey: 'keeperraw',
    liveUrl: 'https://github.com/AtharvVatsal/keeper-raw',
    ongoing: true
  },
  {
    id: 1,
    title: 'DriveSense: Autonomous Driving Perception with YOLOv8 & U-Net',
    description: 'A dual-pipeline computer vision system combining YOLOv8 object detection and U-Net semantic segmentation for real-time road scene understanding, trained on BDD100K and Cityscapes datasets.',
    tech: ['PyTorch', 'YOLOv8', 'U-Net', 'OpenCV', 'Albumentations', 'NumPy', 'Matplotlib', 'Seaborn', 'Pandas', 'CUDA'],
    color: 'from-teal-400 to-indigo-500',
    icon: ScanEye,
    gradient: 'from-teal-500/20 to-indigo-500/20',
    projectKey: 'drivesense'
  },
  {
    id: 2,
    title: 'LZ-Quant: Latency-Zero Real-Time Quantitative Finance Sentiment Engine',
    description: 'Real-time quantitative finance sentiment engine using fine-tuned DistilBERT (LoRA + ONNX), Binance WebSocket pipeline, FastAPI backend, and a paper trading engine with divergence detection. Fully open-source with no paid APIs.',
    tech: ['DistilBERT', 'LoRA', 'ONNX', 'FastAPI', 'Binance WebSocket', 'Python', 'React', 'Tailwind CSS'],
    color: 'from-amber-400 to-yellow-500',
    icon: TrendingUp,
    gradient: 'from-amber-500/20 to-yellow-500/20',
    projectKey: 'lzquant',
  },
  {
    id: 3,
    title: "Newton's Nightmare: RL Agents Learning Physics from Scratch",
    description: 'Reinforcement learning project training PPO/SAC agents (10-legged ant, rocket lander, balancing rod) with domain randomization, ONNX export, and a React + Three.js interactive web demo.',
    tech: ['PPO', 'SAC', 'PyTorch', 'Gymnasium', 'ONNX', 'React', 'Three.js', 'Domain Randomization'],
    color: 'from-orange-400 to-red-500',
    icon: Brain,
    gradient: 'from-orange-500/20 to-red-500/20',
    projectKey: 'newtonsnightmare',
    ongoing: true
  },
  {
    id: 4,
    title: 'RiskGrid: ML Based Predictive Policing',
    description: 'AI-Powered Machine learning system for real-time crime risk prediction and intelligent patrol optimization',
    tech: ['Python', 'XGBoost', 'Random Forest', 'LightGBM', 'Scikit-learn', 'GeoPandas', 'Folium', 'Flask', 'FastAPI'],
    color: 'from-cyan-400 to-blue-500',
    icon: Siren,
    gradient: 'from-cyan-500/20 to-blue-500/20',
    projectKey: 'riskgrid'
  },
  {
    id: 5,
    title: 'The Canspiracy: Real-time can detection using Computer Vision and ML.',
    description: 'YOLOv8-based object detection across multiple formats - from single images to real-time video feeds including webcam and mobile phone cameras via DroidCam.',
    tech: ['Pytorch', 'OpenCV', 'YOLOv8', 'Seaborn', 'Matplotlib', 'Pandas', 'NumPy', 'Tkinter', 'Squarify', 'Droidcam'],
    color: 'from-purple-400 to-pink-500',
    icon: ScanEye,
    gradient: 'from-purple-500/20 to-pink-500/20',
    projectKey: 'canspiracy'
  },
  {
    id: 6,
    title: 'PHQReportStream: AI-powered parser for HP Police reports with DistilBERT-based structured data extraction.',
    description: 'Intelligent parser for HP Police IRBn/Bn daily reports. Take inputs as text, file uploads, or batch inputs into structured Excel/CSV/JSON formats. It includes AI-powered enhancements using DistilBERT and NLTK for better accuracy and semantic understanding.',
    tech: ['Python', 'NLTK', 'Transformers', 'DistilBERT', 'Streamlit', 'Pandas', 'NumPy', 'Regex', 'Spacy', 'Scikit-learn', 'Torch', 'Langchain', 'TQDM', 'Openpyxl', 'xlswriter'],
    color: 'from-green-400 to-emerald-500',
    icon: MessageCircleWarning,
    gradient: 'from-green-500/20 to-emerald-500/20',
    projectKey: 'phqreport'
  },
  {
    id: 7,
    title: 'Himachal Pradesh Police Employee Engagement Survey Analysis.',
    description: 'In-depth analysis of employee engagement within the Himachal Pradesh Police department, utilizing advanced data analytics and visualization techniques.',
    tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Plotly', 'Scikit-learn', 'JupyterNotebook', 'R (Statistical Modeling)', 'MySQL', 'SPSS'],
    color: 'from-blue-400 to-fuchsia-600',
    icon: FileChartColumn,
    gradient: 'from-blue-400/20 to-fuchsia-600/20',
    projectKey: 'hppolice'
  }
];