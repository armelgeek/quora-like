import { eq, sql } from 'drizzle-orm'
import type { Question } from '@/domain/models/question.model'
import type { Topic } from '@/domain/models/topic.model'
import type { UserType } from '@/domain/models/user.model'
import type { QuestionRepositoryInterface } from '@/domain/repositories/question.repository.interface'
import { db } from '../database/db/index'
import { users } from '../database/schema'
import { answers, questions, topics, votes } from '../database/schema/quora.schema'
import { VoteRepository } from './vote.repository'

export class QuestionRepository implements QuestionRepositoryInterface {
  async findById(id: string): Promise<(Question & { user: UserType | null; topic: Topic | null }) | null> {
    const result = await db
      .select({
        question: questions,
        user: users,
        topic: topics
      })
      .from(questions)
      .leftJoin(users, eq(questions.userId, users.id))
      .leftJoin(topics, eq(questions.topicId, topics.id))
      .where(eq(questions.id, id))
      .limit(1)
    if (!result.length) return null
    return this.mapWithUserTopic(result[0])
  }

  async findAll(pagination?: {
    skip: number
    limit: number
  }): Promise<(Question & { user: UserType | null; topic: Topic | null; answersCount: number; votesCount: number })[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    // On récupère les questions avec user, topic, answersCount
    const results = await db
      .select({
        question: questions,
        user: users,
        topic: topics,
        answersCount: sql`(
          SELECT COUNT(*) FROM answers WHERE answers.question_id = questions.id
        )`.as('answers_count')
      })
      .from(questions)
      .leftJoin(users, eq(questions.userId, users.id))
      .leftJoin(topics, eq(questions.topicId, topics.id))
      .offset(skip)
      .limit(limit)

    const voteRepository = new VoteRepository()
    const votesCounts: number[] = await Promise.all(
      results.map((row) => voteRepository.getVoteCountByQuestion(row.question.id))
    )

    return results.map((row, i) => {
      const base = this.mapWithUserTopic({
        question: row.question,
        user: row.user,
        topic: row.topic
      })
      return {
        ...base,
        answersCount: Number(row.answersCount ?? 0),
        votesCount: voteRepository ? votesCounts[i] : 0
      }
    })
  }

  private mapWithUserTopicAndCounts = (row: {
    question: any
    user: any
    topic: any
    answersCount: any
    votesCount: any
  }): Question & { user: UserType | null; topic: Topic | null; answersCount: number; votesCount: number } => {
    const base = this.mapWithUserTopic(row)
    return {
      ...base,
      answersCount: Number(row.answersCount ?? 0),
      votesCount: Number(row.votesCount ?? 0)
    }
  }

  async create(data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question> {
    const id = crypto.randomUUID()
    const now = new Date()
    await db.insert(questions).values({ ...data, id, createdAt: now, updatedAt: now })
    return { ...data, id, createdAt: now, updatedAt: now }
  }

  async update(
    id: string,
    data: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Question & { user: UserType | null; topic: Topic | null }> {
    const now = new Date()
    await db
      .update(questions)
      .set({ ...data, updatedAt: now })
      .where(eq(questions.id, id))
    const result = await db
      .select({
        question: questions,
        user: users,
        topic: topics
      })
      .from(questions)
      .leftJoin(users, eq(questions.userId, users.id))
      .leftJoin(topics, eq(questions.topicId, topics.id))
      .where(eq(questions.id, id))
      .limit(1)
    if (!result.length) throw new Error('Question not found')
    return this.mapWithUserTopic(result[0])
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(questions).where(eq(questions.id, id))
    // @ts-ignore
    return result.count > 0
  }

  async findByUser(
    userId: string,
    pagination?: { skip: number; limit: number }
  ): Promise<(Question & { user: UserType | null; topic: Topic | null })[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({
        question: questions,
        user: users,
        topic: topics
      })
      .from(questions)
      .leftJoin(users, eq(questions.userId, users.id))
      .leftJoin(topics, eq(questions.topicId, topics.id))
      .where(eq(questions.userId, userId))
      .offset(skip)
      .limit(limit)
    return results.map(this.mapWithUserTopic)
  }

  async findByTopic(
    topicId: string,
    pagination?: { skip: number; limit: number }
  ): Promise<(Question & { user: UserType | null; topic: Topic | null })[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({
        question: questions,
        user: users,
        topic: topics
      })
      .from(questions)
      .leftJoin(users, eq(questions.userId, users.id))
      .leftJoin(topics, eq(questions.topicId, topics.id))
      .where(eq(questions.topicId, topicId))
      .offset(skip)
      .limit(limit)
    return results.map(this.mapWithUserTopic)
  }

  async getFeed(
    type: 'recent' | 'popular',
    pagination?: { skip: number; limit: number }
  ): Promise<(Question & { user: UserType | null; topic: Topic | null })[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    let results
    if (type === 'recent') {
      results = await db
        .select({
          question: questions,
          user: users,
          topic: topics
        })
        .from(questions)
        .leftJoin(users, eq(questions.userId, users.id))
        .leftJoin(topics, eq(questions.topicId, topics.id))
        .orderBy(questions.createdAt)
        .offset(skip)
        .limit(limit)
    } else {
      // Pour 'popular', il faudrait un champ de popularité ou un join avec votes
      results = await db
        .select({
          question: questions,
          user: users,
          topic: topics
        })
        .from(questions)
        .leftJoin(users, eq(questions.userId, users.id))
        .leftJoin(topics, eq(questions.topicId, topics.id))
        .offset(skip)
        .limit(limit)
    }
    return results.map(this.mapWithUserTopic)
  }

  private mapWithUserTopic(row: {
    question: any
    user: any
    topic: any
  }): Question & { user: UserType | null; topic: Topic | null } {
    const q = row.question
    const u = row.user
    const t = row.topic
    return {
      id: q.id,
      title: q.title,
      body: q.body,
      userId: q.userId ?? q.user_id,
      topicId: q.topicId ?? q.topic_id,
      createdAt: q.createdAt ?? q.created_at,
      updatedAt: q.updatedAt ?? q.updated_at,
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
      topic: t
        ? {
            id: t.id,
            name: t.name,
            description: t.description,
            createdAt: t.createdAt ?? t.created_at
          }
        : null
    }
  }
}
