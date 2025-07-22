import type { Topic } from '@/domain/models/topic.model'
import type { TopicRepositoryInterface } from '@/domain/repositories/topic.repository.interface'

export class UpdateTopicUseCase {
  constructor(private readonly topicRepository: TopicRepositoryInterface) {}

  async execute(
    id: string,
    data: Partial<Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<{ success: boolean; data?: Topic; error?: string }> {
    try {
      await this.topicRepository.update(id, data)
      const topic = await this.topicRepository.findById(id)
      if (!topic) return { success: false, error: 'Not found' }
      return { success: true, data: topic }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
