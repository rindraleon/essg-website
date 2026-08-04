export interface RessourceHumaineItem {
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
  creeLe: Date;
  misAJourLe: Date;
}

export type RessourceHumaineFormData = Omit<
  RessourceHumaineItem,
  'id' | 'slug' | 'creeLe' | 'misAJourLe'
>;

export interface RessourceHumaineFilterOptions {
  poste: string;
  actif: string;
  search: string;
}
