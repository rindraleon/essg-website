import type { RessourceHumaine, PaginationResponse } from '../types/ressource-humaine.types';

const API_BASE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';
const BASE_URL = `${API_BASE_URL.replace(/\/api\/?$/, '')}/ressources-humaines`;

const ressourceHumaineService = {
  async findAll(page = 1, limit = 100, signal?: AbortSignal): Promise<PaginationResponse<RessourceHumaine>> {
    const res = await fetch(
      `${BASE_URL}?page=${Number(page)}&limit=${Number(limit)}&sortBy=ordre&sortOrder=ASC`,
      { signal }
    );
    if (!res.ok) throw new Error('Erreur lors du chargement des ressources humaines');
    return res.json();
  },

  async findOne(id: number, signal?: AbortSignal): Promise<RessourceHumaine> {
    const res = await fetch(`${BASE_URL}/${id}`, { signal });
    if (!res.ok) throw new Error('Ressource humaine non trouvée');
    return res.json();
  },

  async findBySlug(slug: string, signal?: AbortSignal): Promise<RessourceHumaine> {
    const res = await fetch(`${BASE_URL}/slug/${slug}`, { signal });
    if (!res.ok) throw new Error('Ressource humaine non trouvée');
    return res.json();
  },

  async search(query: string, page = 1, limit = 10, signal?: AbortSignal): Promise<PaginationResponse<RessourceHumaine>> {
    const res = await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(query)}&page=${Number(page)}&limit=${Number(limit)}`,
      { signal }
    );
    if (!res.ok) throw new Error('Erreur lors de la recherche');
    return res.json();
  },

  async findActive(signal?: AbortSignal): Promise<RessourceHumaine[]> {
    const res = await fetch(`${BASE_URL}?page=1&limit=100&actif=true&sortBy=ordre&sortOrder=ASC`, { signal });
    if (!res.ok) throw new Error('Erreur lors du chargement des ressources humaines actives');
    const data: PaginationResponse<RessourceHumaine> = await res.json();
    return data.data;
  },
};

export default ressourceHumaineService;