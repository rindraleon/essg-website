import { apiClient } from '../api/client/http';
import type { Partenaire, PartenaireFormData } from '../types/partenaire.types';

interface PartnerPayload {
  id: number;
  nom: string;
  type?: string;
  dateDebut?: string;
  logo?: string;
  siteWeb?: string;
  contact?: string;
  description?: string;
  slug?: string;
}

const transformPartenaire = (data: PartnerPayload): Partenaire => ({
  id: data.id,
  nom: data.nom,
  type: (data.type as Partenaire['type']) || 'Autre',
  secteur: '',
  dateDebut: data.dateDebut ? new Date(data.dateDebut).toISOString().split('T')[0] : '',
  description: data.description || '',
  logo: data.logo || '',
  siteWeb: data.siteWeb || '',
  contact: data.contact || '',
  creeLe: new Date(),
  misAJourLe: new Date(),
});

const getAllPartenaires = async (): Promise<Partenaire[]> => {
  const result = await apiClient.getList<PartnerPayload>('/partners', { page: 1, limit: 100 });
  return result.data.map(transformPartenaire);
};

const getPartenaireById = async (id: number): Promise<Partenaire> => {
  const data = await apiClient.get<PartnerPayload>(`/partners/${id}`);
  return transformPartenaire(data);
};

const createPartenaire = async (data: PartenaireFormData | FormData): Promise<Partenaire> => {
  const created = await apiClient.post<PartnerPayload>('/partners', data);
  return transformPartenaire(created);
};

const updatePartenaire = async (
  id: number,
  data: PartenaireFormData | FormData,
): Promise<Partenaire> => {
  const updated = await apiClient.put<PartnerPayload>(`/partners/${id}`, data);
  return transformPartenaire(updated);
};

const deletePartenaire = async (id: number): Promise<void> => {
  await apiClient.delete(`/partners/${id}`);
};

export {
  getAllPartenaires,
  getPartenaireById,
  createPartenaire,
  updatePartenaire,
  deletePartenaire,
};
