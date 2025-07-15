"use client";

import { Button } from "@/shared/components/atoms/ui/button";
import { Badge } from "@/shared/components/atoms/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { Clock, MapPin, Euro, Calendar, Users } from "lucide-react";
import { useState } from "react";
import { addDays, format, isBefore, isSameDay, startOfToday, endOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/atoms/ui/tabs";

export interface Schedule {
  id: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  vehicleType: "Standard" | "Premium" | "VIP";
  stops?: string[];
}

export interface ScheduleTableProps {
  schedules: Schedule[];
  onBook?: (scheduleId: string) => void;
}

export function ScheduleTable({ schedules, onBook }: ScheduleTableProps) {

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "text-green-700 bg-green-100 border-green-200";
    if (percentage > 20) return "text-orange-700 bg-orange-100 border-orange-200";
    return "text-red-700 bg-red-100 border-red-200";
  };

  const getVehicleBadgeColor = (type: string) => {
    switch (type) {
      case "VIP": return "bg-gradient-to-r from-purple-200 to-purple-100 text-purple-900 border border-purple-300";
      case "Premium": return "bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900 border border-blue-300";
      default: return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200";
    }
  };

  // Tabs selector rendu en dehors du conteneur principal
  return (
    <>
     
      <div className="space-y-6">
        {/* Desktop table view */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-700">Départ</th>
                <th className="text-left p-4 font-semibold text-gray-700">Arrivée</th>
                <th className="text-left p-4 font-semibold text-gray-700">Durée</th>
                <th className="text-left p-4 font-semibold text-gray-700">Véhicule</th>
                <th className="text-left p-4 font-semibold text-gray-700">Places</th>
                <th className="text-left p-4 font-semibold text-gray-700">Prix</th>
                <th className="text-left p-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr 
                  key={schedule.id} 
                  className="border-b border-gray-100 hover:bg-primary/5 transition-colors"
                >
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-gray-900">{schedule.departure}</span>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-highlight" />
                      <span className="font-semibold text-gray-900">{schedule.arrival}</span>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="text-gray-600 font-mono">{schedule.duration}</span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <Badge className={getVehicleBadgeColor(schedule.vehicleType)}>
                      {schedule.vehicleType}
                    </Badge>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getAvailabilityColor(schedule.availableSeats, schedule.totalSeats)}`}>
                        {schedule.availableSeats}/{schedule.totalSeats}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Euro className="w-4 h-4 text-primary" />
                      <span className="text-lg font-bold text-primary">{schedule.price}€</span>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <Button 
                      size="sm" 
                      onClick={() => onBook?.(schedule.id)}
                      disabled={schedule.availableSeats === 0}
                      className="rounded-full px-4"
                    >
                      {schedule.availableSeats === 0 ? "Complet" : "Réserver"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden space-y-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="hover:shadow-md transition-shadow border border-gray-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{schedule.departure}</div>
                      <div className="text-xs text-gray-500">Départ</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-sm text-gray-600 font-mono">{schedule.duration}</div>
                      <div className="h-px bg-gray-300 my-1"></div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-highlight">{schedule.arrival}</div>
                      <div className="text-xs text-gray-500">Arrivée</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge className={getVehicleBadgeColor(schedule.vehicleType)}>
                      {schedule.vehicleType}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getAvailabilityColor(schedule.availableSeats, schedule.totalSeats)}`}>
                        {schedule.availableSeats}/{schedule.totalSeats}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">{schedule.price}€</span>
                    <Button 
                      size="sm" 
                      onClick={() => onBook?.(schedule.id)}
                      disabled={schedule.availableSeats === 0}
                      className="rounded-full px-4"
                    >
                      {schedule.availableSeats === 0 ? "Complet" : "Réserver"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export function ScheduleTableSample() {
  const sampleSchedules: Schedule[] = [
    {
      id: "1",
      departure: "08:00",
      arrival: "12:30",
      duration: "4h30",
      price: 35,
      availableSeats: 12,
      totalSeats: 50,
      vehicleType: "Standard",
      stops: ["Lyon Part-Dieu"]
    },
    {
      id: "2", 
      departure: "10:15",
      arrival: "14:45",
      duration: "4h30",
      price: 42,
      availableSeats: 8,
      totalSeats: 40,
      vehicleType: "Premium",
      stops: ["Lyon Part-Dieu", "Mâcon"]
    },
    {
      id: "3",
      departure: "14:30",
      arrival: "19:00", 
      duration: "4h30",
      price: 35,
      availableSeats: 25,
      totalSeats: 50,
      vehicleType: "Standard",
      stops: ["Lyon Part-Dieu"]
    },
    {
      id: "4",
      departure: "18:45",
      arrival: "23:15",
      duration: "4h30", 
      price: 55,
      availableSeats: 3,
      totalSeats: 30,
      vehicleType: "VIP",
      stops: ["Lyon Part-Dieu"]
    },
    {
      id: "5",
      departure: "22:00",
      arrival: "02:30+1",
      duration: "4h30",
      price: 35,
      availableSeats: 0,
      totalSeats: 50,
      vehicleType: "Standard",
      stops: ["Lyon Part-Dieu"]
    }
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Voyages de la semaine</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleTable 
            schedules={sampleSchedules}
            onBook={(id) => console.log("Booking schedule:", id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
