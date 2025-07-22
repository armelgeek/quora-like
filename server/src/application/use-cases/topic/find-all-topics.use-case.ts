import type { Topic } from '@/domain/models/topic.model'
import type { TopicRepositoryInterface } from '@/domain/repositories/topic.repository.interface'

export class FindAllTopicsUseCase {
  constructor(private readonly topicRepository: TopicRepositoryInterface) {}

  async execute(params: { skip: number; limit: number }): Promise<{ success: boolean; data: Topic[] }> {
    const data = await this.topicRepository.findAll(params)
    return { success: true, data }
  }
}
