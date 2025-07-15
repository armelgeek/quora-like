import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import {
  CreateBlogUseCase,
  DeleteBlogUseCase,
  GetAllBlogsUseCase,
  GetBlogByIdUseCase,
  UpdateBlogUseCase
} from '../../application/use-cases/blog'
import { BlogRepositoryImpl } from '../repositories/blog.repository'
import type { Routes } from '../../domain/types/route.type'

export class BlogController implements Routes {
  public controller: OpenAPIHono

  constructor() {
    this.controller = new OpenAPIHono()
    this.initRoutes()
  }

  private blogRepo = new BlogRepositoryImpl()
  private getAllBlogs = new GetAllBlogsUseCase(this.blogRepo)
  private getBlogById = new GetBlogByIdUseCase(this.blogRepo)
  private createBlog = new CreateBlogUseCase(this.blogRepo)
  private updateBlog = new UpdateBlogUseCase(this.blogRepo)
  private deleteBlog = new DeleteBlogUseCase(this.blogRepo)

  private BlogSchema = z.object({
    id: z.string().openapi({ example: '1' }),
    title: z.string().openapi({ example: 'Titre du blog' }),
    content: z.string().openapi({ example: 'Contenu du blog' }),
    authorId: z.string().openapi({ example: '123' }),
    createdAt: z.string().openapi({ example: '2025-07-15T12:00:00.000Z' }),
    updatedAt: z.string().openapi({ example: '2025-07-15T12:00:00.000Z' }),
    tags: z
      .array(z.string())
      .optional()
      .openapi({ example: ['tech', 'dev'] }),
    published: z.boolean().optional().openapi({ example: true })
  })
  private BlogCreateSchema = this.BlogSchema.omit({ id: true, createdAt: true, updatedAt: true })
  private BlogUpdateSchema = this.BlogCreateSchema.partial()

  public initRoutes() {
    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/blogs',
        tags: ['Blog'],
        summary: 'Liste des blogs',
        description: 'Récupère la liste paginée des blogs',
        operationId: 'getAllBlogs',
        request: {
          query: z.object({
            page: z.string().optional(),
            limit: z.string().optional()
          })
        },
        responses: {
          200: {
            description: 'Liste des blogs',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  items: z.array(this.BlogSchema),
                  total: z.number(),
                  page: z.number(),
                  limit: z.number(),
                  totalPages: z.number()
                })
              }
            }
          }
        }
      }),
      async (c:any) => {
        const page = Number(c.req.query('page') ?? '1')
        const limit = Number(c.req.query('limit') ?? '10')
        const result = await this.getAllBlogs.execute(page, limit)
        return c.json({ success: true, ...result })
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'get',
        path: '/blogs/:id',
        tags: ['Blog'],
        summary: 'Blog par ID',
        description: 'Récupère un blog par son identifiant',
        operationId: 'getBlogById',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Blog par ID',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: this.BlogSchema.optional(),
                  error: z.string().optional()
                })
              }
            }
          }
        }
      }),
      async (c) => {
        const id = c.req.param('id')
        const result = await this.getBlogById.execute(id)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'post',
        path: '/blogs',
        tags: ['Blog'],
        summary: 'Créer un blog',
        description: 'Crée un nouveau blog',
        operationId: 'createBlog',
        request: {
          body: {
            content: {
              'application/json': {
                schema: this.BlogCreateSchema
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Créer un blog',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: this.BlogSchema.optional(),
                  error: z.string().optional()
                })
              }
            }
          }
        }
      }),
      async (c) => {
        const body = await c.req.json()
        const result = await this.createBlog.execute(body)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'put',
        path: '/blogs/:id',
        tags: ['Blog'],
        summary: 'Mettre à jour un blog',
        description: 'Met à jour un blog existant',
        operationId: 'updateBlog',
        request: {
          params: z.object({ id: z.string() }),
          body: {
            content: {
              'application/json': {
                schema: this.BlogUpdateSchema
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Mettre à jour un blog',
            content: {
              'application/json': {
                schema: z.object({
                  success: z.boolean(),
                  data: this.BlogSchema.optional(),
                  error: z.string().optional()
                })
              }
            }
          }
        }
      }),
      async (c) => {
        const id = c.req.param('id')
        const body = await c.req.json()
        const result = await this.updateBlog.execute(id, body)
        return c.json(result)
      }
    )

    this.controller.openapi(
      createRoute({
        method: 'delete',
        path: '/blogs/:id',
        tags: ['Blog'],
        summary: 'Supprimer un blog',
        description: 'Supprime un blog existant',
        operationId: 'deleteBlog',
        request: {
          params: z.object({ id: z.string() })
        },
        responses: {
          200: {
            description: 'Supprimer un blog',
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
      async (c) => {
        const id = c.req.param('id')
        const result = await this.deleteBlog.execute(id)
        return c.json(result)
      }
    )
  }
}
