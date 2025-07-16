import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { BlogCreate, BlogUpdate, BlogResponse, BlogListResponse, BlogWithCategories } from '../../../../shared/src/types/blog';
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

export function useBlogWithCategories(id: string) {
  return useQuery<{ success: boolean; data?: BlogWithCategories }>({
    queryKey: ['blog', id, 'with-categories'],
    queryFn: () => blogService.getByIdWithCategories(id),
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

export function useAddCategoriesToBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogId, categoryIds }: { blogId: string; categoryIds: string[] }) => 
      blogService.addCategoriesToBlog(blogId, categoryIds),
    onSuccess: (_, { blogId }) => {
      queryClient.invalidateQueries({ queryKey: ['blog', blogId, 'with-categories'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}

export function useRemoveCategoriesFromBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (blogId: string) => blogService.removeCategoriesFromBlog(blogId),
    onSuccess: (_, blogId) => {
      queryClient.invalidateQueries({ queryKey: ['blog', blogId, 'with-categories'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
}
