import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPayload } from '../config/auth.type';
import { authClient } from '@/shared/lib/config/auth-client';
import { forceAuthStateRefresh } from './useAuth';

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (input: LoginPayload) => {
    setIsLoading(true);

    try {
      const { data } = await authClient.signIn.email(
        {
          email: input.email,
          password: input.password,
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: async () => {
            console.log('🎉 Login successful, refreshing auth state...');
            // Force la mise à jour de l'état d'authentification
            await forceAuthStateRefresh();
            console.log('✅ Auth state refreshed, redirecting...');
            router.push('/');
          },
          onError: () => {
            setIsLoading(false);
          },
        },
      );

      return data;
    } catch (e) {
      const error = e instanceof Error ? e.message : '';
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};

export default useLogin;
