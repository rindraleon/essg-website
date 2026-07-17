import type { ProjetItem } from '../types/projets.types';

const API_BASE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';
const BASE_URL = `${API_BASE_URL.replace(/\/api\/?$/, '')}/projects`;

const projetService = {
  async findAll(): Promise<ProjetItem[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Erreur lors du chargement des projets');
    const data = await res.json();
    return data.data || data;
  },

  async findOne(id: number): Promise<ProjetItem> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Projet non trouvé');
    return res.json();
  },

  async findBySlug(slug: string): Promise<ProjetItem> {
    const res = await fetch(`${BASE_URL}/slug/${slug}`);
    if (!res.ok) throw new Error('Projet non trouvé');
    const data = await res.json();
    return data.data || data;
  },

  async search(query: string): Promise<ProjetItem[]> {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Erreur lors de la recherche');
    const data = await res.json();
    return data.data || data;
  },
};

export default projetService;