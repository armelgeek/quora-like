import type { VoteRepositoryInterface } from '@/domain/repositories/vote.repository.interface'

export class DeleteVoteUseCase {
  constructor(private readonly voteRepository: VoteRepositoryInterface) {}

  async execute(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const deleted = await this.voteRepository.delete(id)
      if (!deleted) return { success: false, error: 'Not found' }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
