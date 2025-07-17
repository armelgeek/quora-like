"use client"
import { useBlog } from '@/features/blog/hooks/use-blog'
import { Calendar, User, ArrowLeft, Clock, Tag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/shared/components/atoms/ui/button'
import { notFound } from 'next/navigation'
import type { Blog, BlogListResponse } from '@shared/types'

interface BlogDetailPageProps {
  params: {
    id: string
  }
}

// Type guard pour vérifier si c'est un Blog et non une BlogListResponse
function isBlog(data: Blog | BlogListResponse): data is Blog {
  return 'title' in data && 'content' in data
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { data: response, isLoading, error } = useBlog(params.id)
  
  // Extraire le blog de la réponse
  const blogData = response?.success ? response.data : null
  const blog = blogData && isBlog(blogData) ? blogData : null
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !blog) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header image */}
          <div className="h-64 md:h-96 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
            <div className="text-primary/60 text-6xl">📄</div>
          </div>
          
          <div className="p-8 md:p-12">
            {/* Status badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                blog.published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {blog.published ? '✓ Article publié' : '⏳ Brouillon'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {blog.title}
            </h1>
            
            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Auteur #{blog.authorId}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Publié le {new Date(blog.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              {blog.updatedAt !== blog.createdAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Modifié le {new Date(blog.updatedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </div>
            
            {/* Categories/Tags (si disponibles) */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Tag className="w-4 h-4" />
                <span>Administration, Blog, Boiler</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation vers d'autres articles */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Continuer la lecture</h3>
          <div className="text-center">
            <Button asChild variant="outline">
              <Link href="/blog">
                Voir tous les articles
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  )
}
