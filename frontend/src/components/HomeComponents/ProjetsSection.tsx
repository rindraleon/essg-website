import type { FeaturedProjetsSectionProps } from '../../types/projets.types';
import { useProjets } from '../../hooks';
import { getImageUrl } from '../../utils/image.utils';
import { CARD_WIDTH_CLASS, SKELETON_KEYS } from '../../utils/component.utils';
import { SectionHeader, SectionCta, SectionContent, ScrollableCardGrid, ViewDetailsButton } from '../../components';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const SECTION_CTA = { label: 'Découvrir tous nos projets', link: '/projets' } as const;

const ProjetsSection = ({
  title = "Projets d'Excellence",
  description = "L'ESSG s'engage dans des projets innovants au service du développement et de la recherche",
}: FeaturedProjetsSectionProps) => {
  const { projets, loading, error } = useProjets();

  const headerContent = (
    <SectionHeader 
    // eyebrow="Recherche & Innovation" 
    title={title} 
    description={description} />
  );

  const loadingSkeletons = (
    <ScrollableCardGrid className="mt-2 w-full">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={SKELETON_KEYS[i]}
          className={`${CARD_WIDTH_CLASS} rounded-3xl overflow-hidden border border-ink-100 bg-white shadow-card`}
        >
          <div className="aspect-[16/9] w-full bg-ink-100 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="h-5 w-24 rounded-full bg-ink-100 animate-pulse" />
            <div className="h-5 w-4/5 rounded bg-ink-100 animate-pulse" />
            <div className="h-4 w-full rounded bg-ink-100 animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-ink-100 animate-pulse" />
            <div className="h-4 w-3/5 rounded bg-ink-100 animate-pulse" />
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
          return (
            <article
              key={projet.id}
              data-gsap
              className={`${CARD_WIDTH_CLASS} group rounded-xl overflow-hidden border border-ink-100 bg-white shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col`}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-ink-100">
                <img
                  src={imageUrl}
                  alt={projet.titre}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                  {projet.type && (
                    <span className="inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                      {projet.type}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-ink-900 mb-3 line-clamp-2 leading-snug">
                  {projet.titre}
                </h3>

                <p className="text-sm text-justify text-ink-600 line-clamp-3 leading-6 mb-4">
                  {projet.description}
                </p>

                <ViewDetailsButton
                  to={`/projets/${projet.slug}`}
                  ariaLabel={`Voir le détail de ${projet.titre}`}
                />
              </div>
            </article>
          );
        })}
      </ScrollableCardGrid>

      <SectionCta label={SECTION_CTA.label} link={SECTION_CTA.link} />
    </SectionContent>
  );
};

export default ProjetsSection;
