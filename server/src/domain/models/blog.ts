import type { Blog } from '@shared/types'

export class BlogModel implements Blog {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
  tags?: string[]
  published?: boolean

  constructor(data: Blog) {
    this.id = data.id
    this.title = data.title
    this.content = data.content
    this.authorId = data.authorId
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.tags = data.tags
    this.published = data.published
  }
}
