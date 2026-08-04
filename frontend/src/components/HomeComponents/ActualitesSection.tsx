import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { useRecentActualites } from '../../hooks';
import CategoryChip from '../common/CategoryChip';
import { getImageUrl } from '../../utils/image.utils';
import { CARD_WIDTH_CLASS, SKELETON_KEYS } from '../../utils/component.utils';
import { SectionHeader, SectionContent, ScrollableCardGrid, MobileCta } from '../../components';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1768117173988-5ebfdde4fdd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const BUTTON_STYLES = {
  mt: 3,
  p: 0,
  minWidth: 'auto',
  color: '#2563eb',
  fontWeight: 700,
  textTransform: 'none',
  justifyContent: 'flex-start',
  alignSelf: 'flex-start',
  '&:hover': { backgroundColor: 'transparent', color: '#1d4ed8' },
} as const;

const ActualitesSection = () => {
  const { actualites, loading, error } = useRecentActualites(8);

  const headerContent = (
    <SectionHeader
      title="Dernières Actualités"
      description="Restez informé de la vie de l'ESSG"
      ctaLabel="Toutes les actualités"
      ctaLink="/actualites"
    />
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
            <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-5 w-4/5 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-gray-200 animate-pulse" />
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
      isEmpty={!loading && actualites.length === 0}
      emptyMessage="Aucune actualité disponible pour le moment."
      headerContent={headerContent}
      loadingSkeletons={loadingSkeletons}
      sectionClassName="py-16 bg-white"
      containerClassName="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"
    >
      <ScrollableCardGrid className="mt-2 w-full">
        {actualites.map((actu) => {
          const imageUrl = actu.image ? getImageUrl(actu.image) : FALLBACK_IMAGE;

          return (
            <article
              key={actu.id}
              className={`${CARD_WIDTH_CLASS} rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col`}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={actu.titre}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <CategoryChip category={actu.categorie} size="small" />
                  <span className="text-xs text-gray-500">
                    {new Date(actu.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-snug">
                  {actu.titre}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3 flex-1 leading-6">{actu.resume}</p>

                <Button
                  component={RouterLink}
                  to={`/actualites/${actu.slug}`}
                  variant="text"
                  endIcon={<ArrowForwardRoundedIcon />}
                  aria-label={`Lire la suite : ${actu.titre}`}
                  sx={BUTTON_STYLES}
                >
                  Lire la suite
                </Button>
              </div>
            </article>
          );
        })}
      </ScrollableCardGrid>

      <MobileCta label="Toutes les actualités" link="/actualites" />
    </SectionContent>
  );
};

export default ActualitesSection;
