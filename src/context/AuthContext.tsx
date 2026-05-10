import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { SessionUser } from '../types';
import { authService, profileService } from '../services';

interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  becomeOrganizer: () => Promise<void>;
  updateProfile: (payload: { name?: string; email?: string }) => Promise<void>;
  updatePassword: (currentPassword: string, nextPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser()
      .then((session) => setUser(session))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const session = await authService.login(email, password);
    setUser(session);
  };

  const register = async (email: string, password: string, name: string) => {
    const session = await authService.register(email, password, name);
    setUser(session);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const becomeOrganizer = async () => {
    const session = await authService.becomeOrganizer();
    setUser(session);
  };

  const updateProfile = async (payload: { name?: string; email?: string }) => {
    const session = await profileService.updateProfile(payload);
    setUser(session);
  };

  const updatePassword = async (currentPassword: string, nextPassword: string) => {
    await profileService.updatePassword(currentPassword, nextPassword);
  };

  return (
      <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout, becomeOrganizer, updateProfile, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
