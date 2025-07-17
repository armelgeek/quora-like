"use client";

import { DashboardIntegrationTest } from "@/features/dashboard/components/dashboard-integration-test";

export default function DashboardTestPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Test d&apos;intégration Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Page de test pour vérifier la connexion aux données du dashboard
        </p>
      </div>
      
      <DashboardIntegrationTest />
    </div>
  );
}
