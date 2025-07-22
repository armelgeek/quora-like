import type { Answer } from '@/domain/models/answer.model'
import type { Comment } from '@/domain/models/comment.model'
import type { Question } from '@/domain/models/question.model'
import type { User } from '@/domain/models/user.model'
import type { CommentRepositoryInterface } from '@/domain/repositories/comment.repository.interface'
type EnrichedComment = Comment & { user: any | null; answer: (Answer & { question: Question | null }) | null }
export class FindCommentUseCase {
  constructor(private readonly commentRepository: CommentRepositoryInterface) {}

  async execute(id: string): Promise<{ success: boolean; data?: EnrichedComment | null; error?: string }> {
    try {
      const comment = await this.commentRepository.findById(id)
      if (comment) {
        return {
          success: true,
          data: {
            ...comment,
            user: 'user' in comment ? ((comment as any).user ?? null) : null,
            answer: 'answer' in comment ? ((comment as any).answer ?? null) : null
          }
        }
      }
      return { success: true, data: null }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
