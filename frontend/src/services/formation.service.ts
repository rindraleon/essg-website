import type { Formation, PaginationResponse } from '../types/formations.types';

const API_BASE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';
const BASE_URL = `${API_BASE_URL.replace(/\/api\/?$/, '')}/formations`;

const formationService = {
  async findAll(page = 1, limit = 10): Promise<PaginationResponse<Formation>> {
    const res = await fetch(`${BASE_URL}?page=${Number(page)}&limit=${Number(limit)}`);
    if (!res.ok) throw new Error('Erreur lors du chargement des formations');
    return res.json();
  },

  async findOne(id: number): Promise<Formation> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Formation non trouvée');
    return res.json();
  },

  async findBySlug(slug: string): Promise<Formation> {
    const res = await fetch(`${BASE_URL}/slug/${slug}`);
    if (!res.ok) throw new Error('Formation non trouvée');
    return res.json();
  },

  async search(query: string, page = 1, limit = 10): Promise<PaginationResponse<Formation>> {
    const res = await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(query)}&page=${Number(page)}&limit=${Number(limit)}`
    );
    if (!res.ok) throw new Error('Erreur lors de la recherche');
    return res.json();
  },

  async findFeatured(limit = 6): Promise<Formation[]> {
    const res = await fetch(`${BASE_URL}?page=1&limit=${Number(limit)}&enVedette=true`);
    if (!res.ok) throw new Error('Erreur lors du chargement des formations vedettes');
    const data: PaginationResponse<Formation> = await res.json();
    return data.data;
  },
};

export default formationService;