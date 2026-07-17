import axiosConfig, { clearAuthToken } from "../config/axios.config";
import type { LoginRequest, LoginResponse, User } from "../types/auth.types";

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const request: LoginRequest = { email, password };
  const response = await axiosConfig.post<LoginResponse>("/auth/login", request);
  return response.data;
};

export const verifyToken = async (): Promise<User | null> => {
  try {
    const response = await axiosConfig.post<{ valid: boolean; user: { userId: number; email: string; role: string; prenom: string; nom: string; avatar?: string; creeLe?: string; misAJourLe?: string } }>("/auth/verify");
    if (response.data.valid && response.data.user) {
      const user: User = {
        id: response.data.user.userId,
        email: response.data.user.email,
        role: response.data.user.role as 'admin' | 'editeur' | 'lecteur',
        prenom: response.data.user.prenom,
        nom: response.data.user.nom,
        estActif: true,
        creeLe: response.data.user.creeLe || '',
        misAJourLe: response.data.user.misAJourLe || '',
        avatar: response.data.user.avatar,
      };
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

export const logout = async (): Promise<void> => {
  clearAuthToken();
};
