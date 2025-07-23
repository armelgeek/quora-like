import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import type { Poll, PollOption } from '@/domain/models/poll.model'
import type { PollRepositoryInterface } from '@/domain/repositories/poll.repository.interface'
import { db } from '../database/db/index'
import { pollVotes } from '../database/schema/poll-vote.schema'
import { pollOptions, polls } from '../database/schema/quora.schema'

export class PollRepository implements PollRepositoryInterface {
  async findByQuestionId(questionId: string): Promise<Poll | null> {
    const pollRow = await db.query.polls.findFirst({ where: eq(polls.questionId, questionId) })
    if (!pollRow) return null
    const options = await db.query.pollOptions.findMany({ where: eq(pollOptions.pollId, pollRow.id) })
    return {
      id: pollRow.id,
      questionId: pollRow.questionId,
      options: options.map((o) => ({
        id: o.id,
        text: o.text,
        questionId: pollRow.questionId,
        votesCount: o.votesCount
      })),
      createdAt: pollRow.createdAt,
      updatedAt: pollRow.updatedAt
    }
  }

  async create(data: { questionId: string; options: { text: string }[] }): Promise<Poll> {
    const pollId = randomUUID()
    const now = new Date()
    await db.insert(polls).values({ id: pollId, questionId: data.questionId, createdAt: now, updatedAt: now })
    const optionsToInsert = data.options.map((opt) => ({ id: randomUUID(), pollId, text: opt.text, votesCount: 0 }))
    await db.insert(pollOptions).values(optionsToInsert)
    const options = optionsToInsert.map((o) => ({ id: o.id, questionId: data.questionId, text: o.text, votesCount: 0 }))
    return {
      id: pollId,
      questionId: data.questionId,
      options,
      createdAt: now,
      updatedAt: now
    }
  }

  async vote(optionId: string, userId: string): Promise<void> {
    // Récupérer le pollId
    const option = await db.query.pollOptions.findFirst({ where: eq(pollOptions.id, optionId) })
    if (!option) throw new Error('Option not found')
    const pollId = option.pollId
    // Vérifier si l'utilisateur a déjà voté pour ce poll
    const existing = await db.query.pollVotes.findFirst({
      where: and(eq(pollVotes.pollId, pollId), eq(pollVotes.userId, userId))
    })
    if (existing) throw new Error('User already voted')
    // Incrémenter le compteur et enregistrer le vote
    await db.insert(pollVotes).values({ id: randomUUID(), pollId, optionId, userId })
    await db
      .update(pollOptions)
      .set({ votesCount: (option.votesCount ?? 0) + 1 })
      .where(eq(pollOptions.id, optionId))
  }

  async getVotes(pollId: string): Promise<{ optionId: string; votesCount: number }[]> {
    const options = await db.query.pollOptions.findMany({ where: eq(pollOptions.pollId, pollId) })
    return options.map((o) => ({ optionId: o.id, votesCount: o.votesCount }))
  }
}
