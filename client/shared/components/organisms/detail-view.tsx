"use client";

import React from 'react';
import { useDetail } from '@/shared/hooks/useDetail';
import { Button } from '@/shared/components/atoms/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/atoms/ui/card';
import { Badge } from '@/shared/components/atoms/ui/badge';
import { Separator } from '@/shared/components/atoms/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2,
  Save,
  X
} from 'lucide-react';

export interface DetailField<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  editable?: boolean;
  type?: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'date';
  options?: { label: string; value: string }[];
  section?: string; // Grouper les champs par section
  badge?: boolean;
  hidden?: boolean;
}

interface DetailViewProps<T extends Record<string, unknown>> {
  id: string | number;
  fields: DetailField<T>[];
  title?: string;
  loading?: boolean;
  error?: Error | null;
  item?: T | null;
  editable?: boolean;
  deletable?: boolean;
  actions?: React.ReactNode;
  className?: string;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpdate?: (data: Partial<T>) => Promise<void>;
  fetchFn: (id: string | number) => Promise<T>;
  updateFn?: (id: string | number, data: Partial<T>) => Promise<T>;
  deleteFn?: (id: string | number) => Promise<void>;
}

export function DetailView<T extends Record<string, unknown>>({
  id,
  fields,
  title,
  loading: externalLoading,
  error: externalError,
  item: externalItem,
  editable = true,
  deletable = false,
  actions,
  className = "",
  onBack,
  onEdit,
  onDelete,
  onUpdate,
  fetchFn,
  updateFn,
  deleteFn,
}: DetailViewProps<T>) {
  const [editMode, setEditMode] = React.useState(false);
  const [editData, setEditData] = React.useState<Partial<T>>({});

  const detail = useDetail({
    fetchFn: (id: string) => fetchFn(String(id)),
    updateFn,
    deleteFn,
    onSuccess: (action, data) => {
      if (action === 'update' && data) {
        setEditMode(false);
        setEditData({});
        onUpdate?.(data);
      } else if (action === 'delete') {
        onDelete?.();
      }
    },
  });

  React.useEffect(() => {
    if (!externalItem) {
      detail.fetch(String(id));
    }
  }, [id, externalItem, detail]);

  const item = externalItem || detail.data;
  const loading = externalLoading || detail.loading;
  const error = externalError || (detail.error ? new Error(detail.error) : null);

  const handleEdit = () => {
    if (item) {
      const editableFields = fields.filter(f => f.editable);
      const initialData: Partial<T> = {};
      editableFields.forEach(field => {
        initialData[field.key] = item[field.key];
      });
      setEditData(initialData);
      setEditMode(true);
      onEdit?.();
    }
  };

  const handleSave = async () => {
    try {
      if (onUpdate) {
        await onUpdate(editData);
      } else if (updateFn) {
        await detail.update(String(id), editData);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData({});
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await detail.remove(String(id));
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  const handleFieldChange = (key: keyof T, value: unknown) => {
    setEditData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderField = (field: DetailField<T>) => {
    if (!item) return null;

    const value = editMode && field.editable ? editData[field.key] : item[field.key];
    const displayValue = field.render ? field.render(value, item) : String(value || '');

    if (editMode && field.editable) {
      switch (field.type) {
        case 'textarea':
          return (
            <textarea
              value={String(editData[field.key] || '')}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className="w-full p-2 border rounded-md resize-vertical min-h-[80px]"
              rows={3}
            />
          );
        case 'select':
          return (
            <select
              value={String(editData[field.key] || '')}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Sélectionner...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        default:
          return (
            <input
              type={field.type || 'text'}
              value={String(editData[field.key] || '')}
              onChange={(e) => {
                const newValue = field.type === 'number' ? Number(e.target.value) : e.target.value;
                handleFieldChange(field.key, newValue);
              }}
              className="w-full p-2 border rounded-md"
            />
          );
      }
    }

    if (field.badge) {
      return <Badge variant="outline">{displayValue}</Badge>;
    }

    return <span className="text-sm">{displayValue}</span>;
  };

  const groupedFields = React.useMemo(() => {
    const sections: Record<string, DetailField<T>[]> = {};
    
    fields.forEach(field => {
      const section = field.section || 'general';
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push(field);
    });

    return sections;
  }, [fields]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-600">Erreur: {error?.message || 'Une erreur est survenue'}</p>
        <Button 
          variant="outline" 
          onClick={() => detail.fetch(String(id))}
          className="mt-4"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">Élément non trouvé</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          {title && <h1 className="text-2xl font-bold">{title}</h1>}
        </div>

        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={detail.updating}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={detail.updating}
              >
                {detail.updating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Enregistrer
              </Button>
            </>
          ) : (
            <>
              {editable && updateFn && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              )}
              {deletable && deleteFn && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={detail.deleting}
                >
                  {detail.deleting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Supprimer
                </Button>
              )}
              {actions}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {Object.entries(groupedFields).map(([sectionName, sectionFields]) => (
          <Card key={sectionName}>
            <CardHeader>
              <CardTitle className="text-lg capitalize">
                {sectionName === 'general' ? 'Informations' : sectionName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sectionFields.map((field, index) => (
                <div key={String(field.key)} className={field.hidden ? 'hidden md:block' : ''}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="sm:w-1/3">
                      <label className="text-sm font-medium text-muted-foreground">
                        {field.label}
                      </label>
                    </div>
                    <div className="sm:w-2/3">
                      {renderField(field)}
                    </div>
                  </div>
                  {index < sectionFields.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
