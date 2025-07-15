"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppProfileNav from './app-profile-nav';
import SignOutButton from '../../atoms/signout-button';
import { authClient } from '@/shared/lib/config/auth-client';
import { AccountBreadcrumb } from './account-breadcrumb';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/atoms/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/atoms/ui/avatar';
import { Settings } from "lucide-react";

type SessionType = {
  user?: {
    name?: string;
    email?: string;
    image?: string | null;
    isAnonymous?: boolean | null;
  };
} | null;

const AppProfileClient = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<SessionType>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        if (!sessionData.data) {
          router.push('/login');
          return;
        }
        setSession(sessionData.data);
      } catch (error) {
        console.error('Failed to get session:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Profile Card Skeleton */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Skeleton className="w-20 h-20 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-9 w-full" />
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation Skeleton */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-5 w-24" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Main Content Skeleton */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Sera redirigé vers login
  }

  const userInitials = session.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : session.user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto py-6">
        {/* Breadcrumb Navigation */}
        <AccountBreadcrumb />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Toujours visible */}
          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* User Profile Card */}
              <Card className="overflow-hidden shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20 ring-2 ring-primary/10">
                        <AvatarImage 
                          src={session.user?.image || undefined} 
                          alt={session.user?.name || 'User'}
                        />
                        <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-foreground">
                        {session.user?.name || 'Utilisateur'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                    
                    <div className="w-full pt-2 border-t">
                      <SignOutButton active={false} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Card */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Paramètres du compte
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <AppProfileNav />
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                {children}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppProfileClient;