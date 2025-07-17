"use client";

import { useState } from "react";
import { Button } from "@/shared/components/atoms/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { Badge } from "@/shared/components/atoms/ui/badge";
import { 
  Database, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { 
  useDashboardStats, 
  useRecentActivity, 
  useUpcomingEvents,
  useRefreshDashboard 
} from "@/features/dashboard/hooks/use-dashboard";

export function DashboardIntegrationTest() {
  const [testMode] = useState<'mock' | 'api'>('mock');
  const refreshDashboard = useRefreshDashboard();
  
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError,
    isSuccess: statsSuccess 
  } = useDashboardStats();
  
  const { 
    data: activities, 
    isLoading: activitiesLoading, 
    error: activitiesError,
    isSuccess: activitiesSuccess 
  } = useRecentActivity(3);
  
  const { 
    isLoading: eventsLoading, 
    error: eventsError,
    isSuccess: eventsSuccess 
  } = useUpcomingEvents(2);

  const getStatusIcon = (isLoading: boolean, error: Error | null, isSuccess: boolean) => {
    if (isLoading) return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    if (error) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (isSuccess) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Info className="h-4 w-4 text-gray-500" />;
  };

  const getStatusText = (isLoading: boolean, error: Error | null, isSuccess: boolean) => {
    if (isLoading) return "Chargement...";
    if (error) return "Erreur";
    if (isSuccess) return "Succès";
    return "En attente";
  };

  return (
    <div className="space-y-6">
      {/* En-tête de test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Test d&apos;intégration Dashboard
          </CardTitle>
          <CardDescription>
            Vérification de la connexion aux données et de l&apos;état des API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant={testMode === 'mock' ? 'default' : 'secondary'} className="gap-1">
              {testMode === 'mock' ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
              Mode: {testMode === 'mock' ? 'Mock Data' : 'API Réelle'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshDashboard()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Rafraîchir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status des endpoints */}
      <Card>
        <CardHeader>
          <CardTitle>État des endpoints</CardTitle>
          <CardDescription>
            Statut en temps réel de chaque source de données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Statistiques */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Statistiques</p>
                <p className="text-sm text-gray-600">/dashboard/stats</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(statsLoading, statsError, statsSuccess)}
                <span className="text-sm">{getStatusText(statsLoading, statsError, statsSuccess)}</span>
              </div>
            </div>

            {/* Activités */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Activités</p>
                <p className="text-sm text-gray-600">/dashboard/activity</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(activitiesLoading, activitiesError, activitiesSuccess)}
                <span className="text-sm">{getStatusText(activitiesLoading, activitiesError, activitiesSuccess)}</span>
              </div>
            </div>

            {/* Événements */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Événements</p>
                <p className="text-sm text-gray-600">/dashboard/events</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(eventsLoading, eventsError, eventsSuccess)}
                <span className="text-sm">{getStatusText(eventsLoading, eventsError, eventsSuccess)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Données récupérées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Données des statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Projets actifs:</span>
                  <span className="font-medium">{stats.activeProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rendez-vous:</span>
                  <span className="font-medium">{stats.upcomingMeetings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Factures en attente:</span>
                  <span className="font-medium">{stats.pendingInvoices}</span>
                </div>
                <div className="flex justify-between">
                  <span>Activité totale:</span>
                  <span className="font-medium">{stats.totalActivity}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>

        {/* Activités récentes */}
        <Card>
          <CardHeader>
            <CardTitle>Activités récupérées</CardTitle>
          </CardHeader>
          <CardContent>
            {activities && activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="p-2 border rounded">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                      <Badge variant="outline" className="text-xs">{activity.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucune activité</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Erreurs */}
      {(statsError || activitiesError || eventsError) && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Erreurs détectées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {statsError && (
              <div className="text-sm">
                <span className="font-medium text-red-800">Stats:</span>
                <span className="text-red-700 ml-2">{statsError.message}</span>
              </div>
            )}
            {activitiesError && (
              <div className="text-sm">
                <span className="font-medium text-red-800">Activités:</span>
                <span className="text-red-700 ml-2">{activitiesError.message}</span>
              </div>
            )}
            {eventsError && (
              <div className="text-sm">
                <span className="font-medium text-red-800">Événements:</span>
                <span className="text-red-700 ml-2">{eventsError.message}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
