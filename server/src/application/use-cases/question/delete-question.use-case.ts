import type { QuestionRepositoryInterface } from '@/domain/repositories/question.repository.interface'

export class DeleteQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepositoryInterface) {}

  async execute(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const deleted = await this.questionRepository.delete(id)
      if (!deleted) return { success: false, error: 'Not found' }
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
