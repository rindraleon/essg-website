import type { Actualite } from '../types/actualite.types';
import type { PaginationResponse } from '../types/formations.types';

const API_BASE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';
const BASE_URL = `${API_BASE_URL.replace(/\/api\/?$/, '')}/news`;

const actualiteService = {
  async findAll(page = 1, limit = 10, signal?: AbortSignal): Promise<PaginationResponse<Actualite>> {
    const res = await fetch(
      `${BASE_URL}?page=${Number(page)}&limit=${Number(limit)}&sortBy=date&sortOrder=DESC`,
      { signal }
    );
    if (!res.ok) throw new Error('Erreur lors du chargement des actualités');
    return res.json();
  },

  async findOne(id: number, signal?: AbortSignal): Promise<Actualite> {
    const res = await fetch(`${BASE_URL}/${id}`, { signal });
    if (!res.ok) throw new Error('Actualité non trouvée');
    return res.json();
  },

  async findBySlug(slug: string, signal?: AbortSignal): Promise<Actualite> {
    const res = await fetch(`${BASE_URL}/slug/${slug}`, { signal });
    if (!res.ok) throw new Error('Actualité non trouvée');
    return res.json();
  },

  async search(query: string, page = 1, limit = 10, signal?: AbortSignal): Promise<PaginationResponse<Actualite>> {
    const res = await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(query)}&page=${Number(page)}&limit=${Number(limit)}`,
      { signal }
    );
    if (!res.ok) throw new Error('Erreur lors de la recherche');
    return res.json();
  },

  async findRecent(limit = 3, signal?: AbortSignal): Promise<Actualite[]> {
    const res = await fetch(
      `${BASE_URL}?page=1&limit=${Number(limit)}&sortBy=date&sortOrder=DESC`,
      { signal }
    );
    if (!res.ok) throw new Error('Erreur lors du chargement des actualités récentes');
    const data: PaginationResponse<Actualite> = await res.json();
    return data.data;
  },
};

export default actualiteService;