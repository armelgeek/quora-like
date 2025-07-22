import type { AnswerRepositoryInterface } from '@/domain/repositories/answer.repository.interface'
export class DeleteAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepositoryInterface) {}

  async execute(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const deleted = await this.answerRepository.delete(id)
      if (!deleted) return { success: false, error: 'Not found' }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
