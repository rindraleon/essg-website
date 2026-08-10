import { useEffect, useState } from 'react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

import { getImageUrl } from '../../utils/image.utils';
import { CARD_WIDTH_CLASS, SKELETON_KEYS } from '../../utils/component.utils';
import { SectionHeader, SectionCta, SectionContent, ScrollableCardGrid } from '../../components';
import { formationService } from '../../services';
import { TEXT_LINK_BUTTON } from '../../constants/styles';
import type { FeaturedFormationsSectionProps, Formation } from '../../types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523050854058-8df90110a6f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const SECTION_CTA = { label: 'Voir toutes les formations', link: '/formations' } as const;

const FormationsSection = ({
  title = "Formations d'excellence",
  description = "Des programmes d'excellence reconnus internationalement",
  featuredFormations: propFeaturedFormations,
}: FeaturedFormationsSectionProps) => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedFormations = async () => {
      if (propFeaturedFormations !== undefined) {
        if (isMounted) {
          setFormations(propFeaturedFormations);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const data = await formationService.findFeatured();

        if (isMounted) {
          setFormations(data as Formation[]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des formations :', err);

        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Erreur lors du chargement des formations');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeaturedFormations();

    return () => {
      isMounted = false;
    };
  }, [propFeaturedFormations]);

  const headerContent = (
    <SectionHeader 
    // eyebrow="Nos programmes" 
    title={title} 
    description={description} />
  );

  const loadingSkeletons = (
    <ScrollableCardGrid className="mt-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={SKELETON_KEYS[i]}
          className={`${CARD_WIDTH_CLASS} rounded-3xl overflow-hidden border border-ink-100 bg-white shadow-card`}
        >
          <div className="aspect-[16/9] w-full bg-ink-100 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="h-6 w-24 rounded-full bg-ink-100 animate-pulse" />
            <div className="h-5 w-4/5 rounded bg-ink-100 animate-pulse" />
            <div className="h-4 w-full rounded bg-ink-100 animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-ink-100 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-ink-100 animate-pulse" />
          </div>
        </div>
      ))}
    </ScrollableCardGrid>
  );

  return (
    <SectionContent
      loading={loading}
      error={error}
      isEmpty={!loading && formations.length === 0}
      emptyMessage="Aucune formation disponible pour le moment."
      headerContent={headerContent}
      loadingSkeletons={loadingSkeletons}
      sectionClassName="py-20 bg-white"
      fluid
      containerClassName="max-w-none"
    >
      <ScrollableCardGrid className="mt-2 w-full">
        {formations.map((formation) => {
          const imageUrl = formation.image ? getImageUrl(formation.image) : FALLBACK_IMAGE;

          const formationLink = `/formations/${formation.slug ?? formation.id}`;

          return (
            <article
              key={formation.id}
              className={`${CARD_WIDTH_CLASS} group rounded-xl overflow-hidden border border-ink-100 bg-white shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col`}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-ink-100">
                <img
                  src={imageUrl}
                  alt={formation.titre}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    {formation.niveau || 'Formation'}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                

                <h3 className="text-lg font-semibold text-ink-900 mb-3 line-clamp-2 leading-snug">
                  {formation.titre}
                </h3>

                <p className="text-sm text-justify text-ink-600 line-clamp-3 flex-1 leading-6">
                  {formation.description || "Découvrez cette formation d'excellence."}
                </p>

                <Button
                  component={RouterLink}
                  to={formationLink}
                  variant="text"
                  endIcon={<ArrowForwardRoundedIcon />}
                  aria-label={`En savoir plus sur ${formation.titre}`}
                  sx={TEXT_LINK_BUTTON}
                >
                  En savoir plus
                </Button>
              </div>
            </article>
          );
        })}
      </ScrollableCardGrid>

      <SectionCta label={SECTION_CTA.label} link={SECTION_CTA.link} />
    </SectionContent>
  );
};

export default FormationsSection;
