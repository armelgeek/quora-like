import type { Metadata } from 'next';

import { ForgotPasswordForm } from '@/features/auth/components/organisms/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your password to regain access to your account',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
