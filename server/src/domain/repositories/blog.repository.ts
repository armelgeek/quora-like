import type { Blog, BlogCreate, BlogListResponse, BlogResponse, BlogUpdate } from '../../../../shared/src/types/blog';

export interface BlogRepository {
  getAll: (page?: number, limit?: number) => Promise<BlogListResponse>;
  getById: (id: string) => Promise<BlogResponse>;
  create: (data: BlogCreate) => Promise<BlogResponse>;
  update: (id: string, data: BlogUpdate) => Promise<BlogResponse>;
  deleteById: (id: string) => Promise<BlogResponse>;
}
