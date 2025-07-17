"use client";

import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/components/atoms/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { Badge } from "@/shared/components/atoms/ui/badge";
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Plus,
  Edit,
  Trash2,
  Users
} from "lucide-react";
import { useState } from "react";

export default function CalendarPage() {
  const { isLoading } = useAuth();
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const events = [
    {
      id: 1,
      title: "Réunion client - Projet E-commerce",
      time: "14:00 - 15:30",
      date: "Aujourd'hui",
      type: "meeting",
      location: "Visioconférence",
      attendees: 3,
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      id: 2,
      title: "Présentation projet Site vitrine",
      time: "09:00 - 10:00",
      date: "Demain",
      type: "presentation",
      location: "Bureau - Salle 2",
      attendees: 5,
      color: "bg-green-100 text-green-800 border-green-200"
    },
    {
      id: 3,
      title: "Formation React avancé",
      time: "13:00 - 17:00",
      date: "Vendredi",
      type: "training",
      location: "En ligne",
      attendees: 1,
      color: "bg-purple-100 text-purple-800 border-purple-200"
    },
    {
      id: 4,
      title: "Point équipe hebdomadaire",
      time: "10:00 - 11:00",
      date: "Lundi prochain",
      type: "meeting",
      location: "Bureau - Salle 1",
      attendees: 8,
      color: "bg-orange-100 text-orange-800 border-orange-200"
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return Users;
      case 'presentation':
        return Video;
      case 'training':
        return Clock;
      default:
        return Calendar;
    }
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planning</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos rendez-vous et événements
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-gray-200 rounded-lg">
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="rounded-r-none"
            >
              Semaine
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
              className="rounded-l-none"
            >
              Mois
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vue calendrier simplifiée */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendrier de la semaine
            </CardTitle>
            <CardDescription>
              15 - 21 Juillet 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                  <div key={day} className="p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Dates */}
              <div className="grid grid-cols-7 gap-2">
                {[14, 15, 16, 17, 18, 19, 20].map((date, index) => (
                  <div
                    key={date}
                    className={`p-3 text-center rounded-lg border transition-colors ${
                      index === 3 
                        ? 'bg-primary text-white border-primary' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm font-medium">{date}</span>
                    {index === 3 && (
                      <div className="mt-1">
                        <div className="w-2 h-2 bg-white rounded-full mx-auto"></div>
                      </div>
                    )}
                    {index === 4 && (
                      <div className="mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Horaires avec événements */}
              <div className="mt-6 space-y-2">
                <div className="text-sm font-medium text-gray-600 mb-4">Aujourd&apos;hui - 17 Juillet</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs font-medium text-blue-600 w-16">14:00</div>
                    <div className="flex-1">
                      <div className="font-medium text-blue-900">Réunion client</div>
                      <div className="text-xs text-blue-700">Projet E-commerce</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">1h30</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Événements à venir */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Prochains événements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {events.map((event) => {
              const IconComponent = getEventIcon(event.type);
              return (
                <div
                  key={event.id}
                  className={`p-4 border rounded-lg transition-colors hover:bg-gray-50 ${event.color} border`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span className="text-xs font-medium">{event.date}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-1">{event.title}</h4>
                  <p className="text-sm mb-2">{event.time}</p>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                  
                  {event.attendees > 1 && (
                    <div className="flex items-center gap-2 text-xs mt-2">
                      <Users className="h-3 w-3" />
                      <span>{event.attendees} participants</span>
                    </div>
                  )}
                </div>
              );
            })}
            
            <Button variant="outline" className="w-full">
              Voir tous les événements
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cette semaine</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-500">rendez-vous</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps total</p>
                <p className="text-2xl font-bold text-gray-900">12h</p>
                <p className="text-xs text-gray-500">planifiées</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-xs text-gray-500">différents</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En ligne</p>
                <p className="text-2xl font-bold text-gray-900">60%</p>
                <p className="text-xs text-gray-500">des RDV</p>
              </div>
              <Video className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
