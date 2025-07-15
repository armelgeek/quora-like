import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { BlogCreate, BlogUpdate, BlogResponse, BlogListResponse } from '../../../../shared/src/types/blog';
import { blogService } from '../blog.service';

export function useBlogs(page = 1, limit = 10) {
  return useQuery<BlogListResponse>({
    queryKey: ['blogs', page, limit],
    queryFn: () => blogService.getAll(page, limit),
  });
}

export function useBlog(id: string) {
  return useQuery<BlogResponse>({
    queryKey: ['blog', id],
    queryFn: () => blogService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BlogCreate) => blogService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogUpdate }) => blogService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogService.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}
