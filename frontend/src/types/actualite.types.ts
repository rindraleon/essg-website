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

export interface ActualitesPageProps {
  pageTitle?: string;
  pageSubtitle?: string;
  pageDescription?: string;
  actualites?: Actualite[];
}

export type ActualiteItem = {
  id: string;
  titre: string;
  categorie: string;
  date: string;
  resume: string;
};

export type RecentActualitesSectionProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: string;
  recentActualites?: ActualiteItem[];
};
