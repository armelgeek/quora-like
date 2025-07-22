
import type { Question } from '@/domain/models/question.model'
import type { Topic } from '@/domain/models/topic.model'
import type { User } from '@/domain/models/user.model'
import type { QuestionRepositoryInterface } from '@/domain/repositories/question.repository.interface'
type EnrichedQuestion = Question & { user: any | null; topic: Topic | null }
export class CreateQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepositoryInterface) {}

  async execute(data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
    success: boolean
    data?: EnrichedQuestion
    error?: string
  }> {
    try {
      const created = await this.questionRepository.create(data)
      const question = await this.questionRepository.findById(created.id)
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
      return { success: false, error: 'Not found' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
