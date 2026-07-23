import axiosConfig from "../config/axios.config";

export const getAllAdmissions = async () => {
  const response = await axiosConfig.get("/admissions");
  return response.data;
};

export const getAdmissionById = async (id: number) => {
  const response = await axiosConfig.get(`/admissions/${id}`);
  return response.data;
};

export const updateAdmissionStatus = async (id: number, statut: string, commentaire?: string) => {
  const response = await axiosConfig.patch(`/admissions/${id}/status`, { statut, commentaire });
  return response.data;
};

export const deleteAdmission = async (id: number) => {
  const response = await axiosConfig.delete(`/admissions/${id}`);
  return response.data;
};

export const getRecentAdmissions = async (limit: number = 4) => {
  const response = await axiosConfig.get(`/admissions?limit=${limit}&sortBy=creeLe&sortOrder=DESC`);
  return response.data;
};
