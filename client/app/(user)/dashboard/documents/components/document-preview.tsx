"use client"

import React, { useState } from 'react'
import { Download, X, FileText, FileSpreadsheet, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/atoms/ui/dialog'
import { Button } from '@/shared/components/atoms/ui/button'
import { Badge } from '@/shared/components/atoms/ui/badge'

interface DocumentData {
  id: string
  name: string
  type: 'PDF' | 'DOC' | 'IMG' | 'XLS'
  category: string
  size: string
  uploadDate: string
  status: string
  description?: string
  url?: string // URL pour la prévisualisation
}

interface DocumentPreviewProps {
  document: DocumentData | null
  isOpen: boolean
  onClose: () => void
  onDownload?: (document: DocumentData) => void
}

export function DocumentPreview({ document, isOpen, onClose, onDownload }: DocumentPreviewProps) {
  const [imageError, setImageError] = useState(false)

  if (!document) return null

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-8 h-8 text-red-600" />
      case 'DOC': return <FileText className="w-8 h-8 text-blue-600" />
      case 'IMG': return <ImageIcon className="w-8 h-8 text-green-600" />
      case 'XLS': return <FileSpreadsheet className="w-8 h-8 text-orange-600" />
      default: return <FileText className="w-8 h-8 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Archivé': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const mockImageUrl = document.type === 'IMG' 
    ? `https://picsum.photos/800/600?random=${document.id}` 
    : null

  const renderPreview = () => {
    if (document.type === 'IMG' && !imageError) {
      return (
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
          <Image
            src={mockImageUrl || '/placeholder-image.jpg'}
            alt={document.name}
            width={800}
            height={600}
            className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg"
            onError={() => setImageError(true)}
          />
        </div>
      )
    }

    if (document.type === 'PDF') {
      return (
        <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px]">
          <FileText className="w-16 h-16 text-red-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aperçu PDF</h3>
          <p className="text-gray-600 text-center mb-4">
            La prévisualisation PDF complète sera disponible prochainement.
          </p>
          <Button onClick={() => onDownload?.(document)} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Télécharger pour voir
          </Button>
        </div>
      )
    }

    return (
      <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px]">
        {getTypeIcon(document.type)}
        <h3 className="text-lg font-medium text-gray-900 mb-2 mt-4">Aperçu non disponible</h3>
        <p className="text-gray-600 text-center mb-4">
          Ce type de fichier ne peut pas être prévisualisé dans le navigateur.
        </p>
        <Button onClick={() => onDownload?.(document)} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Télécharger le fichier
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-semibold pr-8">
              Aperçu du document
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-8 w-8 p-0 absolute right-4 top-4"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Informations du document */}
        <div className="border-b pb-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-shrink-0">
              {getTypeIcon(document.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 break-words">
                {document.name}
              </h2>
              {document.description && (
                <p className="text-gray-600 mt-1 text-sm sm:text-base">{document.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
                <Badge variant="outline">{document.type}</Badge>
                <Badge className={getStatusColor(document.status)}>
                  {document.status}
                </Badge>
                <span className="text-xs sm:text-sm text-gray-500">
                  Catégorie: {document.category}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  Taille: {document.size}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  Ajouté le {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Prévisualisation */}
        <div className="space-y-4">
          {renderPreview()}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Fermer
          </Button>
          {onDownload && (
            <Button onClick={() => onDownload(document)} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
