import type { TopicRepositoryInterface } from '@/domain/repositories/topic.repository.interface'

export class DeleteTopicUseCase {
  constructor(private readonly topicRepository: TopicRepositoryInterface) {}

  async execute(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const deleted = await this.topicRepository.delete(id)
      if (!deleted) return { success: false, error: 'Not found' }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
