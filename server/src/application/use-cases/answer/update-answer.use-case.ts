import type { Answer } from '@/domain/models/answer.model'
import type { Question } from '@/domain/models/question.model'
import type { User } from '@/domain/models/user.model'
import type { AnswerRepositoryInterface } from '@/domain/repositories/answer.repository.interface'
type EnrichedAnswer = Answer & { user: any | null; question: Question | null }
export class UpdateAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepositoryInterface) {}

  async execute(
    id: string,
    data: Partial<Omit<Answer, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<{ success: boolean; data?: EnrichedAnswer; error?: string }> {
    try {
      await this.answerRepository.update(id, data)
      const answer = await this.answerRepository.findById(id)
      if (answer) {
        return {
          success: true,
          data: {
            ...answer,
            user: 'user' in answer ? ((answer as any).user ?? null) : null,
            question: 'question' in answer ? ((answer as any).question ?? null) : null
          }
        }
      }
      return { success: false, error: 'Not found' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
