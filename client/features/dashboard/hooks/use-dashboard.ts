import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../dashboard.config';

// Clés de cache pour React Query
export const DASHBOARD_QUERY_KEYS = {
  all: ['dashboard'] as const,
  overview: () => [...DASHBOARD_QUERY_KEYS.all, 'overview'] as const,
  stats: () => [...DASHBOARD_QUERY_KEYS.all, 'stats'] as const,
  activity: (limit?: number) => [...DASHBOARD_QUERY_KEYS.all, 'activity', limit] as const,
  events: (limit?: number) => [...DASHBOARD_QUERY_KEYS.all, 'events', limit] as const,
  notifications: () => [...DASHBOARD_QUERY_KEYS.all, 'notifications'] as const,
};

/**
 * Hook pour récupérer la vue d'ensemble du dashboard
 */
export function useDashboardOverview() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.overview(),
    queryFn: () => dashboardService.getDashboardOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook pour récupérer les statistiques du dashboard
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.stats(),
    queryFn: () => dashboardService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook pour récupérer l'activité récente
 */
export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.activity(limit),
    queryFn: () => dashboardService.getRecentActivity(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook pour récupérer les événements à venir
 */
export function useUpcomingEvents(limit: number = 5) {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.events(limit),
    queryFn: () => dashboardService.getUpcomingEvents(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook pour récupérer le nombre de notifications non lues
 */
export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.notifications(),
    queryFn: () => dashboardService.getUnreadNotificationsCount(),
    staleTime: 30 * 1000, // 30 secondes
    refetchInterval: 60 * 1000, // Refetch toutes les minutes
  });
}

/**
 * Hook pour marquer une notification comme lue
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => 
      dashboardService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalider le cache des notifications pour les recharger
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_QUERY_KEYS.notifications(),
      });
      // Invalider aussi l'activité récente car elle peut contenir des notifications
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_QUERY_KEYS.activity(),
      });
    },
  });
}

/**
 * Hook pour rafraîchir toutes les données du dashboard
 */
export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: DASHBOARD_QUERY_KEYS.all,
    });
  };
}
