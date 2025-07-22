import type { Topic } from '@/domain/models/topic.model'
import type { TopicRepositoryInterface } from '@/domain/repositories/topic.repository.interface'

export class CreateTopicUseCase {
  constructor(private readonly topicRepository: TopicRepositoryInterface) {}

  async execute(
    data: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'> & { userId: string }
  ): Promise<{ success: boolean; data?: Topic; error?: string }> {
    try {
      const topic = await this.topicRepository.create(data)
      return { success: true, data: topic }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
