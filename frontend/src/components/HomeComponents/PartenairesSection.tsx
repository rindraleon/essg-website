import { useEffect, useState } from 'react';
import { SectionCta } from '../../components';
import partenaireService from '../../services/partenaire.service';
import { getImageUrl } from '../../utils/image.utils';
import type { PartenaireItem, PartenairesSectionProps } from '../../types';

const SECTION_CTA = { label: 'Voir tous nos partenaires', link: '/partenaires' } as const;

const PartenairesSection = ({
  title = 'Nos Partenaires',
  description = 'Des collaborations prestigieuses au niveau mondial',
  maxItems = 8,
  partenaires: propPartenaires,
}: PartenairesSectionProps) => {
  const [partenaires, setPartenaires] = useState<PartenaireItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartenaires = async () => {
      if (propPartenaires && propPartenaires.length > 0) {
        setPartenaires(propPartenaires);
        setLoading(false);
        return;
      }

      try {
        const data = await partenaireService.findAllPaginated(1, maxItems);
        setPartenaires(data);
      } catch (error) {
        console.error('Erreur lors du chargement des partenaires:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPartenaires();
  }, [propPartenaires, maxItems]);

  const visiblePartenaires = partenaires.slice(0, maxItems);

  const getLogoUrl = (partenaire: PartenaireItem): string | null => {
    if (!partenaire.logo) return null;
    return getImageUrl(partenaire.logo);
  };

  // Dupliquer les partenaires pour créer l'effet de défilement infini
  const duplicatedPartenaires = [
    ...visiblePartenaires,
    ...visiblePartenaires,
    ...visiblePartenaires,
  ];

  return (
    <section className="bg-gradient-to-b from-ink-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-brand-100">
            Réseau mondial
          </span>
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
            <div className="flex animate-scroll">
              {duplicatedPartenaires.map((partenaire, index) => {
                const logoUrl = getLogoUrl(partenaire);
                return (
                  <div
                    key={`${partenaire.id}-${index}`}
                    className="flex-shrink-0 mx-8 w-32 h-32 flex items-center justify-center"
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={`${partenaire.nom} logo`}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-50 rounded-2xl border border-brand-100">
                        <span className="text-xs text-ink-500 text-center px-2">
                          {partenaire.nom}
                        </span>
                      </div>
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
