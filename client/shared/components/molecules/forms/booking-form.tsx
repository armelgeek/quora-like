"use client";
import { Button } from "@/shared/components/atoms/ui/button";
import { Label } from "@/shared/components/atoms/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/ui/card";
import { Calendar } from "@/shared/components/atoms/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/atoms/ui/popover";
import { MapPin, Calendar as CalendarIcon, Users, Search, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useDepartureCities, useDestinations } from '@/features/location/hooks/use-location';
import type { City } from '@/features/location/location.schema';
import { useRouter } from "next/navigation";

export interface BookingFormProps {
  variant?: "simple" | "detailed" | "inline";
}

export interface BookingData {
  from: string;
  to: string;
  date: Date | undefined;
  passengers: number;
  returnDate?: Date | undefined;
  tripType: "one-way" | "round-trip";
}

export function BookingForm({ variant = "detailed" }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingData>({
    from: "",
    to: "",
    date: undefined,
    passengers: 1,
    returnDate: undefined,
    tripType: "one-way"
  });
  const [isDateOpen, setIsDateOpen] = useState(false);
  const router = useRouter();
  
  const { data: departureCities = [] } = useDepartureCities();
  const { data: destinationCities = [] } = useDestinations(formData.from);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.from) params.set("departureCity", formData.from);
    if (formData.to) params.set("arrivalCity", formData.to);
    if (formData.date) params.set("date", formData.date.toISOString().split("T")[0]);
    if (formData.passengers) params.set("passengers", formData.passengers.toString());
    if (formData.tripType) params.set("tripType", formData.tripType);
    if (formData.returnDate) params.set("returnDate", formData.returnDate.toISOString().split("T")[0]);
    router.push(`/destinations?${params.toString()}`);
  };

  const swapCities = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  if (variant === "inline") {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor="from-inline" className="text-xs font-medium text-white">Départ</Label>
            <Select value={formData.from} onValueChange={(value) => setFormData(prev => ({ ...prev, from: value }))}>
              <SelectTrigger id="from-inline" className="mt-1">
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent>
                {departureCities.map((city: City) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={swapCities}
            className="p-2 hover:bg-gray-100"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-[120px]">
            <Label htmlFor="to-inline" className="text-xs font-medium text-gray-600">Destination</Label>
            <Select value={formData.to} onValueChange={(value) => setFormData(prev => ({ ...prev, to: value }))}>
              <SelectTrigger id="to-inline" className="mt-1">
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent>
                {destinationCities.map((city: City) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[120px]">
            <Label className="text-xs font-medium text-gray-600">Date</Label>
            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full mt-1 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "dd MMM", { locale: fr }) : "Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => {
                    setFormData(prev => ({ ...prev, date }));
                    setIsDateOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="min-w-[80px]">
            <Label className="text-xs font-medium text-gray-600">Passagers</Label>
            <Select value={formData.passengers.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, passengers: parseInt(value) }))}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="min-w-[100px]">
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
        </form>
      </div>
    );
  }

  if (variant === "simple") {
    return (
      <Card className="w-full max-w-md border-white">
        <CardHeader>
          <CardTitle className="flex items-center  text-red-600 space-x-2">
            <Search className="w-5 h-5" />
            <span className="text-white">Rechercher un voyage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from">Départ</Label>
              <Select value={formData.from} onValueChange={(value) => setFormData(prev => ({ ...prev, from: value }))}>
                <SelectTrigger id="from">
                  <SelectValue placeholder="Sélectionnez une ville" />
                </SelectTrigger>
                <SelectContent>
                  {departureCities.map((city: City) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">Destination</Label>
              <Select value={formData.to} onValueChange={(value) => setFormData(prev => ({ ...prev, to: value }))}>
                <SelectTrigger id="to">
                  <SelectValue placeholder="Sélectionnez une ville" />
                </SelectTrigger>
                <SelectContent>
                  {destinationCities.map((city: City) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date de départ</Label>
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP", { locale: fr }) : "Sélectionnez une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, date }));
                      setIsDateOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passengers">Nombre de passagers</Label>
              <Select value={formData.passengers.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, passengers: parseInt(value) }))}>
                <SelectTrigger id="passengers">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "passager" : "passagers"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl ml-10 w-[450px]">
      <CardHeader>
        <CardTitle className="flex text-white items-center space-x-2">
          <Search className="w-5 h-5 text-white" />
          <span className="text-lg text-white">Rechercher un voyage</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* From/To with swap button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center relative">
            <div className="space-y-2">
              <Label htmlFor="from-detailed" className="flex items-center space-x-1 text-white">
                <MapPin className="w-4 h-4" />
                <span>Départ</span>
              </Label>
              <Select value={formData.from} onValueChange={(value) => setFormData(prev => ({ ...prev, from: value, to: '' }))}>
                <SelectTrigger id="from-detailed">
                  <SelectValue placeholder="Ville de départ" />
                </SelectTrigger>
                <SelectContent>
                  {departureCities.map((city: City) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-detailed" className="flex items-center space-x-1 text-white">
                <MapPin className="w-4 h-4" />
                <span>Destination</span>
              </Label>
              <Select value={formData.to} onValueChange={(value) => setFormData(prev => ({ ...prev, to: value }))}>
                <SelectTrigger id="to-detailed">
                  <SelectValue placeholder="Ville de destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinationCities.map((city: City) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Dates */}
          <div className={`grid grid-cols-1 ${formData.tripType === "round-trip" ? "md:grid-cols-2" : ""} gap-4`}>
            <div className="space-y-2">
              <Label className="flex items-center space-x-1 text-white">
                <CalendarIcon className="w-4 h-4" />
                <span>Date de départ</span>
              </Label>
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP", { locale: fr }) : "Sélectionnez une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, date }));
                      setIsDateOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
          </div>
          {/* Passengers */}
          <div className="space-y-2">
            <Label htmlFor="passengers-detailed" className="flex items-center space-x-1 text-white">
              <Users className="w-4 h-4 " />
              <span>Nombre de passagers</span>
            </Label>
            <Select value={formData.passengers.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, passengers: parseInt(value) }))}>
              <SelectTrigger id="passengers-detailed">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "passager" : "passagers"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" size="lg">
            <Search className="w-5 h-5 mr-2" />
            Rechercher des voyages
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
