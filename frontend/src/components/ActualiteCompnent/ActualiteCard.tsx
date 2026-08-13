import { Calendar } from 'lucide-react';
import type { Actualite } from '../../types/actualite.types';
import CategoryChip from '../common/CategoryChip';
import { formatDate } from '../../utils/date.utils';
import { getImageUrl } from '../../utils/image.utils';
import ViewDetailsButton from '../common/ViewDetailsButton';

interface Props {
  actualite: Actualite;
}

const ActualiteCard = ({ actualite }: Props) => {
  const imageUrl = actualite.image
    ? getImageUrl(actualite.image)
    : 'https://images.unsplash.com/photo-1768117173988-5ebfdde4fdd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

  return (
    <article data-gsap className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-100 hover:shadow-card-hover">
      <div className="img-reveal relative h-48 overflow-hidden bg-ink-100">
        <img src={imageUrl} alt={actualite.titre} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <CategoryChip category={actualite.categorie} size="small" />
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <Calendar className="size-3" />
            {formatDate(actualite.date)}
          </span>
        </div>
        <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-ink-900">
          {actualite.titre}
        </h3>
        <p className="flex-1 text-sm leading-6 text-ink-500 line-clamp-3">{actualite.resume}</p>
        {actualite.auteur && (
          <p className="mt-2 text-xs text-ink-400">
            Par <span className="font-medium">{actualite.auteur}</span>
          </p>
        )}
        <ViewDetailsButton
          to={`/actualites/${actualite.slug}`}
          ariaLabel={`Voir le détail de ${actualite.titre}`}
        />
      </div>
    </article>
  );
};

export default ActualiteCard;
