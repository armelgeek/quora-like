import type { Follow } from '@/domain/models/follow.model'
import type { FollowRepositoryInterface } from '@/domain/repositories/follow.repository.interface'

export class FindFollowUseCase {
  constructor(private readonly followRepository: FollowRepositoryInterface) {}

  async execute(id: string): Promise<{ success: boolean; data?: Follow; error?: string }> {
    const data = await this.followRepository.findById(id)
    if (!data) return { success: false, error: 'Not found' }
    return { success: true, data }
  }
}
