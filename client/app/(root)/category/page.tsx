"use client"
import { useCategories } from '@/features/category/hooks/use-category'

import type { Category } from '@shared/types'

export default function CategoryPage() {
  const { data, isLoading, error } = useCategories()
  const categoryItems: Category[] = (data?.data && 'items' in data.data ? data.data.items : [])
  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error.message}</div>

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Catégories</h1>
      <ul className="space-y-4">
        {categoryItems.map((cat: Category) => (
          <li key={cat.id} className="border rounded p-4">
            <h2 className="text-xl font-semibold">{cat.name}</h2>
            <p className="text-gray-600">{cat.description?.slice(0, 120) || 'Aucune description.'}...</p>
            <div className="text-xs text-gray-400 mt-2">Slug: {cat.slug} | Créé le: {new Date(cat.createdAt).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
