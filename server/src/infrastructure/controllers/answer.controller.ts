import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreateAnswerUseCase } from '@/application/use-cases/answer/create-answer.use-case'
import { DeleteAnswerUseCase } from '@/application/use-cases/answer/delete-answer.use-case'
import { FindAllAnswersUseCase } from '@/application/use-cases/answer/find-all-answers.use-case'
import { FindAnswerUseCase } from '@/application/use-cases/answer/find-answer.use-case'
import { UpdateAnswerUseCase } from '@/application/use-cases/answer/update-answer.use-case'
import type { Routes } from '@/domain/types'
import { answers } from '../database/schema/quora.schema'
import { AnswerRepository } from '../repositories/answer.repository'

const answerRepository = new AnswerRepository()
const createAnswer = new CreateAnswerUseCase(answerRepository)
const findAnswer = new FindAnswerUseCase(answerRepository)
const findAllAnswers = new FindAllAnswersUseCase(answerRepository)
const updateAnswer = new UpdateAnswerUseCase(answerRepository)
const deleteAnswer = new DeleteAnswerUseCase(answerRepository)

export class AnswerController implements Routes {
  public controller: OpenAPIHono

  constructor() {
    this.controller = new OpenAPIHono()
    this.initRoutes()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/answers',
        tags: ['Answers'],
        summary: 'List answers',
        request: {
          query: z.object({
            skip: z.string().optional(),
            limit: z.string().optional(),
            questionId: z.string().optional(),
            parentAnswerId: z.string().optional()
          })
        },
        responses: {
          200: {
            description: 'List of answers',
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
        const { skip = '0', limit = '20', questionId, parentAnswerId } = c.req.query()
        if (parentAnswerId) {
          const children = await answerRepository.findByParentAnswer(parentAnswerId, { skip: Number(skip), limit: Number(limit) })
          return c.json({ success: true, data: children })
        }
        const result = await findAllAnswers.execute({
          skip: Number(skip),
          limit: Number(limit),
          questionId: questionId || undefined
        })
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/answers/{id}',
        tags: ['Answers'],
        summary: 'Get answer by id',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Answer found',
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
        const result = await findAnswer.execute(id)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/answers',
        tags: ['Answers'],
        summary: 'Create answer',
        request: {
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  body: z.string(),
                  questionId: z.string()
                })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Answer created',
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
        const result = await createAnswer.execute({ ...input, userId: user.id })
        return c.json(result, 201)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/v1/answers/{id}',
        tags: ['Answers'],
        summary: 'Update answer',
        request: {
          params: z.object({ id: z.string() }),
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  body: z.string().optional()
                })
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Answer updated',
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
        const answer = await findAnswer.execute(id)
        if (!answer.success || !answer.data || answer.data.user?.id !== user.id) {
          return c.json({ success: false, error: 'Forbidden' })
        }
        const input = await c.req.json()
        const result = await updateAnswer.execute(id, input)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/v1/answers/{id}',
        tags: ['Answers'],
        summary: 'Delete answer',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Answer deleted',
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
        const answer = await findAnswer.execute(id)
        if (!answer.success || !answer.data || answer.data.user?.id !== user.id) {
          return c.json({ success: false, error: 'Forbidden' })
        }
        const result = await deleteAnswer.execute(id)
        return c.json(result)
      }
    )
  }
}
