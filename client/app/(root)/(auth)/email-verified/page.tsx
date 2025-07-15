import type { Metadata } from 'next';
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

import { Button } from "@/shared/components/atoms/ui/button";
import { Card, CardContent } from "@/shared/components/atoms/ui/card";
import { FadeIn, ScaleIn } from "@/shared/components/atoms/animated-elements";

export const metadata: Metadata = {
  title: 'Email Verified',
  description: 'Your email has been successfully verified',
};

export default function EmailVerifiedPage() {
  return (
    <FadeIn>
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <ScaleIn delay={0.2}>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </ScaleIn>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-green-600 dark:text-green-400">
                Email Verified!
              </h1>
              <p className="text-sm text-muted-foreground max-w-sm">
                Your email address has been successfully verified. You can now access all features of your account.
              </p>
            </div>

            <div className="w-full space-y-3">
              <Button asChild className="w-full">
                <Link href="/">
                  Continue to Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
