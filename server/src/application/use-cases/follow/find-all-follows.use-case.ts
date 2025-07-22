import type { Follow } from '@/domain/models/follow.model'
import type { FollowRepositoryInterface } from '@/domain/repositories/follow.repository.interface'

export class FindAllFollowsUseCase {
  constructor(private readonly followRepository: FollowRepositoryInterface) {}

  async execute(params: { skip: number; limit: number }): Promise<{ success: boolean; data: Follow[] }> {
    const data = await this.followRepository.findAll(params)
    return { success: true, data }
  }
}
