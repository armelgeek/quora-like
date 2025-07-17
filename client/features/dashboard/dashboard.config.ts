import { DashboardService } from "./dashboard.service";
import { MockDashboardService } from "./dashboard.mock";

// Configuration pour choisir entre le service réel et le mock
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_BASE_URL;

export const dashboardService = USE_MOCK_DATA 
  ? new MockDashboardService()
  : new DashboardService();

export const dashboardConfig = {
  useMockData: USE_MOCK_DATA,
  refreshInterval: {
    stats: 5 * 60 * 1000, // 5 minutes
    activity: 2 * 60 * 1000, // 2 minutes  
    events: 5 * 60 * 1000, // 5 minutes
    notifications: 30 * 1000, // 30 secondes
  },
  pagination: {
    defaultActivityLimit: 10,
    defaultEventsLimit: 5,
  },
  features: {
    realTimeNotifications: true,
    autoRefresh: true,
    exportData: true,
  }
} as const;
