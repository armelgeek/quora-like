'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import useLogin from '../../hooks/useLogin';
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
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center text-gray-900">Connexion</CardTitle>
        <CardDescription className="text-center text-gray-600">
          Connectez-vous à votre compte pour continuer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-semibold text-gray-700">Adresse email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Votre adresse email"
                      {...field}
                      className={cn(
                        "h-11 border focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20",
                        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-semibold text-gray-700">Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isShowPassword ? 'text' : 'password'}
                        placeholder="Votre mot de passe"
                        {...field}
                        className={cn(
                          "h-11 pr-10 border focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20",
                          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-2"
                        onClick={() => setIsShowPassword((prevState) => !prevState)}
                        aria-label={isShowPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {isShowPassword ? (
                          <Eye className="size-4 text-gray-500" />
                        ) : (
                          <EyeOff className="size-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="text-right">
              <Link 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-base font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
        </Form>
        
        <div className="text-center pt-2">
          <Link 
            href="/register" 
            className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
          >
            Pas encore de compte ? S&apos;inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
