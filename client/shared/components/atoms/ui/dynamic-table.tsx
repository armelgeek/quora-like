'use client';

import React from 'react';
import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/atoms/ui/badge';
import { Button } from '@/shared/components/atoms/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/atoms/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { FieldConfig, AdminConfig } from '@/shared/lib/admin/admin-generator';
import { toast } from 'sonner';

export interface AdminConfigWithParseEdit<T = Record<string, unknown>> extends AdminConfig {
  parseEditItem?: (item: Record<string, unknown>) => T;
}

export interface AdminConfigWithLegacyParse<T = Record<string, unknown>> extends AdminConfigWithParseEdit<T> {
  parseData?: (item: Record<string, unknown>) => T;
}

export function generateTableColumns<T extends Record<string, unknown>>(
  config: AdminConfigWithLegacyParse<T>,
  onEdit?: (item: T) => void,
  onDelete?: (item: T) => void
): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = [];

  //console.log('[generateTableColumns] Config fields:', config.fields);

  config.fields
    .filter(field => field.display?.showInTable !== false)
    .sort((a, b) => (a.display?.order || 0) - (b.display?.order || 0))
    .forEach(field => {
      // console.log(`[generateTableColumns] Adding column for field: ${field.key}, type: ${field.type}`);
      columns.push({
        accessorKey: field.key,
        header: field.label,
        cell: ({ row }) => {
          let value = row.getValue(field.key);
          // Fallback : si la valeur n'est pas trouvée, on tente de la récupérer dans row.original via dot notation (clé simple ou imbriquée)
          if ((value === undefined || value === null) && row.original && typeof row.original === 'object') {
            const keys = field.key.split('.');
            let nested: unknown = row.original;
            for (const k of keys) {
              if (nested && typeof nested === 'object' && k in nested) {
                nested = (nested as Record<string, unknown>)[k];
              } else {
                nested = undefined;
                break;
              }
            }
            value = nested;
          }
          return renderCellValue(value, field);
        },
      });
    });

  // Ajouter la colonne d'actions si des actions sont configurées
  if (config.actions.update || config.actions.delete) {
    columns.push({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {config.actions.update && onEdit && (
                <DropdownMenuItem onClick={() => {
                  let parsed: T | undefined;
                  // Utilise parseEditItem (nouveau standard), sinon parseData (legacy)
                  const parseFn = config.parseEditItem || config.parseData;
                  if (parseFn) {
                    try {
                      parsed = parseFn(item);
                    } catch (e) {
                      toast.error('Erreur lors du parsing de l’item.');
                      console.error('parseEditItem/parseData error:', e, item);
                      return;
                    }
                  } else {
                    parsed = item as T;
                  }
                  onEdit(parsed);
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
              )}
              {config.actions.delete && onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(item)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return columns;
}

function renderCellValue(value: unknown, field: FieldConfig): React.ReactNode {

  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">-</span>;
  }

  switch (field.type) {
    case 'boolean':
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Oui' : 'Non'}
        </Badge>
      );

    case 'date':
      try {
        let date: Date;
        if (value instanceof Date) {
          date = value;
        } else if (typeof value === 'string' || typeof value === 'number') {
          date = new Date(value);
        } else {
          return <span className="text-muted-foreground">Date invalide</span>;
        }
        if (isNaN(date.getTime())) {
          return <span className="text-muted-foreground">Date invalide</span>;
        }
        const formattedDate = format(date, 'dd/MM/yyyy');
        return formattedDate;
      } catch (error) {
        console.error('Error formatting date:', error, value);
        return <span className="text-muted-foreground">Date invalide</span>;
      }

    case 'email':
      return (
        <a
          href={`mailto:${value}`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {value as string}
        </a>
      );

    case 'url':
      return (
        <a
          href={value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {value as string}
        </a>
      );

    case 'image':
      return (
        <div className="flex items-center">
          <Image
            src={value as string}
            alt="Image"
            width={32}
            height={32}
            className="h-8 w-8 rounded object-cover"
            onError={() => {
              console.error('Image failed to load:', value);
            }}
          />
        </div>
      );

    case 'textarea':
    case 'rich-text':
      const text = value as string;
      return (
        <div className="max-w-xs truncate" title={text}>
          {text}
        </div>
      );

    case 'select':
      return (
        <Badge variant="outline">
          {value as string}
        </Badge>
      );

    case 'number':
      return (
        <span className="font-mono">
          {typeof value === 'number' ? value.toLocaleString() : String(value || '')}
        </span>
      );

    case 'relation':
      return (
        <Badge variant="outline">
          {value as string}
        </Badge>
      );

    default: {
      // Handle arrays and objects for admin table rendering
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          const arrayDisplayField = field.display?.arrayDisplayField;
          if (arrayDisplayField) {
            const values = value
              .map((v: Record<string, unknown>) =>
                arrayDisplayField in v && v[arrayDisplayField] ? String(v[arrayDisplayField]) : null
              )
              .filter(Boolean);
            if (values.length > 0) {
              return <span>{values.join(', ')}</span>;
            }
          }
          // fallback: show a dash if no value
          return <span className="text-muted-foreground">-</span>;
        }
        // array of primitives (robust: filter null/undefined/falsy except 0)
        const filtered = value.filter(v => v !== null && v !== undefined && v !== '');
        if (filtered.length > 0) {
          return <span>{filtered.map(String).join(', ')}</span>;
        }
        return <span className="text-muted-foreground">-</span>;
      }
      if (typeof value === 'object') {
        return <span className="text-muted-foreground">-</span>;
      }
      return <span>{String(value)}</span>;
    }
  }
}

export { renderCellValue };
