import { blogService } from './blog.service';
import { z } from 'zod';

export const blogSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export const blogAdminConfig = {
  title: 'Blog',
  entity: 'blog',
  service: blogService,
  schema: blogSchema,
  fields: [
    { key: 'title', label: 'Titre', type: 'text' as const, required: true },
    { key: 'content', label: 'Contenu', type: 'textarea' as const, required: true },
    { key: 'authorId', label: 'Auteur', type: 'text' as const, required: true },
    { key: 'published', label: 'Publié', type: 'boolean' as const },
    { key: 'createdAt', label: 'Créé le', type: 'date' as const },
    { key: 'updatedAt', label: 'Modifié le', type: 'date' as const },
    { key: 'tags', label: 'Tags', type: 'array' as const }
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
  formFields: ['title', 'content', 'authorId', 'published', 'tags'],
  children: []
};
