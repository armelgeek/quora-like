"use client";

export default function UserDashboardPage() {

  return (
    <div className="space-y-8">
      {/* En-tête avec salutation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bonjour, Utilisateur 👋
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Voici un aperçu de votre activité aujourd&apos;hui
          </p>
        </div>

      </div>

    </div>
  );
}
