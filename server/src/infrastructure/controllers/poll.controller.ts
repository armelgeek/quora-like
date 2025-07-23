import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { z } from 'zod'
import { CreatePollUseCase } from '@/application/use-cases/poll/create-poll.use-case'
import { GetPollByQuestionIdUseCase } from '@/application/use-cases/poll/get-poll-by-question-id.use-case'
import { VotePollOptionUseCase } from '@/application/use-cases/poll/vote-poll-option.use-case'
import type { Routes } from '@/domain/types'
import { PollRepository } from '../repositories/poll.repository'

const pollRepository = new PollRepository()
const createPoll = new CreatePollUseCase(pollRepository)
const votePollOption = new VotePollOptionUseCase(pollRepository)
const getPollByQuestionId = new GetPollByQuestionIdUseCase(pollRepository)

export class PollController implements Routes {
  public controller: OpenAPIHono
  constructor() {
    this.controller = new OpenAPIHono()
    this.initRoutes()
  }
  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/polls',
        tags: ['Polls'],
        summary: 'Create poll',
        request: {
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  questionId: z.string().uuid(),
                  options: z.array(z.object({ text: z.string().min(1) }))
                })
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Poll created',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: z.any() })
              }
            }
          }
        }
      }),
      async (c) => {
        const body = await c.req.json()
        const result = await createPoll.execute(body)
        return c.json(result, 201)
      }
    )
    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/v1/polls/vote',
        tags: ['Polls'],
        summary: 'Vote for a poll option',
        request: {
          body: {
            content: {
              'application/json': {
                schema: z.object({
                  optionId: z.string().uuid()
                })
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Vote registered',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), error: z.string().optional() })
              }
            }
          }
        }
      }),
      async (c: any) => {
        const user = c.get('user')
        if (!user) return c.json({ success: false, error: 'Unauthorized' })
        const body = await c.req.json()
        const result = await votePollOption.execute({ ...body, userId: user.id })
        return c.json(result)
      }
    )
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/v1/polls',
        tags: ['Polls'],
        summary: 'Get poll by questionId',
        request: {
          query: z.object({ questionId: z.string().uuid() })
        },
        responses: {
          200: {
            description: 'Poll',
            content: {
              'application/json': {
                schema: z.object({ success: z.boolean(), data: z.any(), error: z.string().optional() })
              }
            }
          }
        }
      }),
      async (c) => {
        const { questionId } = c.req.query()
        const result = await getPollByQuestionId.execute({ questionId })
        return c.json(result)
      }
    )
  }
}
