// ...existing code...
import { eq } from 'drizzle-orm'
import type { Answer } from '@/domain/models/answer.model'
import type { Question } from '@/domain/models/question.model'
import type { UserType } from '@/domain/models/user.model'
import type { AnswerRepositoryInterface } from '@/domain/repositories/answer.repository.interface'
import { db } from '../database/db/index'
import { users } from '../database/schema/auth'
import { answers, questions } from '../database/schema/quora.schema'
import { VoteRepository } from './vote.repository'

export class AnswerRepository implements AnswerRepositoryInterface {
  async findByParentAnswer(
    parentAnswerId: string,
    pagination?: { skip: number; limit: number }
  ): Promise<(Answer & { question: Question | null; user: UserType | null; votesCount: number })[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({
        answer: answers,
        question: questions,
        user: users
      })
      .from(answers)
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .leftJoin(users, eq(answers.userId, users.id))
      .where(eq(answers.parentAnswerId, parentAnswerId))
      .offset(skip)
      .limit(limit)
    const voteRepo = new VoteRepository()
    return Promise.all(
      results.map(async (row) => {
        const base = this.mapWithQuestionAndUser(row)
        const votesCount = await voteRepo.getVoteCountByAnswer(base.id)
        return { ...base, votesCount }
      })
    )
  }
  async findById(
    id: string
  ): Promise<(Answer & { question: Question | null; user: UserType | null; votesCount: number }) | null> {
    const result = await db
      .select({
        answer: answers,
        question: questions,
        user: users
      })
      .from(answers)
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .leftJoin(users, eq(answers.userId, users.id))
      .where(eq(answers.id, id))
      .limit(1)
    if (!result.length) return null
    const base = this.mapWithQuestionAndUser(result[0])
    const votesCount = await new VoteRepository().getVoteCountByAnswer(base.id)
    return { ...base, votesCount }
  }

  async findAll(pagination?: {
    skip: number
    limit: number
  }): Promise<(Answer & { question: Question | null; user: UserType | null; votesCount: number })[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({
        answer: answers,
        question: questions,
        user: users
      })
      .from(answers)
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .leftJoin(users, eq(answers.userId, users.id))
      .offset(skip)
      .limit(limit)
    const voteRepo = new VoteRepository()
    return Promise.all(
      results.map(async (row) => {
        const base = this.mapWithQuestionAndUser(row)
        const votesCount = await voteRepo.getVoteCountByAnswer(base.id)
        return { ...base, votesCount }
      })
    )
  }

  async create(data: Omit<Answer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Answer> {
  const id = crypto.randomUUID()
  const now = new Date()
  await db.insert(answers).values({ ...data, id, createdAt: now, updatedAt: now })
  return { ...data, id, createdAt: now, updatedAt: now }
  }

  async update(
    id: string,
    data: Partial<Omit<Answer, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Answer & { question: Question | null; user: UserType | null; votesCount: number }> {
    const now = new Date()
    await db
      .update(answers)
      .set({ ...data, updatedAt: now })
      .where(eq(answers.id, id))
    const result = await db
      .select({
        answer: answers,
        question: questions,
        user: users
      })
      .from(answers)
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .leftJoin(users, eq(answers.userId, users.id))
      .where(eq(answers.id, id))
      .limit(1)
    if (!result.length) throw new Error('Answer not found')
    const base = this.mapWithQuestionAndUser(result[0])
    const votesCount = await new VoteRepository().getVoteCountByAnswer(base.id)
    return { ...base, votesCount }
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(answers).where(eq(answers.id, id))
    // @ts-ignore
    return result.count > 0
  }

  async findByQuestion(
    questionId: string,
    pagination?: { skip: number; limit: number }
  ): Promise<(Answer & { question: Question | null; user: UserType | null; votesCount: number })[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({
        answer: answers,
        question: questions,
        user: users
      })
      .from(answers)
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .leftJoin(users, eq(answers.userId, users.id))
      .where(eq(answers.questionId, questionId))
      .offset(skip)
      .limit(limit)
    const voteRepo = new VoteRepository()
    return Promise.all(
      results.map(async (row) => {
        const base = this.mapWithQuestionAndUser(row)
        const votesCount = await voteRepo.getVoteCountByAnswer(base.id)
        return { ...base, votesCount }
      })
    )
  }

  async findByUser(
    userId: string,
    pagination?: { skip: number; limit: number }
  ): Promise<(Answer & { question: Question | null; user: UserType | null; votesCount: number })[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({
        answer: answers,
        question: questions,
        user: users
      })
      .from(answers)
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .leftJoin(users, eq(answers.userId, users.id))
      .where(eq(answers.userId, userId))
      .offset(skip)
      .limit(limit)
    const voteRepo = new VoteRepository()
    return Promise.all(
      results.map(async (row) => {
        const base = this.mapWithQuestionAndUser(row)
        const votesCount = await voteRepo.getVoteCountByAnswer(base.id)
        return { ...base, votesCount }
      })
    )
  }

  private mapWithQuestionAndUser(row: {
    answer: any
    question: any
    user: any
  }): Answer & { question: Question | null; user: UserType | null } {
    const a = row.answer
    const q = row.question
    const u = row.user
    return {
      id: a.id,
      body: a.body,
      questionId: a.questionId ?? a.question_id,
      userId: a.userId ?? a.user_id,
      parentAnswerId: a.parentAnswerId ?? a.parent_answer_id ?? null,
      createdAt: a.createdAt ?? a.created_at,
      updatedAt: a.updatedAt ?? a.updated_at,
      question: q
        ? {
            id: q.id,
            title: q.title,
            body: q.body,
            userId: q.userId ?? q.user_id,
            topicId: q.topicId ?? q.topic_id,
            createdAt: q.createdAt ?? q.created_at,
            updatedAt: q.updatedAt ?? q.updated_at
          }
        : null,
      user: u
        ? {
            id: u.id,
            name: u.name,
            firstname: u.firstname,
            lastname: u.lastname,
            email: u.email,
            emailVerified: u.emailVerified,
            image: u.image,
            isAdmin: u.isAdmin,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt
          }
        : null
    }
  }
}
