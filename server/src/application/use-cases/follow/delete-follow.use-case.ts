import type { FollowRepositoryInterface } from '@/domain/repositories/follow.repository.interface'

export class DeleteFollowUseCase {
  constructor(private readonly followRepository: FollowRepositoryInterface) {}

  async execute(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const deleted = await this.followRepository.delete(id)
      if (!deleted) return { success: false, error: 'Not found' }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
