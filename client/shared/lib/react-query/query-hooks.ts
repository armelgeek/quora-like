import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
    QueryKey,
    UseQueryOptions
  } from '@tanstack/react-query';
  import { toast } from 'sonner';
  import { PaginatedResponse } from '@/shared/lib/types/pagination';
  import { Filter } from '@/shared/lib/types/filter';
  import { BaseService } from '@/shared/domain/base.service';
  export function useCustomQuery<TData, TParams = void>(
    queryKey: QueryKey,
    queryFn: (params: TParams) => Promise<TData>,
    params: TParams,
    options?: Omit<UseQueryOptions<TData, Error, TData, QueryKey>, 'queryKey' | 'queryFn'>
  ) {
    return useQuery({
      queryKey,
      queryFn: () => queryFn(params),
      ...options
    });
  }
  export function useCustomMutation<TData, TParams>(
    mutationFn: (params: TParams) => Promise<TData>,
    options?: {
      onSuccessMessage?: string;
      onErrorMessage?: string;
      invalidateQueries?: QueryKey[];
      onSuccess?: (data: TData) => void;
      onError?: (error: Error) => void;
    }
  ) {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn,
      onSuccess: (data) => {
        if (options?.invalidateQueries) {
          options.invalidateQueries.forEach(queryKey => {
            queryClient.invalidateQueries({ queryKey });
          });
        }
        
        if (options?.onSuccessMessage) {
          toast.success(options.onSuccessMessage);
        }
        
        options?.onSuccess?.(data);
      },
      onError: (error: Error) => {
        if (options?.onErrorMessage) {
          toast.error(options.onErrorMessage);
        } else {
          toast.error(`Erreur: ${error.message}`);
        }
  
        options?.onError?.(error);
      }
    });
  }
  export function useList<T>(
    queryKeys: { list: (filters: Filter) => QueryKey },
    service: Pick<BaseService<T, unknown>, 'list'>,
    filters: Filter
  ) {
    const { data, isLoading } = useQuery({
      queryKey: queryKeys.list(filters),
      queryFn: () => service.list(filters),
      placeholderData: keepPreviousData,
    });
  
    const pageSize = filters.pageSize || 10;
    const response = data as PaginatedResponse<T> | undefined;
    const items = response?.data ?? [];
    const total = response?.total ?? 0;
    const totalPages = Math.ceil(total / pageSize);
  
    return {
      data: items,
      meta: {
        total,
        totalPages,
        pageSize,
        page: filters.page || 1
      },
      isLoading,
    };
  }
  
  export function useDetail<T>(
    queryKeys: { detail: (slug: string) => QueryKey },
    service: Pick<BaseService<T, unknown>, 'detail'>,
    slug: string
  ) {
    const { data, isLoading } = useQuery({
      queryKey: queryKeys.detail(slug),
      queryFn: () => service.detail(slug),
      enabled: !!slug,
    });
  
    return {
      data,
      isLoading,
    };
  }
  
  
  export interface MutationConfig<T, P> {
    service: Pick<BaseService<T, P>, 'create' | 'update' | 'remove'>;
    queryKeys: { lists: () => QueryKey };
    successMessages?: {
      create?: string;
      update?: string;
      delete?: string;
    };
    callbacks?: {
      onCreateSuccess?: () => void;
      onUpdateSuccess?: () => void;
      onDeleteSuccess?: () => void;
    };
  }
  
  export function useMutations<T, P>(config: MutationConfig<T, P>) {
    const queryClient = useQueryClient();
    const { service, queryKeys, successMessages, callbacks } = config;
  
    const defaultMessages = {
      create: 'Élément créé avec succès',
      update: 'Élément mis à jour avec succès',
      delete: 'Élément supprimé avec succès'
    };
  
    const messages = {
      ...defaultMessages,
      ...successMessages
    };
  
    const handleSuccess = (type: 'create' | 'update' | 'delete') => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
  
      toast.success(messages[type]);
  
      if (type === 'create' && callbacks?.onCreateSuccess) {
        callbacks.onCreateSuccess();
      } else if (type === 'update' && callbacks?.onUpdateSuccess) {
        callbacks.onUpdateSuccess();
      } else if (type === 'delete' && callbacks?.onDeleteSuccess) {
        callbacks.onDeleteSuccess();
      }
    };
  
    const createMutation = useMutation({
      mutationFn: (data: P) => service.create(data),
      onSuccess: () => handleSuccess('create'),
      onError: (error: Error) => {
        toast.error(`Erreur lors de la création: ${error.message}`);
      },
    });
  
    const updateMutation = useMutation({
      mutationFn: ({ slug, data }: { slug: string; data: P }) =>
        service.update(slug, data),
      onSuccess: () => handleSuccess('update'),
      onError: (error: Error) => {
        toast.error(`Erreur lors de la mise à jour: ${error.message}`);
      },
    });
  
    const deleteMutation = useMutation({
      mutationFn: (slug: string) => service.remove(slug),
      onSuccess: () => handleSuccess('delete'),
      onError: (error: Error) => {
        toast.error(`Erreur lors de la suppression: ${error.message}`);
      },
    });
  
    
  
    return {
      create: createMutation.mutate,
      update: updateMutation.mutate,
      remove: deleteMutation.mutate,
      isCreating: createMutation.isPending,
      isUpdating: updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
      useCustomQuery,
      useCustomMutation,
      invalidate: (queryKey: QueryKey) => queryClient.invalidateQueries({ queryKey })
    };
  }
  