export interface Formation {
  id: number;
  slug: string;
  domaine: string[];
  titre: string;
  niveau: 'Licence' | 'Master' | 'Doctorat';
  duree: string;
  description: string;
  objectifs: string[];
  debouches: string[];
  image: string;
  enVedette: boolean;
  creeLe?: string;
  misAJourLe?: string;
  credits?: number;
  responsable?: string;
  email?: string;
  conditions?: string[];
  competences?: string[];
  modules?: FormationModule[];
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type FormationModule = {
    semestre: string;
    cours: string[];
};

export type FormationItem = {
    id: number;
    titre: string;
    niveau: string;
    domaine: string[];
    duree: string;
    credits?: number;
    description: string;
    objectifs: string[];
    debouches: string[];
    modules?: FormationModule[];
    conditions?: string[];
    competences?: string[];
    responsable?: string;
    email?: string;
};

export type FormationCardProps = {
    formation: Formation;
    detailLinkBase?: string;
    applyLink?: string;
};

export type FormationDetailContentProps = {
    formation: Formation;
};

export type FormationsPageProps = {
    pageTitle?: string;
    pageSubtitle?: string;
    pageDescription?: string;
    formations?: Formation[];
};

export type FormationDetailPageProps = {
    formations?: Formation[];
};
