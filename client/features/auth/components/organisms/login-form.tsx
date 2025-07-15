'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button, LoadingButton } from '@/shared/components/atoms/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/atoms/ui/form';
import { Input } from '@/shared/components/atoms/ui/input';
import { cn } from '@/shared/lib/utils';
import useLogin from '../../hooks/useLogin';
import FormWrapper from '@/shared/components/molecules/form/FormWrapper';
import { ControlledTextInput } from '@/shared/components/molecules/form/ControlledTextInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/atoms/ui/card';
import Link from 'next/link';
import { LoginFormSchema } from '../../config/auth.schema';
import { LoginPayload } from '../../config/auth.type';

export const LoginForm = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { isLoading, handleSubmit } = useLogin();
  const form = useForm<LoginPayload>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <FormWrapper form={form} onSubmit={handleSubmit}>
            <div className="grid space-y-6">
              <ControlledTextInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Email"
              />


              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isShowPassword ? 'text' : 'password'}
                          {...field}
                          className={cn('pr-10', error && 'border-destructive')}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setIsShowPassword((prevState) => !prevState)}
                          aria-label={isShowPassword ? 'Hide password' : 'Show password'}
                        >
                          {isShowPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton
                type="submit"
                pending={isLoading}
              >
                Login
              </LoadingButton>
            </div>
          </FormWrapper>
          <div className="flex flex-col items-center space-y-4 text-sm">
            <Link href="/forgot-password" className="text-blue-600 mt-4 hover:text-blue-800 transition-colors duration-200 underline-offset-2 hover:underline">
              Forgot your password?
            </Link>
            <div className="w-full border-t border-gray-300"></div>
            <p className="text-gray-600">{"Don't have an account?"}</p>
            <Link href="/register" className="px-6 py-2 border border-gray-500 rounded-full hover:bg-green-50 transition-colors duration-200 font-semibold">
              Create an account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
