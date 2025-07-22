import type { Question } from '@/domain/models/question.model'
import type { Topic } from '@/domain/models/topic.model'
import type { User } from '@/domain/models/user.model'
import type { QuestionRepositoryInterface } from '@/domain/repositories/question.repository.interface'
type EnrichedQuestion = Question & { user: any | null; topic: Topic | null }
export class FindQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepositoryInterface) {}

  async execute(id: string): Promise<{
    success: boolean
    data?: EnrichedQuestion | null
    error?: string
  }> {
    try {
      const question = await this.questionRepository.findById(id)
      if (question) {
        return {
          success: true,
          data: {
            ...question,
            user: 'user' in question ? (question.user as any | null) : null,
            topic: 'topic' in question ? (question.topic as Topic | null) : null
          }
        }
      }
      return { success: true, data: null }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
