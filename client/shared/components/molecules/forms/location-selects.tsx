"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/ui/select';
import { useDepartureCities, useDestinations } from '@/features/location/hooks/use-location';
import type { City } from '@/features/location/location.schema';

export function DepartureSelect({ value, onChange, id = 'from-detailed', placeholder = 'Ville de départ' }: { value: string; onChange: (v: string) => void; id?: string; placeholder?: string }) {
  const { data: departureCities = [] } = useDepartureCities();
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {departureCities.map((city: City) => (
          <SelectItem key={city} value={city}>{city}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function DestinationSelect({ from, value, onChange, id = 'to-detailed', placeholder = 'Ville de destination' }: { from: string; value: string; onChange: (v: string) => void; id?: string; placeholder?: string }) {
  const { data: destinationCities = [] } = useDestinations(from);
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {destinationCities.map((city: City) => (
          <SelectItem key={city} value={city}>{city}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
