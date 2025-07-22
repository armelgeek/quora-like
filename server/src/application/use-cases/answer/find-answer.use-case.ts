import type { Answer } from '@/domain/models/answer.model'
import type { Question } from '@/domain/models/question.model'
import type { User } from '@/domain/models/user.model'
import type { AnswerRepositoryInterface } from '@/domain/repositories/answer.repository.interface'
type EnrichedAnswer = Answer & { user: any | null; question: Question | null }
export class FindAnswerUseCase {
  constructor(private readonly answerRepository: AnswerRepositoryInterface) {}

  async execute(id: string): Promise<{ success: boolean; data?: EnrichedAnswer | null; error?: string }> {
    try {
      const answer = await this.answerRepository.findById(id)
      if (!answer) {
        return { success: true, data: null }
      }
      return {
        success: true,
        data: {
          ...answer,
          user: 'user' in answer ? ((answer as any).user ?? null) : null,
          question: 'question' in answer ? ((answer as any).question ?? null) : null
        }
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
