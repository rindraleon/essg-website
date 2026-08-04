/**
 * Utility function to build complete image URLs from backend paths
 *
 * Backend returns image paths like:
 * - /uploads/filename.jpg (for uploaded files)
 * - /images/default.jpg (for default images)
 * - http://... (for external URLs)
 *
 * This function converts them to complete URLs accessible from the frontend
 */

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';

  // If already a complete URL, return as is
  if (imagePath.startsWith('http')) return imagePath;

  // Get API base URL from environment or use default
  const apiBaseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:3000';

  // Remove /api suffix if present to get the base server URL
  const baseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

  // Return complete URL
  return `${baseUrl}${imagePath}`;
};

/**
 * Get a fallback image URL for formations
 * Used when no image is provided by the backend
 */
export const getDefaultFormationImage = (slug: string): string => {
  const HERO_IMAGES: Record<string, string> = {};

  const hash = HERO_IMAGES[slug] ?? '1524178232363-1fb2b075b655';
  return `https://images.unsplash.com/photo-${hash}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920`;
};

/**
 * Get formation image with fallback to default image
 *
 * @param imagePath - Image path from backend (can be empty)
 * @param slug - Formation slug for fallback image
 * @returns Complete image URL
 */
export const getFormationImage = (imagePath: string, slug: string): string => {
  // If backend provides an image, use it
  if (imagePath) {
    return getImageUrl(imagePath);
  }

  // Otherwise, use default image based on slug
  return getDefaultFormationImage(slug);
};
