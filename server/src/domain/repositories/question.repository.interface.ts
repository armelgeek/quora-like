import type { Question } from '../models/question.model'

export interface QuestionRepositoryInterface {
  findById: (id: string) => Promise<Question | null>
  findAll: (pagination?: { skip: number; limit: number }) => Promise<Question[]>
  create: (data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Question>
  update: (id: string, data: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Question>
  delete: (id: string) => Promise<boolean>
  findByUser: (userId: string, pagination?: { skip: number; limit: number }) => Promise<Question[]>
  findByTopic: (topicId: string, pagination?: { skip: number; limit: number }) => Promise<Question[]>
  getFeed: (type: 'recent' | 'popular', pagination?: { skip: number; limit: number }) => Promise<Question[]>
  findByTag: (tagId: string, pagination?: { skip: number; limit: number }) => Promise<Question[]>
  findTags: (questionId: string) => Promise<string[]>
}
