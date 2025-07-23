import { eq, sql } from 'drizzle-orm'
import type { Question } from '@/domain/models/question.model'
import type { Tag } from '@/domain/models/tag.model'
import type { Topic } from '@/domain/models/topic.model'
import type { UserType } from '@/domain/models/user.model'
import type { QuestionRepositoryInterface } from '@/domain/repositories/question.repository.interface'
import { db } from '../database/db/index'
import { users } from '../database/schema'
import { answers, questions, questionTags, tags, topics, votes } from '../database/schema/quora.schema'

import { VoteRepository } from './vote.repository'

export class QuestionRepository implements QuestionRepositoryInterface {
  async findById(id: string): Promise<(Question & { user: UserType | null; topic: Topic | null; tags: Tag[] }) | null> {
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
    const base = await this.mapWithUserTopic(result[0])
    const tagsRes = await db
      .select({ tag: tags })
      .from(questionTags)
      .innerJoin(tags, eq(questionTags.tagId, tags.id))
      .where(eq(questionTags.questionId, id))
    return { ...base, tags: tagsRes.map((t) => ({ ...t.tag })) }
  }
  async findByTag(
    tagId: string,
    pagination?: { skip: number; limit: number }
  ): Promise<(Question & { tags: Tag[] })[]> {
    const { skip = 0, limit = 20 } = pagination || {}
    const results = await db
      .select({ question: questions })
      .from(questionTags)
      .innerJoin(questions, eq(questionTags.questionId, questions.id))
      .where(eq(questionTags.tagId, tagId))
      .offset(skip)
      .limit(limit)
    // Pour chaque question, enrichir avec les tags
    return await Promise.all(
      results.map(async (r) => {
        const tagRows = await db
          .select({ tag: tags })
          .from(questionTags)
          .innerJoin(tags, eq(questionTags.tagId, tags.id))
          .where(eq(questionTags.questionId, r.question.id))
        // Ensure type is "text" | "poll"
        const type: 'text' | 'poll' = r.question.type === 'poll' ? 'poll' : 'text'
        // topicId must be undefined if null to match type
        const topicId = r.question.topicId === null ? undefined : r.question.topicId
        return { ...r.question, type, tags: tagRows.map((t) => ({ ...t.tag })), topicId }
      })
    )
  }

  async findAll(pagination?: { skip: number; limit: number }): Promise<
    (Question & {
      user: UserType | null
      topic: Topic | null
      answersCount: number
      votesCount: number
      tags: Tag[]
    })[]
  > {
    const { skip = 0, limit = 20 } = pagination || {}
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

    return await Promise.all(
      results.map(async (row, i) => {
        const base = await this.mapWithUserTopic({
          question: row.question,
          user: row.user,
          topic: row.topic
        })
        return {
          ...base,
          answersCount: Number(row.answersCount ?? 0),
          votesCount: voteRepository ? votesCounts[i] : 0,
          tags: base.tags || []
        }
      })
    )
  }

  private mapWithUserTopicAndCounts = async (row: {
    question: any
    user: any
    topic: any
    answersCount: any
    votesCount: any
  }): Promise<
    Question & {
      user: UserType | null
      topic: Topic | null
      answersCount: number
      votesCount: number
      tags: Tag[]
    }
  > => {
    const base = await this.mapWithUserTopic(row)
    return {
      ...base,
      answersCount: Number(row.answersCount ?? 0),
      votesCount: Number(row.votesCount ?? 0)
    }
  }

  async create(data: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question> {
    const id = crypto.randomUUID()
    const now = new Date()
    const { tags: tagsInput = [], ...rest } = data as any
    await db.insert(questions).values({ ...rest, id, createdAt: now, updatedAt: now })
    // Gestion des tags (création si besoin, liaison)
    for (const tag of tagsInput) {
      let tagId = tag.id
      if (!tagId) {
        // Création du tag si pas d'id
        tagId = crypto.randomUUID()
        await db.insert(tags).values({ id: tagId, name: tag.name, createdAt: now })
      }
      await db.insert(questionTags).values({ questionId: id, tagId })
    }
    // Retourne la question enrichie
    const created = await this.findById(id)
    if (!created) throw new Error('Erreur création question')
    return created
  }
  async findTags(questionId: string): Promise<string[]> {
    const tagRows = await db
      .select({ tag: tags })
      .from(questionTags)
      .innerJoin(tags, eq(questionTags.tagId, tags.id))
      .where(eq(questionTags.questionId, questionId))
    return tagRows.map((t) => t.tag.name)
  }

  async update(
    id: string,
    data: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Question & { user: UserType | null; topic: Topic | null; tags: Tag[] }> {
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
    return await this.mapWithUserTopic(result[0])
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(questions).where(eq(questions.id, id))
    // @ts-ignore
    return result.count > 0
  }

  async findByUser(
    userId: string,
    pagination?: { skip: number; limit: number }
  ): Promise<(Question & { user: UserType | null; topic: Topic | null; tags: Tag[] })[]> {
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
    return await Promise.all(
      results.map(async (row) => {
        const base = await this.mapWithUserTopic({
          question: row.question,
          user: row.user,
          topic: row.topic
        })
        return {
          ...base,
          tags: base.tags || []
        }
      })
    )
  }

  async findByTopic(
    topicId: string,
    pagination?: { skip: number; limit: number }
  ): Promise<(Question & { user: UserType | null; topic: Topic | null; tags: Tag[] })[]> {
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
    return await Promise.all(
      results.map(async (row) => {
        const base = await this.mapWithUserTopic({
          question: row.question,
          user: row.user,
          topic: row.topic
        })
        return {
          ...base,
          tags: base.tags || []
        }
      })
    )
  }

  async getFeed(
    type: 'recent' | 'popular',
    pagination?: { skip: number; limit: number }
  ): Promise<(Question & { user: UserType | null; topic: Topic | null; tags: Tag[] })[]> {
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
    return await Promise.all(
      results.map(async (row) => {
        const base = await this.mapWithUserTopic({
          question: row.question,
          user: row.user,
          topic: row.topic
        })
        return {
          ...base,
          tags: base.tags || []
        }
      })
    )
  }

  private async mapWithUserTopic(row: {
    question: any
    user: any
    topic: any
  }): Promise<Question & { user: UserType | null; topic: Topic | null; tags: Tag[] }> {
    const q = row.question
    const u = row.user
    const t = row.topic
    // Fetch tags for this question
    const tagRows = await db
      .select({ tag: tags })
      .from(questionTags)
      .innerJoin(tags, eq(questionTags.tagId, tags.id))
      .where(eq(questionTags.questionId, q.id))
    return {
      id: q.id,
      title: q.title,
      body: q.body,
      userId: q.userId ?? q.user_id,
      topicId: q.topicId ?? q.topic_id,
      createdAt: q.createdAt ?? q.created_at,
      updatedAt: q.updatedAt ?? q.updated_at,
      type: q.type ?? 'text',
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
        : null,
      tags: tagRows.map((t) => ({ ...t.tag }))
    }
  }
}
