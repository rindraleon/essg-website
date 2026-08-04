export const PROJET_TYPES = [
  { value: 'International', label: 'International' },
  { value: 'Service public', label: 'Service public' },
  { value: 'Recherche', label: 'Recherche' },
  { value: 'Partenariat', label: 'Partenariat' },
] as const;

export const PROJET_TYPE_COLORS: Record<
  string,
  'primary' | 'secondary' | 'success' | 'warning' | 'info'
> = {
  International: 'primary',
  'Service public': 'secondary',
  Recherche: 'success',
  Partenariat: 'warning',
};

export const DEFAULT_FORM_DATA = {
  titre: '',
  type: 'Recherche' as const,
  date: new Date().toISOString().split('T')[0],
  description: '',
  partenaires: [] as string[],
  image: '/images/hero-campus.jpg',
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  ville: '',
  pays: '',
  adresse: '',
};

export const INITIAL_FILTERS = {
  type: '',
  dateDebut: '',
  dateFin: '',
};
