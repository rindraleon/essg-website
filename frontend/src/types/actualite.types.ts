export interface Actualite {
  id: number;
  slug: string;
  titre: string;
  categorie: string;
  date: string;
  resume: string;
  contenu: string;
  auteur?: string;
  statut: boolean;
  image?: string;
  enVedette: boolean;
  creeLe: string;
  misAJourLe: string;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RecentActualitesSectionProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: string;
  recentActualites?: Actualite[];
}

export interface ActualitesPageProps {
  pageTitle?: string;
  pageSubtitle?: string;
  pageDescription?: string;
  actualites?: Actualite[];
}