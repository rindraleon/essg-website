// src/components/ActualiteCard.tsx
import React from 'react';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import type { Actualite } from '../../types/actualite.types';
import CategoryChip from '../common/CategoryChip';
import { formatDate } from '../../utils/date.utils';
import { getImageUrl } from '../../utils/image.utils';

interface Props {
  actualite: Actualite;
}

const ActualiteCard: React.FC<Props> = ({ actualite }) => {
  const imageUrl = actualite.image
    ? getImageUrl(actualite.image)
    : 'https://images.unsplash.com/photo-1768117173988-5ebfdde4fdd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

  return (
    <div className="group rounded-2xl overflow-hidden border border-ink-100 bg-white shadow-card flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-ink-100">
        <img
          src={imageUrl}
          alt={actualite.titre}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-1">
        {/* Catégorie + Date */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <CategoryChip category={actualite.categorie} size="small" />
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <CalendarTodayRoundedIcon sx={{ fontSize: 12 }} />
            {formatDate(actualite.date)}
          </span>
        </div>

        {/* Titre */}
        <h3 className="text-base font-semibold text-ink-900 mb-2 line-clamp-2 leading-snug">
          {actualite.titre}
        </h3>

        {/* Résumé */}
        <p className="text-sm text-ink-500 line-clamp-3 flex-1 leading-6">{actualite.resume}</p>

        {/* Auteur */}
        {actualite.auteur && (
          <p className="text-xs text-ink-400 mt-2">
            Par <span className="font-medium">{actualite.auteur}</span>
          </p>
        )}

        {/* Bouton */}
        <Button
          component={RouterLink}
          to={`/actualites/${actualite.slug}`}
          variant="text"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            mt: 2,
            p: 0,
            minWidth: 'auto',
            color: '#2e6a5f',
            fontWeight: 600,
            textTransform: 'none',
            justifyContent: 'flex-start',
            '&:hover': {
              backgroundColor: 'transparent',
              color: '#27564e',
            },
          }}
        >
          Lire la suite
        </Button>
      </div>
    </div>
  );
};

export default ActualiteCard;
