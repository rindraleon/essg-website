import axiosConfig from "../config/axios.config";

export interface Message {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
  lu: boolean;
  creeLe: string;
  misAJourLe: string;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const getAllMessages = async (query: PaginationQuery = {}): Promise<PaginationResponse<Message>> => {
  const params = new URLSearchParams();
  if (query.page) params.append('page', String(query.page));
  if (query.limit) params.append('limit', String(query.limit));
  if (query.sortBy) params.append('sortBy', query.sortBy);
  if (query.sortOrder) params.append('sortOrder', query.sortOrder);

  const response = await axiosConfig.get(`/messages?${params.toString()}`);
  return response.data;
};

export const searchMessages = async (q: string, query: PaginationQuery = {}): Promise<PaginationResponse<Message>> => {
  const params = new URLSearchParams();
  params.append('q', q);
  if (query.page) params.append('page', String(query.page));
  if (query.limit) params.append('limit', String(query.limit));
  if (query.sortBy) params.append('sortBy', query.sortBy);
  if (query.sortOrder) params.append('sortOrder', query.sortOrder);

  const response = await axiosConfig.get(`/messages/search?${params.toString()}`);
  return response.data;
};

export const getMessageById = async (id: number): Promise<Message> => {
  const response = await axiosConfig.get(`/messages/${id}`);
  return response.data;
};

export const updateMessage = async (id: number, lu: boolean): Promise<Message> => {
  const response = await axiosConfig.put(`/messages/${id}`, { lu });
  return response.data;
};

export const deleteMessage = async (id: number): Promise<void> => {
  await axiosConfig.delete(`/messages/${id}`);
};