import { blogAdminService } from './blog.service';
import { z } from 'zod';
import { createAdminEntity, createField } from '@/shared/lib/admin/admin-generator';

export const blogSchema = z.object({
  id: createField.string({ label: 'ID' }).optional(),
  title: createField.string({ label: 'Title' }),
  slug: createField.string({ label: 'Slug' }),
  content: createField.richText({ label: 'Content' }),
  excerpt: createField.textarea({ label: 'Excerpt' }).optional(),
  authorId: createField.string({ label: 'Author ID' }),
  createdAt: createField.string({ label: 'Created At', readOnly: true }).optional(),
  updatedAt: createField.string({ label: 'Updated At', readOnly: true }).optional(),
  tags: createField.list({ label: 'Tags' }).optional(),
  published: createField.boolean({ label: 'Published' }).optional(),
  status: createField.select(['draft', 'published', 'archived', 'scheduled'], { label: 'Status' }).optional(),
  viewCount: createField.number({ label: 'Views', readOnly: true }).optional(),
  readTime: createField.number({ label: 'Read Time (min)' }).optional(),
  featuredImage: createField.image({ label: 'Featured Image' }).optional(),
  publishedAt: createField.string({ label: 'Published At' }).optional(),
  metaTitle: createField.string({ label: 'Meta Title' }).optional(),
  metaDescription: createField.textarea({ label: 'Meta Description' }).optional(),
  metaKeywords: createField.list({ label: 'Meta Keywords' }).optional(),
  ogImage: createField.image({ label: 'OG Image' }).optional(),
  ogDescription: createField.textarea({ label: 'OG Description' }).optional(),
  contentType: createField.select(['markdown', 'html', 'rich-text'], { label: 'Content Type' }).optional(),
  isDraft: createField.boolean({ label: 'Is Draft' }).optional(),
  scheduledAt: createField.string({ label: 'Scheduled At' }).optional(),
  // Media
  galleryImages: createField.list({ label: 'Gallery Images' }).optional(),
  videoUrl: createField.url({ label: 'Video URL' }).optional(),
  audioUrl: createField.url({ label: 'Audio URL' }).optional(),
});


export const blogAdminConfig = createAdminEntity('Blog', blogSchema, {
  description: 'Manage your blog posts',
  icon: '📝',
  actions: { create: true, read: true, update: true, delete: true, bulk: false },
  services: blogAdminService,
  queryKey: ['blogs'],
  ui: {
    form: {
      layout: 'horizontal',
    }
  }
});
