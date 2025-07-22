import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreateVoteUseCase } from '@/application/use-cases/vote/create-vote.use-case'
import { DeleteVoteUseCase } from '@/application/use-cases/vote/delete-vote.use-case'
import { FindAllVotesUseCase } from '@/application/use-cases/vote/find-all-votes.use-case'
import { FindVoteUseCase } from '@/application/use-cases/vote/find-vote.use-case'
import type { Routes } from '@/domain/types'
import { votes } from '../database/schema/quora.schema'
import { VoteRepository } from '../repositories/vote.repository'

const voteRepository = new VoteRepository()
const createVote = new CreateVoteUseCase(voteRepository)
const findVote = new FindVoteUseCase(voteRepository)
const findAllVotes = new FindAllVotesUseCase(voteRepository)
const deleteVote = new DeleteVoteUseCase(voteRepository)

export class VoteController implements Routes {
  public controller: OpenAPIHono

  constructor() {
    this.controller = new OpenAPIHono()
    this.initRoutes()
  }

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/votes',
        tags: ['Votes'],
        summary: 'List votes',
        request: {
          query: z.object({
            skip: z.string().optional(),
            limit: z.string().optional()
          })
        },
        responses: {
          200: {
            description: 'List of votes',
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
        const result = await findAllVotes.execute({ skip: Number(skip), limit: Number(limit) })
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/votes/{id}',
        tags: ['Votes'],
        summary: 'Get vote by id',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Vote found',
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
        const result = await findVote.execute(id)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/votes/up/:questionId',
        tags: ['Votes'],
        summary: 'Upvote a question',
        request: {
          params: z.object({ questionId: z.string() })
        },
        responses: {
          201: {
            description: 'Vote created',
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
        const { questionId } = c.req.param()
        const result = await createVote.execute({ questionId, value: 1, userId: user.id })
        if (!result.success && result.error?.includes('déjà voté')) {
          return c.json({ success: false, error: result.error }, 400)
        }
        return c.json(result, 201)
      }
    )

    // Vote down on a question
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/votes/down/:questionId',
        tags: ['Votes'],
        summary: 'Downvote a question',
        request: {
          params: z.object({ questionId: z.string() })
        },
        responses: {
          201: {
            description: 'Vote created',
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
        const { questionId } = c.req.param()
        const result = await createVote.execute({ questionId, value: 0, userId: user.id })
        if (!result.success && result.error?.includes('déjà voté')) {
          return c.json({ success: false, error: result.error }, 400)
        }
        return c.json(result, 201)
      }
    )

    // Vote up on an answer
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/votes/upa/:answerId',
        tags: ['Votes'],
        summary: 'Upvote an answer',
        request: {
          params: z.object({ answerId: z.string() })
        },
        responses: {
          201: {
            description: 'Vote created',
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
        const { answerId } = c.req.param()
        const result = await createVote.execute({ answerId, value: 1, userId: user.id })
        if (!result.success && result.error?.includes('déjà voté')) {
          return c.json({ success: false, error: result.error }, 400)
        }
        return c.json(result, 201)
      }
    )

    // Vote down on an answer
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/votes/downa/:answerId',
        tags: ['Votes'],
        summary: 'Downvote an answer',
        request: {
          params: z.object({ answerId: z.string() })
        },
        responses: {
          201: {
            description: 'Vote created',
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
        const { answerId } = c.req.param()
        const result = await createVote.execute({ answerId, value: 0, userId: user.id })
        if (!result.success && result.error?.includes('déjà voté')) {
          return c.json({ success: false, error: result.error }, 400)
        }
        return c.json(result, 201)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/v1/votes/{id}',
        tags: ['Votes'],
        summary: 'Delete vote',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Vote deleted',
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
        const vote = await findVote.execute(id)
        if (!vote.success || !vote.data || vote.data.userId !== user.id) {
          return c.json({ success: false, error: 'Forbidden' })
        }
        const result = await deleteVote.execute(id)
        return c.json(result)
      }
    )
  }
}
