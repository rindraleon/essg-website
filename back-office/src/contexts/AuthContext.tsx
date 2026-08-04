import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  login as loginService,
  verifyToken,
  logout as logoutService,
} from '../services/auth.service';
import { setAuthToken, clearAuthToken } from '../config/axios.config';
import type { User } from '../types/auth.types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  username: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const valid = await verifyToken();
        if (valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginService(email, password);
    setAuthToken(response.accessToken);

    // Récupérer les informations complètes de l'utilisateur
    try {
      const userData = await verifyToken();
      if (userData) {
        setUser(userData);
        localStorage.setItem('userRole', userData.role);
      }
    } catch (error) {
      console.error('Error fetching user data after login:', error);
    }

    setIsAuthenticated(true);
  };

  const logout = async () => {
    await logoutService();
    clearAuthToken();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('userRole');
  };

  const username = user?.email || '';

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
