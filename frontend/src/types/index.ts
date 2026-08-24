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

export * from './common.types';
export * from './formations.types';
export * from './actualite.types';
export * from './projets.types';
export * from './partenaire.types';
export * from './contact.types';
export * from './faq.types';
export * from './admission.types';
export * from './ressource-humaine.types';
export * from './footer.types';
export * from './layout.types';
export * from './sectionone.types';
