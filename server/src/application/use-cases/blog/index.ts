import type { Blog, BlogCreate, BlogUpdate, BlogResponse, BlogListResponse } from '../../../../shared/src/types/blog';
import type { BlogRepository } from '../../../domain/repositories/blog.repository';

export class GetAllBlogsUseCase {
  constructor(private blogRepo: BlogRepository) {}
  async execute(page = 1, limit = 10): Promise<BlogListResponse> {
    return this.blogRepo.getAll(page, limit);
  }
}

export class GetBlogByIdUseCase {
  constructor(private blogRepo: BlogRepository) {}
  async execute(id: string): Promise<BlogResponse> {
    return this.blogRepo.getById(id);
  }
}

export class CreateBlogUseCase {
  constructor(private blogRepo: BlogRepository) {}
  async execute(data: BlogCreate): Promise<BlogResponse> {
    return this.blogRepo.create(data);
  }
}

export class UpdateBlogUseCase {
  constructor(private blogRepo: BlogRepository) {}
  async execute(id: string, data: BlogUpdate): Promise<BlogResponse> {
    return this.blogRepo.update(id, data);
  }
}

export class DeleteBlogUseCase {
  constructor(private blogRepo: BlogRepository) {}
  async execute(id: string): Promise<BlogResponse> {
    return this.blogRepo.deleteById(id);
  }
}
