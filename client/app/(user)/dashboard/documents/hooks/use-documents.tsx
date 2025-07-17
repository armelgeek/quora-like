"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface Document {
  id: string
  name: string
  type: 'PDF' | 'DOC' | 'IMG' | 'XLS'
  category: 'Personnel' | 'Professionnel' | 'Administratif' | 'Autre'
  size: string
  uploadDate: string
  status: 'Active' | 'Archivé'
  description?: string
}

interface UseDocumentsReturn {
  documents: Document[] | null
  isLoading: boolean
  error: string | null
  createDocument: (data: Partial<Document>) => Promise<void>
  updateDocument: (id: string, data: Partial<Document>) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  refreshDocuments: () => Promise<void>
}

// Mock service pour la démonstration
class DocumentsService {
  private documents: Document[] = []

  async getAll(): Promise<Document[]> {
    // Simule un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1000))
    return this.documents
  }

  async create(data: Partial<Document>): Promise<Document> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newDocument: Document = {
      id: Date.now().toString(),
      name: data.name || 'Document sans nom',
      type: this.getFileType(data.name || ''),
      category: data.category || 'Autre',
      size: this.generateRandomSize(),
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      description: data.description,
    }
    
    this.documents.push(newDocument)
    return newDocument
  }

  async update(id: string, data: Partial<Document>): Promise<Document> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = this.documents.findIndex(doc => doc.id === id)
    if (index === -1) {
      throw new Error('Document non trouvé')
    }
    
    this.documents[index] = { ...this.documents[index], ...data }
    return this.documents[index]
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = this.documents.findIndex(doc => doc.id === id)
    if (index === -1) {
      throw new Error('Document non trouvé')
    }
    
    this.documents.splice(index, 1)
  }

  private getFileType(filename: string): 'PDF' | 'DOC' | 'IMG' | 'XLS' {
    const extension = filename.split('.').pop()?.toLowerCase()
    
    switch (extension) {
      case 'pdf':
        return 'PDF'
      case 'doc':
      case 'docx':
        return 'DOC'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'IMG'
      case 'xls':
      case 'xlsx':
        return 'XLS'
      default:
        return 'PDF'
    }
  }

  private generateRandomSize(): string {
    const sizes = ['1.2 MB', '2.5 MB', '800 KB', '3.1 MB', '1.8 MB', '654 KB']
    return sizes[Math.floor(Math.random() * sizes.length)]
  }
}

const documentsService = new DocumentsService()

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshDocuments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const docs = await documentsService.getAll()
      setDocuments(docs)
    } catch (err) {
      setError('Erreur lors du chargement des documents')
      console.error('Erreur:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const createDocument = async (data: Partial<Document>) => {
    try {
      await documentsService.create(data)
      await refreshDocuments()
      toast.success('Document ajouté avec succès')
    } catch (err) {
      toast.error('Erreur lors de l\'ajout du document')
      throw err
    }
  }

  const updateDocument = async (id: string, data: Partial<Document>) => {
    try {
      await documentsService.update(id, data)
      await refreshDocuments()
      toast.success('Document modifié avec succès')
    } catch (err) {
      toast.error('Erreur lors de la modification')
      throw err
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      await documentsService.delete(id)
      await refreshDocuments()
      toast.success('Document supprimé avec succès')
    } catch (err) {
      toast.error('Erreur lors de la suppression')
      throw err
    }
  }

  // Chargement initial
  useEffect(() => {
    refreshDocuments()
  }, [])

  return {
    documents,
    isLoading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    refreshDocuments,
  }
}
