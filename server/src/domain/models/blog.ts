import type { Blog } from '../../../../shared/src/types/blog'

export class BlogModel implements Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  authorId: string
  createdAt: string
  updatedAt: string
  tags?: string[]
  published?: boolean
  status?: 'draft' | 'published' | 'archived' | 'scheduled'
  viewCount?: number
  readTime?: number
  featuredImage?: string
  publishedAt?: string
  // SEO Metadata
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  ogImage?: string
  ogDescription?: string
  // Content Management
  contentType?: 'markdown' | 'html' | 'rich-text'
  isDraft?: boolean
  scheduledAt?: string
  // Media
  galleryImages?: string[]
  videoUrl?: string
  audioUrl?: string

  constructor(data: Blog) {
    this.id = data.id
    this.title = data.title
    this.slug = data.slug
    this.content = data.content
    this.excerpt = data.excerpt
    this.authorId = data.authorId
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.tags = data.tags
    this.published = data.published
    this.status = data.status
    this.viewCount = data.viewCount
    this.readTime = data.readTime
    this.featuredImage = data.featuredImage
    this.publishedAt = data.publishedAt
    this.metaTitle = data.metaTitle
    this.metaDescription = data.metaDescription
    this.metaKeywords = data.metaKeywords
    this.ogImage = data.ogImage
    this.ogDescription = data.ogDescription
    this.contentType = data.contentType
    this.isDraft = data.isDraft
    this.scheduledAt = data.scheduledAt
    this.galleryImages = data.galleryImages
    this.videoUrl = data.videoUrl
    this.audioUrl = data.audioUrl
  }

  isPublished(): boolean {
    return !!this.published
  }

  hasTags(): boolean {
    return Array.isArray(this.tags) && this.tags.length > 0
  }

  summary(length: number = 120): string {
    const textContent = this.excerpt || this.content
    return textContent.length > length ? `${textContent.slice(0, length)}...` : textContent
  }

  update(data: Partial<Blog>): void {
    if (data.title !== undefined) this.title = data.title
    if (data.slug !== undefined) this.slug = data.slug
    if (data.content !== undefined) this.content = data.content
    if (data.excerpt !== undefined) this.excerpt = data.excerpt
    if (data.authorId !== undefined) this.authorId = data.authorId
    if (data.tags !== undefined) this.tags = data.tags
    if (data.published !== undefined) this.published = data.published
    if (data.status !== undefined) this.status = data.status
    if (data.featuredImage !== undefined) this.featuredImage = data.featuredImage
    if (data.metaTitle !== undefined) this.metaTitle = data.metaTitle
    if (data.metaDescription !== undefined) this.metaDescription = data.metaDescription
    if (data.metaKeywords !== undefined) this.metaKeywords = data.metaKeywords
    if (data.contentType !== undefined) this.contentType = data.contentType
    if (data.isDraft !== undefined) this.isDraft = data.isDraft
    if (data.scheduledAt !== undefined) this.scheduledAt = data.scheduledAt
    if (data.galleryImages !== undefined) this.galleryImages = data.galleryImages
    if (data.videoUrl !== undefined) this.videoUrl = data.videoUrl
    if (data.audioUrl !== undefined) this.audioUrl = data.audioUrl
    if (data.updatedAt !== undefined) this.updatedAt = data.updatedAt
  }
}
