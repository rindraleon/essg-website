export type FormationLevel = "Licence" | "Master" | "Doctorat";

export interface Formation {
  id: number;
  slug: string;
  domaine: string[];
  titre: string;
  niveau: FormationLevel;
  duree: string;
  description: string;
  objectifs: string[];
  debouches: string[];
  conditionsAcces: string;
  conditions?: string[];
  competences?: string[];
  modules?: any[];
  credits: number;
  responsable?: string;
  email?: string;
  programme: string[];
  image: string;
  enVedette: boolean;
  creeLe: Date;
  misAJourLe: Date;
}

export type FormationFormData = Omit<Formation, 'id' | 'creeLe' | 'misAJourLe'>;

export interface FormationFilterOptions {
  niveau: string;
  domaine: string;
  enVedette: string;
}


export interface FormationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormationFormData) => void;
  initialData?: Formation | null;
  mode: "create" | "edit";
}

export interface FormErrors {
  titre?: string;
  domaine?: string;
  niveau?: string;
  duree?: string;
  description?: string;
  credits?: string;
  slug?: string;
  responsable?: string;
  email?: string;
  objectifs?: string;
  debouches?: string;
}
