import type { Metadata } from 'next';

import { ForgotPasswordForm } from '@/features/auth/components/organisms/forgot-password-form';

export const metadata: Metadata = {
  title: 'Mot de passe oublié - Boiler',
  description: 'Réinitialisez votre mot de passe pour retrouver l&apos;accès à votre compte',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
