import axiosConfig from '../config/axios.config';
import type { ActualiteItem } from '../types/actualite.types';

const getAllActualites = async (): Promise<ActualiteItem[]> => {
  try {
    const response = await axiosConfig.get<{ data: ActualiteItem[] }>('/news');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching actualites:', error);
    throw error;
  }
};

const getActualiteById = async (id: string): Promise<ActualiteItem> => {
  try {
    const response = await axiosConfig.get<ActualiteItem>(`/news/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching actualite:', error);
    throw error;
  }
};

const createActualite = async (data: Partial<ActualiteItem>): Promise<ActualiteItem> => {
  try {
    // Convertir le statut string en boolean pour le backend
    const backendData = {
      ...data,
      statut: data.statut === 'publie',
    };
    const response = await axiosConfig.post<ActualiteItem>('/news', backendData);
    return response.data;
  } catch (error) {
    console.error('Error creating actualite:', error);
    throw error;
  }
};

const updateActualite = async (id: string, data: Partial<ActualiteItem>): Promise<ActualiteItem> => {
  try {
    // Convertir le statut string en boolean pour le backend
    const backendData = {
      ...data,
      statut: data.statut === 'publie',
    };
    const response = await axiosConfig.put<ActualiteItem>(`/news/${id}`, backendData);
    return response.data;
  } catch (error) {
    console.error('Error updating actualite:', error);
    throw error;
  }
};

const deleteActualite = async (id: string): Promise<void> => {
  try {
    await axiosConfig.delete(`/news/${id}`);
  } catch (error) {
    console.error('Error deleting actualite:', error);
    throw error;
  }
};

export { getAllActualites, getActualiteById, createActualite, updateActualite, deleteActualite };