import type { Comment } from '../models/comment.model'

export interface CommentRepositoryInterface {
  findById: (id: string) => Promise<Comment | null>
  findAll: (pagination?: { skip: number; limit: number }) => Promise<Comment[]>
  create: (data: Omit<Comment, 'id' | 'createdAt'>) => Promise<Comment>
  update: (id: string, data: Partial<Omit<Comment, 'id' | 'createdAt'>>) => Promise<Comment>
  delete: (id: string) => Promise<boolean>
  findByAnswer: (answerId: string, pagination?: { skip: number; limit: number }) => Promise<Comment[]>
  findByUser: (userId: string, pagination?: { skip: number; limit: number }) => Promise<Comment[]>
}
