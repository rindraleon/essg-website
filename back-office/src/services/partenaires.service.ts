import axiosConfig from '../config/axios.config';
import type { Partenaire, PartenaireFormData } from '../types/partenaire.types';

const transformPartenaire = (data: any): Partenaire => {
  return {
    ...data,
    dateDebut: data.dateDebut ? new Date(data.dateDebut).toISOString().split('T')[0] : '',
    logo: data.logo || '',
    siteWeb: data.siteWeb || '',
    contact: data.contact || '',
  };
};

const getAllPartenaires = async (): Promise<Partenaire[]> => {
  try {
    const response = await axiosConfig.get<{ data: any[] }>('/partners');
    const partenaires = response.data.data || [];
    return partenaires.map(transformPartenaire);
  } catch (error) {
    console.error('Error fetching partenaires:', error);
    throw error;
  }
};

const getPartenaireById = async (id: number): Promise<Partenaire> => {
  try {
    const response = await axiosConfig.get<any>(`/partners/${id}`);
    return transformPartenaire(response.data);
  } catch (error) {
    console.error('Error fetching partenaire:', error);
    throw error;
  }
};

const createPartenaire = async (data: PartenaireFormData | FormData): Promise<Partenaire> => {
  try {
    const isFormData = data instanceof FormData;
    const response = await axiosConfig.post<any>('/partners', data, {
      headers: isFormData ? {
        'Content-Type': 'multipart/form-data',
      } : undefined,
    });
    return transformPartenaire(response.data);
  } catch (error) {
    console.error('Error creating partenaire:', error);
    throw error;
  }
};

const updatePartenaire = async (id: number, data: PartenaireFormData | FormData): Promise<Partenaire> => {
  try {
    const isFormData = data instanceof FormData;
    const response = await axiosConfig.put<any>(`/partners/${id}`, data, {
      headers: isFormData ? {
        'Content-Type': 'multipart/form-data',
      } : undefined,
    });
    return transformPartenaire(response.data);
  } catch (error) {
    console.error('Error updating partenaire:', error);
    throw error;
  }
};

const deletePartenaire = async (id: number): Promise<void> => {
  try {
    await axiosConfig.delete(`/partners/${id}`);
  } catch (error) {
    console.error('Error deleting partenaire:', error);
    throw error;
  }
};

export { getAllPartenaires, getPartenaireById, createPartenaire, updatePartenaire, deletePartenaire };
