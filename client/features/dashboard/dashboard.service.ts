import { API_ENDPOINTS } from "@/shared/config/api";
import { API_URL } from "@/shared/lib/config/api";
import type { 
  DashboardOverview,
  DashboardStats,
  RecentActivity,
  UpcomingEvent 
} from "./dashboard.schema";

export class DashboardService {
  private async fetchData<R>(url: string, options: RequestInit = {}): Promise<R> {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
          `Request failed with status ${response.status}: ${response.statusText}`
        );
      } catch {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }
    }

    const contentLength = response.headers.get('content-length');
    if (response.status === 204 || contentLength === '0') {
      return undefined as R;
    }
    const text = await response.text();
    if (!text) {
      return undefined as R;
    }
    return JSON.parse(text) as R;
  }

  private get<R>(endpoint: string, params?: Record<string, string>): Promise<R> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint;
    return this.fetchData<R>(url, { method: 'GET' });
  }

  private patch<R>(endpoint: string, data?: unknown): Promise<R> {
    return this.fetchData<R>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Récupère la vue d'ensemble du dashboard
   */
  async getDashboardOverview(): Promise<DashboardOverview> {
    return this.get<DashboardOverview>(API_ENDPOINTS.dashboard.overview);
  }

  /**
   * Récupère les statistiques du dashboard
   */
  async getDashboardStats(): Promise<DashboardStats> {
    return this.get<DashboardStats>(API_ENDPOINTS.dashboard.stats);
  }

  /**
   * Récupère l'activité récente
   */
  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    return this.get<RecentActivity[]>(
      API_ENDPOINTS.dashboard.activity,
      { limit: limit.toString() }
    );
  }

  /**
   * Récupère les événements à venir
   */
  async getUpcomingEvents(limit: number = 5): Promise<UpcomingEvent[]> {
    return this.get<UpcomingEvent[]>(
      API_ENDPOINTS.dashboard.events,
      { limit: limit.toString() }
    );
  }

  /**
   * Marque une notification comme lue
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.patch(
      `${API_ENDPOINTS.dashboard.notifications}/${notificationId}/read`
    );
  }

  /**
   * Récupère le nombre de notifications non lues
   */
  async getUnreadNotificationsCount(): Promise<number> {
    const response = await this.get<{ count: number }>(
      `${API_ENDPOINTS.dashboard.notifications}/unread-count`
    );
    return response.count;
  }
}
