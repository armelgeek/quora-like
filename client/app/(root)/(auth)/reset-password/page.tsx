import type { Metadata } from 'next';

import { ResetPasswordForm } from '@/features/auth/components/organisms/reset-password-form';

export const metadata: Metadata = {
  title: 'Nouveau mot de passe - Boiler',
  description: 'Définissez votre nouveau mot de passe pour finaliser la réinitialisation',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
