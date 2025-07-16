import { registerAdminEntity } from '@/shared/lib/admin/admin-generator'
import { categoryAdminConfig } from './category.admin-config'

// Enregistrer l'entité catégorie dans l'admin
registerAdminEntity(
  'categories',
  categoryAdminConfig,
  '/admin/categories',
  'Tag',
  2 // Ordre dans le menu (après users)
)
