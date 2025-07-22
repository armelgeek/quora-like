import type { Answer } from '../models/answer.model'

export interface AnswerRepositoryInterface {
  findById: (id: string) => Promise<Answer | null>
  findAll: (pagination?: { skip: number; limit: number }) => Promise<Answer[]>
  create: (data: Omit<Answer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Answer>
  update: (id: string, data: Partial<Omit<Answer, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Answer>
  delete: (id: string) => Promise<boolean>
  findByQuestion: (questionId: string, pagination?: { skip: number; limit: number }) => Promise<Answer[]>
  findByUser: (userId: string, pagination?: { skip: number; limit: number }) => Promise<Answer[]>
  findByParentAnswer: (parentAnswerId: string, pagination?: { skip: number; limit: number }) => Promise<Answer[]>
}
