"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { DeleteAccount } from "@/features/auth/components/organisms/delete-account-form";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/atoms/ui/alert";
import { authClient } from '@/shared/lib/config/auth-client';
import { Skeleton } from "@/shared/components/atoms/ui/skeleton";

interface User {
  name?: string;
  email?: string;
  image?: string | null;
  isAnonymous?: boolean | null;
}

interface SessionType {
  user?: User;
}

// Composant de chargement réutilisable
const LoadingSkeleton = () => (
  <div className="container max-w-4xl mx-auto py-8 space-y-6">
    <div className="text-center space-y-2">
      <Skeleton className="h-8 w-64 mx-auto rounded-lg" />
      <Skeleton className="h-4 w-96 mx-auto rounded-lg" />
    </div>
    <Skeleton className="h-24 w-full rounded-lg" />
    <Skeleton className="h-64 w-full rounded-lg" />
  </div>
);

// Composant pour les conséquences de suppression
const DeletionConsequences = () => (
  <Alert className="border-destructive/30 bg-destructive/5 mb-6">
    <AlertTriangle className="h-4 w-4 text-destructive" />
    <AlertDescription className="text-destructive">
      <strong>Attention :</strong> La suppression de votre compte entraînera :
      <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
        <li>Suppression définitive de toutes vos données</li>
        <li>{"Perte de l'accès à votre historique"}</li>
        <li>Annulation de tous vos abonnements</li>
        <li>Impossibilité de récupérer vos informations</li>
      </ul>
    </AlertDescription>
  </Alert>
);

// Composant pour la section de suppression
const DeletionSection = () => (
  <div className="flex flex-col items-start  justify-between p-6 rounded-lg bg-destructive/10 border border-destructive/30 gap-4">
    <div className="space-y-2 flex-1">
      <h3 className="text-lg font-semibold text-destructive">
        Supprimer définitivement le compte
      </h3>
      <p className="text-sm text-destructive/80 max-w-md leading-relaxed">
        Cette action supprimera immédiatement et définitivement votre compte 
        ainsi que toutes les données associées. Cette action ne peut pas être annulée.
      </p>
    </div>
    <div>
      <DeleteAccount />
    </div>
  </div>
);

export default function DeleteAccountClient() {
  const [session, setSession] = useState<SessionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionData = await authClient.getSession();
      setSession(sessionData.data);
    } catch (error) {
      console.error('Failed to get session:', error);
      setError('Impossible de charger les informations de session');
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // État de chargement
  if (loading) {
    return <LoadingSkeleton />;
  }

  // État d'erreur
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Alert className="border-destructive/30 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Utilisateur non connecté ou anonyme
  if (!session?.user || session.user.isAnonymous) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous devez être connecté avec un compte non-anonyme pour accéder à cette page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl w-[500px] mx-auto py-8">
      <Card className="border-destructive/20">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl text-red-600 flex items-center justify-center gap-3">
            <AlertTriangle className="h-7 w-7" />
            Zone de danger
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Actions irréversibles qui affectent définitivement votre compte
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <DeletionConsequences />
          <DeletionSection />
        </CardContent>
      </Card>
    </div>
  );
}