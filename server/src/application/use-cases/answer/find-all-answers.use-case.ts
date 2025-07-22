import type { Answer } from '@/domain/models/answer.model'
import type { Question } from '@/domain/models/question.model'
import type { User } from '@/domain/models/user.model'
import type { AnswerRepositoryInterface } from '@/domain/repositories/answer.repository.interface'
type EnrichedAnswer = Answer & { user: any | null; question: Question | null }
export class FindAllAnswersUseCase {
  constructor(private readonly answerRepository: AnswerRepositoryInterface) {}

  async execute(pagination: {
    skip: number
    limit: number
  }): Promise<{ success: boolean; data: EnrichedAnswer[]; error?: string }> {
    try {
      const answers = await this.answerRepository.findAll(pagination)
      return {
        success: true,
        data: answers.map((answer) => ({
          ...answer,
          user: 'user' in answer ? ((answer as any).user ?? null) : null,
          question: 'question' in answer ? ((answer as any).question ?? null) : null
        }))
      }
    } catch (error: any) {
      return { success: false, data: [], error: error.message }
    }
  }
}
