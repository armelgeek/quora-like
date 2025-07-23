import type { Question } from '@/domain/models/question.model'
import type { Topic } from '@/domain/models/topic.model'
import type { User } from '@/domain/models/user.model'
import type { PollRepositoryInterface } from '@/domain/repositories/poll.repository.interface'
import type { QuestionRepositoryInterface } from '@/domain/repositories/question.repository.interface'
type EnrichedQuestion = Question & { user: any | null; topic: Topic | null }

export class CreateQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionRepositoryInterface,
    private readonly pollRepository: PollRepositoryInterface
  ) {}

  async execute(
    data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'> & { pollOptions?: { value: string }[] }
  ): Promise<{
    success: boolean
    data?: EnrichedQuestion
    error?: string
  }> {
    try {
      const created = await this.questionRepository.create(data)
      // Si c'est un sondage, créer le poll et ses options
      if (data.type === 'poll' && Array.isArray(data.pollOptions) && data.pollOptions.length >= 2) {
        await this.pollRepository.create({
          questionId: created.id,
          options: data.pollOptions.map((opt) => ({ text: opt.value }))
        })
      }
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
