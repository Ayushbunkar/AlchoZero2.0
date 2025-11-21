// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

/**
 * Generate Cloudinary signature for authenticated uploads
 */
const generateSignature = (timestamp) => {
  // Note: For security, signature generation should be done on the backend
  // This is a placeholder - implement backend endpoint for signed uploads
  return '';
};

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadToCloudinary = async (file) => {
  try {
    // Check if configuration is set
    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary cloud name not configured. Please set VITE_CLOUDINARY_CLOUD_NAME in .env file');
    }
    
    if (!CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary upload preset not configured. Please set VITE_CLOUDINARY_UPLOAD_PRESET in .env file or create an unsigned upload preset in Cloudinary dashboard');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'alchozero/drivers');
    
    // Using unsigned upload - no API key or signature required
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image',
    };
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    // Note: Deletion requires authentication on the backend
    // This is a placeholder - implement backend endpoint for deletion
    console.warn('Cloudinary deletion should be done through backend');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get optimized image URL
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  const { width = 300, height = 300, crop = 'fill', quality = 'auto' } = options;
  
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Insert transformations into Cloudinary URL
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/w_${width},h_${height},c_${crop},q_${quality}/${parts[1]}`;
  }
  
  return url;
};

export { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET };
