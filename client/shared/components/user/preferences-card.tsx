"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/atoms/ui/card";
import { Separator } from "@/shared/components/atoms/ui/separator";
import { Label } from "@/shared/components/atoms/ui/label";
import { Switch } from "@/shared/components/atoms/ui/switch";
import { Settings, Bell, Lock } from "lucide-react";

export interface PreferencesCardProps {
  user: {
    preferences: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      promotionalEmails: boolean;
      twoFactorAuth: boolean;
    };
  };
}

export function PreferencesCard({ user }: PreferencesCardProps) {
  const [preferences, setPreferences] = useState(user.preferences);

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // TODO: brancher sur l'API
  };

  return (
    <Card className="bg-white shadow-sm rounded-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Préférences</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-1">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Notifications par email</Label>
                <p className="text-sm text-gray-500">Recevoir les confirmations et mises à jour</p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.emailNotifications}
                onCheckedChange={checked => handlePreferenceChange("emailNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notifications">Notifications SMS</Label>
                <p className="text-sm text-gray-500">Recevoir les alertes importantes</p>
              </div>
              <Switch
                id="sms-notifications"
                checked={preferences.smsNotifications}
                onCheckedChange={checked => handlePreferenceChange("smsNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="promotional-emails">Emails promotionnels</Label>
                <p className="text-sm text-gray-500">Recevoir les offres et promotions</p>
              </div>
              <Switch
                id="promotional-emails"
                checked={preferences.promotionalEmails}
                onCheckedChange={checked => handlePreferenceChange("promotionalEmails", checked)}
              />
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h4 className="font-medium flex items-center space-x-1">
            <Lock className="w-4 h-4" />
            <span>Sécurité</span>
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="two-factor">Authentification à deux facteurs</Label>
              <p className="text-sm text-gray-500">Sécuriser votre compte avec un code supplémentaire</p>
            </div>
            <Switch
              id="two-factor"
              checked={preferences.twoFactorAuth}
              onCheckedChange={checked => handlePreferenceChange("twoFactorAuth", checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}