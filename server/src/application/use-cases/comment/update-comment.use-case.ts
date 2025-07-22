import type { Answer } from '@/domain/models/answer.model'
import type { Comment } from '@/domain/models/comment.model'
import type { Question } from '@/domain/models/question.model'
import type { User } from '@/domain/models/user.model'
import type { CommentRepositoryInterface } from '@/domain/repositories/comment.repository.interface'
type EnrichedComment = Comment & { user: any | null; answer: (Answer & { question: Question | null }) | null }
export class UpdateCommentUseCase {
  constructor(private readonly commentRepository: CommentRepositoryInterface) {}

  async execute(id: string, data: Partial<Omit<Comment, 'id' | 'createdAt'>>): Promise<{ success: boolean; data?: EnrichedComment; error?: string }> {
    try {
      await this.commentRepository.update(id, data)
      const comment = await this.commentRepository.findById(id)
      if (comment) {
        return { success: true, data: comment }
      }
      return { success: false, error: 'Not found' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
