/**
 * Construit une URL d'image complète à partir d'une référence backend.
 * Les fichiers sont stockés dans MinIO et exposés via /media/...
 */

function resolveApiBase(): string {
  const raw =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
    (import.meta.env.VITE_APP_URL as string | undefined) ||
    'http://localhost:3000';
  return raw.replace(/\/$/, '').replace(/\/api$/, '');
}

export const isRemoteImage = (imagePath?: string | null): boolean => {
  if (!imagePath) return false;
  return (
    imagePath.startsWith('http') ||
    imagePath.startsWith('/media/') ||
    imagePath.startsWith('/uploads/') ||
    imagePath.startsWith('/images/')
  );
};

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = resolveApiBase();
  return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};
