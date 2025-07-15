"use client";

import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/atoms/ui/dialog";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { authClient } from '@/shared/lib/config/auth-client';
import { Button } from '@/shared/components/atoms/ui/button';
import { Label } from '@/shared/components/atoms/ui/label';
import { Input } from '@/shared/components/atoms/ui/input';
import { Alert, AlertDescription } from '@/shared/components/atoms/ui/alert';
import { useRouter } from 'next/navigation';

type Props = { className?: string };

export function DeleteAccount({ className }: Props) {
  const [_isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, reset, formState } = useForm({
    defaultValues: { password: "", verify: "" },
  });

  const handleAccountDelete = async ({ password }: { password: string }) => {
    try {
      const response = await authClient.deleteUser({ password });
      if (response.data?.success) {
        toast.success("Votre compte a été supprimé avec succès");
        reset();
        setIsOpen(false);
        // Redirection vers la page d'accueil après suppression
        router.push('/');
      } else {
        toast.error(response.error?.message || "Erreur lors de la suppression du compte");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur inattendue s'est produite";
      toast.error(errorMessage);
    }
  };
  return (
    <Dialog
      modal
      open={_isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        if (isOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className={`font-semibold shadow-sm px-4 py-2 rounded-md ${className || ''}`.trim()}>
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer le compte
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[400px] rounded-2xl border-0 bg-gradient-to-br from-white to-red-50 dark:from-red-950/40 dark:to-red-900/30 shadow-xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-destructive">Supprimer le compte</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Cette action est <span className="font-semibold text-destructive">irréversible</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Alert className="border-destructive/20 bg-destructive/5 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-sm">
            <strong>Attention :</strong> La suppression de votre compte entraînera la perte définitive de toutes vos données,
            y compris votre profil, vos préférences et votre historique. Cette action ne peut pas être annulée.
          </AlertDescription>
        </Alert>

        <form
          className="space-y-6 mt-2"
          autoComplete="off"
          onSubmit={handleSubmit(handleAccountDelete)}
        >
          <Controller
            name="verify"
            rules={{
              validate: (value) =>
                value === "supprimer mon compte"
                  ? undefined
                  : "Vous devez confirmer la suppression en tapant exactement 'supprimer mon compte'.",
            }}
            control={control}
            render={({ field, fieldState }) => (
              <div className="grid gap-2">
                <Label htmlFor="__verify" className="text-sm font-medium">
                  Pour confirmer, tapez <span className="font-mono bg-muted px-1 rounded text-destructive">supprimer mon compte</span> ci-dessous :
                </Label>
                <Input
                  id="__verify"
                  placeholder="Tapez 'supprimer mon compte'"
                  className="border-destructive/30 focus:border-destructive rounded-md"
                  {...field}
                />
                {fieldState.error && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="password"
            rules={{
              required: {
                value: true,
                message: "Veuillez entrer votre mot de passe pour confirmer la suppression",
              },
            }}
            control={control}
            render={({ field, fieldState }) => (
              <div className="grid gap-2">
                <Label htmlFor="__password" className="text-sm font-medium">
                  Votre mot de passe
                </Label>
                <Input
                  id="__password"
                  placeholder="Entrez votre mot de passe"
                  type="password"
                  className="border-destructive/30 focus:border-destructive rounded-md"
                  {...field}
                />
                {fieldState.error && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-md"
              onClick={() => setIsOpen(false)}
              disabled={formState.isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1 rounded-md font-semibold shadow-sm"
              disabled={formState.isSubmitting}
              aria-label="Supprimer définitivement le compte"
            >
              {formState.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer définitivement
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}