"use client";
import { Card, CardContent } from "@/shared/components/atoms/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/atoms/ui/avatar";
import { Button } from "@/shared/components/atoms/ui/button";
import { Calendar, Camera } from "lucide-react";
import { useAuth } from "@/shared/providers/auth-provider";

export function ProfileHeader() {
  const user = useAuth();
  return (
    <Card className="bg-white shadow-md rounded-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src="https://i.pravatar.cc/150?img=50" alt={`${user.session?.user?.name}`} />
              <AvatarFallback className="text-2xl">{user.session?.user?.name}</AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              variant="outline"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.session?.user?.name}
                </h1>
                <p className="text-gray-600 mt-1">{user.session?.user?.email}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Membre depuis {new Date().getFullYear()}</span>
                  </span>

                </div>
              </div>

            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
              <a
                href="/account/delete-account"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-900 transition-colors text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                aria-label="Supprimer le profil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Supprimer mon profil
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}