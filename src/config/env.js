const env = {
  emailjs: {
    serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || '',
    templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '',
    publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '',
  },
  gemini: {
    apiKey: process.env.REACT_APP_GEMINI_API_KEY || '',
    model: 'gemini-2.5-flash-lite',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
  },
  analytics: {
    measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID || '',
  },
};

export const isConfigured = (service) => {
  const config = env[service];
  if (!config) return false;
  return Object.values(config).every(v => v && v.length > 0);
};

export const getConfig = (service) => {
  return env[service] || null;
};

export default env;
