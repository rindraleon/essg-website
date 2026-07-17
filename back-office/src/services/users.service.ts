import api from '../config/axios.config';
import type { User } from '../types/auth.types';

export interface UsersListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export const getAllUsers = async (page = 1, limit = 10): Promise<UsersListResponse> => {
  const response = await api.get('/users', {
    params: { page, limit },
  });
  return response.data;
};

export const searchUsers = async (query: string, page = 1, limit = 10): Promise<UsersListResponse> => {
  const response = await api.get('/users/search', {
    params: { q: query, page, limit },
  });
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

interface CreateUserData {
  email: string;
  motDePasse: string;
  prenom: string;
  nom: string;
  role?: 'admin' | 'editeur' | 'lecteur';
  estActif?: boolean;
  avatar?: string;
}

export const createUser = async (userData: CreateUserData): Promise<User> => {
  const response = await api.post('/users', userData);
  return response.data;
};

interface UpdateUserData {
  email?: string;
  motDePasse?: string;
  prenom?: string;
  nom?: string;
  role?: 'admin' | 'editeur' | 'lecteur';
  estActif?: boolean;
  avatar?: string;
}

export const updateUser = async (
  id: number,
  userData: UpdateUserData,
): Promise<User> => {
  // Remove undefined values
  const filteredData = Object.fromEntries(
    Object.entries(userData).filter(([_, v]) => v !== undefined)
  );
  const response = await api.put(`/users/${id}`, filteredData);
  return response.data;
};

export const uploadAvatar = async (id: number, file: File): Promise<User> => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await api.post(`/users/${id}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};