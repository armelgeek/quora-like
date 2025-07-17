import type { 
  DashboardOverview,
  DashboardStats,
  RecentActivity,
  UpcomingEvent 
} from "./dashboard.schema";

// Données mock pour les statistiques
export const mockDashboardStats: DashboardStats = {
  activeProjects: 5,
  upcomingMeetings: 3,
  pendingInvoices: 2,
  totalActivity: 18
};

// Données mock pour l'activité récente
export const mockRecentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "project_created",
    title: "Nouveau projet créé",
    description: "Site E-commerce Boutique Mode",
    date: "2025-07-17T08:30:00Z",
    status: "completed",
    metadata: {
      client: "Boutique Élégance",
      budget: 2500
    }
  },
  {
    id: "2", 
    type: "meeting_completed",
    title: "Réunion terminée",
    description: "Point projet avec Restaurant Le Gourmet",
    date: "2025-07-17T12:00:00Z",
    status: "completed",
    metadata: {
      duration: "1h30",
      attendees: 3
    }
  },
  {
    id: "3",
    type: "invoice_sent",
    title: "Facture envoyée",
    description: "INV-2025-002 - Application Mobile Restaurant",
    date: "2025-07-16T16:45:00Z",
    status: "pending",
    metadata: {
      amount: 4200,
      client: "Restaurant Le Gourmet"
    }
  },
  {
    id: "4",
    type: "payment_received",
    title: "Paiement reçu",
    description: "INV-2025-001 - Site E-commerce",
    date: "2025-07-15T09:15:00Z",
    status: "completed",
    metadata: {
      amount: 2500,
      method: "Virement bancaire"
    }
  }
];

// Données mock pour les événements à venir
export const mockUpcomingEvents: UpcomingEvent[] = [
  {
    id: "1",
    title: "Réunion client - Projet E-commerce",
    description: "Point d'avancement et validation des maquettes",
    date: "2025-07-18T14:00:00Z",
    time: "14:00 - 15:30",
    type: "meeting",
    location: "Visioconférence",
    attendees: 3
  },
  {
    id: "2",
    title: "Livraison projet Site vitrine",
    description: "Présentation finale et formation client",
    date: "2025-07-19T09:00:00Z",
    time: "09:00 - 10:00",
    type: "presentation",
    location: "Bureau - Salle 2",
    attendees: 5
  },
  {
    id: "3",
    title: "Formation React avancé", 
    description: "Formation interne sur les hooks avancés",
    date: "2025-07-19T13:00:00Z",
    time: "13:00 - 17:00",
    type: "training",
    location: "En ligne",
    attendees: 1
  }
];

// Vue d'ensemble complète du dashboard
export const mockDashboardOverview: DashboardOverview = {
  stats: mockDashboardStats,
  recentActivities: mockRecentActivities,
  quickActions: [
    {
      id: "1",
      title: "Nouveau projet",
      description: "Créer un nouveau projet",
      icon: "FileText",
      href: "/dashboard/projects/new",
      enabled: true
    },
    {
      id: "2", 
      title: "Planifier un RDV",
      description: "Ajouter un rendez-vous",
      icon: "Calendar",
      href: "/dashboard/calendar/new",
      enabled: true
    },
    {
      id: "3",
      title: "Voir les factures",
      description: "Gérer la facturation",
      icon: "CreditCard", 
      href: "/dashboard/billing",
      enabled: true
    },
    {
      id: "4",
      title: "Paramètres",
      description: "Configuration du compte",
      icon: "Settings",
      href: "/dashboard/settings",
      enabled: true
    }
  ],
  upcomingEvents: mockUpcomingEvents
};

// Service mock pour les tests
export class MockDashboardService {
  async getDashboardOverview(): Promise<DashboardOverview> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDashboardOverview;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockDashboardStats;
  }

  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockRecentActivities.slice(0, limit);
  }

  async getUpcomingEvents(limit: number = 5): Promise<UpcomingEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 350));
    return mockUpcomingEvents.slice(0, limit);
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Notification ${notificationId} marked as read`);
  }

  async getUnreadNotificationsCount(): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return 3; // Nombre de notifications non lues
  }
}
