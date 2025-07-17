"use client";

import { useState } from "react";
import { Button } from "@/shared/components/atoms/ui/button";
import { Card } from "@/shared/components/atoms/ui/card";
import { Badge } from "@/shared/components/atoms/ui/badge";
import { 
  Bell, 
  X, 
  CheckCircle, 
  Info,
  Calendar,
  CreditCard,
  FileText
} from "lucide-react";
import { useMarkNotificationAsRead } from "../hooks/use-dashboard";

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'project' | 'meeting' | 'invoice' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export function DashboardNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "info",
      category: "meeting",
      title: "Réunion dans 30 minutes",
      message: "Réunion client - Projet E-commerce",
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: "/dashboard/calendar"
    },
    {
      id: "2", 
      type: "success",
      category: "invoice",
      title: "Paiement reçu",
      message: "Facture INV-2025-001 payée (2,500€)",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      actionUrl: "/dashboard/billing"
    },
    {
      id: "3",
      type: "warning",
      category: "project",
      title: "Échéance approche",
      message: "Livraison Site vitrine dans 2 jours",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
      actionUrl: "/dashboard/projects"
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const markAsReadMutation = useMarkNotificationAsRead();

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case 'meeting':
        return Calendar;
      case 'invoice':
        return CreditCard;
      case 'project':
        return FileText;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-orange-600 bg-orange-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} jour(s)`;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    markAsReadMutation.mutate(notificationId);
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    unreadIds.forEach(id => markAsReadMutation.mutate(id));
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4" />
        {unreadNotifications.length > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
            {unreadNotifications.length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel des notifications */}
          <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden z-50 shadow-lg">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadNotifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Tout marquer comme lu
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.category);
                    const colorClass = getNotificationColor(notification.type);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-3 hover:bg-gray-50 transition-colors ${
                          !notification.read ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${colorClass}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm text-gray-900">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              
                              <div className="flex gap-1">
                                {notification.actionUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs"
                                    onClick={() => {
                                      window.location.href = notification.actionUrl!;
                                      markAsRead(notification.id);
                                    }}
                                  >
                                    Voir
                                  </Button>
                                )}
                                
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <CheckCircle className="h-3 w-3" />
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
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Aucune notification</p>
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 border-t bg-gray-50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    window.location.href = '/dashboard/notifications';
                    setIsOpen(false);
                  }}
                >
                  Voir toutes les notifications
                </Button>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
