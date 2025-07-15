import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authClient } from '@/shared/lib/config/auth-client';

type User = {
  name?: string;
  email?: string;
  image?: string | null;
  isAnonymous?: boolean | null;
  role?: string;
};

type Session = {
  user?: User;
} | null;

interface AuthContextType {
  session: Session;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const { data } = await authClient.getSession();
      setSession(data);
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setSession(null);
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      setSession(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  useEffect(() => {
    const initSession = async () => {
      setIsLoading(true);
      await refreshSession();
      setIsLoading(false);
    };

    initSession();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, refreshSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
