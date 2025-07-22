import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreateCommentUseCase } from '@/application/use-cases/comment/create-comment.use-case'
import { DeleteCommentUseCase } from '@/application/use-cases/comment/delete-comment.use-case'
import { FindAllCommentsUseCase } from '@/application/use-cases/comment/find-all-comments.use-case'
import { FindCommentUseCase } from '@/application/use-cases/comment/find-comment.use-case'
import { UpdateCommentUseCase } from '@/application/use-cases/comment/update-comment.use-case'
import type { Routes } from '@/domain/types'
import { comments } from '../database/schema/quora.schema'
import { CommentRepository } from '../repositories/comment.repository'

const commentRepository = new CommentRepository()
const createComment = new CreateCommentUseCase(commentRepository)
const findComment = new FindCommentUseCase(commentRepository)
const findAllComments = new FindAllCommentsUseCase(commentRepository)
const updateComment = new UpdateCommentUseCase(commentRepository)
const deleteComment = new DeleteCommentUseCase(commentRepository)

export class CommentController implements Routes {
  public controller: OpenAPIHono

  constructor() {
    this.controller = new OpenAPIHono()
    this.initRoutes()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/comments',
        tags: ['Comments'],
        summary: 'List comments',
        request: {
          query: z.object({
            skip: z.string().optional(),
            limit: z.string().optional()
          })
        },
        responses: {
          200: {
            description: 'List of comments',
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
        const result = await findAllComments.execute({ skip: Number(skip), limit: Number(limit) })
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/comments/{id}',
        tags: ['Comments'],
        summary: 'Get comment by id',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Comment found',
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
        const result = await findComment.execute(id)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/comments',
        tags: ['Comments'],
        summary: 'Create comment',
        request: {
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  body: z.string(),
                  answerId: z.string()
                })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Comment created',
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
        const result = await createComment.execute({ ...input, userId })
        return c.json(result, 201)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/v1/comments/{id}',
        tags: ['Comments'],
        summary: 'Update comment',
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
            description: 'Comment updated',
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
        const comment = await findComment.execute(id)
        if (!comment.success || !comment.data || comment.data.user?.id !== userId) {
          return c.json({ success: false, error: 'Forbidden' })
        }
        const input = await c.req.json()
        const result = await updateComment.execute(id, input)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/v1/comments/{id}',
        tags: ['Comments'],
        summary: 'Delete comment',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Comment deleted',
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
        const comment = await findComment.execute(id)
        if (!comment.success || !comment.data || comment.data.user?.id !== userId) {
          return c.json({ success: false, error: 'Forbidden' })
        }
        const result = await deleteComment.execute(id)
        return c.json(result)
      }
    )
  }
}
