"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { Skeleton } from "@/shared/components/atoms/ui/skeleton";
import { PreferencesCard } from "@/shared/components/user/preferences-card";
import { ProfileHeader } from "@/shared/components/user/profile-header";
import { ClientProfileForm } from "@/features/auth/components/organisms/client-profile-form";

export default function UserProfileHome() {
  const { isLoading, user } = useAuth();


  if (isLoading) {
    return (
      <div className="space-y-8">
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-96 w-full rounded-xl" />
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="space-y-6">
          <ProfileHeader />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {user && <ClientProfileForm user={user} />}
            {user && (
              <PreferencesCard
                user={{
                  ...user,
                  preferences: {
                    emailNotifications: true,
                    smsNotifications: false,
                    promotionalEmails: true,
                    twoFactorAuth: false,
                  },
                }}
              />
            )}
          </div>
        </div>
    </div>
  );
}