import type { Metadata } from 'next';
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

import { Button } from "@/shared/components/atoms/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { FadeIn, ScaleIn } from "@/shared/components/atoms/animated-elements";

export const metadata: Metadata = {
  title: 'Email vérifié - Boiler',
  description: 'Votre adresse email a été vérifiée avec succès',
};

export default function EmailVerifiedPage() {
  return (
    <FadeIn>
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <ScaleIn delay={0.2}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </ScaleIn>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Email vérifié !
            </CardTitle>
            <CardDescription className="text-center text-gray-600 max-w-sm">
              Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <Button asChild className="w-full h-11 text-base font-semibold">
            <Link href="/dashboard" className="flex items-center justify-center gap-2">
              Accéder au tableau de bord
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full h-11">
            <Link href="/">
              Retour à l&apos;accueil
            </Link>
          </Button>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
