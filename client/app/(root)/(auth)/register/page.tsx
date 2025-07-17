import type { Metadata } from 'next';

import { RegisterForm } from '@/features/auth/components/organisms/register-form';

export const metadata: Metadata = {
  title: 'Inscription - Boiler',
  description: 'Créez votre compte Boiler et rejoignez notre communauté',
};

export default function RegisterPage() {
  return (
    <RegisterForm/>
  );
}
