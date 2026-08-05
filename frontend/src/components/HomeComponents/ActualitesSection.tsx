import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { useRecentActualites } from '../../hooks';
import { getImageUrl } from '../../utils/image.utils';
import { CARD_WIDTH_CLASS, SKELETON_KEYS } from '../../utils/component.utils';
import { SectionHeader, SectionCta, SectionContent, ScrollableCardGrid } from '../../components';
import { TEXT_LINK_BUTTON } from '../../constants/styles';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1768117173988-5ebfdde4fdd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const SECTION_CTA = { label: 'Toutes les actualités', link: '/actualites' } as const;

const ActualitesSection = () => {
  const { actualites, loading, error } = useRecentActualites(8);

  const headerContent = (
    <SectionHeader
      eyebrow="Vie de l'école"
      title="Dernières Actualités"
      description="Restez informé de la vie de l'ESSG"
    />
  );

  const loadingSkeletons = (
    <ScrollableCardGrid className="mt-2 w-full">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={SKELETON_KEYS[i]}
          className={`${CARD_WIDTH_CLASS} rounded-3xl overflow-hidden border border-ink-100 bg-white shadow-card`}
        >
          <div className="aspect-[16/9] w-full bg-ink-100 animate-pulse" />
          <div className="p-6 space-y-2">
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
      isEmpty={!loading && actualites.length === 0}
      emptyMessage="Aucune actualité disponible pour le moment."
      headerContent={headerContent}
      loadingSkeletons={loadingSkeletons}
      sectionClassName="py-2 bg-white"
      containerClassName="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"
    >
      <ScrollableCardGrid className="mt-2 w-full">
        {actualites.map((actu) => {
          const imageUrl = actu.image ? getImageUrl(actu.image) : FALLBACK_IMAGE;

          return (
            <article
              key={actu.id}
              className={`${CARD_WIDTH_CLASS} group rounded-xl overflow-hidden border border-ink-100 bg-white shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col`}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-ink-100">
                <img
                  src={imageUrl}
                  alt={actu.titre}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                    {actu.categorie || 'Actualité'}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center rounded-sm bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white">
                    {new Date(actu.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-ink-900 mb-3 line-clamp-2 leading-snug">
                  {actu.titre}
                </h3>

                <p className="text-sm text-ink-600 line-clamp-3 flex-1 leading-6">{actu.resume}</p>

                <Button
                  component={RouterLink}
                  to={`/actualites/${actu.slug}`}
                  variant="text"
                  endIcon={<ArrowForwardRoundedIcon />}
                  aria-label={`Lire la suite : ${actu.titre}`}
                  sx={TEXT_LINK_BUTTON}
                >
                  Lire la suite
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

export default ActualitesSection;
