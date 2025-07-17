"use client"

import { z } from 'zod'
import { categoryService } from './category.service'

// Zod schema for category validation
export const categorySchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug cannot exceed 100 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers and hyphens'
    ),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  color: z.string().optional().default('#3B82F6'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type CategoryFormData = z.infer<typeof categorySchema>

// Admin configuration for categories
export const categoryAdminConfig = {
  title: 'Categories',
  entity: 'category',
  service: categoryService,
  schema: categorySchema,
  fields: [
    { key: 'id', label: 'ID', type: 'text' as const, readonly: true, display: { showInForm: false } },
    { key: 'name', label: 'Name', type: 'text' as const, required: true, display: { showInForm: true, order: 1 } },
    { key: 'slug', label: 'Slug', type: 'text' as const, required: true, display: { showInForm: true, order: 2 } },
    { key: 'description', label: 'Description', type: 'textarea' as const, display: { showInForm: true, order: 3 } },
    { key: 'color', label: 'Color', type: 'text' as const, display: { showInForm: true, order: 4 } },
    { key: 'createdAt', label: 'Created At', type: 'date' as const, readonly: true, display: { showInForm: false } },
    { key: 'updatedAt', label: 'Updated At', type: 'date' as const, readonly: true, display: { showInForm: false } },
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
  queryKey: ['categories'],
  formFields: ['name', 'slug', 'description', 'color'],
  children: [],
}
