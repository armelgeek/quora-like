"use client"
import { SimpleAdminPage } from '@/shared/components/atoms/ui/simple-admin-page'
import { categoryAdminConfig, categorySchema } from '@/features/category/category.admin-config'

export default function CategoryAdminPage() {
  return (
    <SimpleAdminPage
      config={categoryAdminConfig}
      schema={categorySchema}
      filters={{}}
      className=""
    />
  )
}
