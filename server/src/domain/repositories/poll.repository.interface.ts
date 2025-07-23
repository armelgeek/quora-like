import type { Poll } from '../models/poll.model'

export interface PollRepositoryInterface {
  findByQuestionId: (questionId: string) => Promise<Poll | null>
  create: (data: { questionId: string; options: { text: string }[] }) => Promise<Poll>
  vote: (optionId: string, userId: string) => Promise<void>
  getVotes: (pollId: string) => Promise<{ optionId: string; votesCount: number }[]>
}
