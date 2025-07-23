import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreateQuestionUseCase } from '@/application/use-cases/question/create-question.use-case'
import { DeleteQuestionUseCase } from '@/application/use-cases/question/delete-question.use-case'
import { FindAllQuestionsUseCase } from '@/application/use-cases/question/find-all-questions.use-case'
import { FindQuestionUseCase } from '@/application/use-cases/question/find-question.use-case'
import { UpdateQuestionUseCase } from '@/application/use-cases/question/update-question.use-case'
import type { Routes } from '@/domain/types'

import { PollRepository } from '../repositories/poll.repository'
import { QuestionRepository } from '../repositories/question.repository'

const questionRepositoryInst = new QuestionRepository()
const pollRepositoryInst = new PollRepository()
const createQuestion = new CreateQuestionUseCase(questionRepositoryInst, pollRepositoryInst)
const findQuestion = new FindQuestionUseCase(questionRepositoryInst)
const findAllQuestions = new FindAllQuestionsUseCase(questionRepositoryInst)
const updateQuestion = new UpdateQuestionUseCase(questionRepositoryInst)
const deleteQuestion = new DeleteQuestionUseCase(questionRepositoryInst)

export class QuestionController implements Routes {
  public controller: OpenAPIHono

  constructor() {
    this.controller = new OpenAPIHono()
    this.initRoutes()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/questions',
        tags: ['Questions'],
        summary: 'List questions',
        request: {
          query: z.object({
            skip: z.string().optional(),
            limit: z.string().optional(),
            sort: z.enum(['recent', 'most-answered', 'bump', 'most-voted', 'no-answer', 'populaire']).optional()
          })
        },
        responses: {
          200: {
            description: 'List of questions',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.array(z.any())
                })
              }
            }
          }
        }
      }),
      async (c) => {
        const { skip = '0', limit = '20', sort = 'recent' } = c.req.query()
        const result = await findAllQuestions.execute({ skip: Number(skip), limit: Number(limit), sort })
        return c.json(result)
      }
    )
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/questions/stats',
        tags: ['Questions'],
        summary: 'Get question statistics',
        responses: {
          200: {
            description: 'Statistics',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.object({
                    totalQuestions: z.number(),
                    totalAnswers: z.number(),
                    totalVotes: z.number(),
                    noAnswer: z.number(),
                    popular: z.number(),
                    classic: z.number(),
                    poll: z.number()
                  })
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const stats = await questionRepositoryInst.getStats()
        return c.json({ success: true, data: stats })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/questions/{id}',
        tags: ['Questions'],
        summary: 'Get question by id',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Question found',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.any().nullable()
                })
              }
            }
          }
        }
      }),
      async (c) => {
        const { id } = c.req.param()
        const result = await findQuestion.execute(id)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/questions',
        tags: ['Questions'],
        summary: 'Create question',
        request: {
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  title: z.string(),
                  body: z.string(),
                  topicId: z.string(),
                  tags: z.array(z.object({ id: z.string().optional(), name: z.string() })).optional()
                })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Question created',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.any()
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const user = c.get('user')
        if (!user) return c.json({ success: false, error: 'Unauthorized' })
        const input = await c.req.json()
        const result = await createQuestion.execute({ ...input, userId: user.id })
        return c.json(result, 201)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/v1/questions/{id}',
        tags: ['Questions'],
        summary: 'Update question',
        request: {
          params: z.object({ id: z.string() }),
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  title: z.string().optional(),
                  body: z.string().optional(),
                  topicId: z.string().optional(),
                  tags: z.array(z.object({ id: z.string().optional(), name: z.string() })).optional()
                })
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Question updated',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: z.any().nullable()
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const user = c.get('user')
        if (!user) return c.json({ success: false, error: 'Unauthorized' })
        const { id } = c.req.param()
        const question = await findQuestion.execute(id)
        if (!question.success || !question.data || question.data.user?.id !== user.id) {
          return c.json({ success: false, error: 'Forbidden' })
        }
        const input = await c.req.json()
        const result = await updateQuestion.execute(id, input)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/v1/questions/{id}',
        tags: ['Questions'],
        summary: 'Delete question',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Question deleted',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  error: z.string().optional()
                })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const user = c.get('user')
        if (!user) return c.json({ success: false, error: 'Unauthorized' })
        const { id } = c.req.param()
        const question = await findQuestion.execute(id)
        if (!question.success || !question.data || question.data.user?.id !== user.id) {
          return c.json({ success: false, error: 'Forbidden' })
        }
        const result = await deleteQuestion.execute(id)
        return c.json(result)
      }
    )
    
  }
}
