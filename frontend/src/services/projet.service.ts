import type { ProjetItem } from '../types/projets.types';
import { generateSlug } from '../utils/slug.utils';

type ApiProjet = Omit<ProjetItem, 'id' | 'annee' | 'location' | 'partenaires'> & {
  id: number | string;
  date?: string;
  latitude?: number | string;
  longitude?: number | string;
  ville?: string;
  pays?: string;
  adresse?: string;
  partenaires?: Array<string | { nom: string }>;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const BASE_URL = `${API_BASE_URL.replace(/\/$/, '')}/projects`;

const transformProjet = (projet: ApiProjet): ProjetItem => ({
  id: String(projet.id),
  titre: projet.titre,
  slug: projet.slug || generateSlug(projet.titre),
  type: projet.type,
  statut: projet.statut || 'En cours',
  annee: new Date(projet.date ?? '').getFullYear().toString(),
  description: projet.description,
  partenaires:
    projet.partenaires?.map((partenaire) =>
      typeof partenaire === 'string' ? partenaire : partenaire.nom
    ) || [],
  image: projet.image,
  budget: projet.budget,
  objectifs: projet.objectifs,
  sourceDonnees: projet.sourceDonnees,
  galerie: projet.galerie,
  location:
    projet.latitude && projet.longitude
      ? {
          lat: Number.parseFloat(String(projet.latitude)),
          lng: Number.parseFloat(String(projet.longitude)),
          ville: projet.ville || '',
          pays: projet.pays || '',
          adresse: projet.adresse,
        }
      : undefined,
});

const projetService = {
  async findAll(): Promise<ProjetItem[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Erreur lors du chargement des projets');
    const data = await res.json();
    const projets = data.data || data;
    return Array.isArray(projets) ? projets.map(transformProjet) : [];
  },

  async findOne(id: number): Promise<ProjetItem> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Projet non trouvé');
    const data = await res.json();
    return transformProjet(data.data || data);
  },

  async findBySlug(slug: string): Promise<ProjetItem> {
    const res = await fetch(`${BASE_URL}/slug/${slug}`);
    if (!res.ok) throw new Error('Projet non trouvé');
    const data = await res.json();
    return transformProjet(data.data || data);
  },

  async search(query: string): Promise<ProjetItem[]> {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Erreur lors de la recherche');
    const data = await res.json();
    const projets = data.data || data;
    return Array.isArray(projets) ? projets.map(transformProjet) : [];
  },
};

export default projetService;
