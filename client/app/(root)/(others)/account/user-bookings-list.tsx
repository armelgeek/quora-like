"use client";

import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/features/booking/booking.service";
import { Skeleton } from "@/shared/components/atoms/ui/skeleton";

export function UserBookingsList({ user }: { user: { email?: string } }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-bookings", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      // On suppose que l'API accepte un filtre ?userEmail=...
      return bookingService.fetchItems({ userEmail: user.email });
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <Skeleton className="h-32 w-full" />;
  if (error) return <div className="text-destructive">Erreur lors du chargement des réservations</div>;

  // Supporte data = array ou data = { data: array, meta }
  const bookings = Array.isArray(data) ? data : data?.data || [];
  if (!bookings.length) return <div>Aucune réservation trouvée.</div>;

  return (
    <div className="space-y-4">
      {bookings.map((booking: {
        id: string;
        routeLabel: string;
        departureDate: string | Date;
        seatNumbers: string;
        status: string;
        totalPrice: string;
      }) => {
        const dateStr = typeof booking.departureDate === 'string' ? booking.departureDate : booking.departureDate.toLocaleString();
        return (
          <div key={booking.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div className="font-semibold">{booking.routeLabel}</div>
              <div className="text-sm text-muted-foreground">Départ : {dateStr}</div>
              <div className="text-sm text-muted-foreground">Places : {booking.seatNumbers}</div>
              <div className="text-sm text-muted-foreground">Statut : {booking.status}</div>
            </div>
            <div className="font-bold">{booking.totalPrice} €</div>
          </div>
        );
      })}
    </div>
  );
}
