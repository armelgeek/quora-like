import { IUseCase } from '@/domain/types/use-case.type'
import type { Poll } from '@/domain/models/poll.model'
import type { PollRepositoryInterface } from '@/domain/repositories/poll.repository.interface'

export class CreatePollUseCase {
  constructor(private readonly pollRepository: PollRepositoryInterface) {}

  async execute(params: { questionId: string; options: { text: string }[] }) {
    try {
      const poll = await this.pollRepository.create(params)
      return { success: true, data: poll }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
