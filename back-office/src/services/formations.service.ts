import axiosConfig from '../config/axios.config';
import type { Formation, FormationFormData } from '../types/formation.types';

const getAllFormations = async (): Promise<Formation[]> => {
  try {
    const response = await axiosConfig.get<{ data: Formation[] }>('/formations');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching formations:', error);
    throw error;
  }
};

const getFormationById = async (id: number): Promise<Formation> => {
  try {
    const response = await axiosConfig.get<Formation>(`/formations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching formation:', error);
    throw error;
  }
};

const searchFormations = async (query: string): Promise<Formation[]> => {
  try {
    const response = await axiosConfig.get<{ data: Formation[] }>('/formations/search', {
      params: { q: query },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching formations:', error);
    throw error;
  }
};

const createFormation = async (data: FormationFormData): Promise<Formation> => {
  try {
    const response = await axiosConfig.post<Formation>('/formations', data);
    return response.data;
  } catch (error) {
    console.error('Error creating formation:', error);
    throw error;
  }
};

const updateFormation = async (id: number, data: Partial<FormationFormData>): Promise<Formation> => {
  try {
    const response = await axiosConfig.put<Formation>(`/formations/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating formation:', error);
    throw error;
  }
};

const deleteFormation = async (id: number): Promise<void> => {
  try {
    await axiosConfig.delete(`/formations/${id}`);
  } catch (error) {
    console.error('Error deleting formation:', error);
    throw error;
  }
};

export { getAllFormations, getFormationById, searchFormations, createFormation, updateFormation, deleteFormation };