"use client"

import React, { useCallback, useState } from 'react'
import { Upload, AlertCircle, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface FileDropZoneProps {
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
  accept?: string
  maxSize?: number // en MB
  currentFile?: File | null
  disabled?: boolean
  error?: string
  className?: string
}

export function FileDropZone({
  onFileSelect,
  onFileRemove,
  accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx",
  maxSize = 10, // 10MB par défaut
  currentFile,
  disabled = false,
  error,
  className
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragError, setDragError] = useState<string | null>(null)

  const validateFile = useCallback((file: File): string | null => {
    // Vérification de la taille
    if (file.size > maxSize * 1024 * 1024) {
      return `Le fichier doit faire moins de ${maxSize}MB`
    }

    // Vérification du type si accept est spécifié
    if (accept && accept !== "*") {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const isValidType = acceptedTypes.some(acceptedType => {
        if (acceptedType.startsWith('.')) {
          return file.name.toLowerCase().endsWith(acceptedType.toLowerCase())
        }
        if (acceptedType.includes('/*')) {
          const baseType = acceptedType.split('/')[0]
          return file.type.startsWith(baseType)
        }
        return file.type === acceptedType
      })

      if (!isValidType) {
        return 'Type de fichier non autorisé'
      }
    }

    return null
  }, [accept, maxSize])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setDragError(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setDragError(null)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    const file = files[0] // Prendre seulement le premier fichier
    const validationError = validateFile(file)

    if (validationError) {
      setDragError(validationError)
      return
    }

    onFileSelect(file)
  }, [disabled, validateFile, onFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const validationError = validateFile(file)

    if (validationError) {
      setDragError(validationError)
      return
    }

    setDragError(null)
    onFileSelect(file)
  }, [validateFile, onFileSelect])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf': return '📄'
      case 'doc':
      case 'docx': return '📝'
      case 'xls':
      case 'xlsx': return '📊'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️'
      default: return '📄'
    }
  }

  const displayError = error || dragError

  if (currentFile) {
    return (
      <div className={cn(
        "border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6",
        "bg-gray-50 transition-colors",
        className
      )}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl sm:text-2xl">{getFileIcon(currentFile.name)}</span>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{currentFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(currentFile.size)}</p>
            </div>
          </div>
          {onFileRemove && (
            <button
              type="button"
              onClick={onFileRemove}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors self-start sm:self-auto"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {displayError && (
          <div className="mt-3 flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{displayError}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-200",
          "cursor-pointer hover:border-blue-400 hover:bg-blue-50/50",
          {
            "border-blue-500 bg-blue-50 scale-[1.02]": isDragOver && !disabled,
            "border-gray-300 bg-gray-50": !isDragOver && !disabled,
            "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60": disabled,
            "border-red-300 bg-red-50": displayError
          }
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="space-y-3 sm:space-y-4">
          <div className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full flex items-center justify-center",
            {
              "bg-blue-100": !displayError,
              "bg-red-100": displayError
            }
          )}>
            {displayError ? (
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            ) : (
              <Upload className={cn(
                "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
                isDragOver ? "text-blue-600" : "text-gray-400"
              )} />
            )}
          </div>
          
          <div>
            <h3 className={cn(
              "font-medium mb-1 text-sm sm:text-base",
              {
                "text-gray-900": !displayError,
                "text-red-900": displayError
              }
            )}>
              {isDragOver 
                ? "Déposez le fichier ici" 
                : displayError 
                ? "Erreur de fichier"
                : "Glissez-déposez votre fichier"
              }
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              ou <span className="text-blue-600 hover:text-blue-700 font-medium">cliquez pour parcourir</span>
            </p>
          </div>
          
          <div className="text-xs text-gray-400 space-y-1">
            <p className="hidden sm:block">Formats acceptés: PDF, DOC, XLS, Images</p>
            <p className="sm:hidden">PDF, DOC, XLS, Images</p>
            <p>Taille max: {maxSize}MB</p>
          </div>
        </div>
      </div>

      {displayError && (
        <div className="mt-3 flex items-center gap-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{displayError}</span>
        </div>
      )}
    </div>
  )
}
