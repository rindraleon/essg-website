import React from 'react';
import Chip from '@mui/material/Chip';
import type { SxProps } from '@mui/material';

interface CategoryChipProps {
  category: string;
  size?: 'small' | 'medium';
  sx?: SxProps;
}

/**
 * Couleurs de catégories harmonisées avec la charte ESSG :
 * tons doux en fond, teintes soutenues en texte, lisibles (WCAG AA).
 */
const categoryColors: Record<string, { backgroundColor: string; color: string }> = {
  Événement: { backgroundColor: '#eef4df', color: '#4f6834' },
  Partenariat: { backgroundColor: '#fef3c7', color: '#92400e' },
  Recherche: { backgroundColor: '#d9ece7', color: '#27564e' },
  'Vie Étudiante': { backgroundColor: '#fce7f3', color: '#9d174d' },
};

const CategoryChip: React.FC<CategoryChipProps> = ({ category, size = 'small', sx }) => {
  const colors = categoryColors[category] || { backgroundColor: '#eef2ff', color: '#4338ca' };

  return (
    <Chip
      label={category}
      size={size}
      sx={{
        backgroundColor: colors.backgroundColor,
        color: colors.color,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.7rem' : '0.8rem',
        ...sx,
      }}
    />
  );
};

export default CategoryChip;
