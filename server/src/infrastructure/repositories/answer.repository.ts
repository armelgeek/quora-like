import { eq } from 'drizzle-orm'
import type { Answer } from '@/domain/models/answer.model'
import type { Question } from '@/domain/models/question.model'
import type { AnswerRepositoryInterface } from '@/domain/repositories/answer.repository.interface'
import { db } from '../database/db/index'
import { answers, questions } from '../database/schema/quora.schema'

export class AnswerRepository implements AnswerRepositoryInterface {
  async findById(id: string): Promise<(Answer & { question: Question | null }) | null> {
    const result = await db
      .select({
        answer: answers,
        question: questions
      })
      .from(answers)
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .where(eq(answers.id, id))
      .limit(1)
    if (!result.length) return null
    return this.mapWithQuestion(result[0])
  }

  async findAll(pagination?: { skip: number; limit: number }): Promise<(Answer & { question: Question | null })[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({
        answer: answers,
        question: questions
      })
      .from(answers)
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .offset(skip)
      .limit(limit)
    return results.map(this.mapWithQuestion)
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
  ): Promise<Answer & { question: Question | null }> {
    const now = new Date()
    await db
      .update(answers)
      .set({ ...data, updatedAt: now })
      .where(eq(answers.id, id))
    const result = await db
      .select({
        answer: answers,
        question: questions
      })
      .from(answers)
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .where(eq(answers.id, id))
      .limit(1)
    if (!result.length) throw new Error('Answer not found')
    return this.mapWithQuestion(result[0])
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(answers).where(eq(answers.id, id))
    // @ts-ignore
    return result.count > 0
  }

  async findByQuestion(
    questionId: string,
    pagination?: { skip: number; limit: number }
  ): Promise<(Answer & { question: Question | null })[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({
        answer: answers,
        question: questions
      })
      .from(answers)
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .where(eq(answers.questionId, questionId))
      .offset(skip)
      .limit(limit)
    return results.map(this.mapWithQuestion)
  }

  async findByUser(
    userId: string,
    pagination?: { skip: number; limit: number }
  ): Promise<(Answer & { question: Question | null })[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({
        answer: answers,
        question: questions
      })
      .from(answers)
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .where(eq(answers.userId, userId))
      .offset(skip)
      .limit(limit)
    return results.map(this.mapWithQuestion)
  }

  private mapWithQuestion(row: { answer: any; question: any }): Answer & { question: Question | null } {
    const a = row.answer
    const q = row.question
    return {
      id: a.id,
      body: a.body,
      questionId: a.questionId ?? a.question_id,
      userId: a.userId ?? a.user_id,
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
        : null
    }
  }
}
