"use client";

import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/components/atoms/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { Badge } from "@/shared/components/atoms/ui/badge";
import { Input } from "@/shared/components/atoms/ui/input";
import { 
  Clock, 
  Calendar, 
  CreditCard, 
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  Edit,
  CheckCircle,
  Users
} from "lucide-react";

export default function HistoryPage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const activities = [
    {
      id: 1,
      type: 'project_created',
      title: 'Nouveau projet créé',
      description: 'Site E-commerce Boutique Mode',
      date: '2025-07-17T10:30:00',
      status: 'completed',
      details: {
        client: 'Boutique Élégance',
        budget: 2500
      }
    },
    {
      id: 2,
      type: 'meeting_completed',
      title: 'Réunion terminée',
      description: 'Point projet avec Restaurant Le Gourmet',
      date: '2025-07-17T14:00:00',
      status: 'completed',
      details: {
        duration: '1h30',
        attendees: 3
      }
    },
    {
      id: 3,
      type: 'invoice_sent',
      title: 'Facture envoyée',
      description: 'INV-2025-002 - Application Mobile Restaurant',
      date: '2025-07-16T16:45:00',
      status: 'pending',
      details: {
        amount: 4200,
        client: 'Restaurant Le Gourmet'
      }
    },
    {
      id: 4,
      type: 'payment_received',
      title: 'Paiement reçu',
      description: 'INV-2025-001 - Site E-commerce',
      date: '2025-07-15T09:15:00',
      status: 'completed',
      details: {
        amount: 2500,
        method: 'Virement bancaire'
      }
    },
    {
      id: 5,
      type: 'task_completed',
      title: 'Tâche terminée',
      description: 'Intégration système de paiement',
      date: '2025-07-14T17:30:00',
      status: 'completed',
      details: {
        project: 'Site E-commerce',
        timeSpent: '4h'
      }
    },
    {
      id: 6,
      type: 'meeting_scheduled',
      title: 'Réunion planifiée',
      description: 'Formation React avancé',
      date: '2025-07-12T11:00:00',
      status: 'scheduled',
      details: {
        scheduledFor: '2025-07-19T13:00:00',
        type: 'Formation'
      }
    }
  ];

  const getActivityConfig = (type: string) => {
    switch (type) {
      case 'project_created':
        return {
          icon: FileText,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'meeting_completed':
      case 'meeting_scheduled':
        return {
          icon: Users,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'invoice_sent':
      case 'payment_received':
        return {
          icon: CreditCard,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        };
      case 'task_completed':
        return {
          icon: CheckCircle,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Terminé
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Calendar className="h-3 w-3 mr-1" />
            Planifié
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Aujourd'hui ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historique</h1>
          <p className="text-gray-600 mt-1">
            Toute votre activité et historique des actions
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projets créés</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-500">ce mois</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Réunions</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-500">terminées</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Factures</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-xs text-gray-500">envoyées</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps total</p>
                <p className="text-2xl font-bold text-gray-900">120h</p>
                <p className="text-xs text-gray-500">travaillées</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline des activités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activité récente
          </CardTitle>
          <CardDescription>
            Chronologie de toutes vos actions et événements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activities.map((activity, index) => {
              const config = getActivityConfig(activity.type);
              const Icon = config.icon;

              return (
                <div key={activity.id} className="relative">
                  {/* Ligne de connexion */}
                  {index < activities.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    {/* Icône */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${config.bgColor}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{activity.title}</h4>
                            {getStatusBadge(activity.status)}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                          
                          <div className="text-xs text-gray-500 mb-3">
                            {formatDate(activity.date)}
                          </div>

                          {/* Détails spécifiques */}
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            {activity.details.client && (
                              <span>Client: {activity.details.client}</span>
                            )}
                            {activity.details.budget && (
                              <span>Budget: {formatAmount(activity.details.budget)}</span>
                            )}
                            {activity.details.amount && (
                              <span>Montant: {formatAmount(activity.details.amount)}</span>
                            )}
                            {activity.details.duration && (
                              <span>Durée: {activity.details.duration}</span>
                            )}
                            {activity.details.attendees && (
                              <span>{activity.details.attendees} participants</span>
                            )}
                            {activity.details.timeSpent && (
                              <span>Temps: {activity.details.timeSpent}</span>
                            )}
                            {activity.details.method && (
                              <span>Méthode: {activity.details.method}</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 ml-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {(activity.type === 'invoice_sent' || activity.type === 'payment_received') && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          {activity.type === 'project_created' && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline">
              Charger plus d&apos;activités
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
