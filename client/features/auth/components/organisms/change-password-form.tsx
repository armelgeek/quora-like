"use client";

import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/atoms/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
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

export function ChangePassword() {
  const [_isOpen, setIsOpen] = useState(false);

  const form = useForm<UpdatePasswordPayload>({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
    resolver: zodResolver(updatePasswordSchema),
  });

  const handleChangePassword = async ({ current_password, new_password }: UpdatePasswordPayload) => {
    const response = await authClient.changePassword({
      currentPassword: current_password,
      newPassword: new_password,
      revokeOtherSessions: true,
    });
    if (response.error) {
      toast.error(response.error.message);
    } else {
      toast.success("Mot de passe modifié avec succès.");
      form.reset();
      setIsOpen(false);
    }
  };

  return (
    <Dialog
      open={_isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        if (isOpen) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="premium" className="font-semibold shadow-md">
          <Lock size={16} className="mr-2" /> Modifier le mot de passe
        </Button>
      </DialogTrigger>
      <DialogContent className="p-8 max-w-md w-full rounded-2xl border-0 bg-gradient-to-br from-white to-slate-50 shadow-xl">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-left text-xl font-bold text-primary">Modifier le mot de passe</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Pour la sécurité de votre compte, choisissez un mot de passe fort et unique.<br />
            <span className="text-xs text-slate-500">Astuce : Utilisez au moins 8 caractères, avec majuscules, chiffres et symboles.</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-6 mt-4"
            onSubmit={form.handleSubmit(handleChangePassword)}
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Mot de passe actuel</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Votre mot de passe actuel"
                      type="password"
                      autoComplete="current-password"
                      className="input-premium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nouveau mot de passe"
                      type="password"
                      autoComplete="new-password"
                      className="input-premium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Confirmer le nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirmez le nouveau mot de passe"
                      type="password"
                      autoComplete="new-password"
                      className="input-premium"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-3 px-5 rounded-lg font-semibold bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:scale-[1.01] transition-all duration-150"
              disabled={form.formState.isSubmitting}
              aria-label="Valider le changement de mot de passe"
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                  Enregistrement...
                </span>
              ) : (
                "Valider"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
