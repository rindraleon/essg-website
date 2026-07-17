export interface Settings {
  id?: number;
  schoolName: string;
  fullName: string;
  tagline: string;
  city: string;
  country: string;
  coordinates: [number, number];
  address: string;
  phone: string;
  email: string;
  founded: number;
  students: number;
  teachers: number;
  researchLabs: number;
  partnerCount: number;
  lang: string;
}

export type StatItem = {
    icon: string;
    value: string;
    label: string;
};

export type FormationItem = {
    id: number;
    titre: string;
    niveau: string;
    domaine: string[];
    duree: string;
    description: string;
    objectifs: string[];
    debouches: string[];
};

export type FilterOption = {
    value: string;
    label: string;
};

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
  modules?: any[];
}

export type FormationsPageProps = {
    pageTitle?: string;
    pageSubtitle?: string;
    pageDescription?: string;
    ctaTitle?: string;
    ctaDescription?: string;
    ctaLabel?: string;
    ctaLink?: string;
    stats?: StatItem[];
    formations?: FormationItem[];
    niveaux?: FilterOption[];
    domaines?: FilterOption[];
};

export type FeaturedFormationsSectionProps = {
    title?: string;
    description?: string;
    ctaLabel?: string;
    ctaLink?: string;
    featuredFormations?: Formation[];
};

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  image: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
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

export interface Project {
  id: number;
  title: string;
  slug?: string;
  type: 'International' | 'Service public' | 'Recherche' | 'Partenariat';
  date: string;
  description: string;
  partners: string[];
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export type FeaturedProjetItem = {
    id: string;
    titre: string;
    statut: string;
    type: string;
    annee: string;
    description: string;
    partenaires: string[];
    image?: string;
    budget?: string;
    objectifs?: string[];
    location?: {
        lat: number;
        lng: number;
        ville?: string;
        pays?: string;
        adresse?: string;
    };
};

export type FeaturedProjetsSectionProps = {
    title?: string;
    description?: string;
    ctaLabel?: string;
    ctaLink?: string;
    featuredProjets?: FeaturedProjetItem[];
};

export interface Partner {
  id: number;
  name: string;
  type: 'Institution' | 'Entreprise' | 'Université' | 'Organisation internationale';
  description: string;
  url: string;
  logo: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type PartenairesSectionProps = {
    title?: string;
    description?: string;
    ctaLabel?: string;
    ctaLink?: string;
    maxItems?: number;
    partenaires?: import("./partenaire.types").PartenaireItem[];
};

export type PartenaireTypeOption = {
    value: string;
    label: string;
};

export type PartenaireStat = {
    value: string;
    label: string;
};

export type PartenairesPageProps = {
    pageTitle?: string;
    pageSubtitle?: string;
    pageDescription?: string;
    ctaTitle?: string;
    ctaDescription?: string;
    ctaLabel?: string;
    ctaLink?: string;
    stats?: PartenaireStat[];
    types?: PartenaireTypeOption[];
    partenaires?: import("./partenaire.types").PartenaireItem[];
};

export type LocalisationSectionProps = {
    title?: string;
    description?: string;
    addressLabel?: string;
    address?: string;
    contactLabel?: string;
    phone?: string;
    email?: string;
    ctaLabel?: string;
    ctaLink?: string;
    mapTitle?: string;
    latitude?: number;
    longitude?: number;
};

export type AdmissionCtaSectionProps = {
    title?: string;
    description?: string;
    primaryButtonLabel?: string;
    primaryButtonLink?: string;
    secondaryButtonLabel?: string;
    secondaryButtonLink?: string;
};

export interface ContactMessage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroSectionProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryButton?: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
  };
}

export type CertificationItem = {
    nom: string;
    annee: string;
};

export type CertificationsSectionProps = {
    title?: string;
    description?: string;
    certifications?: CertificationItem[];
};


