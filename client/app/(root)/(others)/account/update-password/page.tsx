import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { ChangePassword } from "@/features/auth/components/organisms/change-password-form";
import { Metadata } from "next";
import { Lock } from "lucide-react";

export const metadata: Metadata = { title: "Update Password" };

export default async function Page() {
    return (
        <div className="max-w-lg mx-auto py-10">
            <div className="flex flex-col items-center mb-6">
                <div className="bg-primary/10 rounded-full p-4 mb-2">
                    <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Changer le mot de passe</h1>
                <p className="text-gray-500 text-sm text-center max-w-md">
                    Pour la sécurité de votre compte, choisissez un mot de passe fort et unique. <br />
                    {"Évitez d'utiliser le même mot de passe que sur d'autres sites."}
                </p>
            </div>
            <Card className="shadow-lg border border-slate-100">
                <CardHeader>
                    <CardTitle className="text-xl">Nouveau mot de passe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="text-xs text-gray-500 mb-2 list-disc pl-5">
                        <li>Au moins 8 caractères</li>
                        <li>Inclure une majuscule, une minuscule, un chiffre et un caractère spécial</li>
                        <li>Ne pas réutiliser un ancien mot de passe</li>
                    </ul>
                    <ChangePassword />
                </CardContent>
            </Card>
        </div>
    )
}