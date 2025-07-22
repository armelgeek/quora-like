import type { Vote } from '@/domain/models/vote.model'
import type { VoteRepositoryInterface } from '@/domain/repositories/vote.repository.interface'
import { AnswerRepository } from '@/infrastructure/repositories/answer.repository'
import { QuestionRepository } from '@/infrastructure/repositories/question.repository'

export class CreateVoteUseCase {
  constructor(private readonly voteRepository: VoteRepositoryInterface) {}

  async execute(
    data: Omit<Vote, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; data?: Vote; error?: string }> {
    try {
      // Validation stricte : un seul des deux doit être défini
      const hasQuestion = !!data.questionId
      const hasAnswer = !!data.answerId
      if ((hasQuestion && hasAnswer) || (!hasQuestion && !hasAnswer)) {
        return {
          success: false,
          error: 'Un seul des champs questionId ou answerId doit être défini.'
        }
      }
      // Si c'est un vote sur une question, vérifier existence et update si déjà existant
      if (hasQuestion) {
        const questionRepo = new QuestionRepository()
        const question = await questionRepo.findById(data.questionId!)
        if (!question) {
          return { success: false, error: "La question n'existe pas." }
        }
        const existingVotes = await this.voteRepository.findByQuestion(data.questionId!)
        const existing = existingVotes.find((v: Vote) => v.userId === data.userId)
        if (existing) {
          if (existing.value === data.value) {
            await this.voteRepository.delete(existing.id)
            return { success: true, data: undefined }
          } else {
            const updated = await this.voteRepository.update(existing.id, { value: data.value })
            return { success: true, data: updated }
          }
        }
      }
      // Si c'est un vote sur une réponse, vérifier existence et update si déjà existant
      if (hasAnswer) {
        const answerRepo = new AnswerRepository()
        const answer = await answerRepo.findById(data.answerId!)
        if (!answer) {
          return { success: false, error: "La réponse n'existe pas." }
        }
        const existingVotes = await this.voteRepository.findByAnswer(data.answerId!)
        const existing = existingVotes.find((v: Vote) => v.userId === data.userId)
        if (existing) {
          if (existing.value === data.value) {
            await this.voteRepository.delete(existing.id)
            return { success: true, data: undefined }
          } else {
            const updated = await this.voteRepository.update(existing.id, { value: data.value })
            return { success: true, data: updated }
          }
        }
      }
      const vote = await this.voteRepository.create(data)
      return { success: true, data: vote }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}
