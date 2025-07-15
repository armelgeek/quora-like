import { useQuery, useMutation, QueryKey } from '@tanstack/react-query';
import BaseService from '../lib/services/base-service';

export function useEntityQuery<T, TVariables = unknown, TSelected = T>({
  service,
  queryKey,
  params,
  enabled = true,
  mutationFn,
  mutationOptions,
  select,
}: {
  service: BaseService;
  queryKey: QueryKey;
  params?: Record<string, unknown>;
  enabled?: boolean;
  mutationFn?: (variables: TVariables) => Promise<unknown>;
  mutationOptions?: Record<string, unknown>;
  select?: (data: T) => TSelected;
}) {
  const query = useQuery<T, Error, TSelected>({
    queryKey: [queryKey, params],
    queryFn: () => service.get<T>('', params as Record<string, string> | undefined).then(r => r.data),
    enabled,
    select,
  });
  const mutation = useMutation({
    mutationFn: mutationFn ?? ((variables: TVariables) => service.post('', variables)),
    ...mutationOptions,
    onSuccess: mutationOptions && typeof mutationOptions.onSuccess === 'function'
      ? (...args: unknown[]) => (mutationOptions.onSuccess as (...args: unknown[]) => void)(...args)
      : undefined,
  });
  const update = useMutation({
    mutationFn: (variables: TVariables & { id: string }) => service.put(`/${variables.id}`, variables),
    ...mutationOptions,
  });
  const remove = useMutation({
    mutationFn: (id: string) => service.delete(`/${id}`),
    ...mutationOptions,
  });
  const patch = useMutation({
    mutationFn: (variables: TVariables & { id: string }) => service.patch(`/${variables.id}`, variables),
    ...mutationOptions,
  });
  return { ...query, mutation, update, remove, patch };
}
