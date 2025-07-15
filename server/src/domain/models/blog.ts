import type { Blog } from '../../../../shared/src/types/blog'

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

  isPublished(): boolean {
    return !!this.published
  }

  hasTags(): boolean {
    return Array.isArray(this.tags) && this.tags.length > 0
  }

  summary(length: number = 120): string {
    return this.content.length > length ? `${this.content.slice(0, length)}...` : this.content
  }

  update(data: Partial<Blog>): void {
    if (data.title !== undefined) this.title = data.title
    if (data.content !== undefined) this.content = data.content
    if (data.authorId !== undefined) this.authorId = data.authorId
    if (data.tags !== undefined) this.tags = data.tags
    if (data.published !== undefined) this.published = data.published
    if (data.updatedAt !== undefined) this.updatedAt = data.updatedAt
  }
}
