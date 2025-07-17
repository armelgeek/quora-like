// Exports principal pour le module dashboard
export { DashboardService } from './dashboard.service';
export { MockDashboardService } from './dashboard.mock';
export { dashboardService, dashboardConfig } from './dashboard.config';

// Hooks
export {
  useDashboardOverview,
  useDashboardStats,
  useRecentActivity,
  useUpcomingEvents,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useRefreshDashboard,
  DASHBOARD_QUERY_KEYS
} from './hooks/use-dashboard';

// Types et schémas
export type {
  DashboardOverview,
  DashboardStats,
  RecentActivity,
  QuickAction,
  UpcomingEvent
} from './dashboard.schema';

export {
  DashboardOverviewSchema,
  DashboardStatsSchema,
  RecentActivitySchema,
  QuickActionSchema,
  UpcomingEventSchema
} from './dashboard.schema';

// Données mock
export {
  mockDashboardStats,
  mockRecentActivities,
  mockUpcomingEvents,
  mockDashboardOverview
} from './dashboard.mock';

// Composants
export { DashboardIntegrationTest } from './components/dashboard-integration-test';
