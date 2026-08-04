import { useActiveRessourcesHumaines } from '../../hooks';
import { getImageUrl } from '../../utils/image.utils';
import { CARD_WIDTH_CLASS, SKELETON_KEYS } from '../../utils/component.utils';
import { SectionContent, ScrollableCardGrid } from '../../components';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

const RessourceHumaineSection = () => {
  const { ressourcesHumaines, loading, error } = useActiveRessourcesHumaines();

  const headerContent = (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900">Notre Équipe</h2>
      <p className="mt-2 text-gray-500 max-w-2xl mx-auto">
        Des professionnels qualifiés et passionnés au service de votre réussite
      </p>
    </div>
  );

  const loadingSkeletons = (
    <ScrollableCardGrid className="mt-2 w-full">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={SKELETON_KEYS[i]}
          className={`${CARD_WIDTH_CLASS} rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm`}
        >
          <div className="aspect-[4/3] w-full bg-gray-200 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="h-5 w-3/5 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-2/5 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </ScrollableCardGrid>
  );

  return (
    <SectionContent
      loading={loading}
      error={error}
      isEmpty={!loading && ressourcesHumaines.length === 0}
      emptyMessage="Aucun membre de l'équipe disponible pour le moment."
      headerContent={headerContent}
      loadingSkeletons={loadingSkeletons}
      sectionClassName="py-16 bg-gray-50"
      containerClassName="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"
    >
      <ScrollableCardGrid className="mt-2 w-full">
        {ressourcesHumaines.map((membre) => {
          const imageUrl = membre.photo ? getImageUrl(membre.photo) : FALLBACK_IMAGE;

          return (
            <article
              key={membre.id}
              className={`${CARD_WIDTH_CLASS} rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={`${membre.prenom} ${membre.nom}`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-snug">
                  {membre.prenom} {membre.nom}
                </h3>

                <p className="text-sm font-semibold text-blue-600 mb-4">{membre.poste}</p>

                {membre.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 flex-1 leading-6 mb-4">
                    {membre.description}
                  </p>
                )}

                <div className="mt-auto space-y-2">
                  {membre.email && (
                    <p className="text-xs text-gray-500 flex items-start gap-2 break-all">
                      <svg
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{membre.email}</span>
                    </p>
                  )}

                  {membre.telephone && (
                    <p className="text-xs text-gray-500 flex items-start gap-2">
                      <svg
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{membre.telephone}</span>
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </ScrollableCardGrid>
    </SectionContent>
  );
};

export default RessourceHumaineSection;
