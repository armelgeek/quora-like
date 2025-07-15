'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { authClient } from '@/shared/lib/config/auth-client';
import { Button } from '@/shared/components/atoms/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/atoms/ui/form';
import { Input } from '@/shared/components/atoms/ui/input';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/atoms/ui/card';
import { RegisterPayload } from '../../config/auth.type';
import { RegisterFormSchema } from '../../config/auth.schema';

export const RegisterForm = () => {
  const router = useRouter();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterPayload>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (input: RegisterPayload) => {
    setIsLoading(true);

    const { data, error } = await authClient.signUp.email(
      {
        name: input.name,
        email: input.email,
        password: input.password,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          router.push('/login');
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error('Register failed.');
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Register your account</CardDescription>
        </CardHeader>
        <CardContent>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className={error && 'border-destructive'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className={error && 'border-destructive'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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

                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  Register
                </Button>
              </div>
            </form>
          </Form>
          <div className="flex items-center justify-center py-4 mt-2">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 underline">
              Already have an account ?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
