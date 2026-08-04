import axiosConfig from '../config/axios.config';
import type { RessourceHumaineItem } from '../types/ressource-humaine.types';

const getAllRessourcesHumaines = async (): Promise<RessourceHumaineItem[]> => {
  try {
    const response = await axiosConfig.get<{ data: RessourceHumaineItem[] }>(
      '/ressources-humaines'
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching ressources humaines:', error);
    throw error;
  }
};

const getRessourceHumaineById = async (id: string): Promise<RessourceHumaineItem> => {
  try {
    const response = await axiosConfig.get<RessourceHumaineItem>(`/ressources-humaines/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ressource humaine:', error);
    throw error;
  }
};

const createRessourceHumaine = async (
  data: Partial<RessourceHumaineItem>
): Promise<RessourceHumaineItem> => {
  try {
    const response = await axiosConfig.post<RessourceHumaineItem>('/ressources-humaines', data);
    return response.data;
  } catch (error) {
    console.error('Error creating ressource humaine:', error);
    throw error;
  }
};

const updateRessourceHumaine = async (
  id: string,
  data: Partial<RessourceHumaineItem>
): Promise<RessourceHumaineItem> => {
  try {
    const response = await axiosConfig.put<RessourceHumaineItem>(
      `/ressources-humaines/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating ressource humaine:', error);
    throw error;
  }
};

const deleteRessourceHumaine = async (id: string): Promise<void> => {
  try {
    await axiosConfig.delete(`/ressources-humaines/${id}`);
  } catch (error) {
    console.error('Error deleting ressource humaine:', error);
    throw error;
  }
};

export {
  getAllRessourcesHumaines,
  getRessourceHumaineById,
  createRessourceHumaine,
  updateRessourceHumaine,
  deleteRessourceHumaine,
};
