import { Siren, ScanEye, MessageCircleWarning, FileChartColumn } from 'lucide-react';

export const projects = [
  {
    id: 1,
    title: 'RiskGrid: ML Based Predictive Policing',
    description: 'AI-Powered Machine learning system for real-time crime risk prediction and intelligent patrol optimization',
    tech: ['Python', 'XGBoost', 'Random Forest', 'LightGBM', 'Scikit-learn', 'GeoPandas', 'Folium', 'Flask', 'FastAPI'],
    color: 'from-cyan-400 to-blue-500',
    icon: Siren,
    gradient: 'from-cyan-500/20 to-blue-500/20',
    projectKey: 'riskgrid'
  },
  {
    id: 2,
    title: 'The Canspiracy: Real-time can detection using Computer Vision and ML.',
    description: 'YOLOv8-based object detection across multiple formats - from single images to real-time video feeds including webcam and mobile phone cameras via DroidCam.',
    tech: ['Pytorch', 'OpenCV', 'YOLOv8', 'Seaborn', 'Matplotlib', 'Pandas', 'NumPy', 'Tkinter', 'Squarify', 'Droidcam'],
    color: 'from-purple-400 to-pink-500',
    icon: ScanEye,
    gradient: 'from-purple-500/20 to-pink-500/20',
    projectKey: 'canspiracy'
  },
  {
    id: 3,
    title: 'PHQReportStream: AI-powered parser for HP Police reports with DistilBERT-based structured data extraction.',
    description: 'Intelligent parser for HP Police IRBn/Bn daily reports. Take inputs as text, file uploads, or batch inputs into structured Excel/CSV/JSON formats. It includes AI-powered enhancements using DistilBERT and NLTK for better accuracy and semantic understanding.',
    tech: ['Python', 'NLTK', 'Transformers', 'DistilBERT', 'Streamlit', 'Pandas', 'NumPy', 'Regex', 'Spacy', 'Scikit-learn', 'Torch', 'Langchain', 'TQDM', 'Openpyxl', 'xlswriter'],
    color: 'from-green-400 to-emerald-500',
    icon: MessageCircleWarning,
    gradient: 'from-green-500/20 to-emerald-500/20',
    projectKey: 'phqreport'
  },
  {
    id: 4,
    title: 'Himachal Pradesh Police Employee Engagement Survey Analysis.',
    description: 'In-depth analysis of employee engagement within the Himachal Pradesh Police department, utilizing advanced data analytics and visualization techniques.',
    tech: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Plotly', 'Scikit-learn', 'JupyterNotebook', 'R (Statistical Modeling)', 'MySQL', 'SPSS'],
    color: 'from-blue-400 to-fuchsia-600',
    icon: FileChartColumn,
    gradient: 'from-blue-400/20 to-fuchsia-600/20',
    projectKey: 'hppolice'
  }
];
