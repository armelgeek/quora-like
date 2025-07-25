
import type { Vote } from '../models/vote.model'

export interface VoteRepositoryInterface {
  findById: (id: string) => Promise<Vote | null>
  findAll: (pagination?: { skip: number; limit: number }) => Promise<Vote[]>
  create: (data: Omit<Vote, 'id' | 'createdAt'>) => Promise<Vote>
  update: (id: string, data: Partial<Omit<Vote, 'id' | 'createdAt'>>) => Promise<Vote>
  delete: (id: string) => Promise<boolean>;
  findByAnswer: (answerId: string) => Promise<Vote[]>
  findByQuestion: (questionId: string) => Promise<Vote[]>
  findByUser: (userId: string) => Promise<Vote[]>
  getVoteCountByAnswer: (answerId: string) => Promise<number>
  getVoteCountByQuestion: (questionId: string) => Promise<number>
}
