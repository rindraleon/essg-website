import { PROJET_TYPE_COLORS } from '../constants/projet.constants';
import type { Projet } from '../types/projet.types';

export const getTypeColor = (
  type: string
): 'primary' | 'secondary' | 'success' | 'warning' | 'info' => {
  return PROJET_TYPE_COLORS[type] || 'info';
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};

export const formatDateLong = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const filterBySearchTerm = (projets: Projet[], searchTerm: string): Projet[] => {
  if (!searchTerm.trim()) return projets;

  const term = searchTerm.toLowerCase();
  return projets.filter(
    (projet) =>
      projet.titre.toLowerCase().includes(term) ||
      projet.description.toLowerCase().includes(term) ||
      projet.partenaires.some((p) => p.toLowerCase().includes(term))
  );
};
