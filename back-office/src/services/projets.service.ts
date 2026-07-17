import axiosConfig from '../config/axios.config';
import type { Projet, ProjetFormData } from '../types/projet.types';

const getAllProjets = async (): Promise<Projet[]> => {
  try {
    const response = await axiosConfig.get<{ data: Projet[] }>('/projects');
    // Backend returns paginated response: { data: [...], total, page, limit }
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching projets:', error);
    throw error;
  }
};

const getProjetById = async (id: number): Promise<Projet> => {
  try {
    const response = await axiosConfig.get<Projet>(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projet:', error);
    throw error;
  }
};

const createProjet = async (data: ProjetFormData): Promise<Projet> => {
  try {
    const response = await axiosConfig.post<Projet>('/projects', data);
    return response.data;
  } catch (error) {
    console.error('Error creating projet:', error);
    throw error;
  }
};

const updateProjet = async (id: number, data: ProjetFormData): Promise<Projet> => {
  try {
    const response = await axiosConfig.put<Projet>(`/projects/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating projet:', error);
    throw error;
  }
};

const deleteProjet = async (id: number): Promise<void> => {
  try {
    await axiosConfig.delete(`/projects/${id}`);
  } catch (error) {
    console.error('Error deleting projet:', error);
    throw error;
  }
};

const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosConfig.post<{ url: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Construire l'URL complète
    const baseUrl = axiosConfig.defaults.baseURL?.replace(/\/$/, '') || '';
    return response.data.url.startsWith('http') ? response.data.url : `${baseUrl}${response.data.url}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export { getAllProjets, getProjetById, createProjet, updateProjet, deleteProjet, uploadImage };
