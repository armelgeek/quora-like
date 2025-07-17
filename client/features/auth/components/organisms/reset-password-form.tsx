"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/shared/components/atoms/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/atoms/ui/form";
import { Input } from "@/shared/components/atoms/ui/input";
import { useFormHandler } from '@/shared/hooks/use-form-handler';
import useResetPassword from '@/features/auth/hooks/useResetPassword';
import { cn } from '@/shared/lib/utils';
import { resetPasswordSchema } from "../../config/reset-password.schema";
import { ResetPasswordPayload } from "../../config/reset-password.type";
import { Eye, EyeOff, Loader2, Lock, AlertTriangle } from 'lucide-react';

function ResetPasswordFormNoSuspense({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const searchParams = useSearchParams();
  const invalid_token_error = searchParams.get("error");
  const token = searchParams.get("token");
  const { handleResetPassword, pending } = useResetPassword(token);
  const { form, handleSubmit } = useFormHandler<ResetPasswordPayload>({
    schema: resetPasswordSchema,
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: handleResetPassword,
    onSuccess: () => { },
    resetAfterSubmit: true,
  });

  if (invalid_token_error === "INVALID_TOKEN" || !token) {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Lien invalide
          </CardTitle>
          <CardDescription className="text-gray-600">
            Ce lien de réinitialisation est invalide ou a expiré
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/forgot-password">
            <Button variant="outline" className="w-full">
              Demander un nouveau lien
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Nouveau mot de passe
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Choisissez un mot de passe sécurisé pour votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Nouveau mot de passe
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Votre nouveau mot de passe"
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
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
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
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Confirmer le mot de passe
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirmez votre mot de passe"
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
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
              
              <Button
                type="submit"
                disabled={pending}
                className="w-full h-11 text-base font-semibold"
              >
                {pending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  'Mettre à jour le mot de passe'
                )}
              </Button>
            </form>
          </Form>
          
          <div className="text-center pt-2">
            <Link 
              href="/login" 
              className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
            >
              Retour à la connexion
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <Suspense>
      <ResetPasswordFormNoSuspense className={className} {...props} />
    </Suspense>
  );
}
