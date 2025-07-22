import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreateFollowUseCase } from '@/application/use-cases/follow/create-follow.use-case'
import { DeleteFollowUseCase } from '@/application/use-cases/follow/delete-follow.use-case'
import { FindAllFollowsUseCase } from '@/application/use-cases/follow/find-all-follows.use-case'
import { FindFollowUseCase } from '@/application/use-cases/follow/find-follow.use-case'
import type { Routes } from '@/domain/types'
import { follows } from '../database/schema/quora.schema'
import { FollowRepository } from '../repositories/follow.repository'

const followRepository = new FollowRepository()
const createFollow = new CreateFollowUseCase(followRepository)
const findFollow = new FindFollowUseCase(followRepository)
const findAllFollows = new FindAllFollowsUseCase(followRepository)
const deleteFollow = new DeleteFollowUseCase(followRepository)

export class FollowController implements Routes {
  public controller: OpenAPIHono

  constructor() {
    this.controller = new OpenAPIHono()
    this.initRoutes()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/follows',
        tags: ['Follows'],
        summary: 'List follows',
        request: {
          query: z.object({
            skip: z.string().optional(),
            limit: z.string().optional()
          })
        },
        responses: {
          200: {
            description: 'List of follows',
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
        const result = await findAllFollows.execute({ skip: Number(skip), limit: Number(limit) })
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/follows/{id}',
        tags: ['Follows'],
        summary: 'Get follow by id',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Follow found',
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
        const result = await findFollow.execute(id)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/follows',
        tags: ['Follows'],
        summary: 'Create follow',
        request: {
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  targetUserId: z.string()
                })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Follow created',
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
        const result = await createFollow.execute({ ...input, userId: user.id })
        return c.json(result, 201)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/v1/follows/{id}',
        tags: ['Follows'],
        summary: 'Delete follow',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Follow deleted',
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
        const follow = await findFollow.execute(id)
        if (!follow.success || !follow.data) {
          return c.json({ success: false, error: 'Forbidden' })
        }
        const result = await deleteFollow.execute(id)
        return c.json(result)
      }
    )
  }
}
