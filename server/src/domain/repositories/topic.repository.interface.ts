import type { Topic } from '../models/topic.model'

export interface TopicRepositoryInterface {
  findById: (id: string) => Promise<Topic | null>
  findByName: (name: string) => Promise<Topic | null>
  findAll: (pagination?: { skip: number; limit: number }) => Promise<Topic[]>
  create: (data: Omit<Topic, 'id' | 'createdAt'>) => Promise<Topic>
  update: (id: string, data: Partial<Omit<Topic, 'id' | 'createdAt'>>) => Promise<Topic>
  delete: (id: string) => Promise<boolean>
}
