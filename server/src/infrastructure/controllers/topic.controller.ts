import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreateTopicUseCase } from '@/application/use-cases/topic/create-topic.use-case'
import { DeleteTopicUseCase } from '@/application/use-cases/topic/delete-topic.use-case'
import { FindAllTopicsUseCase } from '@/application/use-cases/topic/find-all-topics.use-case'
import { FindTopicUseCase } from '@/application/use-cases/topic/find-topic.use-case'
import { UpdateTopicUseCase } from '@/application/use-cases/topic/update-topic.use-case'
import type { Routes } from '@/domain/types'
import { TopicRepository } from '../repositories/topic.repository'

const topicRepository = new TopicRepository()
const createTopic = new CreateTopicUseCase(topicRepository)
const findTopic = new FindTopicUseCase(topicRepository)
const findAllTopics = new FindAllTopicsUseCase(topicRepository)
const updateTopic = new UpdateTopicUseCase(topicRepository)
const deleteTopic = new DeleteTopicUseCase(topicRepository)

export class TopicController implements Routes {
  public controller: OpenAPIHono

  constructor() {
    this.controller = new OpenAPIHono()
    this.initRoutes()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/topics',
        tags: ['Topics'],
        summary: 'List topics',
        request: {
          query: z.object({
            skip: z.string().optional(),
            limit: z.string().optional()
          })
        },
        responses: {
          200: {
            description: 'List of topics',
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
        const { skip = '0', limit = '20' } = c.req.query()
        const result = await findAllTopics.execute({ skip: Number(skip), limit: Number(limit) })
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/topics/{id}',
        tags: ['Topics'],
        summary: 'Get topic by id',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Topic found',
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
        const result = await findTopic.execute(id)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/topics',
        tags: ['Topics'],
        summary: 'Create topic',
        request: {
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  name: z.string(),
                  description: z.string().optional()
                })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Topic created',
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
        const userId = c.get('user')
        if (!userId) return c.json({ success: false, error: 'Unauthorized' })
        const input = await c.req.json()
        const result = await createTopic.execute({ ...input, userId })
        return c.json(result, 201)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/v1/topics/{id}',
        tags: ['Topics'],
        summary: 'Update topic',
        request: {
          params: z.object({ id: z.string() }),
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  name: z.string().optional(),
                  description: z.string().optional()
                })
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Topic updated',
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
        const userId = c.get('user')
        if (!userId) return c.json({ success: false, error: 'Unauthorized' })
        const { id } = c.req.param()
        const topic = await findTopic.execute(id)
        if (!topic.success || !topic.data) {
          return c.json({ success: false, error: 'Forbidden' })
        }
        const input = await c.req.json()
        const result = await updateTopic.execute(id, input)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/v1/topics/{id}',
        tags: ['Topics'],
        summary: 'Delete topic',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Topic deleted',
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
        const userId = c.get('user')
        if (!userId) return c.json({ success: false, error: 'Unauthorized' })
        const { id } = c.req.param()
        const topic = await findTopic.execute(id)
        if (!topic.success || !topic.data) {
          return c.json({ success: false, error: 'Forbidden' })
        }
        const result = await deleteTopic.execute(id)
        return c.json(result)
      }
    )
  }
}
