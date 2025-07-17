"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { Button } from '@/shared/components/atoms/ui/button'
import { Input } from '@/shared/components/atoms/ui/input'
import { Textarea } from '@/shared/components/atoms/ui/textarea'
import { FileDropZone } from '@/shared/components/atoms/ui/file-drop-zone'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/atoms/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/atoms/ui/select'

const documentSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  category: z.enum(['Personnel', 'Professionnel', 'Administratif', 'Autre']),
  description: z.string().optional(),
  file: z.any().optional(),
})

type DocumentFormData = z.infer<typeof documentSchema>

interface DocumentFormProps {
  onSubmit: (data: DocumentFormData) => Promise<void>
  initialData?: Partial<DocumentFormData>
  isEdit?: boolean
}

export function DocumentForm({ onSubmit, initialData, isEdit = false }: DocumentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'Personnel',
      description: initialData?.description || '',
    },
  })

  const handleSubmit = async (data: DocumentFormData) => {
    setIsLoading(true)
    try {
      const formData = {
        ...data,
        file: selectedFile,
      }
      await onSubmit(formData)
      form.reset()
      setSelectedFile(null)
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (file: File) => {
    setSelectedFile(file)
    setFileError(null)
    if (!form.getValues('name')) {
      form.setValue('name', file.name)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {!isEdit && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Fichier *
            </label>
            <FileDropZone
              onFileSelect={handleFileChange}
              onFileRemove={() => setSelectedFile(null)}
              currentFile={selectedFile}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
              maxSize={10}
              error={fileError || undefined}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du document *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: CV_2024.pdf"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Personnel">Personnel</SelectItem>
                  <SelectItem value="Professionnel">Professionnel</SelectItem>
                  <SelectItem value="Administratif">Administratif</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez brièvement ce document..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              form.reset()
              setSelectedFile(null)
            }}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isLoading || (!isEdit && !selectedFile)}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? 'Modification...' : 'Ajout...'}
              </>
            ) : (
              isEdit ? 'Modifier' : 'Ajouter'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
