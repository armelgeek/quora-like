import { useState, useEffect, useCallback } from 'react';
import { authClient } from '@/shared/lib/config/auth-client';

interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string | null;
  isAnonymous?: boolean | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const authStateListeners: Array<(state: AuthState) => void> = [];
let currentAuthState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

const notifyAuthStateChange = (newState: AuthState) => {
  currentAuthState = newState;
  authStateListeners.forEach(listener => listener(newState));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: newState }));
  }
};

const fetchAuthState = async (): Promise<AuthState> => {
  try {
    const { data: session } = await authClient.getSession();
    return session?.user
      ? { user: session.user, isLoading: false, isAuthenticated: true }
      : { user: null, isLoading: false, isAuthenticated: false };
  } catch {
    return { user: null, isLoading: false, isAuthenticated: false };
  }
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(currentAuthState);

  const checkAuth = useCallback(async () => {
    const newState = await fetchAuthState();
    notifyAuthStateChange(newState);
  }, []);

  useEffect(() => {
    let mounted = true;
    const handleAuthStateChange = (newState: AuthState) => {
      if (mounted) setAuthState(newState);
    };
    authStateListeners.push(handleAuthStateChange);

    if (currentAuthState.isLoading) {
      checkAuth();
    } else {
      setAuthState(currentAuthState);
    }

    const interval = setInterval(checkAuth, 30000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('session') || e.key?.includes('auth')) {
        checkAuth();
      }
    };
    const handleFocus = () => checkAuth();

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('focus', handleFocus);
      window.addEventListener('authStateChanged', (e: any) => {
        if (e?.detail) setAuthState(e.detail);
      });
    }

    return () => {
      mounted = false;
      const index = authStateListeners.indexOf(handleAuthStateChange);
      if (index > -1) authStateListeners.splice(index, 1);
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('authStateChanged', () => {});
      }
    };
  }, [checkAuth]);

  const signOut = async () => {
    await authClient.signOut();
    const newState = { user: null, isLoading: false, isAuthenticated: false };
    notifyAuthStateChange(newState);
  };

  const refreshAuth = () => checkAuth();

  return {
    ...authState,
    signOut,
    refreshAuth,
  };
}

export const forceAuthStateRefresh = async () => {
  const newState = await fetchAuthState();
  notifyAuthStateChange(newState);
  return newState;
};
