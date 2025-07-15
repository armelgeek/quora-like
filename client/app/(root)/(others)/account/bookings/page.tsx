"use client";
import type { Booking } from '@/features/booking/booking.schema';
import { useQueryState, parseAsString, parseAsJson, parseAsInteger } from 'nuqs';
import { BookingFilters, BookingCard } from '@/features/booking/components';
import { Skeleton } from '@/shared/components/atoms/ui/skeleton';
import { BookingStats } from '@/features/booking/components/BookingStats';
import { userBookingService } from '@/features/booking/booking-user.service';
import { useEntityQuery } from '@/shared/hooks/use-entity-query';
import { Breadcrumb } from '@/shared/components/atoms/ui/breadcrumb';
import Link from 'next/link';

export default function BookingAdminPage() {
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''));
  const [dateRange, setDateRange] = useQueryState(
    'dateRange',
    parseAsJson<{ from?: string; to?: string }>(() => ({})).withDefault({})
  );
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [limit] = useQueryState('limit', parseAsInteger.withDefault(10));

  const filters = {
    status: status || '',
    dateStart: dateRange?.from ? dateRange.from : '',
    dateEnd: dateRange?.to ? dateRange.to : '',
    page,
    limit,
  };

  const {
    data,
    isLoading,
    error
  } = useEntityQuery({
    service: userBookingService,
    queryKey: ['client-bookings'],
    params: filters
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-8">

        <div className="flex items-center gap-3 mb-1">
          <Skeleton className="w-8 h-8 rounded-full bg-primary/20" />
          <Skeleton className="h-8 w-48 bg-primary/10" />
        </div>
        <Skeleton className="h-5 w-96 mb-4 bg-primary/10" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-9 w-20 rounded" />
          <Skeleton className="h-9 w-20 rounded" />
          <Skeleton className="h-9 w-32 rounded" />
        </div>
        <div className="space-y-6 mt-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl bg-primary/10" />
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-8">

        <div className="text-red-600">Erreur lors du chargement des réservations</div>
      </div>
    );
  }

  const bookingItems =
    data && typeof data === 'object' && data !== null && 'data' in data && Array.isArray((data as { data: unknown }).data)
      ? (data as { data: Booking[] }).data
      : [];

  type BookingStatsType = {
    totalTrips: number;
    confirmedTrips: number;
    completedTrips: number;
    totalSpent: number;
  };

  const stats: BookingStatsType =
    data && typeof data === 'object' && 'stats' in data && (data as { stats?: BookingStatsType }).stats
      ? (data as { stats: BookingStatsType }).stats
      : {
        totalTrips: 0,
        confirmedTrips: 0,
        completedTrips: 0,
        totalSpent: 0,
      };

  type PaginationType = { page: number; limit: number; total: number };

  const pagination =
    data && typeof data === 'object' && 'pagination' in data && (data as { pagination?: PaginationType }).pagination
      ? (data as { pagination: PaginationType }).pagination
      : { page: 1, limit: 10, total: 0 };

  return (
    <div className="flex flex-col gap-3 p-8">
      <Breadcrumb className='mb-4'>
        <Link href="/" className="text-primary hover:underline">Accueil</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href="/account" className="text-primary hover:underline">Mon compte</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span>Mes réservations</span>
      </Breadcrumb>
      <div className="flex items-center w-full gap-3 mb-1">
        <BookingStats
          totalTrips={stats.totalTrips}
          confirmedTrips={stats.confirmedTrips}
          completedTrips={stats.completedTrips}
          totalSpent={stats.totalSpent}
        />
      </div>

      <BookingFilters
        status={status}
        setStatus={setStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <div className="space-y-6">
        {bookingItems && bookingItems.length > 0 ? (
          bookingItems.map((booking: Booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              showUser={false}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center py-12">Aucune réservation trouvée.</div>
        )}
      </div>

      {pagination.total > pagination.limit && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded border bg-white shadow text-sm font-medium disabled:opacity-50"
              onClick={() => setPage(Math.max(1, pagination.page - 1))}
              disabled={pagination.page <= 1}
              aria-label="Page précédente"
            >
              Précédent
            </button>
            <span className="text-sm font-semibold">
              Page {pagination.page} / {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <button
              className="px-3 py-2 rounded border bg-white shadow text-sm font-medium disabled:opacity-50"
              onClick={() => setPage(Math.min(Math.ceil(pagination.total / pagination.limit), pagination.page + 1))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              aria-label="Page suivante"
            >
              Suivant
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
