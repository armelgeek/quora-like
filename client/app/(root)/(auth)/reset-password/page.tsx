import type { Metadata } from 'next';

import { ResetPasswordForm } from '@/features/auth/components/organisms/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Enter your new password to complete the reset process',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
