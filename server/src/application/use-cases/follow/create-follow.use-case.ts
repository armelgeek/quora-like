import type { Follow } from '@/domain/models/follow.model'
import type { FollowRepositoryInterface } from '@/domain/repositories/follow.repository.interface'

export class CreateFollowUseCase {
  constructor(private readonly followRepository: FollowRepositoryInterface) {}

  async execute(
    data: Omit<Follow, 'id' | 'createdAt' | 'updatedAt'> & { userId: string }
  ): Promise<{ success: boolean; data?: Follow; error?: string }> {
    try {
      const follow = await this.followRepository.create(data)
      return { success: true, data: follow }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
