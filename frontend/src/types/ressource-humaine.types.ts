export interface RessourceHumaine {
  id: number;
  slug: string;
  nom: string;
  prenom: string;
  poste: string;
  description?: string;
  email?: string;
  telephone?: string;
  photo?: string;
  actif: boolean;
  ordre: number;
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

export interface RessourceHumaineSectionProps {
  title?: string;
  description?: string;
  ressourcesHumaines?: RessourceHumaine[];
}