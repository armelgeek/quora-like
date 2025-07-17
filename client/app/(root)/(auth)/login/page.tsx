import type { Metadata } from 'next';

import { LoginForm } from '@/features/auth/components/organisms/login-form';

export const metadata: Metadata = {
  title: 'Connexion - Boiler',
  description: 'Connectez-vous à votre compte Boiler pour accéder à votre espace personnel',
};

export default function LoginPage() {
  return (
    <LoginForm/>
  );
}
