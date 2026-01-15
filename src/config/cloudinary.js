export const CLOUDINARY_CONFIG = {
  cloudName: 'dg5o8qvwp', 
  baseUrl: 'https://res.cloudinary.com',
  folder: '',
};

// Helper function to generate optimized Cloudinary URLs
export const getCloudinaryUrl = (publicId, options = {}) => {
  const {
    width = 1920,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
  } = options;

  const transformations = [
    `w_${width}`,
    `q_${quality}`,
    `f_${format}`,
    `c_${crop}`,
  ].join(',');

  return `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformations}/${CLOUDINARY_CONFIG.folder}/${publicId}`;
};


export const getGalleryImageUrl = (publicId) => ({
  thumbnail: getCloudinaryUrl(publicId, { width: 800, quality: 'auto:good' }),
  full: getCloudinaryUrl(publicId, { width: 1920, quality: 'auto:best' }),
  // Blur placeholder (tiny, for loading effect)
  placeholder: getCloudinaryUrl(publicId, { width: 50, quality: 30 }),
});