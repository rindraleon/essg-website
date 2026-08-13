import { Card, CardContent, Chip } from '@/components/compat/mui';
import { Calendar, MapPin, Users } from 'lucide-react';
import React from 'react';
import MapEmbed from './MapEmbed';
import { getImageUrl } from '../../utils/image.utils';
import { generateSlug } from '../../utils/slug.utils';
import ViewDetailsButton from '../common/ViewDetailsButton';
import type { ProjetCardProps } from '../../types/projets.types';

const PROJECT_IMAGES: Record<string, string> = {
  '1': '1594935975218-a3596da034a3',
  '2': '1460186136353-977e9d6085a1',
  '3': '1602052577122-f73b9710adba',
  '4': '1451187580459-43490279c0fa',
  '5': '1531482615713-2afd69097998',
};

const getUnsplashUrl = (id: string): string => {
  const hash = PROJECT_IMAGES[id] ?? '1531482615713-2afd69097998';
  return `https://images.unsplash.com/photo-${hash}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800`;
};

const ProjetCard: React.FC<ProjetCardProps> = (props: Readonly<ProjetCardProps>) => {
  const { projet, detailLinkBase = '/projets' } = props;
  const slug = projet.slug || generateSlug(projet.titre);

  return (
    <Card
    >
      {/* Image */}
      <div className="relative aspect-video bg-gradient-to-br from-brand-600 to-brand-950">
        <img
          src={projet.image ? getImageUrl(projet.image) : getUnsplashUrl(projet.id)}
          alt={projet.titre}
          loading="lazy"
          className="h-full w-full object-cover opacity-80"
        />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
          <Chip
            label={projet.type}
            size="small"
          />

          <Chip
            label={projet.statut}
            size="small"
          />
        </div>

      </div>

      <CardContent className="p-6">
        {/* Meta */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-ink-500">
            <Calendar />
            {projet.annee}
          </div>

          <ViewDetailsButton
            to={`${detailLinkBase}/${slug}`}
            ariaLabel={`Voir le détail de ${projet.titre}`}
          />
        </div>

        <h3 className="mb-3 text-xl font-bold text-ink-900">{projet.titre}</h3>

        <p className="mb-4 line-clamp-3 text-ink-500 leading-6">{projet.description}</p>

        {projet.location && (
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-1.5 text-sm text-ink-500">
              <MapPin />
              <span>
                {projet.location.ville}, {projet.location.pays}
              </span>
            </div>
            <MapEmbed
              lat={projet.location.lat}
              lng={projet.location.lng}
              label={`${projet.location.ville}, ${projet.location.pays}`}
              adresse={projet.location.adresse}
              zoom="city"
              height={200}
            />
          </div>
        )}

        {/* Partenaires */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-900">
            <Users />
            Partenaires
          </div>
          <div className="flex flex-wrap gap-2">
            {projet.partenaires.map((partenaire) => (
              <Chip
                key={partenaire}
                label={partenaire}
                size="small"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjetCard;
