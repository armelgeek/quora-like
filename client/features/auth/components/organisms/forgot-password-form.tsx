"use client";

import Link from 'next/link';
import { ArrowLeft, Mail, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/atoms/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/atoms/ui/form";
import { Button } from "@/shared/components/atoms/ui/button";
import { useFormHandler } from "@/shared/hooks/use-form-handler";
import { cn } from '@/shared/lib/utils';
import useForgotPassword from '@/features/auth/hooks/useForgotPassword';
import { Input } from '@/shared/components/atoms/ui/input';
import { ForgotPasswordPayload } from "../../config/forgot-password.type";
import { forgotPasswordSchema } from "../../config/forgot-password.schema";

const defaultValues = {
  email: ""
}

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { handleForgotPassword } = useForgotPassword();

  const { form, handleSubmit, isSubmitting } = useFormHandler<ForgotPasswordPayload>({
    schema: forgotPasswordSchema,
    initialValues: defaultValues,
    onSubmit: handleForgotPassword,
    onSuccess: () => {

    },
    resetAfterSubmit: true,
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Mot de passe oublié
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Saisissez votre adresse email pour recevoir un lien de réinitialisation
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
                name="email"
                render={({ field, fieldState: { error } }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Adresse email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                        <Input
                          type="email"
                          placeholder="Votre adresse email"
                          {...field}
                          className={cn(
                            "h-11 pl-10 border focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20",
                            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          )}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-base font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Envoi du lien...
                  </>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </Button>
            </form>
          </Form>
          
          <div className="text-center pt-2">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
            >
              <ArrowLeft className="size-3" />
              Retour à la connexion
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
