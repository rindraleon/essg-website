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

export interface RessourceHumaineSectionProps {
  title?: string;
  description?: string;
  ressourcesHumaines?: RessourceHumaine[];
}
