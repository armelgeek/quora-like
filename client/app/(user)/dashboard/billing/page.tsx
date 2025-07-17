"use client";

import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/components/atoms/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { Badge } from "@/shared/components/atoms/ui/badge";
import { 
  CreditCard, 
  Download, 
  Eye, 
  Euro,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Filter
} from "lucide-react";

export default function BillingPage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const invoices = [
    {
      id: "INV-2025-001",
      project: "Site E-commerce Boutique Mode",
      amount: 2500,
      status: "paid",
      date: "2025-07-10",
      dueDate: "2025-07-25",
      client: "Boutique Élégance"
    },
    {
      id: "INV-2025-002", 
      project: "Application Mobile Restaurant",
      amount: 4200,
      status: "pending",
      date: "2025-07-15",
      dueDate: "2025-07-30",
      client: "Restaurant Le Gourmet"
    },
    {
      id: "INV-2025-003",
      project: "Site Vitrine Cabinet Médical", 
      amount: 1800,
      status: "overdue",
      date: "2025-06-20",
      dueDate: "2025-07-05",
      client: "Dr. Martin"
    },
    {
      id: "INV-2025-004",
      project: "Refonte Site Corporate",
      amount: 5500,
      status: "draft",
      date: "2025-07-17",
      dueDate: "2025-08-01",
      client: "Entreprise Solutions"
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          label: 'Payée',
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'pending':
        return {
          label: 'En attente',
          icon: Clock,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'overdue':
        return {
          label: 'En retard',
          icon: AlertCircle,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'draft':
        return {
          label: 'Brouillon',
          icon: Eye,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      default:
        return {
          label: status,
          icon: Clock,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueAmount = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturation</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos factures et suivez vos revenus
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle facture
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
                <p className="text-2xl font-bold text-gray-900">{formatAmount(totalRevenue)}</p>
                <p className="text-xs text-green-600">+12% ce mois</p>
              </div>
              <Euro className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{formatAmount(pendingAmount)}</p>
                <p className="text-xs text-gray-500">{invoices.filter(inv => inv.status === 'pending').length} factures</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En retard</p>
                <p className="text-2xl font-bold text-gray-900">{formatAmount(overdueAmount)}</p>
                <p className="text-xs text-red-600">{invoices.filter(inv => inv.status === 'overdue').length} factures</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ce mois</p>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
                <p className="text-xs text-gray-500">factures créées</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des factures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Factures récentes
          </CardTitle>
          <CardDescription>
            Gérez toutes vos factures et leur statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => {
              const statusConfig = getStatusConfig(invoice.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{invoice.id}</h4>
                        <Badge className={`text-xs ${statusConfig.className} border`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-1">{invoice.project}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Client: {invoice.client}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Créée le {formatDate(invoice.date)}
                        </span>
                        <span>Échéance: {formatDate(invoice.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatAmount(invoice.amount)}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" />
                        Voir
                      </Button>
                      {invoice.status !== 'draft' && (
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <Button variant="outline">
              Voir toutes les factures
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Graphique des revenus (simplifié) */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des revenus</CardTitle>
          <CardDescription>
            Revenus des 6 derniers mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-4 p-4">
            {[
              { month: 'Fév', amount: 3200 },
              { month: 'Mar', amount: 4100 },
              { month: 'Avr', amount: 2800 },
              { month: 'Mai', amount: 5200 },
              { month: 'Juin', amount: 4800 },
              { month: 'Juil', amount: 6700 }
            ].map((data) => (
              <div key={data.month} className="flex flex-col items-center gap-2">
                <div
                  className="bg-primary rounded-t-lg w-12 transition-all hover:bg-primary/80"
                  style={{
                    height: `${(data.amount / 7000) * 200}px`,
                    minHeight: '20px'
                  }}
                ></div>
                <span className="text-xs text-gray-600">{data.month}</span>
                <span className="text-xs font-medium">{formatAmount(data.amount)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
