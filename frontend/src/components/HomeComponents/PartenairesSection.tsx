import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionCta } from '../../components';
import { usePartenaires } from '../../hooks';
import { getImageUrl } from '../../utils/image.utils';
import { gsap, prefersReducedMotion, registerGsap } from '../../lib/gsap';
import useGsapReveal from '../../hooks/useGsapReveal';
import type { PartenairesSectionProps } from '../../types';

const SECTION_CTA = { label: 'Voir tous nos partenaires', link: '/partenaires' } as const;

const PartenairesSection = ({
  title = 'Nos Partenaires',
  description = 'Des collaborations prestigieuses au niveau mondial',
  maxItems = 8,
  partenaires: propPartenaires,
}: PartenairesSectionProps) => {
  const { partenaires: fetchedPartenaires, loading: queryLoading } = usePartenaires();
  const partenaires = propPartenaires && propPartenaires.length > 0 ? propPartenaires : fetchedPartenaires;
  const loading = propPartenaires && propPartenaires.length > 0 ? false : queryLoading;
  const navigate = useNavigate();
  const revealRef = useGsapReveal<HTMLElement>();
  const trackRef = useRef<HTMLDivElement | null>(null);

  const visiblePartenaires = partenaires.slice(0, maxItems);

  const getLogoUrl = (partenaire: (typeof partenaires)[number]): string | null => {
    if (!partenaire.logo) return null;
    return getImageUrl(partenaire.logo);
  };

  // Dupliquer les partenaires pour créer l'effet de défilement infini
  const duplicatedPartenaires = [
    ...visiblePartenaires,
    ...visiblePartenaires,
    ...visiblePartenaires,
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || visiblePartenaires.length === 0 || prefersReducedMotion()) return;

    registerGsap();
    const tween = gsap.to(track, {
      xPercent: -33.333,
      duration: 28,
      ease: 'none',
      repeat: -1,
    });

    const pause = () => tween.pause();
    const play = () => tween.play();
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', play);

    return () => {
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', play);
      tween.kill();
    };
  }, [visiblePartenaires.length]);

  return (
    <section ref={revealRef} className="bg-gradient-to-b from-ink-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div data-gsap className="mb-14 text-center">
          {/* <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
            Réseau mondial
          </span> */}
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-ink-500">{description}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-xl border-4 border-brand-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="relative overflow-hidden py-8">
            <div ref={trackRef} className="flex will-change-transform">
              {duplicatedPartenaires.map((partenaire, index) => {
                const logoUrl = getLogoUrl(partenaire);
                const handleClick = () => {
                  const slug = partenaire.slug || String(partenaire.id);
                  navigate(`/partenaires/${slug}`);
                };

                return (
                  <div
                    key={`${partenaire.id}-${index}`}
                    className="flex-shrink-0 mx-8 w-32 h-32 flex items-center justify-center"
                  >
                    {logoUrl ? (
                      <button
                        type="button"
                        aria-label={`Voir la page de ${partenaire.nom}`}
                        className="flex h-full w-full items-center justify-center rounded-2xl bg-transparent p-0"
                        onClick={handleClick}
                      >
                        <img
                          src={logoUrl}
                          alt={`${partenaire.nom} logo`}
                          className="max-w-full max-h-full object-contain cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </button>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Voir la page de ${partenaire.nom}`}
                        className="w-full h-full flex items-center justify-center bg-brand-50 rounded-2xl border border-brand-100 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleClick}
                      >
                        <span className="text-xs text-ink-500 text-center px-2">
                          {partenaire.nom}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <SectionCta label={SECTION_CTA.label} link={SECTION_CTA.link} />
      </div>

      <style>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.333%);
                    }
                }

                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }

                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
    </section>
  );
};

export default PartenairesSection;
