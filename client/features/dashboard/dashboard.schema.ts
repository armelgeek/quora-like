import { z } from "zod";

// Schémas pour les données du dashboard
export const DashboardStatsSchema = z.object({
  activeProjects: z.number(),
  upcomingMeetings: z.number(),
  pendingInvoices: z.number(),
  totalActivity: z.number(),
});

export const RecentActivitySchema = z.object({
  id: z.string(),
  type: z.enum(['project_created', 'meeting_completed', 'invoice_sent', 'payment_received', 'task_completed']),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  status: z.enum(['completed', 'pending', 'scheduled']),
  metadata: z.record(z.any()).optional(),
});

export const QuickActionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  href: z.string(),
  enabled: z.boolean().default(true),
});

export const UpcomingEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  time: z.string(),
  type: z.enum(['meeting', 'deadline', 'presentation', 'training']),
  location: z.string().optional(),
  attendees: z.number().optional(),
});

export const DashboardOverviewSchema = z.object({
  stats: DashboardStatsSchema,
  recentActivities: z.array(RecentActivitySchema),
  quickActions: z.array(QuickActionSchema),
  upcomingEvents: z.array(UpcomingEventSchema),
});

// Types TypeScript
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type RecentActivity = z.infer<typeof RecentActivitySchema>;
export type QuickAction = z.infer<typeof QuickActionSchema>;
export type UpcomingEvent = z.infer<typeof UpcomingEventSchema>;
export type DashboardOverview = z.infer<typeof DashboardOverviewSchema>;
