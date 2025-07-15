"use client"
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page'
import { blogAdminConfig, blogSchema } from '@/features/blog/blog.admin-config'

export default function BlogAdminPage() {

  return (
    <SimpleAdminPage
      config={blogAdminConfig}
      schema={blogSchema}
      filters={{}}
      className=""
    />
  )
}
