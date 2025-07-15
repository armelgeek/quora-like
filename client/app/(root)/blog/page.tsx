"use client"
import { useBlogs } from '@/features/blog/hooks/use-blog'

export default function BlogPage() {
  const { data, isLoading, error } = useBlogs()
  const blohgItems = data?.items || []
  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error.message}</div>

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <ul className="space-y-4">
        {blohgItems?.map((blog) => (
          <li key={blog.id} className="border rounded p-4">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-gray-600">{blog.content.slice(0, 120)}...</p>
            <div className="text-xs text-gray-400 mt-2">Auteur: {blog.authorId} | Publié: {blog.published ? 'Oui' : 'Non'} | {new Date(blog.createdAt).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
