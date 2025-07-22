import type { Topic } from '@/domain/models/topic.model'
import type { TopicRepositoryInterface } from '@/domain/repositories/topic.repository.interface'

export class FindTopicUseCase {
  constructor(private readonly topicRepository: TopicRepositoryInterface) {}

  async execute(id: string): Promise<{ success: boolean; data?: Topic; error?: string }> {
    const data = await this.topicRepository.findById(id)
    if (!data) return { success: false, error: 'Not found' }
    return { success: true, data }
  }
}
