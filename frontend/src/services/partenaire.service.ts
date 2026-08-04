import type { PartenaireItem } from '../types/partenaire.types';

const API_BASE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';
const BASE_URL = `${API_BASE_URL.replace(/\/api\/?$/, '')}/partners`;

const partenaireService = {
  async findAll(): Promise<PartenaireItem[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Erreur lors du chargement des partenaires');
    const data = await res.json();
    return data.data || data;
  },

  async findAllPaginated(page: number = 1, limit: number = 100): Promise<PartenaireItem[]> {
    const res = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Erreur lors du chargement des partenaires');
    const response = await res.json();
    return response.data || [];
  },

  async findOne(id: number): Promise<PartenaireItem> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Partenaire non trouvé');
    return res.json();
  },

  async search(query: string): Promise<PartenaireItem[]> {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Erreur lors de la recherche');
    const data = await res.json();
    return data.data || data;
  },
};

export default partenaireService;
