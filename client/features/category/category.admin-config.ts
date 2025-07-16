"use client"

import { z } from 'zod'
import { categoryService } from './category.service'

// Zod schema for category validation
export const categorySchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  slug: z
    .string()
    .min(2, 'Le slug doit contenir au moins 2 caractères')
    .max(100, 'Le slug ne peut pas dépasser 100 caractères')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'
    ),
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional(),
  color: z.string().optional().default('#3B82F6'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type CategoryFormData = z.infer<typeof categorySchema>

// Admin configuration for categories
export const categoryAdminConfig = {
  title: 'Catégories',
  entity: 'category',
  service: categoryService,
  schema: categorySchema,
  fields: [
    { key: 'id', label: 'ID', type: 'text' as const, readonly: true },
    { key: 'name', label: 'Nom', type: 'text' as const, required: true },
    { key: 'slug', label: 'Slug', type: 'text' as const, required: true },
    { key: 'description', label: 'Description', type: 'textarea' as const },
    { key: 'color', label: 'Couleur', type: 'text' as const },
    { key: 'createdAt', label: 'Créé le', type: 'date' as const, readonly: true },
    { key: 'updatedAt', label: 'Modifié le', type: 'date' as const, readonly: true },
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
  ui: {
    createButton: 'Nouvelle catégorie',
    editButton: 'Modifier',
    deleteButton: 'Supprimer',
    createTitle: 'Créer une catégorie',
    editTitle: 'Modifier la catégorie',
    deleteTitle: 'Supprimer la catégorie',
    deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
  },
}
