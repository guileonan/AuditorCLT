/**
 * Utility functions for handling image loading states and fallbacks
 */

export const handleImageError = (event, componentName = 'Unknown') => {
  console.warn(`[${componentName}] Failed to load image asset:`, event.target.src);
};

export const checkImageExists = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};