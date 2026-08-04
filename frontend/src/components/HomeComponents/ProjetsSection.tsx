import { useEffect, useState } from 'react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import type { FeaturedProjetsSectionProps, FeaturedProjetItem } from '../../types/projets.types';
import { projetService } from '../../services';
import { getImageUrl } from '../../utils/image.utils';
import { CARD_WIDTH_CLASS, SKELETON_KEYS } from '../../utils/component.utils';
import { SectionHeader, SectionContent, ScrollableCardGrid, MobileCta } from '../../components';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const BUTTON_STYLES = {
  mt: 'auto',
  py: 1,
  px: 2.5,
  minWidth: 'auto',
  backgroundColor: '#2563eb',
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '0.75rem',
  fontSize: '0.875rem',
  '&:hover': {
    backgroundColor: '#1d4ed8',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
  },
  transition: 'all 0.2s ease-in-out',
} as const;

const ProjetsSection = ({
  title = "Projets d'Excellence",
  description = "L'ESSG s'engage dans des projets innovants au service du développement et de la recherche",
  ctaLabel = 'Découvrir tous nos projets',
  ctaLink = '/projets',
}: FeaturedProjetsSectionProps) => {
  const [projets, setProjets] = useState<FeaturedProjetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjets = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const data = await projetService.findAll();

        const transformedProjets = data.map((projet) => ({
          id: String(projet.id),
          titre: projet.titre,
          statut: projet.statut || 'En cours',
          type: projet.type,
          annee: projet.date ? new Date(projet.date).getFullYear().toString() : '',
          description: projet.description,
          partenaires: projet.partenaires || [],
          image: projet.image,
          budget: projet.budget,
          objectifs: projet.objectifs,
          location:
            projet.latitude && projet.longitude
              ? {
                  lat: Number.parseFloat(projet.latitude),
                  lng: Number.parseFloat(projet.longitude),
                  ville: projet.ville || '',
                  pays: projet.pays || '',
                  adresse: projet.adresse,
                }
              : undefined,
        }));

        if (isMounted) {
          setProjets(transformedProjets);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des projets :', err);

        if (isMounted) {
          setError('Impossible de charger les projets');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProjets();

    return () => {
      isMounted = false;
    };
  }, []);

  const headerContent = (
    <SectionHeader title={title} description={description} ctaLabel={ctaLabel} ctaLink={ctaLink} />
  );

  const loadingSkeletons = (
    <ScrollableCardGrid className="mt-2 w-full">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={SKELETON_KEYS[i]}
          className={`${CARD_WIDTH_CLASS} rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm`}
        >
          <div className="aspect-[16/10] w-full bg-gray-200 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="h-5 w-24 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-5 w-4/5 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-3/5 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </ScrollableCardGrid>
  );

  return (
    <SectionContent
      loading={loading}
      error={error}
      isEmpty={!loading && projets.length === 0}
      emptyMessage="Aucun projet disponible pour le moment."
      headerContent={headerContent}
      loadingSkeletons={loadingSkeletons}
      sectionClassName="py-16 bg-white"
      containerClassName="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"
    >
      <ScrollableCardGrid className="mt-2 w-full">
        {projets.map((projet) => {
          const imageUrl = projet.image ? getImageUrl(projet.image) : FALLBACK_IMAGE;

          const locationLabel = [projet.location?.ville, projet.location?.pays]
            .filter(Boolean)
            .join(', ');

          return (
            <article
              key={projet.id}
              className={`${CARD_WIDTH_CLASS} rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col`}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={projet.titre}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {projet.type && (
                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {projet.type}
                    </span>
                  )}

                  {projet.annee && (
                    <span className="text-xs font-medium text-gray-500">{projet.annee}</span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-snug">
                  {projet.titre}
                </h3>

                <p className="text-sm text-justify text-gray-600 line-clamp-3 leading-6 mb-4">
                  {projet.description}
                </p>

                {locationLabel && (
                  <div className="mb-3 text-xs text-gray-500 flex items-start gap-2">
                    <span className="mt-0.5">📍</span>
                    <span>{locationLabel}</span>
                  </div>
                )}

                {projet.budget && (
                  <div className="mb-3 text-xs text-gray-600">
                    <span className="font-semibold text-gray-700">Budget : </span>
                    <span>{projet.budget}</span>
                  </div>
                )}

                {projet.partenaires?.length > 0 && (
                  <div className="mb-4 text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">Partenaires : </span>
                    <span className="line-clamp-2">{projet.partenaires.join(', ')}</span>
                  </div>
                )}

                <Button
                  component={RouterLink}
                  to={`/projets/${projet.titre.replace(/\s+/g, '-').toLowerCase()}`}
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  aria-label={`Voir le projet ${projet.titre}`}
                  sx={BUTTON_STYLES}
                >
                  Voir le projet
                </Button>
              </div>
            </article>
          );
        })}
      </ScrollableCardGrid>

      <MobileCta label={ctaLabel} link={ctaLink} />
    </SectionContent>
  );
};

export default ProjetsSection;
