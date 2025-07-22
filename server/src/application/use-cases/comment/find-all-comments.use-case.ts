import type { Answer } from '@/domain/models/answer.model'
import type { Comment } from '@/domain/models/comment.model'
import type { Question } from '@/domain/models/question.model'
import type { User } from '@/domain/models/user.model'
import type { CommentRepositoryInterface } from '@/domain/repositories/comment.repository.interface'
type EnrichedComment = Comment & { user: any | null; answer: (Answer & { question: Question | null }) | null }
export class FindAllCommentsUseCase {
  constructor(private readonly commentRepository: CommentRepositoryInterface) {}

  async execute(pagination: {
    skip: number
    limit: number
  }): Promise<{ success: boolean; data: EnrichedComment[]; error?: string }> {
    try {
      const comments = await this.commentRepository.findAll(pagination)
      const enrichedComments: EnrichedComment[] = comments.map((comment) => ({
        ...comment,
        user: 'user' in comment ? ((comment as any).user ?? null) : null,
        answer: 'answer' in comment ? ((comment as any).answer ?? null) : null
      }))
      return { success: true, data: enrichedComments }
    } catch (error: any) {
      return { success: false, data: [], error: error.message }
    }
  }
}
