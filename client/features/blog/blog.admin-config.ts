import { blogService } from './blog.service';
import { z } from 'zod';

export const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  authorId: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'archived', 'scheduled']).optional(),
  viewCount: z.number().optional(),
  readTime: z.number().optional(),
  featuredImage: z.string().optional(),
  publishedAt: z.string().optional(),
  // SEO Metadata
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  ogDescription: z.string().optional(),
  // Content Management
  contentType: z.enum(['markdown', 'html', 'rich-text']).optional(),
  isDraft: z.boolean().optional(),
  scheduledAt: z.string().optional(),
  // Media
  galleryImages: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  audioUrl: z.string().optional(),
});

export const blogAdminConfig = {
  title: 'Blog',
  entity: 'blog',
  service: blogService,
  schema: blogSchema,
  fields: [
    { key: 'title', label: 'Titre', type: 'text', required: true, display: { showInForm: true, order: 1 } },
    { key: 'slug', label: 'Slug', type: 'text', required: true, display: { showInForm: true, order: 2 } },
    { key: 'content', label: 'Contenu', type: 'rich-text', required: true, display: { showInForm: true, order: 3 } },
    { key: 'excerpt', label: 'Résumé', type: 'textarea', display: { showInForm: true, order: 4 } },
    { key: 'authorId', label: 'Auteur', type: 'text', required: true, display: { showInForm: true, order: 5 } },
    { key: 'tags', label: 'Tags', type: 'list', display: { showInForm: true, order: 6 } },
    { key: 'published', label: 'Publié', type: 'boolean', display: { showInForm: true, order: 7 } },
    { key: 'status', label: 'Statut', type: 'select', options: ['draft', 'published', 'archived', 'scheduled'], display: { showInForm: true, order: 8 } },
    { key: 'featuredImage', label: 'Image principale', type: 'image', display: { showInForm: true, order: 9 } },
    { key: 'galleryImages', label: 'Galerie d’images', type: 'list', display: { showInForm: true, order: 10 } },
    { key: 'videoUrl', label: 'Vidéo', type: 'url', display: { showInForm: true, order: 11 } },
    { key: 'audioUrl', label: 'Audio', type: 'url', display: { showInForm: true, order: 12 } },
    { key: 'metaTitle', label: 'Titre SEO', type: 'text', display: { showInForm: true, order: 13 } },
    { key: 'metaDescription', label: 'Description SEO', type: 'textarea', display: { showInForm: true, order: 14 } },
    { key: 'metaKeywords', label: 'Mots-clés SEO', type: 'list', display: { showInForm: true, order: 15 } },
    { key: 'ogImage', label: 'Image OpenGraph', type: 'image', display: { showInForm: true, order: 16 } },
    { key: 'ogDescription', label: 'Description OpenGraph', type: 'textarea', display: { showInForm: true, order: 17 } },
    { key: 'contentType', label: 'Type de contenu', type: 'select', options: ['markdown', 'html', 'rich-text'], display: { showInForm: true, order: 18 } },
    { key: 'isDraft', label: 'Brouillon', type: 'boolean', display: { showInForm: true, order: 19 } },
    { key: 'scheduledAt', label: 'Date de publication planifiée', type: 'date', display: { showInForm: true, order: 20 } },
    { key: 'createdAt', label: 'Créé le', type: 'date', display: { showInForm: false } },
    { key: 'updatedAt', label: 'Modifié le', type: 'date', display: { showInForm: false } },
    { key: 'viewCount', label: 'Vues', type: 'number', display: { showInForm: false } },
    { key: 'readTime', label: 'Temps de lecture', type: 'number', display: { showInForm: false } },
  ],
  actions: {
    create: true,
    read: true,
    update: true,
    delete: true,
    bulk: false
  },
  accessor: {
    getValue: <T = unknown>(item: Record<string, unknown>, key: string): T | undefined => {
      return item[key] as T | undefined;
    },
    setValue: (item: Record<string, unknown>, key: string, value: unknown) => { item[key] = value },
    hasValue: (item: Record<string, unknown>, key: string) => key in item,
  },
  parent: undefined,
  queryKey: ['blogs'],
  formFields: [
    'title', 'slug', 'content', 'excerpt', 'authorId', 'tags', 'published', 'status', 'featuredImage', 'galleryImages', 'videoUrl', 'audioUrl',
    'metaTitle', 'metaDescription', 'metaKeywords', 'ogImage', 'ogDescription', 'contentType', 'isDraft', 'scheduledAt'
  ],
  children: []
};
