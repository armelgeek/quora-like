"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/atoms/ui/dialog";
import { Button } from '@/shared/components/atoms/ui/button';
import { Input } from '@/shared/components/atoms/ui/input';
import { authClient } from '@/shared/lib/config/auth-client';
import { updatePasswordSchema } from "../../config/update-password.schema";
import { UpdatePasswordPayload } from "../../config/update-password.type";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/atoms/ui/form";
import { cn } from "@/shared/lib/utils";

export function ChangePassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<UpdatePasswordPayload>({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
    resolver: zodResolver(updatePasswordSchema),
  });

  const handleChangePassword = async ({ current_password, new_password }: UpdatePasswordPayload) => {
    try {
      const response = await authClient.changePassword({
        currentPassword: current_password,
        newPassword: new_password,
        revokeOtherSessions: true,
      });
      
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success("Mot de passe modifié avec succès");
        form.reset();
        setIsOpen(false);
      }
    } catch {
      toast.error("Erreur lors du changement de mot de passe");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Modifier le mot de passe
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold text-center text-gray-900">
            Modifier le mot de passe
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Choisissez un mot de passe sécurisé avec au moins 8 caractères
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4 mt-6"
            onSubmit={form.handleSubmit(handleChangePassword)}
          >
            <FormField
              control={form.control}
              name="current_password"
              render={({ field, fieldState: { error } }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Mot de passe actuel
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Votre mot de passe actuel"
                        {...field}
                        className={cn(
                          "h-11 pr-10 border focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20",
                          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
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
              name="new_password"
              render={({ field, fieldState: { error } }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Nouveau mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Votre nouveau mot de passe"
                        {...field}
                        className={cn(
                          "h-11 pr-10 border focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20",
                          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
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
              name="confirm_new_password"
              render={({ field, fieldState: { error } }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Confirmer le nouveau mot de passe
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirmez votre nouveau mot de passe"
                        {...field}
                        className={cn(
                          "h-11 pr-10 border focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20",
                          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        )}
                        autoComplete="new-password"
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

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex-1 h-11 text-base font-semibold"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Modification...
                  </>
                ) : (
                  'Modifier'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
