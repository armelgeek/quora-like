import type { Question } from '@/domain/models/question.model'
import type { Topic } from '@/domain/models/topic.model'
import type { User } from '@/domain/models/user.model'
import type { QuestionRepositoryInterface } from '@/domain/repositories/question.repository.interface'
type EnrichedQuestion = Question & { user: any | null; topic: Topic | null; answersCount: number; votesCount: number }
export class FindAllQuestionsUseCase {
  constructor(private readonly questionRepository: QuestionRepositoryInterface) {}

  async execute(pagination: { skip: number; limit: number }): Promise<{
    success: boolean
    data: EnrichedQuestion[]
    error?: string
  }> {
    try {
      const questions = await this.questionRepository.findAll(pagination)
      return {
        success: true,
        data: questions.map((q) => ({
          ...q,
          user: 'user' in q ? (q.user as any | null) : null,
          topic: 'topic' in q ? (q.topic as Topic | null) : null,
          answersCount: 'answersCount' in q ? Number(q.answersCount) : 0,
          votesCount: 'votesCount' in q ? Number(q.votesCount) : 0
        }))
      }
    } catch (error: any) {
      return { success: false, data: [], error: error.message }
    }
  }
}
