/**
 * Utility function to build complete image URLs from backend paths
 *
 * Backend returns image paths like:
 * - /uploads/filename.jpg (for uploaded files)
 * - /images/default.jpg (for default images)
 * - http://... (for external URLs)
 *
 * This function converts them to complete URLs accessible from the back-office
 */

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';

  // If already a complete URL, return as is
  if (imagePath.startsWith('http')) return imagePath;

  // Get API base URL from environment or use default
  const apiBaseUrl = import.meta.env.VITE_APP_URL || 'http://localhost:3000';

  // Ensure the base URL has a protocol
  const baseUrl = apiBaseUrl.startsWith('http')
    ? apiBaseUrl.replace(/\/api\/?$/, '')
    : `http://${apiBaseUrl}`.replace(/\/api\/?$/, '');

  // Return complete URL
  return `${baseUrl}${imagePath}`;
};
