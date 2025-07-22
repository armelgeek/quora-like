import type { Answer } from '@/domain/models/answer.model'
import type { Question } from '@/domain/models/question.model'
import type { AnswerRepositoryInterface } from '@/domain/repositories/answer.repository.interface'
type EnrichedAnswer = Answer & { user: any | null; question: Question | null }
export class CreateAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepositoryInterface) {}

  async execute(
    data: Omit<Answer, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; data?: EnrichedAnswer; error?: string }> {
    try {
      const created = await this.answerRepository.create(data)
      const answer = await this.answerRepository.findById(created.id)
      if (answer) {
        return {
          success: true,
          data: {
            ...answer,
            user: 'user' in answer ? (answer.user as any | null) : null,
            question: 'question' in answer ? (answer.question as Question | null) : null
          }
        }
      }
      return { success: false, error: 'Not found' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
