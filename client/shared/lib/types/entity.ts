// Admin Entity Configuration Types
export interface EntityField {
  key: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'boolean' | 'date' | 'datetime' | 'textarea' | 'select' | 'multiselect' | 'color' | 'image' | 'editor' | 'relation'
  required?: boolean
  readonly?: boolean
  placeholder?: string
  description?: string
  defaultValue?: string | number | boolean
  showInList?: boolean
  showInDetail?: boolean
  showInForm?: boolean
  options?: Array<{ value: string | number; label: string }>
  relationConfig?: {
    entity: string
    displayField: string
    valueField: string
    endpoint?: string
  }
}

export interface EntityValidationRule {
  required?: string
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  min?: { value: number; message: string }
  max?: { value: number; message: string }
  pattern?: { value: RegExp; message: string }
  custom?: (value: unknown) => string | undefined
}

export interface EntityFilter {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'boolean' | 'relation'
  options?: Array<{ value: string | number; label: string }>
  relationConfig?: {
    entity: string
    displayField: string
    valueField: string
    endpoint?: string
  }
}

export interface EntityConfig {
  name: string
  label: string
  pluralLabel: string
  icon?: string
  description?: string
  endpoints: {
    list: string
    detail: (id: string) => string
    create: string
    update: (id: string) => string
    delete: (id: string) => string
  }
  fields: EntityField[]
  searchFields?: string[]
  filterFields?: EntityFilter[]
  defaultSort?: {
    field: string
    direction: 'asc' | 'desc'
  }
  pagination?: {
    defaultPageSize: number
    pageSizeOptions?: number[]
  }
  validation?: Record<string, EntityValidationRule>
  permissions?: {
    create?: boolean
    read?: boolean
    update?: boolean
    delete?: boolean
  }
  actions?: Array<{
    key: string
    label: string
    icon?: string
    type: 'single' | 'bulk'
    action: (id: string | string[]) => void
  }>
}
