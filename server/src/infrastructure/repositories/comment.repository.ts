import { eq } from 'drizzle-orm'
import type { Answer } from '@/domain/models/answer.model'
import type { Comment } from '@/domain/models/comment.model'
import type { Question } from '@/domain/models/question.model'
import type { User } from '@/domain/models/user.model'
import type { CommentRepositoryInterface } from '@/domain/repositories/comment.repository.interface'
import { db } from '../database/db/index'
import { users } from '../database/schema'
import { answers, comments, questions } from '../database/schema/quora.schema'
export class CommentRepository implements CommentRepositoryInterface {
  async findById(id: string): Promise<
    | (Comment & {
        user: any | null
        answer: (Answer & { question: Question | null }) | null
      })
    | null
  > {
    const result = await db
      .select({
        comment: comments,
        answer: answers,
        question: questions,
        user: users
      })
      .from(comments)
      .leftJoin(answers, eq(comments.answerId, answers.id))
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.id, id))
      .limit(1)
    if (!result.length) return null
    return this.mapWithAnswer(result[0])
  }

  async findAll(pagination?: { skip: number; limit: number }): Promise<
    (Comment & {
      user: any | null
      answer: (Answer & { question: Question | null }) | null
    })[]
  > {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({
        comment: comments,
        answer: answers,
        question: questions,
        user: users
      })
      .from(comments)
      .leftJoin(answers, eq(comments.answerId, answers.id))
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .leftJoin(users, eq(comments.userId, users.id))
      .offset(skip)
      .limit(limit)
    return results.map(this.mapWithAnswer)
  }

  async create(data: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const id = crypto.randomUUID()
    const createdAt = new Date()
    await db.insert(comments).values({ ...data, id, createdAt })
    return { ...data, id, createdAt }
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id))
    // @ts-ignore
    return result.count > 0
  }

  async findByAnswer(
    answerId: string,
    pagination?: { skip: number; limit: number }
  ): Promise<
    (Comment & {
      user: any | null
      answer: (Answer & { question: Question | null }) | null
    })[]
  > {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({
        comment: comments,
        answer: answers,
        question: questions,
        user: users
      })
      .from(comments)
      .leftJoin(answers, eq(comments.answerId, answers.id))
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.answerId, answerId))
      .offset(skip)
      .limit(limit)
    return results.map(this.mapWithAnswer)
  }

  async findByUser(
    userId: string,
    pagination?: { skip: number; limit: number }
  ): Promise<
    (Comment & {
      user: any | null
      answer: (Answer & { question: Question | null }) | null
    })[]
  > {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({
        comment: comments,
        answer: answers,
        question: questions,
        user: users
      })
      .from(comments)
      .leftJoin(answers, eq(comments.answerId, answers.id))
      .leftJoin(questions, eq(answers.questionId, questions.id))
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.userId, userId))
      .offset(skip)
      .limit(limit)
    return results.map(this.mapWithAnswer)
  }

  private mapWithAnswer(row: { comment: any; answer: any; question: any; user: any }): Comment & {
    user: any | null
    answer: (Answer & { question: Question | null }) | null
  } {
    const c = row.comment
    const a = row.answer
    const q = row.question
    const u = row.user
    return {
      id: c.id,
      body: c.body,
      userId: c.userId ?? c.user_id,
      answerId: c.answerId ?? c.answer_id,
      createdAt: c.createdAt ?? c.created_at,
      user: u
        ? {
            id: u.id,
            name: u.name,
            firstname: u.firstname,
            lastname: u.lastname,
            email: u.email,
            emailVerified: u.emailVerified ?? u.email_verified,
            image: u.image,
            isAdmin: u.isAdmin ?? u.is_admin,
            createdAt: u.createdAt ?? u.created_at,
            updatedAt: u.updatedAt ?? u.updated_at
          }
        : null,
      answer: a
        ? {
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
        : null
    }
  }
}
