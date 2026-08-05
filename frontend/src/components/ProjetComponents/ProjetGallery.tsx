import React, { useCallback, useEffect, useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import PhotoLibraryRoundedIcon from '@mui/icons-material/PhotoLibraryRounded';
import { getImageUrl } from '../../utils/image.utils';

interface ProjetGalleryProps {
  images: string[];
  alt?: string;
}

/**
 * Galerie d'images moderne pour un projet :
 * - affichage en grille responsive ;
 * - Lightbox au clic (plein écran) ;
 * - navigation précédente / suivante (boutons + clavier ← →) ;
 * - fermeture (bouton + Échap + clic sur le fond) ;
 * - compteur d'images.
 */
const ProjetGallery: React.FC<ProjetGalleryProps> = ({ images, alt = 'Image du projet' }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const urls = React.useMemo(() => images.map((image) => getImageUrl(image)), [images]);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => {
    setLightboxIndex((current) =>
      current === null ? null : (current - 1 + urls.length) % urls.length
    );
  }, [urls.length]);
  const next = useCallback(() => {
    setLightboxIndex((current) => (current === null ? null : (current + 1) % urls.length));
  }, [urls.length]);

  // Navigation clavier + blocage du scroll pendant l'ouverture
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowLeft') prev();
      else if (event.key === 'ArrowRight') next();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, close, prev, next]);

  if (urls.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100">
          <PhotoLibraryRoundedIcon sx={{ fontSize: 20 }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-ink-900">Galerie d'images</h3>
          <p className="text-xs text-ink-500">
            {urls.length} photo{urls.length > 1 ? 's' : ''} — cliquez pour agrandir
          </p>
        </div>
      </div>

      {/* Grille responsive */}
      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-4">
        {urls.map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => setLightboxIndex(index)}
            aria-label={`Agrandir l'image ${index + 1} sur ${urls.length}`}
            className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl border border-ink-100 bg-ink-50 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
          >
            <img
              src={url}
              alt={`${alt} ${index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.opacity = '0.4';
              }}
            />
            <span className="pointer-events-none absolute inset-0 flex items-end justify-start bg-gradient-to-t from-ink-950/40 to-transparent p-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="text-xs font-semibold text-white">
                {index + 1} / {urls.length}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse d'images"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/95 backdrop-blur-sm animate-fade-in"
          onClick={close}
        >
          {/* Bouton fermer */}
          <button
            type="button"
            onClick={close}
            aria-label="Fermer la visionneuse"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-all duration-200 hover:bg-white/20"
          >
            <CloseRoundedIcon />
          </button>

          {/* Navigation précédente */}
          {urls.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Image précédente"
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-all duration-200 hover:bg-white/20 sm:left-6"
            >
              <ChevronLeftRoundedIcon sx={{ fontSize: 28 }} />
            </button>
          )}

          {/* Image */}
          <figure
            className="flex max-h-full max-w-full flex-col items-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={urls[lightboxIndex]}
              alt={`${alt} ${lightboxIndex + 1}`}
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-elevated animate-scale-in"
            />
            <figcaption className="mt-4 text-sm font-medium text-white/80">
              {lightboxIndex + 1} / {urls.length}
            </figcaption>
          </figure>

          {/* Navigation suivante */}
          {urls.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Image suivante"
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-all duration-200 hover:bg-white/20 sm:right-6"
            >
              <ChevronRightRoundedIcon sx={{ fontSize: 28 }} />
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default ProjetGallery;
