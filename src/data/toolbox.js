// The canonical skill list for the portfolio (owner, 2026-10-05): the home
// Toolbox renders it and the AI assistant reads it. The résumé page keeps its
// own list until the owner supplies the new résumé PDF.
//   building     tools in active use on current projects
//   exploring    tools being learned or used without established depth
//                (Docker, AWS and PostgreSQL moved here from "experienced"
//                on the owner's instruction: no production experience claimed)
//   experienced  tools used in past work
export const toolbox = {
  building: ['PyTorch', 'YOLOv8', 'ONNX Runtime', 'FastAPI', 'React', 'Rust', 'Tauri', 'OpenCV', 'Python', 'TypeScript'],
  exploring: ['RLHF', 'Model Distillation', 'LoRA Fine-tuning', 'Vision Transformers', '3D Gaussian Splatting', 'WebGPU', 'Multi-Agent Systems', 'RAG Pipelines', 'Docker', 'AWS', 'PostgreSQL'],
  experienced: ['TensorFlow', 'Scikit-learn', 'Java', 'C++', 'MATLAB', 'Three.js', 'Figma', 'Adobe Lightroom', 'Adobe Premiere Pro', 'After Effects', 'Git & GitHub', 'Linux'],
};

export const TOOLBOX_LABELS = {
  building: 'Building With',
  exploring: 'Exploring',
  experienced: 'Experienced With',
};
