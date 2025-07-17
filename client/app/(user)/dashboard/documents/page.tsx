"use client"

import { useState } from 'react'
import { Plus, Search, FileText, Download, Edit, Trash2, Eye, Filter } from 'lucide-react'
import { Button } from '@/shared/components/atoms/ui/button'
import { Input } from '@/shared/components/atoms/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/atoms/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/atoms/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/atoms/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/atoms/ui/select'
import { Badge } from '@/shared/components/atoms/ui/badge'
import { DocumentForm } from './components/document-form'
import { DocumentDeleteDialog } from './components/document-delete-dialog'
import { DocumentPreview } from './components/document-preview'
import { useDocuments } from './hooks/use-documents'

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

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const { documents, isLoading, createDocument, updateDocument, deleteDocument } = useDocuments()

  // Mock data pour la démonstration
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'CV_2024.pdf',
      type: 'PDF',
      category: 'Professionnel',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
      status: 'Active',
      description: 'Curriculum vitae mis à jour'
    },
    {
      id: '2',
      name: 'Attestation_formation.pdf',
      type: 'PDF',
      category: 'Professionnel',
      size: '1.8 MB',
      uploadDate: '2024-01-10',
      status: 'Active',
      description: 'Certificat de formation React'
    },
    {
      id: '3',
      name: 'Facture_janvier.pdf',
      type: 'PDF',
      category: 'Administratif',
      size: '524 KB',
      uploadDate: '2024-01-05',
      status: 'Active'
    },
    {
      id: '4',
      name: 'Photo_profil.jpg',
      type: 'IMG',
      category: 'Personnel',
      size: '1.2 MB',
      uploadDate: '2023-12-20',
      status: 'Active',
      description: 'Photo de profil professionnelle'
    },
    {
      id: '5',
      name: 'Rapport_ancien.doc',
      type: 'DOC',
      category: 'Professionnel',
      size: '3.1 MB',
      uploadDate: '2023-11-15',
      status: 'Archivé',
      description: 'Ancien rapport de projet'
    }
  ]

  const displayDocuments = documents || mockDocuments

  // Filtrage des documents
  const filteredDocuments = displayDocuments.filter((doc: Document) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return '📄'
      case 'DOC': return '📝'
      case 'IMG': return '🖼️'
      case 'XLS': return '📊'
      default: return '📄'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Archivé': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const handleCreate = async (documentData: Partial<Document>) => {
    try {
      await createDocument(documentData)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Erreur lors de la création:', error)
    }
  }

  const handleEdit = async (documentData: Partial<Document>) => {
    if (!selectedDocument) return
    try {
      await updateDocument(selectedDocument.id, documentData)
      setIsEditDialogOpen(false)
      setSelectedDocument(null)
    } catch (error) {
      console.error('Erreur lors de la modification:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedDocument) return
    try {
      await deleteDocument(selectedDocument.id)
      setIsDeleteDialogOpen(false)
      setSelectedDocument(null)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handlePreview = (document: Document) => {
    setSelectedDocument(document)
    setIsPreviewOpen(true)
  }

  const handleDownload = (document: Document | { name: string }) => {
    // Simulation du téléchargement
    const link = window.document.createElement('a')
    link.href = '#' // URL fictive pour la démo
    link.download = document.name
    link.click()
    console.log('Téléchargement de:', document.name)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes Documents</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Gérez vos documents personnels et professionnels
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              <span className="sm:inline">Ajouter un document</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau document</DialogTitle>
              <DialogDescription>
                Téléchargez et organisez vos documents importants
              </DialogDescription>
            </DialogHeader>
            <DocumentForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total</p>
                <p className="text-lg sm:text-2xl font-bold">{displayDocuments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Actifs</p>
                <p className="text-lg sm:text-2xl font-bold">
                  {displayDocuments.filter((d: Document) => d.status === 'Active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Archivés</p>
                <p className="text-lg sm:text-2xl font-bold">
                  {displayDocuments.filter((d: Document) => d.status === 'Archivé').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Professionnels</p>
                <p className="text-lg sm:text-2xl font-bold">
                  {displayDocuments.filter((d: Document) => d.category === 'Professionnel').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="Personnel">Personnel</SelectItem>
                  <SelectItem value="Professionnel">Professionnel</SelectItem>
                  <SelectItem value="Administratif">Administratif</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Documents ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Vue mobile - Cards */}
          <div className="block sm:hidden space-y-4">
            {filteredDocuments.map((document: Document) => (
              <Card key={document.id} className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getTypeIcon(document.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{document.name}</p>
                        {document.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{document.description}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(document.status)}>
                        {document.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant="outline">{document.type}</Badge>
                      <span className="text-xs text-gray-500">{document.category}</span>
                      <span className="text-xs text-gray-500">{document.size}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(document)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(document)}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        DL
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDocument(document)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDocument(document)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Vue desktop - Table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Catégorie</TableHead>
                  <TableHead className="hidden lg:table-cell">Taille</TableHead>
                  <TableHead className="hidden xl:table-cell">Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document: Document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getTypeIcon(document.type)}</span>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{document.name}</p>
                          {document.description && (
                            <p className="text-sm text-gray-500 truncate">{document.description}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{document.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{document.category}</TableCell>
                    <TableCell className="hidden lg:table-cell">{document.size}</TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(document.status)}>
                        {document.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(document)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(document)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(document)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(document)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun document trouvé
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par ajouter votre premier document'
                }
              </p>
              {!searchTerm && filterCategory === 'all' && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un document
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le document</DialogTitle>
            <DialogDescription>
              Modifiez les informations de votre document
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <DocumentForm 
              initialData={selectedDocument}
              onSubmit={handleEdit}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DocumentDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        documentName={selectedDocument?.name || ''}
      />

      {/* Preview Dialog */}
      <DocumentPreview
        document={selectedDocument}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false)
          setSelectedDocument(null)
        }}
        onDownload={handleDownload}
      />
    </div>
  )
}
