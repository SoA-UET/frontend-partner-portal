import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, PartnerEmployee } from '@/types/auth.types';
import authService from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<PartnerEmployee | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = authService.getToken();
      const storedUser = authService.getCurrentUser();
      
      if (storedToken && storedUser) {
        setIsAuthenticated(true);
        setToken(storedToken);
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await authService.login(username, password);
      setIsAuthenticated(true);
      setToken(response.access_token);
      setUser(response.partner_employee);
    } catch (error) {
      setIsAuthenticated(false);
      setToken(null);
      setUser(null);
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
